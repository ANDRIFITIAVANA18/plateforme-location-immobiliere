
// // // // // src/components/AddPropertyForm.tsx
// // // // import { useState, useRef } from 'react';
// // // // import { X } from 'lucide-react';

// // // // interface AddPropertyFormProps {
// // // //   ownerId: string;
// // // //   onPropertyAdded: () => void;
// // // //   onCancel: () => void;
// // // // }

// // // // interface UploadedImage {
// // // //   file: File;
// // // //   preview: string;
// // // //   id: string;
// // // // }

// // // // export default function AddPropertyForm({ ownerId, onPropertyAdded, onCancel }: AddPropertyFormProps) {
// // // //   const [title, setTitle] = useState('');
// // // //   const [description, setDescription] = useState('');
// // // //   const [address, setAddress] = useState('');
// // // //   const [city, setCity] = useState('');
// // // //   const [country, setCountry] = useState('France');
// // // //   const [price, setPrice] = useState(100);
// // // //   const [priceType, setPriceType] = useState<'night' | 'month'>('night');
// // // //   const [bedrooms, setBedrooms] = useState(1);
// // // //   const [bathrooms, setBathrooms] = useState(1);
// // // //   const [maxGuests, setMaxGuests] = useState(2);
// // // //   const [propertyType, setPropertyType] = useState('apartment');
// // // //   const [amenities, setAmenities] = useState('');
// // // //   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
// // // //   const [error, setError] = useState('');
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const [isDragging, setIsDragging] = useState(false);
  
// // // //   const fileInputRef = useRef<HTMLInputElement>(null);

// // // //   const handleImageUpload = (files: FileList | null) => {
// // // //     if (!files) return;

// // // //     const newImages: UploadedImage[] = [];
    
// // // //     Array.from(files).forEach(file => {
// // // //       if (file.type.startsWith('image/')) {
// // // //         // Vérifier la taille du fichier (max 10MB)
// // // //         if (file.size > 10 * 1024 * 1024) {
// // // //           setError(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
// // // //           return;
// // // //         }
// // // //         const preview = URL.createObjectURL(file);
// // // //         newImages.push({
// // // //           file,
// // // //           preview,
// // // //           id: Math.random().toString(36).substr(2, 9)
// // // //         });
// // // //       }
// // // //     });

// // // //     setUploadedImages(prev => [...prev, ...newImages]);
// // // //     setError(''); // Clear any previous errors
// // // //   };

// // // //   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // //     handleImageUpload(e.target.files);
// // // //     // Reset the input to allow uploading the same file again
// // // //     if (e.target) {
// // // //       e.target.value = '';
// // // //     }
// // // //   };

// // // //   const handleDragOver = (e: React.DragEvent) => {
// // // //     e.preventDefault();
// // // //     setIsDragging(true);
// // // //   };

// // // //   const handleDragLeave = (e: React.DragEvent) => {
// // // //     e.preventDefault();
// // // //     setIsDragging(false);
// // // //   };

// // // //   const handleDrop = (e: React.DragEvent) => {
// // // //     e.preventDefault();
// // // //     setIsDragging(false);
// // // //     handleImageUpload(e.dataTransfer.files);
// // // //   };

// // // //   const removeImage = (id: string) => {
// // // //     setUploadedImages(prev => {
// // // //       const imageToRemove = prev.find(img => img.id === id);
// // // //       if (imageToRemove) {
// // // //         URL.revokeObjectURL(imageToRemove.preview);
// // // //       }
// // // //       return prev.filter(img => img.id !== id);
// // // //     });
// // // //   };

// // // //   const handleFileSelect = () => {
// // // //     fileInputRef.current?.click();
// // // //   };

// // // //   // Fonction pour uploader les images vers le serveur
// // // //   const uploadImagesToServer = async (images: UploadedImage[]): Promise<string[]> => {
// // // //     if (images.length === 0) {
// // // //       return ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// // // //     }

// // // //     const uploadedUrls: string[] = [];
    
// // // //     // Méthode optimisée: envoyer toutes les images en une seule requête
// // // //     try {
// // // //       const formData = new FormData();
      
// // // //       // Ajouter TOUTES les images avec la clé 'images'
// // // //       images.forEach(image => {
// // // //         formData.append('images', image.file);
// // // //       });
      
// // // //       console.log('📤 Upload de', images.length, 'images vers /api/upload');
      
// // // //       const response = await fetch('http://localhost:5000/api/upload', {
// // // //         method: 'POST',
// // // //         body: formData, // Pas de Content-Type pour FormData
// // // //       });

// // // //       if (!response.ok) {
// // // //         const errorText = await response.text();
// // // //         console.error('❌ Erreur upload:', errorText);
// // // //         throw new Error(`Erreur lors de l'upload des images: ${response.status} ${response.statusText}`);
// // // //       }

// // // //       const result = await response.json();
// // // //       console.log('✅ Réponse upload:', result);
      
// // // //       if (result.imageUrls && result.imageUrls.length > 0) {
// // // //         uploadedUrls.push(...result.imageUrls);
// // // //       } else {
// // // //         throw new Error('Aucune URL d\'image retournée par le serveur');
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur upload images:', error);
      
// // // //       // Fallback: essayer image par image avec l'ancienne méthode
// // // //       console.log('🔄 Tentative de fallback: upload image par image...');
      
// // // //       for (const image of images) {
// // // //         try {
// // // //           const fallbackFormData = new FormData();
// // // //           fallbackFormData.append('image', image.file); // Utiliser 'image' au singulier pour la compatibilité
          
// // // //           console.log('📤 Fallback upload de:', image.file.name);
          
// // // //           const fallbackResponse = await fetch('http://localhost:5000/api/upload', {
// // // //             method: 'POST',
// // // //             body: fallbackFormData,
// // // //           });

// // // //           if (fallbackResponse.ok) {
// // // //             const fallbackResult = await fallbackResponse.json();
// // // //             if (fallbackResult.imageUrls && fallbackResult.imageUrls.length > 0) {
// // // //               uploadedUrls.push(...fallbackResult.imageUrls);
// // // //               console.log('✅ Fallback réussi pour:', image.file.name);
// // // //             }
// // // //           } else {
// // // //             console.error('❌ Fallback échoué pour:', image.file.name);
// // // //           }
// // // //         } catch (fallbackError) {
// // // //           console.error('❌ Erreur fallback upload:', fallbackError);
// // // //         }
// // // //       }
      
// // // //       // Si toujours rien, utiliser les fallback images
// // // //       if (uploadedUrls.length === 0) {
// // // //         console.log('🖼️ Utilisation des images de fallback');
// // // //         throw error; // Propager l'erreur originale
// // // //       }
// // // //     }

// // // //     return uploadedUrls.length > 0 ? uploadedUrls : ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// // // //   };

// // // //   // Version alternative si l'endpoint d'upload échoue
// // // //   const getFallbackImages = (): string[] => {
// // // //     const placeholderImages = {
// // // //       apartment: [
// // // //         'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
// // // //         'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
// // // //       ],
// // // //       house: [
// // // //         'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
// // // //         'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'
// // // //       ],
// // // //       villa: [
// // // //         'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
// // // //         'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg'
// // // //       ],
// // // //       studio: [
// // // //         'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
// // // //         'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg'
// // // //       ],
// // // //       loft: [
// // // //         'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
// // // //         'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg'
// // // //       ],
// // // //       chalet: [
// // // //         'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
// // // //         'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg'
// // // //       ]
// // // //     };

// // // //     const imagesToUse = placeholderImages[propertyType as keyof typeof placeholderImages] || 
// // // //                        placeholderImages.apartment;
    
// // // //     return imagesToUse.slice(0, Math.min(uploadedImages.length + 1, 3));
// // // //   };

// // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // //     e.preventDefault();
// // // //     setError('');
// // // //     setIsSubmitting(true);

// // // //     try {
// // // //       // Validation des champs requis
// // // //       if (!title.trim()) {
// // // //         throw new Error('Le titre est requis');
// // // //       }
// // // //       if (!description.trim()) {
// // // //         throw new Error('La description est requise');
// // // //       }
// // // //       if (!city.trim()) {
// // // //         throw new Error('La ville est requise');
// // // //       }
// // // //       if (price <= 0) {
// // // //         throw new Error('Le prix doit être supérieur à 0');
// // // //       }

// // // //       const amenitiesArray = amenities
// // // //         .split(',')
// // // //         .map(item => item.trim())
// // // //         .filter(item => item !== '');

// // // //       // Upload des images
// // // //       let imageUrls: string[] = [];
      
// // // //       if (uploadedImages.length > 0) {
// // // //         try {
// // // //           console.log('🔄 Début de l\'upload des images...');
// // // //           imageUrls = await uploadImagesToServer(uploadedImages);
// // // //           console.log('✅ URLs des images uploadées:', imageUrls);
// // // //         } catch (uploadError) {
// // // //           console.warn('⚠️ Échec upload images, utilisation de fallback:', uploadError);
// // // //           // Fallback vers des images de placeholder
// // // //           imageUrls = getFallbackImages();
// // // //           console.log('🖼️ Images de fallback utilisées:', imageUrls);
// // // //         }
// // // //       } else {
// // // //         // Aucune image uploadée, utiliser une image par défaut
// // // //         imageUrls = ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// // // //         console.log('🖼️ Image par défaut utilisée');
// // // //       }

// // // //       console.log('📝 URLs finales des images:', imageUrls);

// // // //       // Préparer les données pour l'API - INCLURE LE PRICE_TYPE
// // // //       const propertyData = {
// // // //         title: title.trim(),
// // // //         description: description.trim(),
// // // //         address: address.trim(),
// // // //         city: city.trim(),
// // // //         country: country.trim(),
// // // //         price_per_night: Number(price),
// // // //         price_type: priceType, // AJOUT DU CHAMP PRICE_TYPE
// // // //         bedrooms: Number(bedrooms),
// // // //         bathrooms: Number(bathrooms),
// // // //         max_guests: Number(maxGuests),
// // // //         property_type: propertyType,
// // // //         amenities: amenitiesArray.length > 0 ? amenitiesArray : ['WiFi'],
// // // //         images: imageUrls,
// // // //         owner_id: ownerId,
// // // //         is_available: true
// // // //       };

// // // //       console.log('📤 Données envoyées à l\'API:', propertyData);

// // // //       const response = await fetch('http://localhost:5000/api/properties', {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Content-Type': 'application/json',
// // // //         },
// // // //         body: JSON.stringify(propertyData),
// // // //       });

// // // //       const responseData = await response.json();

// // // //       if (!response.ok) {
// // // //         console.error('❌ Erreur API:', responseData);
// // // //         throw new Error(responseData.error || `Erreur ${response.status}: ${response.statusText}`);
// // // //       }

// // // //       console.log('✅ Réponse de l\'API:', responseData);

// // // //       // Nettoyer les URLs des images prévisualisées
// // // //       uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// // // //       setUploadedImages([]);
      
// // // //       // Réinitialiser le formulaire
// // // //       setTitle('');
// // // //       setDescription('');
// // // //       setAddress('');
// // // //       setCity('');
// // // //       setPrice(100);
// // // //       setPriceType('night');
// // // //       setBedrooms(1);
// // // //       setBathrooms(1);
// // // //       setMaxGuests(2);
// // // //       setAmenities('');
      
// // // //       // Appeler le callback de succès
// // // //       onPropertyAdded();
      
