
declare global {
  interface Window {
    L: any; // Leaflet global object
    ChevronsUpDown: React.FC<{ 
      className?: string; 
      size?: string | number; 
      color?: string;
      strokeWidth?: number;
    }>;
  }
}

export {};
