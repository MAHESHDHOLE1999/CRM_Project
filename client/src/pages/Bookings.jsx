import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { bookingService } from '@/services/bookingService';
import BookingForm from '@/components/bookings/BookingForm';
import { format } from 'date-fns';

export default function Bookings() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [bookingToConfirm, setBookingToConfirm] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', { search, status: statusFilter }],
    queryFn: () => bookingService.getAll({ search, status: statusFilter })
  });

  const { data: statsData } = useQuery({
    queryKey: ['booking-stats'],
    queryFn: () => bookingService.getStats()
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => bookingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['booking-stats']);
      toast.success(t('common.deleteSuccess'));
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
      setIsDeleting(false);
    },
    onError: () => {
      toast.error(t('common.deleteError'));
      setIsDeleting(false);
    }
  });

  const confirmMutation = useMutation({
    mutationFn: ({ id, convertToCustomer }) => bookingService.confirm(id, convertToCustomer),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['booking-stats']);
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['dashboard-stats']);
      
      if (response.data.data.customer) {
        toast.success(t('booking.bookingConfirmed'));
      } else {
        toast.success(t('booking.bookingConfirmed'));
      }
      setConfirmDialogOpen(false);
      setBookingToConfirm(null);
    },
    onError: () => {
      toast.error(t('common.savingError'));
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => bookingService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['booking-stats']);
      toast.success(t('booking.bookingCancelled'));
    }
  });

  const bookings = data?.data?.data?.bookings || [];
  const stats = statsData?.data?.data || {};

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (bookingToDelete) {
      setIsDeleting(true);
      deleteMutation.mutate(bookingToDelete._id);
    }
  };

  const handleAddNew = () => {
    setSelectedBooking(null);
    setDialogOpen(true);
  };

  const handleConfirmClick = (booking) => {
    setBookingToConfirm(booking);
    setConfirmDialogOpen(true);
  };

  const handleConfirmBooking = (convertToCustomer) => {
    if (bookingToConfirm) {
      confirmMutation.mutate({ 
        id: bookingToConfirm._id, 
        convertToCustomer 
      });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: 'default',
      Confirmed: 'secondary',
      Cancelled: 'destructive'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  // Stats cards configuration
  const statsCards = [
    {
      titleKey: 'booking.totalBookings',
      value: stats.totalBookings || 0,
      colorClass: 'text-blue-600'
    },
    {
      titleKey: 'booking.pending',
      value: stats.pendingBookings || 0,
      colorClass: 'text-orange-600'
    },
    {
      titleKey: 'booking.confirmed',
      value: stats.confirmedBookings || 0,
      colorClass: 'text-green-600'
    },
    {
      titleKey: 'booking.cancelled',
      value: stats.cancelledBookings || 0,
      colorClass: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('booking.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('booking.manageBookings') || 'Manage future bookings and reservations'}
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t('booking.addNew')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(card.titleKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.colorClass}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('booking.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 focus:outline-none focus:ring-0"
              style={{outline: 'none', boxShadow: 'none'}}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.selectOption')}</SelectItem>
              <SelectItem value="Pending">{t('booking.pending')}</SelectItem>
              <SelectItem value="Confirmed">{t('booking.confirmed')}</SelectItem>
              <SelectItem value="Cancelled">{t('booking.cancelled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('booking.customerName')}</TableHead>
                <TableHead>{t('customer.phone')}</TableHead>
                <TableHead>{t('booking.date')}</TableHead>
                <TableHead>{t('booking.time')}</TableHead>
                <TableHead>{t('customer.totalAmount')}</TableHead>
                <TableHead>{t('customer.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">{booking.customerName}</TableCell>
                    <TableCell>{booking.phone}</TableCell>
                    <TableCell>
                      {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      {booking.startTime} - {booking.endTime}
                    </TableCell>
                    <TableCell>{t("common.rs")}{booking.totalAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {booking.status === 'Pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleConfirmClick(booking)}
                              title={t('booking.confirmBooking')}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => cancelMutation.mutate(booking._id)}
                              title={t('common.cancel')}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(booking)}
                          title={t('common.edit')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(booking)}
                          title={t('common.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* =====================================================
          Booking Form Dialog
          ===================================================== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedBooking ? t('common.edit') : t('booking.addNew')}
            </DialogTitle>
          </DialogHeader>
          <BookingForm
            booking={selectedBooking}
            onSuccess={() => {
              setDialogOpen(false);
              queryClient.invalidateQueries(['bookings']);
              queryClient.invalidateQueries(['booking-stats']);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* =====================================================
          Confirm Booking Dialog
          ===================================================== */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('booking.confirmBooking')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('booking.confirmBookingMessage') || 'Do you want to convert this booking into an active customer record?'}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-semibold">{bookingToConfirm?.customerName}</p>
                <p className="text-sm text-muted-foreground">{bookingToConfirm?.phone}</p>
                <p className="text-sm mt-2">
                  {t('booking.date')}: {bookingToConfirm && format(new Date(bookingToConfirm.bookingDate), 'dd/MM/yyyy')}
                </p>
                <p className="text-sm">
                  {t('customer.totalAmount')}: ₹{bookingToConfirm?.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{t('booking.convertToCustomer')}: {t('booking.convertMessage') || 'Items will be marked as rented'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span>{t('booking.justConfirm')}: {t('booking.justConfirmMessage') || 'Keeps as booking only'}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => handleConfirmBooking(false)}
            >
              {t('booking.justConfirm')}
            </Button>
            <AlertDialogAction
              onClick={() => handleConfirmBooking(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              {t('booking.convertToCustomer')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* =====================================================
          Professional Delete Confirmation Dialog
          ===================================================== */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-lg">{t('common.deleteConfirmation')}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="mt-4">
              <div className="space-y-4">
                <p>{t('common.deleteWarning') || 'This action cannot be undone. Please be certain.'}</p>
                
                {bookingToDelete && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">{t('booking.customerName')}</p>
                        <p className="font-semibold text-slate-900">{bookingToDelete.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('booking.date')}</p>
                        <p className="font-semibold text-slate-900">
                          {format(new Date(bookingToDelete.bookingDate), 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('customer.totalAmount')}</p>
                        <p className="font-semibold text-slate-900">
                          ₹{bookingToDelete.totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    {t('common.deleteWarning2') || 'Once deleted, this booking cannot be recovered.'}
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {t('common.deleting') || 'Deleting...'}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete')}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}