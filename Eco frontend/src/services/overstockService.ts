
export interface OverstockItem {
  sku: string;
  name: string;
  region: string;
  predicted_demand: number;
  actual_stock: number;
  safety_buffer: number;
  eco_score: number;
  eco_multiplier: number;
  recommended_reorder: number;
  anomaly_flag: boolean;
  anomaly_reason: string;
  category?: string;
  shelf_life_days?: number;
  trend_score?: number;
  seasonal_factor?: number;
  id?: number;
  eco_score_obj?: any;
  seasonal_trend?: any;
  trending_buzzwords?: any[];
}

export interface OverstockData {
  overstock_items: OverstockItem[];
}

const API_BASE = process.env.API_URL;

export const overstockService = {
  getOverstockData: async (): Promise<OverstockData> => {
    const res = await fetch(`${API_BASE}/overstock`);
    if (!res.ok) throw new Error('Failed to fetch overstock data');
    const items = await res.json();
    console.log(items);
    return { overstock_items: items };
  },

  updateStock: async (sku: string, newStock: number): Promise<void> => {
    // Find the item by SKU (need to fetch all, find id, then PATCH/PUT)
    const res = await fetch(`${API_BASE}/overstock`);
    if (!res.ok) throw new Error('Failed to fetch overstock data');
    const items = await res.json();
    const item = items.find((i: OverstockItem) => i.sku === sku);
    if (!item) throw new Error('Item not found');
    const id = item.id;
    const updateRes = await fetch(`${API_BASE}/overstock/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, actual_stock: newStock })
    });
    if (!updateRes.ok) throw new Error('Failed to update stock');
  },

  addItem: async (item: Partial<OverstockItem>): Promise<void> => {
    const res = await fetch(`${API_BASE}/overstock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add item');
  },

  deleteItem: async (id: number) => {
    const res = await fetch(`${API_BASE}/overstock/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete item');
    return await res.json();
  },
  updateItem: async (id: number, data: Partial<OverstockItem>) => {
    const res = await fetch(`${API_BASE}/overstock/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update item');
    return await res.json();
  },
  bulkAddItems: async (items: Partial<OverstockItem>[]) => {
    const res = await fetch(`${API_BASE}/overstock/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    if (!res.ok) throw new Error('Failed to bulk add items');
    return await res.json();
  },

  getSeasonalTrends: async () => {
    const res = await fetch(`${API_BASE}/seasonal`);
    if (!res.ok) throw new Error('Failed to fetch seasonal trends');
    return await res.json();
  },

  getTrendingBuzzwords: async () => {
    const res = await fetch(`${API_BASE}/trending`);
    if (!res.ok) throw new Error('Failed to fetch trending buzzwords');
    return await res.json();
  },

  getEcoScores: async () => {
    const res = await fetch(`${API_BASE}/eco-scores`);
    if (!res.ok) throw new Error('Failed to fetch eco scores');
    return await res.json();
  }
};
