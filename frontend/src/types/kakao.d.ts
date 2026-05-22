declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: object) => unknown;
        Marker: new (options: object) => {
          setMap: (map: unknown) => void;
        };
      };
    };
  }
}

export {};