// // // //     } catch (err: any) {
// // // //       console.error('❌ Erreur complète:', err);
// // // //       setError(
// // // //         err.message || 
// // // //         'Erreur lors de l\'ajout du bien. Vérifiez votre connexion et réessayez.'
// // // //       );
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const handleCancel = () => {
// // // //     // Libérer les URLs des images prévisualisées
// // // //     uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// // // //     setUploadedImages([]);
    
// // // //     // Appeler la fonction onCancel passée en prop
// // // //     onCancel();
// // // //   };

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in-0">
// // // //       <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95">
// // // //         {/* Header élégant */}
// // // //         <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 p-8 text-white relative">
// // // //           <div className="flex items-center justify-between">
// // // //             <div className="flex-1">
// // // //               <h1 className="text-2xl font-bold mb-2">Publier un nouveau bien</h1>
// // // //               <p className="text-white/90 text-sm">
// // // //                 Remplissez les détails de votre propriété pour commencer à recevoir des réservations
// // // //               </p>
// // // //             </div>
// // // //             {/* Bouton de fermeture */}
// // // //             <button
// // // //               onClick={handleCancel}
// // // //               className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300 ml-4"
// // // //             >
// // // //               <X className="w-6 h-6 text-white" />
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
// // // //           <div className="p-8 space-y-8">
// // // //             {error && (
// // // //               <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-in fade-in-0">
// // // //                 <div className="flex items-center">
// // // //                   <div className="text-red-500 text-sm mr-2">⚠️</div>
// // // //                   <p className="font-medium text-sm">{error}</p>
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             {/* Section Informations principales */}
// // // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // // //               <div className="flex items-center mb-6">
// // // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // // //                 <h2 className="text-lg font-semibold text-gray-900">Informations principales</h2>
// // // //               </div>
              
// // // //               <div className="space-y-4">
// // // //                 <div className="group">
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={title}
// // // //                     onChange={(e) => setTitle(e.target.value)}
// // // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // // //                     placeholder="Ex: Magnifique appartement avec vue sur la mer"
// // // //                     required
// // // //                   />
// // // //                 </div>

// // // //                 <div className="group">
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
// // // //                   <textarea
// // // //                     value={description}
// // // //                     onChange={(e) => setDescription(e.target.value)}
// // // //                     rows={4}
// // // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 resize-none"
// // // //                     placeholder="Décrivez votre bien en détail..."
// // // //                     required
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             {/* Section Localisation */}
// // // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // // //               <div className="flex items-center mb-6">
// // // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // // //                 <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
// // // //               </div>
              
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                 <div className="group">
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={address}
// // // //                     onChange={(e) => setAddress(e.target.value)}
// // // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // // //                     placeholder="Numéro et rue"
// // // //                   />
// // // //                 </div>
// // // //                 <div className="group">
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={city}
// // // //                     onChange={(e) => setCity(e.target.value)}
// // // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // // //                     placeholder="Ex: Paris"
// // // //                     required
// // // //                   />
// // // //                 </div>
// // // //               </div>

// // // //               <div className="mt-4 group">
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={country}
// // // //                   onChange={(e) => setCountry(e.target.value)}
// // // //                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // // //                 />
// // // //               </div>
// // // //             </div>

// // // //             {/* Section Détails du bien */}
// // // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // // //               <div className="flex items-center mb-6">
// // // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // // //                 <h2 className="text-lg font-semibold text-gray-900">Détails du bien</h2>
// // // //               </div>
              
// // // //               {/* Prix avec sélection jour/mois */}
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// // // //                 <div className="group">
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
// // // //                   <div className="relative">
// // // //                     <input
// // // //                       type="number"
// // // //                       min="1"
// // // //                       value={price}
// // // //                       onChange={(e) => setPrice(Number(e.target.value))}
// // // //                       className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // // //                       required
// // // //                     />
// // // //                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
// // // //                       <select
// // // //                         value={priceType}
// // // //                         onChange={(e) => setPriceType(e.target.value as 'night' | 'month')}
// // // //                         className="bg-transparent border-none text-gray-600 text-sm focus:ring-0 focus:outline-none appearance-none pr-6"
// // // //                       >
// // // //                         <option value="night">€/nuit</option>
// // // //                         <option value="month">€/mois</option>
// // // //                       </select>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
                
// // // //                 <div className="group">
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
// // // //                   <select
// // // //                     value={propertyType}
// // // //                     onChange={(e) => setPropertyType(e.target.value)}
// // // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 appearance-none"
// // // //                   >
// // // //                     <option value="apartment">🏢 Appartement</option>
// // // //                     <option value="house">🏠 Maison</option>
// // // //                     <option value="villa">🏡 Villa</option>
// // // //                     <option value="studio">🔧 Studio</option>
// // // //                     <option value="loft">🏭 Loft</option>
// // // //                     <option value="chalet">⛰️ Chalet</option>
// // // //                   </select>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// // // //                 <div className="group">
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Chambres *</label>
// // // //                   <input
// // // //                     type="number"
// // // //                     min="1"
// // // //                     value={bedrooms}
// // // //                     onChange={(e) => setBedrooms(Number(e.target.value))}
// // // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // // //                     required
// // // //                   />
// // // //                 </div>
                
// // // //                 <div className="group">
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Salles de bain *</label>
// // // //                   <input
// // // //                     type="number"
// // // //                     min="1"
// // // //                     value={bathrooms}
// // // //                     onChange={(e) => setBathrooms(Number(e.target.value))}
// // // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // // //                     required
// // // //                   />
// // // //                 </div>
                
// // // //                 <div className="group">
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Voyageurs max *</label>
// // // //                   <input
// // // //                     type="number"
// // // //                     min="1"
// // // //                     value={maxGuests}
// // // //                     onChange={(e) => setMaxGuests(Number(e.target.value))}
// // // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // // //                     required
// // // //                   />
// // // //                 </div>
// // // //               </div>

// // // //               <div className="mt-4 group">
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                   Équipements
// // // //                 </label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={amenities}
// // // //                   onChange={(e) => setAmenities(e.target.value)}
// // // //                   placeholder="WiFi, Parking, Piscine, Climatisation..."
// // // //                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // // //                 />
// // // //               </div>
// // // //             </div>

// // // //             {/* Section Images */}
// // // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // // //               <div className="flex items-center mb-6">
// // // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // // //                 <h2 className="text-lg font-semibold text-gray-900">Galerie photos</h2>
// // // //               </div>
              
// // // //               {/* Sélecteur de fichiers caché */}
// // // //               <input
// // // //                 type="file"
// // // //                 ref={fileInputRef}
// // // //                 onChange={handleFileInputChange}
// // // //                 multiple
// // // //                 accept="image/*"
// // // //                 className="hidden"
// // // //               />
              
// // // //               {/* Zone de drag & drop élégante */}
// // // //               <div 
// // // //                 className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-6
// // // //                   ${isDragging 
// // // //                     ? 'border-[#ea80fc] bg-[#ea80fc]/10 scale-[1.02] shadow-md' 
// // // //                     : 'border-gray-300 bg-white hover:border-[#ea80fc] hover:bg-[#ea80fc]/5'
// // // //                   }`}
// // // //                 onClick={handleFileSelect}
// // // //                 onDragOver={handleDragOver}
// // // //                 onDragLeave={handleDragLeave}
// // // //                 onDrop={handleDrop}
// // // //               >
// // // //                 <div className="text-4xl mb-4">📸</div>
// // // //                 <p className="text-base font-semibold text-gray-800 mb-2">
// // // //                   {isDragging ? 'Lâchez pour déposer' : 'Ajoutez vos photos'}
// // // //                 </p>
// // // //                 <p className="text-gray-600 text-sm mb-1">
// // // //                   Glissez-déposez vos images ou <span className="text-[#ea80fc] font-medium">parcourez vos fichiers</span>
// // // //                 </p>
// // // //                 <p className="text-gray-400 text-xs">
// // // //                   PNG, JPG, JPEG jusqu'à 10MB • Maximum 10 images
// // // //                 </p>
// // // //               </div>

// // // //               {/* Aperçu des images sélectionnées */}
// // // //               {uploadedImages.length > 0 && (
// // // //                 <div className="animate-fade-in">
// // // //                   <div className="flex items-center justify-between mb-4">
// // // //                     <h3 className="text-base font-semibold text-gray-900">
// // // //                       Photos sélectionnées ({uploadedImages.length})
// // // //                       <span className="text-[#ea80fc] ml-2">
// // // //                         {uploadedImages.length > 0 ? '✓ Prêtes à être uploadées' : ''}
// // // //                       </span>
// // // //                     </h3>
// // // //                     <button
// // // //                       type="button"
// // // //                       onClick={handleFileSelect}
// // // //                       className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all duration-300"
// // // //                     >
// // // //                       + Ajouter plus
// // // //                     </button>
// // // //                   </div>
// // // //                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
// // // //                     {uploadedImages.map((image, index) => (
// // // //                       <div 
// // // //                         key={image.id} 
// // // //                         className="relative group animate-scale-in"
// // // //                         style={{ animationDelay: `${index * 100}ms` }}
// // // //                       >
// // // //                         <div className="aspect-square rounded-lg overflow-hidden shadow-sm bg-gray-100">
// // // //                           <img
// // // //                             src={image.preview}
// // // //                             alt={`Aperçu ${index + 1}`}
// // // //                             className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
// // // //                           />
// // // //                         </div>
// // // //                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
// // // //                         <button
// // // //                           type="button"
// // // //                           onClick={(e) => {
// // // //                             e.stopPropagation();
// // // //                             removeImage(image.id);
// // // //                           }}
// // // //                           className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 hover:bg-red-600 shadow-md"
// // // //                         >
// // // //                           ×
// // // //                         </button>
// // // //                         <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
// // // //                           {image.file.name}
// // // //                         </div>
// // // //                         <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
// // // //                           #{index + 1}
// // // //                         </div>
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           </div>

// // // //           {/* Boutons d'action */}
// // // //           <div className="bg-gray-50 border-t border-gray-200 p-6">
// // // //             <div className="flex gap-3">
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={handleCancel}
// // // //                 className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
// // // //               >
// // // //                 Annuler
// // // //               </button>
// // // //               <button
// // // //                 type="submit"
// // // //                 disabled={isSubmitting}
// // // //                 className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
// // // //                   ${isSubmitting
// // // //                     ? 'bg-gray-400 cursor-not-allowed transform scale-95'
// // // //                     : 'bg-gradient-to-r from-[#ea80fc] to-purple-500 hover:from-[#d870eb] hover:to-purple-600 text-white transform hover:scale-[1.02] hover:shadow-xl active:scale-95'
// // // //                   }`}
// // // //               >
// // // //                 {isSubmitting ? (
// // // //                   <div className="flex items-center justify-center space-x-2">
// // // //                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
// // // //                     <span className="text-sm">Publication en cours...</span>
// // // //                   </div>
// // // //                 ) : (
// // // //                   <div className="flex items-center justify-center space-x-2">
// // // //                     <span>🚀</span>
// // // //                     <span>Publier le bien</span>
// // // //                   </div>
// // // //                 )}
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // src/components/AddPropertyForm.tsx
// // // import { useState, useRef } from 'react';
// // // import { X } from 'lucide-react';
// // // import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// // // import 'leaflet/dist/leaflet.css';
// // // import L from 'leaflet';

// // // // Fix pour les icônes Leaflet dans React
// // // delete (L.Icon.Default.prototype as any)._getIconUrl;
// // // L.Icon.Default.mergeOptions({
// // //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// // //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// // //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // // });

// // // interface AddPropertyFormProps {
// // //   ownerId: string;
// // //   onPropertyAdded: () => void;
// // //   onCancel: () => void;
// // // }

// // // interface UploadedImage {
// // //   file: File;
// // //   preview: string;
// // //   id: string;
// // // }

// // // // Composant pour gérer les clics sur la carte
// // // function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
// // //   useMapEvents({
// // //     click: (e) => {
// // //       const { lat, lng } = e.latlng;
// // //       onLocationSelect(lat, lng);
// // //     },
// // //   });
// // //   return null;
// // // }

// // // type LocationMethod = 'manual' | 'map';

// // // export default function AddPropertyForm({ ownerId, onPropertyAdded, onCancel }: AddPropertyFormProps) {
// // //   const [title, setTitle] = useState('');
// // //   const [description, setDescription] = useState('');
// // //   const [address, setAddress] = useState('');
// // //   const [city, setCity] = useState('');
// // //   const [country, setCountry] = useState('France');
// // //   const [price, setPrice] = useState(100);
// // //   const [priceType, setPriceType] = useState<'night' | 'month'>('night');
// // //   const [bedrooms, setBedrooms] = useState(1);
// // //   const [bathrooms, setBathrooms] = useState(1);
// // //   const [maxGuests, setMaxGuests] = useState(2);
// // //   const [propertyType, setPropertyType] = useState('apartment');
// // //   const [amenities, setAmenities] = useState('');
// // //   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
// // //   const [error, setError] = useState('');
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [isDragging, setIsDragging] = useState(false);
// // //   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
// // //   const [selectedAddress, setSelectedAddress] = useState('');
// // //   const [isGeocoding, setIsGeocoding] = useState(false);
// // //   const [locationMethod, setLocationMethod] = useState<LocationMethod>('manual');
  
// // //   const fileInputRef = useRef<HTMLInputElement>(null);

// // //   const handleImageUpload = (files: FileList | null) => {
// // //     if (!files) return;

// // //     const newImages: UploadedImage[] = [];
    
// // //     Array.from(files).forEach(file => {
// // //       if (file.type.startsWith('image/')) {
// // //         // Vérifier la taille du fichier (max 10MB)
// // //         if (file.size > 10 * 1024 * 1024) {
// // //           setError(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
// // //           return;
// // //         }
// // //         const preview = URL.createObjectURL(file);
// // //         newImages.push({
// // //           file,
// // //           preview,
// // //           id: Math.random().toString(36).substr(2, 9)
// // //         });
// // //       }
// // //     });

// // //     setUploadedImages(prev => [...prev, ...newImages]);
// // //     setError(''); // Clear any previous errors
// // //   };

// // //   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     handleImageUpload(e.target.files);
// // //     // Reset the input to allow uploading the same file again
// // //     if (e.target) {
// // //       e.target.value = '';
// // //     }
// // //   };

// // //   const handleDragOver = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(true);
// // //   };

// // //   const handleDragLeave = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(false);
// // //   };

// // //   const handleDrop = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(false);
// // //     handleImageUpload(e.dataTransfer.files);
// // //   };

// // //   const removeImage = (id: string) => {
// // //     setUploadedImages(prev => {
// // //       const imageToRemove = prev.find(img => img.id === id);
// // //       if (imageToRemove) {
// // //         URL.revokeObjectURL(imageToRemove.preview);
// // //       }
// // //       return prev.filter(img => img.id !== id);
// // //     });
// // //   };

// // //   const handleFileSelect = () => {
// // //     fileInputRef.current?.click();
// // //   };

// // //   // Fonction pour gérer la sélection de l'emplacement sur la carte
// // //   const handleLocationSelect = async (lat: number, lng: number) => {
// // //     setLocation({ lat, lng });
// // //     setIsGeocoding(true);
    
// // //     try {
// // //       // Reverse geocoding pour obtenir l'adresse à partir des coordonnées
// // //       const response = await fetch(
// // //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`
// // //       );
// // //       const data = await response.json();
      
// // //       if (data.address) {
// // //         const address = data.address;
// // //         const addressParts = [
// // //           address.road,
// // //           address.house_number,
// // //           address.postcode,
// // //           address.city || address.town || address.village,
// // //           address.country
// // //         ].filter(Boolean);
        
// // //         const fullAddress = addressParts.join(', ');
        
// // //         setSelectedAddress(fullAddress);
// // //         setAddress(fullAddress);
// // //         setCity(address.city || address.town || address.village || '');
// // //         setCountry(address.country || 'France');
// // //       } else {
// // //         // Fallback si aucune adresse trouvée
// // //         const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// // //         setSelectedAddress(fallbackAddress);
// // //         setAddress(fallbackAddress);
// // //       }
// // //     } catch (error) {
// // //       console.error('Erreur lors du reverse geocoding:', error);
// // //       // Fallback: utiliser les coordonnées
// // //       const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// // //       setSelectedAddress(fallbackAddress);
// // //       setAddress(fallbackAddress);
// // //     } finally {
// // //       setIsGeocoding(false);
// // //     }
// // //   };

// // //   // Fonction pour changer la méthode de localisation
// // //   const handleLocationMethodChange = (method: LocationMethod) => {
// // //     setLocationMethod(method);
    
// // //     // Réinitialiser les champs quand on change de méthode
// // //     if (method === 'manual') {
// // //       setLocation(null);
// // //       setSelectedAddress('');
// // //       setAddress('');
// // //       setCity('');
// // //       setCountry('France');
// // //     } else {
// // //       // Pour la carte, on garde les valeurs actuelles mais on les rend en lecture seule
// // //       // Les valeurs seront mises à jour quand on cliquera sur la carte
// // //     }
// // //   };

// // //   // Fonction pour uploader les images vers IMGbb
// // //   const uploadImagesToServer = async (images: UploadedImage[]): Promise<string[]> => {
// // //     if (images.length === 0) {
// // //       return ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// // //     }

// // //     const uploadedUrls: string[] = [];
    
// // //     // Upload chaque image individuellement vers IMGbb
// // //     for (const image of images) {
// // //       try {
// // //         const formData = new FormData();
// // //         formData.append('image', image.file);
        
// // //         console.log('📤 Upload vers IMGbb:', image.file.name);
        
// // //         const response = await fetch('https://api.imgbb.com/1/upload?key=ebd5c0e3afd3a5f8db71587bcc4841ed', {
// // //           method: 'POST',
// // //           body: formData,
// // //         });

// // //         if (!response.ok) {
// // //           const errorText = await response.text();
// // //           console.error('❌ Erreur upload IMGbb:', errorText);
// // //           continue; // Passer à l'image suivante en cas d'erreur
// // //         }

// // //         const result = await response.json();
// // //         console.log('✅ Réponse IMGbb:', result);
        
// // //         if (result.data && result.data.url) {
// // //           uploadedUrls.push(result.data.url);
// // //           console.log('✅ Image uploadée avec succès:', result.data.url);
// // //         }
// // //       } catch (error) {
// // //         console.error('❌ Erreur upload image vers IMGbb:', error);
// // //       }
// // //     }

// // //     // Si au moins une image a été uploadée, retourner les URLs
// // //     if (uploadedUrls.length > 0) {
// // //       return uploadedUrls;
// // //     }
    
// // //     // Si aucune image n'a pu être uploadée, utiliser les images de fallback
// // //     console.log('🖼️ Utilisation des images de fallback');
// // //     return getFallbackImages();
// // //   };

// // //   // Version alternative si l'endpoint d'upload échoue
// // //   const getFallbackImages = (): string[] => {
// // //     const placeholderImages = {
// // //       apartment: [
// // //         'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
// // //         'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
// // //       ],
// // //       house: [
// // //         'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
// // //         'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'
// // //       ],
// // //       villa: [
// // //         'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
// // //         'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg'
// // //       ],
// // //       studio: [
// // //         'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
// // //         'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg'
// // //       ],
// // //       loft: [
// // //         'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
// // //         'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg'
// // //       ],
// // //       chalet: [
// // //         'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
// // //         'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg'
// // //       ]
// // //     };

// // //     const imagesToUse = placeholderImages[propertyType as keyof typeof placeholderImages] || 
// // //                        placeholderImages.apartment;
    
// // //     return imagesToUse.slice(0, Math.min(uploadedImages.length + 1, 3));
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     setError('');
// // //     setIsSubmitting(true);

// // //     try {
// // //       // Validation des champs requis
// // //       if (!title.trim()) {
// // //         throw new Error('Le titre est requis');
// // //       }
// // //       if (!description.trim()) {
// // //         throw new Error('La description est requise');
// // //       }
// // //       if (!city.trim()) {
// // //         throw new Error('La ville est requise');
// // //       }
// // //       if (locationMethod === 'map' && !location) {
// // //         throw new Error('Veuillez sélectionner un emplacement sur la carte');
// // //       }
// // //       if (price <= 0) {
// // //         throw new Error('Le prix doit être supérieur à 0');
// // //       }

// // //       const amenitiesArray = amenities
// // //         .split(',')
// // //         .map(item => item.trim())
// // //         .filter(item => item !== '');

// // //       // Upload des images vers IMGbb
// // //       let imageUrls: string[] = [];
      
// // //       if (uploadedImages.length > 0) {
// // //         try {
// // //           console.log('🔄 Début de l\'upload des images vers IMGbb...');
// // //           imageUrls = await uploadImagesToServer(uploadedImages);
// // //           console.log('✅ URLs des images uploadées:', imageUrls);
// // //         } catch (uploadError) {
// // //           console.warn('⚠️ Échec upload images, utilisation de fallback:', uploadError);
// // //           // Fallback vers des images de placeholder
// // //           imageUrls = getFallbackImages();
// // //           console.log('🖼️ Images de fallback utilisées:', imageUrls);
// // //         }
// // //       } else {
// // //         // Aucune image uploadée, utiliser une image par défaut
// // //         imageUrls = ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// // //         console.log('🖼️ Image par défaut utilisée');
// // //       }

// // //       console.log('📝 URLs finales des images:', imageUrls);

// // //       // Préparer les données pour l'API - INCLURE LES COORDONNÉES
// // //       const propertyData = {
// // //         title: title.trim(),
// // //         description: description.trim(),
// // //         address: address.trim(),
// // //         city: city.trim(),
// // //         country: country.trim(),
// // //         latitude: locationMethod === 'map' ? location?.lat : null, // Coordonnées seulement si sélection carte
// // //         longitude: locationMethod === 'map' ? location?.lng : null, // Coordonnées seulement si sélection carte
// // //         price_per_night: Number(price),
// // //         price_type: priceType,
// // //         bedrooms: Number(bedrooms),
// // //         bathrooms: Number(bathrooms),
// // //         max_guests: Number(maxGuests),
// // //         property_type: propertyType,
// // //         amenities: amenitiesArray.length > 0 ? amenitiesArray : ['WiFi'],
// // //         images: imageUrls,
// // //         owner_id: ownerId,
// // //         is_available: true
// // //       };

// // //       console.log('📤 Données envoyées à l\'API:', propertyData);

// // //       const response = await fetch('http://localhost:5000/api/properties', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(propertyData),
// // //       });

// // //       const responseData = await response.json();

// // //       if (!response.ok) {
// // //         console.error('❌ Erreur API:', responseData);
// // //         throw new Error(responseData.error || `Erreur ${response.status}: ${response.statusText}`);
// // //       }

// // //       console.log('✅ Réponse de l\'API:', responseData);

// // //       // Nettoyer les URLs des images prévisualisées
// // //       uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// // //       setUploadedImages([]);
      
// // //       // Réinitialiser le formulaire
// // //       setTitle('');
// // //       setDescription('');
// // //       setAddress('');
// // //       setCity('');
// // //       setCountry('France');
// // //       setPrice(100);
// // //       setPriceType('night');
// // //       setBedrooms(1);
// // //       setBathrooms(1);
// // //       setMaxGuests(2);
// // //       setAmenities('');
// // //       setLocation(null);
// // //       setSelectedAddress('');
// // //       setLocationMethod('manual');
      
// // //       // Appeler le callback de succès
// // //       onPropertyAdded();
      
// // //     } catch (err: any) {
// // //       console.error('❌ Erreur complète:', err);
// // //       setError(
// // //         err.message || 
// // //         'Erreur lors de l\'ajout du bien. Vérifiez votre connexion et réessayez.'
// // //       );
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleCancel = () => {
// // //     // Libérer les URLs des images prévisualisées
// // //     uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// // //     setUploadedImages([]);
    
// // //     // Appeler la fonction onCancel passée en prop
// // //     onCancel();
// // //   };

// // //   return (
// // //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in-0">
// // //       <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95">
// // //         {/* Header élégant */}
// // //         <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 p-8 text-white relative">
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex-1">
// // //               <h1 className="text-2xl font-bold mb-2">Publier un nouveau bien</h1>
// // //               <p className="text-white/90 text-sm">
// // //                 Remplissez les détails de votre propriété pour commencer à recevoir des réservations
// // //               </p>
// // //             </div>
// // //             {/* Bouton de fermeture */}
// // //             <button
// // //               onClick={handleCancel}
// // //               className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300 ml-4"
// // //             >
// // //               <X className="w-6 h-6 text-white" />
// // //             </button>
// // //           </div>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
// // //           <div className="p-8 space-y-8">
// // //             {error && (
// // //               <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-in fade-in-0">
// // //                 <div className="flex items-center">
// // //                   <div className="text-red-500 text-sm mr-2">⚠️</div>
// // //                   <p className="font-medium text-sm">{error}</p>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Section Informations principales */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Informations principales</h2>
// // //               </div>
              
// // //               <div className="space-y-4">
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
// // //                   <input
// // //                     type="text"
// // //                     value={title}
// // //                     onChange={(e) => setTitle(e.target.value)}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     placeholder="Ex: Magnifique appartement avec vue sur la mer"
// // //                     required
// // //                   />
// // //                 </div>

// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
// // //                   <textarea
// // //                     value={description}
// // //                     onChange={(e) => setDescription(e.target.value)}
// // //                     rows={4}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 resize-none"
// // //                     placeholder="Décrivez votre bien en détail..."
// // //                     required
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Section Localisation avec deux options */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
// // //               </div>
              
// // //               {/* Sélection de la méthode de localisation */}
// // //               <div className="mb-6">
// // //                 <label className="block text-sm font-medium text-gray-700 mb-3">
// // //                   Comment souhaitez-vous localiser votre bien ? *
// // //                 </label>
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => handleLocationMethodChange('manual')}
// // //                     className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
// // //                       locationMethod === 'manual'
// // //                         ? 'border-[#ea80fc] bg-[#ea80fc]/10 shadow-md'
// // //                         : 'border-gray-300 bg-white hover:border-gray-400'
// // //                     }`}
// // //                   >
// // //                     <div className="flex items-center">
// // //                       <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
// // //                         locationMethod === 'manual'
// // //                           ? 'border-[#ea80fc] bg-[#ea80fc]'
// // //                           : 'border-gray-400'
// // //                       }`} />
// // //                       <div>
// // //                         <div className="font-semibold text-gray-900">📍 Saisie manuelle</div>
// // //                         <div className="text-sm text-gray-600 mt-1">
// // //                           Entrez l'adresse, ville et pays manuellement
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </button>
                  
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => handleLocationMethodChange('map')}
// // //                     className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
// // //                       locationMethod === 'map'
// // //                         ? 'border-[#ea80fc] bg-[#ea80fc]/10 shadow-md'
// // //                         : 'border-gray-300 bg-white hover:border-gray-400'
// // //                     }`}
// // //                   >
// // //                     <div className="flex items-center">
// // //                       <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
// // //                         locationMethod === 'map'
// // //                           ? 'border-[#ea80fc] bg-[#ea80fc]'
// // //                           : 'border-gray-400'
// // //                       }`} />
// // //                       <div>
// // //                         <div className="font-semibold text-gray-900">🗺️ Sélection sur carte</div>
// // //                         <div className="text-sm text-gray-600 mt-1">
// // //                           Cliquez sur la carte pour sélectionner l'emplacement
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               {/* Mode Manuel */}
// // //               {locationMethod === 'manual' && (
// // //                 <div className="space-y-4 animate-fade-in">
// // //                   <div className="grid grid-cols-1 gap-4">
// // //                     <div className="group">
// // //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                         Adresse *
// // //                       </label>
// // //                       <input
// // //                         type="text"
// // //                         value={address}
// // //                         onChange={(e) => setAddress(e.target.value)}
// // //                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                         placeholder="Ex: 123 Avenue des Champs-Élysées"
// // //                         required
// // //                       />
// // //                     </div>
                    
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Ville *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={city}
// // //                           onChange={(e) => setCity(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           placeholder="Ex: Paris"
// // //                           required
// // //                         />
// // //                       </div>
                      
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Pays *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={country}
// // //                           onChange={(e) => setCountry(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           placeholder="Ex: France"
// // //                           required
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {/* Mode Carte */}
// // //               {locationMethod === 'map' && (
// // //                 <div className="space-y-4 animate-fade-in">
// // //                   {/* Carte interactive */}
// // //                   <div className="mb-4">
// // //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                       Sélectionnez l'emplacement sur la carte *
// // //                       {location && (
// // //                         <span className="text-green-600 ml-2 text-sm">
// // //                           ✓ Emplacement sélectionné
// // //                         </span>
// // //                       )}
// // //                     </label>
// // //                     <div className="h-64 rounded-xl overflow-hidden border border-gray-300 relative">
// // //                       {isGeocoding && (
// // //                         <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
// // //                           <div className="text-gray-600 text-sm">
// // //                             Recherche de l'adresse...
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                       <MapContainer
// // //                         center={[46.6031, 1.8883]} // Centre sur la France
// // //                         zoom={6}
// // //                         style={{ height: '100%', width: '100%' }}
// // //                       >
// // //                         <TileLayer
// // //                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // //                           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// // //                         />
// // //                         <MapClickHandler onLocationSelect={handleLocationSelect} />
// // //                         {location && (
// // //                           <Marker position={[location.lat, location.lng]} />
// // //                         )}
// // //                       </MapContainer>
// // //                     </div>
// // //                     <p className="text-sm text-gray-500 mt-2">
// // //                       Cliquez sur la carte pour positionner votre bien. L'adresse sera générée automatiquement.
// // //                     </p>
// // //                   </div>

