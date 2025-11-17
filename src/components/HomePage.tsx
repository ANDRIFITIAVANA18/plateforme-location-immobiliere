

// // // src/components/HomePage.tsx
// // import { useState, useEffect } from 'react';
// // import { Search, MapPin, Users, Euro, Star, Calendar, Heart, Bed, Bath, ChevronRight, Eye, Filter, X, Edit, Navigation } from 'lucide-react';
// // import { Property, SearchFilters, User as UserType } from '../types';
// // import { api } from '../services/api';

// // interface HomePageProps {
// //   onNavigate: (view: 'home' | 'bookings' | 'owner' | 'booking-form') => void;
// //   onStartReservation: (propertyId: string) => void;
// //   currentUser: UserType | null;
// // }

// // // Types pour les points d'intérêt
// // interface PointOfInterest {
// //   type: string;
// //   name: string;
// //   distance: number; // en mètres
// //   distanceDisplay: string;
// //   icon: string;
// // }

// // // Types de points d'intérêt standardisés
// // const POI_TYPES = {
// //   supermarket: { type: 'Supermarché', icon: '🛒', searchTerms: ['supermarket', 'grocery', 'market'] },
// //   restaurant: { type: 'Restaurant', icon: '🍽️', searchTerms: ['restaurant', 'cafe', 'bistro'] },
// //   transport: { type: 'Transport', icon: '🚇', searchTerms: ['subway', 'bus_station', 'train_station'] },
// //   park: { type: 'Parc', icon: '🌳', searchTerms: ['park', 'garden', 'recreation_area'] },
// //   school: { type: 'École', icon: '🏫', searchTerms: ['school', 'university', 'college'] },
// //   pharmacy: { type: 'Pharmacie', icon: '💊', searchTerms: ['pharmacy', 'drugstore'] },
// //   hospital: { type: 'Hôpital', icon: '🏥', searchTerms: ['hospital', 'clinic'] },
// //   bank: { type: 'Banque', icon: '🏦', searchTerms: ['bank', 'atm'] },
// //   shopping: { type: 'Centre commercial', icon: '🛍️', searchTerms: ['mall', 'shopping_center'] },
// //   church: { type: 'Lieu de culte', icon: '⛪', searchTerms: ['church', 'cathedral', 'temple', 'mosque', 'synagogue'] }
// // };

// // // Fonction pour calculer la distance entre deux points GPS (formule Haversine)
// // const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
// //   const R = 6371000; // Rayon de la Terre en mètres
// //   const dLat = (lat2 - lat1) * Math.PI / 180;
// //   const dLon = (lon2 - lon1) * Math.PI / 180;
// //   const a = 
// //     Math.sin(dLat/2) * Math.sin(dLat/2) +
// //     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
// //     Math.sin(dLon/2) * Math.sin(dLon/2);
// //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
// //   return R * c; // Distance en mètres
// // };

// // // Fonction pour formater la distance de manière lisible
// // const formatDistance = (meters: number): string => {
// //   if (meters < 1000) {
// //     return `${Math.round(meters)} m`;
// //   } else {
// //     return `${(meters / 1000).toFixed(1)} km`;
// //   }
// // };

// // // Fonction pour estimer la densité urbaine basée sur la ville
// // const getUrbanDensity = (city: string): 'high' | 'medium' | 'low' => {
// //   const highDensityCities = ['paris', 'lyon', 'marseille', 'lille', 'toulouse', 'bordeaux', 'london', 'berlin', 'madrid', 'rome'];
// //   const mediumDensityCities = ['nantes', 'strasbourg', 'montpellier', 'nice', 'rennes', 'brussels', 'amsterdam', 'vienna', 'prague'];
  
// //   const normalizedCity = city.toLowerCase();
  
// //   if (highDensityCities.includes(normalizedCity)) return 'high';
// //   if (mediumDensityCities.includes(normalizedCity)) return 'medium';
// //   return 'low';
// // };

// // // Distances de base selon le type de POI et la densité urbaine (en mètres)
// // const getBaseDistance = (poiType: string, density: 'high' | 'medium' | 'low'): number => {
// //   const baseDistances = {
// //     supermarket: { high: 500, medium: 800, low: 1500 },
// //     restaurant: { high: 300, medium: 500, low: 1000 },
// //     transport: { high: 400, medium: 600, low: 1200 },
// //     park: { high: 600, medium: 900, low: 2000 },
// //     school: { high: 800, medium: 1200, low: 2500 },
// //     pharmacy: { high: 400, medium: 600, low: 1500 },
// //     hospital: { high: 1500, medium: 2500, low: 5000 },
// //     bank: { high: 500, medium: 800, low: 2000 },
// //     shopping: { high: 1000, medium: 1500, low: 3000 },
// //     church: { high: 700, medium: 1000, low: 2000 }
// //   };

// //   const key = poiType.toLowerCase().replace(' ', '_') as keyof typeof baseDistances;
// //   return baseDistances[key]?.[density] || 1000;
// // };

// // // Générer des noms de POI réalistes en français
// // const generatePOIName = (type: string, city: string): string => {
// //   const names = {
// //     'Supermarché': ['Carrefour Market', 'Monoprix', 'Super U', 'Intermarché', 'Casino Shop'],
// //     'Restaurant': ['Bistro du Centre', 'Café de la Place', 'Brasserie Moderne', 'Restaurant Gastronomique', 'Le Petit Bouchon'],
// //     'Transport': ['Station de Métro', 'Gare SNCF', 'Arrêt de Bus', 'Station de Tram', 'Gare Routière'],
// //     'Parc': ['Parc Municipal', 'Jardin Public', 'Square du Quartier', 'Bois de la Ville', 'Esplanade Verte'],
// //     'École': ['École Primaire', 'Collège Public', 'Lycée Professionnel', 'École Maternelle', 'Campus Universitaire'],
// //     'Pharmacie': ['Pharmacie Centrale', 'Pharmacie de Garde', 'Pharmacie du Quartier', 'Parapharmacie', 'Officine Municipale'],
// //     'Hôpital': ['Centre Hospitalier', 'Clinique Saint-Louis', 'Hôpital Regional', 'Centre Médical', 'Polyclinique'],
// //     'Banque': ['Crédit Agricole', 'BNP Paribas', 'Société Générale', 'Caisse d\'Épargne', 'Banque Populaire'],
// //     'Centre commercial': ['Centre Commercial', 'Galerie Marchande', 'Plaza Shopping', 'Mail Commercial', 'Galerie Lafayette'],
// //     'Lieu de culte': ['Église Saint-Pierre', 'Cathédrale Notre-Dame', 'Temple Protestant', 'Mosquée de la Ville', 'Synagogue Centrale']
// //   };

// //   const typeNames = names[type as keyof typeof names] || ['Service Local'];
// //   const randomName = typeNames[Math.floor(Math.random() * typeNames.length)];
  
// //   return randomName;
// // };

// // // Fonction pour générer l'URL Google Maps corrigée
// // const getGoogleMapsUrl = (property: Property): string => {
// //   if (hasExactLocation(property)) {
// //     return `https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=15`;
// //   } else {
// //     const query = encodeURIComponent(`${property.address || ''} ${property.city} ${property.country}`.trim());
// //     return `https://www.google.com/maps/search/?api=1&query=${query}`;
// //   }
// // };

// // // Fonction pour générer l'URL de navigation
// // const getNavigationUrl = (property: Property): string => {
// //   if (hasExactLocation(property)) {
// //     return `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
// //   } else {
// //     const query = encodeURIComponent(`${property.address || ''} ${property.city} ${property.country}`.trim());
// //     return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
// //   }
// // };

// // // Fonction pour vérifier si la propriété a des coordonnées GPS exactes
// // const hasExactLocation = (property: Property): boolean => {
// //   return !!(property.latitude && property.longitude);
// // };

// // // Service pour récupérer les POIs réalistes
// // const getRealPOIs = async (lat: number, lng: number, city: string): Promise<PointOfInterest[]> => {
// //   try {
// //     const urbanDensity = getUrbanDensity(city);
    
// //     // Sélectionner 7 types de POI aléatoires incluant souvent un lieu de culte
// //     const allTypes = Object.values(POI_TYPES);
// //     const selectedTypes = [...allTypes]
// //       .sort(() => Math.random() - 0.5)
// //       .slice(0, 6);
    
// //     // S'assurer qu'il y a au moins un lieu de culte
// //     if (!selectedTypes.find(t => t.type === 'Lieu de culte')) {
// //       selectedTypes[Math.floor(Math.random() * selectedTypes.length)] = POI_TYPES.church;
// //     }

// //     const pois: PointOfInterest[] = [];

// //     selectedTypes.forEach(poiType => {
// //       const baseDistance = getBaseDistance(poiType.type, urbanDensity);
      
// //       // Variation réaliste (±30%)
// //       const variation = (Math.random() - 0.5) * 0.6;
// //       const distance = Math.max(200, baseDistance * (1 + variation));
      
// //       const distanceInMeters = Math.round(distance);
      
// //       pois.push({
// //         type: poiType.type,
// //         name: generatePOIName(poiType.type, city),
// //         distance: distanceInMeters,
// //         distanceDisplay: formatDistance(distanceInMeters),
// //         icon: poiType.icon
// //       });
// //     });

// //     // Trier par distance
// //     return pois.sort((a, b) => a.distance - b.distance);
// //   } catch (error) {
// //     console.error('Erreur chargement POIs:', error);
// //     return getFallbackPOIs(city);
// //   }
// // };

// // // Fallback si pas de coordonnées GPS
// // const getFallbackPOIs = (city: string): PointOfInterest[] => {
// //   const urbanDensity = getUrbanDensity(city);
// //   const baseDistances = {
// //     supermarket: getBaseDistance('supermarket', urbanDensity),
// //     restaurant: getBaseDistance('restaurant', urbanDensity),
// //     transport: getBaseDistance('transport', urbanDensity),
// //     park: getBaseDistance('park', urbanDensity),
// //     school: getBaseDistance('school', urbanDensity),
// //     pharmacy: getBaseDistance('pharmacy', urbanDensity),
// //     church: getBaseDistance('church', urbanDensity)
// //   };

// //   return [
// //     { type: 'Supermarché', name: 'Carrefour Market', distance: baseDistances.supermarket, distanceDisplay: formatDistance(baseDistances.supermarket), icon: '🛒' },
// //     { type: 'Restaurant', name: 'Bistro du Centre', distance: baseDistances.restaurant, distanceDisplay: formatDistance(baseDistances.restaurant), icon: '🍽️' },
// //     { type: 'Transport', name: 'Station de Métro', distance: baseDistances.transport, distanceDisplay: formatDistance(baseDistances.transport), icon: '🚇' },
// //     { type: 'Parc', name: 'Parc Municipal', distance: baseDistances.park, distanceDisplay: formatDistance(baseDistances.park), icon: '🌳' },
// //     { type: 'École', name: 'École Primaire', distance: baseDistances.school, distanceDisplay: formatDistance(baseDistances.school), icon: '🏫' },
// //     { type: 'Pharmacie', name: 'Pharmacie Centrale', distance: baseDistances.pharmacy, distanceDisplay: formatDistance(baseDistances.pharmacy), icon: '💊' },
// //     { type: 'Lieu de culte', name: 'Église Saint-Pierre', distance: baseDistances.church, distanceDisplay: formatDistance(baseDistances.church), icon: '⛪' }
// //   ];
// // };

// // // Version améliorée avec coordonnées réalistes
// // const generateRealisticPOIs = async (property: Property): Promise<PointOfInterest[]> => {
// //   if (!property.latitude || !property.longitude) {
// //     return getFallbackPOIs(property.city);
// //   }

// //   try {
// //     return await getRealPOIs(property.latitude, property.longitude, property.city);
// //   } catch (error) {
// //     console.error('Erreur génération POIs réalistes:', error);
// //     return getFallbackPOIs(property.city);
// //   }
// // };

// // // Mettre à jour la fonction getNearbyPointsOfInterest
// // const getNearbyPointsOfInterest = async (property: Property): Promise<PointOfInterest[]> => {
// //   return await generateRealisticPOIs(property);
// // };

// // export default function HomePage({ onNavigate, onStartReservation, currentUser }: HomePageProps) {
// //   const [properties, setProperties] = useState<Property[]>([]);
// //   const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
// //   const [cities, setCities] = useState<string[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [filters, setFilters] = useState<SearchFilters>({});
// //   const [favorites, setFavorites] = useState<Set<string>>(new Set());
// //   const [showFilters, setShowFilters] = useState(false);
// //   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
// //   const [searchQuery, setSearchQuery] = useState('');

// //   useEffect(() => {
// //     loadProperties();
// //     loadCities();
// //   }, []);

// //   useEffect(() => {
// //     filterProperties();
// //   }, [properties, filters, searchQuery]);

// //   const loadProperties = async () => {
// //     try {
// //       const data = await api.getProperties();
// //       setProperties(data);
// //     } catch (error) {
// //       console.error('Erreur chargement propriétés:', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const loadCities = async () => {
// //     try {
// //       const data = await api.getCities();
// //       setCities(data);
// //     } catch (error) {
// //       console.error('Erreur chargement villes:', error);
// //       const uniqueCities = Array.from(new Set(properties.map(p => p.city))).sort();
// //       setCities(uniqueCities);
// //     }
// //   };

// //   const filterProperties = () => {
// //     let filtered = properties;

// //     if (searchQuery) {
// //       filtered = filtered.filter(p => 
// //         p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         p.description.toLowerCase().includes(searchQuery.toLowerCase())
// //       );
// //     }

// //     if (filters.city) {
// //       filtered = filtered.filter(p => 
// //         p.city.toLowerCase().includes(filters.city!.toLowerCase())
// //       );
// //     }

// //     if (filters.type && filters.type !== 'all') {
// //       filtered = filtered.filter(p => p.property_type === filters.type);
// //     }

// //     if (filters.min_price) {
// //       filtered = filtered.filter(p => p.price_per_night >= filters.min_price!);
// //     }

// //     if (filters.max_price) {
// //       filtered = filtered.filter(p => p.price_per_night <= filters.max_price!);
// //     }

// //     if (filters.guests) {
// //       filtered = filtered.filter(p => p.max_guests >= filters.guests!);
// //     }

// //     setFilteredProperties(filtered);
// //   };

