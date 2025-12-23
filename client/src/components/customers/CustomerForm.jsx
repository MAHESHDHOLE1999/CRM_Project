// // // import { useForm } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { z } from 'zod';
// // // import { useMutation } from '@tanstack/react-query';
// // // import { toast } from 'sonner';
// // // import { useTranslation } from 'react-i18next';
// // // import { Button } from '@/components/ui/button';
// // // import { Input } from '@/components/ui/input';
// // // import { Label } from '@/components/ui/label';
// // // import { Checkbox } from '@/components/ui/checkbox';
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from '@/components/ui/select';
// // // import { customerService } from '@/services/customerService';

// // // const customerSchema = z.object({
// // //   name: z.string().min(1, 'Name is required'),
// // //   phone: z.string().min(10, 'Valid phone number required'),
// // //   address: z.string().optional(),
// // //   checkInDate: z.string().min(1, 'Check-in date required'),
// // //   checkInTime: z.string().min(1, 'Check-in time required'),
// // //   totalAmount: z.number().min(0),
// // //   depositAmount: z.number().min(0),
// // //   givenAmount: z.number().min(0),
// // //   transportRequired: z.boolean(),
// // //   transportCost: z.number().min(0),
// // //   transportLocation: z.string().optional(),
// // //   maintenanceCharges: z.number().min(0),
// // //   fitterName: z.string().optional(),
// // //   status: z.string(),
// // //   notes: z.string().optional()
// // // });

// // // export default function CustomerForm({ customer, onSuccess }) {
// // //   const { t } = useTranslation();

// // //   const {
// // //     register,
// // //     handleSubmit,
// // //     watch,
// // //     setValue,
// // //     formState: { errors }
// // //   } = useForm({
// // //     resolver: zodResolver(customerSchema),
// // //     defaultValues: customer || {
// // //       name: '',
// // //       phone: '',
// // //       address: '',
// // //       checkInDate: new Date().toISOString().split('T')[0],
// // //       checkInTime: '10:00',
// // //       totalAmount: 0,
// // //       depositAmount: 0,
// // //       givenAmount: 0,
// // //       transportRequired: false,
// // //       transportCost: 0,
// // //       transportLocation: '',
// // //       maintenanceCharges: 0,
// // //       fitterName: '',
// // //       status: 'Active',
// // //       notes: ''
// // //     }
// // //   });

// // //   const mutation = useMutation({
// // //     mutationFn: (data) =>
// // //       customer
// // //         ? customerService.update(customer.id, data)
// // //         : customerService.create(data),
// // //     onSuccess: () => {
// // //       toast.success(customer ? 'Customer updated!' : 'Customer created!');
// // //       onSuccess();
// // //     },
// // //     onError: () => {
// // //       toast.error('Failed to save customer');
// // //     }
// // //   });

// // //   const onSubmit = (data) => {
// // //     mutation.mutate(data);
// // //   };

// // //   const transportRequired = watch('transportRequired');

// // //   return (
// // //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //         <div>
// // //           <Label>{t('customer.name')} *</Label>
// // //           <Input {...register('name')} />
// // //           {errors.name && (
// // //             <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
// // //           )}
// // //         </div>

// // //         <div>
// // //           <Label>{t('customer.phone')} *</Label>
// // //           <Input {...register('phone')} />
// // //           {errors.phone && (
// // //             <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
// // //           )}
// // //         </div>

// // //         <div className="md:col-span-2">
// // //           <Label>{t('customer.address')}</Label>
// // //           <Input {...register('address')} />
// // //         </div>

// // //         <div>
// // //           <Label>{t('customer.checkIn')} Date *</Label>
// // //           <Input type="date" {...register('checkInDate')} />
// // //         </div>

// // //         <div>
// // //           <Label>{t('customer.checkInTime')} *</Label>
// // //           <Input type="time" {...register('checkInTime')} />
// // //         </div>

// // //         <div>
// // //           <Label>{t('customer.totalAmount')} *</Label>
// // //           <Input
// // //             type="number"
// // //             {...register('totalAmount', { valueAsNumber: true })}
// // //           />
// // //         </div>

// // //         <div>
// // //           <Label>{t('customer.depositAmount')}</Label>
// // //           <Input
// // //             type="number"
// // //             {...register('depositAmount', { valueAsNumber: true })}
// // //           />
// // //         </div>