// // //                   {/* Adresse automatiquement remplie (lecture seule) */}
// // //                   <div className="grid grid-cols-1 gap-4">
// // //                     <div className="group">
// // //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                         Adresse générée automatiquement
// // //                       </label>
// // //                       <input
// // //                         type="text"
// // //                         value={selectedAddress || "Cliquez sur la carte pour générer l'adresse"}
// // //                         readOnly
// // //                         className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
// // //                       />
// // //                     </div>
                    
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Ville *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={city}
// // //                           readOnly
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
// // //                           placeholder="Sélectionnez un emplacement sur la carte"
// // //                         />
// // //                       </div>
                      
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Pays *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={country}
// // //                           readOnly
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* Section Détails du bien */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Détails du bien</h2>
// // //               </div>
              
// // //               {/* Prix avec sélection jour/mois */}
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
// // //                   <div className="relative">
// // //                     <input
// // //                       type="number"
// // //                       min="1"
// // //                       value={price}
// // //                       onChange={(e) => setPrice(Number(e.target.value))}
// // //                       className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                       required
// // //                     />
// // //                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
// // //                       <select
// // //                         value={priceType}
// // //                         onChange={(e) => setPriceType(e.target.value as 'night' | 'month')}
// // //                         className="bg-transparent border-none text-gray-600 text-sm focus:ring-0 focus:outline-none appearance-none pr-6"
// // //                       >
// // //                         <option value="night">€/nuit</option>
// // //                         <option value="month">€/mois</option>
// // //                       </select>
// // //                     </div>
// // //                   </div>
// // //                 </div>
                
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
// // //                   <select
// // //                     value={propertyType}
// // //                     onChange={(e) => setPropertyType(e.target.value)}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 appearance-none"
// // //                   >
// // //                     <option value="apartment">🏢 Appartement</option>
// // //                     <option value="house">🏠 Maison</option>
// // //                     <option value="villa">🏡 Villa</option>
// // //                     <option value="studio">🔧 Studio</option>
// // //                     <option value="loft">🏭 Loft</option>
// // //                     <option value="chalet">⛰️ Chalet</option>
// // //                   </select>
// // //                 </div>
// // //               </div>

// // //               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Chambres *</label>
// // //                   <input
// // //                     type="number"
// // //                     min="1"
// // //                     value={bedrooms}
// // //                     onChange={(e) => setBedrooms(Number(e.target.value))}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     required
// // //                   />
// // //                 </div>
                
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Salles de bain *</label>
// // //                   <input
// // //                     type="number"
// // //                     min="1"
// // //                     value={bathrooms}
// // //                     onChange={(e) => setBathrooms(Number(e.target.value))}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     required
// // //                   />
// // //                 </div>
                
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Voyageurs max *</label>
// // //                   <input
// // //                     type="number"
// // //                     min="1"
// // //                     value={maxGuests}
// // //                     onChange={(e) => setMaxGuests(Number(e.target.value))}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     required
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div className="mt-4 group">
// // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                   Équipements
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   value={amenities}
// // //                   onChange={(e) => setAmenities(e.target.value)}
// // //                   placeholder="WiFi, Parking, Piscine, Climatisation..."
// // //                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                 />
// // //               </div>
// // //             </div>

// // //             {/* Section Images */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Galerie photos</h2>
// // //               </div>
              
// // //               {/* Sélecteur de fichiers caché */}
// // //               <input
// // //                 type="file"
// // //                 ref={fileInputRef}
// // //                 onChange={handleFileInputChange}
// // //                 multiple
// // //                 accept="image/*"
// // //                 className="hidden"
// // //               />
              
// // //               {/* Zone de drag & drop élégante */}
// // //               <div 
// // //                 className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-6
// // //                   ${isDragging 
// // //                     ? 'border-[#ea80fc] bg-[#ea80fc]/10 scale-[1.02] shadow-md' 
// // //                     : 'border-gray-300 bg-white hover:border-[#ea80fc] hover:bg-[#ea80fc]/5'
// // //                   }`}
// // //                 onClick={handleFileSelect}
// // //                 onDragOver={handleDragOver}
// // //                 onDragLeave={handleDragLeave}
// // //                 onDrop={handleDrop}
// // //               >
// // //                 <div className="text-4xl mb-4">📸</div>
// // //                 <p className="text-base font-semibold text-gray-800 mb-2">
// // //                   {isDragging ? 'Lâchez pour déposer' : 'Ajoutez vos photos'}
// // //                 </p>
// // //                 <p className="text-gray-600 text-sm mb-1">
// // //                   Glissez-déposez vos images ou <span className="text-[#ea80fc] font-medium">parcourez vos fichiers</span>
// // //                 </p>
// // //                 <p className="text-gray-400 text-xs">
// // //                   PNG, JPG, JPEG jusqu'à 10MB • Maximum 10 images
// // //                 </p>
// // //               </div>

// // //               {/* Aperçu des images sélectionnées */}
// // //               {uploadedImages.length > 0 && (
// // //                 <div className="animate-fade-in">
// // //                   <div className="flex items-center justify-between mb-4">
// // //                     <h3 className="text-base font-semibold text-gray-900">
// // //                       Photos sélectionnées ({uploadedImages.length})
// // //                       <span className="text-[#ea80fc] ml-2">
// // //                         {uploadedImages.length > 0 ? '✓ Prêtes à être uploadées' : ''}
// // //                       </span>
// // //                     </h3>
// // //                     <button
// // //                       type="button"
// // //                       onClick={handleFileSelect}
// // //                       className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all duration-300"
// // //                     >
// // //                       + Ajouter plus
// // //                     </button>
// // //                   </div>
// // //                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
// // //                     {uploadedImages.map((image, index) => (
// // //                       <div 
// // //                         key={image.id} 
// // //                         className="relative group animate-scale-in"
// // //                         style={{ animationDelay: `${index * 100}ms` }}
// // //                       >
// // //                         <div className="aspect-square rounded-lg overflow-hidden shadow-sm bg-gray-100">
// // //                           <img
// // //                             src={image.preview}
// // //                             alt={`Aperçu ${index + 1}`}
// // //                             className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
// // //                           />
// // //                         </div>
// // //                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
// // //                         <button
// // //                           type="button"
// // //                           onClick={(e) => {
// // //                             e.stopPropagation();
// // //                             removeImage(image.id);
// // //                           }}
// // //                           className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 hover:bg-red-600 shadow-md"
// // //                         >
// // //                           ×
// // //                         </button>
// // //                         <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
// // //                           {image.file.name}
// // //                         </div>
// // //                         <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
// // //                           #{index + 1}
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Boutons d'action */}
// // //           <div className="bg-gray-50 border-t border-gray-200 p-6">
// // //             <div className="flex gap-3">
// // //               <button
// // //                 type="button"
// // //                 onClick={handleCancel}
// // //                 className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
// // //               >
// // //                 Annuler
// // //               </button>
// // //               <button
// // //                 type="submit"
// // //                 disabled={isSubmitting || (locationMethod === 'map' && !location)}
// // //                 className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
// // //                   ${isSubmitting || (locationMethod === 'map' && !location)
// // //                     ? 'bg-gray-400 cursor-not-allowed transform scale-95'
// // //                     : 'bg-gradient-to-r from-[#ea80fc] to-purple-500 hover:from-[#d870eb] hover:to-purple-600 text-white transform hover:scale-[1.02] hover:shadow-xl active:scale-95'
// // //                   }`}
// // //               >
// // //                 {isSubmitting ? (
// // //                   <div className="flex items-center justify-center space-x-2">
// // //                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
// // //                     <span className="text-sm">Publication en cours...</span>
// // //                   </div>
// // //                 ) : (
// // //                   <div className="flex items-center justify-center space-x-2">
// // //                     <span>🚀</span>
// // //                     <span>Publier le bien</span>
// // //                   </div>
// // //                 )}
// // //               </button>
// // //             </div>
// // //             {locationMethod === 'map' && !location && (
// // //               <p className="text-red-500 text-sm mt-2 text-center">
// // //                 Veuillez sélectionner un emplacement sur la carte pour publier le bien
// // //               </p>
// // //             )}
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // src/components/AddPropertyForm.tsx
// // // import { useState, useRef } from 'react';
// // // import { X } from 'lucide-react';
// // // import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// // // import 'leaflet/dist/leaflet.css';
// // // import L from 'leaflet';

// // // // Fix pour les icônes Leaflet dans React
// // // delete (L.Icon.Default.prototype as any)._getIconUrl;
// // // L.Icon.Default.mergeOptions({
// // //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// // //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// // //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // // });

// // // interface AddPropertyFormProps {
// // //   ownerId: string;
// // //   onPropertyAdded: () => void;
// // //   onCancel: () => void;
// // // }

// // // interface UploadedImage {
// // //   file: File;
// // //   preview: string;
// // //   id: string;
// // // }

// // // // Composant pour gérer les clics sur la carte
// // // function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
// // //   useMapEvents({
// // //     click: (e) => {
// // //       const { lat, lng } = e.latlng;
// // //       onLocationSelect(lat, lng);
// // //     },
// // //   });
// // //   return null;
// // // }

// // // type LocationMethod = 'manual' | 'map';

// // // export default function AddPropertyForm({ ownerId, onPropertyAdded, onCancel }: AddPropertyFormProps) {
// // //   const [title, setTitle] = useState('');
// // //   const [description, setDescription] = useState('');
// // //   const [address, setAddress] = useState('');
// // //   const [city, setCity] = useState('');
// // //   const [country, setCountry] = useState('France');
// // //   const [price, setPrice] = useState(100);
// // //   const [priceType, setPriceType] = useState<'night' | 'month'>('night');
// // //   const [bedrooms, setBedrooms] = useState(1);
// // //   const [bathrooms, setBathrooms] = useState(1);
// // //   const [maxGuests, setMaxGuests] = useState(2);
// // //   const [propertyType, setPropertyType] = useState('apartment');
// // //   const [amenities, setAmenities] = useState('');
// // //   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
// // //   const [error, setError] = useState('');
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [isDragging, setIsDragging] = useState(false);
// // //   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
// // //   const [selectedAddress, setSelectedAddress] = useState('');
// // //   const [isGeocoding, setIsGeocoding] = useState(false);
// // //   const [locationMethod, setLocationMethod] = useState<LocationMethod>('manual');
  
// // //   const fileInputRef = useRef<HTMLInputElement>(null);

// // //   const handleImageUpload = (files: FileList | null) => {
// // //     if (!files) return;

// // //     const newImages: UploadedImage[] = [];
    
// // //     Array.from(files).forEach(file => {
// // //       if (file.type.startsWith('image/')) {
// // //         // Vérifier la taille du fichier (max 10MB)
// // //         if (file.size > 10 * 1024 * 1024) {
// // //           setError(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
// // //           return;
// // //         }
// // //         const preview = URL.createObjectURL(file);
// // //         newImages.push({
// // //           file,
// // //           preview,
// // //           id: Math.random().toString(36).substr(2, 9)
// // //         });
// // //       }
// // //     });

// // //     setUploadedImages(prev => [...prev, ...newImages]);
// // //     setError(''); // Clear any previous errors
// // //   };

// // //   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     handleImageUpload(e.target.files);
// // //     // Reset the input to allow uploading the same file again
// // //     if (e.target) {
// // //       e.target.value = '';
// // //     }
// // //   };

// // //   const handleDragOver = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(true);
// // //   };

// // //   const handleDragLeave = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(false);
// // //   };

// // //   const handleDrop = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(false);
// // //     handleImageUpload(e.dataTransfer.files);
// // //   };

// // //   const removeImage = (id: string) => {
// // //     setUploadedImages(prev => {
// // //       const imageToRemove = prev.find(img => img.id === id);
// // //       if (imageToRemove) {
// // //         URL.revokeObjectURL(imageToRemove.preview);
// // //       }
// // //       return prev.filter(img => img.id !== id);
// // //     });
// // //   };

// // //   const handleFileSelect = () => {
// // //     fileInputRef.current?.click();
// // //   };

// // //   // Fonction améliorée pour le reverse geocoding avec meilleure gestion d'erreurs
// // //   const handleLocationSelect = async (lat: number, lng: number) => {
// // //     setLocation({ lat, lng });
// // //     setIsGeocoding(true);
    
// // //     try {
// // //       // Reverse geocoding avec plusieurs fournisseurs de fallback
// // //       let addressData = null;
      
// // //       // Essayer d'abord Nominatim
// // //       try {
// // //         const response = await fetch(
// // //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr&addressdetails=1`
// // //         );
        
// // //         if (response.ok) {
// // //           const data = await response.json();
// // //           if (data.address) {
// // //             addressData = data;
// // //           }
// // //         }
// // //       } catch (nominatimError) {
// // //         console.warn('Nominatim error:', nominatimError);
// // //       }

// // //       // Fallback: utiliser les coordonnées directement avec un format lisible
// // //       if (!addressData) {
// // //         console.log('Using fallback address format');
// // //         const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// // //         setSelectedAddress(fallbackAddress);
// // //         setAddress(fallbackAddress);
// // //         setCity('À définir');
// // //         setCountry('À définir');
// // //         setIsGeocoding(false);
// // //         return;
// // //       }

// // //       const address = addressData.address;
      
// // //       // Construction de l'adresse complète avec gestion des champs manquants
// // //       const addressParts = [
// // //         address.road,
// // //         address.house_number,
// // //         address.neighbourhood,
// // //         address.suburb
// // //       ].filter(Boolean);

// // //       const cityParts = [
// // //         address.city,
// // //         address.town,
// // //         address.village,
// // //         address.municipality,
// // //         address.county
// // //       ].filter(Boolean);

// // //       const countryParts = [
// // //         address.country,
// // //         address.country_code ? address.country_code.toUpperCase() : null
// // //       ].filter(Boolean);

// // //       const fullAddress = addressParts.length > 0 
// // //         ? addressParts.join(', ')
// // //         : `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

// // //       const cityName = cityParts.length > 0 ? cityParts[0] : 'À définir';
// // //       const countryName = countryParts.length > 0 ? countryParts[0] : 'À définir';

// // //       setSelectedAddress(fullAddress);
// // //       setAddress(fullAddress);
// // //       setCity(cityName);
// // //       setCountry(countryName);

// // //     } catch (error) {
// // //       console.error('Erreur lors du reverse geocoding:', error);
// // //       // Fallback ultime: utiliser les coordonnées
// // //       const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// // //       setSelectedAddress(fallbackAddress);
// // //       setAddress(fallbackAddress);
// // //       setCity('À définir');
// // //       setCountry('À définir');
// // //     } finally {
// // //       setIsGeocoding(false);
// // //     }
// // //   };

// // //   // Fonction pour changer la méthode de localisation
// // //   const handleLocationMethodChange = (method: LocationMethod) => {
// // //     setLocationMethod(method);
    
// // //     // Réinitialiser les champs quand on change de méthode
// // //     if (method === 'manual') {
// // //       setLocation(null);
// // //       setSelectedAddress('');
// // //       setAddress('');
// // //       setCity('');
// // //       setCountry('France');
// // //     }
// // //   };

// // //   // Fonction pour uploader les images vers IMGbb
// // //   const uploadImagesToServer = async (images: UploadedImage[]): Promise<string[]> => {
// // //     if (images.length === 0) {
// // //       return ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// // //     }

// // //     const uploadedUrls: string[] = [];
    
// // //     // Upload chaque image individuellement vers IMGbb
// // //     for (const image of images) {
// // //       try {
// // //         const formData = new FormData();
// // //         formData.append('image', image.file);
        
// // //         console.log('📤 Upload vers IMGbb:', image.file.name);
        
// // //         const response = await fetch('https://api.imgbb.com/1/upload?key=ebd5c0e3afd3a5f8db71587bcc4841ed', {
// // //           method: 'POST',
// // //           body: formData,
// // //         });

// // //         if (!response.ok) {
// // //           const errorText = await response.text();
// // //           console.error('❌ Erreur upload IMGbb:', errorText);
// // //           continue; // Passer à l'image suivante en cas d'erreur
// // //         }

// // //         const result = await response.json();
// // //         console.log('✅ Réponse IMGbb:', result);
        
// // //         if (result.data && result.data.url) {
// // //           uploadedUrls.push(result.data.url);
// // //           console.log('✅ Image uploadée avec succès:', result.data.url);
// // //         }
// // //       } catch (error) {
// // //         console.error('❌ Erreur upload image vers IMGbb:', error);
// // //       }
// // //     }