// //   const handleReservation = (propertyId: string, e?: React.MouseEvent) => {
// //     if (e) e.stopPropagation();
    
// //     if (!currentUser) {
// //       alert('Veuillez vous connecter pour effectuer une réservation');
   
// //       return;
// //     }
    
// //     if (currentUser.role !== 'locataire' && currentUser.role !== 'admin') {
// //       alert('Seuls les locataires peuvent effectuer des réservations');
// //       return;
// //     }
    
// //     onStartReservation(propertyId);
// //   };

// //   const handleEditProperty = (propertyId: string, e?: React.MouseEvent) => {
// //     if (e) e.stopPropagation();
// //     onNavigate('owner');
// //   };

// //   const toggleFavorite = (propertyId: string, e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     const newFavorites = new Set(favorites);
// //     if (newFavorites.has(propertyId)) {
// //       newFavorites.delete(propertyId);
// //     } else {
// //       newFavorites.add(propertyId);
// //     }
// //     setFavorites(newFavorites);
// //   };

// //   const getPropertyImage = (property: Property) => {
// //     if (property.images && property.images.length > 0) {
// //       const firstImage = property.images[0];
      
// //       if (firstImage.startsWith('http')) {
// //         return firstImage;
// //       }
      
// //       if (firstImage.startsWith('/')) {
// //         return `http://localhost:5000${firstImage}`;
// //       }
      
// //       if (firstImage.includes('pexels.com') || firstImage.includes('unsplash.com')) {
// //         return firstImage;
// //       }
      
// //       return `http://localhost:5000${firstImage}`;
// //     }
    
// //     return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
// //   };

// //   const getPropertyTypeLabel = (type: string) => {
// //     const types: { [key: string]: string } = {
// //       apartment: 'Appartement',
// //       house: 'Maison',
// //       villa: 'Villa',
// //       studio: 'Studio',
// //       loft: 'Loft',
// //       chalet: 'Chalet'
// //     };
// //     return types[type] || type;
// //   };

// //   const getPriceDisplay = (property: Property) => {
// //     const price = property.price_per_night;
// //     const priceType = property.price_type || 'night';
    
// //     if (priceType === 'month') {
// //       return `${price}€ / mois`;
// //     }
// //     return `${price}€ / nuit`;
// //   };

// //   const getAmenityIcon = (amenity: string) => {
// //     switch (amenity.toLowerCase()) {
// //       case 'wifi': return '📶';
// //       case 'parking': return '🅿️';
// //       case 'climatisation': return '❄️';
// //       case 'piscine': return '🏊';
// //       case 'jardin': return '🌳';
// //       case 'cheminée': return '🔥';
// //       case 'terrasse': return '🌞';
// //       case 'vue mer': return '🌊';
// //       case 'ascenseur': return '🛗';
// //       default: return '✨';
// //     }
// //   };

// //   const canUserReserve = () => {
// //     if (!currentUser) return false;
// //     return currentUser.role === 'locataire' || currentUser.role === 'admin';
// //   };

// //   const isPropertyOwner = (property: Property) => {
// //     return currentUser && currentUser.role === 'proprietaire' && property.owner_id === currentUser.id;
// //   };

// //   const PropertyDetailsModal = ({ property, onClose }: { property: Property, onClose: () => void }) => {
// //     const [nearbyPOIs, setNearbyPOIs] = useState<PointOfInterest[]>([]);
// //     const [isLoadingPOIs, setIsLoadingPOIs] = useState(true);
    
// //     const hasExactLoc = hasExactLocation(property);

// //     useEffect(() => {
// //       const loadPOIs = async () => {
// //         setIsLoadingPOIs(true);
// //         const pois = await getNearbyPointsOfInterest(property);
// //         setNearbyPOIs(pois);
// //         setIsLoadingPOIs(false);
// //       };
      
// //       loadPOIs();
// //     }, [property]);
    
// //     return (
// //       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
// //         <div 
// //           className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
// //           onClick={(e) => e.stopPropagation()}
// //         >
// //           <div className="relative h-80">
// //             <img
// //               src={getPropertyImage(property)}
// //               alt={property.title}
// //               className="w-full h-full object-cover"
// //               onError={(e) => {
// //                 e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
// //               }}
// //             />
// //             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
// //             <button
// //               onClick={onClose}
// //               className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
// //             >
// //               <X className="w-5 h-5" />
// //             </button>
            
// //             <div className="absolute bottom-6 left-6 text-white">
// //               <h2 className="text-3xl font-black mb-2">{property.title}</h2>
// //               <div className="flex items-center space-x-4">
// //                 <div className="flex items-center space-x-1">
// //                   <MapPin className="w-5 h-5" />
// //                   <span className="text-lg">{property.city}, {property.country} </span>
// //                 </div>
// //                 {property.rating && (
// //                   <div className="flex items-center space-x-1">
// //                     <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
// //                     <span className="text-lg font-semibold">{property.rating}</span>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {!property.is_available && (
// //               <div className="absolute top-6 left-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg">
// //                 Indisponible
// //               </div>
// //             )}

// //             {isPropertyOwner(property) && (
// //               <div className="absolute top-6 left-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg">
// //                 Ma propriété
// //               </div>
// //             )}
// //           </div>

// //           <div className="p-8">
// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //               <div className="lg:col-span-2">
// //                 <h3 className="text-2xl font-black text-gray-900 mb-4">Description</h3>
// //                 <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>
                
// //                 <h3 className="text-2xl font-black text-gray-900 mb-4">Caractéristiques</h3>
// //                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
// //                   <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
// //                     <Users className="w-6 h-6 text-[#ea80fc] mx-auto mb-2" />
// //                     <div className="text-sm text-gray-600">Voyageurs</div>
// //                     <div className="font-black text-gray-900">{property.max_guests}</div>
// //                   </div>
// //                   <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
// //                     <Bed className="w-6 h-6 text-[#ea80fc] mx-auto mb-2" />
// //                     <div className="text-sm text-gray-600">Chambres</div>
// //                     <div className="font-black text-gray-900">{property.bedrooms}</div>
// //                   </div>
// //                   <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
// //                     <Bath className="w-6 h-6 text-[#ea80fc] mx-auto mb-2" />
// //                     <div className="text-sm text-gray-600">Salles de bain</div>
// //                     <div className="font-black text-gray-900">{property.bathrooms}</div>
// //                   </div>
// //                   <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
// //                     <div className="w-6 h-6 text-[#ea80fc] mx-auto mb-2">🏠</div>
// //                     <div className="text-sm text-gray-600">Type</div>
// //                     <div className="font-black text-gray-900 capitalize">{getPropertyTypeLabel(property.property_type)}</div>
// //                   </div>
// //                 </div>

// //                 {property.amenities && property.amenities.length > 0 && (
// //                   <>
// //                     <h3 className="text-2xl font-black text-gray-900 mb-4">Équipements</h3>
// //                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// //                       {property.amenities.map((amenity, index) => (
// //                         <div key={index} className="flex items-center space-x-2 bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200">
// //                           <span className="text-lg">{getAmenityIcon(amenity)}</span>
// //                           <span className="text-gray-700 font-medium capitalize">{amenity}</span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </>
// //                 )}

// //                 {/* Section Localisation enrichie */}
// //                 <div className="mt-8">
// //                   <h3 className="text-2xl font-black text-gray-900 mb-4">Localisation & Environnement</h3>
// //                   <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
// //                     {/* Adresse et précision */}
// //                     <div className="mb-6">
// //                       <div className="flex items-center space-x-2 text-gray-700 mb-3">
// //                         <MapPin className="w-5 h-5 text-[#ea80fc]" />
// //                         <span className="font-semibold text-lg">Adresse :</span>
// //                         <span className="text-lg">{property.address || `${property.city}, ${property.country}`}</span>
// //                       </div>
                      
// //                       <div className="flex items-center justify-between">
// //                         <div className={`flex items-center space-x-2 ${hasExactLoc ? 'text-green-600' : 'text-blue-600'}`}>
// //                           <div className={`w-3 h-3 rounded-full ${hasExactLoc ? 'bg-green-500' : 'bg-blue-500'}`}></div>
// //                           <span className="font-medium">
// //                             {hasExactLoc ? '📍 Emplacement GPS exact' : '📍 Localisation par adresse'}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>
                    
// //                     {/* Points d'intérêt à proximité */}
// //                     <div className="mb-6">
// //                       <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center space-x-2">
// //                         <span>🏙️</span>
// //                         <span>À proximité</span>
// //                         {isLoadingPOIs && (
// //                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ea80fc]"></div>
// //                         )}
// //                       </h4>
// //                       {isLoadingPOIs ? (
// //                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
// //                           {[...Array(6)].map((_, index) => (
// //                             <div key={index} className="animate-pulse flex items-center space-x-3 bg-gray-100 rounded-xl p-3">
// //                               <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
// //                               <div className="flex-1">
// //                                 <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
// //                                 <div className="h-3 bg-gray-300 rounded w-1/2"></div>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       ) : (
// //                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
// //                           {nearbyPOIs.map((poi, index) => (
// //                             <div key={index} className="flex items-center space-x-3 bg-white rounded-xl p-3 border border-gray-200 hover:shadow-md transition-shadow">
// //                               <span className="text-2xl">{poi.icon}</span>
// //                               <div className="flex-1">
// //                                 <div className="font-semibold text-gray-900 text-sm">{poi.name}</div>
// //                                 <div className="text-xs text-gray-500">{poi.type} • {poi.distanceDisplay}</div>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
                    
// //                     {/* Boutons d'action */}
// //                     <div className="flex flex-col sm:flex-row gap-3">
// //                       <a 
// //                         href={getGoogleMapsUrl(property)}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="flex-1 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
// //                       >
// //                         <MapPin className="w-4 h-4" />
// //                         <span>Explorer sur Google Maps</span>
// //                       </a>
// //                       <a 
// //                         href={getNavigationUrl(property)}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
// //                       >
// //                         <Navigation className="w-4 h-4" />
// //                         <span>Itinéraire</span>
// //                       </a>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 h-fit border border-gray-200 shadow-lg">
// //                 <div className="text-center mb-6">
// //                   <div className="text-2xl font-black text-gray-900">{getPriceDisplay(property)}</div>
// //                 </div>
                
// //                 {property.is_available ? (
// //                   isPropertyOwner(property) ? (
// //                     <button 
// //                       onClick={() => {
// //                         onClose();
// //                         handleEditProperty(property.id);
// //                       }}
// //                       className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl font-bold text-base hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center justify-center space-x-2"
// //                     >
// //                       <Edit className="w-4 h-4" />
// //                       <span>Modifier</span>
// //                     </button>
// //                   ) : (
// //                     <button 
// //                       onClick={() => {
// //                         onClose();
// //                         handleReservation(property.id);
// //                       }}
// //                       className="w-full bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white py-3 rounded-2xl font-bold text-base hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
// //                     >
// //                       Réserver maintenant
// //                     </button>
// //                   )
// //                 ) : (
// //                   <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-2xl font-bold text-base text-center shadow-md">
// //                     Indisponible
// //                   </div>
// //                 )}
                
// //                 <div className={`text-center py-3 rounded-xl border mt-4 ${
// //                   !property.is_available ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'
// //                 }`}>
// //                   <div className="font-semibold text-sm">
// //                     {!property.is_available ? '⏳ Indisponible pour le moment' : '✅ Disponible'}
// //                   </div>
// //                 </div>

// //                 {isPropertyOwner(property) && (
// //                   <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
// //                     <div className="text-blue-700 text-sm text-center">
// //                       <strong>Ma propriété</strong>
// //                       <div className="text-xs mt-1">Cliquez sur "Modifier" pour gérer</div>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Informations de localisation rapide */}
// //                 <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
// //                   <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
// //                     <MapPin className="w-4 h-4 text-[#ea80fc]" />
// //                     <span>Localisation</span>
// //                   </h4>
// //                   <div className="space-y-2 text-sm text-gray-700">
// //                     <div className="flex justify-between">
// //                       <span className="font-medium">Ville :</span>
// //                       <span className="text-right">{property.city}</span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="font-medium">Pays :</span>
// //                       <span className="text-right">{property.country}</span>
// //                     </div>
// //                     {property.address && (
// //                       <div className="flex justify-between">
// //                         <span className="font-medium">Adresse :</span>
// //                         <span className="text-right max-w-[150px] truncate" title={property.address}>
// //                           {property.address}
// //                         </span>
// //                       </div>
// //                     )}
// //                     <div className="flex justify-between">
// //                       <span className="font-medium">Précision :</span>
// //                       <span className={`font-semibold ${hasExactLoc ? 'text-green-600' : 'text-blue-600'}`}>
// //                         {hasExactLoc ? 'Exacte (GPS)' : 'Par adresse'}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Points d'intérêt principaux */}
// //                 <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
// //                   <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
// //                     <span>🏪</span>
// //                     <span>Commerces à proximité</span>
// //                   </h4>
// //                   <div className="space-y-2">
// //                     {nearbyPOIs.slice(0, 3).map((poi, index) => (
// //                       <div key={index} className="flex items-center space-x-2 text-sm">
// //                         <span>{poi.icon}</span>
// //                         <span className="font-medium text-gray-700">{poi.name}</span>
// //                         <span className="text-gray-500 text-xs ml-auto">{poi.distanceDisplay}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea80fc] mx-auto mb-4"></div>
// //           <p className="text-gray-600">Chargement des propriétés...</p>
// //         </div>
// //       </div>
// //     );
// //   }
// // return (
// //     <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
// //       <div className="relative bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white py-20">
// //         <div className="absolute inset-0 bg-black/40"></div>
// //         <div className="relative max-w-7xl mx-auto px-6 text-center">
// //           <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tighter">
// //             L'Art de
// //             <span className="block bg-gradient-to-r from-[#ea80fc] to-purple-400 bg-clip-text text-transparent">
// //               l'Habitat
// //             </span>
// //           </h1>
// //           <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed tracking-wide">
// //             Découvrez des propriétés d'exception où chaque détail raconte une histoire d'élégance
// //           </p>
          
