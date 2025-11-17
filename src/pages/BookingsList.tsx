
// src/pages/BookingsList.tsx
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Euro, User, Edit, Trash2, Home, Save, X, Ban } from 'lucide-react';
import { Booking, User as UserType, Property } from '../types';
import { api } from '../services/api';

interface BookingsListProps {
  currentUser: UserType | null;
}

export default function BookingsList({ currentUser }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editFormData, setEditFormData] = useState({
    check_in: '',
    check_out: '',
    guests_count: 1,
    months_count: 1
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
    loadProperties();
  }, [currentUser]);

  const loadBookings = async () => {
    if (!currentUser) return;
    
    try {
      const data = await api.getBookings(currentUser.email);
      setBookings(data);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const data = await api.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
    }
  };

  const getPropertyById = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  const handleEdit = (booking: Booking) => {
    const property = getPropertyById(booking.property_id);
    setEditingBooking(booking);
    
    // Formater les dates pour l'input date (YYYY-MM-DD)
    const checkInDate = new Date(booking.check_in);
    const checkOutDate = new Date(booking.check_out);
    
    const monthsCount = property?.price_type === 'month' 
      ? calculateMonthsCount(booking.check_in, booking.check_out)
      : 1;

    setEditFormData({
      check_in: checkInDate.toISOString().split('T')[0],
      check_out: checkOutDate.toISOString().split('T')[0],
      guests_count: booking.guests_count,
      months_count: monthsCount
    });
  };

  const calculateMonthsCount = (check_in: string, check_out: string): number => {
    const start = new Date(check_in);
    const end = new Date(check_out);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(1, months);
  };

  const calculateNightsCount = (check_in: string, check_out: string): number => {
    const start = new Date(check_in);
    const end = new Date(check_out);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, nights);
  };

  const calculateTotalPrice = (booking: Booking, newCheckIn?: string, newCheckOut?: string, newGuestsCount?: number) => {
    const property = getPropertyById(booking.property_id);
    if (!property) return booking.total_price;

    const checkIn = newCheckIn ? new Date(newCheckIn) : new Date(booking.check_in);
    const checkOut = newCheckOut ? new Date(newCheckOut) : new Date(booking.check_out);

    if (property.price_type === 'month') {
      const months = (checkOut.getFullYear() - checkIn.getFullYear()) * 12 + (checkOut.getMonth() - checkIn.getMonth());
      return months * property.price_per_night;
    } else {
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return nights * property.price_per_night;
    }
  };

  const handleUpdate = async () => {
    if (!editingBooking) return;

    setIsUpdating(true);
    try {
      const property = getPropertyById(editingBooking.property_id);
      
      // Formater les dates pour l'API
      const formattedData = {
        check_in: `${editFormData.check_in}T00:00:00.000Z`,
        check_out: `${editFormData.check_out}T00:00:00.000Z`,
        guests_count: editFormData.guests_count,
        total_price: calculateTotalPrice(
          editingBooking, 
          editFormData.check_in, 
          editFormData.check_out, 
          editFormData.guests_count
        ),
        // Inclure months_count si c'est une location mensuelle
        ...(property?.price_type === 'month' && { months_count: editFormData.months_count })
      };

      console.log('Données envoyées à l\'API:', formattedData);

      await api.updateBooking(editingBooking.id, formattedData);
      await loadBookings();
      setEditingBooking(null);
      alert('Réservation modifiée avec succès !');
    } catch (error: any) {
      console.error('Erreur modification:', error);
      alert(error.message || 'Erreur lors de la modification de la réservation');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    setIsCancelling(bookingId);
    try {
      // Utiliser l'API pour changer le statut en "cancelled"
      await api.updateBookingStatus(bookingId, 'cancelled');
      await loadBookings();
      alert('Réservation annulée avec succès !');
    } catch (error: any) {
      console.error('Erreur annulation:', error);
      alert(error.message || 'Erreur lors de l\'annulation de la réservation');
    } finally {
      setIsCancelling(null);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette réservation de votre historique ?')) {
      return;
    }

    setIsDeleting(bookingId);
    try {
      await api.deleteBooking(bookingId);
      await loadBookings();
      alert('Réservation supprimée de votre historique !');
    } catch (error: any) {
      console.error('Erreur suppression:', error);
      alert(error.message || 'Erreur lors de la suppression de la réservation');
    } finally {
      setIsDeleting(null);
    }
  };

  // CORRIGÉ : Permettre modification pour les réservations en attente ET confirmées
  const canEditBooking = (booking: Booking) => {
    const checkInDate = new Date(booking.check_in);
    const today = new Date();
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    
    // Autoriser modification pour les réservations pending ET confirmed
    return diffDays >= 2 && (booking.status === 'pending' || booking.status === 'confirmed');
  };

  // CORRIGÉ : Permettre annulation pour les réservations en attente ET confirmées
  const canCancelBooking = (booking: Booking) => {
    const checkInDate = new Date(booking.check_in);
    const today = new Date();
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    
    // Autoriser annulation pour les réservations pending ET confirmed
    return diffDays >= 1 && (booking.status === 'pending' || booking.status === 'confirmed');
  };

  // CORRIGÉ : Permettre suppression uniquement pour les réservations annulées ou terminées
  const canDeleteBooking = (booking: Booking) => {
    return booking.status === 'cancelled' || booking.status === 'completed';
  };

  const getMinCheckOutDate = () => {
    return editFormData.check_in || new Date().toISOString().split('T')[0];
  };

  // Fonction pour gérer le changement de date de début pour les locations mensuelles
  const handleMonthDateChange = (startDate: string) => {
    if (!startDate) {
      setEditFormData(prevFormData => ({ ...prevFormData, check_in: '', check_out: '' }));
      return;
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + editFormData.months_count);

    setEditFormData(prevFormData => ({
      ...prevFormData,
      check_in: startDate,
      check_out: end.toISOString().split('T')[0]
    }));
  };

  // Fonction pour gérer le changement de nombre de mois
  const handleMonthsCountChange = (months: number) => {
    setEditFormData(prevFormData => ({
      ...prevFormData,
      months_count: months
    }));

    // Recalculer la date de fin si une date de début est déjà sélectionnée
    if (editFormData.check_in) {
      const start = new Date(editFormData.check_in);
      const end = new Date(start);
      end.setMonth(end.getMonth() + months);

      setEditFormData(prevFormData => ({
        ...prevFormData,
        check_out: end.toISOString().split('T')[0]
      }));
    }
  };

  // Fonction pour obtenir l'URL correcte de l'image
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    return `http://localhost:5000/${imagePath}`;
  };

  const getPropertyTypeText = (propertyType: string) => {
    const types: { [key: string]: string } = {
      apartment: 'Appartement',
      house: 'Maison',
      villa: 'Villa',
      studio: 'Studio',
      loft: 'Loft',
      chalet: 'Chalet'
    };
    return types[propertyType] || propertyType;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: 'Confirmée', class: 'bg-green-100 text-green-800' },
      pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'Annulée', class: 'bg-red-100 text-red-800' },
      completed: { label: 'Terminée', class: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, class: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.class}`}>
        {config.label}
      </span>
    );
  };

  // NOUVELLE FONCTION : Savoir qui a annulé la réservation
  const getCancellationInfo = (booking: Booking) => {
    if (booking.status !== 'cancelled') return null;
    
    const checkInDate = new Date(booking.check_in);
    const today = new Date();
    const diffDays = (checkInDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    
    // Si annulé plus de 2 jours avant le check-in, probablement par le locataire
    // Sinon, probablement par le propriétaire
    return diffDays >= 2 ? 'annulée-par-vous' : 'annulée-par-proprietaire';
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Non connecté</h2>
          <p className="text-gray-600">Veuillez vous connecter pour voir vos réservations</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea80fc]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Réservations</h1>
          <p className="text-gray-600">
            Retrouvez toutes vos réservations passées et à venir
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune réservation
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore effectué de réservation.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map(booking => {
              const property = getPropertyById(booking.property_id);
              const isEditing = editingBooking?.id === booking.id;
              const newTotalPrice = isEditing ? calculateTotalPrice(
                booking, 
                editFormData.check_in, 
                editFormData.check_out, 
                editFormData.guests_count
              ) : booking.total_price;

              const showEditButton = canEditBooking(booking);
              const showCancelButton = canCancelBooking(booking);
              const showDeleteButton = canDeleteBooking(booking);
              const showActions = showEditButton || showCancelButton || showDeleteButton;

              return (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {property?.title || booking.title || 'Propriété'}
                          </h3>
                          {property && (
                            <p className="text-sm text-gray-600 mt-1">
                              {getPropertyTypeText(property.property_type)} • {property.city}, {property.country}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{property?.city || booking.city || 'Ville non spécifiée'}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {new Date(booking.check_in).toLocaleDateString('fr-FR')} - {new Date(booking.check_out).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span>{booking.guests_count} voyageur(s)</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Euro className="w-4 h-4 mr-2" />
                          <span className="font-semibold">
                            {isEditing ? newTotalPrice : booking.total_price}€
                            {isEditing && newTotalPrice !== booking.total_price && (
                              <span className={`ml-2 text-sm ${newTotalPrice > booking.total_price ? 'text-red-600' : 'text-green-600'}`}>
                                ({newTotalPrice > booking.total_price ? '+' : ''}{newTotalPrice - booking.total_price}€)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Réservé le {new Date(booking.created_at).toLocaleDateString('fr-FR')}
                          {/* Afficher qui a annulé si applicable */}
                          {booking.status === 'cancelled' && (
                            <span className="ml-2 text-orange-600">
                              • {getCancellationInfo(booking) === 'annulée-par-vous' 
                                  ? 'Annulée par vous' 
                                  : 'Annulée par le propriétaire'}
                            </span>
                          )}
                        </span>
                        
                        {showActions && (
                          <div className="flex space-x-2">
                            {showEditButton && (
                              <button
                                onClick={() => isEditing ? setEditingBooking(null) : handleEdit(booking)}
                                disabled={isUpdating}
                                className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                                  isEditing 
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                <Edit className="w-4 h-4" />
                                <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
                              </button>
                            )}
                            
                            {showCancelButton && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={isCancelling === booking.id}
                                className="flex items-center space-x-1 px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50"
                              >
                                <Ban className="w-4 h-4" />
                                <span>
                                  {isCancelling === booking.id ? 'Annulation...' : 'Annuler'}
                                </span>
                              </button>
                            )}
                            
                            {showDeleteButton && (
                              <button
                                onClick={() => handleDelete(booking.id)}
                                disabled={isDeleting === booking.id}
                                className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>
                                  {isDeleting === booking.id ? 'Suppression...' : 'Supprimer'}
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {property?.images && property.images.length > 0 && (
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <img
                          src={getImageUrl(property.images[0])}
                          alt={property.title}
                          className="w-32 h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Formulaire d'édition */}
                  {isEditing && property && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier la réservation - {property.price_type === 'month' ? 'Location mensuelle' : 'Location à la nuit'}
                      </h4>
                      
                      {property.price_type === 'month' ? (
                        // Formulaire pour location mensuelle
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date de début
                            </label>
                            <input
                              type="date"
                              value={editFormData.check_in}
                              onChange={(e) => handleMonthDateChange(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Durée (mois)
                            </label>
                            <select
                              value={editFormData.months_count}
                              onChange={(e) => handleMonthsCountChange(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
                            >
                              <option value={1}>1 mois</option>
                              <option value={2}>2 mois</option>
                              <option value={3}>3 mois</option>
                              <option value={6}>6 mois</option>
                              <option value={12}>12 mois</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date de fin (calculée automatiquement)
                            </label>
                            <input
                              type="date"
                              value={editFormData.check_out}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-600"
                            />
                          </div>
                        </div>
                      ) : (
                        // Formulaire pour location à la nuit
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date d'arrivée
                            </label>
                            <input
                              type="date"
                              value={editFormData.check_in}
                              onChange={(e) => setEditFormData(prev => ({...prev, check_in: e.target.value}))}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date de départ
                            </label>
                            <input
                              type="date"
                              value={editFormData.check_out}
                              onChange={(e) => setEditFormData(prev => ({...prev, check_out: e.target.value}))}
                              min={getMinCheckOutDate()}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de voyageurs
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={property?.max_guests || 10}
                            value={editFormData.guests_count}
                            onChange={(e) => setEditFormData(prev => ({...prev, guests_count: parseInt(e.target.value)}))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Max: {property?.max_guests || 10} voyageurs
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                            <p className="text-sm font-semibold text-gray-900">Nouveau total</p>
                            <p className="text-lg font-bold text-[#ea80fc]">{newTotalPrice}€</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {property.price_type === 'month' 
                                ? `${editFormData.months_count} mois × ${property.price_per_night}€/mois`
                                : `${calculateNightsCount(editFormData.check_in, editFormData.check_out)} nuits × ${property.price_per_night}€/nuit`
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#ea80fc] text-white rounded-lg text-sm font-semibold hover:bg-purple-500 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isUpdating ? 'Enregistrement...' : 'Enregistrer'}</span>
                        </button>
                        <button
                          onClick={() => setEditingBooking(null)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Annuler</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}