// // //         <div>
// // //           <Label>{t('customer.givenAmount')}</Label>
// // //           <Input
// // //             type="number"
// // //             {...register('givenAmount', { valueAsNumber: true })}
// // //           />
// // //         </div>

// // //         <div>
// // //           <Label>{t('customer.maintenanceCharges')}</Label>
// // //           <Input
// // //             type="number"
// // //             {...register('maintenanceCharges', { valueAsNumber: true })}
// // //           />
// // //         </div>

// // //         <div className="flex items-center space-x-2">
// // //           <Checkbox
// // //             id="transport"
// // //             checked={transportRequired}
// // //             onCheckedChange={(checked) => setValue('transportRequired', checked)}
// // //           />
// // //           <Label htmlFor="transport">{t('customer.transport')}</Label>
// // //         </div>

// // //         {transportRequired && (
// // //           <>
// // //             <div>
// // //               <Label>{t('customer.transportCost')}</Label>
// // //               <Input
// // //                 type="number"
// // //                 {...register('transportCost', { valueAsNumber: true })}
// // //               />
// // //             </div>

// // //             <div>
// // //               <Label>{t('customer.transportLocation')}</Label>
// // //               <Input {...register('transportLocation')} />
// // //             </div>
// // //           </>
// // //         )}

// // //         <div>
// // //           <Label>{t('customer.fitterName')}</Label>
// // //           <Input {...register('fitterName')} />
// // //         </div>

// // //         <div>
// // //           <Label>{t('customer.status')}</Label>
// // //           <Select
// // //             value={watch('status')}
// // //             onValueChange={(value) => setValue('status', value)}
// // //           >
// // //             <SelectTrigger>
// // //               <SelectValue />
// // //             </SelectTrigger>
// // //             <SelectContent>
// // //               <SelectItem value="Active">{t('customer.active')}</SelectItem>
// // //               <SelectItem value="Completed">{t('customer.completed')}</SelectItem>
// // //               <SelectItem value="Cancelled">{t('customer.cancelled')}</SelectItem>
// // //             </SelectContent>
// // //           </Select>
// // //         </div>

// // //         <div className="md:col-span-2">
// // //           <Label>Notes</Label>
// // //           <Input {...register('notes')} placeholder="Additional notes..." />
// // //         </div>
// // //       </div>

// // //       <div className="flex justify-end gap-2 pt-4">
// // //         <Button type="submit" disabled={mutation.isPending}>
// // //           {mutation.isPending ? 'Saving...' : t('common.save')}
// // //         </Button>
// // //       </div>
// // //     </form>
// // //   );
// // // }

// // import { useEffect } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { useMutation } from '@tanstack/react-query';
// // import { toast } from 'sonner';
// // import { useTranslation } from 'react-i18next';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Checkbox } from '@/components/ui/checkbox';
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from '@/components/ui/select';
// // import { customerService } from '@/services/customerService';
// // import { Badge } from '@/components/ui/badge';

// // const customerSchema = z.object({
// //   name: z.string().min(1, 'Name is required'),
// //   phone: z.string().min(10, 'Valid phone number required'),
// //   address: z.string().optional(),
// //   checkInDate: z.string().min(1, 'Check-in date required'),
// //   checkInTime: z.string().min(1, 'Check-in time required'),
// //   checkOutDate: z.string().optional(),
// //   checkOutTime: z.string().optional(),
// //   totalAmount: z.number().min(0),
// //   depositAmount: z.number().min(0),
// //   givenAmount: z.number().min(0),
// //   transportRequired: z.boolean(),
// //   transportCost: z.number().min(0),
// //   transportLocation: z.string().optional(),
// //   maintenanceCharges: z.number().min(0),
// //   hourlyRate: z.number().min(0).optional(),
// //   fitterName: z.string().optional(),
// //   status: z.string(),
// //   notes: z.string().optional()
// // });

// // export default function CustomerForm({ customer, onSuccess }) {
// //   const { t } = useTranslation();

