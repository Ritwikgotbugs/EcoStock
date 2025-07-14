
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OverstockData, overstockService } from '@/services/overstockService';
import { AlertTriangle, Leaf, MapPin, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';

interface InventoryTableProps {
  data: OverstockData | undefined;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const InventoryTable = ({ data, isLoading, onRefresh }: InventoryTableProps) => {
  const [editItem, setEditItem] = useState<OverstockItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<OverstockItem>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setLoadingAction(true);
    try {
      await overstockService.deleteItem(id);
      onRefresh && onRefresh();
    } finally {
      setDeletingId(null);
      setLoadingAction(false);
    }
  };

  const handleEditOpen = (item: OverstockItem) => {
    setEditItem(item);
    setEditForm({ ...item });
  };

  const handleEditChange = (field: keyof OverstockItem, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    setLoadingAction(true);
    try {
      await overstockService.updateItem(editItem.id!, editForm);
      setEditItem(null);
      onRefresh && onRefresh();
    } finally {
      setLoadingAction(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.overstock_items) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">No inventory data available.</div>
        </CardContent>
      </Card>
    );
  }

  // Group items by stock status
  const overstocked = data.overstock_items.filter(item => {
    const stockRatio = item.actual_stock / (item.predicted_demand + item.safety_buffer);
    return stockRatio > 1.2;
  });
  const understocked = data.overstock_items.filter(item => {
    const stockRatio = item.actual_stock / (item.predicted_demand + item.safety_buffer);
    return stockRatio < 0.8;
  });
  const optimal = data.overstock_items.filter(item => {
    const stockRatio = item.actual_stock / (item.predicted_demand + item.safety_buffer);
    return stockRatio >= 0.8 && stockRatio <= 1.2;
  });

  const renderTableRows = (items: OverstockItem[]) => (
    items.map((item) => {
      // eco_score is now always a number
      const stockRatio = item.actual_stock / (item.predicted_demand + item.safety_buffer);
      const isOverstocked = stockRatio > 1.2;
      const isUnderstocked = stockRatio < 0.8;
      return (
        <TableRow key={item.sku} className={isOverstocked ? 'bg-red-50' : isUnderstocked ? 'bg-yellow-50' : 'bg-green-50'}>
          <TableCell className="flex items-center gap-2 font-medium">
            <Package className="h-4 w-4 text-blue-500" /> {item.name}
          </TableCell>
          <TableCell>{item.sku}</TableCell>
          <TableCell className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-500" /> {item.region}
          </TableCell>
          <TableCell>{item.actual_stock}</TableCell>
          <TableCell>{item.predicted_demand}</TableCell>
          <TableCell className="flex items-center gap-1">
            <Leaf className="h-4 w-4 text-green-600" />{(item.eco_score * 100).toFixed(0)}%
          </TableCell>
          <TableCell>{item.trend_score ?? '-'}</TableCell>
          <TableCell className="flex items-center gap-1">
            {isOverstocked ? <AlertTriangle className="h-4 w-4 text-red-500" title="Overstocked" /> : isUnderstocked ? <TrendingDown className="h-4 w-4 text-yellow-500" title="Understocked" /> : <TrendingUp className="h-4 w-4 text-green-500" title="Optimal" />} 
            {isOverstocked ? 'Overstocked' : isUnderstocked ? 'Understocked' : 'Optimal'}
          </TableCell>
          <TableCell>{item.anomaly_reason}</TableCell>
          <TableCell>
            <Button size="sm" variant="outline" onClick={() => handleEditOpen(item)}>Edit</Button>
            <Button size="sm" variant="ghost" className="ml-2 text-red-500" onClick={() => handleDelete(item.id!)} disabled={deletingId === item.id}>{deletingId === item.id ? 'Deleting...' : 'Delete'}</Button>
          </TableCell>
        </TableRow>
      );
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="overstocked">
            <AccordionTrigger>Overstocked Items ({overstocked.length})</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Demand</TableHead>
                    <TableHead>Eco Score</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action Needed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows(overstocked)}</TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="understocked">
            <AccordionTrigger>Understocked Items ({understocked.length})</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Demand</TableHead>
                    <TableHead>Eco Score</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action Needed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows(understocked)}</TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="optimal">
            <AccordionTrigger>Optimal Items ({optimal.length})</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Demand</TableHead>
                    <TableHead>Eco Score</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action Needed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows(optimal)}</TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input value={editForm.name || ''} onChange={e => handleEditChange('name', e.target.value)} placeholder="Name" />
            <Input value={editForm.sku || ''} onChange={e => handleEditChange('sku', e.target.value)} placeholder="SKU" />
            <Input value={editForm.region || ''} onChange={e => handleEditChange('region', e.target.value)} placeholder="Region" />
            <Input value={editForm.actual_stock || ''} type="number" onChange={e => handleEditChange('actual_stock', Number(e.target.value))} placeholder="Stock" />
            <Input value={editForm.predicted_demand || ''} type="number" onChange={e => handleEditChange('predicted_demand', Number(e.target.value))} placeholder="Demand" />
            <Input value={editForm.eco_score || ''} type="number" step="0.01" min="0" max="1" onChange={e => handleEditChange('eco_score', Number(e.target.value))} placeholder="Eco Score" />
            {/* Add more fields as needed */}
          </div>
          <DialogFooter>
            <Button onClick={handleEditSave} disabled={loadingAction}>{loadingAction ? 'Saving...' : 'Save'}</Button>
            <Button variant="outline" onClick={() => setEditItem(null)} disabled={loadingAction}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
