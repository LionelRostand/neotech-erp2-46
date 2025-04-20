
export interface RentalSettings {
  companyName: string;
  currency: string;
  defaultRentalDuration: number;
  minRentalDuration: number;
  maxRentalDuration: number;
  allowWeekendRentals: boolean;
  requireDeposit: boolean;
  depositAmount: number;
  defaultPickupLocation: string;
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
}

export type RentalPermissionLevel = 'none' | 'read' | 'write' | 'admin';

export interface RentalUserPermission {
  userId: string;
  userName: string;
  email: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

