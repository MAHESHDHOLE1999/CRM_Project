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
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { format } from 'date-fns';

// export default function Dashboard() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [period, setPeriod] = useState('month');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // Get date range based on period
//   const getDateRange = () => {
//     const today = new Date();
//     let start, end;

//     switch (period) {
//       case 'day':
//         start = end = today.toISOString().split('T')[0];
//         break;
//       case 'week':
//         const weekAgo = new Date(today);
//         weekAgo.setDate(weekAgo.getDate() - 7);
//         start = weekAgo.toISOString().split('T')[0];
//         end = today.toISOString().split('T')[0];
//         break;
//       case 'month':
//         start = new Date(today.getFullYear(), today.getMonth(), 1)
//           .toISOString()
//           .split('T')[0];
//         end = today.toISOString().split('T')[0];
//         break;
//       case 'quarter':
//         const quarter = Math.floor(today.getMonth() / 3);
//         start = new Date(today.getFullYear(), quarter * 3, 1)
//           .toISOString()
//           .split('T')[0];
//         end = today.toISOString().split('T')[0];
//         break;
//       case 'year':
//         start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
//         end = today.toISOString().split('T')[0];
//         break;
//       case 'custom':
//         start = startDate;
//         end = endDate;
//         break;
//       default:
//         start = new Date(today.getFullYear(), today.getMonth(), 1)
//           .toISOString()
//           .split('T')[0];
//         end = today.toISOString().split('T')[0];
//     }

//     return { startDate: start, endDate: end };
//   };

//   const dates = getDateRange();

//   // Enhanced stats query
//   const { data: enhancedStats, isLoading: statsLoading } = useQuery({
//     queryKey: ['enhanced-dashboard-stats'],
//     queryFn: () => customerService.getEnhancedStats(),
//     refetchInterval: 30000
//   });

//   // Analytics query
//   const { data: analytics, isLoading: analyticsLoading } = useQuery({
//     queryKey: ['dashboard-analytics', period],
//     queryFn: () => customerService.getAnalytics(period)
//   });

//   // Financial stats query
//   const { data: financialStats, isLoading: financialLoading } = useQuery({
//     queryKey: ['dashboard-financial-stats', period, startDate, endDate],
//     queryFn: () => customerService.getFinancialStats({
//       startDate: dates.startDate,
//       endDate: dates.endDate
//     })
//   });

//   const statsData = enhancedStats?.data?.data || {};
//   const analyticsData = analytics?.data?.data || {};
//   const financialData = financialStats?.data?.data?.financial || {};
//   const dailyBreakdown = financialStats?.data?.data?.dailyBreakdown || [];
//   const recentCustomers = statsData.recentCustomers || [];

//   // Main cards - NOW USING TRANSLATION KEYS
//   const mainCards = [
//     {
//       titleKey: 'dashboard.totalBookings',
//       value: statsData.totalBookings || 0,
//       icon: Calendar,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100 dark:bg-blue-900/20',
//       change: analyticsData.growth?.bookings || 0,
//       trend: (analyticsData.growth?.bookings || 0) >= 0 ? 'up' : 'down'
//     },
//     {
//       titleKey: 'dashboard.activeBookings',
//       value: statsData.activeBookings || 0,
//       icon: Activity,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100 dark:bg-green-900/20'
//     },
//     {
//       titleKey: 'dashboard.totalRevenue',
//       value: `₹${(financialData.totalRevenue || 0).toLocaleString('en-IN')}`,
//       icon: DollarSign,
//       color: 'text-emerald-600',
//       bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
//       change: analyticsData.growth?.revenue || 0,
//       trend: (analyticsData.growth?.revenue || 0) >= 0 ? 'up' : 'down'
//     },
//     {
//       titleKey: 'dashboard.pendingPayments',
//       value: `₹${(financialData.pendingPayments || 0).toLocaleString('en-IN')}`,
//       icon: TrendingUp,
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-100 dark:bg-orange-900/20'
//     }
//   ];

//   const statusCards = [
//     {
//       titleKey: 'customer.completed',
//       value: statsData.completedBookings || 0,
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100 dark:bg-green-900/20'
//     },
//     {
//       titleKey: 'customer.cancelled',
//       value: statsData.cancelledBookings || 0,
//       icon: XCircle,
//       color: 'text-red-600',
//       bgColor: 'bg-red-100 dark:bg-red-900/20'
//     },
//     {
//       titleKey: 'dashboard.todaysBookings',
//       value: statsData.todaysBookings || 0,
//       icon: Clock,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100 dark:bg-purple-900/20'
//     },
//     {
//       titleKey: 'dashboard.collectionRate',
//       value: `${financialData.collectionRate || 0}%`,
//       icon: TrendingUp,
//       color: 'text-cyan-600',
//       bgColor: 'bg-cyan-100 dark:bg-cyan-900/20'
//     }
//   ];

