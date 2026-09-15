import { useQuery } from '@tanstack/react-query';
import { creatorsApi } from './api';
import type { CreatorSearchQuery } from '@2becollab/types';

export function useCreatorSearch(params: CreatorSearchQuery) {
  return useQuery({
    queryKey: ['creators', 'search', params],
    queryFn: async () => {
      const res = await creatorsApi.search(params);
      return res.data ?? { items: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
    },
  });
}