// // //     // Si au moins une image a été uploadée, retourner les URLs
// // //     if (uploadedUrls.length > 0) {
// // //       return uploadedUrls;
// // //     }
    
// // //     // Si aucune image n'a pu être uploadée, utiliser les images de fallback
// // //     console.log('🖼️ Utilisation des images de fallback');
// // //     return getFallbackImages();
// // //   };

// // //   // Version alternative si l'endpoint d'upload échoue
// // //   const getFallbackImages = (): string[] => {
// // //     const placeholderImages = {
// // //       apartment: [
// // //         'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
// // //         'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
// // //       ],
// // //       house: [
// // //         'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
// // //         'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'
// // //       ],
// // //       villa: [
// // //         'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
// // //         'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg'
// // //       ],
// // //       studio: [
// // //         'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
// // //         'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg'
// // //       ],
// // //       loft: [
// // //         'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
// // //         'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg'
// // //       ],
// // //       chalet: [
// // //         'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
// // //         'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg'
// // //       ]
// // //     };

// // //     const imagesToUse = placeholderImages[propertyType as keyof typeof placeholderImages] || 
// // //                        placeholderImages.apartment;
    
// // //     return imagesToUse.slice(0, Math.min(uploadedImages.length + 1, 3));
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     setError('');
// // //     setIsSubmitting(true);

// // //     try {
// // //       // Validation des champs requis
// // //       if (!title.trim()) {
// // //         throw new Error('Le titre est requis');
// // //       }
// // //       if (!description.trim()) {
// // //         throw new Error('La description est requise');
// // //       }
// // //       if (!city.trim() || city === 'À définir') {
// // //         throw new Error('La ville est requise');
// // //       }
// // //       if (locationMethod === 'map' && !location) {
// // //         throw new Error('Veuillez sélectionner un emplacement sur la carte');
// // //       }
// // //       if (price <= 0) {
// // //         throw new Error('Le prix doit être supérieur à 0');
// // //       }

// // //       const amenitiesArray = amenities
// // //         .split(',')
// // //         .map(item => item.trim())
// // //         .filter(item => item !== '');

// // //       // Upload des images vers IMGbb
// // //       let imageUrls: string[] = [];
      
// // //       if (uploadedImages.length > 0) {
// // //         try {
// // //           console.log('🔄 Début de l\'upload des images vers IMGbb...');
// // //           imageUrls = await uploadImagesToServer(uploadedImages);
// // //           console.log('✅ URLs des images uploadées:', imageUrls);
// // //         } catch (uploadError) {
// // //           console.warn('⚠️ Échec upload images, utilisation de fallback:', uploadError);
// // //           // Fallback vers des images de placeholder
// // //           imageUrls = getFallbackImages();
// // //           console.log('🖼️ Images de fallback utilisées:', imageUrls);
// // //         }
// // //       } else {
// // //         // Aucune image uploadée, utiliser une image par défaut
// // //         imageUrls = ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// // //         console.log('🖼️ Image par défaut utilisée');
// // //       }

// // //       console.log('📝 URLs finales des images:', imageUrls);

// // //       // Préparer les données pour l'API
// // //       const propertyData = {
// // //         title: title.trim(),
// // //         description: description.trim(),
// // //         address: address.trim(),
// // //         city: city.trim(),
// // //         country: country.trim(),
// // //         latitude: locationMethod === 'map' ? location?.lat : null,
// // //         longitude: locationMethod === 'map' ? location?.lng : null,
// // //         price_per_night: Number(price),
// // //         price_type: priceType,
// // //         bedrooms: Number(bedrooms),
// // //         bathrooms: Number(bathrooms),
// // //         max_guests: Number(maxGuests),
// // //         property_type: propertyType,
// // //         amenities: amenitiesArray.length > 0 ? amenitiesArray : ['WiFi'],
// // //         images: imageUrls,
// // //         owner_id: ownerId,
// // //         is_available: true
// // //       };

// // //       console.log('📤 Données envoyées à l\'API:', propertyData);

// // //       const response = await fetch('http://localhost:5000/api/properties', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(propertyData),
// // //       });

// // //       const responseData = await response.json();

// // //       if (!response.ok) {
// // //         console.error('❌ Erreur API:', responseData);
// // //         throw new Error(responseData.error || `Erreur ${response.status}: ${response.statusText}`);
// // //       }

// // //       console.log('✅ Réponse de l\'API:', responseData);

// // //       // Nettoyer les URLs des images prévisualisées
// // //       uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// // //       setUploadedImages([]);
      
// // //       // Réinitialiser le formulaire
// // //       setTitle('');
// // //       setDescription('');
// // //       setAddress('');
// // //       setCity('');
// // //       setCountry('France');
// // //       setPrice(100);
// // //       setPriceType('night');
// // //       setBedrooms(1);
// // //       setBathrooms(1);
// // //       setMaxGuests(2);
// // //       setAmenities('');
// // //       setLocation(null);
// // //       setSelectedAddress('');
// // //       setLocationMethod('manual');
      
// // //       // Appeler le callback de succès
// // //       onPropertyAdded();
      
// // //     } catch (err: any) {
// // //       console.error('❌ Erreur complète:', err);
// // //       setError(
// // //         err.message || 
// // //         'Erreur lors de l\'ajout du bien. Vérifiez votre connexion et réessayez.'
// // //       );
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleCancel = () => {
// // //     // Libérer les URLs des images prévisualisées
// // //     uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// // //     setUploadedImages([]);
    
// // //     // Appeler la fonction onCancel passée en prop
// // //     onCancel();
// // //   };

// // //   return (
// // //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in-0">
// // //       <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95">
// // //         {/* Header élégant */}
// // //         <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 p-8 text-white relative">
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex-1">
// // //               <h1 className="text-2xl font-bold mb-2">Publier un nouveau bien</h1>
// // //               <p className="text-white/90 text-sm">
// // //                 Remplissez les détails de votre propriété pour commencer à recevoir des réservations
// // //               </p>
// // //             </div>
// // //             {/* Bouton de fermeture */}
// // //             <button
// // //               onClick={handleCancel}
// // //               className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300 ml-4"
// // //             >
// // //               <X className="w-6 h-6 text-white" />
// // //             </button>
// // //           </div>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
// // //           <div className="p-8 space-y-8">
// // //             {error && (
// // //               <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-in fade-in-0">
// // //                 <div className="flex items-center">
// // //                   <div className="text-red-500 text-sm mr-2">⚠️</div>
// // //                   <p className="font-medium text-sm">{error}</p>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Section Informations principales */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Informations principales</h2>
// // //               </div>
              
// // //               <div className="space-y-4">
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
// // //                   <input
// // //                     type="text"
// // //                     value={title}
// // //                     onChange={(e) => setTitle(e.target.value)}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     placeholder="Ex: Magnifique appartement avec vue sur la mer"
// // //                     required
// // //                   />
// // //                 </div>

// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
// // //                   <textarea
// // //                     value={description}
// // //                     onChange={(e) => setDescription(e.target.value)}
// // //                     rows={4}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 resize-none"
// // //                     placeholder="Décrivez votre bien en détail..."
// // //                     required
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Section Localisation avec deux options */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
// // //               </div>
              
// // //               {/* Sélection de la méthode de localisation */}
// // //               <div className="mb-6">
// // //                 <label className="block text-sm font-medium text-gray-700 mb-3">
// // //                   Comment souhaitez-vous localiser votre bien ? *
// // //                 </label>
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => handleLocationMethodChange('manual')}
// // //                     className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
// // //                       locationMethod === 'manual'
// // //                         ? 'border-[#ea80fc] bg-[#ea80fc]/10 shadow-md'
// // //                         : 'border-gray-300 bg-white hover:border-gray-400'
// // //                     }`}
// // //                   >
// // //                     <div className="flex items-center">
// // //                       <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
// // //                         locationMethod === 'manual'
// // //                           ? 'border-[#ea80fc] bg-[#ea80fc]'
// // //                           : 'border-gray-400'
// // //                       }`} />
// // //                       <div>
// // //                         <div className="font-semibold text-gray-900">📍 Saisie manuelle</div>
// // //                         <div className="text-sm text-gray-600 mt-1">
// // //                           Entrez l'adresse, ville et pays manuellement
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </button>
                  
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => handleLocationMethodChange('map')}
// // //                     className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
// // //                       locationMethod === 'map'
// // //                         ? 'border-[#ea80fc] bg-[#ea80fc]/10 shadow-md'
// // //                         : 'border-gray-300 bg-white hover:border-gray-400'
// // //                     }`}
// // //                   >
// // //                     <div className="flex items-center">
// // //                       <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
// // //                         locationMethod === 'map'
// // //                           ? 'border-[#ea80fc] bg-[#ea80fc]'
// // //                           : 'border-gray-400'
// // //                       }`} />
// // //                       <div>
// // //                         <div className="font-semibold text-gray-900">🗺️ Sélection sur carte</div>
// // //                         <div className="text-sm text-gray-600 mt-1">
// // //                           Cliquez sur la carte pour sélectionner l'emplacement
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               {/* Mode Manuel */}
// // //               {locationMethod === 'manual' && (
// // //                 <div className="space-y-4 animate-fade-in">
// // //                   <div className="grid grid-cols-1 gap-4">
// // //                     <div className="group">
// // //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                         Adresse *
// // //                       </label>
// // //                       <input
// // //                         type="text"
// // //                         value={address}
// // //                         onChange={(e) => setAddress(e.target.value)}
// // //                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                         placeholder="Ex: 123 Avenue des Champs-Élysées"
// // //                         required
// // //                       />
// // //                     </div>
                    
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Ville *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={city}
// // //                           onChange={(e) => setCity(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           placeholder="Ex: Paris"
// // //                           required
// // //                         />
// // //                       </div>
                      
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Pays *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={country}
// // //                           onChange={(e) => setCountry(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           placeholder="Ex: France"
// // //                           required
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {/* Mode Carte */}
// // //               {locationMethod === 'map' && (
// // //                 <div className="space-y-4 animate-fade-in">
// // //                   {/* Carte interactive */}
// // //                   <div className="mb-4">
// // //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                       Sélectionnez l'emplacement sur la carte *
// // //                       {location && (
// // //                         <span className="text-green-600 ml-2 text-sm">
// // //                           ✓ Emplacement sélectionné
// // //                         </span>
// // //                       )}
// // //                     </label>
// // //                     <div className="h-64 rounded-xl overflow-hidden border border-gray-300 relative">
// // //                       {isGeocoding && (
// // //                         <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
// // //                           <div className="text-gray-600 text-sm">
// // //                             Recherche de l'adresse...
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                       <MapContainer
// // //                         center={[46.6031, 1.8883]} // Centre sur la France
// // //                         zoom={6}
// // //                         style={{ height: '100%', width: '100%' }}
// // //                       >
// // //                         <TileLayer
// // //                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // //                           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// // //                         />
// // //                         <MapClickHandler onLocationSelect={handleLocationSelect} />
// // //                         {location && (
// // //                           <Marker position={[location.lat, location.lng]} />
// // //                         )}
// // //                       </MapContainer>
// // //                     </div>
// // //                     <p className="text-sm text-gray-500 mt-2">
// // //                       Cliquez sur la carte pour positionner votre bien. L'adresse sera générée automatiquement.
// // //                     </p>
// // //                   </div>

// // //                   {/* Adresse automatiquement remplie (lecture seule) */}
// // //                   <div className="grid grid-cols-1 gap-4">
// // //                     <div className="group">
// // //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                         Adresse générée automatiquement
// // //                       </label>
// // //                       <input
// // //                         type="text"
// // //                         value={selectedAddress || "Cliquez sur la carte pour générer l'adresse"}
// // //                         readOnly
// // //                         className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
// // //                       />
// // //                     </div>
                    
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Ville *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={city}
// // //                           onChange={(e) => setCity(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           placeholder="La ville sera détectée automatiquement"
// // //                           required
// // //                         />
// // //                         <p className="text-xs text-gray-500 mt-1">
// // //                           {city === 'À définir' ? 'Ville non détectée, veuillez la saisir manuellement' : 'Vous pouvez modifier la ville si nécessaire'}
// // //                         </p>
// // //                       </div>
                      
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Pays *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={country}
// // //                           onChange={(e) => setCountry(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           required
// // //                         />
// // //                         <p className="text-xs text-gray-500 mt-1">
// // //                           {country === 'À définir' ? 'Pays non détecté, veuillez le saisir manuellement' : 'Vous pouvez modifier le pays si nécessaire'}
// // //                         </p>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   {/* Message d'information */}
// // //                   {selectedAddress && selectedAddress.includes('Position:') && (
// // //                     <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
// // //                       <div className="flex items-center">
// // //                         <div className="text-yellow-600 text-sm mr-2">💡</div>
// // //                         <div>
// // //                           <p className="text-yellow-800 text-sm font-medium">
// // //                             Adresse non détectée automatiquement
// // //                           </p>
// // //                           <p className="text-yellow-700 text-xs mt-1">
// // //                             Veuillez saisir manuellement le nom de la ville et du pays pour une localisation précise.
// // //                           </p>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>

// // //     {/* Section Détails du bien */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //              <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                  <h2 className="text-lg font-semibold text-gray-900">Détails du bien</h2>
// // //             </div>
              
// // // {/* Prix avec sélection jour/mois */}
// // //              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// // //                  <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
// // //                    <div className="relative">
// // //                     <input
// // //                        type="number"
// // //                      min="1"
// // //                      value={price}
// // //                      onChange={(e) => setPrice(Number(e.target.value))}
// // //                      className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                       required
// // //                     />
// // //                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
// // //                       <select
// // //                         value={priceType}
// // //                         onChange={(e) => setPriceType(e.target.value as 'night' | 'month')}
// // //                         className="bg-transparent border-none text-gray-600 text-sm focus:ring-0 focus:outline-none appearance-none pr-6"
// // //                       >
// // //                         <option value="night">€/nuit</option>
// // //                         <option value="month">€/mois</option>
// // //                       </select>
// // //                  </div>
// // //                 </div>
// // //               </div>
                
// // //                <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
// // //                 <select
// // //                     value={propertyType}
// // //                     onChange={(e) => setPropertyType(e.target.value)}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 appearance-none"
// // //                   >
// // //                     <option value="apartment">🏢 Appartement</option>
// // //                     <option value="house">🏠 Maison</option>
// // //                     <option value="villa">🏡 Villa</option>
// // //                     <option value="studio">🔧 Studio</option>
// // //                     <option value="loft">🏭 Loft</option>
// // //                     <option value="chalet">⛰️ Chalet</option>
// // //                   </select>
// // //                 </div>
// // //               </div>

// // //               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// // //                 <div className="group">
// // //                                     <label className="block text-sm font-medium text-gray-700 mb-2">Chambres *</label>
// // //                  <input
// // //                     type="number"
// // //                     min="1"
// // //                     value={bedrooms}
// // //                     onChange={(e) => setBedrooms(Number(e.target.value))}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     required
// // //                   />
// // //                 </div>
                
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Salles de bain *</label>
// // //                   <input
// // //                     type="number"
// // //                     min="1"
// // //                     value={bathrooms}
// // //                     onChange={(e) => setBathrooms(Number(e.target.value))}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     required
// // //                   />
// // //                 </div>
                
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Voyageurs max *</label>
// // //                   <input
// // //                     type="number"
// // //                     min="1"
// // //                     value={maxGuests}
// // //                     onChange={(e) => setMaxGuests(Number(e.target.value))}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     required
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div className="mt-4 group">
// // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                   Équipements
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   value={amenities}
// // //                   onChange={(e) => setAmenities(e.target.value)}
// // //                   placeholder="WiFi, Parking, Piscine, Climatisation..."
// // //                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                 />
// // //               </div>
// // //             </div>

// // //             {/* Section Images */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Galerie photos</h2>
// // //               </div>
              
// // //               {/* Sélecteur de fichiers caché */}
// // //               <input
// // //                 type="file"
// // //                 ref={fileInputRef}
// // //                 onChange={handleFileInputChange}
// // //                 multiple
// // //                 accept="image/*"
// // //                 className="hidden"
// // //               />
              
// // //               {/* Zone de drag & drop élégante */}
// // //               <div 
// // //                 className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-6
// // //                   ${isDragging 
// // //                     ? 'border-[#ea80fc] bg-[#ea80fc]/10 scale-[1.02] shadow-md' 
// // //                     : 'border-gray-300 bg-white hover:border-[#ea80fc] hover:bg-[#ea80fc]/5'
// // //                   }`}
// // //                 onClick={handleFileSelect}
// // //                 onDragOver={handleDragOver}
// // //                 onDragLeave={handleDragLeave}
// // //                 onDrop={handleDrop}
// // //               >
// // //                 <div className="text-4xl mb-4">📸</div>
// // //                 <p className="text-base font-semibold text-gray-800 mb-2">
// // //                   {isDragging ? 'Lâchez pour déposer' : 'Ajoutez vos photos'}
// // //                 </p>
// // //                 <p className="text-gray-600 text-sm mb-1">
// // //                   Glissez-déposez vos images ou <span className="text-[#ea80fc] font-medium">parcourez vos fichiers</span>
// // //                 </p>
// // //                 <p className="text-gray-400 text-xs">
// // //                   PNG, JPG, JPEG jusqu'à 10MB • Maximum 10 images
// // //                 </p>
// // //               </div>

// // //               {/* Aperçu des images sélectionnées */}
// // //               {uploadedImages.length > 0 && (
// // //                 <div className="animate-fade-in">
// // //                   <div className="flex items-center justify-between mb-4">
// // //                     <h3 className="text-base font-semibold text-gray-900">
// // //                       Photos sélectionnées ({uploadedImages.length})
// // //                       <span className="text-[#ea80fc] ml-2">
// // //                         {uploadedImages.length > 0 ? '✓ Prêtes à être uploadées' : ''}
// // //                       </span>
// // //                     </h3>
// // //                     <button
// // //                       type="button"
// // //                       onClick={handleFileSelect}
// // //                       className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all duration-300"
// // //                     >
// // //                       + Ajouter plus
// // //                     </button>
// // //                   </div>
// // //                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
// // //                     {uploadedImages.map((image, index) => (
// // //                       <div 
// // //                         key={image.id} 
// // //                         className="relative group animate-scale-in"
// // //                         style={{ animationDelay: `${index * 100}ms` }}
// // //                       >
// // //                         <div className="aspect-square rounded-lg overflow-hidden shadow-sm bg-gray-100">
// // //                           <img
// // //                             src={image.preview}
// // //                             alt={`Aperçu ${index + 1}`}
// // //                             className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
// // //                           />
// // //                         </div>
// // //                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
// // //                         <button
// // //                           type="button"
// // //                           onClick={(e) => {
// // //                             e.stopPropagation();
// // //                             removeImage(image.id);
// // //                           }}
// // //                           className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 hover:bg-red-600 shadow-md"
// // //                         >
// // //                           ×
// // //                         </button>
// // //                         <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
// // //                           {image.file.name}
// // //                         </div>
// // //                         <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
// // //                           #{index + 1}
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
       