//   // Chart data
//   const revenueChartData = dailyBreakdown.map(day => ({
//     date: day._id,
//     revenue: day.revenue,
//     pending: day.pending,
//     bookings: day.bookings
//   }));

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
//             {t('dashboard.welcomeMessage') || "Welcome back! Here's an overview of your business."}
//           </p>
//         </div>

//         <Select value={period} onValueChange={setPeriod}>
//           <SelectTrigger className="w-40">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="day">{t('dashboard.thisWeek')}</SelectItem>
//             <SelectItem value="week">{t('dashboard.thisWeek')}</SelectItem>
//             <SelectItem value="month">{t('dashboard.thisMonth')}</SelectItem>
//             <SelectItem value="quarter">{t('dashboard.thisQuarter')}</SelectItem>
//             <SelectItem value="year">{t('dashboard.thisYear')}</SelectItem>
//             <SelectItem value="custom">{t('dashboard.customRange')}</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Custom date filter */}
//       {period === 'custom' && (
//         <Card className="p-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="text-sm font-medium mb-2 block">{t('report.startDate')}</label>
//               <Input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-2 block">{t('report.endDate')}</label>
//               <Input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </div>
//             <div className="flex items-end">
//               <Button className="w-full">{t('report.applyFilter')}</Button>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Main Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {mainCards.map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <Card key={index} className="hover:shadow-lg transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {t(card.titleKey)}
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
//                   {t(card.titleKey)}
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

//       {/* Revenue Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>{t('dashboard.revenueTrend')}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {revenueChartData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={revenueChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#10b981"
//                   strokeWidth={2}
//                   name={t('report.revenue')}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="pending"
//                   stroke="#f59e0b"
//                   strokeWidth={2}
//                   name={t('report.pendingAmount')}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//               {t('common.noData')}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Recent Customers Table */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>{t('dashboard.recentCustomers')}</CardTitle>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => navigate('/customers')}
//           >
//             {t('common.viewAll')}
//             <ArrowRight className="h-4 w-4 ml-2" />
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>{t('customer.name')}</TableHead>
//                   <TableHead>{t('customer.phone')}</TableHead>
//                   <TableHead>{t('report.date')}</TableHead>
//                   <TableHead>{t('customer.totalAmount')}</TableHead>
//                   <TableHead>{t('customer.givenAmount')}</TableHead>
//                   <TableHead>{t('customer.remainingAmount')}</TableHead>
//                   <TableHead>{t('customer.status')}</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {recentCustomers.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
//                       {t('common.noData')}
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
//           <CardTitle>{t('dashboard.quickActions')}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Button className="w-full" onClick={() => navigate('/customers')}>
//               <Users className="h-4 w-4 mr-2" />
//               {t('customer.addNew')}
//             </Button>
//             <Button className="w-full" variant="outline" onClick={() => navigate('/bookings')}>
//               <Calendar className="h-4 w-4 mr-2" />
//               {t('booking.addNew')}
//             </Button>
//             <Button className="w-full" variant="outline" onClick={() => navigate('/items')}>
//               <Package className="h-4 w-4 mr-2" />
//               {t('items.title')}
//             </Button>
//             <Button className="w-full" variant="outline" onClick={() => navigate('/reports')}>
//               <TrendingUp className="h-4 w-4 mr-2" />
//               {t('report.title')}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
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
  ArrowRight,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customerService } from "@/services/customerService";
