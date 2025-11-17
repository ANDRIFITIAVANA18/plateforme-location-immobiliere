

// src/components/EditPropertyForm.tsx
import { useState, useEffect } from 'react';
import { X, Upload, MapPin, Home, Bed, Bath, Users, DollarSign } from 'lucide-react';
import { Property } from '../types';

interface EditPropertyFormProps {
  property: Property;
  onPropertyUpdated: () => void;
  onCancel: () => void;
}

export default function EditPropertyForm({ property, onPropertyUpdated, onCancel }: EditPropertyFormProps) {

 const parseAmenities = (amenities: any): string[] => {
    if (Array.isArray(amenities)) {
      return amenities;
    }
    if (typeof amenities === 'string') {
      try {
        // Essayer de parser comme JSON
        const parsed = JSON.parse(amenities);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // Si c'est une string simple, la convertir en tableau
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
    price_type: property.price_type || 'night', // AJOUT DU PRICE_TYPE
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    max_guests: property.max_guests,
    property_type: property.property_type,
   amenities: parseAmenities(property.amenities), // CORRECTION ICI
    images: property.images || [],
    is_available: property.is_available
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [error, setError] = useState('');

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

  // Fonction corrigée pour l'upload d'images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i]); // 'image' au singulier (comme dans AddPropertyForm)
      }

      console.log('📤 Début upload images...');
      
      const response = await fetch('http://localhost:5000/api/upload', { // URL corrigée
        method: 'POST',
        body: formData, // Pas de headers pour FormData
      });

      console.log('📨 Réponse upload:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Images uploadées:', data.imageUrls);
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.imageUrls]
        }));
        
        alert(`${data.imageUrls.length} image(s) téléchargée(s) avec succès !`);
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur upload:', errorText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Erreur lors du téléchargement des images. Vérifiez votre connexion.');
    } finally {
      setUploading(false);
      // Reset le input file
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Fonction pour obtenir l'URL d'image correcte
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
    }
    
    // Si l'image commence déjà par http, l'utiliser directement
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si c'est un chemin relatif, ajouter l'URL de base
    if (imagePath.startsWith('/')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    // Si c'est déjà une URL complète mais sans http
    if (imagePath.includes('pexels.com') || imagePath.includes('unsplash.com')) {
      return imagePath;
    }
    
    // Par défaut, ajouter l'URL de base
    return `http://localhost:5000/${imagePath}`;
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('📤 Envoi des données:', formData);

      const response = await fetch(`http://localhost:5000/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('✅ Propriété modifiée:', responseData);
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
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

          {/* Adresse */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
              />
            </div>
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

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images ({formData.images.length})
            </label>
            <div className="space-y-4">
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImageUrl(image)}
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('❌ Erreur chargement image:', image);
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                  uploading 
                    ? 'border-[#ea80fc] bg-[#ea80fc]/10' 
                    : 'border-gray-300 hover:border-[#ea80fc] hover:bg-[#ea80fc]/5'
                }`}>
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea80fc] mb-2"></div>
                      <span className="text-sm text-gray-600">Téléchargement en cours...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Cliquez pour ajouter des images</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG jusqu'à 10MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
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
              {loading ? 'Modification...' : 'Modifier la propriété'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}