// // //           {/* Boutons d'action */}
// // //           <div className="bg-gray-50 border-t border-gray-200 p-6">
// // //             <div className="flex gap-3">
// // //               <button
// // //                 type="button"
// // //                 onClick={handleCancel}
// // //                 className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
// // //               >
// // //                 Annuler
// // //               </button>
// // //               <button
// // //                 type="submit"
// // //                 disabled={isSubmitting || (locationMethod === 'map' && !location)}
// // //                 className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
// // //                   ${isSubmitting || (locationMethod === 'map' && !location)
// // //                     ? 'bg-gray-400 cursor-not-allowed transform scale-95'
// // //                     : 'bg-gradient-to-r from-[#ea80fc] to-purple-500 hover:from-[#d870eb] hover:to-purple-600 text-white transform hover:scale-[1.02] hover:shadow-xl active:scale-95'
// // //                   }`}
// // //               >
// // //                 {isSubmitting ? (
// // //                   <div className="flex items-center justify-center space-x-2">
// // //                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
// // //                     <span className="text-sm">Publication en cours...</span>
// // //                   </div>
// // //                 ) : (
// // //                   <div className="flex items-center justify-center space-x-2">
// // //                     <span>🚀</span>
// // //                     <span>Publier le bien</span>
// // //                   </div>
// // //                 )}
// // //               </button>
// // //             </div>
// // //             {locationMethod === 'map' && !location && (
// // //               <p className="text-red-500 text-sm mt-2 text-center">
// // //                 Veuillez sélectionner un emplacement sur la carte pour publier le bien
// // //               </p>
// // //             )}
// // //           </div>
// // //           </div>
// // //         </form>
        
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // src/components/AddPropertyForm.tsx
// // // import { useState, useRef } from 'react';
// // // import { X } from 'lucide-react';
// // // import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// // // import 'leaflet/dist/leaflet.css';
// // // import L from 'leaflet';

// // // // Fix pour les icônes Leaflet dans React
// // // delete (L.Icon.Default.prototype as any)._getIconUrl;
// // // L.Icon.Default.mergeOptions({
// // //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// // //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// // //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // // });

// // // interface AddPropertyFormProps {
// // //   ownerId: string;
// // //   onPropertyAdded: () => void;
// // //   onCancel: () => void;
// // // }

// // // interface UploadedImage {
// // //   file: File;
// // //   preview: string;
// // //   id: string;
// // // }

// // // // Composant pour gérer les clics sur la carte
// // // function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
// // //   useMapEvents({
// // //     click: (e) => {
// // //       const { lat, lng } = e.latlng;
// // //       onLocationSelect(lat, lng);
// // //     },
// // //   });
// // //   return null;
// // // }

// // // type LocationMethod = 'manual' | 'map';

// // // export default function AddPropertyForm({ ownerId, onPropertyAdded, onCancel }: AddPropertyFormProps) {
// // //   const [title, setTitle] = useState('');
// // //   const [description, setDescription] = useState('');
// // //   const [address, setAddress] = useState('');
// // //   const [city, setCity] = useState('');
// // //   const [country, setCountry] = useState('');
// // //   const [price, setPrice] = useState(100);
// // //   const [priceType, setPriceType] = useState<'night' | 'month'>('night');
// // //   const [bedrooms, setBedrooms] = useState(1);
// // //   const [bathrooms, setBathrooms] = useState(1);
// // //   const [maxGuests, setMaxGuests] = useState(2);
// // //   const [propertyType, setPropertyType] = useState('apartment');
// // //   const [amenities, setAmenities] = useState('');
// // //   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
// // //   const [error, setError] = useState('');
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [isDragging, setIsDragging] = useState(false);
// // //   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
// // //   const [selectedAddress, setSelectedAddress] = useState('');
// // //   const [isGeocoding, setIsGeocoding] = useState(false);
// // //   const [locationMethod, setLocationMethod] = useState<LocationMethod>('manual');
  
// // //   const fileInputRef = useRef<HTMLInputElement>(null);

// // //   const handleImageUpload = (files: FileList | null) => {
// // //     if (!files) return;

// // //     const newImages: UploadedImage[] = [];
    
// // //     Array.from(files).forEach(file => {
// // //       if (file.type.startsWith('image/')) {
// // //         if (file.size > 10 * 1024 * 1024) {
// // //           setError(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
// // //           return;
// // //         }
// // //         const preview = URL.createObjectURL(file);
// // //         newImages.push({
// // //           file,
// // //           preview,
// // //           id: Math.random().toString(36).substr(2, 9)
// // //         });
// // //       }
// // //     });

// // //     setUploadedImages(prev => [...prev, ...newImages]);
// // //     setError('');
// // //   };

// // //   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     handleImageUpload(e.target.files);
// // //     if (e.target) {
// // //       e.target.value = '';
// // //     }
// // //   };

// // //   const handleDragOver = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(true);
// // //   };

// // //   const handleDragLeave = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(false);
// // //   };

// // //   const handleDrop = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(false);
// // //     handleImageUpload(e.dataTransfer.files);
// // //   };

// // //   const removeImage = (id: string) => {
// // //     setUploadedImages(prev => {
// // //       const imageToRemove = prev.find(img => img.id === id);
// // //       if (imageToRemove) {
// // //         URL.revokeObjectURL(imageToRemove.preview);
// // //       }
// // //       return prev.filter(img => img.id !== id);
// // //     });
// // //   };

// // //   const handleFileSelect = () => {
// // //     fileInputRef.current?.click();
// // //   };

// // //   // Fonction améliorée pour le reverse geocoding avec gestion des quartiers et régions
// // //   const handleLocationSelect = async (lat: number, lng: number) => {
// // //     setLocation({ lat, lng });
// // //     setIsGeocoding(true);
    
// // //     try {
// // //       let addressData = null;
      
// // //       // Essayer d'abord Nominatim avec plus de détails
// // //       try {
// // //         const response = await fetch(
// // //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr&addressdetails=1&zoom=18`
// // //         );
        
// // //         if (response.ok) {
// // //           const data = await response.json();
// // //           if (data.address) {
// // //             addressData = data;
// // //           }
// // //         }
// // //       } catch (nominatimError) {
// // //         console.warn('Nominatim error:', nominatimError);
// // //       }

// // //       // Si pas de données d'adresse, utiliser les coordonnées
// // //       if (!addressData) {
// // //         const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// // //         setSelectedAddress(fallbackAddress);
// // //         setAddress(fallbackAddress);
// // //         setCity('');
// // //         setCountry('');
// // //         setIsGeocoding(false);
// // //         return;
// // //       }

// // //       const address = addressData.address;
      
// // //       // Construction intelligente de l'adresse avec hiérarchie des informations
// // //       const addressParts = [
// // //         address.road,
// // //         address.house_number,
// // //         address.pedestrian,
// // //         address.footway
// // //       ].filter(Boolean);

// // //       // Hiérarchie pour la ville : quartier -> ville -> municipalité -> région
// // //       const cityParts = [
// // //         address.quarter,       // Quartier
// // //         address.neighbourhood, // Voisinage
// // //         address.suburb,        // Banlieue
// // //         address.city,          // Ville
// // //         address.town,          // Ville
// // //         address.village,       // Village
// // //         address.municipality,  // Municipalité
// // //         address.county         // Département/Région
// // //       ].filter(Boolean);

// // //       // Hiérarchie pour le pays
// // //       const countryParts = [
// // //         address.country,
// // //         address.country_code ? address.country_code.toUpperCase() : null
// // //       ].filter(Boolean);

// // //       // Construction de l'adresse complète
// // //       let fullAddress = '';
      
// // //       if (addressParts.length > 0) {
// // //         fullAddress = addressParts.join(', ');
// // //       } else if (cityParts.length > 0) {
// // //         // Si pas d'adresse spécifique mais une zone identifiée
// // //         fullAddress = `Zone: ${cityParts[0]}`;
// // //       } else {
// // //         fullAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// // //       }

// // //       // Sélection de la ville : priorité aux informations locales
// // //       let cityName = '';
// // //       if (cityParts.length > 0) {
// // //         // Préférer les informations locales (quartier, voisinage) si disponibles
// // //         cityName = cityParts.find(part => 
// // //           part && ['quarter', 'neighbourhood', 'suburb'].includes(
// // //             Object.keys(address).find(key => address[key] === part) || ''
// // //           )
// // //         ) || cityParts[0];
// // //       }

// // //       const countryName = countryParts.length > 0 ? countryParts[0] : '';

// // //       setSelectedAddress(fullAddress);
// // //       setAddress(fullAddress);
// // //       setCity(cityName);
// // //       setCountry(countryName);

// // //       // Avertissement si l'adresse n'est pas précise
// // //       if (!address.road && !address.house_number) {
// // //         console.warn('Adresse non précise - zone générale sélectionnée');
// // //       }

// // //     } catch (error) {
// // //       console.error('Erreur lors du reverse geocoding:', error);
// // //       const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// // //       setSelectedAddress(fallbackAddress);
// // //       setAddress(fallbackAddress);
// // //       setCity('');
// // //       setCountry('');
// // //     } finally {
// // //       setIsGeocoding(false);
// // //     }
// // //   };

// // //   const handleLocationMethodChange = (method: LocationMethod) => {
// // //     setLocationMethod(method);
    
// // //     if (method === 'manual') {
// // //       setLocation(null);
// // //       setSelectedAddress('');
// // //       setAddress('');
// // //       setCity('');
// // //       setCountry('');
// // //     }
// // //   };

// // //   const uploadImagesToServer = async (images: UploadedImage[]): Promise<string[]> => {
// // //     if (images.length === 0) {
// // //       return ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// // //     }

// // //     const uploadedUrls: string[] = [];
    
// // //     for (const image of images) {
// // //       try {
// // //         const formData = new FormData();
// // //         formData.append('image', image.file);
        
// // //         const response = await fetch('https://api.imgbb.com/1/upload?key=ebd5c0e3afd3a5f8db71587bcc4841ed', {
// // //           method: 'POST',
// // //           body: formData,
// // //         });

// // //         if (!response.ok) {
// // //           continue;
// // //         }

// // //         const result = await response.json();
        
// // //         if (result.data && result.data.url) {
// // //           uploadedUrls.push(result.data.url);
// // //         }
// // //       } catch (error) {
// // //         console.error('Erreur upload image vers IMGbb:', error);
// // //       }
// // //     }

// // //     if (uploadedUrls.length > 0) {
// // //       return uploadedUrls;
// // //     }
    
// // //     return getFallbackImages();
// // //   };

// // //   const getFallbackImages = (): string[] => {
// // //     const placeholderImages = {
// // //       apartment: [
// // //         'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
// // //         'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
// // //       ],
// // //       house: [
// // //         'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
// // //         'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'
// // //       ],
// // //       villa: [
// // //         'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
// // //         'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg'
// // //       ],
// // //       studio: [
// // //         'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
// // //         'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg'
// // //       ],
// // //       loft: [
// // //         'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
// // //         'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg'
// // //       ],
// // //       chalet: [
// // //         'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
// // //         'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg'
// // //       ]
// // //     };

// // //     const imagesToUse = placeholderImages[propertyType as keyof typeof placeholderImages] || 
// // //                        placeholderImages.apartment;
    
// // //     return imagesToUse.slice(0, Math.min(uploadedImages.length + 1, 3));
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     setError('');
// // //     setIsSubmitting(true);

// // //     try {
// // //       // Validation des champs requis
// // //       if (!title.trim()) {
// // //         throw new Error('Le titre est requis');
// // //       }
// // //       if (!description.trim()) {
// // //         throw new Error('La description est requise');
// // //       }
// // //       if (!city.trim()) {
// // //         throw new Error('La ville est requise');
// // //       }
// // //       if (!country.trim()) {
// // //         throw new Error('Le pays est requis');
// // //       }
// // //       if (locationMethod === 'map' && !location) {
// // //         throw new Error('Veuillez sélectionner un emplacement sur la carte');
// // //       }
// // //       if (price <= 0) {
// // //         throw new Error('Le prix doit être supérieur à 0');
// // //       }

// // //       const amenitiesArray = amenities
// // //         .split(',')
// // //         .map(item => item.trim())
// // //         .filter(item => item !== '');

// // //       // Upload des images
// // //       let imageUrls: string[] = [];
      
// // //       if (uploadedImages.length > 0) {
// // //         try {
// // //           imageUrls = await uploadImagesToServer(uploadedImages);
// // //         } catch (uploadError) {
// // //           imageUrls = getFallbackImages();
// // //         }
// // //       } else {
// // //         imageUrls = ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// // //       }

// // //       // Préparer les données pour l'API
// // //       const propertyData = {
// // //         title: title.trim(),
// // //         description: description.trim(),
// // //         address: address.trim(),
// // //         city: city.trim(),
// // //         country: country.trim(),
// // //         latitude: locationMethod === 'map' ? location?.lat : null,
// // //         longitude: locationMethod === 'map' ? location?.lng : null,
// // //         price_per_night: Number(price),
// // //         price_type: priceType,
// // //         bedrooms: Number(bedrooms),
// // //         bathrooms: Number(bathrooms),
// // //         max_guests: Number(maxGuests),
// // //         property_type: propertyType,
// // //         amenities: amenitiesArray.length > 0 ? amenitiesArray : ['WiFi'],
// // //         images: imageUrls,
// // //         owner_id: ownerId,
// // //         is_available: true
// // //       };

// // //       const response = await fetch('http://localhost:5000/api/properties', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(propertyData),
// // //       });

// // //       const responseData = await response.json();

// // //       if (!response.ok) {
// // //         throw new Error(responseData.error || `Erreur ${response.status}: ${response.statusText}`);
// // //       }

// // //       // Nettoyer et réinitialiser
// // //       uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// // //       setUploadedImages([]);
// // //       setTitle('');
// // //       setDescription('');
// // //       setAddress('');
// // //       setCity('');
// // //       setCountry('');
// // //       setPrice(100);
// // //       setPriceType('night');
// // //       setBedrooms(1);
// // //       setBathrooms(1);
// // //       setMaxGuests(2);
// // //       setAmenities('');
// // //       setLocation(null);
// // //       setSelectedAddress('');
// // //       setLocationMethod('manual');
      
// // //       onPropertyAdded();
      
// // //     } catch (err: any) {
// // //       setError(
// // //         err.message || 
// // //         'Erreur lors de l\'ajout du bien. Vérifiez votre connexion et réessayez.'
// // //       );
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleCancel = () => {
// // //     uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// // //     setUploadedImages([]);
// // //     onCancel();
// // //   };

// // //   return (
// // //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in-0">
// // //       <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95">
// // //         {/* Header */}
// // //         <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 p-8 text-white relative">
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex-1">
// // //               <h1 className="text-2xl font-bold mb-2">Publier un nouveau bien</h1>
// // //               <p className="text-white/90 text-sm">
// // //                 Remplissez les détails de votre propriété pour commencer à recevoir des réservations
// // //               </p>
// // //             </div>
// // //             <button
// // //               onClick={handleCancel}
// // //               className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300 ml-4"
// // //             >
// // //               <X className="w-6 h-6 text-white" />
// // //             </button>
// // //           </div>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
// // //           <div className="p-8 space-y-8">
// // //             {error && (
// // //               <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-in fade-in-0">
// // //                 <div className="flex items-center">
// // //                   <div className="text-red-500 text-sm mr-2">⚠️</div>
// // //                   <p className="font-medium text-sm">{error}</p>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Section Informations principales */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Informations principales</h2>
// // //               </div>
              
// // //               <div className="space-y-4">
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
// // //                   <input
// // //                     type="text"
// // //                     value={title}
// // //                     onChange={(e) => setTitle(e.target.value)}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     placeholder="Ex: Magnifique appartement avec vue sur la mer"
// // //                     required
// // //                   />
// // //                 </div>

// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
// // //                   <textarea
// // //                     value={description}
// // //                     onChange={(e) => setDescription(e.target.value)}
// // //                     rows={4}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 resize-none"
// // //                     placeholder="Décrivez votre bien en détail..."
// // //                     required
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Section Localisation */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
// // //               </div>
              
// // //               {/* Sélection de la méthode de localisation */}
// // //               <div className="mb-6">
// // //                 <label className="block text-sm font-medium text-gray-700 mb-3">
// // //                   Comment souhaitez-vous localiser votre bien ? *
// // //                 </label>
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => handleLocationMethodChange('manual')}
// // //                     className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
// // //                       locationMethod === 'manual'
// // //                         ? 'border-[#ea80fc] bg-[#ea80fc]/10 shadow-md'
// // //                         : 'border-gray-300 bg-white hover:border-gray-400'
// // //                     }`}
// // //                   >
// // //                     <div className="flex items-center">
// // //                       <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
// // //                         locationMethod === 'manual'
// // //                           ? 'border-[#ea80fc] bg-[#ea80fc]'
// // //                           : 'border-gray-400'
// // //                       }`} />
// // //                       <div>
// // //                         <div className="font-semibold text-gray-900">📍 Saisie manuelle</div>
// // //                         <div className="text-sm text-gray-600 mt-1">
// // //                           Entrez l'adresse, ville et pays manuellement
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </button>
                  
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => handleLocationMethodChange('map')}
// // //                     className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
// // //                       locationMethod === 'map'
// // //                         ? 'border-[#ea80fc] bg-[#ea80fc]/10 shadow-md'
// // //                         : 'border-gray-300 bg-white hover:border-gray-400'
// // //                     }`}
// // //                   >
// // //                     <div className="flex items-center">
// // //                       <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
// // //                         locationMethod === 'map'
// // //                           ? 'border-[#ea80fc] bg-[#ea80fc]'
// // //                           : 'border-gray-400'
// // //                       }`} />
// // //                       <div>
// // //                         <div className="font-semibold text-gray-900">🗺️ Sélection sur carte</div>
// // //                         <div className="text-sm text-gray-600 mt-1">
// // //                           Cliquez sur la carte pour sélectionner l'emplacement
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               {/* Mode Manuel */}
// // //               {locationMethod === 'manual' && (
// // //                 <div className="space-y-4 animate-fade-in">
// // //                   <div className="grid grid-cols-1 gap-4">
// // //                     <div className="group">
// // //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                         Adresse *
// // //                       </label>
// // //                       <input
// // //                         type="text"
// // //                         value={address}
// // //                         onChange={(e) => setAddress(e.target.value)}
// // //                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                         placeholder="Ex: 123 Avenue des Champs-Élysées"
// // //                         required
// // //                       />
// // //                     </div>
                    
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Ville *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={city}
// // //                           onChange={(e) => setCity(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           placeholder="Ex: Paris"
// // //                           required
// // //                         />
// // //                       </div>
                      
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Pays *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={country}
// // //                           onChange={(e) => setCountry(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           placeholder="Ex: France"
// // //                           required
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {/* Mode Carte */}
// // //               {locationMethod === 'map' && (
// // //                 <div className="space-y-4 animate-fade-in">
// // //                   {/* Carte interactive */}
// // //                   <div className="mb-4">
// // //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                       Sélectionnez l'emplacement sur la carte *
// // //                       {location && (
// // //                         <span className="text-green-600 ml-2 text-sm">
// // //                           ✓ Emplacement sélectionné
// // //                         </span>
// // //                       )}
// // //                     </label>
// // //                     <div className="h-64 rounded-xl overflow-hidden border border-gray-300 relative">
// // //                       {isGeocoding && (
// // //                         <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
// // //                           <div className="text-gray-600 text-sm">
// // //                             Recherche de l'adresse...
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                       <MapContainer
// // //                         center={[20, 0]} // Centre sur l'équateur
// // //                         zoom={2}
// // //                         style={{ height: '100%', width: '100%' }}
// // //                       >
// // //                         <TileLayer
// // //                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // //                           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// // //                         />
// // //                         <MapClickHandler onLocationSelect={handleLocationSelect} />
// // //                         {location && (
// // //                           <Marker position={[location.lat, location.lng]} />
// // //                         )}
// // //                       </MapContainer>
// // //                     </div>
// // //                     <p className="text-sm text-gray-500 mt-2">
// // //                       Cliquez sur la carte pour positionner votre bien. L'adresse sera générée automatiquement.
// // //                     </p>
// // //                   </div>