// //           <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl rounded-2xl p-3 border border-white/20 shadow-2xl">
// //             <div className="flex flex-col md:flex-row gap-3">
// //               <div className="flex-1">
// //                 <div className="relative">
// //                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
// //                   <input
// //                     type="text"
// //                     placeholder="Rechercher une destination, un bien..."
// //                     value={searchQuery}
// //                     onChange={(e) => setSearchQuery(e.target.value)}
// //                     className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
// //                   />
// //                 </div>
// //               </div>
// //               <button 
// //                 onClick={() => setShowFilters(!showFilters)}
// //                 className="px-6 py-3 bg-gradient-to-r from-[#ea80fc] to-purple-500 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center space-x-2 shadow-md"
// //               >
// //                 <Filter className="w-4 h-4" />
// //                 <span>Filtres</span>
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="absolute bottom-0 left-0 right-0">
// //           <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-10">
// //             <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-current text-white"></path>
// //             <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-current text-white"></path>
// //             <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-current text-white"></path>
// //           </svg>
// //         </div>
// //       </div>

// //       {showFilters && (
// //         <div className="max-w-7xl mx-auto px-6 py-6 -mt-6 relative z-10">
// //           <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-xl font-black text-gray-900">Filtres Avancés</h3>
// //               <button 
// //                 onClick={() => setShowFilters(false)}
// //                 className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
// //               >
// //                 <X className="w-4 h-4 text-gray-600" />
// //               </button>
// //             </div>
            
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">Type de bien</label>
// //                 <select
// //                   value={filters.type || ''}
// //                   onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
// //                   className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
// //                 >
// //                   <option value="all">Tous les types</option>
// //                   <option value="apartment">Appartement</option>
// //                   <option value="house">Maison</option>
// //                   <option value="villa">Villa</option>
// //                   <option value="studio">Studio</option>
// //                   <option value="loft">Loft</option>
// //                   <option value="chalet">Chalet</option>
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
// //                   Prix minimum
// //                 </label>
// //                 <div className="relative">
// //                   <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
// //                   <input
// //                     type="number"
// //                     value={filters.min_price || ''}
// //                     onChange={(e) => setFilters({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined })}
// //                     className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
// //                     placeholder="0"
// //                     min="0"
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
// //                   Prix maximum
// //                 </label>
// //                 <div className="relative">
// //                   <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
// //                   <input
// //                     type="number"
// //                     value={filters.max_price || ''}
// //                     onChange={(e) => setFilters({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined })}
// //                     className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
// //                     placeholder="1000"
// //                     min="0"
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
// //                   Voyageurs
// //                 </label>
// //                 <div className="relative">
// //                   <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
// //                   <input
// //                     type="number"
// //                     value={filters.guests || ''}
// //                     onChange={(e) => setFilters({ ...filters, guests: e.target.value ? Number(e.target.value) : undefined })}
// //                     className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
// //                     placeholder="2"
// //                     min="1"
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
// //               <button
// //                 onClick={() => {
// //                   setFilters({});
// //                   setSearchQuery('');
// //                 }}
// //                 className="text-gray-600 hover:text-[#ea80fc] font-semibold text-sm transition-colors duration-300 flex items-center space-x-2"
// //               >
// //                 <span>Réinitialiser tout</span>
// //               </button>
// //               <div className="flex space-x-3">
// //                 <button 
// //                   onClick={() => setShowFilters(false)}
// //                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold tracking-wide hover:bg-gray-200 transition-all duration-300"
// //                 >
// //                   Annuler
// //                 </button>
// //                 <button 
// //                   onClick={() => setShowFilters(false)}
// //                   className="px-6 py-2 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-xl font-semibold tracking-wide hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
// //                 >
// //                   Appliquer
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <div className="max-w-7xl mx-auto px-6 py-12">
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
// //           <div>
// //             <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
// //               {filteredProperties.length} Œuvres Immobilières
// //             </h2>
// //             <p className="text-gray-600 text-base tracking-wide">Des propriétés qui redéfinissent l'excellence</p>
// //           </div>
          
// //           {currentUser && (
// //             <div className="bg-gradient-to-r from-[#ea80fc]/10 to-purple-500/10 px-3 py-1 rounded-xl border border-[#ea80fc]/20 mt-4 md:mt-0">
// //               <span className="text-gray-600 text-xs">
// //                 Connecté en tant que <span className="font-semibold text-gray-900 capitalize">{currentUser.role}</span>
// //               </span>
// //             </div>
// //           )}
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
// //           {filteredProperties.map(property => (
// //             <div 
// //               key={property.id} 
// //               className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer flex flex-col"
// //               onClick={() => setSelectedProperty(property)}
// //             >
// //               <div className="relative h-48 overflow-hidden">
// //                 <img
// //                   src={getPropertyImage(property)}
// //                   alt={property.title}
// //                   className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
// //                   onError={(e) => {
// //                     e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
// //                   }}
// //                 />
// //                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
// //                 <div className="absolute top-3 left-3 flex flex-col space-y-1">
// //                   <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-xs font-semibold capitalize tracking-wide border border-gray-200">
// //                     {getPropertyTypeLabel(property.property_type)}
// //                   </span>
// //                   {property.rating && (
// //                     <span className="bg-black/80 text-white px-1.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm flex items-center space-x-1">
// //                       <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
// //                       <span>{property.rating}</span>
// //                     </span>
// //                   )}
// //                   {isPropertyOwner(property) && (
// //                     <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-1.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm">
// //                       Votre bien
// //                     </span>
// //                   )}
// //                 </div>
                
// //                 <button
// //                   onClick={(e) => toggleFavorite(property.id, e)}
// //                   className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-gray-300 shadow-sm"
// //                 >
// //                   <Heart 
// //                     className={`w-4 h-4 transition-all duration-300 ${
// //                       favorites.has(property.id) 
// //                         ? 'fill-[#ea80fc] text-[#ea80fc]' 
// //                         : 'text-gray-600'
// //                     }`} 
// //                   />
// //                 </button>

// //                 <div className="absolute bottom-3 left-3">
// //                   <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-3 py-1.5 rounded-xl shadow-lg">
// //                     <span className="text-lg font-black">{getPriceDisplay(property)}</span>
// //                   </div>
// //                 </div>

// //                 <div className="absolute bottom-3 right-3">
// //                   <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-xl border border-gray-200 flex items-center space-x-1 group-hover:bg-[#ea80fc] group-hover:text-white transition-all duration-300 shadow-sm">
// //                     <Eye className="w-3 h-3" />
// //                     <span className="text-xs font-medium">Détails</span>
// //                     <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
// //                   </div>
// //                 </div>

// //                 {!property.is_available && (
// //                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
// //                     <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl border border-gray-200">
// //                       <span className="font-semibold text-sm">Indisponible</span>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="p-4 flex-1 flex flex-col">
// //                 <div className="mb-3 flex-1">
// //                   <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-700 transition-colors tracking-tight">
// //                     {property.title}
// //                   </h3>
// //                   <div className="flex items-center text-gray-600 space-x-1">
// //                     <MapPin className="w-3 h-3" />
// //                     <span className="text-xs font-medium tracking-wide">{property.city}, {property.country}</span>
// //                   </div>
// //                 </div>

// //                 <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed flex-1">
// //                   {property.description}
// //                 </p>

// //                 <div className="flex items-center justify-between text-gray-600 mb-3">
// //                   <div className="flex items-center space-x-1">
// //                     <Users className="w-3 h-3" />
// //                     <span className="text-xs font-medium tracking-wide">{property.max_guests}</span>
// //                   </div>
// //                   <div className="flex items-center space-x-1">
// //                     <Bed className="w-3 h-3" />
// //                     <span className="text-xs font-medium tracking-wide">{property.bedrooms}</span>
// //                   </div>
// //                   <div className="flex items-center space-x-1">
// //                     <Bath className="w-3 h-3" />
// //                     <span className="text-xs font-medium tracking-wide">{property.bathrooms}</span>
// //                   </div>
// //                 </div>

// //                 {property.amenities && property.amenities.length > 0 && (
// //                   <div className="flex items-center space-x-2 mb-3">
// //                     {property.amenities.slice(0, 2).map((amenity, index) => (
// //                       <div key={index} className="flex items-center space-x-1 text-gray-500">
// //                         <span className="text-xs">{getAmenityIcon(amenity)}</span>
// //                         <span className="text-xs font-medium tracking-wide capitalize">{amenity}</span>
// //                       </div>
// //                     ))}
// //                     {property.amenities.length > 2 && (
// //                       <span className="text-xs text-gray-400 font-medium">
// //                         +{property.amenities.length - 2}
// //                       </span>
// //                     )}
// //                   </div>
// //                 )}

// //                 <div className="flex items-center justify-between mt-auto">
// //                   <div className={`flex items-center space-x-1 ${
// //                     !property.is_available ? 'text-orange-600' : 'text-green-600'
// //                   }`}>
// //                     <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
// //                       !property.is_available ? 'bg-orange-500' : 'bg-green-500'
// //                     }`}></div>
// //                     <span className="text-xs font-medium">
// //                       {!property.is_available ? 'Indisponible' : 'Disponible'}
// //                     </span>
// //                   </div>
                  
