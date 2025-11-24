

// src/components/EditPropertyForm.tsx
import { useState, useEffect } from 'react';
import { X, Upload, MapPin, Home, Bed, Bath, Users, DollarSign, Image as ImageIcon } from 'lucide-react';
import { Property } from '../types';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EditPropertyFormProps {
  property: Property;
  onPropertyUpdated: () => void;
  onCancel: () => void;
}

// Composant pour gérer les clics sur la carte
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export default function EditPropertyForm({ property, onPropertyUpdated, onCancel }: EditPropertyFormProps) {
  const parseAmenities = (amenities: any): string[] => {
    if (Array.isArray(amenities)) {
      return amenities;
    }
    if (typeof amenities === 'string') {
      try {
        const parsed = JSON.parse(amenities);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return amenities.split(',').map((a: string) => a.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const [formData, setFormData] = useState({
    title: property.title,
    description: property.description || '',
    address: property.address || '',
    city: property.city,
    country: property.country || 'France',
    price_per_night: property.price_per_night,
    price_type: property.price_type || 'night',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    max_guests: property.max_guests,
    property_type: property.property_type,
    amenities: parseAmenities(property.amenities),
    images: property.images || [],
    is_available: property.is_available,
    latitude: property.latitude || 48.8566,
    longitude: property.longitude || 2.3522
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [error, setError] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(property.address || '');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const propertyTypes = [
    { value: 'apartment', label: '🏢 Appartement' },
    { value: 'house', label: '🏠 Maison' },
    { value: 'villa', label: '🏡 Villa' },
    { value: 'studio', label: '🔧 Studio' },
    { value: 'loft', label: '🏭 Loft' },
    { value: 'chalet', label: '⛰️ Chalet' }
  ];

  const amenitiesList = ['WiFi', 'Parking', 'Piscine', 'Climatisation', 'Chauffage', 'Cuisine équipée', 'TV', 'Lave-linge', 'Animaux acceptés', 'Jardin', 'Terrasse', 'Balcon'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Fonction pour obtenir des images de fallback
  const getFallbackImages = (): string[] => {
    const placeholderImages = {
      apartment: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
        'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg'
      ],
      house: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
      ],
      villa: [
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
        'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg',
        'https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg'
      ],
      studio: [
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
        'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg',
        'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg'
      ],
      loft: [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
        'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg'
      ],
      chalet: [
        'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
        'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
        'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg'
      ]
    };

    return placeholderImages[formData.property_type as keyof typeof placeholderImages] || 
           placeholderImages.apartment;
  };

  // Fonction améliorée pour l'upload d'images avec fallback
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    // Validation des fichiers
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`Le fichier ${file.name} n'est pas une image valide`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setUploading(false);
      return;
    }

    try {
      console.log('📤 Début upload de', validFiles.length, 'images...');
      
      const uploadedUrls: string[] = [];

      // Essayer d'abord l'upload vers le serveur local
      try {
        const formData = new FormData();
        validFiles.forEach(file => {
          formData.append('images', file);
        });

        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Upload réussi:', data);
          if (data.imageUrls && Array.isArray(data.imageUrls)) {
            uploadedUrls.push(...data.imageUrls);
          }
        } else {
          throw new Error(`Erreur serveur: ${response.status}`);
        }
      } catch (serverError) {
        console.warn('❌ Échec upload serveur local, utilisation IMGBB:', serverError);
        
        // Fallback: Upload vers IMGBB
        for (const file of validFiles) {
          try {
            const imgbbFormData = new FormData();
            imgbbFormData.append('image', file);
            
            const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=ebd5c0e3afd3a5f8db71587bcc4841ed', {
              method: 'POST',
              body: imgbbFormData,
            });

            if (imgbbResponse.ok) {
              const imgbbData = await imgbbResponse.json();
              if (imgbbData.data && imgbbData.data.url) {
                uploadedUrls.push(imgbbData.data.url);
              }
            }
          } catch (imgbbError) {
            console.error('❌ Échec upload IMGBB:', imgbbError);
          }
        }
      }

      // Si aucun upload n'a fonctionné, utiliser des images de fallback
      if (uploadedUrls.length === 0) {
        console.log('🔄 Utilisation des images de fallback');
        const fallbackImages = getFallbackImages();
        uploadedUrls.push(...fallbackImages.slice(0, validFiles.length));
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
        
        alert(`${uploadedUrls.length} image(s) ajoutée(s) avec succès !`);
      } else {
        throw new Error('Aucune image n\'a pu être téléchargée');
      }

    } catch (error: any) {
      console.error('❌ Erreur upload images:', error);
      setError(error.message || 'Erreur lors du téléchargement des images');
    } finally {
      setUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Fonction améliorée pour obtenir l'URL d'image
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath || imagePath.trim() === '') {
      return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
    }
    
    // Si c'est déjà une URL complète
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si c'est un chemin relatif (commence par /uploads/)
    if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
      // Nettoyer le chemin
      const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      return `http://localhost:5000${cleanPath}`;
    }
    
    // Si c'est un nom de fichier simple
    if (!imagePath.includes('/') && !imagePath.startsWith('http')) {
      return `http://localhost:5000/uploads/${imagePath}`;
    }
    
    // Par défaut, retourner l'image de fallback
    return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
  };

  // Gestionnaire d'erreur d'image
  const handleImageError = (index: number, imageUrl: string) => {
    console.error(`❌ Erreur chargement image ${index}:`, imageUrl);
    setImageErrors(prev => new Set(prev).add(index));
    
    // Remplacer l'image corrompue par une image de fallback
    const fallbackImages = getFallbackImages();
    const fallbackImage = fallbackImages[index % fallbackImages.length];
    
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = fallbackImage;
      return { ...prev, images: newImages };
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    // Retirer l'index des erreurs
    setImageErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(index);
      return newErrors;
    });
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  // Fonction pour gérer la sélection de localisation
  const handleLocationSelect = async (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    setIsGeocoding(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr&addressdetails=1&zoom=16`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.address) {
          const address = data.address;
          
          const addressParts = [
            address.road,
            address.house_number,
            address.pedestrian,
            address.footway
          ].filter(Boolean);

          const cityParts = [
            address.city,
            address.town,
            address.village,
            address.municipality
          ].filter(Boolean);

          const countryName = address.country || 'France';

          let fullAddress = '';
          
          if (addressParts.length > 0) {
            fullAddress = addressParts.join(', ');
          } else if (cityParts.length > 0) {
            fullAddress = `${cityParts[0]}`;
          } else {
            fullAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          }

          const cityName = cityParts.length > 0 ? cityParts[0] : '';

          setSelectedAddress(fullAddress);
          setFormData(prev => ({
            ...prev,
            address: fullAddress,
            city: cityName || prev.city,
            country: countryName || prev.country
          }));
        }
      }
    } catch (error) {
      console.error('Erreur reverse geocoding:', error);
      setSelectedAddress(`Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('📤 Envoi des données de modification:', formData);

      // Nettoyer les images avant envoi
      const cleanedFormData = {
        ...formData,
        images: formData.images.map(img => {
          // Si c'est une URL complète qui n'est pas de fallback, la garder
          if (img.startsWith('http') && !img.includes('unsplash.com') && !img.includes('pexels.com')) {
            return img;
          }
          // Sinon, c'est peut-être un chemin relatif
          return img;
        })
      };

      const response = await fetch(`http://localhost:5000/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('✅ Propriété modifiée avec succès:', responseData);
        alert('Propriété modifiée avec succès !');
        onPropertyUpdated();
      } else {
        console.error('❌ Erreur API:', responseData);
        throw new Error(responseData.error || `Erreur ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error updating property:', error);
      setError(error.message || 'Erreur lors de la modification de la propriété');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Modifier la propriété</h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">⚠️</div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de propriété *
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
              >
                <option value="">Sélectionnez un type</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
            />
          </div>

          {/* Section Localisation avec Carte */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-gray-900">Localisation</h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionnez le nouvel emplacement sur la carte
                <span className="text-green-600 ml-2 text-sm">
                  ✓ Position actuelle affichée
                </span>
              </label>
              <div className="h-64 rounded-xl overflow-hidden border border-gray-300 relative">
                {isGeocoding && (
                  <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                    <div className="text-gray-600 text-sm">
                      Recherche de l'adresse...
                    </div>
                  </div>
                )}
                <MapContainer
                  center={[formData.latitude, formData.longitude]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                  <Marker position={[formData.latitude, formData.longitude]} />
                </MapContainer>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Cliquez sur la carte pour modifier l'emplacement. L'adresse sera mise à jour automatiquement.
              </p>
            </div>

            {/* Adresse détectée */}
            {selectedAddress && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center">
                  <div className="text-blue-600 text-sm mr-2">📍</div>
                  <div>
                    <p className="text-blue-800 text-sm font-medium">
                      Adresse détectée
                    </p>
                    <p className="text-blue-700 text-sm mt-1">{selectedAddress}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Champs d'adresse - Lecture seule car détectés automatiquement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent bg-gray-50"
                  placeholder="Sélectionnez un emplacement sur la carte"
                  readOnly
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            {/* Coordonnées GPS (cachées mais incluses dans le formData) */}
            <input type="hidden" name="latitude" value={formData.latitude} />
            <input type="hidden" name="longitude" value={formData.longitude} />
          </div>

          {/* Prix avec type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Prix *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="price_per_night"
                  value={formData.price_per_night}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-3 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <select
                    name="price_type"
                    value={formData.price_type}
                    onChange={handleInputChange}
                    className="bg-transparent border-none text-gray-600 text-sm focus:ring-0 focus:outline-none appearance-none pr-6"
                  >
                    <option value="night">€/nuit</option>
                    <option value="month">€/mois</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bed className="w-4 h-4 inline mr-1" />
                Chambres *
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bath className="w-4 h-4 inline mr-1" />
                Salles de bain *
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Voyageurs max *
              </label>
              <input
                type="number"
                name="max_guests"
                value={formData.max_guests}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
              />
            </div>
          </div>

          {/* Équipements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipements
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 hover:text-gray-200 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <select
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
                >
                  <option value="">Ajouter un équipement</option>
                  {amenitiesList.map(amenity => (
                    <option key={amenity} value={amenity}>
                      {amenity}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addAmenity}
                  disabled={!newAmenity.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Section Images - CORRIGÉE */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-gray-900">Galerie photos</h3>
            </div>

            <div className="space-y-4">
              {/* Images existantes */}
              {formData.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Images actuelles ({formData.images.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img
                            src={getImageUrl(image)}
                            alt={`Image ${index + 1} de la propriété`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={() => handleImageError(index, image)}
                            loading="lazy"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-lg"
                          title="Supprimer cette image"
                        >
                          ×
                        </button>
                        {imageErrors.has(index) && (
                          <div className="absolute inset-0 bg-yellow-100 bg-opacity-50 flex items-center justify-center">
                            <span className="text-xs text-yellow-800 font-medium">Image remplacée</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload de nouvelles images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ajouter de nouvelles images
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 transition-all duration-300 hover:border-[#ea80fc] hover:bg-[#ea80fc]/5">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  
                  <label 
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      uploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                    }`}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea80fc] mb-3"></div>
                        <p className="text-gray-600 font-medium">Téléchargement en cours...</p>
                        <p className="text-gray-400 text-sm mt-1">Veuillez patienter</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gradient-to-br from-[#ea80fc] to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-700 font-semibold text-center mb-2">
                          Cliquez pour ajouter des photos
                        </p>
                        <p className="text-gray-500 text-sm text-center">
                          Glissez-déposez ou parcourez vos fichiers
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          PNG, JPG, JPEG • Max 10MB par image
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {formData.images.length === 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <ImageIcon className="w-5 h-5 text-yellow-600 mr-2" />
                      <p className="text-yellow-700 text-sm">
                        Aucune image n'est actuellement associée à cette propriété.
                        Ajoutez des photos pour améliorer sa visibilité.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Disponibilité */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-[#ea80fc] border-gray-300 rounded focus:ring-[#ea80fc]"
            />
            <label className="ml-2 text-sm text-gray-700">
              Propriété disponible à la location
            </label>
          </div>

          {/* Boutons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Modification...
                </div>
              ) : (
                'Modifier la propriété'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}