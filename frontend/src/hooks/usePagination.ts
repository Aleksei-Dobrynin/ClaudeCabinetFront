import { useState, useCallback } from 'react';
import { GridSortModel } from '@mui/x-data-grid';

interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filter?: string;
}

/**
 * Custom hook for handling pagination, sorting, and filtering
 * @param initialParams - Initial pagination parameters
 * @param fetchData - Function to fetch data with pagination params
 */
export function usePagination<T>(
  initialParams: PaginationParams,
  fetchData: (params: PaginationParams) => Promise<{ data: T[], totalCount: number }>
) {
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data with current pagination params
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchData(params);

      setData(result.data);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params, fetchData]);

  // Handle page change
  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setParams(prev => ({
      ...prev,
      page,
      pageSize
    }));
  }, []);

  // Handle sort model change
  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    if (sortModel.length === 0) {
      setParams(prev => ({
        ...prev,
        sort: undefined,
        order: undefined
      }));
      return;
    }

    const { field, sort } = sortModel[0];

    setParams(prev => ({
      ...prev,
      sort: field,
      order: sort as 'asc' | 'desc'
    }));
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filter: string) => {
    setParams(prev => ({
      ...prev,
      filter,
      page: 0 // Reset to first page when filter changes
    }));
  }, []);

  return {
    params,
    data,
    totalCount,
    loading,
    error,
    loadData,
    handlePageChange,
    handleSortModelChange,
    handleFilterChange
  };
}