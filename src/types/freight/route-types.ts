
export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number; // in hours
  transportType: 'road' | 'sea' | 'air' | 'rail' | 'multimodal';
  active: boolean;
}