// // //                   {/* Adresse automatiquement remplie */}
// // //                   <div className="grid grid-cols-1 gap-4">
// // //                     <div className="group">
// // //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                         Adresse générée automatiquement
// // //                       </label>
// // //                       <input
// // //                         type="text"
// // //                         value={selectedAddress || "Cliquez sur la carte pour générer l'adresse"}
// // //                         readOnly
// // //                         className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
// // //                       />
// // //                     </div>
                    
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Ville *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={city}
// // //                           onChange={(e) => setCity(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           placeholder="La ville sera détectée automatiquement"
// // //                           required
// // //                         />
// // //                       </div>
                      
// // //                       <div className="group">
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Pays *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           value={country}
// // //                           onChange={(e) => setCountry(e.target.value)}
// // //                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                           placeholder="Le pays sera détecté automatiquement"
// // //                           required
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   {/* Message d'information */}
// // //                   {selectedAddress && selectedAddress.includes('Position:') && (
// // //                     <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
// // //                       <div className="flex items-center">
// // //                         <div className="text-yellow-600 text-sm mr-2">💡</div>
// // //                         <div>
// // //                           <p className="text-yellow-800 text-sm font-medium">
// // //                             Adresse non détectée automatiquement
// // //                           </p>
// // //                           <p className="text-yellow-700 text-xs mt-1">
// // //                             Veuillez saisir manuellement le nom de la ville et du pays pour une localisation précise.
// // //                           </p>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* Section Détails du bien */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Détails du bien</h2>
// // //               </div>
              
// // //               {/* Prix avec sélection jour/mois */}
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
// // //                   <div className="relative">
// // //                     <input
// // //                       type="number"
// // //                       min="1"
// // //                       value={price}
// // //                       onChange={(e) => setPrice(Number(e.target.value))}
// // //                       className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                       required
// // //                     />
// // //                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
// // //                       <select
// // //                         value={priceType}
// // //                         onChange={(e) => setPriceType(e.target.value as 'night' | 'month')}
// // //                         className="bg-transparent border-none text-gray-600 text-sm focus:ring-0 focus:outline-none appearance-none pr-6"
// // //                       >
// // //                         <option value="night">€/nuit</option>
// // //                         <option value="month">€/mois</option>
// // //                       </select>
// // //                     </div>
// // //                   </div>
// // //                 </div>
                
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
// // //                   <select
// // //                     value={propertyType}
// // //                     onChange={(e) => setPropertyType(e.target.value)}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 appearance-none"
// // //                   >
// // //                     <option value="apartment">🏢 Appartement</option>
// // //                     <option value="house">🏠 Maison</option>
// // //                     <option value="villa">🏡 Villa</option>
// // //                     <option value="studio">🔧 Studio</option>
// // //                     <option value="loft">🏭 Loft</option>
// // //                     <option value="chalet">⛰️ Chalet</option>
// // //                   </select>
// // //                 </div>
// // //               </div>

// // //               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Chambres *</label>
// // //                   <input
// // //                     type="number"
// // //                     min="1"
// // //                     value={bedrooms}
// // //                     onChange={(e) => setBedrooms(Number(e.target.value))}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     required
// // //                   />
// // //                 </div>
                
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Salles de bain *</label>
// // //                   <input
// // //                     type="number"
// // //                     min="1"
// // //                     value={bathrooms}
// // //                     onChange={(e) => setBathrooms(Number(e.target.value))}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     required
// // //                   />
// // //                 </div>
                
// // //                 <div className="group">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-2">Voyageurs max *</label>
// // //                   <input
// // //                     type="number"
// // //                     min="1"
// // //                     value={maxGuests}
// // //                     onChange={(e) => setMaxGuests(Number(e.target.value))}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                     required
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div className="mt-4 group">
// // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                   Équipements
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   value={amenities}
// // //                   onChange={(e) => setAmenities(e.target.value)}
// // //                   placeholder="WiFi, Parking, Piscine, Climatisation..."
// // //                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// // //                 />
// // //               </div>
// // //             </div>

// // //             {/* Section Images */}
// // //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// // //               <div className="flex items-center mb-6">
// // //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// // //                 <h2 className="text-lg font-semibold text-gray-900">Galerie photos</h2>
// // //               </div>
              
// // //               <input
// // //                 type="file"
// // //                 ref={fileInputRef}
// // //                 onChange={handleFileInputChange}
// // //                 multiple
// // //                 accept="image/*"
// // //                 className="hidden"
// // //               />
              
// // //               <div 
// // //                 className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-6
// // //                   ${isDragging 
// // //                     ? 'border-[#ea80fc] bg-[#ea80fc]/10 scale-[1.02] shadow-md' 
// // //                     : 'border-gray-300 bg-white hover:border-[#ea80fc] hover:bg-[#ea80fc]/5'
// // //                   }`}
// // //                 onClick={handleFileSelect}
// // //                 onDragOver={handleDragOver}
// // //                 onDragLeave={handleDragLeave}
// // //                 onDrop={handleDrop}
// // //               >
// // //                 <div className="text-4xl mb-4">📸</div>
// // //                 <p className="text-base font-semibold text-gray-800 mb-2">
// // //                   {isDragging ? 'Lâchez pour déposer' : 'Ajoutez vos photos'}
// // //                 </p>
// // //                 <p className="text-gray-600 text-sm mb-1">
// // //                   Glissez-déposez vos images ou <span className="text-[#ea80fc] font-medium">parcourez vos fichiers</span>
// // //                 </p>
// // //                 <p className="text-gray-400 text-xs">
// // //                   PNG, JPG, JPEG jusqu'à 10MB • Maximum 10 images
// // //                 </p>
// // //               </div>

// // //               {uploadedImages.length > 0 && (
// // //                 <div className="animate-fade-in">
// // //                   <div className="flex items-center justify-between mb-4">
// // //                     <h3 className="text-base font-semibold text-gray-900">
// // //                       Photos sélectionnées ({uploadedImages.length})
// // //                       <span className="text-[#ea80fc] ml-2">
// // //                         {uploadedImages.length > 0 ? '✓ Prêtes à être uploadées' : ''}
// // //                       </span>
// // //                     </h3>
// // //                     <button
// // //                       type="button"
// // //                       onClick={handleFileSelect}
// // //                       className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all duration-300"
// // //                     >
// // //                       + Ajouter plus
// // //                     </button>
// // //                   </div>
// // //                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
// // //                     {uploadedImages.map((image, index) => (
// // //                       <div 
// // //                         key={image.id} 
// // //                         className="relative group animate-scale-in"
// // //                         style={{ animationDelay: `${index * 100}ms` }}
// // //                       >
// // //                         <div className="aspect-square rounded-lg overflow-hidden shadow-sm bg-gray-100">
// // //                           <img
// // //                             src={image.preview}
// // //                             alt={`Aperçu ${index + 1}`}
// // //                             className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
// // //                           />
// // //                         </div>
// // //                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
// // //                         <button
// // //                           type="button"
// // //                           onClick={(e) => {
// // //                             e.stopPropagation();
// // //                             removeImage(image.id);
// // //                           }}
// // //                           className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 hover:bg-red-600 shadow-md"
// // //                         >
// // //                           ×
// // //                         </button>
// // //                         <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
// // //                           {image.file.name}
// // //                         </div>
// // //                         <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
// // //                           #{index + 1}
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Boutons d'action */}
// // //           <div className="bg-gray-50 border-t border-gray-200 p-6">
// // //             <div className="flex gap-3">
// // //               <button
// // //                 type="button"
// // //                 onClick={handleCancel}
// // //                 className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
// // //               >
// // //                 Annuler
// // //               </button>
// // //               <button
// // //                 type="submit"
// // //                 disabled={isSubmitting || (locationMethod === 'map' && !location)}
// // //                 className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
// // //                   ${isSubmitting || (locationMethod === 'map' && !location)
// // //                     ? 'bg-gray-400 cursor-not-allowed transform scale-95'
// // //                     : 'bg-gradient-to-r from-[#ea80fc] to-purple-500 hover:from-[#d870eb] hover:to-purple-600 text-white transform hover:scale-[1.02] hover:shadow-xl active:scale-95'
// // //                   }`}
// // //               >
// // //                 {isSubmitting ? (
// // //                   <div className="flex items-center justify-center space-x-2">
// // //                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
// // //                     <span className="text-sm">Publication en cours...</span>
// // //                   </div>
// // //                 ) : (
// // //                   <div className="flex items-center justify-center space-x-2">
// // //                     <span>🚀</span>
// // //                     <span>Publier le bien</span>
// // //                   </div>
// // //                 )}
// // //               </button>
// // //             </div>
// // //             {locationMethod === 'map' && !location && (
// // //               <p className="text-red-500 text-sm mt-2 text-center">
// // //                 Veuillez sélectionner un emplacement sur la carte pour publier le bien
// // //               </p>
// // //             )}
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // src/components/AddPropertyForm.tsx
// // import { useState, useRef } from 'react';
// // import { X } from 'lucide-react';
// // import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import L from 'leaflet';

// // // Fix pour les icônes Leaflet dans React
// // delete (L.Icon.Default.prototype as any)._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // });

// // interface AddPropertyFormProps {
// //   ownerId: string;
// //   onPropertyAdded: () => void;
// //   onCancel: () => void;
// // }

// // interface UploadedImage {
// //   file: File;
// //   preview: string;
// //   id: string;
// // }

// // // Composant pour gérer les clics sur la carte
// // function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
// //   useMapEvents({
// //     click: (e) => {
// //       const { lat, lng } = e.latlng;
// //       onLocationSelect(lat, lng);
// //     },
// //   });
// //   return null;
// // }

// // export default function AddPropertyForm({ ownerId, onPropertyAdded, onCancel }: AddPropertyFormProps) {
// //   const [title, setTitle] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [address, setAddress] = useState('');
// //   const [city, setCity] = useState('');
// //   const [country, setCountry] = useState('');
// //   const [price, setPrice] = useState(100);
// //   const [priceType, setPriceType] = useState<'night' | 'month'>('night');
// //   const [bedrooms, setBedrooms] = useState(1);
// //   const [bathrooms, setBathrooms] = useState(1);
// //   const [maxGuests, setMaxGuests] = useState(2);
// //   const [propertyType, setPropertyType] = useState('apartment');
// //   const [amenities, setAmenities] = useState('');
// //   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
// //   const [error, setError] = useState('');
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [isDragging, setIsDragging] = useState(false);
// //   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
// //   const [selectedAddress, setSelectedAddress] = useState('');
// //   const [isGeocoding, setIsGeocoding] = useState(false);
  
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const handleImageUpload = (files: FileList | null) => {
// //     if (!files) return;

// //     const newImages: UploadedImage[] = [];
    
// //     Array.from(files).forEach(file => {
// //       if (file.type.startsWith('image/')) {
// //         if (file.size > 10 * 1024 * 1024) {
// //           setError(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
// //           return;
// //         }
// //         const preview = URL.createObjectURL(file);
// //         newImages.push({
// //           file,
// //           preview,
// //           id: Math.random().toString(36).substr(2, 9)
// //         });
// //       }
// //     });

// //     setUploadedImages(prev => [...prev, ...newImages]);
// //     setError('');
// //   };

// //   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     handleImageUpload(e.target.files);
// //     if (e.target) {
// //       e.target.value = '';
// //     }
// //   };

// //   const handleDragOver = (e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragging(true);
// //   };

// //   const handleDragLeave = (e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragging(false);
// //   };

// //   const handleDrop = (e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragging(false);
// //     handleImageUpload(e.dataTransfer.files);
// //   };

// //   const removeImage = (id: string) => {
// //     setUploadedImages(prev => {
// //       const imageToRemove = prev.find(img => img.id === id);
// //       if (imageToRemove) {
// //         URL.revokeObjectURL(imageToRemove.preview);
// //       }
// //       return prev.filter(img => img.id !== id);
// //     });
// //   };

// //   const handleFileSelect = () => {
// //     fileInputRef.current?.click();
// //   };

// //   // Fonction améliorée pour le reverse geocoding avec gestion des quartiers et régions
// //   const handleLocationSelect = async (lat: number, lng: number) => {
// //     setLocation({ lat, lng });
// //     setIsGeocoding(true);
    
// //     try {
// //       let addressData = null;
      
// //       // Essayer d'abord Nominatim avec plus de détails
// //       try {
// //         const response = await fetch(
// //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr&addressdetails=1&zoom=18`
// //         );
        
// //         if (response.ok) {
// //           const data = await response.json();
// //           if (data.address) {
// //             addressData = data;
// //           }
// //         }
// //       } catch (nominatimError) {
// //         console.warn('Nominatim error:', nominatimError);
// //       }

// //       // Si pas de données d'adresse, utiliser les coordonnées
// //       if (!addressData) {
// //         const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// //         setSelectedAddress(fallbackAddress);
// //         setAddress(fallbackAddress);
// //         setCity('');
// //         setCountry('');
// //         setIsGeocoding(false);
// //         return;
// //       }

// //       const address = addressData.address;
      
// //       // Construction intelligente de l'adresse avec hiérarchie des informations
// //       const addressParts = [
// //         address.road,
// //         address.house_number,
// //         address.pedestrian,
// //         address.footway
// //       ].filter(Boolean);

// //       // Hiérarchie pour la ville : quartier -> ville -> municipalité -> région
// //       const cityParts = [
// //         address.quarter,       // Quartier
// //         address.neighbourhood, // Voisinage
// //         address.suburb,        // Banlieue
// //         address.city,          // Ville
// //         address.town,          // Ville
// //         address.village,       // Village
// //         address.municipality,  // Municipalité
// //         address.county         // Département/Région
// //       ].filter(Boolean);

// //       // Hiérarchie pour le pays
// //       const countryParts = [
// //         address.country,
// //         address.country_code ? address.country_code.toUpperCase() : null
// //       ].filter(Boolean);

// //       // Construction de l'adresse complète
// //       let fullAddress = '';
      
// //       if (addressParts.length > 0) {
// //         fullAddress = addressParts.join(', ');
// //       } else if (cityParts.length > 0) {
// //         // Si pas d'adresse spécifique mais une zone identifiée
// //         fullAddress = `Zone: ${cityParts[0]}`;
// //       } else {
// //         fullAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// //       }

// //       // Sélection de la ville : priorité aux informations locales
// //       let cityName = '';
// //       if (cityParts.length > 0) {
// //         // Préférer les informations locales (quartier, voisinage) si disponibles
// //         cityName = cityParts.find(part => 
// //           part && ['quarter', 'neighbourhood', 'suburb'].includes(
// //             Object.keys(address).find(key => address[key] === part) || ''
// //           )
// //         ) || cityParts[0];
// //       }

// //       const countryName = countryParts.length > 0 ? countryParts[0] : '';

// //       setSelectedAddress(fullAddress);
// //       setAddress(fullAddress);
// //       setCity(cityName);
// //       setCountry(countryName);

// //       // Avertissement si l'adresse n'est pas précise
// //       if (!address.road && !address.house_number) {
// //         console.warn('Adresse non précise - zone générale sélectionnée');
// //       }

// //     } catch (error) {
// //       console.error('Erreur lors du reverse geocoding:', error);
// //       const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// //       setSelectedAddress(fallbackAddress);
// //       setAddress(fallbackAddress);
// //       setCity('');
// //       setCountry('');
// //     } finally {
// //       setIsGeocoding(false);
// //     }
// //   };

// //   const uploadImagesToServer = async (images: UploadedImage[]): Promise<string[]> => {
// //     if (images.length === 0) {
// //       return ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// //     }

// //     const uploadedUrls: string[] = [];
    
// //     for (const image of images) {
// //       try {
// //         const formData = new FormData();
// //         formData.append('image', image.file);
        
// //         const response = await fetch('https://api.imgbb.com/1/upload?key=ebd5c0e3afd3a5f8db71587bcc4841ed', {
// //           method: 'POST',
// //           body: formData,
// //         });

// //         if (!response.ok) {
// //           continue;
// //         }

// //         const result = await response.json();
        
// //         if (result.data && result.data.url) {
// //           uploadedUrls.push(result.data.url);
// //         }
// //       } catch (error) {
// //         console.error('Erreur upload image vers IMGbb:', error);
// //       }
// //     }

// //     if (uploadedUrls.length > 0) {
// //       return uploadedUrls;
// //     }
    
// //     return getFallbackImages();
// //   };

// //   const getFallbackImages = (): string[] => {
// //     const placeholderImages = {
// //       apartment: [
// //         'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
// //         'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
// //       ],
// //       house: [
// //         'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
// //         'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'
// //       ],
// //       villa: [
// //         'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
// //         'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg'
// //       ],
// //       studio: [
// //         'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
// //         'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg'
// //       ],
// //       loft: [
// //         'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
// //         'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg'
// //       ],
// //       chalet: [
// //         'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
// //         'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg'
// //       ]
// //     };

// //     const imagesToUse = placeholderImages[propertyType as keyof typeof placeholderImages] || 
// //                        placeholderImages.apartment;
    
// //     return imagesToUse.slice(0, Math.min(uploadedImages.length + 1, 3));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError('');
// //     setIsSubmitting(true);

// //     try {
// //       // Validation des champs requis
// //       if (!title.trim()) {
// //         throw new Error('Le titre est requis');
// //       }
// //       if (!description.trim()) {
// //         throw new Error('La description est requise');
// //       }
// //       if (!city.trim()) {
// //         throw new Error('La ville est requise');
// //       }
// //       if (!country.trim()) {
// //         throw new Error('Le pays est requis');
// //       }
// //       if (!location) {
// //         throw new Error('Veuillez sélectionner un emplacement sur la carte');
// //       }
// //       if (price <= 0) {
// //         throw new Error('Le prix doit être supérieur à 0');
// //       }

// //       const amenitiesArray = amenities
// //         .split(',')
// //         .map(item => item.trim())
// //         .filter(item => item !== '');

// //       // Upload des images
// //       let imageUrls: string[] = [];
      
// //       if (uploadedImages.length > 0) {
// //         try {
// //           imageUrls = await uploadImagesToServer(uploadedImages);
// //         } catch (uploadError) {
// //           imageUrls = getFallbackImages();
// //         }
// //       } else {
// //         imageUrls = ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
// //       }

// //       // Préparer les données pour l'API
// //       const propertyData = {
// //         title: title.trim(),
// //         description: description.trim(),
// //         address: address.trim(),
// //         city: city.trim(),
// //         country: country.trim(),
// //         latitude: location.lat,
// //         longitude: location.lng,
// //         price_per_night: Number(price),
// //         price_type: priceType,
// //         bedrooms: Number(bedrooms),
// //         bathrooms: Number(bathrooms),
// //         max_guests: Number(maxGuests),
// //         property_type: propertyType,
// //         amenities: amenitiesArray.length > 0 ? amenitiesArray : ['WiFi'],
// //         images: imageUrls,
// //         owner_id: ownerId,
// //         is_available: true
// //       };

// //       const response = await fetch('http://localhost:5000/api/properties', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(propertyData),
// //       });

// //       const responseData = await response.json();

// //       if (!response.ok) {
// //         throw new Error(responseData.error || `Erreur ${response.status}: ${response.statusText}`);
// //       }

// //       // Nettoyer et réinitialiser
// //       uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// //       setUploadedImages([]);
// //       setTitle('');
// //       setDescription('');
// //       setAddress('');
// //       setCity('');
// //       setCountry('');
// //       setPrice(100);
// //       setPriceType('night');
// //       setBedrooms(1);
// //       setBathrooms(1);
// //       setMaxGuests(2);
// //       setAmenities('');
// //       setLocation(null);
// //       setSelectedAddress('');
      
// //       onPropertyAdded();
      
// //     } catch (err: any) {
// //       setError(
// //         err.message || 
// //         'Erreur lors de l\'ajout du bien. Vérifiez votre connexion et réessayez.'
// //       );
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleCancel = () => {
// //     uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
// //     setUploadedImages([]);
// //     onCancel();
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in-0">
// //       <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95">
// //         {/* Header */}
// //         <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 p-8 text-white relative">
// //           <div className="flex items-center justify-between">
// //             <div className="flex-1">
// //               <h1 className="text-2xl font-bold mb-2">Publier un nouveau bien</h1>
// //               <p className="text-white/90 text-sm">
// //                 Remplissez les détails de votre propriété pour commencer à recevoir des réservations
// //               </p>
// //             </div>
// //             <button
// //               onClick={handleCancel}
// //               className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300 ml-4"
// //             >
// //               <X className="w-6 h-6 text-white" />
// //             </button>
// //           </div>
// //         </div>

// //         <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
// //           <div className="p-8 space-y-8">
// //             {error && (
// //               <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-in fade-in-0">
// //                 <div className="flex items-center">
// //                   <div className="text-red-500 text-sm mr-2">⚠️</div>
// //                   <p className="font-medium text-sm">{error}</p>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Section Informations principales */}
// //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// //               <div className="flex items-center mb-6">
// //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// //                 <h2 className="text-lg font-semibold text-gray-900">Informations principales</h2>
// //               </div>
              
// //               <div className="space-y-4">
// //                 <div className="group">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
// //                   <input
// //                     type="text"
// //                     value={title}
// //                     onChange={(e) => setTitle(e.target.value)}
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// //                     placeholder="Ex: Magnifique appartement avec vue sur la mer"
// //                     required
// //                   />
// //                 </div>

// //                 <div className="group">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
// //                   <textarea
// //                     value={description}
// //                     onChange={(e) => setDescription(e.target.value)}
// //                     rows={4}
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 resize-none"
// //                     placeholder="Décrivez votre bien en détail..."
// //                     required
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Section Localisation */}
// //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// //               <div className="flex items-center mb-6">
// //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// //                 <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
// //               </div>
              
// //               <div className="mb-4">
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Sélectionnez l'emplacement sur la carte *
// //                   {location && (
// //                     <span className="text-green-600 ml-2 text-sm">
// //                       ✓ Emplacement sélectionné
// //                     </span>
// //                   )}
// //                 </label>
// //                 <div className="h-64 rounded-xl overflow-hidden border border-gray-300 relative">
// //                   {isGeocoding && (
// //                     <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
// //                       <div className="text-gray-600 text-sm">
// //                         Recherche de l'adresse...
// //                       </div>
// //                     </div>
// //                   )}
// //                   <MapContainer
// //                     center={[20, 0]} // Centre sur l'équateur
// //                     zoom={2}
// //                     style={{ height: '100%', width: '100%' }}
// //                   >
// //                     <TileLayer
// //                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// //                     />
// //                     <MapClickHandler onLocationSelect={handleLocationSelect} />
// //                     {location && (
// //                       <Marker position={[location.lat, location.lng]} />
// //                     )}
// //                   </MapContainer>
// //                 </div>
// //                 <p className="text-sm text-gray-500 mt-2">
// //                   Cliquez sur la carte pour positionner votre bien. L'adresse sera générée automatiquement.
// //                 </p>
// //               </div>

// //               {/* Adresse automatiquement remplie */}
// //               <div className="grid grid-cols-1 gap-4">
// //                 <div className="group">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Adresse générée automatiquement
// //                   </label>
// //                   <input
// //                     type="text"
// //                     value={selectedAddress || "Cliquez sur la carte pour générer l'adresse"}
// //                     readOnly
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
// //                   />
// //                 </div>
                
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div className="group">
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Ville *
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={city}
// //                       onChange={(e) => setCity(e.target.value)}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// //                       placeholder="La ville sera détectée automatiquement"
// //                       required
// //                     />
// //                   </div>
                  
// //                   <div className="group">
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Pays *
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={country}
// //                       onChange={(e) => setCountry(e.target.value)}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// //                       placeholder="Le pays sera détecté automatiquement"
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Message d'information */}
// //               {selectedAddress && selectedAddress.includes('Position:') && (
// //                 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
// //                   <div className="flex items-center">
// //                     <div className="text-yellow-600 text-sm mr-2">💡</div>
// //                     <div>
// //                       <p className="text-yellow-800 text-sm font-medium">
// //                         Adresse non détectée automatiquement
// //                       </p>
// //                       <p className="text-yellow-700 text-xs mt-1">
// //                         Veuillez saisir manuellement le nom de la ville et du pays pour une localisation précise.
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Section Détails du bien */}
// //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// //               <div className="flex items-center mb-6">
// //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// //                 <h2 className="text-lg font-semibold text-gray-900">Détails du bien</h2>
// //               </div>
              
