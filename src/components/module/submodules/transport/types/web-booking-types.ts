
export interface WebBookingConfig {
  title: string;
  subtitle: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  headerBackground: string;
  footerBackground: string;
  fontFamily: string;
  menuItems: MenuItem[];
  banner: BannerConfig;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  bookingFormSettings: {
    requireLogin: boolean;
    showPrices: boolean;
    allowTimeSelection: boolean;
    requirePhoneNumber: boolean;
    allowComments: boolean;
    paymentOptions: string[];
    termsUrl: string;
  };
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  children?: MenuItem[];
}

export interface BannerConfig {
  enabled: boolean;
  text: string;
  background: string;
  textColor: string;
  link?: string;
  position: 'top' | 'bottom';
}
