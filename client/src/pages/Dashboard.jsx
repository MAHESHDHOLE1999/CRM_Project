// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { 
//   Users, 
//   Calendar, 
//   DollarSign, 
//   TrendingUp, 
//   Activity,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Package,
//   ArrowRight
// } from 'lucide-react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { customerService } from '@/services/customerService';
// import { reportService } from '@/services/reportService';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { format } from 'date-fns';

// export default function Dashboard() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [period, setPeriod] = useState('month');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const { data: enhancedStats, isLoading: statsLoading } = useQuery({
//     queryKey: ['enhanced-dashboard-stats'],
//     queryFn: () => customerService.getEnhancedStats(),
//     refetchInterval: 30000 // Refresh every 30 seconds
//   });

//   const { data: analytics, isLoading: analyticsLoading } = useQuery({
//     queryKey: ['dashboard-analytics', period],
//     queryFn: () => customerService.getAnalytics(period)
//   });

//   // ADD THIS: Fetch financial report data for revenue metrics
//   const { data: financialReport, isLoading: financialLoading } = useQuery({
//     queryKey: ['dashboard-financial-report', period, startDate, endDate],
//     queryFn: () => {
//       const today = new Date();
//       let start, end;

//       if (period === 'custom' && startDate && endDate) {
//         start = startDate;
//         end = endDate;
//       } else {
//         switch (period) {
//           case 'day':
//             start = end = today.toISOString().split('T')[0];
//             break;
//           case 'week':
//             const weekAgo = new Date(today);
//             weekAgo.setDate(weekAgo.getDate() - 7);
//             start = weekAgo.toISOString().split('T')[0];
//             end = today.toISOString().split('T')[0];
//             break;
//           case 'month':
//             start = new Date(today.getFullYear(), today.getMonth(), 1)
//               .toISOString()
//               .split('T')[0];
//             end = today.toISOString().split('T')[0];
//             break;
//           case 'quarter':
//             const quarter = Math.floor(today.getMonth() / 3);
//             start = new Date(today.getFullYear(), quarter * 3, 1)
//               .toISOString()
//               .split('T')[0];
//             end = today.toISOString().split('T')[0];
//             break;
//           case 'year':
//             start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
//             end = today.toISOString().split('T')[0];
//             break;
//           default:
//             start = new Date(today.getFullYear(), today.getMonth(), 1)
//               .toISOString()
//               .split('T')[0];
//             end = today.toISOString().split('T')[0];
//         }
//       }

//       return reportService.getFinancialReport({ startDate: start, endDate: end });
//     }
//   });

//   const statsData = enhancedStats?.data?.data || {};
//   const analyticsData = analytics?.data?.data || {};
//   const financialData = financialReport?.data?.data?.financial || {};
//   const recentCustomers = statsData.recentCustomers || [];

//   const mainCards = [
//     {
//       title: 'Total Bookings',
//       value: statsData.totalBookings || 0,
//       icon: Calendar,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100 dark:bg-blue-900/20',
//       change: analyticsData.growth?.bookings || 0,
//       trend: (analyticsData.growth?.bookings || 0) >= 0 ? 'up' : 'down'
//     },
//     {
//       title: 'Active Bookings',
//       value: statsData.activeBookings || 0,
//       icon: Activity,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100 dark:bg-green-900/20'
//     },
//     {
//       title: 'Total Revenue',
//       value: `₹${(financialData.totalRevenue || 0).toLocaleString('en-IN')}`,
//       icon: DollarSign,
//       color: 'text-emerald-600',
//       bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
//       change: analyticsData.growth?.revenue || 0,
//       trend: (analyticsData.growth?.revenue || 0) >= 0 ? 'up' : 'down'
//     },
//     {
//       title: 'Pending Payments',
//       value: `₹${(financialData.pendingPayments || 0).toLocaleString('en-IN')}`,
//       icon: TrendingUp,
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-100 dark:bg-orange-900/20'
//     }
//   ];

