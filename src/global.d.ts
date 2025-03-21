
declare global {
  interface Window {
    L: {
      map: (element: HTMLElement) => any;
      tileLayer: (url: string, options?: any) => any;
      marker: (latLng: [number, number]) => any;
      latLng: (lat: number, lng: number) => any;
      latLngBounds: (corner1: [number, number], corner2: [number, number]) => any;
    };
  }
}

export {};
