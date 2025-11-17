

// src/components/BookingForm.tsx
import { useState, useEffect } from 'react';
import { X, Calendar, Users, Star, MapPin, Home, Sparkles, CheckCircle2, Bed, Bath } from 'lucide-react';
import { Property, BookingFormData, User as UserType } from '../types';
import { api } from '../services/api';

interface BookingFormProps {
  propertyId: string;
  onNavigate: (view: 'home' | 'bookings' | 'owner' | 'booking-form') => void;
  currentUser: UserType | null;
}

export default function BookingForm({ propertyId, onNavigate, currentUser }: BookingFormProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    check_in: '',
    check_out: '',
    guests_count: 1,
    months_count: 1 // NOUVEAU: nombre de mois pour location mensuelle
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const properties = await api.getProperties();
        const foundProperty = properties.find(p => p.id === propertyId);
        setProperty(foundProperty || null);
        
        if (currentUser) {
          setFormData(prev => ({
            ...prev,
            guest_name: currentUser.nom,
            guest_email: currentUser.email,
            guest_phone: currentUser.telephone
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la propriété:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, currentUser]);

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
    
    if (imagePath.includes('pexels.com') || imagePath.includes('unsplash.com')) {
      return imagePath;
    }
    
    return `http://localhost:5000/${imagePath}`;
  };

  const calculateNights = () => {
    if (!formData.check_in || !formData.check_out) return 0;
    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateMonths = () => {
    if (!formData.check_in) return 0;
    return formData.months_count;
  };

  const getDurationText = () => {
    if (!property) return '';
    
    if (property.price_type === 'month') {
      const months = calculateMonths();
      return `${months} mois`;
    } else {
      const nights = calculateNights();
      return `${nights} nuit${nights > 1 ? 's' : ''}`;
    }
  };

  const getTotalPrice = () => {
    if (!property) return 0;
    
    if (property.price_type === 'month') {
      const months = calculateMonths();
      return months * property.price_per_night;
    } else {
      const nights = calculateNights();
      return nights * property.price_per_night;
    }
  };

  const nights = calculateNights();
  const months = calculateMonths();
  const totalPrice = getTotalPrice();
  const durationText = getDurationText();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !currentUser) return;

    setIsSubmitting(true);

    try {
      const bookingData: BookingFormData = {
        property_id: property.id,
        ...formData,
        total_price: totalPrice
      };

      await api.createBooking(bookingData);
      setShowConfirmation(true);
    } catch (error) {
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onNavigate('home');
  };

  const handleMonthDateChange = (startDate: string) => {
    if (!startDate) {
      setFormData(prev => ({ ...prev, check_in: '', check_out: '' }));
      return;
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + formData.months_count);

    setFormData(prev => ({
      ...prev,
      check_in: startDate,
      check_out: end.toISOString().split('T')[0]
    }));
    setCurrentStep(2);
  };

  // const handleMonthsCountChange = (months: number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     months_count: months
  //   }));

  //   // Recalculer la date de fin si une date de début est déjà sélectionnée
  //   if (prev.check_in) {
  //     const start = new Date(prev.check_in);
  //     const end = new Date(start);
  //     end.setMonth(end.getMonth() + months);

  //     setFormData(prevForm => ({
  //       ...prevForm,
  //       check_out: end.toISOString().split('T')[0]
  //     }));
  //   }
  //   setCurrentStep(2);
  // };

  const handleMonthsCountChange = (months: number) => {
  // Mettre à jour d'abord le nombre de mois
  setFormData(prev => ({
    ...prev,
    months_count: months
  }));

 if (formData.check_in) {
    const start = new Date(formData.check_in);
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);

    setFormData(prevForm => ({
      ...prevForm,
      check_out: end.toISOString().split('T')[0]
    }));
  }
  setCurrentStep(2);
};

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea80fc] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border border-gray-200 max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-r from-[#ea80fc] to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Propriété non trouvée</h2>
          <p className="text-gray-600 mb-6">La propriété que vous essayez de réserver n'existe pas ou a été supprimée.</p>
          <button 
            onClick={handleClose}
            className="bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-gray-200">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-all duration-300"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Réservation Confirmée !</h2>
          <p className="text-gray-600 mb-2 text-lg">
            Votre séjour chez <span className="font-semibold text-gray-900">{property.title}</span>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Vous recevrez un email de confirmation dans quelques instants.
          </p>
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md"
          >
            Super, merci !
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 relative shadow-2xl border border-gray-200">
        {/* Header avec image réduite */}
        <div className="relative h-40 rounded-t-3xl overflow-hidden">
          <img
            src={getImageUrl(property.images?.[0] || '')}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-xl font-bold mb-1">{property.title}</h2>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span className="text-white/90">{property.city}, {property.country}</span>
              </div>
              {property.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-white/90">{property.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900">Étape {currentStep}/2</span>
            <span className="text-sm text-gray-500">Réservation</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#ea80fc] to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulaire - 2 colonnes */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#ea80fc] to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Détails de réservation</h3>
                  <p className="text-gray-600 text-xs">Remplissez vos informations pour finaliser la réservation</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations personnelles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.guest_name}
                        onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                        placeholder="Jean Dupont"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.guest_email}
                        onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                        placeholder="jean.dupont@email.com"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.guest_phone}
                      onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                {/* Dates et voyageurs */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Détails du séjour</h4>
                  
                  {property.price_type === 'month' ? (
                    // Sélection pour location mensuelle
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          <Calendar className="w-3 h-3 inline mr-1 text-[#ea80fc]" />
                          Date de début
                        </label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.check_in}
                          onChange={(e) => handleMonthDateChange(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          <Calendar className="w-3 h-3 inline mr-1 text-[#ea80fc]" />
                          Durée (mois)
                        </label>
                        <select
                          value={formData.months_count}
                          onChange={(e) => handleMonthsCountChange(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                        >
                          <option value={1}>1 mois</option>
                          <option value={2}>2 mois</option>
                          <option value={3}>3 mois</option>
                          <option value={6}>6 mois</option>
                          <option value={12}>12 mois</option>
                        </select>
                      </div>

                      {formData.check_in && formData.check_out && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 font-medium">
                            Location du {new Date(formData.check_in).toLocaleDateString('fr-FR')} au {new Date(formData.check_out).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Durée: {formData.months_count} mois
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Sélection pour location à la nuit
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          <Calendar className="w-3 h-3 inline mr-1 text-[#ea80fc]" />
                          Date d'arrivée
                        </label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.check_in}
                          onChange={(e) => {
                            setFormData({ ...formData, check_in: e.target.value });
                            setCurrentStep(2);
                          }}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          <Calendar className="w-3 h-3 inline mr-1 text-[#ea80fc]" />
                          Date de départ
                        </label>
                        <input
                          type="date"
                          required
                          min={formData.check_in || new Date().toISOString().split('T')[0]}
                          value={formData.check_out}
                          onChange={(e) => {
                            setFormData({ ...formData, check_out: e.target.value });
                            setCurrentStep(2);
                          }}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      <Users className="w-3 h-3 inline mr-1 text-[#ea80fc]" />
                      Nombre de voyageurs
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={property.max_guests}
                      value={formData.guests_count}
                      onChange={(e) => setFormData({ ...formData, guests_count: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: {property.max_guests} voyageurs
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Récapitulatif */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 h-fit sticky top-8">
              <h3 className="text-base font-bold text-gray-900 mb-3">Récapitulatif</h3>
              
              {/* Détails du séjour */}
              <div className="space-y-3 mb-3">
                <div className="flex items-start space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#ea80fc] to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{property.title}</h4>
                    <p className="text-xs text-gray-600 flex items-center space-x-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{property.city}, {property.country}</span>
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{property.max_guests}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bed className="w-3 h-3" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="w-3 h-3" />
                        <span>{property.bathrooms}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {(nights > 0 || months > 0) && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-xs">
                        {property.price_per_night}€ × {durationText}
                      </span>
                      <span className="font-semibold text-gray-900 text-sm">{totalPrice}€</span>
                    </div>
                    
                    {/* Détails des dates */}
                    {formData.check_in && formData.check_out && (
                      <div className="flex justify-between text-xs text-gray-500 mb-2 p-2 bg-gray-50 rounded">
                        <span className="font-medium">
                          {new Date(formData.check_in).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-[#ea80fc] font-bold">→</span>
                        <span className="font-medium">
                          {new Date(formData.check_out).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}

                    {/* Frais et total */}
                    <div className="space-y-1 pt-2 border-t border-gray-200">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Frais de service</span>
                        <span className="text-green-600 font-semibold">Gratuit</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-[#ea80fc]">{totalPrice}€</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Avantages */}
              <div className="space-y-2 mb-3">
                <h4 className="font-semibold text-gray-900 text-xs">Ce qui est inclus</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <span>Confirmation immédiate</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <span>Sans frais de service</span>
                  </div>
                </div>
              </div>

              {/* Bouton de réservation */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (property.price_type === 'month' ? months === 0 : nights === 0) || !formData.guest_name || !formData.guest_email || !formData.guest_phone}
                className="w-full bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none shadow-md"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>Réservation en cours...</span>
                  </div>
                ) : (
                  `Réserver pour ${totalPrice}€`
                )}
              </button>

              {(property.price_type === 'month' ? months === 0 : nights === 0) && (
                <p className="text-center text-xs text-orange-600 mt-2">
                  Veuillez sélectionner vos dates de séjour
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}