// //   const {
// //     register,
// //     handleSubmit,
// //     watch,
// //     setValue,
// //     formState: { errors }
// //   } = useForm({
// //     resolver: zodResolver(customerSchema),
// //     defaultValues: customer || {
// //       name: '',
// //       phone: '',
// //       address: '',
// //       checkInDate: new Date().toISOString().split('T')[0],
// //       checkInTime: '10:00',
// //       checkOutDate: '',
// //       checkOutTime: '',
// //       totalAmount: 0,
// //       depositAmount: 0,
// //       givenAmount: 0,
// //       transportRequired: false,
// //       transportCost: 0,
// //       transportLocation: '',
// //       maintenanceCharges: 0,
// //       hourlyRate: 0,
// //       fitterName: '',
// //       status: 'Active',
// //       notes: ''
// //     }
// //   });

// //   const mutation = useMutation({
// //     mutationFn: (data) =>
// //       customer
// //         ? customerService.update(customer._id, data)
// //         : customerService.create(data),
// //     onSuccess: () => {
// //       toast.success(customer ? 'Customer updated!' : 'Customer created!');
// //       onSuccess();
// //     },
// //     onError: () => {
// //       toast.error('Failed to save customer');
// //     }
// //   });

// //   const onSubmit = (data) => {
// //     mutation.mutate(data);
// //   };

// //   const transportRequired = watch('transportRequired');
// //   const checkInDate = watch('checkInDate');
// //   const checkInTime = watch('checkInTime');
// //   const checkOutDate = watch('checkOutDate');
// //   const checkOutTime = watch('checkOutTime');

// //   // Calculate rental duration
// //   useEffect(() => {
// //     if (checkInDate && checkInTime && checkOutDate && checkOutTime) {
// //       calculateDuration();
// //     }
// //   }, [checkInDate, checkInTime, checkOutDate, checkOutTime]);

// //   const calculateDuration = async () => {
// //     try {
// //       const response = await customerService.calculateDuration({
// //         checkInDate,
// //         checkInTime,
// //         checkOutDate,
// //         checkOutTime
// //       });
      
// //       if (response.data.success) {
// //         const { fullDays, extraHours } = response.data.data;
// //         toast.info(`Duration: ${fullDays} day(s) and ${extraHours} hour(s)`);
// //       }
// //     } catch (error) {
// //       console.error('Error calculating duration:', error);
// //     }
// //   };

// //   // Set default checkout date/time to next day 10:00 AM
// //   const setDefaultCheckout = () => {
// //     if (checkInDate) {
// //       const nextDay = new Date(checkInDate);
// //       nextDay.setDate(nextDay.getDate() + 1);
// //       setValue('checkOutDate', nextDay.toISOString().split('T')[0]);
// //       setValue('checkOutTime', '10:00');
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// //       {/* 24-Hour Cycle Info */}
// //       <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
// //         <div className="flex items-center gap-2">
// //           <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
// //             ⏰ 24-Hour Cycle
// //           </Badge>
// //           <p className="text-sm text-muted-foreground">
// //             Check-in to check-out follows 24-hour cycles (e.g., 10:00 AM to 10:00 AM next day)
// //           </p>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         <div>
// //           <Label>{t('customer.name')} *</Label>
// //           <Input {...register('name')} />
// //           {errors.name && (
// //             <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
// //           )}
// //         </div>

// //         <div>
// //           <Label>{t('customer.phone')} *</Label>
// //           <Input {...register('phone')} />
// //           {errors.phone && (
// //             <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
// //           )}
// //         </div>

// //         <div className="md:col-span-2">
// //           <Label>{t('customer.address')}</Label>
// //           <Input {...register('address')} />
// //         </div>

// //         {/* Check-in Section */}
// //         <div className="md:col-span-2">
// //           <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
// //             <Badge>Check-in Details</Badge>
// //           </h3>
// //         </div>

// //         <div>
// //           <Label>{t('customer.checkIn')} Date *</Label>
// //           <Input type="date" {...register('checkInDate')} />
// //         </div>

// //         <div>
// //           <Label>{t('customer.checkInTime')} *</Label>
// //           <Input 
// //             type="time" 
// //             {...register('checkInTime')} 
// //             defaultValue="10:00"
// //           />
// //           <p className="text-xs text-muted-foreground mt-1">Standard: 10:00 AM</p>
// //         </div>

