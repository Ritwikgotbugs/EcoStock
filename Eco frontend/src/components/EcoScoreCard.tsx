
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from "@/components/ui/progress";
import { overstockService } from '@/services/overstockService';
import { CheckCircle, Cloud, Droplet, Factory, Hourglass, Info, Leaf, MapPin, Package, Recycle, RefreshCcw, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EcoScoreCardProps {
  data: any; // Changed to any as OverstockData is removed
}

export const EcoScoreCard = ({ data }: EcoScoreCardProps) => {
  const [ecoScores, setEcoScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    overstockService.getEcoScores()
      .then(scores => {
        setEcoScores(scores);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load eco scores');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8">Loading eco data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!ecoScores.length) return <div className="text-center py-8">No eco data available.</div>;

  // Calculate average and distribution from real ecoScores
  const avgEcoScore = ecoScores.reduce((acc, score) => acc + score.value, 0) / ecoScores.length;
  const highEcoItems = ecoScores.filter(score => score.value > 0.7).length;
  const lowEcoItems = ecoScores.filter(score => score.value < 0.4).length;

  // Optionally, calculate ecoMetrics from ecoScores if possible, else remove that section
  // For now, just hide the detailed metrics if not available from backend

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Leaf className="h-5 w-5" />
            Sustainability Overview
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="h-4 w-4 text-green-500 cursor-pointer hover:text-green-700 transition" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="font-semibold mb-2 flex items-center gap-2 text-green-800">
                  <Leaf className="h-4 w-4" /> Eco Score Parameters
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><RefreshCcw className="h-4 w-4 mt-0.5 text-blue-500" /> <span><b>Recyclability & Renewability</b>: Preference for materials that can be recycled or renewed.</span></li>
                  <li className="flex items-start gap-2"><Cloud className="h-4 w-4 mt-0.5 text-gray-500" /> <span><b>Emission per kg</b>: Lower greenhouse gas emissions per kilogram are better.</span></li>
                  <li className="flex items-start gap-2"><Factory className="h-4 w-4 mt-0.5 text-yellow-600" /> <span><b>Manufacturing Energy & Emission</b>: Considers energy use and emissions during production, including location impact.</span></li>
                  <li className="flex items-start gap-2"><Droplet className="h-4 w-4 mt-0.5 text-blue-400" /> <span><b>Water Consumption</b>: Fewer litres used in production is better.</span></li>
                  <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-emerald-500" /> <span><b>Distance Travelled</b>: Shorter supply chain distances (in km) reduce impact.</span></li>
                  <li className="flex items-start gap-2"><Truck className="h-4 w-4 mt-0.5 text-orange-500" /> <span><b>Mode of Transport</b>: Eco-friendly transport (rail, sea) scores higher than air or road.</span></li>
                  <li className="flex items-start gap-2"><Package className="h-4 w-4 mt-0.5 text-purple-500" /> <span><b>Packaging Material</b>: Sustainable, minimal, or recycled packaging is preferred.</span></li>
                  <li className="flex items-start gap-2"><Recycle className="h-4 w-4 mt-0.5 text-green-600" /> <span><b>Is Biodegradable</b>: Biodegradable products score higher.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-green-500" /> <span><b>Is Recyclable Packaging</b>: Packaging that can be recycled improves the score.</span></li>
                  <li className="flex items-start gap-2"><Hourglass className="h-4 w-4 mt-0.5 text-gray-700" /> <span><b>Product Decomposability Time</b>: Faster decomposition is better for the environment.</span></li>
                </ul>
              </HoverCardContent>
            </HoverCard>
          </CardTitle>
          <CardDescription className="text-green-700">
            Environmental impact analysis of current inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Eco Score */}
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {(avgEcoScore * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-green-800 font-medium">Overall Eco Score</div>
            <Progress value={avgEcoScore * 100} className="mt-2 h-2" />
          </div>

          {/* Eco Score Distribution */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-bold text-green-600">{highEcoItems}</div>
              <div className="text-xs text-gray-600">High Eco Score</div>
              <Badge className="mt-1 bg-green-500 text-white text-xs">70%+</Badge>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{ecoScores.length - highEcoItems - lowEcoItems}</div>
              <div className="text-xs text-gray-600">Medium Eco Score</div>
              <Badge className="mt-1 bg-yellow-500 text-white text-xs">40-70%</Badge>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-bold text-red-600">{lowEcoItems}</div>
              <div className="text-xs text-gray-600">Low Eco Score</div>
              <Badge className="mt-1 bg-red-500 text-white text-xs">&lt;40%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Optionally, remove or update the detailed metrics and alerts section if not available from backend */}
    </div>
  );
};
