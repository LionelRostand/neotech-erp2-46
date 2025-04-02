
// Re-export all the types
export * from './base-types';
export * from './vehicle-types';
export * from './driver-types';
export * from './client-types';
export * from './reservation-types';
export * from './map-types';
export * from './transport-types';
export * from './service-types';

// Export web-booking specific types
export interface WebBookingConfig {
  siteTitle: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  enableBookingForm: boolean;
  requiredFields: string[];
  menuItems?: MenuItem[];
  bannerConfig?: BannerConfig;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
}

export interface BannerConfig {
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  backgroundImage: string;
  buttonText: string;
  buttonLink: string;
  overlay: boolean;
  overlayOpacity: number;
}