//   const statusCards = [
//     {
//       title: 'Completed',
//       value: statsData.completedBookings || 0,
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100 dark:bg-green-900/20'
//     },
//     {
//       title: 'Cancelled',
//       value: statsData.cancelledBookings || 0,
//       icon: XCircle,
//       color: 'text-red-600',
//       bgColor: 'bg-red-100 dark:bg-red-900/20'
//     },
//     {
//       title: "Today's Bookings",
//       value: statsData.todaysBookings || 0,
//       icon: Clock,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100 dark:bg-purple-900/20'
//     },
//     {
//       title: 'Advanced Bookings',
//       value: statsData.advancedBookings || 0,
//       icon: Calendar,
//       color: 'text-cyan-600',
//       bgColor: 'bg-cyan-100 dark:bg-cyan-900/20'
//     }
//   ];

//   // Get chart data from financial and analytics
//   const revenueData = (financialReport?.data?.data?.dailyRevenue && financialReport?.data?.data?.dailyRevenue.length > 0)
//     ? financialReport?.data?.data?.dailyRevenue.map(day => ({
//         _id: format(new Date(day._id), 'dd/MM'),
//         revenue: day.revenue,
//         bookings: day.bookings
//       }))
//     : (analyticsData.revenueOverTime && analyticsData.revenueOverTime.length > 0)
//     ? analyticsData.revenueOverTime
//     : [
//         { _id: 'Week 1', revenue: 5000, bookings: 10 },
//         { _id: 'Week 2', revenue: 7500, bookings: 15 },
//         { _id: 'Week 3', revenue: 6000, bookings: 12 },
//         { _id: 'Week 4', revenue: 8500, bookings: 18 }
//       ];
  
//   const statusData = analyticsData.statusDistribution && analyticsData.statusDistribution.length > 0 
//     ? analyticsData.statusDistribution.map(item => ({
//         name: item._id,
//         value: item.count
//       }))
//     : [
//         { name: 'Active', value: statsData.activeBookings || 0 },
//         { name: 'Completed', value: statsData.completedBookings || 0 },
//         { name: 'Cancelled', value: statsData.cancelledBookings || 0 }
//       ];

//   const getStatusBadge = (status) => {
//     const variants = {
//       Active: 'default',
//       Completed: 'secondary',
//       Cancelled: 'destructive'
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };

//   if (statsLoading || analyticsLoading || financialLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-lg">{t('common.loading')}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
//           <p className="text-muted-foreground mt-2">
//             Welcome back! Here's an overview of your business.
//           </p>
//         </div>

