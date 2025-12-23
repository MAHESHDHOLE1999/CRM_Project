import { useState, useEffect } from 'react';
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
import { bookingService } from '@/services/bookingService';
import ItemSelector from '../customers/ItemSelector';

const bookingSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  bookingDate: z.string().min(1, 'Booking date required'),
  startTime: z.string().min(1, 'Start time required'),
  endTime: z.string().min(1, 'End time required'),
  totalAmount: z.number().min(0),
  depositAmount: z.number().min(0),
  givenAmount: z.number().min(0),
  status: z.enum(['Pending', 'Confirmed', 'Cancelled']),
  notes: z.string().optional()
});

export default function BookingForm({ booking, onSuccess }) {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState(
    booking?.items ? JSON.parse(booking.items) : []
  );
  const [itemsTotal, setItemsTotal] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: booking || {
      customerName: '',
      phone: '',
      email: '',
      bookingDate: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '18:00',
      totalAmount: 0,
      depositAmount: 0,
      givenAmount: 0,
      status: 'Pending',
      notes: ''
    }
  });

  // Calculate items total
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );
    setItemsTotal(total);
    setValue('totalAmount', total);
  }, [selectedItems]);

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        items: JSON.stringify(selectedItems)
      };
      
      return booking
        ? bookingService.update(booking._id, payload)
        : bookingService.create(payload);
    },
    onSuccess: () => {
      toast.success(booking ? 'Booking updated!' : 'Booking created!');
      onSuccess();
    },
    onError: () => {
      toast.error('Failed to save booking');
    }
  });

  const onSubmit = (data) => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }
    mutation.mutate(data);
  };

  const totalAmount = watch('totalAmount') || 0;
  const givenAmount = watch('givenAmount') || 0;
  const remainingAmount = totalAmount - givenAmount;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Information */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Customer Name *</Label>
            <Input {...register('customerName')} placeholder="John Doe" />
            {errors.customerName && (
              <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <Label>Phone Number *</Label>
            <Input {...register('phone')} placeholder="9876543210" />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Email (Optional)</Label>
            <Input {...register('email')} type="email" placeholder="customer@example.com" />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Item Selection */}
      <div>
        <ItemSelector 
          selectedItems={selectedItems} 
          onItemsChange={setSelectedItems} 
        />
      </div>

      {/* Booking Details */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Booking Date *</Label>
            <Input type="date" {...register('bookingDate')} />
            {errors.bookingDate && (
              <p className="text-sm text-red-500 mt-1">{errors.bookingDate.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Start Time *</Label>
              <Input type="time" {...register('startTime')} />
            </div>
            <div>
              <Label>End Time *</Label>
              <Input type="time" {...register('endTime')} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Total Amount (Auto-calculated) *</Label>
            <Input
              type="number"
              {...register('totalAmount', { valueAsNumber: true })}
              className="bg-muted font-bold text-lg"
              disabled
            />
          </div>

          <div>
            <Label>Deposit Amount</Label>
            <Input
              type="number"
              {...register('depositAmount', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div>
            <Label>Amount Given</Label>
            <Input
              type="number"
              {...register('givenAmount', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div>
            <Label>Remaining Amount</Label>
            <Input
              type="number"
              value={remainingAmount}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Notes</Label>
            <Input {...register('notes')} placeholder="Additional notes or requirements..." />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="submit" disabled={mutation.isPending} size="lg">
          {mutation.isPending ? 'Saving...' : t('common.save')}
        </Button>
      </div>
    </form>
  );
}