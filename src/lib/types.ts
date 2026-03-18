export type PropertyType = 'apartment' | 'house' | 'villa' | 'chalet' | 'penthouse' | 'commercial';
export type ListingType = 'sale' | 'rent';
export type UserRole = 'buyer' | 'seller' | 'agent' | 'admin';
export type Language = 'de' | 'en';

export interface Address {
  street: string;
  city: string;
  region: string;
  country: 'AT' | 'DE' | 'CH';
  postalCode: string;
  lat: number;
  lng: number;
}

export interface VRTour {
  id: string;
  panoramaUrl: string;
  thumbnailUrl: string;
  roomName: string;
  roomNameDe: string;
  hotspots?: VRHotspot[];
}

export interface VRHotspot {
  id: string;
  pitch: number;
  yaw: number;
  targetTourId: string;
  label: string;
}

export interface Property {
  id: string;
  title: string;
  titleDe: string;
  description: string;
  descriptionDe: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  currency: 'EUR' | 'CHF';
  pricePerSqm?: number;
  address: Address;
  features: {
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    area: number;        // m²
    plotArea?: number;   // m² land
    floor?: number;
    totalFloors?: number;
    yearBuilt?: number;
    parking: boolean;
    elevator: boolean;
    balcony: boolean;
    garden: boolean;
    cellar: boolean;
    energyClass?: string;
  };
  amenities: string[];
  images: string[];
  vrTours: VRTour[];
  agent: Agent;
  status: 'active' | 'reserved' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
  views: number;
  vrViews: number;
  featured: boolean;
}

export interface Agent {
  id: string;
  name: string;
  agency: string;
  phone: string;
  email: string;
  avatar: string;
  region: string;
  languages: string[];
  propertiesCount: number;
  rating: number;
  reviewCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: UserRole;
  location: string;
  text: string;
  textDe: string;
  avatar: string;
  rating: number;
}

export interface SearchFilters {
  query: string;
  type: PropertyType | '';
  listingType: ListingType | '';
  country: string;
  region: string;
  minPrice: number | '';
  maxPrice: number | '';
  minArea: number | '';
  maxArea: number | '';
  minRooms: number | '';
  hasVrTour: boolean;
}
