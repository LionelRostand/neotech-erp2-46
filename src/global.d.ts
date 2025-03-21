
declare global {
  interface Window {
    L: {
      map: (element: HTMLElement) => any;
      tileLayer: (url: string, options?: any) => any;
      marker: (latLng: [number, number], options?: any) => any;
      latLng: (lat: number, lng: number) => any;
      latLngBounds: (corner1: [number, number], corner2: [number, number]) => any;
      divIcon: (options: any) => any;
      featureGroup: (markers: any[]) => any;
    };
  }
}

export {};
