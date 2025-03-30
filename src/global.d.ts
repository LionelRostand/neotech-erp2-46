
declare global {
  interface Window {
    L: any; // Leaflet global object
    ChevronsUpDown: React.FC<{ 
      className?: string; 
      size?: string | number; 
      color?: string;
      strokeWidth?: number;
      [key: string]: any; // Allow additional props to match Lucide's component API
    }>;
  }
}

export {};
