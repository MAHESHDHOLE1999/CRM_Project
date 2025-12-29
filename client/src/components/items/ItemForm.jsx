import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
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
import { itemService } from '@/services/itemService';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameMarathi: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  totalQuantity: z.number().min(1, 'Quantity must be at least 1'),
  status: z.enum(['Available', 'InUse', 'NotAvailable'])
});

export default function ItemForm({ item, onSuccess }) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: item || {
      name: '',
      nameMarathi: '',
      description: '',
      category: '',
      price: 0,
      totalQuantity: 1,
      status: 'Available'
    }
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      item
        ? itemService.update(item._id, data)
        : itemService.create(data),
    onSuccess: () => {
      toast.success(item ? 'Item updated!' : 'Item created!');
      onSuccess();
    },
    onError: () => {
      toast.error('Failed to save item');
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
          <Input {...register('name')} placeholder="e.g., Tent 10x10" className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}/>
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>{t('items.name')} (Marathi)</Label>
          <Input {...register('nameMarathi')} placeholder="e.g., तंबू 10x10" className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}/>
        </div>

        <div className="md:col-span-2">
          <Label>{t('items.description')}</Label>
          <Input {...register('description')} placeholder="Item description..." className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}/>
        </div>

        <div>
          <Label>{t('items.category')}</Label>
          <Input {...register('category')} placeholder="e.g., Tents, Chairs, Tables" className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}/>
        </div>

        <div>
          <Label>{t('items.price')} (per item) *</Label>
          <Input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder="0"
            className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}
          />
          {errors.price && (
            <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label>{t('items.totalQuantity')} *</Label>
          <Input
            type="number"
            {...register('totalQuantity', { valueAsNumber: true })}
            placeholder="1"
            min="1"
            className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}
          />
          {errors.totalQuantity && (
            <p className="text-sm text-red-500 mt-1">{errors.totalQuantity.message}</p>
          )}
        </div>

        {item && (
          <>
            <div>
              <Label>Available Quantity</Label>
              <Input
                type="number"
                value={item.availableQuantity || 0}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Rented Quantity</Label>
              <Input
                type="number"
                value={item.rentedQuantity || 0}
                disabled
                className="bg-muted"
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
            className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}
          >
            <SelectTrigger className="border border-gray-300 bg-transparent focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">{t('items.available')}</SelectItem>
              <SelectItem value="InUse">{t('items.inUse')}</SelectItem>
              <SelectItem value="NotAvailable">{t('items.notAvailable')}</SelectItem>
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