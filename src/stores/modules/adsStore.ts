import { defineStore } from 'pinia';
import { IAd } from '@/models/ad';
import { adsService } from '@/utils/services/adsService';

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

interface AdsStats {
  totalAds: number;
  activeAds: number;
  deactiveAds: number;
}

interface AdsState {
  ads: IAd[];
  currentAd: IAd | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  stats: AdsStats | null;
}

export const useAdsStore = defineStore('ads', {
  state: (): AdsState => ({
    ads: [],
    currentAd: null,
    loading: false,
    error: null,
    pagination: null,
    stats: null,
  }),

  getters: {
    allAds: (state): IAd[] => state.ads,
    currentAdData: (state): IAd | null => state.currentAd,
    isLoading: (state): boolean => state.loading,
    errorMessage: (state): string | null => state.error,
    paginationInfo: (state): Pagination | null => state.pagination,
    adsStats: (state): AdsStats | null => state.stats,
  },

  actions: {
    async getAds(params?: { page?: number; limit?: number }): Promise<{ data: IAd[]; pagination: Pagination }> {
      try {
        this.loading = true;
        const response = await adsService.getAds(params);
        
        // Log the full response for debugging
        // console.log('Full response from adsService:', response);
        // console.log('Response type:', typeof response);
        // console.log('Response keys:', Object.keys(response));
        
        // Handle the backend response structure: { success, count, pagination, data: ads[] }
        // Since response is already the data object, we don't need to access .data again
        const responseData = response;
        // console.log('Response data:', responseData);
        // console.log('Response data.data:', responseData.data);
        // console.log('Response data.data type:', typeof responseData.data);
        // console.log('Response data.data length:', responseData.data?.length);
        // console.log('Response data.data isArray:', Array.isArray(responseData.data));
        
        // The response structure is: { success, count, pagination, data: ads[] }
        // So responseData.data contains the array of ads
        this.ads = responseData.data || [];
        // console.log('store Ads fetched:', this.ads);
        // console.log('store Ads fetched (raw):', JSON.stringify(this.ads));
        // console.log('store Ads fetched (stringified):', JSON.stringify(this.ads, null, 2));
        // console.log('Ads count:', this.ads.length);
        
        // Extract pagination from the correct path
        this.pagination = responseData.pagination || null;
        // console.log('Pagination:', this.pagination);
        
        const result = { data: this.ads, pagination: this.pagination || { total: 0, page: 1, limit: 10, pageCount: 1 } };
        // console.log('Returning result:', result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching ads';
        this.error = errorMsg;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async getAd(adId: string): Promise<IAd> {
      try {
        this.loading = true;
        const response = await adsService.getAd(adId);
        this.currentAd = response;
        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching ad';
        this.error = errorMsg;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createAd(adData: Partial<IAd>): Promise<IAd> {
      try {
        this.loading = true;
        const response = await adsService.createAd(adData);
        this.ads.unshift(response);
        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error creating ad';
        this.error = errorMsg;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateAd(adId: string, adData: Partial<IAd>): Promise<IAd> {
      try {
        this.loading = true;
        const response = await adsService.updateAd(adId, adData);
        this.ads = this.ads.map(ad => (ad._id === adId ? response : ad));
        this.currentAd = response;
        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error updating ad';
        this.error = errorMsg;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteAd(adId: string): Promise<void> {
      try {
        this.loading = true;
        await adsService.deleteAd(adId);
        this.ads = this.ads.filter(ad => ad._id !== adId);
        this.currentAd = null;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error deleting ad';
        this.error = errorMsg;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async getAdsStats(): Promise<AdsStats> {
      try {
        this.loading = true;
        const response = await adsService.getAdsStats();
        // Handle the backend response structure
        const responseData = response.data || response;
        this.stats = responseData as AdsStats;
        return responseData as AdsStats;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching ads stats';
        this.error = errorMsg;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
