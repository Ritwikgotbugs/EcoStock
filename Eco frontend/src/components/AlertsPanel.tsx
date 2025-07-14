
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Leaf, Clock, CheckCircle } from 'lucide-react';
import { OverstockData } from '@/services/overstockService';

interface AlertsPanelProps {
  data: OverstockData | undefined;
}

export const AlertsPanel = ({ data }: AlertsPanelProps) => {
  if (!data?.overstock_items) {
    return <div className="text-center py-8">No alerts data available.</div>;
  }

  const criticalAlerts = data.overstock_items.filter(item => 
    item.anomaly_flag && item.eco_score < 0.5
  );

  const seasonalAlerts = data.overstock_items.filter(item => 
    item.anomaly_reason.includes('season') || item.anomaly_reason.includes('winter')
  );

  const ecoAlerts = data.overstock_items.filter(item => 
    item.eco_score < 0.4 && item.actual_stock > item.predicted_demand * 1.5
  );

  const allAlerts = [
    ...criticalAlerts.map(item => ({
      type: 'critical',
      icon: AlertTriangle,
      color: 'red',
      title: 'Critical Overstock',
      message: `${item.name} (${item.sku}) has high overstock with low eco-score`,
      item: item,
      timestamp: '2 hours ago'
    })),
    ...seasonalAlerts.map(item => ({
      type: 'seasonal',
      icon: Clock,
      color: 'yellow',
      title: 'Seasonal Risk',
      message: `${item.name} may face seasonal demand decline`,
      item: item,
      timestamp: '4 hours ago'
    })),
    ...ecoAlerts.map(item => ({
      type: 'eco',
      icon: Leaf,
      color: 'orange',
      title: 'Environmental Impact',
      message: `${item.name} has poor eco-score and excess inventory`,
      item: item,
      timestamp: '1 day ago'
    }))
  ].slice(0, 6); // Limit to 6 most recent alerts

  const getAlertStyles = (color: string) => {
    switch (color) {
      case 'red':
        return 'border-red-200 bg-red-50';
      case 'yellow':
        return 'border-yellow-200 bg-yellow-50';
      case 'orange':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'orange':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Real-Time Alerts
            </CardTitle>
            <CardDescription>
              AI-powered anomaly detection and recommendations
            </CardDescription>
          </div>
          <Badge variant="destructive">{allAlerts.length} Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {allAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <div className="text-lg font-medium text-gray-900">All Clear!</div>
            <div className="text-sm text-gray-600">No critical alerts at this time</div>
          </div>
        ) : (
          <div className="space-y-3">
            {allAlerts.map((alert, index) => {
              const IconComponent = alert.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getAlertStyles(alert.color)} transition-all duration-200 hover:shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${getIconColor(alert.color)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      
                      {/* Alert Details */}
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Stock: {alert.item.actual_stock} units</span>
                        <span>Demand: {alert.item.predicted_demand} units</span>
                        <span>Eco: {(alert.item.eco_score * 100).toFixed(0)}%</span>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Create Action
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs h-7 text-gray-500">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Alert Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-red-600">{criticalAlerts.length}</div>
              <div className="text-xs text-gray-600">Critical</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">{seasonalAlerts.length}</div>
              <div className="text-xs text-gray-600">Seasonal</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">{ecoAlerts.length}</div>
              <div className="text-xs text-gray-600">Eco Impact</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
