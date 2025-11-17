// export interface Property {
//   id: string;
//   title: string;
//   description: string;
//   address: string;
//   city: string;
//   country: string;
//   price_per_night: number;
//   bedrooms: number;
//   bathrooms: number;
//   max_guests: number;
//   property_type: 'apartment' | 'house' | 'villa' | 'studio';
//   amenities: string[];
//   images: string[];
//   is_available: boolean;
//   owner_id: string;
//   rating: number;
//   reviews_count: number;
//   reviews?: Review[];
// }

// export interface Booking {
//   id: string;
//   property_id: string;
//   guest_name: string;
//   guest_email: string;
//   guest_phone: string;
//   check_in: string;
//   check_out: string;
//   guests_count: number;
//   total_price: number;
//   status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
//   created_at: string;
//   property?: Property;
// }

// export interface Review {
//   id: string;
//   property_id: string;
//   reviewer_name: string;
//   rating: number;
//   comment: string;
//   created_at: string;
// }

// export interface BookingFormData {
//   property_id: string;
//   guest_name: string;
//   guest_email: string;
//   guest_phone: string;
//   check_in: string;
//   check_out: string;
//   guests_count: number;
//   total_price: number;
// }

// export interface SearchFilters {
//   city?: string;
//   type?: string;
//   min_price?: number;
//   max_price?: number;
//   guests?: number;
// }
// export type ViewType = 'home' | 'bookings' | 'owner' | 'booking-form';
// export type NavigationView = 'home' | 'bookings' | 'owner'; // Pour la navbar seulement

// src/types/index.ts
export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;  // Ajouter ces champs
  longitude?: number; // Ajouter ces champs
  price_per_night: number;
  price_type: 'night' | 'month'; // AJOUT DE CE CHAMP
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_type: 'apartment' | 'house' | 'villa' | 'studio';
  amenities: string[];
  images: string[];
  is_available: boolean;
  owner_id: string;
  rating: number;
  reviews_count: number;
  reviews?: Review[];
}

export interface Booking {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  property?: Property;
  title?: string;
  city?: string;
  images?: string[];
}

export interface Review {
  id: string;
  property_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface BookingFormData {
  property_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
}

export interface SearchFilters {
  city?: string;
  type?: string;
  min_price?: number;
  max_price?: number;
  guests?: number;
}

export type ViewType = 'home' | 'bookings' | 'owner' | 'booking-form' | 'login' | 'register' | 'role-selection';
export type NavigationView = 'home' | 'bookings' | 'owner';

// Nouveaux types pour l'authentification
export type UserRole = 'admin' | 'proprietaire' | 'locataire';

export interface User {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: UserRole;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  email: string;
  telephone: string;
  password: string;
  role: UserRole;
}