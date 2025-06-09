import axios from 'axios';
import { IAd } from '../models/ad';

const API_URL = process.env.VITE_API_URL ?? 'http://localhost:9091/api/v1';

// Get all ads
export const getAds = async (): Promise<IAd[]> => {
  const response = await axios.get(`${API_URL}/ads`);
  return response.data.data;
};

// Get single ad
export const getAd = async (id: string): Promise<IAd> => {
  const response = await axios.get(`${API_URL}/ads/${id}`);
  return response.data.data;
};

// Create new ad
export const createAd = async (adData: Partial<IAd>): Promise<IAd> => {
  const response = await axios.post(`${API_URL}/ads`, adData);
  return response.data.data;
};

// Update ad
export const updateAd = async (id: string, adData: Partial<IAd>): Promise<IAd> => {
  const response = await axios.put(`${API_URL}/ads/${id}`, adData);
  return response.data.data;
};

// Delete ad
export const deleteAd = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/ads/${id}`);
}; 