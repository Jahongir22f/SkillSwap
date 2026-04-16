export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio: string;
  offeredSkills: string[];
  neededSkills: string[];
  location: {
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  reviewCount: number;
  certificates: string[];
  createdAt: any;
  updatedAt: any;
  telegramId?: string;
}
