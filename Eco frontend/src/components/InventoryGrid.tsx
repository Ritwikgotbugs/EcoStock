
import { OverstockData } from '@/services/overstockService';
import { useRef } from 'react';
import { InventoryTable } from './InventoryTable';
import { Button } from './ui/button';

interface InventoryGridProps {
  data: OverstockData | undefined;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const InventoryGrid = ({ data, isLoading, onRefresh }: InventoryGridProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    // Simple CSV parse: first line is header
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',').map(h => h.trim());
    const items = lines.map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = values[i]; });
      // Convert numbers
      if (obj.actual_stock) obj.actual_stock = Number(obj.actual_stock);
      if (obj.predicted_demand) obj.predicted_demand = Number(obj.predicted_demand);
      if (obj.safety_buffer) obj.safety_buffer = Number(obj.safety_buffer);
      if (obj.eco_score) obj.eco_score = Number(obj.eco_score);
      if (obj.eco_multiplier) obj.eco_multiplier = Number(obj.eco_multiplier);
      if (obj.recommended_reorder) obj.recommended_reorder = Number(obj.recommended_reorder);
      if (obj.anomaly_flag) obj.anomaly_flag = obj.anomaly_flag === 'true' || obj.anomaly_flag === '1';
      if (obj.shelf_life_days) obj.shelf_life_days = Number(obj.shelf_life_days);
      if (obj.trend_score) obj.trend_score = Number(obj.trend_score);
      if (obj.seasonal_factor) obj.seasonal_factor = Number(obj.seasonal_factor);
      return obj;
    });
    await overstockService.bulkAddItems(items);
    onRefresh && onRefresh();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Button onClick={() => fileInputRef.current?.click()} variant="outline">Upload CSV</Button>
        <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSVUpload} />
      </div>
      <InventoryTable data={data} isLoading={isLoading} onRefresh={onRefresh} />
    </div>
  );
};
