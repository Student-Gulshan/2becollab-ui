import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from './api';
import type { CreatePortfolioItemPayload, UpdatePortfolioItemPayload } from '@2becollab/types';

const PORTFOLIO_KEY = ['portfolio', 'me'];

export function useMyPortfolio() {
  return useQuery({
    queryKey: PORTFOLIO_KEY,
    queryFn: async () => {
      const res = await portfolioApi.list();
      return res.data?.items ?? [];
    },
  });
}

export function useAddPortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePortfolioItemPayload) => portfolioApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_KEY });
    },
  });
}

export function useUpdatePortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePortfolioItemPayload }) =>
      portfolioApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_KEY });
    },
  });
}

export function useDeletePortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => portfolioApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_KEY });
    },
  });
}

export function useReorderPortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemIds: string[]) => portfolioApi.reorder(itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_KEY });
    },
  });
}
