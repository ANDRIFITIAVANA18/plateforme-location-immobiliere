// // import axios from 'axios';
// // import { Property, Booking, BookingFormData, Review, SearchFilters } from '../types';

// // const API_URL = 'http://localhost:5000/api';

// // export const api = {
// //   getProperties: async (filters?: SearchFilters): Promise<Property[]> => {
// //     const params = new URLSearchParams();
// //     if (filters?.city) params.append('city', filters.city);
// //     if (filters?.type) params.append('type', filters.type);
// //     if (filters?.min_price) params.append('min_price', filters.min_price.toString());
// //     if (filters?.max_price) params.append('max_price', filters.max_price.toString());
// //     if (filters?.guests) params.append('guests', filters.guests.toString());

// //     const response = await axios.get(`${API_URL}/properties?${params.toString()}`);
// //     return response.data;
// //   },

// //   getProperty: async (id: string): Promise<Property> => {
// //     const response = await axios.get(`${API_URL}/properties/${id}`);
// //     return response.data;
// //   },

// //   createBooking: async (bookingData: BookingFormData): Promise<Booking> => {
// //     const response = await axios.post(`${API_URL}/bookings`, bookingData);
// //     return response.data;
// //   },

// //   getBookings: async (): Promise<Booking[]> => {
// //     const response = await axios.get(`${API_URL}/bookings`);
// //     return response.data;
// //   },

// //   getBooking: async (id: string): Promise<Booking> => {
// //     const response = await axios.get(`${API_URL}/bookings/${id}`);
// //     return response.data;
// //   },

// //   createReview: async (reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
// //     const response = await axios.post(`${API_URL}/reviews`, reviewData);
// //     return response.data;
// //   },

// //   getCities: async (): Promise<string[]> => {
// //     const response = await axios.get(`${API_URL}/cities`);
// //     return response.data;
// //   }
// // };


// // src/services/api.ts
// import { Property, Booking, BookingFormData, User, LoginData, RegisterData } from '../types';

// const API_BASE_URL = 'http://localhost:5000/api';

// export const api = {
//   // Authentification
//   async login(credentials: LoginData): Promise<User> {
//     const response = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(credentials),
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Erreur de connexion');
//     }
//     return response.json();
//   },

//   async register(userData: RegisterData): Promise<User> {
//     const response = await fetch(`${API_BASE_URL}/auth/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData),
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Erreur d\'inscription');
//     }
//     return response.json();
//   },

//   async getCurrentUser(email: string): Promise<User> {
//     const response = await fetch(`${API_BASE_URL}/auth/me?email=${encodeURIComponent(email)}`);
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Utilisateur non trouvé');
//     }
//     return response.json();
//   },

//   // Propriétés
//   async getProperties(): Promise<Property[]> {
//     const response = await fetch(`${API_BASE_URL}/properties`);
//     return response.json();
//   },

//   async getCities(): Promise<string[]> {
//     const response = await fetch(`${API_BASE_URL}/cities`);
//     return response.json();
//   },

//   async createBooking(bookingData: BookingFormData): Promise<Booking> {
//     const response = await fetch(`${API_BASE_URL}/bookings`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(bookingData),
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Erreur lors de la réservation');
//     }
//     return response.json();
//   },

//   async getBookings(userEmail?: string): Promise<Booking[]> {
//     const url = userEmail 
//       ? `${API_BASE_URL}/bookings?user_email=${encodeURIComponent(userEmail)}`
//       : `${API_BASE_URL}/bookings`;
    
//     const response = await fetch(url);
//     return response.json();
//   },

//   async getOwnerProperties(ownerId: string): Promise<Property[]> {
//     const response = await fetch(`${API_BASE_URL}/owners/${ownerId}/properties`);
//     return response.json();
//   },

//    updateBooking: async (bookingId: string, data: any): Promise<void> => {
//     const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error('Erreur lors de la modification de la réservation');
//     }
//   },
//     deleteBooking: async (bookingId: string): Promise<void> => {
//     const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       throw new Error('Erreur lors de la suppression de la réservation');
//     }
//   },
// };

// src/services/api.ts
import { Property, Booking, BookingFormData, User, LoginData, RegisterData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Authentification
  async login(credentials: LoginData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur de connexion');
    }
    return response.json();
  },

  async register(userData: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur d\'inscription');
    }
    return response.json();
  },

  async getCurrentUser(email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Utilisateur non trouvé');
    }
    return response.json();
  },

  // Propriétés
  async getProperties(): Promise<Property[]> {
    const response = await fetch(`${API_BASE_URL}/properties`);
    return response.json();
  },

  async getCities(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/cities`);
    return response.json();
  },

  async createBooking(bookingData: BookingFormData): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la réservation');
    }
    return response.json();
  },

  async getBookings(userEmail?: string): Promise<Booking[]> {
    const url = userEmail 
      ? `${API_BASE_URL}/bookings?user_email=${encodeURIComponent(userEmail)}`
      : `${API_BASE_URL}/bookings`;
    
    const response = await fetch(url);
    return response.json();
  },

  async getOwnerProperties(ownerId: string): Promise<Property[]> {
    const response = await fetch(`${API_BASE_URL}/owners/${ownerId}/properties`);
    return response.json();
  },

  // Mise à jour de réservation
  async updateBooking(bookingId: string, data: any): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la modification de la réservation');
    }
    return response.json();
  },

 updateBookingStatus: async (bookingId: string, status: string): Promise<Booking> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur mise à jour statut réservation:', error);
      throw error;
    }
  },


  // Suppression de réservation
  async deleteBooking(bookingId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression de la réservation');
    }
  },

  
};