
declare global {
  interface Window {
    L: any; // Leaflet global object
    ChevronsUpDown: React.FC<{ className?: string }>;
  }
}

export {};
