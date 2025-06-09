export interface IBaseUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  identityNumber?: string;
  isAvailable: boolean;
  preferredLang?: string;
  region?: string;
  timeFormat: '12' | '24';
  image?: string;
  createdAt: string;
  updatedAt: string;
} 