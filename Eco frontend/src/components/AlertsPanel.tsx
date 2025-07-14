
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { OverstockData } from '@/services/overstockService';
import { AlertTriangle, CheckCircle, Clock, Leaf } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

interface AlertsPanelProps {
  data: OverstockData | undefined;
}

export const AlertsPanel = ({ data }: AlertsPanelProps) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [detailsItem, setDetailsItem] = useState<any | null>(null);
  const [actionItem, setActionItem] = useState<any | null>(null);
  const { toast } = useToast();

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
      key: `critical-${item.sku}`,
      type: 'critical',
      icon: AlertTriangle,
      color: 'red',
      title: 'Critical Overstock',
      message: `${item.name} (${item.sku}) has high overstock with low eco-score`,
      item: item,
      timestamp: '2 hours ago'
    })),
    ...seasonalAlerts.map(item => ({
      key: `seasonal-${item.sku}`,
      type: 'seasonal',
      icon: Clock,
      color: 'yellow',
      title: 'Seasonal Risk',
      message: `${item.name} may face seasonal demand decline`,
      item: item,
      timestamp: '4 hours ago'
    })),
    ...ecoAlerts.map(item => ({
      key: `eco-${item.sku}`,
      type: 'eco',
      icon: Leaf,
      color: 'orange',
      title: 'Environmental Impact',
      message: `${item.name} has poor eco-score and excess inventory`,
      item: item,
      timestamp: '1 day ago'
    }))
  ].filter(alert => !dismissed.has(alert.key)).slice(0, 6); // Limit to 6 most recent alerts

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
                  key={alert.key}
                  className={`p-4 rounded-lg border ${getAlertStyles(alert.color)} transition-all duration-200 hover:shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${getIconColor(alert.color)}`} />
                    <div className="flex-1">
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
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setDetailsItem(alert.item)}>
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setActionItem(alert.item)}>
                          Create Action
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs h-7 text-gray-500" onClick={() => {
                          setDismissed(prev => new Set(prev).add(alert.key));
                          toast({ title: 'Alert Dismissed', description: alert.title });
                        }}>
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
      {/* Details Dialog */}
      <Dialog open={!!detailsItem} onOpenChange={open => !open && setDetailsItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>Full details for {detailsItem?.name}</DialogDescription>
          </DialogHeader>
          {detailsItem && (
            <div className="space-y-2">
              <div><b>SKU:</b> {detailsItem.sku}</div>
              <div><b>Region:</b> {detailsItem.region}</div>
              <div><b>Stock:</b> {detailsItem.actual_stock}</div>
              <div><b>Demand:</b> {detailsItem.predicted_demand}</div>
              <div><b>Eco Score:</b> {(detailsItem.eco_score * 100).toFixed(0)}%</div>
              <div><b>Category:</b> {detailsItem.category}</div>
              <div><b>Status:</b> {detailsItem.anomaly_flag ? 'Anomaly' : 'Normal'}</div>
              <div><b>Reason:</b> {detailsItem.anomaly_reason}</div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsItem(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Create Action Dialog */}
      <Dialog open={!!actionItem} onOpenChange={open => !open && setActionItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Action</DialogTitle>
            <DialogDescription>Log a follow-up or assign a task for {actionItem?.name}</DialogDescription>
          </DialogHeader>
          {actionItem && (
            <form onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const note = (form.elements.namedItem('note') as HTMLInputElement).value;
              toast({ title: 'Action Created', description: `Action for ${actionItem.name}: ${note}` });
              setActionItem(null);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Action/Note</label>
                <input name="note" className="w-full border rounded px-2 py-1" placeholder="Describe the action or note..." required />
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
                <Button type="button" variant="outline" onClick={() => setActionItem(null)}>Cancel</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
