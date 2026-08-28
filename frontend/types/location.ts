export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  state: string;
  district: string;
  talukOrBlock?: string;
  village?: string;
  pincode?: string;
  formattedAddress?: string;
  coordinates?: GeoCoordinates;
}

export interface AdministrativeRegion {
  stateCode: string;
  stateName: string;
  districts: string[];
}
