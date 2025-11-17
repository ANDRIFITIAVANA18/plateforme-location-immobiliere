

// src/pages/OwnerProperties.tsx
import { Plus, Edit, Trash2, Eye, Calendar, Users, DollarSign, MapPin, Bed, Bath, Home, BookOpen, Filter, ChevronDown, Mail, Check, X, Clock, Ban, Star, TrendingUp, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Property, Booking, User as UserType } from '../types';
import { api } from '../services/api';
import AddPropertyForm from '../components/AddPropertyForm';
import EditPropertyForm from '../components/EditPropertyForm';

interface OwnerPropertiesProps {
  ownerId: string;
  currentUser: UserType | null;
}

export default function OwnerProperties({ ownerId, currentUser }: OwnerPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'properties' | 'bookings'>('properties');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied'>('all');
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    if (ownerId) {
      fetchOwnerProperties();
      fetchAllBookings();
    }
  }, [ownerId]);

  const fetchOwnerProperties = async () => {
    try {
      const data = await api.getOwnerProperties(ownerId);
      setProperties(data);
    } catch (error) {
      console.error('Error fetching owner properties:', error);
      try {
        const allProperties = await api.getProperties();
        const ownerProperties = allProperties.filter(prop => prop.owner_id === ownerId);
        setProperties(ownerProperties);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      setBookingsLoading(true);
      const bookings = await api.getBookings();
      const ownerPropertiesIds = properties.map(p => p.id);
      const relevantBookings = bookings.filter(booking => 
        ownerPropertiesIds.includes(booking.property_id)
      );
      setAllBookings(relevantBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (properties.length > 0) {
      fetchAllBookings();
    }
  }, [properties]);

  // Fonction pour supprimer les images de IMGbb
  const deleteImagesFromImgBB = async (imageUrls: string[]) => {
    const deletePromises = imageUrls.map(async (imageUrl) => {
      try {
        // Extraire l'ID de l'image de l'URL IMGbb
        // Les URLs IMGbb sont de la forme: https://i.ibb.co/xxxxx/image.jpg
        // On ne peut pas supprimer via l'API publique, donc on ignore pour l'instant
        // Dans une vraie application, vous devriez stocker les deleteHash retournés par IMGbb
        console.log('Image à supprimer (non implémenté):', imageUrl);
        return true;
      } catch (error) {
        console.error('Erreur suppression image:', error);
        return false;
      }
    });

    await Promise.all(deletePromises);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible.')) {
      try {
        // Récupérer la propriété pour avoir les URLs des images
        const propertyToDelete = properties.find(p => p.id === propertyId);
        
        if (propertyToDelete?.images && propertyToDelete.images.length > 0) {
          // Filtrer seulement les URLs IMGbb (celles qui contiennent 'i.ibb.co')
          const imgbbUrls = propertyToDelete.images.filter(url => 
            url.includes('i.ibb.co') || url.includes('imgbb.com')
          );
          
          if (imgbbUrls.length > 0) {
            // Supprimer les images de IMGbb
            await deleteImagesFromImgBB(imgbbUrls);
          }
        }

        // Supprimer la propriété de la base de données
        const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression');

        // Mettre à jour l'état local
        setProperties(prev => prev.filter(property => property.id !== propertyId));
        
        alert('✅ Bien supprimé avec succès');
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('❌ Erreur lors de la suppression du bien');
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'pending') => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      const updatedBooking = await response.json();
      
      setAllBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        )
      );

      alert(`✅ Réservation ${getStatusText(status)} avec succès`);
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      alert(`❌ Erreur lors de la mise à jour de la réservation: ${error.message}`);
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
  };

  const handlePropertyUpdated = () => {
    setEditingProperty(null);
    fetchOwnerProperties();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Check className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <Ban className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  const getPriceDisplay = (property: Property) => {
    const price = property.price_per_night;
    const priceType = property.price_type || 'night';
    
    if (priceType === 'month') {
      return `${price}€ / mois`;
    }
    return `${price}€ / nuit`;
  };

  const getBookingsForProperty = (propertyId: string) => {
    return allBookings.filter(booking => booking.property_id === propertyId);
  };

  const getPendingBookings = () => {
    return allBookings.filter(booking => booking.status === 'pending');
  };

  const getConfirmedBookings = () => {
    return allBookings.filter(booking => booking.status === 'confirmed');
  };

  const getCompletedBookings = () => {
    return allBookings.filter(booking => booking.status === 'completed');
  };

  const filteredProperties = properties.filter(property => {
    if (filterStatus === 'available') return property.is_available;
    if (filterStatus === 'occupied') return !property.is_available;
    return true;
  });

  const totalRevenue = allBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, booking) => sum + booking.total_price, 0);

  const availableProperties = properties.filter(p => p.is_available).length;
  const occupiedProperties = properties.filter(p => !p.is_available).length;
  const pendingBookingsCount = getPendingBookings().length;
  const confirmedBookingsCount = getConfirmedBookings().length;
  const completedBookingsCount = getCompletedBookings().length;

  const PropertyCard = ({ property }: { property: Property }) => {
    const propertyBookings = getBookingsForProperty(property.id);
    const pendingBookings = propertyBookings.filter(b => b.status === 'pending');
    const isHovered = hoveredCard === property.id;
    
    return (
      <div 
        className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer"
        onMouseEnter={() => setHoveredCard(property.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={getPropertyImage(property)}
            alt={property.title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border border-gray-300 shadow-sm">
              {property.property_type}
            </span>
          </div>
          
          <div className="absolute top-4 right-4 flex space-x-2">
            {[
              { icon: Eye, action: () => setSelectedProperty(property), label: 'Voir' },
              { icon: Edit, action: () => handleEditProperty(property), label: 'Modifier' },
              { icon: Trash2, action: () => handleDeleteProperty(property.id), label: 'Supprimer', color: 'text-red-500' }
            ].map(({ icon: Icon, action, label, color = 'text-gray-600' }, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); action(); }}
                className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-[#ea80fc] hover:to-purple-500 hover:border-[#ea80fc] border border-gray-300 shadow-sm"
              >
                <Icon className={`w-4 h-4 ${color} group-hover:text-white transition-colors`} />
              </button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4">
            <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-4 py-2.5 rounded-2xl shadow-lg">
              <span className="text-lg font-bold">{getPriceDisplay(property)}</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm border transition-all duration-300 ${
              property.is_available 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-orange-100 text-orange-800 border-orange-200'
            }`}>
              {property.is_available ? '🟢 Disponible' : '🟠 Occupé'}
            </div>
            {pendingBookings.length > 0 && (
              <div className="bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#ea80fc] backdrop-blur-sm shadow-sm">
                📩 {pendingBookings.length} demande{pendingBookings.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#ea80fc] transition-colors duration-300 leading-tight">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 space-x-2 mb-4">
            <MapPin className="w-4 h-4 text-[#ea80fc]" />
            <span className="text-sm font-medium">{property.city}, {property.country}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600 mb-4 text-sm">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-2">
              <Users className="w-4 h-4 text-[#ea80fc]" />
              <span className="font-semibold">{property.max_guests}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-2">
              <Bed className="w-4 h-4 text-[#ea80fc]" />
              <span className="font-semibold">{property.bedrooms}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-2">
              <Bath className="w-4 h-4 text-[#ea80fc]" />
              <span className="font-semibold">{property.bathrooms}</span>
            </div>
          </div>

          {propertyBookings.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#ea80fc]" />
                <span>Réservations ({propertyBookings.length})</span>
              </div>
              {propertyBookings.slice(0, 2).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between text-sm mb-3 last:mb-0 bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{booking.guest_name}</div>
                    <div className="text-gray-500 text-xs flex items-center space-x-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(booking.check_in).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">{booking.total_price}€</span>
                    <span className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(booking.status)} font-medium`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const property = properties.find(p => p.id === booking.property_id);
    if (!property) return null;

    return (
      <div className="group bg-white rounded-3xl border border-gray-100 p-6 mb-4 transition-all duration-300 hover:shadow-lg hover:border-[#ea80fc]">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#ea80fc] transition-colors duration-300">
              {property.title}
            </h4>
            <p className="text-gray-600 text-sm flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#ea80fc]" />
              <span>{property.city}, {property.country}</span>
            </p>
          </div>
          <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 ${getStatusColor(booking.status)}`}>
            {getStatusIcon(booking.status)}
            <span>{getStatusText(booking.status)}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: 'Voyageur', value: booking.guest_name, subvalue: booking.guest_email },
            { icon: Calendar, label: 'Arrivée', value: new Date(booking.check_in).toLocaleDateString() },
            { icon: Calendar, label: 'Départ', value: new Date(booking.check_out).toLocaleDateString() },
            { icon: DollarSign, label: 'Total', value: `${booking.total_price}€` }
          ].map(({ icon: Icon, label, value, subvalue }, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-[#ea80fc] transition-colors duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#ea80fc] to-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-bold text-sm">{value}</div>
                  <div className="text-gray-600 text-xs">{label}</div>
                  {subvalue && <div className="text-gray-500 text-xs mt-1">{subvalue}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="font-medium flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#ea80fc]" />
            <span>Voyageurs: <span className="text-gray-900 font-bold">{booking.guests_count}</span></span>
          </div>
          <div className="font-medium flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#ea80fc]" />
            <span>Réservé le: <span className="text-gray-900 font-bold">{new Date(booking.created_at).toLocaleDateString()}</span></span>
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          {booking.status === 'pending' && (
            <>
              <button
                onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Accepter</span>
              </button>
              <button
                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
              >
                <X className="w-4 h-4" />
                <span>Refuser</span>
              </button>
            </>
          )}
          
          {booking.status === 'confirmed' && (
            <button
              onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
            >
              <X className="w-4 h-4" />
              <span>Annuler</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea80fc] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Chargement de vos propriétés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-[#ea80fc] via-purple-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-3 tracking-tight">
                  Mes Propriétés
                </h1>
                <p className="text-white/90 text-base">Gérez votre patrimoine immobilier avec élégance</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-white text-[#ea80fc] px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau bien</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Biens Disponibles', 
              value: availableProperties, 
              icon: Building2,
              gradient: 'from-[#ea80fc] to-purple-500',
              description: 'Prêts à être loués'
            },
            { 
              label: 'Biens Occupés', 
              value: occupiedProperties, 
              icon: Home,
              gradient: 'from-orange-500 to-amber-500',
              description: 'Actuellement loués'
            },
            { 
              label: 'Réservations', 
              value: allBookings.length, 
              icon: BookOpen,
              gradient: 'from-blue-500 to-cyan-500',
              description: 'Total des réservations'
            },
            { 
              label: 'Revenus Totaux', 
              value: `${totalRevenue}€`, 
              icon: TrendingUp,
              gradient: 'from-green-500 to-emerald-500',
              description: 'Revenus générés'
            }
          ].map(({ label, value, icon: Icon, gradient, description }, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
                  <p className="text-gray-500 text-xs">{description}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex space-x-1 bg-white rounded-2xl p-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'properties'
                  ? 'bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#ea80fc]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Mes Propriétés</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#ea80fc]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Réservations ({allBookings.length})</span>
            </button>
          </div>

          {activeTab === 'properties' && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white rounded-2xl px-4 py-2.5 border border-gray-200 shadow-sm">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-transparent border-none text-gray-900 text-sm font-semibold focus:outline-none focus:ring-0"
                >
                  <option value="all">Tous les biens</option>
                  <option value="available">Disponibles</option>
                  <option value="occupied">Occupés</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          )}
        </div>

        {activeTab === 'properties' && (
          <div>
            {showAddForm ? (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <AddPropertyForm 
                  ownerId={ownerId} 
                  onPropertyAdded={() => {
                    setShowAddForm(false);
                    fetchOwnerProperties();
                  }} 
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            ) : (
              <div>
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm">
                    <div className="text-8xl mb-6">🏠</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucun bien immobilier</h3>
                    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                      Commencez par ajouter votre première propriété 
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-base hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                    >
                      <Plus className="w-5 h-5 mr-2 inline" />
                      Ajouter mon premier bien
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            {bookingsLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 animate-pulse border border-gray-200">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : allBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <div className="text-8xl mb-6">📅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune réservation</h3>
                <p className="text-gray-600 text-lg">Les réservations de vos propriétés apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-6">
                {allBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {editingProperty && (
        <EditPropertyForm
          property={editingProperty}
          onPropertyUpdated={handlePropertyUpdated}
          onCancel={() => setEditingProperty(null)}
        />
      )}
    </div>
  );
}