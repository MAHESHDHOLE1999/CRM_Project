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

// ✅ Helper functions for date/time
const getTodayDate = () => new Date().toISOString().split("T")[0];

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const bookingSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  registrationDate: z.string().min(1, 'Registration date is required'), // ✅ NEW
  registrationTime: z.string().min(1, 'Registration time is required'), // ✅ NEW
  bookingDate: z.string().min(1, 'Booking date is required'),
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
      registrationDate: getTodayDate(), // ✅ Current date when form loads
      registrationTime: getCurrentTime(), // ✅ Current time when form loads
      bookingDate: getTodayDate(), // ✅ Can be changed to future date
      startTime: '10:00',
      endTime: '18:00',
      totalAmount: '',
      depositAmount: '',
      givenAmount: '',
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
  }, [selectedItems, setValue]);

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
      toast.success(
        booking 
          ? t('booking.bookingUpdated') || 'Booking updated!'
          : t('booking.bookingCreated') || 'Booking created!'
      );
      onSuccess();
    },
    onError: () => {
      toast.error(t('booking.failedSaveBooking') || 'Failed to save booking');
    }
  });

  const onSubmit = (data) => {
    if (selectedItems.length === 0) {
      toast.error(t('customer.selectAtLeastOneItem') || 'Please select at least one item');
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
        <h3 className="text-lg font-semibold mb-3">{t('customer.customerInfo') || 'Customer Information'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t('booking.customerName') || 'Customer Name'} *</Label>
            <Input 
              {...register('customerName')} 
              placeholder={t('booking.customerName') || 'John Doe'}
              className="border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0" 
              style={{outline: 'none', boxShadow: 'none'}} 
            />
            {errors.customerName && (
              <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <Label>{t('booking.phone') || 'Phone Number'} *</Label>
            <Input 
              {...register('phone')} 
              placeholder="9876543210" 
              className="border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0" 
              style={{outline: 'none', boxShadow: 'none'}} 
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>{t('booking.email') || 'Email (Optional)'}</Label>
            <Input 
              {...register('email')} 
              type="email" 
              placeholder="customer@example.com" 
              className="border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0" 
              style={{outline: 'none', boxShadow: 'none'}}
            />
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

      {/* ✅ REGISTRATION DATE & TIME - When booking was registered */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          📝 {t('booking.registrationDetails') || 'Registration Details'} (When booking was registered)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label className="text-sm font-semibold mb-1">
              {t('booking.registrationDate') || 'Registration Date'} *
            </Label>
            <input
              type="date"
              {...register('registrationDate')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              required
            />
            {errors.registrationDate && (
              <p className="text-sm text-red-500 mt-1">{errors.registrationDate.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-semibold mb-1">
              {t('booking.registrationTime') || 'Registration Time'} *
            </Label>
            <input
              type="time"
              {...register('registrationTime')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              required
            />
            {errors.registrationTime && (
              <p className="text-sm text-red-500 mt-1">{errors.registrationTime.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ BOOKING DATE & TIME - When customer wants the items */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          📅 {t('booking.bookingDetails') || 'Booking Details'} (When customer needs items)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label className="text-sm font-semibold mb-1">
              {t('booking.date') || 'Booking Date'} *
            </Label>
            <input
              type="date"
              {...register('bookingDate')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              required
            />
            {errors.bookingDate && (
              <p className="text-sm text-red-500 mt-1">{errors.bookingDate.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <Label className="text-sm font-semibold mb-1">
                {t('booking.startTime') || 'Start Time'} *
              </Label>
              <input
                type="time"
                {...register('startTime')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                required
              />
              {errors.startTime && (
                <p className="text-sm text-red-500 mt-1">{errors.startTime.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <Label className="text-sm font-semibold mb-1">
                {t('booking.endTime') || 'End Time'} *
              </Label>
              <input
                type="time"
                {...register('endTime')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                required
              />
              {errors.endTime && (
                <p className="text-sm text-red-500 mt-1">{errors.endTime.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('customer.paymentInfo') || 'Payment Information'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t('customer.totalAmount') || 'Total Amount'} ({t('common.autoCalculated') || 'Auto-calculated'}) *</Label>
            <Input
              type="number"
              {...register('totalAmount', { valueAsNumber: true })}
              className="bg-muted font-bold text-lg"
              disabled
            />
          </div>

          <div>
            <Label>{t('customer.depositAmount') || 'Deposit Amount'}</Label>
            <Input
              type="text"
              {...register('depositAmount', { valueAsNumber: true })}
              placeholder="0"
              className="border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0" 
              style={{outline: 'none', boxShadow: 'none'}}
            />
          </div>

          <div>
            <Label>{t('booking.amountGiven') || 'Amount Given'}</Label>
            <Input
              type="text"
              {...register('givenAmount', { valueAsNumber: true })}
              placeholder="0"
              className="border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0" 
              style={{outline: 'none', boxShadow: 'none'}}
            />
          </div>

          <div>
            <Label>{t('customer.remainingAmount') || 'Remaining Amount'}</Label>
            <Input
              type="number"
              value={remainingAmount}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label>{t('customer.status') || 'Status'}</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger className="border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">{t('booking.pending') || 'Pending'}</SelectItem>
                <SelectItem value="Confirmed">{t('booking.confirmed') || 'Confirmed'}</SelectItem>
                <SelectItem value="Cancelled">{t('booking.cancelled') || 'Cancelled'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>{t('common.notes') || 'Notes'}</Label>
            <Input 
              {...register('notes')} 
              placeholder={t('booking.additionalNotesPlaceholder') || 'Additional notes or requirements...'} 
              className="border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0" 
              style={{outline: 'none', boxShadow: 'none'}} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="submit" disabled={mutation.isPending} size="lg">
          {mutation.isPending ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              {t('common.saving') || 'Saving...'}
            </>
          ) : (
            t('common.save') || 'Save'
          )}
        </Button>
      </div>
    </form>
  );
}