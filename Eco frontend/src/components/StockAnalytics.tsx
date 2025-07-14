
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OverstockData } from '@/services/overstockService';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertsPanel } from './AlertsPanel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface StockAnalyticsProps {
  data: OverstockData | undefined;
}

export const StockAnalytics = ({ data }: StockAnalyticsProps) => {
  const [activeTab, setActiveTab] = useState('stock');
  if (!data?.overstock_items) {
    return <div className="text-center py-8">No analytics data available.</div>;
  }

  // Prepare data for charts
  const stockLevelsData = data.overstock_items.map(item => ({
    name: item.name.split(' ').slice(0, 2).join(' '),
    actual: item.actual_stock,
    predicted: item.predicted_demand,
    ecoScore: item.eco_score * 100
  }));

  const categoryData = data.overstock_items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = { count: 0, overstock: 0 };
    }
    acc[category].count++;
    if (item.anomaly_flag) acc[category].overstock++;
    return acc;
  }, {} as Record<string, { count: number; overstock: number }>);

  const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
    name: category,
    total: data.count,
    overstocked: data.overstock,
    percentage: (data.overstock / data.count * 100).toFixed(1)
  }));

  const ecoScoreDistribution = data.overstock_items.reduce((acc, item) => {
    const scoreRange = item.eco_score > 0.8 ? 'Excellent (80-100%)' : 
                      item.eco_score > 0.6 ? 'Good (60-80%)' : 
                      item.eco_score > 0.4 ? 'Fair (40-60%)' : 'Poor (0-40%)';
    acc[scoreRange] = (acc[scoreRange] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ecoScoreData = Object.entries(ecoScoreDistribution).map(([range, count]) => ({
    name: range,
    value: count
  }));

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Inventory Analytics</h2>
      <p className="text-gray-600 mb-6">Key insights and visualizations for your inventory health and sustainability.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.overstock_items.filter(item => !item.anomaly_flag).length}
            </div>
            <div className="text-sm text-blue-800">Optimally Stocked Items</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.overstock_items.filter(item => item.eco_score > 0.7).length}
            </div>
            <div className="text-sm text-green-800">High Eco Score Items</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(data.overstock_items.reduce((acc, item) => acc + (item.actual_stock - item.predicted_demand), 0))}
            </div>
            <div className="text-sm text-purple-800">Excess Units Total</div>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Analytics Visualizations</CardTitle>
          <CardDescription>Switch between different inventory insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid grid-cols-4 gap-2">
              <TabsTrigger value="stock">Stock vs Demand</TabsTrigger>
              <TabsTrigger value="category">Overstock by Category</TabsTrigger>
              <TabsTrigger value="eco">Eco Score Distribution</TabsTrigger>
              <TabsTrigger value="efficiency">Eco vs Efficiency</TabsTrigger>
            </TabsList>
            <TabsContent value="stock">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockLevelsData} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="predicted" fill="#3b82f6" name="Predicted Demand" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="#ef4444" name="Actual Stock" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-gray-500">Products with actual stock far above predicted demand may indicate overstocking.</div>
            </TabsContent>
            <TabsContent value="category">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryChartData} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#94a3b8" name="Total Items" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overstocked" fill="#ef4444" name="Overstocked" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-gray-500">Focus on categories with high overstocked ratios to optimize inventory.</div>
            </TabsContent>
            <TabsContent value="eco">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ecoScoreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ecoScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-gray-500">Aim for more items in the "Good" and "Excellent" eco score ranges.</div>
            </TabsContent>
            <TabsContent value="efficiency">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockLevelsData} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="ecoScore" stroke="#22c55e" strokeWidth={3} name="Eco Score %" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-gray-500">Higher eco scores with optimal stock levels indicate sustainable inventory management.</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Separator />
      
    </div>
  );
};