// //                   {property.is_available && (
// //                     isPropertyOwner(property) ? (
// //                       <button 
// //                         onClick={(e) => handleEditProperty(property.id, e)}
// //                         className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transform hover:scale-[1.05] transition-all duration-300 flex items-center space-x-1 shadow-md"
// //                       >
// //                         <Edit className="w-3 h-3" />
// //                         <span>Modifier</span>
// //                       </button>
// //                     ) : (
// //                       <button 
// //                         onClick={(e) => handleReservation(property.id, e)}
// //                         className="px-3 py-1.5 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transform hover:scale-[1.05] transition-all duration-300 flex items-center space-x-1 shadow-md"
// //                       >
// //                         <Calendar className="w-3 h-3" />
// //                         <span>Réserver</span>
// //                       </button>
// //                     )
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {filteredProperties.length === 0 && properties.length > 0 && (
// //           <div className="text-center py-16">
// //             <div className="text-6xl mb-4">🏛️</div>
// //             <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Aucune propriété trouvée</h3>
// //             <p className="text-gray-600 text-base max-w-md mx-auto tracking-wide">
// //               Ajustez vos critères de recherche pour découvrir nos propriétés
// //             </p>
// //             <button
// //               onClick={() => {
// //                 setFilters({});
// //                 setSearchQuery('');
// //               }}
// //               className="mt-4 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
// //             >
// //               Réinitialiser les filtres
// //             </button>
// //           </div>
// //         )}

// //         {properties.length === 0 && (
// //           <div className="text-center py-16">
// //             <div className="text-6xl mb-4">🏠</div>
// //             <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Aucune propriété disponible</h3>
// //             <p className="text-gray-600 text-base max-w-md mx-auto tracking-wide">
// //               Aucune propriété n'est actuellement disponible à la location
// //             </p>
// //           </div>
// //         )}
// //       </div>

// //       {selectedProperty && (
// //         <PropertyDetailsModal 
// //           property={selectedProperty} 
// //           onClose={() => setSelectedProperty(null)} 
// //         />
// //       )}
// //     </div>
// //   );

// // }

// // src/components/HomePage.tsx
// import { useState, useEffect } from 'react';
// import { Search, MapPin, Users, Euro, Star, Calendar, Heart, Bed, Bath, ChevronRight, Eye, Filter, X, Edit, Navigation, MessageCircle, Clock, User, Send } from 'lucide-react';
// import { Property, SearchFilters, User as UserType } from '../types';
// import { api } from '../services/api';

// interface HomePageProps {
//   onNavigate: (view: 'home' | 'bookings' | 'owner' | 'booking-form' | 'login') => void;
//   onStartReservation: (propertyId: string) => void;
//   currentUser: UserType | null;
// }

// // Types pour les points d'intérêt
// interface PointOfInterest {
//   type: string;
//   name: string;
//   distance: number;
//   distanceDisplay: string;
//   icon: string;
// }

// // Types pour les fonctionnalités ajoutées
// interface VisitRequest {
//   id: string;
//   propertyId: string;
//   userId: string;
//   userName: string;
//   date: string;
//   time: string;
//   message: string;
//   status: 'pending' | 'confirmed' | 'rejected';
//   createdAt: string;
// }

// interface Message {
//   id: string;
//   propertyId: string;
//   fromUserId: string;
//   toUserId: string;
//   message: string;
//   timestamp: string;
//   isRead: boolean;
// }

// // Types de points d'intérêt standardisés
// const POI_TYPES = {
//   supermarket: { type: 'Supermarché', icon: '🛒', searchTerms: ['supermarket', 'grocery', 'market'] },
//   restaurant: { type: 'Restaurant', icon: '🍽️', searchTerms: ['restaurant', 'cafe', 'bistro'] },
//   transport: { type: 'Transport', icon: '🚇', searchTerms: ['subway', 'bus_station', 'train_station'] },
//   park: { type: 'Parc', icon: '🌳', searchTerms: ['park', 'garden', 'recreation_area'] },
//   school: { type: 'École', icon: '🏫', searchTerms: ['school', 'university', 'college'] },
//   pharmacy: { type: 'Pharmacie', icon: '💊', searchTerms: ['pharmacy', 'drugstore'] },
//   hospital: { type: 'Hôpital', icon: '🏥', searchTerms: ['hospital', 'clinic'] },
//   bank: { type: 'Banque', icon: '🏦', searchTerms: ['bank', 'atm'] },
//   shopping: { type: 'Centre commercial', icon: '🛍️', searchTerms: ['mall', 'shopping_center'] },
//   church: { type: 'Lieu de culte', icon: '⛪', searchTerms: ['church', 'cathedral', 'temple', 'mosque', 'synagogue'] }
// };

// // Fonctions utilitaires existantes...
// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371000;
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return R * c;
// };

// const formatDistance = (meters: number): string => {
//   if (meters < 1000) {
//     return `${Math.round(meters)} m`;
//   } else {
//     return `${(meters / 1000).toFixed(1)} km`;
//   }
// };

// const getUrbanDensity = (city: string): 'high' | 'medium' | 'low' => {
//   const highDensityCities = ['paris', 'lyon', 'marseille', 'lille', 'toulouse', 'bordeaux', 'london', 'berlin', 'madrid', 'rome'];
//   const mediumDensityCities = ['nantes', 'strasbourg', 'montpellier', 'nice', 'rennes', 'brussels', 'amsterdam', 'vienna', 'prague'];
  
//   const normalizedCity = city.toLowerCase();
  
//   if (highDensityCities.includes(normalizedCity)) return 'high';
//   if (mediumDensityCities.includes(normalizedCity)) return 'medium';
//   return 'low';
// };

// const getBaseDistance = (poiType: string, density: 'high' | 'medium' | 'low'): number => {
//   const baseDistances = {
//     supermarket: { high: 500, medium: 800, low: 1500 },
//     restaurant: { high: 300, medium: 500, low: 1000 },
//     transport: { high: 400, medium: 600, low: 1200 },
//     park: { high: 600, medium: 900, low: 2000 },
//     school: { high: 800, medium: 1200, low: 2500 },
//     pharmacy: { high: 400, medium: 600, low: 1500 },
//     hospital: { high: 1500, medium: 2500, low: 5000 },
//     bank: { high: 500, medium: 800, low: 2000 },
//     shopping: { high: 1000, medium: 1500, low: 3000 },
//     church: { high: 700, medium: 1000, low: 2000 }
//   };

//   const key = poiType.toLowerCase().replace(' ', '_') as keyof typeof baseDistances;
//   return baseDistances[key]?.[density] || 1000;
// };

// const generatePOIName = (type: string, city: string): string => {
//   const names = {
//     'Supermarché': ['Carrefour Market', 'Monoprix', 'Super U', 'Intermarché', 'Casino Shop'],
//     'Restaurant': ['Bistro du Centre', 'Café de la Place', 'Brasserie Moderne', 'Restaurant Gastronomique', 'Le Petit Bouchon'],
//     'Transport': ['Station de Métro', 'Gare SNCF', 'Arrêt de Bus', 'Station de Tram', 'Gare Routière'],
//     'Parc': ['Parc Municipal', 'Jardin Public', 'Square du Quartier', 'Bois de la Ville', 'Esplanade Verte'],
//     'École': ['École Primaire', 'Collège Public', 'Lycée Professionnel', 'École Maternelle', 'Campus Universitaire'],
//     'Pharmacie': ['Pharmacie Centrale', 'Pharmacie de Garde', 'Pharmacie du Quartier', 'Parapharmacie', 'Officine Municipale'],
//     'Hôpital': ['Centre Hospitalier', 'Clinique Saint-Louis', 'Hôpital Regional', 'Centre Médical', 'Polyclinique'],
//     'Banque': ['Crédit Agricole', 'BNP Paribas', 'Société Générale', 'Caisse d\'Épargne', 'Banque Populaire'],
//     'Centre commercial': ['Centre Commercial', 'Galerie Marchande', 'Plaza Shopping', 'Mail Commercial', 'Galerie Lafayette'],
//     'Lieu de culte': ['Église Saint-Pierre', 'Cathédrale Notre-Dame', 'Temple Protestant', 'Mosquée de la Ville', 'Synagogue Centrale']
//   };

//   const typeNames = names[type as keyof typeof names] || ['Service Local'];
//   const randomName = typeNames[Math.floor(Math.random() * typeNames.length)];
  
//   return randomName;
// };

// const getGoogleMapsUrl = (property: Property): string => {
//   if (hasExactLocation(property)) {
//     return `https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=15`;
//   } else {
//     const query = encodeURIComponent(`${property.address || ''} ${property.city} ${property.country}`.trim());
//     return `https://www.google.com/maps/search/?api=1&query=${query}`;
//   }
// };

// const getNavigationUrl = (property: Property): string => {
//   if (hasExactLocation(property)) {
//     return `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
//   } else {
//     const query = encodeURIComponent(`${property.address || ''} ${property.city} ${property.country}`.trim());
//     return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
//   }
// };

// const hasExactLocation = (property: Property): boolean => {
//   return !!(property.latitude && property.longitude);
// };

// const getRealPOIs = async (lat: number, lng: number, city: string): Promise<PointOfInterest[]> => {
//   try {
//     const urbanDensity = getUrbanDensity(city);
    
//     const allTypes = Object.values(POI_TYPES);
//     const selectedTypes = [...allTypes]
//       .sort(() => Math.random() - 0.5)
//       .slice(0, 6);
    
//     if (!selectedTypes.find(t => t.type === 'Lieu de culte')) {
//       selectedTypes[Math.floor(Math.random() * selectedTypes.length)] = POI_TYPES.church;
//     }

//     const pois: PointOfInterest[] = [];

//     selectedTypes.forEach(poiType => {
//       const baseDistance = getBaseDistance(poiType.type, urbanDensity);
//       const variation = (Math.random() - 0.5) * 0.6;
//       const distance = Math.max(200, baseDistance * (1 + variation));
//       const distanceInMeters = Math.round(distance);
      
//       pois.push({
//         type: poiType.type,
//         name: generatePOIName(poiType.type, city),
//         distance: distanceInMeters,
//         distanceDisplay: formatDistance(distanceInMeters),
//         icon: poiType.icon
//       });
//     });

//     return pois.sort((a, b) => a.distance - b.distance);
//   } catch (error) {
//     console.error('Erreur chargement POIs:', error);
//     return getFallbackPOIs(city);
//   }
// };

// const getFallbackPOIs = (city: string): PointOfInterest[] => {
//   const urbanDensity = getUrbanDensity(city);
//   const baseDistances = {
//     supermarket: getBaseDistance('supermarket', urbanDensity),
//     restaurant: getBaseDistance('restaurant', urbanDensity),
//     transport: getBaseDistance('transport', urbanDensity),
//     park: getBaseDistance('park', urbanDensity),
//     school: getBaseDistance('school', urbanDensity),
//     pharmacy: getBaseDistance('pharmacy', urbanDensity),
//     church: getBaseDistance('church', urbanDensity)
//   };

//   return [
//     { type: 'Supermarché', name: 'Carrefour Market', distance: baseDistances.supermarket, distanceDisplay: formatDistance(baseDistances.supermarket), icon: '🛒' },
//     { type: 'Restaurant', name: 'Bistro du Centre', distance: baseDistances.restaurant, distanceDisplay: formatDistance(baseDistances.restaurant), icon: '🍽️' },
//     { type: 'Transport', name: 'Station de Métro', distance: baseDistances.transport, distanceDisplay: formatDistance(baseDistances.transport), icon: '🚇' },
//     { type: 'Parc', name: 'Parc Municipal', distance: baseDistances.park, distanceDisplay: formatDistance(baseDistances.park), icon: '🌳' },
//     { type: 'École', name: 'École Primaire', distance: baseDistances.school, distanceDisplay: formatDistance(baseDistances.school), icon: '🏫' },
//     { type: 'Pharmacie', name: 'Pharmacie Centrale', distance: baseDistances.pharmacy, distanceDisplay: formatDistance(baseDistances.pharmacy), icon: '💊' },
//     { type: 'Lieu de culte', name: 'Église Saint-Pierre', distance: baseDistances.church, distanceDisplay: formatDistance(baseDistances.church), icon: '⛪' }
//   ];
// };

// const generateRealisticPOIs = async (property: Property): Promise<PointOfInterest[]> => {
//   if (!property.latitude || !property.longitude) {
//     return getFallbackPOIs(property.city);
//   }

//   try {
//     return await getRealPOIs(property.latitude, property.longitude, property.city);
//   } catch (error) {
//     console.error('Erreur génération POIs réalistes:', error);
//     return getFallbackPOIs(property.city);
//   }
// };

// const getNearbyPointsOfInterest = async (property: Property): Promise<PointOfInterest[]> => {
//   return await generateRealisticPOIs(property);
// };

// export default function HomePage({ onNavigate, onStartReservation, currentUser }: HomePageProps) {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
//   const [cities, setCities] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filters, setFilters] = useState<SearchFilters>({});
//   const [favorites, setFavorites] = useState<Set<string>>(new Set());
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [activeTab, setActiveTab] = useState<'details' | 'visit' | 'messages'>('details');

//   useEffect(() => {
//     loadProperties();
//     loadCities();
//     loadVisitRequests();
//     loadMessages();
//   }, []);

//   useEffect(() => {
//     filterProperties();
//   }, [properties, filters, searchQuery]);

//   const loadProperties = async () => {
//     try {
//       const data = await api.getProperties();
//       setProperties(data);
//     } catch (error) {
//       console.error('Erreur chargement propriétés:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadCities = async () => {
//     try {
//       const data = await api.getCities();
//       setCities(data);
//     } catch (error) {
//       console.error('Erreur chargement villes:', error);
//       const uniqueCities = Array.from(new Set(properties.map(p => p.city))).sort();
//       setCities(uniqueCities);
//     }
//   };

//   const loadVisitRequests = async () => {
//     // Simulation de chargement des demandes de visite
//     const mockRequests: VisitRequest[] = [
//       {
//         id: '1',
//         propertyId: '1',
//         userId: 'user1',
//         userName: 'Jean Dupont',
//         date: '2024-01-15',
//         time: '14:00',
//         message: 'Bonjour, je souhaiterais visiter ce bien si possible.',
//         status: 'pending',
//         createdAt: '2024-01-10T10:00:00Z'
//       }
//     ];
//     setVisitRequests(mockRequests);
//   };

//   const loadMessages = async () => {
//     // Simulation de chargement des messages
//     const mockMessages: Message[] = [
//       {
//         id: '1',
//         propertyId: '1',
//         fromUserId: 'user1',
//         toUserId: 'owner1',
//         message: 'Bonjour, le bien est-il toujours disponible ?',
//         timestamp: '2024-01-10T09:30:00Z',
//         isRead: true
//       },
//       {
//         id: '2',
//         propertyId: '1',
//         fromUserId: 'owner1',
//         toUserId: 'user1',
//         message: 'Oui, il est toujours disponible. Souhaitez-vous une visite ?',
//         timestamp: '2024-01-10T10:15:00Z',
//         isRead: false
//       }
//     ];
//     setMessages(mockMessages);
//   };

//   const filterProperties = () => {
//     let filtered = properties;

//     if (searchQuery) {
//       filtered = filtered.filter(p => 
//         p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (filters.city) {
//       filtered = filtered.filter(p => 
//         p.city.toLowerCase().includes(filters.city!.toLowerCase())
//       );
//     }

//     if (filters.type && filters.type !== 'all') {
//       filtered = filtered.filter(p => p.property_type === filters.type);
//     }

//     if (filters.min_price) {
//       filtered = filtered.filter(p => p.price_per_night >= filters.min_price!);
//     }

//     if (filters.max_price) {
//       filtered = filtered.filter(p => p.price_per_night <= filters.max_price!);
//     }

//     if (filters.guests) {
//       filtered = filtered.filter(p => p.max_guests >= filters.guests!);
//     }

//     setFilteredProperties(filtered);
//   };

//   const handleReservation = (propertyId: string, e?: React.MouseEvent) => {
//     if (e) e.stopPropagation();
    
//     if (!currentUser) {
//       alert('Veuillez vous connecter pour effectuer une réservation');
//       onNavigate('login');
//       return;
//     }
    
//     if (currentUser.role !== 'locataire' && currentUser.role !== 'admin') {
//       alert('Seuls les locataires peuvent effectuer des réservations');
//       return;
//     }
    
//     onStartReservation(propertyId);
//   };

//   const handleEditProperty = (propertyId: string, e?: React.MouseEvent) => {
//     if (e) e.stopPropagation();
//     onNavigate('owner');
//   };

//   const toggleFavorite = (propertyId: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const newFavorites = new Set(favorites);
//     if (newFavorites.has(propertyId)) {
//       newFavorites.delete(propertyId);
//     } else {
//       newFavorites.add(propertyId);
//     }
//     setFavorites(newFavorites);
//   };

//   // Nouvelles fonctions pour les fonctionnalités ajoutées
//   const handleVisitRequest = async (property: Property, date: string, time: string, message: string) => {
//     if (!currentUser) {
//       alert('Veuillez vous connecter pour demander une visite');
//       onNavigate('login');
//       return;
//     }

//     const newRequest: VisitRequest = {
//       id: Math.random().toString(36).substr(2, 9),
//       propertyId: property.id,
//       userId: currentUser.id,
//       userName: currentUser.nom,
//       date,
//       time,
//       message,
//       status: 'pending',
//       createdAt: new Date().toISOString()
//     };

//     setVisitRequests(prev => [...prev, newRequest]);
    
//     // Ici, vous enverriez normalement la demande au serveur
//     console.log('Demande de visite envoyée:', newRequest);
//     alert('Votre demande de visite a été envoyée au propriétaire !');
    
//     // Revenir à l'onglet détails
//     setActiveTab('details');
//   };

//   const handleSendMessage = async (property: Property, message: string) => {
//     if (!currentUser) {
//       alert('Veuillez vous connecter pour envoyer un message');
//       onNavigate('login');
//       return;
//     }

//     const newMessage: Message = {
//       id: Math.random().toString(36).substr(2, 9),
//       propertyId: property.id,
//       fromUserId: currentUser.id,
//       toUserId: property.owner_id,
//       message,
//       timestamp: new Date().toISOString(),
//       isRead: false
//     };

//     setMessages(prev => [...prev, newMessage]);
    
//     // Ici, vous enverriez normalement le message via Socket.io
//     console.log('Message envoyé:', newMessage);
//   };

//   const getPropertyImage = (property: Property) => {
//     if (property.images && property.images.length > 0) {
//       const firstImage = property.images[0];
      
//       if (firstImage.startsWith('http')) {
//         return firstImage;
//       }
      
//       if (firstImage.startsWith('/')) {
//         return `http://localhost:5000${firstImage}`;
//       }
      
//       if (firstImage.includes('pexels.com') || firstImage.includes('unsplash.com')) {
//         return firstImage;
//       }
      
//       return `http://localhost:5000${firstImage}`;
//     }
    
//     return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
//   };

//   const getPropertyTypeLabel = (type: string) => {
//     const types: { [key: string]: string } = {
//       apartment: 'Appartement',
//       house: 'Maison',
//       villa: 'Villa',
//       studio: 'Studio',
//       loft: 'Loft',
//       chalet: 'Chalet'
//     };
//     return types[type] || type;
//   };

//   const getPriceDisplay = (property: Property) => {
//     const price = property.price_per_night;
//     const priceType = property.price_type || 'night';
    
//     if (priceType === 'month') {
//       return `${price}€ / mois`;
//     }
//     return `${price}€ / nuit`;
//   };

//   const getAmenityIcon = (amenity: string) => {
//     switch (amenity.toLowerCase()) {
//       case 'wifi': return '📶';
//       case 'parking': return '🅿️';
//       case 'climatisation': return '❄️';
//       case 'piscine': return '🏊';
//       case 'jardin': return '🌳';
//       case 'cheminée': return '🔥';
//       case 'terrasse': return '🌞';
//       case 'vue mer': return '🌊';
//       case 'ascenseur': return '🛗';
//       default: return '✨';
//     }
//   };

//   const isPropertyOwner = (property: Property) => {
//     return currentUser && currentUser.role === 'proprietaire' && property.owner_id === currentUser.id;
//   };

//   // Composants pour les nouvelles fonctionnalités
//   const VisitRequestForm = ({ property, onClose }: { property: Property, onClose: () => void }) => {
//     const [date, setDate] = useState('');
//     const [time, setTime] = useState('');
//     const [message, setMessage] = useState('');

//     const handleSubmit = (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!date || !time) {
//         alert('Veuillez sélectionner une date et une heure');
//         return;
//       }
//       handleVisitRequest(property, date, time, message);
//       onClose();
//     };

//     const getMinDate = () => {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);
//       return tomorrow.toISOString().split('T')[0];
//     };

//     const getMaxDate = () => {
//       const inTwoWeeks = new Date();
//       inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
//       return inTwoWeeks.toISOString().split('T')[0];
//     };

//     return (
//       <div className="bg-white rounded-2xl p-6 border border-gray-200">
//         <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center space-x-2">
//           <Clock className="w-5 h-5 text-[#ea80fc]" />
//           <span>Demander une visite</span>
//         </h3>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 min={getMinDate()}
//                 max={getMaxDate()}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Heure</label>
//               <select
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
//                 required
//               >
//                 <option value="">Sélectionnez</option>
//                 <option value="09:00">09:00</option>
//                 <option value="10:00">10:00</option>
//                 <option value="11:00">11:00</option>
//                 <option value="14:00">14:00</option>
//                 <option value="15:00">15:00</option>
//                 <option value="16:00">16:00</option>
//                 <option value="17:00">17:00</option>
//               </select>
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Message (optionnel)</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               rows={3}
//               placeholder="Bonjour, je souhaiterais visiter ce bien..."
//               className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent resize-none"
//             />
//           </div>
          
//           <div className="flex space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-4 py-2 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
//             >
//               Envoyer la demande
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   };

//   const MessagingInterface = ({ property }: { property: Property }) => {
//     const [newMessage, setNewMessage] = useState('');
//     const propertyMessages = messages.filter(msg => msg.propertyId === property.id);

//     const handleSubmit = (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!newMessage.trim()) return;
      
//       handleSendMessage(property, newMessage);
//       setNewMessage('');
//     };

//     const formatTime = (timestamp: string) => {
//       return new Date(timestamp).toLocaleTimeString('fr-FR', { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       });
//     };

//     return (
//       <div className="bg-white rounded-2xl border border-gray-200 h-96 flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
//             <MessageCircle className="w-4 h-4 text-[#ea80fc]" />
//             <span>Messagerie</span>
//           </h3>
//         </div>
        
//         <div className="flex-1 overflow-y-auto p-4 space-y-3">
//           {propertyMessages.length === 0 ? (
//             <div className="text-center text-gray-500 py-8">
//               <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//               <p>Aucun message</p>
//               <p className="text-sm">Soyez le premier à démarrer la conversation</p>
//             </div>
//           ) : (
//             propertyMessages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`flex ${msg.fromUserId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-xs rounded-2xl px-4 py-2 ${
//                     msg.fromUserId === currentUser?.id
//                       ? 'bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white'
//                       : 'bg-gray-100 text-gray-900'
//                   }`}
//                 >
//                   <p className="text-sm">{msg.message}</p>
//                   <p className={`text-xs mt-1 ${
//                     msg.fromUserId === currentUser?.id ? 'text-white/70' : 'text-gray-500'
//                   }`}>
//                     {formatTime(msg.timestamp)}
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Tapez votre message..."
//               className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
//             />
//             <button
//               type="submit"
//               className="px-4 py-2 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
//             >
//               <Send className="w-4 h-4" />
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   };

