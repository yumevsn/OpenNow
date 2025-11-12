
export enum Day {
  Mon = 'Mon',
  Tue = 'Tue',
  Wed = 'Wed',
  Thu = 'Thu',
  Fri = 'Fri',
  Sat = 'Sat',
  Sun = 'Sun',
}

export enum BusinessType {
  Supermarket = 'Supermarket',
  Pharmacy = 'Pharmacy',
  Restaurant = 'Restaurant',
}

export type Hours = {
  open: string;
  close: string;
} | null;

export type Schedule = {
  [key in Day]: Hours;
};

export interface Branch {
  id: number;
  address: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  schedule: Schedule;
}

export interface Business {
  id: number;
  name: string;
  type: BusinessType;
  branches: Branch[];
}

export interface DisplayBusiness extends Branch {
  businessId: number;
  businessName: string;
  businessType: BusinessType;
  distance?: number;
}