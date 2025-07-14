
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { overstockService } from '@/services/overstockService';

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
      
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
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Package className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Bulk Import</div>
                <div className="text-xs text-gray-600">Upload CSV file</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Generate Alerts</div>
                <div className="text-xs text-gray-600">Create stock alerts</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Audit Trail</div>
                <div className="text-xs text-gray-600">View change history</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

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