// //         {/* Check-out Section */}
// //         {customer && (
// //           <>
// //             <div className="md:col-span-2">
// //               <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
// //                 <Badge variant="secondary">Check-out Details</Badge>
// //                 <Button 
// //                   type="button" 
// //                   variant="outline" 
// //                   size="sm"
// //                   onClick={setDefaultCheckout}
// //                 >
// //                   Set Default (Next Day 10:00 AM)
// //                 </Button>
// //               </h3>
// //             </div>

// //             <div>
// //               <Label>{t('customer.checkOut')} Date</Label>
// //               <Input type="date" {...register('checkOutDate')} />
// //             </div>

// //             <div>
// //               <Label>{t('customer.checkOutTime')}</Label>
// //               <Input type="time" {...register('checkOutTime')} />
// //             </div>

// //             <div className="md:col-span-2">
// //               <Label>Hourly Rate (for extra hours beyond 24-hour cycle)</Label>
// //               <Input
// //                 type="number"
// //                 {...register('hourlyRate', { valueAsNumber: true })}
// //                 placeholder="0"
// //               />
// //               <p className="text-xs text-muted-foreground mt-1">
// //                 Charged for hours exceeding 24-hour cycles
// //               </p>
// //             </div>
// //           </>
// //         )}

// //         <div>
// //           <Label>{t('customer.totalAmount')} *</Label>
// //           <Input
// //             type="number"
// //             {...register('totalAmount', { valueAsNumber: true })}
// //           />
// //         </div>

// //         <div>
// //           <Label>{t('customer.depositAmount')}</Label>
// //           <Input
// //             type="number"
// //             {...register('depositAmount', { valueAsNumber: true })}
// //           />
// //         </div>

// //         <div>
// //           <Label>{t('customer.givenAmount')}</Label>
// //           <Input
// //             type="number"
// //             {...register('givenAmount', { valueAsNumber: true })}
// //           />
// //         </div>

// //         <div>
// //           <Label>{t('customer.maintenanceCharges')}</Label>
// //           <Input
// //             type="number"
// //             {...register('maintenanceCharges', { valueAsNumber: true })}
// //           />
// //         </div>

// //         <div className="flex items-center space-x-2">
// //           <Checkbox
// //             id="transport"
// //             checked={transportRequired}
// //             onCheckedChange={(checked) => setValue('transportRequired', checked)}
// //           />
// //           <Label htmlFor="transport">{t('customer.transport')}</Label>
// //         </div>

// //         {transportRequired && (
// //           <>
// //             <div>
// //               <Label>{t('customer.transportCost')}</Label>
// //               <Input
// //                 type="number"
// //                 {...register('transportCost', { valueAsNumber: true })}
// //               />
// //             </div>

// //             <div>
// //               <Label>{t('customer.transportLocation')}</Label>
// //               <Input {...register('transportLocation')} />
// //             </div>
// //           </>
// //         )}

// //         <div>
// //           <Label>{t('customer.fitterName')}</Label>
// //           <Input {...register('fitterName')} />
// //         </div>

// //         <div>
// //           <Label>{t('customer.status')}</Label>
// //           <Select
// //             value={watch('status')}
// //             onValueChange={(value) => setValue('status', value)}
// //           >
// //             <SelectTrigger>
// //               <SelectValue />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="Active">{t('customer.active')}</SelectItem>
// //               <SelectItem value="Completed">{t('customer.completed')}</SelectItem>
// //               <SelectItem value="Cancelled">{t('customer.cancelled')}</SelectItem>
// //             </SelectContent>
// //           </Select>
// //         </div>

// //         <div className="md:col-span-2">
// //           <Label>Notes</Label>
// //           <Input {...register('notes')} placeholder="Additional notes..." />
// //         </div>
// //       </div>

// //       <div className="flex justify-end gap-2 pt-4">
// //         <Button type="submit" disabled={mutation.isPending}>
// //           {mutation.isPending ? 'Saving...' : t('common.save')}
// //         </Button>
// //       </div>
// //     </form>
// //   );
// // }

// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useMutation } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { useTranslation } from 'react-i18next';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { customerService } from '@/services/customerService';
// import ItemSelector from './ItemSelector';

