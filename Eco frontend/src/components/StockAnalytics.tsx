
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { OverstockData } from '@/services/overstockService';

interface StockAnalyticsProps {
  data: OverstockData | undefined;
}

export const StockAnalytics = ({ data }: StockAnalyticsProps) => {
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Stock Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Levels Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Stock vs Predicted Demand</CardTitle>
            <CardDescription>Comparing actual stock levels with AI predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="predicted" fill="#3b82f6" name="Predicted Demand" />
                <Bar dataKey="actual" fill="#ef4444" name="Actual Stock" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Overstock by Category</CardTitle>
            <CardDescription>Distribution of overstocking across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#94a3b8" name="Total Items" />
                <Bar dataKey="overstocked" fill="#ef4444" name="Overstocked" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Eco Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Eco Score Distribution</CardTitle>
            <CardDescription>Environmental impact scoring across inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ecoScoreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 1).toFixed(0)}%`}
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
          </CardContent>
        </Card>

        {/* Eco Impact vs Stock Level */}
        <Card>
          <CardHeader>
            <CardTitle>Eco Score vs Stock Efficiency</CardTitle>
            <CardDescription>Relationship between environmental impact and stocking efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockLevelsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ecoScore" stroke="#22c55e" strokeWidth={3} name="Eco Score %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
};
