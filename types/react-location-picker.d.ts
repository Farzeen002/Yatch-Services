declare module "react-location-picker" {
  export interface Location {
    lat: number;
    lng: number;
    address?: string;
  }

  export interface LocationPickerProps {
    defaultPosition?: Location;
    onChange?: (location: Location) => void;
  }

  const LocationPicker: React.FC<LocationPickerProps>;
  export default LocationPicker;
}