// const customerSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   phone: z.string().min(10, 'Valid phone number required'),
//   address: z.string().optional(),
//   checkInDate: z.string().min(1, 'Check-in date required'),
//   checkInTime: z.string().min(1, 'Check-in time required'),
//   checkOutDate: z.string().optional(),
//   checkOutTime: z.string().optional(),
//   totalAmount: z.number().min(0),
//   depositAmount: z.number().min(0),
//   givenAmount: z.number().min(0),
//   transportRequired: z.boolean(),
//   transportCost: z.number().min(0),
//   transportLocation: z.string().optional(),
//   maintenanceCharges: z.number().min(0),
//   hourlyRate: z.number().min(0).optional(),
//   fitterName: z.string().optional(),
//   status: z.string(),
//   notes: z.string().optional()
// });

// export default function CustomerForm({ customer, onSuccess }) {
//   const { t } = useTranslation();
//   const [selectedItems, setSelectedItems] = useState(customer?.items || []);
//   const [itemsTotal, setItemsTotal] = useState(0);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors }
//   } = useForm({
//     resolver: zodResolver(customerSchema),
//     defaultValues: customer || {
//       name: '',
//       phone: '',
//       address: '',
//       checkInDate: new Date().toISOString().split('T')[0],
//       checkInTime: '10:00',
//       checkOutDate: '',
//       checkOutTime: '',
//       totalAmount: 0,
//       depositAmount: 0,
//       givenAmount: 0,
//       transportRequired: false,
//       transportCost: 0,
//       transportLocation: '',
//       maintenanceCharges: 0,
//       hourlyRate: 0,
//       fitterName: '',
//       status: 'Active',
//       notes: ''
//     }
//   });

//   // Calculate items total whenever items change
//   useEffect(() => {
//     const total = selectedItems.reduce((sum, item) => 
//       sum + (item.quantity * item.price), 0
//     );
//     setItemsTotal(total);
//   }, [selectedItems]);

//   // Auto-update total amount when items, transport, or maintenance change
//   useEffect(() => {
//     const transportCost = watch('transportCost') || 0;
//     const maintenanceCharges = watch('maintenanceCharges') || 0;
//     const newTotal = itemsTotal + transportCost + maintenanceCharges;
//     setValue('totalAmount', newTotal);
//   }, [itemsTotal, watch('transportCost'), watch('maintenanceCharges')]);

//   const mutation = useMutation({
//     mutationFn: (data) => {
//       const payload = {
//         ...data,
//         items: selectedItems.map(item => ({
//           itemId: item.itemId,
//           itemName: item.itemName,
//           quantity: item.quantity,
//           price: item.price
//         }))
//       };
      
//       return customer
//         ? customerService.update(customer._id, payload)
//         : customerService.create(payload);
//     },
//     onSuccess: () => {
//       toast.success(customer ? 'Customer updated!' : 'Customer created!');
//       onSuccess();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to save customer');
//     }
//   });

//   const onSubmit = (data) => {
//     if (selectedItems.length === 0) {
//       toast.error('Please select at least one item');
//       return;
//     }
//     mutation.mutate(data);
//   };

//   const transportRequired = watch('transportRequired');
//   const checkInDate = watch('checkInDate');
//   const checkInTime = watch('checkInTime');
//   const checkOutDate = watch('checkOutDate');
//   const checkOutTime = watch('checkOutTime');

//   // Calculate rental duration
//   useEffect(() => {
//     if (checkInDate && checkInTime && checkOutDate && checkOutTime) {
//       calculateDuration();
//     }
//   }, [checkInDate, checkInTime, checkOutDate, checkOutTime]);

//   const calculateDuration = async () => {
//     try {
//       const response = await customerService.calculateDuration({
//         checkInDate,
//         checkInTime,
//         checkOutDate,
//         checkOutTime
//       });
      
//       if (response.data.success) {
//         const { fullDays, extraHours } = response.data.data;
//         toast.info(`Duration: ${fullDays} day(s) and ${extraHours} hour(s)`);
//       }
//     } catch (error) {
//       console.error('Error calculating duration:', error);
//     }
//   };

