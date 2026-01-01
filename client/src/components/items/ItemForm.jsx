import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { AlertDialog, AlertDialogDescription } from '../ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { itemService } from '@/services/itemService';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameMarathi: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  quantityToAdd: z.number().min(0, 'Quantity must be positive').optional(),
  status: z.enum(['Available', 'InUse', 'NotAvailable'])
});

export default function ItemForm({ item, onSuccess }) {
  const { t } = useTranslation();
  const [showQuantityBreakdown, setShowQuantityBreakdown] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: item ? {
      name: item.name || '',
      nameMarathi: item.nameMarathi || '',
      description: item.description || '',
      category: item.category || '',
      price: item.price || 0,
      quantityToAdd: 0,
      status: item.status || 'Available'
    } : {
      name: '',
      nameMarathi: '',
      description: '',
      category: '',
      price: 0,
      quantityToAdd: 0,
      status: 'Available'
    }
  });

  const quantityToAdd = watch('quantityToAdd');

  const quantityBreakdown = useMemo(() => {
    if (!item) return null;

    const previousTotal = item.totalQuantity || 0;
    const addingQuantity = quantityToAdd || 0;
    const newTotal = previousTotal + addingQuantity;
    const previousAvailable = item.availableQuantity || 0;
    const previousRented = item.rentedQuantity || 0;
    const newAvailable = previousAvailable + addingQuantity;

    return {
      previousTotal,
      addingQuantity,
      newTotal,
      previousAvailable,
      previousRented,
      newAvailable,
      hasChanges: addingQuantity > 0
    };
  }, [item, quantityToAdd]);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (item) {
        // For update, send the quantity to add separately
        const updatePayload = {
          name: data.name,
          nameMarathi: data.nameMarathi,
          description: data.description,
          category: data.category,
          price: data.price,
          status: data.status,
          ...(data.quantityToAdd > 0 && { quantityToAdd: data.quantityToAdd })
        };
        return itemService.update(item._id, updatePayload);
      } else {
        // For create, quantityToAdd becomes totalQuantity
        return itemService.create({
          name: data.name,
          nameMarathi: data.nameMarathi,
          description: data.description,
          category: data.category,
          price: data.price,
          totalQuantity: data.quantityToAdd || 1,
          status: data.status
        });
      }
    },
    onSuccess: () => {
      const successMsg = item
        ? quantityBreakdown?.hasChanges
          ? `Item updated! Added ${quantityToAdd} unit(s)`
          : 'Item updated successfully!'
        : 'Item created successfully!';
      toast.success(successMsg);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save item');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{t('items.name')} (English) *</Label>
          <Input
            {...register('name')}
            placeholder="e.g., Tent 10x10"
            className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>{t('items.name')} (Marathi)</Label>
          <Input
            {...register('nameMarathi')}
            placeholder="e.g., तंबू 10x10"
            className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
        </div>

        <div className="md:col-span-2">
          <Label>{t('items.description')}</Label>
          <Input
            {...register('description')}
            placeholder="Item description..."
            className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
        </div>

        <div>
          <Label>{t('items.category')}</Label>
          <Input
            {...register('category')}
            placeholder="e.g., Tents, Chairs, Tables"
            className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
        </div>

        <div>
          <Label>{t('items.price')} (per item) *</Label>
          <Input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder="0"
            className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          {errors.price && (
            <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label>
            {item ? 'Quantity to Add *' : `${t('items.totalQuantity')} *`}
          </Label>
          <Input
            type="number"
            {...register('quantityToAdd', { valueAsNumber: true })}
            placeholder="0"
            min="0"
            className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          {errors.quantityToAdd && (
            <p className="text-sm text-red-500 mt-1">
              {errors.quantityToAdd.message}
            </p>
          )}
        </div>

        {/* Quantity Breakdown for Existing Items */}
        {item && quantityBreakdown && (
          <>
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setShowQuantityBreakdown(!showQuantityBreakdown)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showQuantityBreakdown ? '▼' : '▶'} View Quantity Breakdown
              </button>
            </div>

            {showQuantityBreakdown && (
              <Card className="md:col-span-2 bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="font-semibold text-sm text-gray-700 mb-3">
                      Quantity Summary
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Previous Total</p>
                          <p className="text-lg font-bold text-gray-900">
                            {quantityBreakdown.previousTotal}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">
                            Previously Available
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {quantityBreakdown.previousAvailable}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Currently Rented</p>
                          <p className="text-lg font-bold text-orange-600">
                            {quantityBreakdown.previousRented}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Adding Now</p>
                          <p className="text-lg font-bold text-blue-600">
                            +{quantityBreakdown.addingQuantity}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-blue-200 pt-3 mt-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">New Total Quantity</p>
                          <p className="text-2xl font-bold text-blue-700">
                            {quantityBreakdown.newTotal}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">New Available</p>
                          <p className="text-2xl font-bold text-green-600">
                            {quantityBreakdown.newAvailable}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Read-only quantity fields for existing items */}
        {item && (
          <>
            <div>
              <Label>Available Quantity</Label>
              <Input
                type="number"
                value={item.availableQuantity || 0}
                disabled
                className="bg-muted text-gray-700 font-semibold"
              />
            </div>
            <div>
              <Label>Rented Quantity</Label>
              <Input
                type="number"
                value={item.rentedQuantity || 0}
                disabled
                className="bg-muted text-gray-700 font-semibold"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <Label>{t('items.status')}</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value)}
            disabled={item && item.rentedQuantity > 0}
          >
            <SelectTrigger className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0"
              style={{ outline: 'none', boxShadow: 'none' }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">{t('items.available')}</SelectItem>
              <SelectItem value="InUse">{t('items.inUse')}</SelectItem>
              <SelectItem value="NotAvailable">
                {t('items.notAvailable')}
              </SelectItem>
            </SelectContent>
          </Select>
          {item && item.rentedQuantity > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Status is auto-managed based on rental status
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : t('common.save')}
        </Button>
      </div>
    </form>
  );
}