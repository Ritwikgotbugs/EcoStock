
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingUp, Leaf, ShoppingCart, Package, BarChart3, Eye } from 'lucide-react';
import { InventoryGrid } from '@/components/InventoryGrid';
import { StockAnalytics } from '@/components/StockAnalytics';
import { StockManager } from '@/components/StockManager';
import { TrendAnalysis } from '@/components/TrendAnalysis';
import { AlertsPanel } from '@/components/AlertsPanel';
import { useOverstockData } from '@/hooks/useOverstockData';

const Index = () => {
  const { data: overstockData, isLoading, refetch } = useOverstockData();

  const totalItems = overstockData?.overstock_items?.length || 0;
  const overstockedItems = overstockData?.overstock_items?.filter(item => item.anomaly_flag)?.length || 0;
  const avgEcoScore = overstockData?.overstock_items?.reduce((acc, item) => acc + item.eco_score, 0) / totalItems || 0;
  const criticalAlerts = overstockData?.overstock_items?.filter(item => item.anomaly_flag && item.eco_score < 0.3)?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
                <p className="text-sm text-gray-600">Walmart Inventory Intelligence</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              Manager Portal
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Items</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <Package className="h-6 w-6 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Overstocked</p>
                  <p className="text-2xl font-bold">{overstockedItems}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Avg Eco Score</p>
                  <p className="text-2xl font-bold">{(avgEcoScore * 100).toFixed(0)}%</p>
                </div>
                <Leaf className="h-6 w-6 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Critical Alerts</p>
                  <p className="text-2xl font-bold">{criticalAlerts}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="manager" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Manage Stock
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <InventoryGrid data={overstockData} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StockAnalytics data={overstockData} />
              <AlertsPanel data={overstockData} />
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <TrendAnalysis data={overstockData} />
          </TabsContent>

          <TabsContent value="manager">
            <StockManager onStockUpdated={refetch} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