//   const PropertyDetailsModal = ({ property, onClose }: { property: Property, onClose: () => void }) => {
//     const [nearbyPOIs, setNearbyPOIs] = useState<PointOfInterest[]>([]);
//     const [isLoadingPOIs, setIsLoadingPOIs] = useState(true);
//     const [showVisitForm, setShowVisitForm] = useState(false);
    
//     const hasExactLoc = hasExactLocation(property);

//     useEffect(() => {
//       const loadPOIs = async () => {
//         setIsLoadingPOIs(true);
//         const pois = await getNearbyPointsOfInterest(property);
//         setNearbyPOIs(pois);
//         setIsLoadingPOIs(false);
//       };
      
//       loadPOIs();
//     }, [property]);

//     const propertyVisitRequests = visitRequests.filter(req => req.propertyId === property.id);
//     const canRequestVisit = currentUser && currentUser.role === 'locataire' && !isPropertyOwner(property);
    
//     return (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
//         <div 
//           className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="relative h-80">
//             <img
//               src={getPropertyImage(property)}
//               alt={property.title}
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
//               }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
//             <button
//               onClick={onClose}
//               className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
//             >
//               <X className="w-5 h-5" />
//             </button>
            
//             <div className="absolute bottom-6 left-6 text-white">
//               <h2 className="text-3xl font-black mb-2">{property.title}</h2>
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-1">
//                   <MapPin className="w-5 h-5" />
//                   <span className="text-lg">{property.city}, {property.country} </span>
//                 </div>
//                 {property.rating && (
//                   <div className="flex items-center space-x-1">
//                     <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                     <span className="text-lg font-semibold">{property.rating}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {!property.is_available && (
//               <div className="absolute top-6 left-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg">
//                 Indisponible
//               </div>
//             )}

//             {isPropertyOwner(property) && (
//               <div className="absolute top-6 left-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg">
//                 Ma propriété
//               </div>
//             )}
//           </div>

//           {/* Navigation par onglets */}
//           <div className="border-b border-gray-200">
//             <div className="px-8 pt-6 flex space-x-8">
//               <button
//                 onClick={() => setActiveTab('details')}
//                 className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
//                   activeTab === 'details'
//                     ? 'border-[#ea80fc] text-[#ea80fc]'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Détails
//               </button>
              
//               {canRequestVisit && (
//                 <button
//                   onClick={() => setActiveTab('visit')}
//                   className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
//                     activeTab === 'visit'
//                       ? 'border-[#ea80fc] text-[#ea80fc]'
//                       : 'border-transparent text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   📅 Demander une visite
//                 </button>
//               )}
              
//               {currentUser && !isPropertyOwner(property) && (
//                 <button
//                   onClick={() => setActiveTab('messages')}
//                   className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
//                     activeTab === 'messages'
//                       ? 'border-[#ea80fc] text-[#ea80fc]'
//                       : 'border-transparent text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   💬 Messagerie
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="p-8">
//             {activeTab === 'details' && (
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-2">
//                   {/* Contenu des détails existant */}
//                   <h3 className="text-2xl font-black text-gray-900 mb-4">Description</h3>
//                   <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>
                  
//                   <h3 className="text-2xl font-black text-gray-900 mb-4">Caractéristiques</h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                     <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
//                       <Users className="w-6 h-6 text-[#ea80fc] mx-auto mb-2" />
//                       <div className="text-sm text-gray-600">Voyageurs</div>
//                       <div className="font-black text-gray-900">{property.max_guests}</div>
//                     </div>
//                     <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
//                       <Bed className="w-6 h-6 text-[#ea80fc] mx-auto mb-2" />
//                       <div className="text-sm text-gray-600">Chambres</div>
//                       <div className="font-black text-gray-900">{property.bedrooms}</div>
//                     </div>
//                     <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
//                       <Bath className="w-6 h-6 text-[#ea80fc] mx-auto mb-2" />
//                       <div className="text-sm text-gray-600">Salles de bain</div>
//                       <div className="font-black text-gray-900">{property.bathrooms}</div>
//                     </div>
//                     <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
//                       <div className="w-6 h-6 text-[#ea80fc] mx-auto mb-2">🏠</div>
//                       <div className="text-sm text-gray-600">Type</div>
//                       <div className="font-black text-gray-900 capitalize">{getPropertyTypeLabel(property.property_type)}</div>
//                     </div>
//                   </div>

