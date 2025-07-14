
import { InventoryTable } from './InventoryTable';
import { OverstockData } from '@/services/overstockService';

interface InventoryGridProps {
  data: OverstockData | undefined;
  isLoading: boolean;
}

export const InventoryGrid = ({ data, isLoading }: InventoryGridProps) => {
  return <InventoryTable data={data} isLoading={isLoading} />;
};
