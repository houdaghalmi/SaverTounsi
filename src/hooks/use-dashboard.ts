import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { TransactionInput } from '@/lib/validations';

export function useDashboardData() {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: api.transactions.list,
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });

  const addTransactionMutation = useMutation({
    mutationFn: api.transactions.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const isLoading = transactionsQuery.isLoading || categoriesQuery.isLoading;
  const error = transactionsQuery.error || categoriesQuery.error;

  return {
    transactions: transactionsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    isLoading,
    error,
    addTransaction: addTransactionMutation.mutate,
  };
}