//         <Select value={period} onValueChange={setPeriod}>
//           <SelectTrigger className="w-40">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="day">Today</SelectItem>
//             <SelectItem value="week">This Week</SelectItem>
//             <SelectItem value="month">This Month</SelectItem>
//             <SelectItem value="quarter">This Quarter</SelectItem>
//             <SelectItem value="year">This Year</SelectItem>
//             <SelectItem value="custom">Custom Range</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Custom Date Range Filter */}
//       {period === 'custom' && (
//         <Card className="p-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="text-sm font-medium mb-2 block">Start Date</label>
//               <Input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-2 block">End Date</label>
//               <Input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </div>
//             <div className="flex items-end">
//               <Button 
//                 className="w-full"
//                 onClick={() => {
//                   // Data will auto-refresh due to useQuery dependency
//                 }}
//               >
//                 Apply Filter
//               </Button>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Main Stats Cards - UPDATED with Revenue */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {mainCards.map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <Card key={index} className="hover:shadow-lg transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {card.title}
//                 </CardTitle>
//                 <div className={`p-2 rounded-lg ${card.bgColor}`}>
//                   <Icon className={`h-5 w-5 ${card.color}`} />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{card.value}</div>
//                 {card.change !== undefined && (
//                   <div className={`flex items-center text-sm mt-1 ${
//                     card.trend === 'up' ? 'text-green-600' : 'text-red-600'
//                   }`}>
//                     {card.trend === 'up' ? '↑' : '↓'}
//                     <span className="ml-1">{Math.abs(card.change).toFixed(1)}% vs last period</span>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Status Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {statusCards.map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <Card key={index} className="hover:shadow-lg transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {card.title}
//                 </CardTitle>
//                 <div className={`p-2 rounded-lg ${card.bgColor}`}>
//                   <Icon className={`h-5 w-5 ${card.color}`} />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{card.value}</div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Revenue Trend */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Revenue Trend</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {revenueData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={revenueData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis 
//                     dataKey="_id" 
//                     tick={{ fontSize: 12 }}
//                     angle={-45}
//                     textAnchor="end"
//                     height={80}
//                   />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line 
//                     type="monotone" 
//                     dataKey="revenue" 
//                     stroke="#10b981" 
//                     strokeWidth={2}
//                     name="Revenue (₹)"
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="bookings" 
//                     stroke="#3b82f6" 
//                     strokeWidth={2}
//                     name="Bookings"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//                 No revenue data available
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Status Distribution */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Booking Status Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {statusData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={statusData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#3b82f6" />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//                 No status data available
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Customers Table */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>Recent Customers</CardTitle>
//           <Button 
//             variant="outline" 
//             size="sm"
//             onClick={() => navigate('/customers')}
//           >
//             View All
//             <ArrowRight className="h-4 w-4 ml-2" />
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Customer</TableHead>
//                   <TableHead>Phone</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Total</TableHead>
//                   <TableHead>Paid</TableHead>
//                   <TableHead>Remaining</TableHead>
//                   <TableHead>Fitter</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {recentCustomers.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
//                       No customers yet. Start by adding your first booking!
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   recentCustomers.map((customer) => (
//                     <TableRow key={customer._id} className="cursor-pointer hover:bg-muted/50">
//                       <TableCell className="font-medium">{customer.name}</TableCell>
//                       <TableCell>{customer.phone}</TableCell>
//                       <TableCell>
//                         {format(new Date(customer.registrationDate), 'dd/MM/yyyy')}
//                       </TableCell>
//                       <TableCell>₹{customer.totalAmount.toLocaleString('en-IN')}</TableCell>
//                       <TableCell className="text-green-600">
//                         ₹{customer.givenAmount.toLocaleString('en-IN')}
//                       </TableCell>
//                       <TableCell className="text-orange-600">
//                         ₹{customer.remainingAmount.toLocaleString('en-IN')}
//                       </TableCell>
//                       <TableCell>{customer.fitterName || '-'}</TableCell>
//                       <TableCell>{getStatusBadge(customer.status)}</TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Quick Actions */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Quick Actions</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Button 
//               className="w-full" 
//               onClick={() => navigate('/customers')}
//             >
//               <Users className="h-4 w-4 mr-2" />
//               Add Customer
//             </Button>
//             <Button 
//               className="w-full" 
//               variant="outline"
//               onClick={() => navigate('/bookings')}
//             >
//               <Calendar className="h-4 w-4 mr-2" />
//               New Booking
//             </Button>
//             <Button 
//               className="w-full" 
//               variant="outline"
//               onClick={() => navigate('/items')}
//             >
//               <Package className="h-4 w-4 mr-2" />
//               Manage Items
//             </Button>
//             <Button 
//               className="w-full" 
//               variant="outline"
//               onClick={() => navigate('/reports')}
//             >
//               <TrendingUp className="h-4 w-4 mr-2" />
//               View Reports
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  ArrowRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { customerService } from '@/services/customerService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get date range based on period
  const getDateRange = () => {
    const today = new Date();
    let start, end;

    switch (period) {
      case 'day':
        start = end = today.toISOString().split('T')[0];
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        start = weekAgo.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1)
          .toISOString()
          .split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'custom':
        start = startDate;
        end = endDate;
        break;
      default:
        start = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split('T')[0];
        end = today.toISOString().split('T')[0];
    }

    return { startDate: start, endDate: end };
  };

  const dates = getDateRange();

  // Enhanced stats query
  const { data: enhancedStats, isLoading: statsLoading } = useQuery({
    queryKey: ['enhanced-dashboard-stats'],
    queryFn: () => customerService.getEnhancedStats(),
    refetchInterval: 30000
  });

  // Analytics query
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboard-analytics', period],
    queryFn: () => customerService.getAnalytics(period)
  });

  // Financial stats query
  const { data: financialStats, isLoading: financialLoading } = useQuery({
    queryKey: ['dashboard-financial-stats', period, startDate, endDate],
    queryFn: () => customerService.getFinancialStats({
      startDate: dates.startDate,
      endDate: dates.endDate
    })
  });

  const statsData = enhancedStats?.data?.data || {};
  const analyticsData = analytics?.data?.data || {};
  const financialData = financialStats?.data?.data?.financial || {};
  const dailyBreakdown = financialStats?.data?.data?.dailyBreakdown || [];
  const recentCustomers = statsData.recentCustomers || [];

  // Main cards - NOW USING TRANSLATION KEYS
  const mainCards = [
    {
      titleKey: 'dashboard.totalBookings',
      value: statsData.totalBookings || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: analyticsData.growth?.bookings || 0,
      trend: (analyticsData.growth?.bookings || 0) >= 0 ? 'up' : 'down'
    },
    {
      titleKey: 'dashboard.activeBookings',
      value: statsData.activeBookings || 0,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      titleKey: 'dashboard.totalRevenue',
      value: `₹${(financialData.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      change: analyticsData.growth?.revenue || 0,
      trend: (analyticsData.growth?.revenue || 0) >= 0 ? 'up' : 'down'
    },
    {
      titleKey: 'dashboard.pendingPayments',
      value: `₹${(financialData.pendingPayments || 0).toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  const statusCards = [
    {
      titleKey: 'customer.completed',
      value: statsData.completedBookings || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      titleKey: 'customer.cancelled',
      value: statsData.cancelledBookings || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      titleKey: 'dashboard.todaysBookings',
      value: statsData.todaysBookings || 0,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      titleKey: 'dashboard.collectionRate',
      value: `${financialData.collectionRate || 0}%`,
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/20'
    }
  ];

  // Chart data
  const revenueChartData = dailyBreakdown.map(day => ({
    date: day._id,
    revenue: day.revenue,
    pending: day.pending,
    bookings: day.bookings
  }));

  const getStatusBadge = (status) => {
    const variants = {
      Active: 'default',
      Completed: 'secondary',
      Cancelled: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (statsLoading || analyticsLoading || financialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('dashboard.welcomeMessage') || "Welcome back! Here's an overview of your business."}
          </p>
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">{t('dashboard.thisWeek')}</SelectItem>
            <SelectItem value="week">{t('dashboard.thisWeek')}</SelectItem>
            <SelectItem value="month">{t('dashboard.thisMonth')}</SelectItem>
            <SelectItem value="quarter">{t('dashboard.thisQuarter')}</SelectItem>
            <SelectItem value="year">{t('dashboard.thisYear')}</SelectItem>
            <SelectItem value="custom">{t('dashboard.customRange')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom date filter */}
      {period === 'custom' && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('report.startDate')}</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t('report.endDate')}</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">{t('report.applyFilter')}</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(card.titleKey)}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.change !== undefined && (
                  <div className={`flex items-center text-sm mt-1 ${
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.trend === 'up' ? '↑' : '↓'}
                    <span className="ml-1">{Math.abs(card.change).toFixed(1)}% vs last period</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(card.titleKey)}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.revenueTrend')}</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name={t('report.revenue')}
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name={t('report.pendingAmount')}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              {t('common.noData')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Customers Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('dashboard.recentCustomers')}</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/customers')}
          >
            {t('common.viewAll')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('customer.name')}</TableHead>
                  <TableHead>{t('customer.phone')}</TableHead>
                  <TableHead>{t('report.date')}</TableHead>
                  <TableHead>{t('customer.totalAmount')}</TableHead>
                  <TableHead>{t('customer.givenAmount')}</TableHead>
                  <TableHead>{t('customer.remainingAmount')}</TableHead>
                  <TableHead>{t('customer.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  recentCustomers.map((customer) => (
                    <TableRow key={customer._id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        {format(new Date(customer.registrationDate), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>₹{customer.totalAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-green-600">
                        ₹{customer.givenAmount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-orange-600">
                        ₹{customer.remainingAmount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="w-full" onClick={() => navigate('/customers')}>
              <Users className="h-4 w-4 mr-2" />
              {t('customer.addNew')}
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/bookings')}>
              <Calendar className="h-4 w-4 mr-2" />
              {t('booking.addNew')}
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/items')}>
              <Package className="h-4 w-4 mr-2" />
              {t('items.title')}
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/reports')}>
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('report.title')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}