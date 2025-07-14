
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { overstockService } from '@/services/overstockService';
import { AlertTriangle, CheckCircle, Package, Plus } from 'lucide-react';
import { useRef, useState } from 'react';

interface StockManagerProps {
  onStockUpdated: () => void;
}

export const StockManager = ({ onStockUpdated }: StockManagerProps) => {
  const { toast } = useToast();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState<{
    action: string;
    details: string;
    onConfirm: () => void;
  } | null>(null);

  const [newItem, setNewItem] = useState({
    sku: '',
    name: '',
    region: '',
    predicted_demand: '',
    actual_stock: '',
    category: '',
    eco_score: ''
  });

  const [stockUpdate, setStockUpdate] = useState({
    sku: '',
    newStock: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAudit, setShowAudit] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const handleAddItem = async () => {
    if (!newItem.sku || !newItem.name || !newItem.actual_stock) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setVerificationRequired({
      action: "Add New Item",
      details: `Adding "${newItem.name}" (${newItem.sku}) with ${newItem.actual_stock} units to ${newItem.region} region`,
      onConfirm: async () => {
        setIsAddingItem(true);
        try {
          await overstockService.addItem({
            sku: newItem.sku,
            name: newItem.name,
            region: newItem.region,
            predicted_demand: parseInt(newItem.predicted_demand) || 0,
            actual_stock: parseInt(newItem.actual_stock),
            eco_score: parseFloat(newItem.eco_score) || 0.5,
            category: newItem.category,
            safety_buffer: Math.floor(parseInt(newItem.actual_stock) * 0.1),
            eco_multiplier: 1.0,
            recommended_reorder: 0,
            anomaly_flag: false,
            anomaly_reason: "Newly added item"
          });

          toast({
            title: "Item Added Successfully",
            description: `${newItem.name} has been added to inventory`,
          });
          setNewItem({ sku: '', name: '', region: '', predicted_demand: '', actual_stock: '', category: '', eco_score: '' });
          onStockUpdated();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to add item to inventory",
            variant: "destructive",
          });
        } finally {
          setIsAddingItem(false);
          setVerificationRequired(null);
        }
      }
    });
  };

  const handleUpdateStock = async () => {
    if (!stockUpdate.sku || !stockUpdate.newStock) {
      toast({
        title: "Validation Error",
        description: "Please provide SKU and new stock amount",
        variant: "destructive",
      });
      return;
    }

    setVerificationRequired({
      action: "Update Stock Level",
      details: `Updating stock for ${stockUpdate.sku} to ${stockUpdate.newStock} units`,
      onConfirm: async () => {
        setIsUpdatingStock(true);
        try {
          await overstockService.updateStock(stockUpdate.sku, parseInt(stockUpdate.newStock));
          
          toast({
            title: "Stock Updated Successfully",
            description: `Stock level for ${stockUpdate.sku} updated to ${stockUpdate.newStock} units`,
          });
          setStockUpdate({ sku: '', newStock: '' });
          onStockUpdated();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update stock level",
            variant: "destructive",
          });
        } finally {
          setIsUpdatingStock(false);
          setVerificationRequired(null);
        }
      }
    });
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
      const headers = headerLine.split(',').map(h => h.trim());
      const items = lines.map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((h, i) => { obj[h] = values[i]; });
        if (obj.actual_stock) obj.actual_stock = Number(obj.actual_stock);
        if (obj.predicted_demand) obj.predicted_demand = Number(obj.predicted_demand);
        if (obj.safety_buffer) obj.safety_buffer = Number(obj.safety_buffer);
        if (obj.eco_score) obj.eco_score = Number(obj.eco_score);
        if (obj.eco_multiplier) obj.eco_multiplier = Number(obj.eco_multiplier);
        if (obj.recommended_reorder) obj.recommended_reorder = Number(obj.recommended_reorder);
        if (obj.anomaly_flag) obj.anomaly_flag = obj.anomaly_flag === 'true' || obj.anomaly_flag === '1';
        if (obj.shelf_life_days) obj.shelf_life_days = Number(obj.shelf_life_days);
        if (obj.trend_score) obj.trend_score = Number(obj.trend_score);
        if (obj.seasonal_factor) obj.seasonal_factor = Number(obj.seasonal_factor);
        return obj;
      });
      await overstockService.bulkAddItems(items);
      toast({ title: 'Bulk upload successful', description: `${items.length} items added.` });
      onStockUpdated();
    } catch (err) {
      toast({ title: 'Bulk upload failed', description: String(err), variant: 'destructive' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
      <div className="mb-4 flex items-center gap-4">
        <Button onClick={() => fileInputRef.current?.click()} variant="outline">Upload CSV</Button>
        <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSVUpload} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Item
            </CardTitle>
            <CardDescription>
              Add a new product to the inventory management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  placeholder="WM-CAT-001"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Product Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={newItem.region} onValueChange={(value) => setNewItem({ ...newItem, region: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                    <SelectItem value="Central">Central</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actual_stock">Initial Stock *</Label>
                <Input
                  id="actual_stock"
                  type="number"
                  placeholder="100"
                  value={newItem.actual_stock}
                  onChange={(e) => setNewItem({ ...newItem, actual_stock: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="predicted_demand">Predicted Demand</Label>
                <Input
                  id="predicted_demand"
                  type="number"
                  placeholder="80"
                  value={newItem.predicted_demand}
                  onChange={(e) => setNewItem({ ...newItem, predicted_demand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eco_score">Eco Score (0-1)</Label>
                <Input
                  id="eco_score"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.75"
                  value={newItem.eco_score}
                  onChange={(e) => setNewItem({ ...newItem, eco_score: e.target.value })}
                />
              </div>
            </div>

            <Button 
              onClick={handleAddItem} 
              disabled={isAddingItem}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isAddingItem ? "Adding Item..." : "Add to Inventory"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Update Stock Level
            </CardTitle>
            <CardDescription>
              Modify existing stock quantities with manager approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="update_sku">Product SKU</Label>
              <Input
                id="update_sku"
                placeholder="Enter SKU (e.g., WM-WINTER-001)"
                value={stockUpdate.sku}
                onChange={(e) => setStockUpdate({ ...stockUpdate, sku: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new_stock">New Stock Quantity</Label>
              <Input
                id="new_stock"
                type="number"
                placeholder="Enter new stock amount"
                value={stockUpdate.newStock}
                onChange={(e) => setStockUpdate({ ...stockUpdate, newStock: e.target.value })}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Manager Verification Required</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    All stock changes require manager approval before processing
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleUpdateStock} 
              disabled={isUpdatingStock}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {isUpdatingStock ? "Updating Stock..." : "Request Stock Update"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common inventory management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => fileInputRef.current?.click()}>
              <Package className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Bulk Import</div>
                <div className="text-xs text-gray-600">Upload CSV file</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => { setShowAlerts(true); toast({ title: 'Alerts Generated', description: 'AI-powered alerts have been generated.' }); }}>
              <AlertTriangle className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Generate Alerts</div>
                <div className="text-xs text-gray-600">Create stock alerts</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => setShowAudit(true)}>
              <CheckCircle className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Audit Trail</div>
                <div className="text-xs text-gray-600">View change history</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Audit Trail Dialog */}
      <Dialog open={showAudit} onOpenChange={setShowAudit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audit Trail</DialogTitle>
            <DialogDescription>Recent inventory changes and actions</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full text-sm border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b last:border-b-0">
                  <td className="px-4 py-2 whitespace-nowrap text-gray-500">2024-06-10 14:32</td>
                  <td className="px-4 py-2 flex items-center gap-2"><Plus className="h-4 w-4 text-green-600" /> Added</td>
                  <td className="px-4 py-2">50 units of <span className="font-semibold">Winter Jacket</span> (SKU: WM-WINTER-001)</td>
                </tr>
                <tr className="border-b last:border-b-0">
                  <td className="px-4 py-2 whitespace-nowrap text-gray-500">2024-06-10 13:10</td>
                  <td className="px-4 py-2 flex items-center gap-2"><Package className="h-4 w-4 text-blue-600" /> Updated</td>
                  <td className="px-4 py-2">Stock for <span className="font-semibold">Organic Apples</span> (SKU: WM-FOOD-002) to 120 units</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-500">2024-06-09 18:45</td>
                  <td className="px-4 py-2 flex items-center gap-2"><Package className="h-4 w-4 text-purple-600" /> Bulk Upload</td>
                  <td className="px-4 py-2">10 new items added via CSV</td>
                </tr>
              </tbody>
            </table>
            <div className="text-gray-400 text-xs mt-2">(This is a placeholder. Connect to real audit logs for production.)</div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAudit(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Alerts Dialog (optional, just closes) */}
      <Dialog open={showAlerts} onOpenChange={setShowAlerts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alerts Generated</DialogTitle>
            <DialogDescription>AI-powered alerts have been generated for your inventory.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowAlerts(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!verificationRequired} onOpenChange={() => setVerificationRequired(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Manager Verification Required
            </DialogTitle>
            <DialogDescription>
              This action requires manager approval before processing.
            </DialogDescription>
          </DialogHeader>
          
          {verificationRequired && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium text-gray-900">{verificationRequired.action}</div>
                <div className="text-sm text-gray-600 mt-1">{verificationRequired.details}</div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge variant="secondary">Manager ID Required</Badge>
                <span>Please confirm your identity to proceed</span>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setVerificationRequired(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={verificationRequired?.onConfirm}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Approve & Execute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