//   // Set default checkout date/time to next day 10:00 AM
//   const setDefaultCheckout = () => {
//     if (checkInDate) {
//       const nextDay = new Date(checkInDate);
//       nextDay.setDate(nextDay.getDate() + 1);
//       setValue('checkOutDate', nextDay.toISOString().split('T')[0]);
//       setValue('checkOutTime', '10:00');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       {/* 24-Hour Cycle Info */}
//       <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//         <div className="flex items-center gap-2">
//           <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
//             ⏰ 24-Hour Cycle
//           </Badge>
//           <p className="text-sm text-muted-foreground">
//             Check-in to check-out follows 24-hour cycles (e.g., 10:00 AM to 10:00 AM next day)
//           </p>
//         </div>
//       </div>

//       {/* Customer Information */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label>{t('customer.name')} *</Label>
//             <Input {...register('name')} />
//             {errors.name && (
//               <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
//             )}
//           </div>

//           <div>
//             <Label>{t('customer.phone')} *</Label>
//             <Input {...register('phone')} />
//             {errors.phone && (
//               <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
//             )}
//           </div>

//           <div className="md:col-span-2">
//             <Label>{t('customer.address')}</Label>
//             <Input {...register('address')} />
//           </div>
//         </div>
//       </div>

//       {/* Item Selection */}
//       <div>
//         <ItemSelector 
//           selectedItems={selectedItems} 
//           onItemsChange={setSelectedItems} 
//         />
//       </div>

//       {/* Check-in/Check-out Details */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Check-in Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label>{t('customer.checkIn')} Date *</Label>
//             <Input type="date" {...register('checkInDate')} />
//           </div>

//           <div>
//             <Label>{t('customer.checkInTime')} *</Label>
//             <Input 
//               type="time" 
//               {...register('checkInTime')} 
//               defaultValue="10:00"
//             />
//             <p className="text-xs text-muted-foreground mt-1">Standard: 10:00 AM</p>
//           </div>

//           {customer && (
//             <>
//               <div>
//                 <Label>{t('customer.checkOut')} Date</Label>
//                 <Input type="date" {...register('checkOutDate')} />
//               </div>

//               <div>
//                 <Label>{t('customer.checkOutTime')}</Label>
//                 <div className="flex gap-2">
//                   <Input type="time" {...register('checkOutTime')} className="flex-1" />
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     size="sm"
//                     onClick={setDefaultCheckout}
//                   >
//                     Next Day 10 AM
//                   </Button>
//                 </div>
//               </div>

//               <div className="md:col-span-2">
//                 <Label>Hourly Rate (for extra hours)</Label>
//                 <Input
//                   type="number"
//                   {...register('hourlyRate', { valueAsNumber: true })}
//                   placeholder="0"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Charged for hours exceeding 24-hour cycles
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Payment Information */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label>Items Total (Auto-calculated)</Label>
//             <Input
//               type="number"
//               value={itemsTotal}
//               disabled
//               className="bg-muted font-semibold"
//             />
//           </div>

//           <div>
//             <Label>{t('customer.maintenanceCharges')}</Label>
//             <Input
//               type="number"
//               {...register('maintenanceCharges', { valueAsNumber: true })}
//             />
//           </div>

//           <div className="flex items-center space-x-2 md:col-span-2">
//             <Checkbox
//               id="transport"
//               checked={transportRequired}
//               onCheckedChange={(checked) => setValue('transportRequired', checked)}
//             />
//             <Label htmlFor="transport">{t('customer.transport')}</Label>
//           </div>

//           {transportRequired && (
//             <>
//               <div>
//                 <Label>{t('customer.transportCost')}</Label>
//                 <Input
//                   type="number"
//                   {...register('transportCost', { valueAsNumber: true })}
//                 />
//               </div>

//               <div>
//                 <Label>{t('customer.transportLocation')}</Label>
//                 <Input {...register('transportLocation')} />
//               </div>
//             </>
//           )}

//           <div>
//             <Label>{t('customer.totalAmount')} (Auto-calculated) *</Label>
//             <Input
//               type="number"
//               {...register('totalAmount', { valueAsNumber: true })}
//               className="bg-muted font-bold text-lg"
//               disabled
//             />
//           </div>

//           <div>
//             <Label>{t('customer.depositAmount')}</Label>
//             <Input
//               type="number"
//               {...register('depositAmount', { valueAsNumber: true })}
//             />
//           </div>

//           <div>
//             <Label>{t('customer.givenAmount')}</Label>
//             <Input
//               type="number"
//               {...register('givenAmount', { valueAsNumber: true })}
//             />
//           </div>

