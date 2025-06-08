import { IUser } from './user';

export interface IAd {
  _id: string;
  url?: string;
  image?: string;
  expireDate: string;
  createdByAdminId: IUser;
  createdAt: string;
  updatedAt: string;
} 