// //               {/* Prix avec sélection jour/mois */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //                 <div className="group">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
// //                   <div className="relative">
// //                     <input
// //                       type="number"
// //                       min="1"
// //                       value={price}
// //                       onChange={(e) => setPrice(Number(e.target.value))}
// //                       className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// //                       required
// //                     />
// //                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
// //                       <select
// //                         value={priceType}
// //                         onChange={(e) => setPriceType(e.target.value as 'night' | 'month')}
// //                         className="bg-transparent border-none text-gray-600 text-sm focus:ring-0 focus:outline-none appearance-none pr-6"
// //                       >
// //                         <option value="night">€/nuit</option>
// //                         <option value="month">€/mois</option>
// //                       </select>
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 <div className="group">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
// //                   <select
// //                     value={propertyType}
// //                     onChange={(e) => setPropertyType(e.target.value)}
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 appearance-none"
// //                   >
// //                     <option value="apartment">🏢 Appartement</option>
// //                     <option value="house">🏠 Maison</option>
// //                     <option value="villa">🏡 Villa</option>
// //                     <option value="studio">🔧 Studio</option>
// //                     <option value="loft">🏭 Loft</option>
// //                     <option value="chalet">⛰️ Chalet</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// //                 <div className="group">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Chambres *</label>
// //                   <input
// //                     type="number"
// //                     min="1"
// //                     value={bedrooms}
// //                     onChange={(e) => setBedrooms(Number(e.target.value))}
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// //                     required
// //                   />
// //                 </div>
                
// //                 <div className="group">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Salles de bain *</label>
// //                   <input
// //                     type="number"
// //                     min="1"
// //                     value={bathrooms}
// //                     onChange={(e) => setBathrooms(Number(e.target.value))}
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// //                     required
// //                   />
// //                 </div>
                
// //                 <div className="group">
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Voyageurs max *</label>
// //                   <input
// //                     type="number"
// //                     min="1"
// //                     value={maxGuests}
// //                     onChange={(e) => setMaxGuests(Number(e.target.value))}
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <div className="mt-4 group">
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Équipements
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={amenities}
// //                   onChange={(e) => setAmenities(e.target.value)}
// //                   placeholder="WiFi, Parking, Piscine, Climatisation..."
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
// //                 />
// //               </div>
// //             </div>

// //             {/* Section Images */}
// //             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
// //               <div className="flex items-center mb-6">
// //                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
// //                 <h2 className="text-lg font-semibold text-gray-900">Galerie photos</h2>
// //               </div>
              
// //               <input
// //                 type="file"
// //                 ref={fileInputRef}
// //                 onChange={handleFileInputChange}
// //                 multiple
// //                 accept="image/*"
// //                 className="hidden"
// //               />
              
// //               <div 
// //                 className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-6
// //                   ${isDragging 
// //                     ? 'border-[#ea80fc] bg-[#ea80fc]/10 scale-[1.02] shadow-md' 
// //                     : 'border-gray-300 bg-white hover:border-[#ea80fc] hover:bg-[#ea80fc]/5'
// //                   }`}
// //                 onClick={handleFileSelect}
// //                 onDragOver={handleDragOver}
// //                 onDragLeave={handleDragLeave}
// //                 onDrop={handleDrop}
// //               >
// //                 <div className="text-4xl mb-4">📸</div>
// //                 <p className="text-base font-semibold text-gray-800 mb-2">
// //                   {isDragging ? 'Lâchez pour déposer' : 'Ajoutez vos photos'}
// //                 </p>
// //                 <p className="text-gray-600 text-sm mb-1">
// //                   Glissez-déposez vos images ou <span className="text-[#ea80fc] font-medium">parcourez vos fichiers</span>
// //                 </p>
// //                 <p className="text-gray-400 text-xs">
// //                   PNG, JPG, JPEG jusqu'à 10MB • Maximum 10 images
// //                 </p>
// //               </div>

// //               {uploadedImages.length > 0 && (
// //                 <div className="animate-fade-in">
// //                   <div className="flex items-center justify-between mb-4">
// //                     <h3 className="text-base font-semibold text-gray-900">
// //                       Photos sélectionnées ({uploadedImages.length})
// //                       <span className="text-[#ea80fc] ml-2">
// //                         {uploadedImages.length > 0 ? '✓ Prêtes à être uploadées' : ''}
// //                       </span>
// //                     </h3>
// //                     <button
// //                       type="button"
// //                       onClick={handleFileSelect}
// //                       className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all duration-300"
// //                     >
// //                       + Ajouter plus
// //                     </button>
// //                   </div>
// //                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
// //                     {uploadedImages.map((image, index) => (
// //                       <div 
// //                         key={image.id} 
// //                         className="relative group animate-scale-in"
// //                         style={{ animationDelay: `${index * 100}ms` }}
// //                       >
// //                         <div className="aspect-square rounded-lg overflow-hidden shadow-sm bg-gray-100">
// //                           <img
// //                             src={image.preview}
// //                             alt={`Aperçu ${index + 1}`}
// //                             className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
// //                           />
// //                         </div>
// //                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
// //                         <button
// //                           type="button"
// //                           onClick={(e) => {
// //                             e.stopPropagation();
// //                             removeImage(image.id);
// //                           }}
// //                           className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 hover:bg-red-600 shadow-md"
// //                         >
// //                           ×
// //                         </button>
// //                         <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
// //                           {image.file.name}
// //                         </div>
// //                         <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
// //                           #{index + 1}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Boutons d'action */}
// //           <div className="bg-gray-50 border-t border-gray-200 p-6">
// //             <div className="flex gap-3">
// //               <button
// //                 type="button"
// //                 onClick={handleCancel}
// //                 className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
// //               >
// //                 Annuler
// //               </button>
// //               <button
// //                 type="submit"
// //                 disabled={isSubmitting || !location}
// //                 className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
// //                   ${isSubmitting || !location
// //                     ? 'bg-gray-400 cursor-not-allowed transform scale-95'
// //                     : 'bg-gradient-to-r from-[#ea80fc] to-purple-500 hover:from-[#d870eb] hover:to-purple-600 text-white transform hover:scale-[1.02] hover:shadow-xl active:scale-95'
// //                   }`}
// //               >
// //                 {isSubmitting ? (
// //                   <div className="flex items-center justify-center space-x-2">
// //                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
// //                     <span className="text-sm">Publication en cours...</span>
// //                   </div>
// //                 ) : (
// //                   <div className="flex items-center justify-center space-x-2">
// //                     <span>🚀</span>
// //                     <span>Publier le bien</span>
// //                   </div>
// //                 )}
// //               </button>
// //             </div>
// //             {!location && (
// //               <p className="text-red-500 text-sm mt-2 text-center">
// //                 Veuillez sélectionner un emplacement sur la carte pour publier le bien
// //               </p>
// //             )}
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // src/components/AddPropertyForm.tsx
// import { useState, useRef } from 'react';
// import { X } from 'lucide-react';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix pour les icônes Leaflet dans React
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// interface AddPropertyFormProps {
//   ownerId: string;
//   onPropertyAdded: () => void;
//   onCancel: () => void;
// }

// interface UploadedImage {
//   file: File;
//   preview: string;
//   id: string;
// }

// // Composant pour gérer les clics sur la carte
// function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
//   useMapEvents({
//     click: (e) => {
//       const { lat, lng } = e.latlng;
//       onLocationSelect(lat, lng);
//     },
//   });
//   return null;
// }

// export default function AddPropertyForm({ ownerId, onPropertyAdded, onCancel }: AddPropertyFormProps) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [address, setAddress] = useState('');
//   const [city, setCity] = useState('');
//   const [country, setCountry] = useState('');
//   const [price, setPrice] = useState(100);
//   const [priceType, setPriceType] = useState<'night' | 'month'>('night');
//   const [bedrooms, setBedrooms] = useState(1);
//   const [bathrooms, setBathrooms] = useState(1);
//   const [maxGuests, setMaxGuests] = useState(2);
//   const [propertyType, setPropertyType] = useState('apartment');
//   const [amenities, setAmenities] = useState('');
//   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [selectedAddress, setSelectedAddress] = useState('');
//   const [isGeocoding, setIsGeocoding] = useState(false);
//   const [showManualInput, setShowManualInput] = useState(false);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Fonction améliorée pour le reverse geocoding
//   const handleLocationSelect = async (lat: number, lng: number) => {
//     setLocation({ lat, lng });
//     setIsGeocoding(true);
//     setShowManualInput(false);
    
//     try {
//       // Essayer d'abord avec un service de geocoding plus précis
//       let addressData = null;
      
//       // Essayer Nominatim avec différents niveaux de détail
//       try {
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr&addressdetails=1&zoom=16`
//         );
        
//         if (response.ok) {
//           const data = await response.json();
//           if (data.address) {
//             addressData = data;
//           }
//         }
//       } catch (nominatimError) {
//         console.warn('Nominatim error:', nominatimError);
//       }

//       // Si pas de données d'adresse précises, essayer avec un zoom plus large
//       if (!addressData || !isAddressPrecise(addressData.address)) {
//         try {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr&addressdetails=1&zoom=10`
//           );
          
//           if (response.ok) {
//             const data = await response.json();
//             if (data.address) {
//               addressData = data;
//             }
//           }
//         } catch (secondAttemptError) {
//           console.warn('Second geocoding attempt failed:', secondAttemptError);
//         }
//       }

//       // Traitement des données d'adresse
//       if (addressData && addressData.address) {
//         const address = addressData.address;
        
//         // Construction de l'adresse avec hiérarchie
//         const addressParts = [
//           address.road,
//           address.house_number,
//           address.pedestrian,
//           address.footway
//         ].filter(Boolean);

//         // Construction de la ville avec hiérarchie
//         const cityParts = [
//           address.city,
//           address.town,
//           address.village,
//           address.municipality,
//           address.county,
//           address.state,
//           address.region
//         ].filter(Boolean);

//         // Construction du pays
//         const countryName = address.country || '';

//         let fullAddress = '';
        
//         if (addressParts.length > 0) {
//           fullAddress = addressParts.join(', ');
//         } else if (cityParts.length > 0) {
//           fullAddress = `${cityParts[0]}`;
//         } else {
//           fullAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//         }

//         const cityName = cityParts.length > 0 ? cityParts[0] : '';

//         setSelectedAddress(fullAddress);
//         setAddress(fullAddress);
//         setCity(cityName);
//         setCountry(countryName);

//         // Vérifier si l'adresse est précise
//         if (!isAddressPrecise(address)) {
//           setShowManualInput(true);
//         }

//       } else {
//         // Aucune adresse trouvée
//         const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//         setSelectedAddress(fallbackAddress);
//         setAddress(fallbackAddress);
//         setCity('');
//         setCountry('');
//         setShowManualInput(true);
//       }

//     } catch (error) {
//       console.error('Erreur lors du reverse geocoding:', error);
//       const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//       setSelectedAddress(fallbackAddress);
//       setAddress(fallbackAddress);
//       setCity('');
//       setCountry('');
//       setShowManualInput(true);
//     } finally {
//       setIsGeocoding(false);
//     }
//   };

//   // Fonction pour vérifier si l'adresse est précise
//   const isAddressPrecise = (address: any): boolean => {
//     return !!(address.road || address.house_number || address.city || address.town);
//   };

//   // Fonction pour forcer la saisie manuelle
//   const enableManualInput = () => {
//     setShowManualInput(true);
//     setAddress('');
//     setCity('');
//     setCountry('');
//   };

//   // Fonction pour utiliser l'adresse détectée
//   const useDetectedAddress = () => {
//     setShowManualInput(false);
//   };

//   // ... (le reste des fonctions reste inchangé: handleImageUpload, handleFileInputChange, etc.)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsSubmitting(true);

//     try {
//       // Validation des champs requis
//       if (!title.trim()) {
//         throw new Error('Le titre est requis');
//       }
//       if (!description.trim()) {
//         throw new Error('La description est requise');
//       }
//       if (!city.trim()) {
//         throw new Error('La ville est requise');
//       }
//       if (!country.trim()) {
//         throw new Error('Le pays est requis');
//       }
//       if (!location) {
//         throw new Error('Veuillez sélectionner un emplacement sur la carte');
//       }
//       if (price <= 0) {
//         throw new Error('Le prix doit être supérieur à 0');
//       }

