
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Leaf } from 'lucide-react';
import { OverstockData } from '@/services/overstockService';

interface InventoryTableProps {
  data: OverstockData | undefined;
  isLoading: boolean;
}

export const InventoryTable = ({ data, isLoading }: InventoryTableProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Inventory Overview
          <Badge variant="outline">{data.overstock_items.length} Items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.overstock_items.map((item) => {
                const stockRatio = item.actual_stock / (item.predicted_demand + item.safety_buffer);
                const isOverstocked = stockRatio > 1.2;
                const isUnderstocked = stockRatio < 0.8;
                
                return (
                  <TableRow key={item.sku} className={isOverstocked ? 'bg-red-50' : isUnderstocked ? 'bg-yellow-50' : 'bg-green-50'}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{item.sku}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.region}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <div className="font-semibold">{item.actual_stock}</div>
                        <div className="text-xs text-gray-500">units</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <div>{item.predicted_demand}</div>
                        <div className="text-xs text-gray-500">predicted</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <Badge className={`${item.eco_score > 0.7 ? 'bg-green-500' : item.eco_score > 0.4 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                          {(item.eco_score * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {item.trend_score && item.trend_score > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${item.trend_score && item.trend_score > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.trend_score ? (item.trend_score * 100).toFixed(1) : '0'}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {item.anomaly_flag && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <Badge 
                          variant={isOverstocked ? 'destructive' : isUnderstocked ? 'secondary' : 'default'}
                          className={isOverstocked ? '' : isUnderstocked ? 'bg-yellow-500' : 'bg-green-500'}
                        >
                          {isOverstocked ? 'Overstock' : isUnderstocked ? 'Low Stock' : 'Optimal'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.recommended_reorder !== 0 && (
                        <Badge variant="outline" className={item.recommended_reorder < 0 ? 'text-red-600' : 'text-blue-600'}>
                          {item.recommended_reorder < 0 ? 'Reduce' : 'Reorder'}: {Math.abs(item.recommended_reorder)}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