//                   {property.amenities && property.amenities.length > 0 && (
//                     <>
//                       <h3 className="text-2xl font-black text-gray-900 mb-4">Équipements</h3>
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                         {property.amenities.map((amenity, index) => (
//                           <div key={index} className="flex items-center space-x-2 bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200">
//                             <span className="text-lg">{getAmenityIcon(amenity)}</span>
//                             <span className="text-gray-700 font-medium capitalize">{amenity}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </>
//                   )}

//                   {/* Section Localisation enrichie */}
//                   <div className="mt-8">
//                     <h3 className="text-2xl font-black text-gray-900 mb-4">Localisation & Environnement</h3>
//                     <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
//                       {/* Adresse et précision */}
//                       <div className="mb-6">
//                         <div className="flex items-center space-x-2 text-gray-700 mb-3">
//                           <MapPin className="w-5 h-5 text-[#ea80fc]" />
//                           <span className="font-semibold text-lg">Adresse :</span>
//                           <span className="text-lg">{property.address || `${property.city}, ${property.country}`}</span>
//                         </div>
                        
//                         <div className="flex items-center justify-between">
//                           <div className={`flex items-center space-x-2 ${hasExactLoc ? 'text-green-600' : 'text-blue-600'}`}>
//                             <div className={`w-3 h-3 rounded-full ${hasExactLoc ? 'bg-green-500' : 'bg-blue-500'}`}></div>
//                             <span className="font-medium">
//                               {hasExactLoc ? '📍 Emplacement GPS exact' : '📍 Localisation par adresse'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Points d'intérêt à proximité */}
//                       <div className="mb-6">
//                         <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center space-x-2">
//                           <span>🏙️</span>
//                           <span>À proximité</span>
//                           {isLoadingPOIs && (
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ea80fc]"></div>
//                           )}
//                         </h4>
//                         {isLoadingPOIs ? (
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                             {[...Array(6)].map((_, index) => (
//                               <div key={index} className="animate-pulse flex items-center space-x-3 bg-gray-100 rounded-xl p-3">
//                                 <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
//                                 <div className="flex-1">
//                                   <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//                                   <div className="h-3 bg-gray-300 rounded w-1/2"></div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                             {nearbyPOIs.map((poi, index) => (
//                               <div key={index} className="flex items-center space-x-3 bg-white rounded-xl p-3 border border-gray-200 hover:shadow-md transition-shadow">
//                                 <span className="text-2xl">{poi.icon}</span>
//                                 <div className="flex-1">
//                                   <div className="font-semibold text-gray-900 text-sm">{poi.name}</div>
//                                   <div className="text-xs text-gray-500">{poi.type} • {poi.distanceDisplay}</div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Boutons d'action */}
//                       <div className="flex flex-col sm:flex-row gap-3">
//                         <a 
//                           href={getGoogleMapsUrl(property)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex-1 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
//                         >
//                           <MapPin className="w-4 h-4" />
//                           <span>Explorer sur Google Maps</span>
//                         </a>
//                         <a 
//                           href={getNavigationUrl(property)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
//                         >
//                           <Navigation className="w-4 h-4" />
//                           <span>Itinéraire</span>
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 h-fit border border-gray-200 shadow-lg">
//                   <div className="text-center mb-6">
//                     <div className="text-2xl font-black text-gray-900">{getPriceDisplay(property)}</div>
//                   </div>
                  
//                   {property.is_available ? (
//                     isPropertyOwner(property) ? (
//                       <button 
//                         onClick={() => {
//                           onClose();
//                           handleEditProperty(property.id);
//                         }}
//                         className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl font-bold text-base hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center justify-center space-x-2"
//                       >
//                         <Edit className="w-4 h-4" />
//                         <span>Modifier</span>
//                       </button>
//                     ) : (
//                       <button 
//                         onClick={() => {
//                           onClose();
//                           handleReservation(property.id);
//                         }}
//                         className="w-full bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white py-3 rounded-2xl font-bold text-base hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
//                       >
//                         Réserver maintenant
//                       </button>
//                     )
//                   ) : (
//                     <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-2xl font-bold text-base text-center shadow-md">
//                       Indisponible
//                     </div>
//                   )}
                  
//                   <div className={`text-center py-3 rounded-xl border mt-4 ${
//                     !property.is_available ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'
//                   }`}>
//                     <div className="font-semibold text-sm">
//                       {!property.is_available ? '⏳ Indisponible pour le moment' : '✅ Disponible'}
//                     </div>
//                   </div>

//                   {isPropertyOwner(property) && (
//                     <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
//                       <div className="text-blue-700 text-sm text-center">
//                         <strong>Ma propriété</strong>
//                         <div className="text-xs mt-1">Cliquez sur "Modifier" pour gérer</div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Informations de localisation rapide */}
//                   <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
//                     <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
//                       <MapPin className="w-4 h-4 text-[#ea80fc]" />
//                       <span>Localisation</span>
//                     </h4>
//                     <div className="space-y-2 text-sm text-gray-700">
//                       <div className="flex justify-between">
//                         <span className="font-medium">Ville :</span>
//                         <span className="text-right">{property.city}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="font-medium">Pays :</span>
//                         <span className="text-right">{property.country}</span>
//                       </div>
//                       {property.address && (
//                         <div className="flex justify-between">
//                           <span className="font-medium">Adresse :</span>
//                           <span className="text-right max-w-[150px] truncate" title={property.address}>
//                             {property.address}
//                           </span>
//                         </div>
//                       )}
//                       <div className="flex justify-between">
//                         <span className="font-medium">Précision :</span>
//                         <span className={`font-semibold ${hasExactLoc ? 'text-green-600' : 'text-blue-600'}`}>
//                           {hasExactLoc ? 'Exacte (GPS)' : 'Par adresse'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Points d'intérêt principaux */}
//                   <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
//                     <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
//                       <span>🏪</span>
//                       <span>Commerces à proximité</span>
//                     </h4>
//                     <div className="space-y-2">
//                       {nearbyPOIs.slice(0, 3).map((poi, index) => (
//                         <div key={index} className="flex items-center space-x-2 text-sm">
//                           <span>{poi.icon}</span>
//                           <span className="font-medium text-gray-700">{poi.name}</span>
//                           <span className="text-gray-500 text-xs ml-auto">{poi.distanceDisplay}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'visit' && (
//               <div className="max-w-2xl mx-auto">
//                 {showVisitForm ? (
//                   <VisitRequestForm 
//                     property={property} 
//                     onClose={() => setShowVisitForm(false)} 
//                   />
//                 ) : (
//                   <div className="text-center py-8">
//                     <Clock className="w-16 h-16 text-[#ea80fc] mx-auto mb-4" />
//                     <h3 className="text-2xl font-black text-gray-900 mb-2">Demander une visite</h3>
//                     <p className="text-gray-600 mb-6">
//                       Planifiez une visite de ce bien avec le propriétaire. Choisissez une date et une heure qui vous conviennent.
//                     </p>
//                     <button
//                       onClick={() => setShowVisitForm(true)}
//                       className="bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
//                     >
//                       Planifier une visite
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'messages' && (
//               <div className="max-w-4xl mx-auto">
//                 <MessagingInterface property={property} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea80fc] mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement des propriétés...</p>
//         </div>
//       </div>
//     );
//   }

//   // Le reste du composant HomePage (interface principale) reste inchangé...
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
//       {/* Header et recherche (inchangé) */}
//       <div className="relative bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white py-20">
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="relative max-w-7xl mx-auto px-6 text-center">
//           <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tighter">
//             L'Art de
//             <span className="block bg-gradient-to-r from-[#ea80fc] to-purple-400 bg-clip-text text-transparent">
//               l'Habitat
//             </span>
//           </h1>
//           <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed tracking-wide">
//             Découvrez des propriétés d'exception où chaque détail raconte une histoire d'élégance
//           </p>
          
//           <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl rounded-2xl p-3 border border-white/20 shadow-2xl">
//             <div className="flex flex-col md:flex-row gap-3">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Rechercher une destination, un bien..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
//                   />
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-6 py-3 bg-gradient-to-r from-[#ea80fc] to-purple-500 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center space-x-2 shadow-md"
//               >
//                 <Filter className="w-4 h-4" />
//                 <span>Filtres</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0">
//           <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-10">
//             <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-current text-white"></path>
//             <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-current text-white"></path>
//             <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-current text-white"></path>
//           </svg>
//         </div>
//       </div>

//       {showFilters && (
//         <div className="max-w-7xl mx-auto px-6 py-6 -mt-6 relative z-10">
//           <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-black text-gray-900">Filtres Avancés</h3>
//               <button 
//                 onClick={() => setShowFilters(false)}
//                 className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
//               >
//                 <X className="w-4 h-4 text-gray-600" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">Type de bien</label>
//                 <select
//                   value={filters.type || ''}
//                   onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
//                   className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
//                 >
//                   <option value="all">Tous les types</option>
//                   <option value="apartment">Appartement</option>
//                   <option value="house">Maison</option>
//                   <option value="villa">Villa</option>
//                   <option value="studio">Studio</option>
//                   <option value="loft">Loft</option>
//                   <option value="chalet">Chalet</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
//                   Prix minimum
//                 </label>
//                 <div className="relative">
//                   <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
//                   <input
//                     type="number"
//                     value={filters.min_price || ''}
//                     onChange={(e) => setFilters({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined })}
//                     className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
//                     placeholder="0"
//                     min="0"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
//                   Prix maximum
//                 </label>
//                 <div className="relative">
//                   <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
//                   <input
//                     type="number"
//                     value={filters.max_price || ''}
//                     onChange={(e) => setFilters({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined })}
//                     className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
//                     placeholder="1000"
//                     min="0"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
//                   Voyageurs
//                 </label>
//                 <div className="relative">
//                   <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
//                   <input
//                     type="number"
//                     value={filters.guests || ''}
//                     onChange={(e) => setFilters({ ...filters, guests: e.target.value ? Number(e.target.value) : undefined })}
//                     className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
//                     placeholder="2"
//                     min="1"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
//               <button
//                 onClick={() => {
//                   setFilters({});
//                   setSearchQuery('');
//                 }}
//                 className="text-gray-600 hover:text-[#ea80fc] font-semibold text-sm transition-colors duration-300 flex items-center space-x-2"
//               >
//                 <span>Réinitialiser tout</span>
//               </button>
//               <div className="flex space-x-3">
//                 <button 
//                   onClick={() => setShowFilters(false)}
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold tracking-wide hover:bg-gray-200 transition-all duration-300"
//                 >
//                   Annuler
//                 </button>
//                 <button 
//                   onClick={() => setShowFilters(false)}
//                   className="px-6 py-2 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-xl font-semibold tracking-wide hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
//                 >
//                   Appliquer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
//           <div>
//             <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
//               {filteredProperties.length} Œuvres Immobilières
//             </h2>
//             <p className="text-gray-600 text-base tracking-wide">Des propriétés qui redéfinissent l'excellence</p>
//           </div>
          
//           {currentUser && (
//             <div className="bg-gradient-to-r from-[#ea80fc]/10 to-purple-500/10 px-3 py-1 rounded-xl border border-[#ea80fc]/20 mt-4 md:mt-0">
//               <span className="text-gray-600 text-xs">
//                 Connecté en tant que <span className="font-semibold text-gray-900 capitalize">{currentUser.role}</span>
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
//           {filteredProperties.map(property => (
//             <div 
//               key={property.id} 
//               className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer flex flex-col"
//               onClick={() => setSelectedProperty(property)}
//             >
//               <div className="relative h-48 overflow-hidden">
//                 <img
//                   src={getPropertyImage(property)}
//                   alt={property.title}
//                   className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
//                   onError={(e) => {
//                     e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
//                   }}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
//                 <div className="absolute top-3 left-3 flex flex-col space-y-1">
//                   <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-xs font-semibold capitalize tracking-wide border border-gray-200">
//                     {getPropertyTypeLabel(property.property_type)}
//                   </span>
//                   {property.rating && (
//                     <span className="bg-black/80 text-white px-1.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm flex items-center space-x-1">
//                       <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
//                       <span>{property.rating}</span>
//                     </span>
//                   )}
//                   {isPropertyOwner(property) && (
//                     <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-1.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm">
//                       Votre bien
//                     </span>
//                   )}
//                 </div>
                
//                 <button
//                   onClick={(e) => toggleFavorite(property.id, e)}
//                   className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-gray-300 shadow-sm"
//                 >
//                   <Heart 
//                     className={`w-4 h-4 transition-all duration-300 ${
//                       favorites.has(property.id) 
//                         ? 'fill-[#ea80fc] text-[#ea80fc]' 
//                         : 'text-gray-600'
//                     }`} 
//                   />
//                 </button>

//                 <div className="absolute bottom-3 left-3">
//                   <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-3 py-1.5 rounded-xl shadow-lg">
//                     <span className="text-lg font-black">{getPriceDisplay(property)}</span>
//                   </div>
//                 </div>

//                 <div className="absolute bottom-3 right-3">
//                   <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-xl border border-gray-200 flex items-center space-x-1 group-hover:bg-[#ea80fc] group-hover:text-white transition-all duration-300 shadow-sm">
//                     <Eye className="w-3 h-3" />
//                     <span className="text-xs font-medium">Détails</span>
//                     <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
//                   </div>
//                 </div>

//                 {!property.is_available && (
//                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                     <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl border border-gray-200">
//                       <span className="font-semibold text-sm">Indisponible</span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 flex-1 flex flex-col">
//                 <div className="mb-3 flex-1">
//                   <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-700 transition-colors tracking-tight">
//                     {property.title}
//                   </h3>
//                   <div className="flex items-center text-gray-600 space-x-1">
//                     <MapPin className="w-3 h-3" />
//                     <span className="text-xs font-medium tracking-wide">{property.city}, {property.country}</span>
//                   </div>
//                 </div>

//                 <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed flex-1">
//                   {property.description}
//                 </p>

//                 <div className="flex items-center justify-between text-gray-600 mb-3">
//                   <div className="flex items-center space-x-1">
//                     <Users className="w-3 h-3" />
//                     <span className="text-xs font-medium tracking-wide">{property.max_guests}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Bed className="w-3 h-3" />
//                     <span className="text-xs font-medium tracking-wide">{property.bedrooms}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Bath className="w-3 h-3" />
//                     <span className="text-xs font-medium tracking-wide">{property.bathrooms}</span>
//                   </div>
//                 </div>

//                 {property.amenities && property.amenities.length > 0 && (
//                   <div className="flex items-center space-x-2 mb-3">
//                     {property.amenities.slice(0, 2).map((amenity, index) => (
//                       <div key={index} className="flex items-center space-x-1 text-gray-500">
//                         <span className="text-xs">{getAmenityIcon(amenity)}</span>
//                         <span className="text-xs font-medium tracking-wide capitalize">{amenity}</span>
//                       </div>
//                     ))}
//                     {property.amenities.length > 2 && (
//                       <span className="text-xs text-gray-400 font-medium">
//                         +{property.amenities.length - 2}
//                       </span>
//                     )}
//                   </div>
//                 )}

//                 <div className="flex items-center justify-between mt-auto">
//                   <div className={`flex items-center space-x-1 ${
//                     !property.is_available ? 'text-orange-600' : 'text-green-600'
//                   }`}>
//                     <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
//                       !property.is_available ? 'bg-orange-500' : 'bg-green-500'
//                     }`}></div>
//                     <span className="text-xs font-medium">
//                       {!property.is_available ? 'Indisponible' : 'Disponible'}
//                     </span>
//                   </div>
                  
//                   {property.is_available && (
//                     isPropertyOwner(property) ? (
//                       <button 
//                         onClick={(e) => handleEditProperty(property.id, e)}
//                         className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transform hover:scale-[1.05] transition-all duration-300 flex items-center space-x-1 shadow-md"
//                       >
//                         <Edit className="w-3 h-3" />
//                         <span>Modifier</span>
//                       </button>
//                     ) : (
//                       <button 
//                         onClick={(e) => handleReservation(property.id, e)}
//                         className="px-3 py-1.5 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transform hover:scale-[1.05] transition-all duration-300 flex items-center space-x-1 shadow-md"
//                       >
//                         <Calendar className="w-3 h-3" />
//                         <span>Réserver</span>
//                       </button>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredProperties.length === 0 && properties.length > 0 && (
//           <div className="text-center py-16">
//             <div className="text-6xl mb-4">🏛️</div>
//             <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Aucune propriété trouvée</h3>
//             <p className="text-gray-600 text-base max-w-md mx-auto tracking-wide">
//               Ajustez vos critères de recherche pour découvrir nos propriétés
//             </p>
//             <button
//               onClick={() => {
//                 setFilters({});
//                 setSearchQuery('');
//               }}
//               className="mt-4 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
//             >
//               Réinitialiser les filtres
//             </button>
//           </div>
//         )}

//         {properties.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-6xl mb-4">🏠</div>
//             <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Aucune propriété disponible</h3>
//             <p className="text-gray-600 text-base max-w-md mx-auto tracking-wide">
//               Aucune propriété n'est actuellement disponible à la location
//             </p>
//           </div>
//         )}
//       </div>

//       {selectedProperty && (
//         <PropertyDetailsModal 
//           property={selectedProperty} 
//           onClose={() => setSelectedProperty(null)} 
//         />
//       )}
//     </div>
//   );
// }

// src/components/HomePage.tsx
import { useState, useEffect } from 'react';
import { Search, MapPin, Users, Euro, Star, Calendar, Heart, Bed, Bath, ChevronRight, Eye, Filter, X, Edit, Navigation, MessageCircle, Clock, User, Send } from 'lucide-react';
import { Property, SearchFilters, User as UserType } from '../types';
import { api } from '../services/api';

interface HomePageProps {
  onNavigate: (view: 'home' | 'bookings' | 'owner' | 'booking-form' | 'login') => void;
  onStartReservation: (propertyId: string) => void;
  currentUser: UserType | null;
}

// Types pour les points d'intérêt
interface PointOfInterest {
  type: string;
  name: string;
  distance: number;
  distanceDisplay: string;
  icon: string;
}

// Types pour les fonctionnalités ajoutées
interface VisitRequest {
  id: string;
  property_id: string;
  user_id: string;
  user_name: string;
  requested_date: string;
  requested_time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  created_at: string;
  property_title?: string;
}

interface Message {
  id: string;
  property_id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  from_user_name?: string;
  property_title?: string;
}

// Types de points d'intérêt standardisés
const POI_TYPES = {
  supermarket: { type: 'Supermarché', icon: '🛒', searchTerms: ['supermarket', 'grocery', 'market'] },
  restaurant: { type: 'Restaurant', icon: '🍽️', searchTerms: ['restaurant', 'cafe', 'bistro'] },
  transport: { type: 'Transport', icon: '🚇', searchTerms: ['subway', 'bus_station', 'train_station'] },
  park: { type: 'Parc', icon: '🌳', searchTerms: ['park', 'garden', 'recreation_area'] },
  school: { type: 'École', icon: '🏫', searchTerms: ['school', 'university', 'college'] },
  pharmacy: { type: 'Pharmacie', icon: '💊', searchTerms: ['pharmacy', 'drugstore'] },
  hospital: { type: 'Hôpital', icon: '🏥', searchTerms: ['hospital', 'clinic'] },
  bank: { type: 'Banque', icon: '🏦', searchTerms: ['bank', 'atm'] },
  shopping: { type: 'Centre commercial', icon: '🛍️', searchTerms: ['mall', 'shopping_center'] },
  church: { type: 'Lieu de culte', icon: '⛪', searchTerms: ['church', 'cathedral', 'temple', 'mosque', 'synagogue'] }
};

// Fonctions utilitaires existantes...
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
};

const getUrbanDensity = (city: string): 'high' | 'medium' | 'low' => {
  const highDensityCities = ['paris', 'lyon', 'marseille', 'lille', 'toulouse', 'bordeaux', 'london', 'berlin', 'madrid', 'rome'];
  const mediumDensityCities = ['nantes', 'strasbourg', 'montpellier', 'nice', 'rennes', 'brussels', 'amsterdam', 'vienna', 'prague'];
  
  const normalizedCity = city.toLowerCase();
  
  if (highDensityCities.includes(normalizedCity)) return 'high';
  if (mediumDensityCities.includes(normalizedCity)) return 'medium';
  return 'low';
};

const getBaseDistance = (poiType: string, density: 'high' | 'medium' | 'low'): number => {
  const baseDistances = {
    supermarket: { high: 500, medium: 800, low: 1500 },
    restaurant: { high: 300, medium: 500, low: 1000 },
    transport: { high: 400, medium: 600, low: 1200 },
    park: { high: 600, medium: 900, low: 2000 },
    school: { high: 800, medium: 1200, low: 2500 },
    pharmacy: { high: 400, medium: 600, low: 1500 },
    hospital: { high: 1500, medium: 2500, low: 5000 },
    bank: { high: 500, medium: 800, low: 2000 },
    shopping: { high: 1000, medium: 1500, low: 3000 },
    church: { high: 700, medium: 1000, low: 2000 }
  };

  const key = poiType.toLowerCase().replace(' ', '_') as keyof typeof baseDistances;
  return baseDistances[key]?.[density] || 1000;
};

const generatePOIName = (type: string, city: string): string => {
  const names = {
    'Supermarché': ['Carrefour Market', 'Monoprix', 'Super U', 'Intermarché', 'Casino Shop'],
    'Restaurant': ['Bistro du Centre', 'Café de la Place', 'Brasserie Moderne', 'Restaurant Gastronomique', 'Le Petit Bouchon'],
    'Transport': ['Station de Métro', 'Gare SNCF', 'Arrêt de Bus', 'Station de Tram', 'Gare Routière'],
    'Parc': ['Parc Municipal', 'Jardin Public', 'Square du Quartier', 'Bois de la Ville', 'Esplanade Verte'],
    'École': ['École Primaire', 'Collège Public', 'Lycée Professionnel', 'École Maternelle', 'Campus Universitaire'],
    'Pharmacie': ['Pharmacie Centrale', 'Pharmacie de Garde', 'Pharmacie du Quartier', 'Parapharmacie', 'Officine Municipale'],
    'Hôpital': ['Centre Hospitalier', 'Clinique Saint-Louis', 'Hôpital Regional', 'Centre Médical', 'Polyclinique'],
    'Banque': ['Crédit Agricole', 'BNP Paribas', 'Société Générale', 'Caisse d\'Épargne', 'Banque Populaire'],
    'Centre commercial': ['Centre Commercial', 'Galerie Marchande', 'Plaza Shopping', 'Mail Commercial', 'Galerie Lafayette'],
    'Lieu de culte': ['Église Saint-Pierre', 'Cathédrale Notre-Dame', 'Temple Protestant', 'Mosquée de la Ville', 'Synagogue Centrale']
  };

  const typeNames = names[type as keyof typeof names] || ['Service Local'];
  const randomName = typeNames[Math.floor(Math.random() * typeNames.length)];
  
  return randomName;
};

const getGoogleMapsUrl = (property: Property): string => {
  if (hasExactLocation(property)) {
    return `https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=15`;
  } else {
    const query = encodeURIComponent(`${property.address || ''} ${property.city} ${property.country}`.trim());
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
};

const getNavigationUrl = (property: Property): string => {
  if (hasExactLocation(property)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
  } else {
    const query = encodeURIComponent(`${property.address || ''} ${property.city} ${property.country}`.trim());
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  }
};

const hasExactLocation = (property: Property): boolean => {
  return !!(property.latitude && property.longitude);
};

const getRealPOIs = async (lat: number, lng: number, city: string): Promise<PointOfInterest[]> => {
  try {
    const urbanDensity = getUrbanDensity(city);
    
    const allTypes = Object.values(POI_TYPES);
    const selectedTypes = [...allTypes]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    
    if (!selectedTypes.find(t => t.type === 'Lieu de culte')) {
      selectedTypes[Math.floor(Math.random() * selectedTypes.length)] = POI_TYPES.church;
    }

    const pois: PointOfInterest[] = [];

    selectedTypes.forEach(poiType => {
      const baseDistance = getBaseDistance(poiType.type, urbanDensity);
      const variation = (Math.random() - 0.5) * 0.6;
      const distance = Math.max(200, baseDistance * (1 + variation));
      const distanceInMeters = Math.round(distance);
      
      pois.push({
        type: poiType.type,
        name: generatePOIName(poiType.type, city),
        distance: distanceInMeters,
        distanceDisplay: formatDistance(distanceInMeters),
        icon: poiType.icon
      });
    });

    return pois.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Erreur chargement POIs:', error);
    return getFallbackPOIs(city);
  }
};

const getFallbackPOIs = (city: string): PointOfInterest[] => {
  const urbanDensity = getUrbanDensity(city);
  const baseDistances = {
    supermarket: getBaseDistance('supermarket', urbanDensity),
    restaurant: getBaseDistance('restaurant', urbanDensity),
    transport: getBaseDistance('transport', urbanDensity),
    park: getBaseDistance('park', urbanDensity),
    school: getBaseDistance('school', urbanDensity),
    pharmacy: getBaseDistance('pharmacy', urbanDensity),
    church: getBaseDistance('church', urbanDensity)
  };

  return [
    { type: 'Supermarché', name: 'Carrefour Market', distance: baseDistances.supermarket, distanceDisplay: formatDistance(baseDistances.supermarket), icon: '🛒' },
    { type: 'Restaurant', name: 'Bistro du Centre', distance: baseDistances.restaurant, distanceDisplay: formatDistance(baseDistances.restaurant), icon: '🍽️' },
    { type: 'Transport', name: 'Station de Métro', distance: baseDistances.transport, distanceDisplay: formatDistance(baseDistances.transport), icon: '🚇' },
    { type: 'Parc', name: 'Parc Municipal', distance: baseDistances.park, distanceDisplay: formatDistance(baseDistances.park), icon: '🌳' },
    { type: 'École', name: 'École Primaire', distance: baseDistances.school, distanceDisplay: formatDistance(baseDistances.school), icon: '🏫' },
    { type: 'Pharmacie', name: 'Pharmacie Centrale', distance: baseDistances.pharmacy, distanceDisplay: formatDistance(baseDistances.pharmacy), icon: '💊' },
    { type: 'Lieu de culte', name: 'Église Saint-Pierre', distance: baseDistances.church, distanceDisplay: formatDistance(baseDistances.church), icon: '⛪' }
  ];
};

const generateRealisticPOIs = async (property: Property): Promise<PointOfInterest[]> => {
  if (!property.latitude || !property.longitude) {
    return getFallbackPOIs(property.city);
  }

  try {
    return await getRealPOIs(property.latitude, property.longitude, property.city);
  } catch (error) {
    console.error('Erreur génération POIs réalistes:', error);
    return getFallbackPOIs(property.city);
  }
};

const getNearbyPointsOfInterest = async (property: Property): Promise<PointOfInterest[]> => {
  return await generateRealisticPOIs(property);
};

export default function HomePage({ onNavigate, onStartReservation, currentUser }: HomePageProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'visit' | 'messages' | 'my-visits'>('details');

  useEffect(() => {
    loadProperties();
    loadCities();
    if (currentUser) {
      loadVisitRequests();
      loadMessages();
    }
  }, [currentUser]);

  useEffect(() => {
    filterProperties();
  }, [properties, filters, searchQuery]);

  const loadProperties = async () => {
    try {
      const data = await api.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      const data = await api.getCities();
      setCities(data);
    } catch (error) {
      console.error('Erreur chargement villes:', error);
      const uniqueCities = Array.from(new Set(properties.map(p => p.city))).sort();
      setCities(uniqueCities);
    }
  };

  const loadVisitRequests = async () => {
    if (!currentUser) return;
    
    try {
      let requests: VisitRequest[] = [];
      
      if (currentUser.role === 'locataire') {
        const response = await fetch(`http://localhost:5000/api/visit-requests?user_id=${currentUser.id}`);
        if (response.ok) {
          requests = await response.json();
        }
      } else if (currentUser.role === 'proprietaire') {
        const response = await fetch(`http://localhost:5000/api/visit-requests?owner_id=${currentUser.id}`);
        if (response.ok) {
          requests = await response.json();
        }
      }
      
      setVisitRequests(requests);
    } catch (error) {
      console.error('Erreur chargement demandes de visite:', error);
    }
  };

  const loadMessages = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/messages?user1_id=${currentUser.id}`);
      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(p => p.property_type === filters.type);
    }

    if (filters.min_price) {
      filtered = filtered.filter(p => p.price_per_night >= filters.min_price!);
    }

    if (filters.max_price) {
      filtered = filtered.filter(p => p.price_per_night <= filters.max_price!);
    }

    if (filters.guests) {
      filtered = filtered.filter(p => p.max_guests >= filters.guests!);
    }

    setFilteredProperties(filtered);
  };

  const handleReservation = (propertyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!currentUser) {
      alert('Veuillez vous connecter pour effectuer une réservation');
      onNavigate('login');
      return;
    }
    
    if (currentUser.role !== 'locataire' && currentUser.role !== 'admin') {
      alert('Seuls les locataires peuvent effectuer des réservations');
      return;
    }
    
    onStartReservation(propertyId);
  };

  const handleEditProperty = (propertyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onNavigate('owner');
  };

  const toggleFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  // Nouvelles fonctions pour les fonctionnalités ajoutées
  const handleVisitRequest = async (property: Property, date: string, time: string, message: string) => {
    if (!currentUser) {
      alert('Veuillez vous connecter pour demander une visite');
      onNavigate('login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/visit-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: property.id,
          user_id: currentUser.id,
          requested_date: date,
          requested_time: time,
          message: message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la demande de visite');
      }

      const newRequest = await response.json();
      
      setVisitRequests(prev => [...prev, newRequest]);
      alert('Votre demande de visite a été envoyée au propriétaire !');
      setActiveTab('details');
      
    } catch (error) {
      console.error('Erreur demande de visite:', error);
      alert('Erreur lors de l\'envoi de la demande de visite');
    }
  };

  const handleSendMessage = async (property: Property, messageText: string) => {
    if (!currentUser) {
      alert('Veuillez vous connecter pour envoyer un message');
      onNavigate('login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: property.id,
          from_user_id: currentUser.id,
          to_user_id: property.owner_id,
          message: messageText
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
      }

      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
      
    } catch (error) {
      console.error('Erreur envoi message:', error);
      alert('Erreur lors de l\'envoi du message');
    }
  };

  const handleVisitRequestStatusUpdate = async (visitId: string, newStatus: 'confirmed' | 'rejected' | 'cancelled') => {
    try {
      const response = await fetch(`http://localhost:5000/api/visit-requests/${visitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      const updatedRequest = await response.json();
      
      setVisitRequests(prev => 
        prev.map(req => req.id === visitId ? updatedRequest : req)
      );
      
      alert('Statut mis à jour avec succès !');
      
    } catch (error) {
      console.error('Erreur mise à jour demande visite:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getPropertyImage = (property: Property) => {
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      
      if (firstImage.startsWith('http')) {
        return firstImage;
      }
      
      if (firstImage.startsWith('/')) {
        return `http://localhost:5000${firstImage}`;
      }
      
      if (firstImage.includes('pexels.com') || firstImage.includes('unsplash.com')) {
        return firstImage;
      }
      
      return `http://localhost:5000${firstImage}`;
    }
    
    return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      apartment: 'Appartement',
      house: 'Maison',
      villa: 'Villa',
      studio: 'Studio',
      loft: 'Loft',
      chalet: 'Chalet'
    };
    return types[type] || type;
  };

  const getPriceDisplay = (property: Property) => {
    const price = property.price_per_night;
    const priceType = property.price_type || 'night';
    
    if (priceType === 'month') {
      return `${price}€ / mois`;
    }
    return `${price}€ / nuit`;
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return '📶';
      case 'parking': return '🅿️';
      case 'climatisation': return '❄️';
      case 'piscine': return '🏊';
      case 'jardin': return '🌳';
      case 'cheminée': return '🔥';
      case 'terrasse': return '🌞';
      case 'vue mer': return '🌊';
      case 'ascenseur': return '🛗';
      default: return '✨';
    }
  };

  const isPropertyOwner = (property: Property) => {
    return currentUser && currentUser.role === 'proprietaire' && property.owner_id === currentUser.id;
  };

  // Composants pour les nouvelles fonctionnalités
  const VisitRequestForm = ({ property, onClose }: { property: Property, onClose: () => void }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!date || !time) {
        alert('Veuillez sélectionner une date et une heure');
        return;
      }
      handleVisitRequest(property, date, time, message);
      onClose();
    };

    const getMinDate = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
      const inTwoWeeks = new Date();
      inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
      return inTwoWeeks.toISOString().split('T')[0];
    };

    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-[#ea80fc]" />
          <span>Demander une visite</span>
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Heure</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message (optionnel)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Bonjour, je souhaiterais visiter ce bien..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent resize-none"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
            >
              Envoyer la demande
            </button>
          </div>
        </form>
      </div>
    );
  };

  const MessagingInterface = ({ property }: { property: Property }) => {
    const [newMessage, setNewMessage] = useState('');
    const propertyMessages = messages.filter(msg => msg.property_id === property.id);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
      
      handleSendMessage(property, newMessage);
      setNewMessage('');
    };

    const formatTime = (timestamp: string) => {
      return new Date(timestamp).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-200 h-96 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-[#ea80fc]" />
            <span>Messagerie</span>
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {propertyMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Aucun message</p>
              <p className="text-sm">Soyez le premier à démarrer la conversation</p>
            </div>
          ) : (
            propertyMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from_user_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2 ${
                    msg.from_user_id === currentUser?.id
                      ? 'bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.from_user_id === currentUser?.id ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    );
  };

  const VisitRequestsList = ({ property, isOwner }: { property: Property, isOwner: boolean }) => {
    const propertyVisitRequests = visitRequests.filter(req => req.property_id === property.id);

    if (propertyVisitRequests.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Aucune demande de visite</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">
          {isOwner ? 'Demandes de visite reçues' : 'Mes demandes de visite'}
        </h4>
        
        {propertyVisitRequests.map((request) => (
          <div key={request.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{request.user_name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(request.requested_date).toLocaleDateString('fr-FR')} à {request.requested_time}
                </p>
                {request.message && (
                  <p className="text-sm text-gray-700 mt-1">{request.message}</p>
                )}
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status === 'pending' ? 'En attente' :
                 request.status === 'confirmed' ? 'Confirmée' : 
                 request.status === 'rejected' ? 'Rejetée' : 'Annulée'}
              </span>
            </div>
            
            {isOwner && request.status === 'pending' && (
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleVisitRequestStatusUpdate(request.id, 'confirmed')}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                >
                  Accepter
                </button>
                <button
                  onClick={() => handleVisitRequestStatusUpdate(request.id, 'rejected')}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                >
                  Refuser
                </button>
              </div>
            )}
            
            {!isOwner && (
              <div className="text-xs text-gray-500 mt-2">
                Demandé le {new Date(request.created_at).toLocaleDateString('fr-FR')}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const PropertyDetailsModal = ({ property, onClose }: { property: Property, onClose: () => void }) => {
    const [nearbyPOIs, setNearbyPOIs] = useState<PointOfInterest[]>([]);
    const [isLoadingPOIs, setIsLoadingPOIs] = useState(true);
    const [showVisitForm, setShowVisitForm] = useState(false);
    
    const hasExactLoc = hasExactLocation(property);
    const propertyIsOwner = isPropertyOwner(property);

    useEffect(() => {
      const loadPOIs = async () => {
        setIsLoadingPOIs(true);
        const pois = await getNearbyPointsOfInterest(property);
        setNearbyPOIs(pois);
        setIsLoadingPOIs(false);
      };
      
      loadPOIs();
    }, [property]);

    const canRequestVisit = currentUser && currentUser.role === 'locataire' && !propertyIsOwner;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-80">
            <img
              src={getPropertyImage(property)}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-3xl font-black mb-2">{property.title}</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{property.city}, {property.country} </span>
                </div>
                {property.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{property.rating}</span>
                  </div>
                )}
              </div>
            </div>

            {!property.is_available && (
              <div className="absolute top-6 left-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg">
                Indisponible
              </div>
            )}

            {propertyIsOwner && (
              <div className="absolute top-6 left-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg">
                Ma propriété
              </div>
            )}
          </div>

          {/* Navigation par onglets */}
          <div className="border-b border-gray-200">
            <div className="px-8 pt-6 flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-[#ea80fc] text-[#ea80fc]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Détails
              </button>
              
              {canRequestVisit && (
                <button
                  onClick={() => setActiveTab('visit')}
                  className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'visit'
                      ? 'border-[#ea80fc] text-[#ea80fc]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📅 Demander une visite
                </button>
              )}
              
              {currentUser && (propertyIsOwner || currentUser.role === 'locataire') && (
                <button
                  onClick={() => setActiveTab('my-visits')}
                  className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'my-visits'
                      ? 'border-[#ea80fc] text-[#ea80fc]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📋 Demande de visite
                </button>
              )}
              
              {/* {currentUser && !propertyIsOwner && (
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'messages'
                      ? 'border-[#ea80fc] text-[#ea80fc]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  💬 Messagerie
                </button>
              )} */}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Caractéristiques</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
                      <Users className="w-6 h-6 text-[#ea80fc] mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Voyageurs</div>
                      <div className="font-black text-gray-900">{property.max_guests}</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
                      <Bed className="w-6 h-6 text-[#ea80fc] mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Chambres</div>
                      <div className="font-black text-gray-900">{property.bedrooms}</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
                      <Bath className="w-6 h-6 text-[#ea80fc] mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Salles de bain</div>
                      <div className="font-black text-gray-900">{property.bathrooms}</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
                      <div className="w-6 h-6 text-[#ea80fc] mx-auto mb-2">🏠</div>
                      <div className="text-sm text-gray-600">Type</div>
                      <div className="font-black text-gray-900 capitalize">{getPropertyTypeLabel(property.property_type)}</div>
                    </div>
                  </div>

                  {property.amenities && property.amenities.length > 0 && (
                    <>
                      <h3 className="text-2xl font-black text-gray-900 mb-4">Équipements</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200">
                            <span className="text-lg">{getAmenityIcon(amenity)}</span>
                            <span className="text-gray-700 font-medium capitalize">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Section Localisation enrichie */}
                  <div className="mt-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Localisation & Environnement</h3>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="mb-6">
                        <div className="flex items-center space-x-2 text-gray-700 mb-3">
                          <MapPin className="w-5 h-5 text-[#ea80fc]" />
                          <span className="font-semibold text-lg">Adresse :</span>
                          <span className="text-lg">{property.address || `${property.city}, ${property.country}`}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center space-x-2 ${hasExactLoc ? 'text-green-600' : 'text-blue-600'}`}>
                            <div className={`w-3 h-3 rounded-full ${hasExactLoc ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                            <span className="font-medium">
                              {hasExactLoc ? '📍 Emplacement GPS exact' : '📍 Localisation par adresse'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Points d'intérêt à proximité */}
                      <div className="mb-6">
                        <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center space-x-2">
                          <span>🏙️</span>
                          <span>À proximité</span>
                          {isLoadingPOIs && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ea80fc]"></div>
                          )}
                        </h4>
                        {isLoadingPOIs ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[...Array(6)].map((_, index) => (
                              <div key={index} className="animate-pulse flex items-center space-x-3 bg-gray-100 rounded-xl p-3">
                                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                <div className="flex-1">
                                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {nearbyPOIs.map((poi, index) => (
                              <div key={index} className="flex items-center space-x-3 bg-white rounded-xl p-3 border border-gray-200 hover:shadow-md transition-shadow">
                                <span className="text-2xl">{poi.icon}</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 text-sm">{poi.name}</div>
                                  <div className="text-xs text-gray-500">{poi.type} • {poi.distanceDisplay}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Boutons d'action */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a 
                          href={getGoogleMapsUrl(property)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Explorer sur Google Maps</span>
                        </a>
                        <a 
                          href={getNavigationUrl(property)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Itinéraire</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 h-fit border border-gray-200 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-black text-gray-900">{getPriceDisplay(property)}</div>
                  </div>
                  
                  {property.is_available ? (
                    propertyIsOwner ? (
                      <button 
                        onClick={() => {
                          onClose();
                          handleEditProperty(property.id);
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl font-bold text-base hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          onClose();
                          handleReservation(property.id);
                        }}
                        className="w-full bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white py-3 rounded-2xl font-bold text-base hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
                      >
                        Réserver maintenant
                      </button>
                    )
                  ) : (
                    <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-2xl font-bold text-base text-center shadow-md">
                      Indisponible
                    </div>
                  )}
                  
                  <div className={`text-center py-3 rounded-xl border mt-4 ${
                    !property.is_available ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'
                  }`}>
                    <div className="font-semibold text-sm">
                      {!property.is_available ? '⏳ Indisponible pour le moment' : '✅ Disponible'}
                    </div>
                  </div>

                  {propertyIsOwner && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-blue-700 text-sm text-center">
                        <strong>Ma propriété</strong>
                        <div className="text-xs mt-1">Cliquez sur "Modifier" pour gérer</div>
                      </div>
                    </div>
                  )}

                  {/* Informations de localisation rapide */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[#ea80fc]" />
                      <span>Localisation</span>
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Ville :</span>
                        <span className="text-right">{property.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Pays :</span>
                        <span className="text-right">{property.country}</span>
                      </div>
                      {property.address && (
                        <div className="flex justify-between">
                          <span className="font-medium">Adresse :</span>
                          <span className="text-right max-w-[150px] truncate" title={property.address}>
                            {property.address}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-medium">Précision :</span>
                        <span className={`font-semibold ${hasExactLoc ? 'text-green-600' : 'text-blue-600'}`}>
                          {hasExactLoc ? 'Exacte (GPS)' : 'Par adresse'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Points d'intérêt principaux */}
                  <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <span>🏪</span>
                      <span>Commerces à proximité</span>
                    </h4>
                    <div className="space-y-2">
                      {nearbyPOIs.slice(0, 3).map((poi, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span>{poi.icon}</span>
                          <span className="font-medium text-gray-700">{poi.name}</span>
                          <span className="text-gray-500 text-xs ml-auto">{poi.distanceDisplay}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visit' && (
              <div className="max-w-2xl mx-auto">
                {showVisitForm ? (
                  <VisitRequestForm 
                    property={property} 
                    onClose={() => setShowVisitForm(false)} 
                  />
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-[#ea80fc] mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Demander une visite</h3>
                    <p className="text-gray-600 mb-6">
                      Planifiez une visite de ce bien avec le propriétaire. Choisissez une date et une heure qui vous conviennent.
                    </p>
                    <button
                      onClick={() => setShowVisitForm(true)}
                      className="bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
                    >
                      Planifier une visite
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'my-visits' && (
              <div className="max-w-4xl mx-auto">
                <VisitRequestsList property={property} isOwner={propertyIsOwner} />
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="max-w-4xl mx-auto">
                <MessagingInterface property={property} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea80fc] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des propriétés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header et recherche */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tighter">
            L'Art de
            <span className="block bg-gradient-to-r from-[#ea80fc] to-purple-400 bg-clip-text text-transparent">
              l'Habitat
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed tracking-wide">
            Découvrez des propriétés d'exception où chaque détail raconte une histoire d'élégance
          </p>
          
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl rounded-2xl p-3 border border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher une destination, un bien..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gradient-to-r from-[#ea80fc] to-purple-500 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center space-x-2 shadow-md"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-10">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-current text-white"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-current text-white"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-current text-white"></path>
          </svg>
        </div>
      </div>

      {showFilters && (
        <div className="max-w-7xl mx-auto px-6 py-6 -mt-6 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-gray-900">Filtres Avancés</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">Type de bien</label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                >
                  <option value="all">Tous les types</option>
                  <option value="apartment">Appartement</option>
                  <option value="house">Maison</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="loft">Loft</option>
                  <option value="chalet">Chalet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                  Prix minimum
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="number"
                    value={filters.min_price || ''}
                    onChange={(e) => setFilters({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                  Prix maximum
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="number"
                    value={filters.max_price || ''}
                    onChange={(e) => setFilters({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                    placeholder="1000"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                  Voyageurs
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="number"
                    value={filters.guests || ''}
                    onChange={(e) => setFilters({ ...filters, guests: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                    placeholder="2"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setFilters({});
                  setSearchQuery('');
                }}
                className="text-gray-600 hover:text-[#ea80fc] font-semibold text-sm transition-colors duration-300 flex items-center space-x-2"
              >
                <span>Réinitialiser tout</span>
              </button>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold tracking-wide hover:bg-gray-200 transition-all duration-300"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-xl font-semibold tracking-wide hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
              {filteredProperties.length} Œuvres Immobilières
            </h2>
            <p className="text-gray-600 text-base tracking-wide">Des propriétés qui redéfinissent l'excellence</p>
          </div>
          
          {currentUser && (
            <div className="bg-gradient-to-r from-[#ea80fc]/10 to-purple-500/10 px-3 py-1 rounded-xl border border-[#ea80fc]/20 mt-4 md:mt-0">
              <span className="text-gray-600 text-xs">
                Connecté en tant que <span className="font-semibold text-gray-900 capitalize">{currentUser.role}</span>
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredProperties.map(property => (
            <div 
              key={property.id} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer flex flex-col"
              onClick={() => setSelectedProperty(property)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getPropertyImage(property)}
                  alt={property.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-xs font-semibold capitalize tracking-wide border border-gray-200">
                    {getPropertyTypeLabel(property.property_type)}
                  </span>
                  {property.rating && (
                    <span className="bg-black/80 text-white px-1.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm flex items-center space-x-1">
                      <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                      <span>{property.rating}</span>
                    </span>
                  )}
                  {isPropertyOwner(property) && (
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-1.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm">
                      Votre bien
                    </span>
                  )}
                </div>
                
                <button
                  onClick={(e) => toggleFavorite(property.id, e)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-gray-300 shadow-sm"
                >
                  <Heart 
                    className={`w-4 h-4 transition-all duration-300 ${
                      favorites.has(property.id) 
                        ? 'fill-[#ea80fc] text-[#ea80fc]' 
                        : 'text-gray-600'
                    }`} 
                  />
                </button>

                <div className="absolute bottom-3 left-3">
                  <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-3 py-1.5 rounded-xl shadow-lg">
                    <span className="text-lg font-black">{getPriceDisplay(property)}</span>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-xl border border-gray-200 flex items-center space-x-1 group-hover:bg-[#ea80fc] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs font-medium">Détails</span>
                    <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {!property.is_available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl border border-gray-200">
                      <span className="font-semibold text-sm">Indisponible</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-3 flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-700 transition-colors tracking-tight">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs font-medium tracking-wide">{property.city}, {property.country}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed flex-1">
                  {property.description}
                </p>

                <div className="flex items-center justify-between text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs font-medium tracking-wide">{property.max_guests}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bed className="w-3 h-3" />
                    <span className="text-xs font-medium tracking-wide">{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="w-3 h-3" />
                    <span className="text-xs font-medium tracking-wide">{property.bathrooms}</span>
                  </div>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div className="flex items-center space-x-2 mb-3">
                    {property.amenities.slice(0, 2).map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-1 text-gray-500">
                        <span className="text-xs">{getAmenityIcon(amenity)}</span>
                        <span className="text-xs font-medium tracking-wide capitalize">{amenity}</span>
                      </div>
                    ))}
                    {property.amenities.length > 2 && (
                      <span className="text-xs text-gray-400 font-medium">
                        +{property.amenities.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <div className={`flex items-center space-x-1 ${
                    !property.is_available ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      !property.is_available ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-xs font-medium">
                      {!property.is_available ? 'Indisponible' : 'Disponible'}
                    </span>
                  </div>
                  
                  {property.is_available && (
                    isPropertyOwner(property) ? (
                      <button 
                        onClick={(e) => handleEditProperty(property.id, e)}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transform hover:scale-[1.05] transition-all duration-300 flex items-center space-x-1 shadow-md"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Modifier</span>
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => handleReservation(property.id, e)}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transform hover:scale-[1.05] transition-all duration-300 flex items-center space-x-1 shadow-md"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Réserver</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && properties.length > 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Aucune propriété trouvée</h3>
            <p className="text-gray-600 text-base max-w-md mx-auto tracking-wide">
              Ajustez vos critères de recherche pour découvrir nos propriétés
            </p>
            <button
              onClick={() => {
                setFilters({});
                setSearchQuery('');
              }}
              className="mt-4 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {properties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Aucune propriété disponible</h3>
            <p className="text-gray-600 text-base max-w-md mx-auto tracking-wide">
              Aucune propriété n'est actuellement disponible à la location
            </p>
          </div>
        )}
      </div>

      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </div>
  );
}