//       // ... (le reste de la fonction handleSubmit reste inchangé)
//     } catch (err: any) {
//       setError(
//         err.message || 
//         'Erreur lors de l\'ajout du bien. Vérifiez votre connexion et réessayez.'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ... (le reste des fonctions: uploadImagesToServer, getFallbackImages, etc.)

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in-0">
//       <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 p-8 text-white relative">
//           <div className="flex items-center justify-between">
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold mb-2">Publier un nouveau bien</h1>
//               <p className="text-white/90 text-sm">
//                 Remplissez les détails de votre propriété pour commencer à recevoir des réservations
//               </p>
//             </div>
//             <button
//               onClick={onCancel}
//               className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300 ml-4"
//             >
//               <X className="w-6 h-6 text-white" />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
//           <div className="p-8 space-y-8">
//             {error && (
//               <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-in fade-in-0">
//                 <div className="flex items-center">
//                   <div className="text-red-500 text-sm mr-2">⚠️</div>
//                   <p className="font-medium text-sm">{error}</p>
//                 </div>
//               </div>
//             )}

//             {/* Section Informations principales (inchangée) */}
//             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              



              
//             </div>

//             {/* Section Localisation MODIFIÉE */}
//             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
//               <div className="flex items-center mb-6">
//                 <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
//                 <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Sélectionnez l'emplacement sur la carte *
//                   {location && (
//                     <span className="text-green-600 ml-2 text-sm">
//                       ✓ Emplacement sélectionné
//                     </span>
//                   )}
//                 </label>
//                 <div className="h-64 rounded-xl overflow-hidden border border-gray-300 relative">
//                   {isGeocoding && (
//                     <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
//                       <div className="text-gray-600 text-sm">
//                         Recherche de l'adresse...
//                       </div>
//                     </div>
//                   )}
//                   <MapContainer
//                     center={[48.8566, 2.3522]} // Centre sur Paris par défaut
//                     zoom={10}
//                     style={{ height: '100%', width: '100%' }}
//                   >
//                     <TileLayer
//                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//                     />
//                     <MapClickHandler onLocationSelect={handleLocationSelect} />
//                     {location && (
//                       <Marker position={[location.lat, location.lng]} />
//                     )}
//                   </MapContainer>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Cliquez sur la carte pour positionner votre bien. L'adresse sera détectée automatiquement.
//                 </p>
//               </div>

//               {/* Affichage conditionnel selon la détection d'adresse */}
//               {location && (
//                 <div className="space-y-4">
//                   {!showManualInput ? (
//                     /* Mode adresse automatique détectée */
//                     <div>
//                       <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
//                         <div className="flex items-center">
//                           <div className="text-green-600 text-sm mr-2">✅</div>
//                           <div>
//                             <p className="text-green-800 text-sm font-medium">
//                               Adresse détectée automatiquement
//                             </p>
//                             <p className="text-green-700 text-xs mt-1">
//                               Vérifiez les informations ci-dessous ou modifiez-les si nécessaire.
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 gap-4">
//                         <div className="group">
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Adresse détectée
//                           </label>
//                           <input
//                             type="text"
//                             value={selectedAddress}
//                             onChange={(e) => setAddress(e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
//                           />
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="group">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Ville *
//                             </label>
//                             <input
//                               type="text"
//                               value={city}
//                               onChange={(e) => setCity(e.target.value)}
//                               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
//                               required
//                             />
//                           </div>
                          
//                           <div className="group">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Pays *
//                             </label>
//                             <input
//                               type="text"
//                               value={country}
//                               onChange={(e) => setCountry(e.target.value)}
//                               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
//                               required
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={enableManualInput}
//                         className="mt-3 text-sm text-[#ea80fc] hover:text-purple-600 font-medium"
//                       >
//                         ✏️ Saisir l'adresse manuellement
//                       </button>
//                     </div>
//                   ) : (
//                     /* Mode saisie manuelle */
//                     <div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
//                         <div className="flex items-center">
//                           <div className="text-blue-600 text-sm mr-2">💡</div>
//                           <div>
//                             <p className="text-blue-800 text-sm font-medium">
//                               Saisie manuelle de l'adresse
//                             </p>
//                             <p className="text-blue-700 text-xs mt-1">
//                               Veuillez saisir manuellement l'adresse complète pour une localisation précise.
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="space-y-4">
//                         <div className="group">
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Adresse complète *
//                           </label>
//                           <input
//                             type="text"
//                             value={address}
//                             onChange={(e) => setAddress(e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
//                             placeholder="Ex: 123 Avenue des Champs-Élysées"
//                             required
//                           />
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="group">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Ville *
//                             </label>
//                             <input
//                               type="text"
//                               value={city}
//                               onChange={(e) => setCity(e.target.value)}
//                               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
//                               placeholder="Ex: Paris"
//                               required
//                             />
//                           </div>
                          
//                           <div className="group">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Pays *
//                             </label>
//                             <input
//                               type="text"
//                               value={country}
//                               onChange={(e) => setCountry(e.target.value)}
//                               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
//                               placeholder="Ex: France"
//                               required
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {selectedAddress && (
//                         <button
//                           type="button"
//                           onClick={useDetectedAddress}
//                           className="mt-3 text-sm text-gray-600 hover:text-gray-800 font-medium"
//                         >
//                           ↩️ Revenir à l'adresse détectée
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Les autres sections restent inchangées */}
//             {/* Section Détails du bien */}
//             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
//               {/* ... (contenu inchangé) */}
//             </div>

//             {/* Section Images */}
//             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
//               {/* ... (contenu inchangé) */}
//             </div>
//           </div>

//           {/* Boutons d'action */}
//           <div className="bg-gray-50 border-t border-gray-200 p-6">
//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
//               >
//                 Annuler
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting || !location || !city || !country}
//                 className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
//                   ${isSubmitting || !location || !city || !country
//                     ? 'bg-gray-400 cursor-not-allowed transform scale-95'
//                     : 'bg-gradient-to-r from-[#ea80fc] to-purple-500 hover:from-[#d870eb] hover:to-purple-600 text-white transform hover:scale-[1.02] hover:shadow-xl active:scale-95'
//                   }`}
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                     <span className="text-sm">Publication en cours...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center space-x-2">
//                     <span>🚀</span>
//                     <span>Publier le bien</span>
//                   </div>
//                 )}
//               </button>
//             </div>
//             {(!location || !city || !country) && (
//               <p className="text-red-500 text-sm mt-2 text-center">
//                 {!location 
//                   ? 'Veuillez sélectionner un emplacement sur la carte' 
//                   : 'Veuillez compléter les informations de localisation'
//                 }
//               </p>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// src/components/AddPropertyForm.tsx
import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet dans React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AddPropertyFormProps {
  ownerId: string;
  onPropertyAdded: () => void;
  onCancel: () => void;
}

interface UploadedImage {
  file: File;
  preview: string;
  id: string;
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

export default function AddPropertyForm({ ownerId, onPropertyAdded, onCancel }: AddPropertyFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [price, setPrice] = useState(100);
  const [priceType, setPriceType] = useState<'night' | 'month'>('night');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [maxGuests, setMaxGuests] = useState(2);
  const [propertyType, setPropertyType] = useState('apartment');
  const [amenities, setAmenities] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size > 10 * 1024 * 1024) {
          setError(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
          return;
        }
        const preview = URL.createObjectURL(file);
        newImages.push({
          file,
          preview,
          id: Math.random().toString(36).substr(2, 9)
        });
      }
    });

    setUploadedImages(prev => [...prev, ...newImages]);
    setError('');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Fonction pour vérifier si l'adresse est précise
  const isAddressPrecise = (address: any): boolean => {
    return !!(address.road || address.house_number || address.city || address.town);
  };

  // Fonction améliorée pour le reverse geocoding
  const handleLocationSelect = async (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setIsGeocoding(true);
    setShowManualInput(false);
    
    try {
      // Essayer d'abord avec un service de geocoding plus précis
      let addressData = null;
      
      // Essayer Nominatim avec différents niveaux de détail
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr&addressdetails=1&zoom=16`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.address) {
            addressData = data;
          }
        }
      } catch (nominatimError) {
        console.warn('Nominatim error:', nominatimError);
      }

      // Si pas de données d'adresse précises, essayer avec un zoom plus large
      if (!addressData || !isAddressPrecise(addressData.address)) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr&addressdetails=1&zoom=10`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.address) {
              addressData = data;
            }
          }
        } catch (secondAttemptError) {
          console.warn('Second geocoding attempt failed:', secondAttemptError);
        }
      }

      // Traitement des données d'adresse
      if (addressData && addressData.address) {
        const address = addressData.address;
        
        // Construction de l'adresse avec hiérarchie
        const addressParts = [
          address.road,
          address.house_number,
          address.pedestrian,
          address.footway
        ].filter(Boolean);

        // Construction de la ville avec hiérarchie
        const cityParts = [
          address.city,
          address.town,
          address.village,
          address.municipality,
          address.county,
          address.state,
          address.region
        ].filter(Boolean);

        // Construction du pays
        const countryName = address.country || '';

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
        setAddress(fullAddress);
        setCity(cityName);
        setCountry(countryName);

        // Vérifier si l'adresse est précise
        if (!isAddressPrecise(address)) {
          setShowManualInput(true);
        }

      } else {
        // Aucune adresse trouvée
        const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setSelectedAddress(fallbackAddress);
        setAddress(fallbackAddress);
        setCity('');
        setCountry('');
        setShowManualInput(true);
      }

    } catch (error) {
      console.error('Erreur lors du reverse geocoding:', error);
      const fallbackAddress = `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setSelectedAddress(fallbackAddress);
      setAddress(fallbackAddress);
      setCity('');
      setCountry('');
      setShowManualInput(true);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Fonction pour forcer la saisie manuelle
  const enableManualInput = () => {
    setShowManualInput(true);
    setAddress('');
    setCity('');
    setCountry('');
  };

  // Fonction pour utiliser l'adresse détectée
  const useDetectedAddress = () => {
    setShowManualInput(false);
  };

  const uploadImagesToServer = async (images: UploadedImage[]): Promise<string[]> => {
    if (images.length === 0) {
      return ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
    }

    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      try {
        const formData = new FormData();
        formData.append('image', image.file);
        
        const response = await fetch('https://api.imgbb.com/1/upload?key=ebd5c0e3afd3a5f8db71587bcc4841ed', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          continue;
        }

        const result = await response.json();
        
        if (result.data && result.data.url) {
          uploadedUrls.push(result.data.url);
        }
      } catch (error) {
        console.error('Erreur upload image vers IMGbb:', error);
      }
    }

    if (uploadedUrls.length > 0) {
      return uploadedUrls;
    }
    
    return getFallbackImages();
  };

  const getFallbackImages = (): string[] => {
    const placeholderImages = {
      apartment: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
      ],
      house: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'
      ],
      villa: [
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
        'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg'
      ],
      studio: [
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
        'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg'
      ],
      loft: [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg'
      ],
      chalet: [
        'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
        'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg'
      ]
    };

    const imagesToUse = placeholderImages[propertyType as keyof typeof placeholderImages] || 
                       placeholderImages.apartment;
    
    return imagesToUse.slice(0, Math.min(uploadedImages.length + 1, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validation des champs requis
      if (!title.trim()) {
        throw new Error('Le titre est requis');
      }
      if (!description.trim()) {
        throw new Error('La description est requise');
      }
      if (!city.trim()) {
        throw new Error('La ville est requise');
      }
      if (!country.trim()) {
        throw new Error('Le pays est requis');
      }
      if (!location) {
        throw new Error('Veuillez sélectionner un emplacement sur la carte');
      }
      if (price <= 0) {
        throw new Error('Le prix doit être supérieur à 0');
      }

      const amenitiesArray = amenities
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');

      // Upload des images
      let imageUrls: string[] = [];
      
      if (uploadedImages.length > 0) {
        try {
          imageUrls = await uploadImagesToServer(uploadedImages);
        } catch (uploadError) {
          imageUrls = getFallbackImages();
        }
      } else {
        imageUrls = ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'];
      }

      // Préparer les données pour l'API
      const propertyData = {
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        latitude: location.lat,
        longitude: location.lng,
        price_per_night: Number(price),
        price_type: priceType,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        max_guests: Number(maxGuests),
        property_type: propertyType,
        amenities: amenitiesArray.length > 0 ? amenitiesArray : ['WiFi'],
        images: imageUrls,
        owner_id: ownerId,
        is_available: true
      };

      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      // Nettoyer et réinitialiser
      uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
      setUploadedImages([]);
      setTitle('');
      setDescription('');
      setAddress('');
      setCity('');
      setCountry('');
      setPrice(100);
      setPriceType('night');
      setBedrooms(1);
      setBathrooms(1);
      setMaxGuests(2);
      setAmenities('');
      setLocation(null);
      setSelectedAddress('');
      setShowManualInput(false);
      
      onPropertyAdded();
      
    } catch (err: any) {
      setError(
        err.message || 
        'Erreur lors de l\'ajout du bien. Vérifiez votre connexion et réessayez.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
    setUploadedImages([]);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in-0">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 p-8 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">Publier un nouveau bien</h1>
              <p className="text-white/90 text-sm">
                Remplissez les détails de votre propriété pour commencer à recevoir des réservations
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300 ml-4"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
          <div className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl animate-in fade-in-0">
                <div className="flex items-center">
                  <div className="text-red-500 text-sm mr-2">⚠️</div>
                  <p className="font-medium text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Section Informations principales */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
                <h2 className="text-lg font-semibold text-gray-900">Informations principales</h2>
              </div>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                    placeholder="Ex: Magnifique appartement avec vue sur la mer"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 resize-none"
                    placeholder="Décrivez votre bien en détail..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section Localisation */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
                <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionnez l'emplacement sur la carte *
                  {location && (
                    <span className="text-green-600 ml-2 text-sm">
                      ✓ Emplacement sélectionné
                    </span>
                  )}
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
                    center={[48.8566, 2.3522]}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                    {location && (
                      <Marker position={[location.lat, location.lng]} />
                    )}
                  </MapContainer>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Cliquez sur la carte pour positionner votre bien. L'adresse sera détectée automatiquement.
                </p>
              </div>

              {/* Affichage conditionnel selon la détection d'adresse */}
              {location && (
                <div className="space-y-4">
                  {!showManualInput ? (
                    /* Mode adresse automatique détectée */
                    <div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center">
                          <div className="text-green-600 text-sm mr-2">✅</div>
                          <div>
                            <p className="text-green-800 text-sm font-medium">
                              Adresse détectée automatiquement
                            </p>
                            <p className="text-green-700 text-xs mt-1">
                              Vérifiez les informations ci-dessous ou modifiez-les si nécessaire.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse détectée
                          </label>
                          <input
                            type="text"
                            value={selectedAddress}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ville *
                            </label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                              required
                            />
                          </div>
                          
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pays *
                            </label>
                            <input
                              type="text"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={enableManualInput}
                        className="mt-3 text-sm text-[#ea80fc] hover:text-purple-600 font-medium"
                      >
                        ✏️ Saisir l'adresse manuellement
                      </button>
                    </div>
                  ) : (
                    /* Mode saisie manuelle */
                    <div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center">
                          <div className="text-blue-600 text-sm mr-2">💡</div>
                          <div>
                            <p className="text-blue-800 text-sm font-medium">
                              Saisie manuelle de l'adresse
                            </p>
                            <p className="text-blue-700 text-xs mt-1">
                              Veuillez saisir manuellement l'adresse complète pour une localisation précise.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse complète *
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                            placeholder="Ex: 123 Avenue des Champs-Élysées"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ville *
                            </label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                              placeholder="Ex: Paris"
                              required
                            />
                          </div>
                          
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pays *
                            </label>
                            <input
                              type="text"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                              placeholder="Ex: France"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {selectedAddress && (
                        <button
                          type="button"
                          onClick={useDetectedAddress}
                          className="mt-3 text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          ↩️ Revenir à l'adresse détectée
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section Détails du bien */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
                <h2 className="text-lg font-semibold text-gray-900">Détails du bien</h2>
              </div>
              
              {/* Prix avec sélection jour/mois */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <select
                        value={priceType}
                        onChange={(e) => setPriceType(e.target.value as 'night' | 'month')}
                        className="bg-transparent border-none text-gray-600 text-sm focus:ring-0 focus:outline-none appearance-none pr-6"
                      >
                        <option value="night">€/nuit</option>
                        <option value="month">€/mois</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400 appearance-none"
                  >
                    <option value="apartment">🏢 Appartement</option>
                    <option value="house">🏠 Maison</option>
                    <option value="villa">🏡 Villa</option>
                    <option value="studio">🔧 Studio</option>
                    <option value="loft">🏭 Loft</option>
                    <option value="chalet">⛰️ Chalet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chambres *</label>
                  <input
                    type="number"
                    min="1"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                    required
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salles de bain *</label>
                  <input
                    type="number"
                    min="1"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                    required
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voyageurs max *</label>
                  <input
                    type="number"
                    min="1"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Équipements
                </label>
                <input
                  type="text"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  placeholder="WiFi, Parking, Piscine, Climatisation..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc]/20 focus:border-[#ea80fc] bg-white transition-all duration-300 group-hover:border-gray-400"
                />
              </div>
            </div>

            {/* Section Images */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-1.5 h-6 bg-gradient-to-b from-[#ea80fc] to-purple-500 rounded-full mr-3"></div>
                <h2 className="text-lg font-semibold text-gray-900">Galerie photos</h2>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-6
                  ${isDragging 
                    ? 'border-[#ea80fc] bg-[#ea80fc]/10 scale-[1.02] shadow-md' 
                    : 'border-gray-300 bg-white hover:border-[#ea80fc] hover:bg-[#ea80fc]/5'
                  }`}
                onClick={handleFileSelect}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-4xl mb-4">📸</div>
                <p className="text-base font-semibold text-gray-800 mb-2">
                  {isDragging ? 'Lâchez pour déposer' : 'Ajoutez vos photos'}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  Glissez-déposez vos images ou <span className="text-[#ea80fc] font-medium">parcourez vos fichiers</span>
                </p>
                <p className="text-gray-400 text-xs">
                  PNG, JPG, JPEG jusqu'à 10MB • Maximum 10 images
                </p>
              </div>

              {uploadedImages.length > 0 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      Photos sélectionnées ({uploadedImages.length})
                      <span className="text-[#ea80fc] ml-2">
                        {uploadedImages.length > 0 ? '✓ Prêtes à être uploadées' : ''}
                      </span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleFileSelect}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all duration-300"
                    >
                      + Ajouter plus
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {uploadedImages.map((image, index) => (
                      <div 
                        key={image.id} 
                        className="relative group animate-scale-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden shadow-sm bg-gray-100">
                          <img
                            src={image.preview}
                            alt={`Aperçu ${index + 1}`}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 hover:bg-red-600 shadow-md"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                          {image.file.name}
                        </div>
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !location || !city || !country}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
                  ${isSubmitting || !location || !city || !country
                    ? 'bg-gray-400 cursor-not-allowed transform scale-95'
                    : 'bg-gradient-to-r from-[#ea80fc] to-purple-500 hover:from-[#d870eb] hover:to-purple-600 text-white transform hover:scale-[1.02] hover:shadow-xl active:scale-95'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="text-sm">Publication en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Publier le bien</span>
                  </div>
                )}
              </button>
            </div>
            {(!location || !city || !country) && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {!location 
                  ? 'Veuillez sélectionner un emplacement sur la carte' 
                  : 'Veuillez compléter les informations de localisation'
                }
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}