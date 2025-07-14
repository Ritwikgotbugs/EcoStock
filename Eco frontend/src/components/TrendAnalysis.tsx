import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { overstockService } from '@/services/overstockService';
import { Activity, Tag, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TrendAnalysisProps {
  data: any | undefined; // Changed to any as OverstockData is removed
}

export const TrendAnalysis = ({ data }: TrendAnalysisProps) => {
  const [seasonalTrends, setSeasonalTrends] = useState<any[]>([]);
  const [trendingBuzzwords, setTrendingBuzzwords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      overstockService.getSeasonalTrends(),
      overstockService.getTrendingBuzzwords()
    ])
      .then(([seasonal, buzzwords]) => {
        setSeasonalTrends(seasonal);
        setTrendingBuzzwords(buzzwords);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load trend data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8">Loading trend data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!seasonalTrends.length && !trendingBuzzwords.length) {
    return <div className="text-center py-8">No trend data available.</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero/USP Section */}
      <div className="rounded-xl bg-emerald-600/90 p-6 text-white shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">Real-Time Stock Optimization</h2>
          <p className="text-base opacity-90">Our AI dynamically adjusts your stock based on trending buzzwords and seasonal changes—so you never miss a sales opportunity or overstock.</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {trendingBuzzwords.slice(0, 3).map((buzz, i) => (
            <Badge key={i} className="bg-white/20 border-white/30 text-white text-sm px-2 py-1 flex items-center gap-1">
              <Tag className="h-4 w-4" /> {buzz.word}
            </Badge>
          ))}
        </div>
      </div>

      {/* Trending Buzzwords Table */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 text-lg">
            <TrendingUp className="h-5 w-5" /> Trending Buzzwords Table
          </CardTitle>
          <CardDescription className="text-gray-700 text-sm">Key trending words, their impact, and associated items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-lg">
              <thead className="bg-emerald-100">
                <tr>
                  <th className="px-4 py-2 text-left">Word</th>
                  <th className="px-4 py-2 text-left">Impact</th>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {trendingBuzzwords.map((buzz, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="px-4 py-2 font-semibold text-emerald-700">{buzz.word}</td>
                    <td className="px-4 py-2">{buzz.impact}</td>
                    <td className="px-4 py-2">{buzz.item}</td>
                    <td className="px-4 py-2 text-gray-600">{buzz.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-gray-500">Monitor these buzzwords to anticipate demand spikes and optimize stock allocation.</div>
        </CardContent>
      </Card>

      {/* Seasonal Trends Chart */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 text-lg">
            <Activity className="h-5 w-5" /> Seasonal Demand Patterns
          </CardTitle>
          <CardDescription className="text-gray-700 text-sm">See how seasonality is affecting your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={seasonalTrends} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="month" fontSize={13} tick={{ fill: '#059669' }} />
              <YAxis fontSize={13} tick={{ fill: '#059669' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #059669', fontSize: 13 }} />
              <Area type="monotone" dataKey="winter_items" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.25} name="Winter Items" />
              <Area type="monotone" dataKey="summer_items" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.25} name="Summer Items" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-gray-500">Use these patterns to plan for seasonal overstock or shortages and adjust procurement accordingly.</div>
        </CardContent>
      </Card>
    </div>
  );
};
