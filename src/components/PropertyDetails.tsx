import { useState, useEffect } from 'react';
import { X, MapPin, Users, Bed, Bath, Star, Check } from 'lucide-react';
import { Property } from '../types';
import { api } from '../services/api';
import BookingForm from './BookingForm';

interface PropertyDetailsProps {
  propertyId: string;
  onClose: () => void;
}

export default function PropertyDetails({ propertyId, onClose }: PropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    api.getProperty(propertyId).then(setProperty);
  }, [propertyId]);

  if (!property) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (showBookingForm) {
    return <BookingForm property={property} onClose={() => setShowBookingForm(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative h-96">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover rounded-t-xl"
          />
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h2>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.address}, {property.city}, {property.country}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{property.price_per_night}€</div>
              <div className="text-sm text-gray-600">par nuit</div>
              <div className="flex items-center mt-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-semibold">{property.rating}</span>
                <span className="text-gray-600 ml-1">({property.reviews_count} avis)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 py-6 border-y border-gray-200">
            <div className="text-center">
              <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold">{property.bedrooms}</div>
              <div className="text-sm text-gray-600">Chambres</div>
            </div>
            <div className="text-center">
              <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold">{property.bathrooms}</div>
              <div className="text-sm text-gray-600">Salles de bain</div>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold">{property.max_guests}</div>
              <div className="text-sm text-gray-600">Voyageurs</div>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600 font-semibold text-lg">🏠</div>
              <div className="font-semibold capitalize">{property.property_type}</div>
              <div className="text-sm text-gray-600">Type</div>
            </div>
          </div>

          <div className="py-6">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          <div className="py-6 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-4">Équipements</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {property.reviews && property.reviews.length > 0 && (
            <div className="py-6 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4">Avis des voyageurs</h3>
              <div className="space-y-4">
                {property.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{review.reviewer_name}</div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowBookingForm(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Réserver maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
