
import { useQuery } from '@tanstack/react-query';
import { overstockService } from '@/services/overstockService';

export const useOverstockData = () => {
  return useQuery({
    queryKey: ['overstock-data'],
    queryFn: overstockService.getOverstockData,
    refetchInterval: 30000,
  });
};