import { reportService } from "@/services/reportService";
import {
  format,
  subDays,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from "date-fns";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State Management
  const [period, setPeriod] = useState("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Calculate Date Range
  // const getDateRange = () => {
  //   const today = new Date();
  //   let start, end;

  //   switch (period) {
  //     case 'today':
  //       start = end = today.toISOString().split('T')[0];
  //       break;
  //     case 'week':
  //       start = subDays(today, 7).toISOString().split('T')[0];
  //       end = today.toISOString().split('T')[0];
  //       break;
  //     case 'month':
  //       start = startOfMonth(today).toISOString().split('T')[0];
  //       end = today.toISOString().split('T')[0];
  //       break;
  //     case 'quarter':
  //       start = startOfQuarter(today).toISOString().split('T')[0];
  //       end = today.toISOString().split('T')[0];
  //       break;
  //     case 'year':
  //       start = startOfYear(today).toISOString().split('T')[0];
  //       end = today.toISOString().split('T')[0];
  //       break;
  //     case 'custom':
  //       start = customStartDate;
  //       end = customEndDate;
  //       break;
  //     default:
  //       start = startOfMonth(today).toISOString().split('T')[0];
  //       end = today.toISOString().split('T')[0];
  //   }

  //   return { startDate: start, endDate: end };
  // };
  const getDateRange = () => {
    const today = new Date();
    let start, end;

    switch (period) {
      case "today": {
        start = new Date(today);
        end = new Date(today);
        break;
      }
      case "week": {
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        end = new Date(today);
        break;
      }
      case "month": {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today);
        break;
      }
      case "quarter": {
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        end = new Date(today);
        break;
      }
      case "year": {
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today);
        break;
      }
      case "custom": {
        start = customStartDate
          ? new Date(customStartDate)
          : new Date(today.getFullYear(), today.getMonth(), 1);
        end = customEndDate ? new Date(customEndDate) : new Date(today);
        break;
      }
      default: {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today);
      }
    }

    // Ensure end date includes the entire day
    end.setHours(23, 59, 59, 999);

    // Format as YYYY-MM-DD for API
    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    console.log("Date Range:", { period, startDate, endDate, start, end }); // DEBUG

    return { startDate, endDate };
  };

  const dates = getDateRange();

  // Fetch Dashboard Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => customerService.getEnhancedDashboardStats(),
    refetchInterval: 30000,
  });

  // Fetch Financial Stats with Date Range
  const { data: financialData, isLoading: financialLoading } = useQuery({
    queryKey: ["financial-stats", period, customStartDate, customEndDate],
    queryFn: () =>
      customerService.getFinancialStats({
        startDate: dates.startDate,
        endDate: dates.endDate,
      }),
  });

  // Fetch Analytics Data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["dashboard-analytics", period],
    queryFn: () => customerService.getAnalytics(period),
  });

  // Fetch Customer Report for Details
  const { data: customerReportData } = useQuery({
    queryKey: ["customer-report", period, customStartDate, customEndDate],
    queryFn: () =>
      reportService.getCustomerReport({
        startDate: dates.startDate,
        endDate: dates.endDate,
      }),
  });

  // Extract Data
  const stats = statsData?.data?.data || {};
  const financial = financialData?.data?.data?.financial || {};
  const dailyBreakdown = financialData?.data?.data?.dailyBreakdown || [];
  const analytics = analyticsData?.data?.data || {};
  const recentCustomers = stats.recentCustomers || [];
  const fitterReport = customerReportData?.data?.data?.fitterReport || [];

  // Transform Daily Revenue Data for Charts
  const revenueChartData = useMemo(() => {
    return (dailyBreakdown || []).map((day) => ({
      date: format(new Date(day._id), "MMM dd"),
      revenue: Math.round(day.revenue),
      pending: Math.round(day.pending),
      bookings: day.bookings,
    }));
  }, [dailyBreakdown]);
  console.log("Revenue chart data", revenueChartData);

  // Transform Status Distribution Data
const statusData = useMemo(() => {
  console.log('Analytics data:', analytics);
  console.log('Status distribution from analytics:', analytics.statusDistribution);
  
  if (analytics.statusDistribution && analytics.statusDistribution.length > 0) {
    const transformed = analytics.statusDistribution.map((item) => ({
      name: t(`customer.${item._id.toLowerCase()}`),
      value: item.count,
      amount: item.totalAmount,
    }));
    console.log('Transformed status data:', transformed);
    return transformed;
  }
  
  // Fallback only if NO data from analytics
  console.log('Using fallback status data');
  return [
    { name: t('customer.active'), value: stats.activeBookings || 0 },
    { name: t('customer.completed'), value: stats.completedBookings || 0 },
    { name: t('customer.cancelled'), value: stats.cancelledBookings || 0 },
  ];
}, [analytics.statusDistribution, stats, t]);

  // Transform Fitter Performance Data
  const fitterPerformanceData = useMemo(() => {
    return (fitterReport || []).map((fitter) => ({
      name: fitter._id || t("common.unassigned"),
      bookings: fitter.totalBookings,
      revenue: Math.round(fitter.totalRevenue),
      completed: fitter.completedBookings,
    }));
  }, [fitterReport, t]);

  // Calculate Growth Metrics
  const revenueGrowth = analytics.growth?.revenue || 0;
  const bookingsGrowth = analytics.growth?.bookings || 0;

  // Add this useEffect to debug