//           <div>
//             <Label>Remaining Amount (Auto-calculated)</Label>
//             <Input
//               type="number"
//               value={(watch('totalAmount') || 0) - (watch('givenAmount') || 0)}
//               disabled
//               className="bg-muted font-semibold"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Additional Information */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label>{t('customer.fitterName')}</Label>
//             <Input {...register('fitterName')} />
//           </div>

//           <div>
//             <Label>{t('customer.status')}</Label>
//             <Select
//               value={watch('status')}
//               onValueChange={(value) => setValue('status', value)}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Active">{t('customer.active')}</SelectItem>
//                 <SelectItem value="Completed">{t('customer.completed')}</SelectItem>
//                 <SelectItem value="Cancelled">{t('customer.cancelled')}</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="md:col-span-2">
//             <Label>Notes</Label>
//             <Input {...register('notes')} placeholder="Additional notes..." />
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end gap-2 pt-4 border-t">
//         <Button type="submit" disabled={mutation.isPending} size="lg">
//           {mutation.isPending ? 'Saving...' : t('common.save')}
//         </Button>
//       </div>
//     </form>
//   );
// }

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { customerService } from '@/services/customerService';
import ItemSelector from './ItemSelector';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().optional(),
  checkInDate: z.string().min(1, 'Check-in date required'),
  checkInTime: z.string().min(1, 'Check-in time required'),
  checkOutDate: z.string().optional(),
  checkOutTime: z.string().optional(),
  totalAmount: z.number().min(0),
  depositAmount: z.number().min(0),
  givenAmount: z.number().min(0),
  transportRequired: z.boolean(),
  transportCost: z.number().min(0),
  transportLocation: z.string().optional(),
  maintenanceCharges: z.number().min(0),
  hourlyRate: z.number().min(0).optional(),
  fitterName: z.string().optional(),
  status: z.string(),
  notes: z.string().optional()
});

