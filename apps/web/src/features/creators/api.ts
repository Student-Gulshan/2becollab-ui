import { apiClient } from '@/lib/api/client';
import type {
  ApiResponse,
  CreatorSearchQuery,
  CreatorSearchResponse,
} from '@2becollab/types';

export const creatorsApi = {
  search: async (params: CreatorSearchQuery) => {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.set('query', params.query);
    if (params.niches && params.niches.length > 0) {
      searchParams.set('niches', params.niches.join(','));
    }
    if (params.platforms && params.platforms.length > 0) {
      searchParams.set('platforms', params.platforms.join(','));
    }
    if (params.minFollowers !== undefined) {
      searchParams.set('minFollowers', String(params.minFollowers));
    }
    if (params.maxFollowers !== undefined) {
      searchParams.set('maxFollowers', String(params.maxFollowers));
    }
    if (params.minRating !== undefined) {
      searchParams.set('minRating', String(params.minRating));
    }
    if (params.location) searchParams.set('location', params.location);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const queryString = searchParams.toString();
    const url = `/creators${queryString ? `?${queryString}` : ''}`;

    const res = await apiClient.get<ApiResponse<CreatorSearchResponse>>(url);
    return res.data;
  },
};