useEffect(() => {
  if (financialData) {
    console.log('=== FINANCIAL DATA DEBUG ===');
    console.log('Full response:', financialData);
    console.log('financial object:', financial);
    console.log('dailyBreakdown:', dailyBreakdown);
    console.log('dailyBreakdown length:', dailyBreakdown.length);
  }
}, [financialData, financial, dailyBreakdown]);

  // Loading State
  if (statsLoading || financialLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("dashboard.overview")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t("common.export")}
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">{t("dashboard.period")}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { value: "today", label: t("dashboard.today") },
              { value: "week", label: t("dashboard.thisWeek") },
              { value: "month", label: t("dashboard.thisMonth") },
              { value: "quarter", label: t("dashboard.thisQuarter") },
              { value: "year", label: t("dashboard.thisYear") },
              { value: "custom", label: t("dashboard.customRange") },
            ].map((option) => (
              <Button
                key={option.value}
                variant={period === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(option.value)}
                className="justify-center"
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Range Inputs */}
          {period === "custom" && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("report.startDate")}
                </label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("report.endDate")}
                </label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalBookings")}
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {bookingsGrowth >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(bookingsGrowth).toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalRevenue")}
            </CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{(financial.totalRevenue || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {revenueGrowth >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(revenueGrowth).toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.pendingPayments")}
            </CardTitle>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{(financial.pendingPayments || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {financial.collectionRate || 0}% collection rate
            </p>
          </CardContent>
        </Card>

        {/* Active Bookings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.activeBookings")}
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.activeBookings || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.todaysBookings || 0} today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.completedBookings")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedBookings || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.cancelledBookings")}
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.cancelledBookings || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.todaysBookings")}
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.todaysBookings || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.collectionRate")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financial.collectionRate || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              {t("dashboard.revenueTrend")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("report.from")}{" "}
              {format(new Date(dates.startDate), "MMM dd, yyyy")}{" "}
              {t("report.to")} {format(new Date(dates.endDate), "MMM dd, yyyy")}
            </p>
          </CardHeader>
          <CardContent>
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorPending"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    fill="url(#colorRevenue)"
                    name={t("report.revenue")}
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stroke="#f59e0b"
                    fill="url(#colorPending)"
                    name={t("dashboard.pendingPayments")}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {t("common.noData")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              {t("dashboard.bookingStatusDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {t("common.noData")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Bookings Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {t("dashboard.dailyBookingsTrend")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(value) => value} />
                  <Legend />
                  <Bar dataKey="bookings" fill="#3b82f6" name={t("dashboard.booking")} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {t("common.noData")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fitter Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              {t("report.fitterWisePerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fitterPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fitterPerformanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="text-xs"
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="bookings"
                    fill="#3b82f6"
                    name="Bookings"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    fill="#10b981"
                    name="Revenue (₹)"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {t("common.noData")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Customers Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            {t("dashboard.recentCustomers")}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/customers")}
            className="gap-1"
          >
            {t("common.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("customer.name")}</TableHead>
                  <TableHead>{t("customer.phone")}</TableHead>
                  <TableHead>{t("customer.registrationDate")}</TableHead>
                  <TableHead className="text-right">
                    {t("customer.totalAmount")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("customer.givenAmount")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("customer.remainingAmount")}
                  </TableHead>
                  <TableHead>{t("customer.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {t("common.noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  recentCustomers.map((customer) => (
                    <TableRow key={customer._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        {format(
                          new Date(customer.registrationDate),
                          "dd/MM/yyyy"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{customer.totalAmount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        ₹{customer.givenAmount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right text-orange-600 font-semibold">
                        ₹{customer.remainingAmount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            customer.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30"
                              : customer.status === "Completed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30"
                          }
                        >
                          {t(`customer.${customer.status.toLowerCase()}`)}
                        </Badge>
                      </TableCell>
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
          <CardTitle>{t("dashboard.quickActions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              className="justify-start"
              onClick={() => navigate("/customers")}
            >
              <Users className="h-4 w-4 mr-2" />
              {t("customer.addNew")}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/bookings")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {t("booking.addNew")}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/items")}
            >
              <Package className="h-4 w-4 mr-2" />
              {t("items.title")}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/reports")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {t("report.title")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