export default function CustomerForm({ customer, onSuccess }) {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState(customer?.items || []);
  const [itemsTotal, setItemsTotal] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      name: '',
      phone: '',
      address: '',
      checkInDate: new Date().toISOString().split('T')[0],
      checkInTime: '10:00',
      checkOutDate: '',
      checkOutTime: '',
      totalAmount: 0,
      depositAmount: 0,
      givenAmount: 0,
      transportRequired: false,
      transportCost: 0,
      transportLocation: '',
      maintenanceCharges: 0,
      hourlyRate: 0,
      fitterName: '',
      status: 'Active',
      notes: ''
    }
  });

  // Calculate items total whenever items change
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );
    setItemsTotal(total);
  }, [selectedItems]);

  // Auto-update total amount when items, transport, or maintenance change
  useEffect(() => {
    const transportCost = watch('transportCost') || 0;
    const maintenanceCharges = watch('maintenanceCharges') || 0;
    const newTotal = itemsTotal + transportCost + maintenanceCharges;
    setValue('totalAmount', newTotal);
  }, [itemsTotal, watch('transportCost'), watch('maintenanceCharges')]);

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        items: selectedItems.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      return customer
        ? customerService.update(customer._id, payload)
        : customerService.create(payload);
    },
    onSuccess: () => {
      toast.success(customer ? 'Customer updated!' : 'Customer created!');
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save customer');
    }
  });

  const onSubmit = (data) => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }
    mutation.mutate(data);
  };

  const transportRequired = watch('transportRequired');
  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');
  const checkOutTime = watch('checkOutTime');

  // REMOVED AUTOMATIC DURATION CALCULATION - it was causing rate limit issues
  // Users can manually calculate if needed via a button

  // Manual duration calculation function
  const calculateDuration = async () => {
    const checkInTime = watch('checkInTime');
    
    if (!checkInDate || !checkInTime || !checkOutDate || !checkOutTime) {
      toast.error('Please fill in all date and time fields');
      return;
    }

    try {
      const response = await customerService.calculateDuration({
        checkInDate,
        checkInTime,
        checkOutDate,
        checkOutTime
      });
      
      if (response.data.success) {
        const { fullDays, extraHours, totalHours } = response.data.data;
        toast.success(`Duration: ${fullDays} day(s) and ${extraHours} hour(s) (Total: ${totalHours} hours)`);
      }
    } catch (error) {
      console.error('Error calculating duration:', error);
      toast.error('Failed to calculate duration');
    }
  };

  // Set default checkout date/time to next day 10:00 AM
  const setDefaultCheckout = () => {
    if (checkInDate) {
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setValue('checkOutDate', nextDay.toISOString().split('T')[0]);
      setValue('checkOutTime', '10:00');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 24-Hour Cycle Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
            ⏰ 24-Hour Cycle
          </Badge>
          <p className="text-sm text-muted-foreground">
            Check-in to check-out follows 24-hour cycles (e.g., 10:00 AM to 10:00 AM next day)
          </p>
        </div>
      </div>

      {/* Customer Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t('customer.name')} *</Label>
            <Input {...register('name')} />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>{t('customer.phone')} *</Label>
            <Input {...register('phone')} />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>{t('customer.address')}</Label>
            <Input {...register('address')} />
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

      {/* Check-in/Check-out Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Check-in Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t('customer.checkIn')} Date *</Label>
            <Input type="date" {...register('checkInDate')} />
          </div>

          <div>
            <Label>{t('customer.checkInTime')} *</Label>
            <Input 
              type="time" 
              {...register('checkInTime')} 
              defaultValue="10:00"
            />
            <p className="text-xs text-muted-foreground mt-1">Standard: 10:00 AM</p>
          </div>

          {customer && (
            <>
              <div>
                <Label>{t('customer.checkOut')} Date</Label>
                <Input type="date" {...register('checkOutDate')} />
              </div>

              <div>
                <Label>{t('customer.checkOutTime')}</Label>
                <div className="flex gap-2">
                  <Input type="time" {...register('checkOutTime')} className="flex-1" />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={setDefaultCheckout}
                  >
                    Next Day 10 AM
                  </Button>
                </div>
              </div>

              {/* Manual Calculate Duration Button */}
              <div className="md:col-span-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={calculateDuration}
                  className="w-full"
                >
                  Calculate Rental Duration
                </Button>
              </div>

              <div className="md:col-span-2">
                <Label>Hourly Rate (for extra hours)</Label>
                <Input
                  type="number"
                  {...register('hourlyRate', { valueAsNumber: true })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Charged for hours exceeding 24-hour cycles
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Items Total (Auto-calculated)</Label>
            <Input
              type="number"
              value={itemsTotal}
              disabled
              className="bg-muted font-semibold"
            />
          </div>

          <div>
            <Label>{t('customer.maintenanceCharges')}</Label>
            <Input
              type="number"
              {...register('maintenanceCharges', { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center space-x-2 md:col-span-2">
            <Checkbox
              id="transport"
              checked={transportRequired}
              onCheckedChange={(checked) => setValue('transportRequired', checked)}
            />
            <Label htmlFor="transport">{t('customer.transport')}</Label>
          </div>

          {transportRequired && (
            <>
              <div>
                <Label>{t('customer.transportCost')}</Label>
                <Input
                  type="number"
                  {...register('transportCost', { valueAsNumber: true })}
                />
              </div>

              <div>
                <Label>{t('customer.transportLocation')}</Label>
                <Input {...register('transportLocation')} />
              </div>
            </>
          )}

          <div>
            <Label>{t('customer.totalAmount')} (Auto-calculated) *</Label>
            <Input
              type="number"
              {...register('totalAmount', { valueAsNumber: true })}
              className="bg-muted font-bold text-lg"
              disabled
            />
          </div>

          <div>
            <Label>{t('customer.depositAmount')}</Label>
            <Input
              type="number"
              {...register('depositAmount', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label>{t('customer.givenAmount')}</Label>
            <Input
              type="number"
              {...register('givenAmount', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label>Remaining Amount (Auto-calculated)</Label>
            <Input
              type="number"
              value={(watch('totalAmount') || 0) - (watch('givenAmount') || 0)}
              disabled
              className="bg-muted font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t('customer.fitterName')}</Label>
            <Input {...register('fitterName')} />
          </div>

          <div>
            <Label>{t('customer.status')}</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">{t('customer.active')}</SelectItem>
                <SelectItem value="Completed">{t('customer.completed')}</SelectItem>
                <SelectItem value="Cancelled">{t('customer.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Notes</Label>
            <Input {...register('notes')} placeholder="Additional notes..." />
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