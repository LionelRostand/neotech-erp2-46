
export interface Service {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  status: string;
  categoryId?: string;
  canBeUsedIn?: {
    vehicles: boolean;
    appointments: boolean;
    repairs: boolean;
    invoices: boolean;
    mechanics: boolean;
    suppliers: boolean;
    inventory: boolean;
  };
}
