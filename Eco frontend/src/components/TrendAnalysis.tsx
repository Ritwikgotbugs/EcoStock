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
    <div className="space-y-8">
      {/* Hero/USP Section */}
      <div className="rounded-xl bg-emerald-600/90 p-6 text-white shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Real-Time Stock Optimization</h2>
          <p className="text-lg font-medium opacity-90">Our AI dynamically adjusts your stock based on trending buzzwords and seasonal changes—so you never miss a sales opportunity or overstock.</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {trendingBuzzwords.slice(0, 3).map((buzz, i) => (
            <Badge key={i} className="bg-white/20 border-white/30 text-white text-base px-3 py-1 flex items-center gap-1">
              <Tag className="h-4 w-4" /> {buzz.word}
            </Badge>
          ))}
        </div>
      </div>

      {/* Trends Impact Panel */}
      <Card className="border-emerald-200 bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <TrendingUp className="h-5 w-5" /> Trending Buzzwords Impact
          </CardTitle>
          <CardDescription className="text-gray-700">How trending topics and seasons are changing your stock numbers right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingBuzzwords.map((buzz, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-emerald-50/60 rounded-lg p-4 border border-emerald-100 mb-2">
                <div className="flex items-center gap-2 mb-2 md:mb-0">
                  <Badge className="bg-emerald-600 text-white font-semibold px-2 py-1 text-sm"><Tag className="h-4 w-4 mr-1 inline" />{buzz.word}</Badge>
                  <span className="text-gray-800 font-medium">{buzz.item}</span>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className="text-emerald-700 font-bold text-lg">{buzz.impact}</span>
                  <span className="text-xs text-gray-600">{buzz.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Trends Chart */}
      <Card className="border-emerald-200 bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Activity className="h-5 w-5" /> Seasonal Demand Patterns
          </CardTitle>
          <CardDescription className="text-gray-700">See how seasonality is affecting your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={seasonalTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="winter_items" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.25} name="Winter Items" />
              <Area type="monotone" dataKey="summer_items" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.25} name="Summer Items" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
