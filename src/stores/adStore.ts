import { defineStore } from 'pinia';
import axios from 'axios';
import { IAd } from '../models/ad';

export const useAdStore = defineStore('ad', {
  state: () => ({
    ads: [] as IAd[],
    currentAd: null as IAd | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAds() {
      try {
        this.loading = true;
        const response = await axios.get('/api/v1/ads');
        this.ads = response.data.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching ads';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAd(id: string) {
      try {
        this.loading = true;
        const response = await axios.get(`/api/v1/ads/${id}`);
        this.currentAd = response.data.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error fetching ad';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createAd(adData: Partial<IAd>) {
      try {
        this.loading = true;
        const response = await axios.post('/api/v1/ads', adData);
        this.ads.unshift(response.data.data);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error creating ad';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAd(id: string, adData: Partial<IAd>) {
      try {
        this.loading = true;
        const response = await axios.put(`/api/v1/ads/${id}`, adData);
        const updatedAd = response.data.data;
        this.ads = this.ads.map(ad => ad._id === id ? updatedAd : ad);
        if (this.currentAd?._id === id) {
          this.currentAd = updatedAd;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error updating ad';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteAd(id: string) {
      try {
        this.loading = true;
        await axios.delete(`/api/v1/ads/${id}`);
        this.ads = this.ads.filter(ad => ad._id !== id);
        if (this.currentAd?._id === id) {
          this.currentAd = null;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error deleting ad';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setError(error: string | null) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    }
  }
}); 