import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { itemService } from '@/services/itemService';

export default function ItemSelector({ selectedItems = [], onItemsChange }) {
  const [items, setItems] = useState(selectedItems);

  const { data: availableItems, isLoading } = useQuery({
    queryKey: ['available-items'],
    queryFn: () => itemService.getAll({ inStock: 'true' })
  });

  const allItems = availableItems?.data?.data?.items || [];

  useEffect(() => {
    onItemsChange(items);
  }, [items]);

  const addItem = () => {
    setItems([...items, { itemId: '', itemName: '', quantity: 1, price: 0, availableQty: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    
    if (field === 'itemId') {
      const selectedItem = allItems.find(item => item._id === value);
      if (selectedItem) {
        newItems[index] = {
          itemId: selectedItem._id,
          itemName: selectedItem.name,
          quantity: 1,
          price: selectedItem.price,
          availableQty: selectedItem.availableQuantity
        };
      }
    } else {
      newItems[index][field] = value;
    }
    
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Select Items</Label>
        <Button type="button" onClick={addItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No items selected. Click "Add Item" to select items for this booking.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  <div className="md:col-span-2">
                    <Label className="text-xs">Item *</Label>
                    <Select
                      value={item.itemId}
                      onValueChange={(value) => updateItem(index, 'itemId', value)}
                    >
                      <SelectTrigger style={{outline: 'none', boxShadow: 'none'}}>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading ? (
                          <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                        ) : allItems.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">No items available</div>
                        ) : (
                          allItems.map((availableItem) => (
                            <SelectItem key={availableItem._id} value={availableItem._id}>
                              {availableItem.name} 
                              <span className="text-xs text-muted-foreground ml-2">
                                (Available: {availableItem.availableQuantity})
                              </span>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Quantity *</Label>
                    <Input
                      type="number"
                      min="1"
                      max={item.availableQty || 999}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      style={{outline: 'none', boxShadow: 'none'}}
                    />
                    {item.availableQty > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Max: {item.availableQty}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs">Price per unit</Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      style={{outline: 'none', boxShadow: 'none'}}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Subtotal</Label>
                    <div className="h-10 flex items-center font-semibold">
                      ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {item.quantity > item.availableQty && item.availableQty > 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    ⚠️ Warning: Requested quantity ({item.quantity}) exceeds available quantity ({item.availableQty})
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <Card className="bg-muted">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Items Total:</span>
              <span className="text-2xl font-bold">
                ₹{calculateTotal().toLocaleString('en-IN')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}