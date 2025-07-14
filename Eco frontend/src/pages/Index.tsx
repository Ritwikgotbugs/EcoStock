
import { AlertsPanel } from '@/components/AlertsPanel';
import { InventoryGrid } from '@/components/InventoryGrid';
import { StockAnalytics } from '@/components/StockAnalytics';
import { StockManager } from '@/components/StockManager';
import { TrendAnalysis } from '@/components/TrendAnalysis';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useOverstockData } from '@/hooks/useOverstockData';
import { AlertTriangle, BarChart3, CheckCircle, Cloud, Droplet, Factory, Hourglass, Info, Leaf, MapPin, Package, Package as PackageIcon, Recycle, RefreshCcw, ShoppingCart, TrendingUp, Truck } from 'lucide-react';

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
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg rounded-xl transition-transform hover:scale-[1.03] hover:shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Items</p>
                  <p className="text-3xl font-extrabold tracking-tight">{totalItems}</p>
                </div>
                <div className="bg-white/20 rounded-full p-2">
                  <Package className="h-7 w-7 text-blue-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg rounded-xl transition-transform hover:scale-[1.03] hover:shadow-xl">
            <CardContent className="p-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between cursor-help">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Overstocked and Understocked</p>
                        <p className="text-3xl font-extrabold tracking-tight">{overstockedItems}</p>
                      </div>
                      <div className="bg-white/20 rounded-full p-2">
                        <AlertTriangle className="h-7 w-7 text-orange-200" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md p-4 bg-white rounded-xl shadow-xl border text-gray-800">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <span className="font-bold text-lg text-orange-700">How is this calculated?</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-semibold flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-blue-500" /> Seasonal Demand</div>
                        <ul className="list-disc list-inside ml-5">
                          <li>Winter, summer, etc.</li>
                          <li>Tags: <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">cold</span>, <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">jacket</span>, <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">winter</span></li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-pink-500" /> Trending Demand</div>
                        <ul className="list-disc list-inside ml-5">
                          <li>Scraped keywords, sentiment analysis</li>
                          <li>Trend score, timestamp, region, language</li>
                          <li>Past trends, mapping (e.g. <span className="font-mono">GTA6 → PS5</span>)</li>
                          <li>Confidence (mapping & trend)</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2 mb-1"><Leaf className="h-4 w-4 text-green-600" /> Safety Buffer Stock</div>
                        <ul className="list-disc list-inside ml-5">
                          <li>Formula varies by shelf life</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2 mb-1"><Package className="h-4 w-4 text-purple-600" /> Shelf Life & Stocking</div>
                        <ul className="list-disc list-inside ml-5">
                          <li>Consumables: FIFO queues for optimization</li>
                        </ul>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg rounded-xl transition-transform hover:scale-[1.03] hover:shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-emerald-100 text-sm font-medium">Avg Eco Score</p>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Info className="h-4 w-4 text-emerald-200 cursor-pointer hover:text-white transition" />
                      </HoverCardTrigger>
                      <HoverCardContent className="max-w-md p-4 bg-white rounded-xl shadow-xl border text-gray-800 w-80">
                        <div className="mb-2 flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-lg text-green-700">How is Eco Score calculated?</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2"><RefreshCcw className="h-4 w-4 mt-0.5 text-blue-500" /> <span><b>Recyclability & Renewability</b>: Preference for materials that can be recycled or renewed.</span></li>
                          <li className="flex items-start gap-2"><Cloud className="h-4 w-4 mt-0.5 text-gray-500" /> <span><b>Emission per kg</b>: Lower greenhouse gas emissions per kilogram are better.</span></li>
                          <li className="flex items-start gap-2"><Factory className="h-4 w-4 mt-0.5 text-yellow-600" /> <span><b>Manufacturing Energy & Emission</b>: Considers energy use and emissions during production, including location impact.</span></li>
                          <li className="flex items-start gap-2"><Droplet className="h-4 w-4 mt-0.5 text-blue-400" /> <span><b>Water Consumption</b>: Fewer litres used in production is better.</span></li>
                          <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-emerald-500" /> <span><b>Distance Travelled</b>: Shorter supply chain distances (in km) reduce impact.</span></li>
                          <li className="flex items-start gap-2"><Truck className="h-4 w-4 mt-0.5 text-orange-500" /> <span><b>Mode of Transport</b>: Eco-friendly transport (rail, sea) scores higher than air or road.</span></li>
                          <li className="flex items-start gap-2"><PackageIcon className="h-4 w-4 mt-0.5 text-purple-500" /> <span><b>Packaging Material</b>: Sustainable, minimal, or recycled packaging is preferred.</span></li>
                          <li className="flex items-start gap-2"><Recycle className="h-4 w-4 mt-0.5 text-green-600" /> <span><b>Is Biodegradable</b>: Biodegradable products score higher.</span></li>
                          <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-green-500" /> <span><b>Is Recyclable Packaging</b>: Packaging that can be recycled improves the score.</span></li>
                          <li className="flex items-start gap-2"><Hourglass className="h-4 w-4 mt-0.5 text-gray-700" /> <span><b>Product Decomposability Time</b>: Faster decomposition is better for the environment.</span></li>
                        </ul>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <p className="text-3xl font-extrabold tracking-tight">{(avgEcoScore * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-white/20 rounded-full p-2">
                  <Leaf className="h-7 w-7 text-emerald-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg rounded-xl transition-transform hover:scale-[1.03] hover:shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Critical Alerts</p>
                  <p className="text-3xl font-extrabold tracking-tight">{criticalAlerts}</p>
                </div>
                <div className="bg-white/20 rounded-full p-2">
                  <TrendingUp className="h-7 w-7 text-purple-200" />
                </div>
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
            <InventoryGrid data={overstockData} isLoading={isLoading} onRefresh={refetch} />
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
