import { useState,useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Download,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { reportService } from "@/services/reportService";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import robotoBase64 from "../utils/robotoBase64";

export default function Reports() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("all");
  const [fitterFilter, setFitterFilter] = useState("all");
  const [reportType, setReportType] = useState("fitter-wise");

  const getDateRange = () => {
    const today = new Date();
    let start, end;

    switch (dateRange) {
      case "today":
        start = end = today.toISOString().split("T")[0];
        break;
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        start = weekAgo.toISOString().split("T")[0];
        end = new Date().toISOString().split("T")[0];
        break;
      case "month":
        start = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        end = new Date().toISOString().split("T")[0];
        break;
      case "quarter":
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1)
          .toISOString()
          .split("T")[0];
        end = new Date().toISOString().split("T")[0];
        break;
      case "year":
        start = new Date(today.getFullYear(), 0, 1).toISOString().split("T")[0];
        end = new Date().toISOString().split("T")[0];
        break;
      case "custom":
        start = startDate;
        end = endDate;
        break;
      default:
        start = "";
        end = "";
    }

    return { startDate: start, endDate: end };
  };

  const dates = getDateRange();

  const { data: customerReport, isLoading: customerLoading } = useQuery({
    queryKey: ["customer-report", dates, status, fitterFilter, reportType],
    queryFn: () =>
      reportService.getCustomerReport({
        ...dates,
        status,
        fitterName: fitterFilter,
        reportType,
      }),
    // enabled: !!dates.startDate || !!dates.endDate || dateRange !== "custom",
    enabled: dateRange !== "custome" ? true : Boolean(startDate && endDate),
    onSuccess: (data) => {
    console.log("✅ Customer Report API Response:", data);
    console.log("✅ Raw customers data:", data?.data?.customers);
    console.log("✅ Data structure:", Object.keys(data || {}));
  },
  onError: (error) => {
    console.error("❌ Customer Report API Error:", error);
  }
  });

  const { data: itemReport, isLoading: itemLoading } = useQuery({
    queryKey: ["item-report", dates],
    queryFn: () => reportService.getItemReport(dates),
    enabled: dateRange !== "custome" ? true : Boolean(startDate && endDate),
    onSuccess: (data) => {
    console.log("✅ Items Report API Response:", data);
    console.log("✅ Raw Items data:", data?.data?.customers);
    console.log("✅ Data structure:", Object.keys(data || {}));
  },
  onError: (error) => {
    console.error("❌ Items Report API Error:", error);
  }
  });

  const { data: financialReport, isLoading: financialLoading } = useQuery({
    queryKey: ["financial-report", dates],
    queryFn: () => reportService.getFinancialReport(dates),
    enabled: dateRange !== "custome" ? true : Boolean(startDate && endDate),
    onSuccess: (data) => {
    console.log("✅ financial Report API Response:", data);
    console.log("✅ Raw financial data:", data?.data?.customers);
    console.log("✅ Data structure:", Object.keys(data || {}));
  },
  onError: (error) => {
    console.error("❌ Customer Report API Error:", error);
  }
  });

  const { data: fittersData } = useQuery({
    queryKey: ["fitters-list"],
    queryFn: () => reportService.getAllFitters(),
    onSuccess: (data) => {
    console.log("✅ fittersData Report API Response:", data);
    console.log("✅ Raw fittersData data:", data?.data?.customers);
    console.log("✅ Data structure:", Object.keys(data || {}));
  },
  onError: (error) => {
    console.error("❌ Customer Report API Error:", error);
  }
  });

  const customers = customerReport?.data?.data?.customers || [];
  const customerSummary = customerReport?.data?.data?.summary || {};
  // const fitterReport = Array.isArray(customerReport?.data?.fitterReport) ? customerReport.data.fitterReport: [];
  const fitterReport = customerReport?.data?.data?.fitterReport || [];
  const items = itemReport?.data?.data?.items || [];
  const itemSummary = itemReport?.data?.data?.summary || {};
  const financial = financialReport?.data?.data?.financial || {};
  const dailyRevenue = financialReport?.data?.data?.dailyRevenue || [];
  // const fitters = fittersData?.data?.data || [];
  const fitters = Array.isArray(fittersData?.data?.data)? fittersData.data.data  : [];
  
  useEffect(() => {
  console.log("Customer Report:", customerReport);
  console.log("Item Report:", itemReport);
  console.log("Financial Report:", financialReport);
  console.log("Fitters:", fitters);
}, [customerReport, itemReport, financialReport, fitters]);


  const downloadCustomerPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    console.log("autoTable exists?", typeof doc.autoTable);

    doc.addFileToVFS("Roboto-Regular.ttf",robotoBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    doc.setFontSize(20);
    // doc.setFont(undefined, "bold");
    doc.text(t("app.title"), 105, 15, { align: "center" });

    doc.setFontSize(16);
    doc.text(t("report.customerReport"), 105, 25, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.text(
      `${t("report.dateRange")}: ${dates.startDate || t("common.noData")} ${t("report.to")} ${dates.endDate || t("common.noData")}`,
      14,
      35
    );
    doc.text(
      `Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
      14,
      40
    );

    doc.setFillColor(240, 240, 240);
    doc.rect(14, 45, 182, 30, "F");

    doc.setFontSize(11);
    doc.setFont("Roboto", "bold");
    doc.text("Summary", 16, 52);

    doc.setFontSize(9);
    doc.setFont("Roboto", "normal");
    doc.text(
      `${t("dashboard.totalBookings")}: ${customerSummary.totalBookings || 0}`,
      16,
      58
    );
    doc.text(
      `${t("customer.active")}: ${customerSummary.activeBookings || 0}`,
      16,
      63
    );
    doc.text(
      `${t("customer.completed")}: ${customerSummary.completedBookings || 0}`,
      16,
      68
    );

    doc.text(
      `${t("dashboard.totalRevenue")}: Rs.${(customerSummary.totalRevenue || 0).toLocaleString("en-IN")}`,
      100,
      58
    );
    doc.text(
      `${t("dashboard.pendingPayments")}: Rs.${(customerSummary.totalPending || 0).toLocaleString("en-IN")}`,
      100,
      63
    );
    doc.text(
      `${t("customer.totalAmount")}: Rs.${(customerSummary.totalAmount || 0).toLocaleString("en-IN")}`,
      100,
      68
    );

    const tableData = customers.map((c) => [
      c.name,
      c.phone,
      format(new Date(c.registrationDate), "dd/MM/yy"),
      `₹${c.totalAmount.toLocaleString("en-IN")}`,
      `₹${c.givenAmount.toLocaleString("en-IN")}`,
      `₹${c.remainingAmount.toLocaleString("en-IN")}`,
      c.fitterName || "-",
      c.status,
    ]);

    autoTable(doc,{
      startY: 80,
      head: [
        [
          t("customer.name"),
          t("customer.phone"),
          t("report.date"),
          t("customer.totalAmount"),
          t("customer.givenAmount"),
          t("customer.remainingAmount"),
          t("customer.fitterName"),
          t("customer.status"),
        ],
      ],
      body: tableData,
      theme: "striped",
      styles: {font:"Roboto", fontSize: 8, cellPadding: 2 },
      headStyles: { font:"Roboto",fillColor: [66, 139, 202], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`customer-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const downloadItemPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text(t("report.inventoryReport"), 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
      14,
      25
    );

    doc.setFillColor(240, 240, 240);
    doc.rect(14, 30, 182, 25, "F");

    doc.setFontSize(9);
    doc.text(
      `${t("items.title")}: ${itemSummary.totalItems || 0}`,
      16,
      37
    );
    doc.text(
      `${t("items.totalQuantity")}: ${itemSummary.totalQuantity || 0}`,
      16,
      43
    );
    doc.text(
      `${t("items.available")}: ${itemSummary.availableQuantity || 0}`,
      16,
      49
    );

    doc.text(
      `${t("items.rentedQuantity")}: ${itemSummary.rentedQuantity || 0}`,
      100,
      37
    );
    doc.text(
      `Total Value: Rs.${(itemSummary.totalValue || 0).toLocaleString("en-IN")}`,
      100,
      43
    );

    const tableData = items.map((item) => [
      item.name,
      item.category || "-",
      item.totalQuantity,
      item.availableQuantity,
      item.rentedQuantity,
      `Rs.${item.price}`,
      item.status,
    ]);

    autoTable(doc,{
      startY: 60,
      head: [
        [
          t("items.name"),
          t("items.category"),
          t("items.totalQuantity"),
          t("items.availableQuantity"),
          t("items.rentedQuantity"),
          t("items.price"),
          t("items.status"),
        ],
      ],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(`inventory-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const downloadFinancialPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text(t("report.financialReport"), 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `${t("report.dateRange")}: ${dates.startDate || t("common.noData")} ${t("report.to")} ${dates.endDate || t("common.noData")}`,
      14,
      25
    );
    doc.text(
      `Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
      14,
      30
    );

    doc.setFillColor(240, 240, 240);
    doc.rect(14, 35, 182, 40, "F");

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Financial Summary", 16, 42);

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text(
      `${t("dashboard.totalRevenue")}: Rs.${(financial.totalRevenue || 0).toLocaleString("en-IN")}`,
      16,
      49
    );
    doc.text(
      `${t("customer.totalAmount")}: Rs.${(financial.totalBookingAmount || 0).toLocaleString("en-IN")}`,
      16,
      55
    );
    doc.text(
      `${t("dashboard.pendingPayments")}: Rs.${(financial.pendingPayments || 0).toLocaleString("en-IN")}`,
      16,
      61
    );
    doc.text(
      `${t("dashboard.collectionRate")}: ${financial.collectionRate || 0}%`,
      16,
      67
    );

    doc.text(
      `${t("customer.depositAmount")}: Rs.${(financial.depositCollected || 0).toLocaleString("en-IN")}`,
      100,
      49
    );
    doc.text(
      `${t("customer.transport")}: Rs.${(financial.transportRevenue || 0).toLocaleString("en-IN")}`,
      100,
      55
    );
    doc.text(
      `${t("customer.maintenanceCharges")}: Rs.${(financial.maintenanceCharges || 0).toLocaleString("en-IN")}`,
      100,
      61
    );

    if (dailyRevenue.length > 0) {
      const tableData = dailyRevenue.map((day) => [
        format(new Date(day._id), "dd/MM/yyyy"),
        day.bookings,
        `₹${day.revenue.toLocaleString("en-IN")}`,
      ]);

      autoTable(doc,{
        startY: 80,
        head: [
          [
            t("report.date"),
            t("report.bookings"),
            t("report.revenue"),
          ],
        ],
        body: tableData,
        theme: "striped",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [66, 139, 202] },
      });
    }

    doc.save(`financial-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const downloadFitterPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text(t("report.fitterPerformance"), 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `${t("report.dateRange")}: ${dates.startDate || t("common.noData")} ${t("report.to")} ${dates.endDate || t("common.noData")}`,
      14,
      25
    );
    doc.text(
      `Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
      14,
      30
    );

    const tableData = fitterReport.map((fitter) => [
      fitter._id || "Unassigned",
      fitter.totalBookings,
      fitter.activeBookings,
      fitter.completedBookings,
      `₹${fitter.totalRevenue.toLocaleString("en-IN")}`,
      `₹${fitter.totalAmount.toLocaleString("en-IN")}`,
      `₹${fitter.pendingAmount.toLocaleString("en-IN")}`,
    ]);

    autoTable(doc,{
      startY: 40,
      head: [
        [
          t("report.fitterName"),
          t("dashboard.totalBookings"),
          t("dashboard.activeBookings"),
          t("customer.completed"),
          t("report.revenue"),
          t("customer.totalAmount"),
          t("dashboard.pendingPayments"),
        ],
      ],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(`fitter-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const downloadCSV = () => {
    const headers = [
      t("customer.name"),
      t("customer.phone"),
      t("report.date"),
      t("customer.checkInDate"),
      t("customer.checkOutDate"),
      t("customer.totalAmount"),
      t("customer.givenAmount"),
      t("customer.remainingAmount"),
      t("customer.transport"),
      t("customer.maintenanceCharges"),
      t("customer.status"),
      t("customer.fitterName"),
    ];

    const rows = customers.map((c) => [
      c.name,
      c.phone,
      format(new Date(c.registrationDate), "dd/MM/yyyy"),
      format(new Date(c.checkInDate), "dd/MM/yyyy") + " " + c.checkInTime,
      c.checkOutDate
        ? format(new Date(c.checkOutDate), "dd/MM/yyyy") + " " + c.checkOutTime
        : "-",
      c.totalAmount,
      c.givenAmount,
      c.remainingAmount,
      c.transportCost || 0,
      c.maintenanceCharges || 0,
      c.status,
      c.fitterName || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `customer-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("report.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("report.generateReports")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={printReport} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            {t("common.print")}
          </Button>
          <Button onClick={downloadCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t("report.downloadCSV")}
          </Button>
          <Button onClick={downloadCustomerPDF}>
            <Download className="h-4 w-4 mr-2" />
            {t("report.downloadPDF")}
          </Button>
        </div>
      </div>

      <Card className="p-4 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("report.dateRange")}
            </label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="focus:outline-none focus:ring-0 focus:border-none">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t("report.today")}</SelectItem>
                <SelectItem value="week">{t("dashboard.thisWeek")}</SelectItem>
                <SelectItem value="month">{t("dashboard.thisMonth")}</SelectItem>
                <SelectItem value="quarter">{t("dashboard.thisQuarter")}</SelectItem>
                <SelectItem value="year">{t("dashboard.thisYear")}</SelectItem>
                <SelectItem value="custom">{t("dashboard.customRange")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === "custom" && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("report.startDate")}
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="focus:outline-none focus:ring-0 focus:border-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("report.endDate")}
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="focus:outline-none focus:ring-0 focus:border-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("customer.status")}
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="focus:outline-none focus:ring-0 focus:border-none">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('report.allStatus')}</SelectItem>
                <SelectItem value="Active">{t("customer.active")}</SelectItem>
                <SelectItem value="Completed">{t("customer.completed")}</SelectItem>
                <SelectItem value="Cancelled">{t("customer.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("customer.fitterName")}
            </label>
            <Select value={fitterFilter} onValueChange={setFitterFilter}>
              <SelectTrigger className="focus:outline-none focus:ring-0 focus:border-none">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('report.allFitters')}</SelectItem>
                {fitters.map((fitter) => (
                  <SelectItem key={fitter} value={fitter}>
                    {fitter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="print:hidden">
          <TabsTrigger value="customers">
            <Users className="h-4 w-4 mr-2" />
            {t("report.customerReport")}
          </TabsTrigger>
          <TabsTrigger value="items">
            <Package className="h-4 w-4 mr-2" />
            {t("report.inventoryReport")}
          </TabsTrigger>
          <TabsTrigger value="financial">
            <DollarSign className="h-4 w-4 mr-2" />
            {t("report.financialReport")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.totalBookings")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customerSummary.totalBookings || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.totalRevenue")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {t("common.rs")}{(customerSummary.totalRevenue || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.pendingPayments")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {t("common.rs")}{(customerSummary.totalPending || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.activeBookings")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {customerSummary.activeBookings || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("report.customerDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("customer.name")}</TableHead>
                      <TableHead>{t("customer.phone")}</TableHead>
                      <TableHead>{t("report.date")}</TableHead>
                      <TableHead>{t("customer.totalAmount")}</TableHead>
                      <TableHead>{t("customer.givenAmount")}</TableHead>
                      <TableHead>{t("customer.remainingAmount")}</TableHead>
                      <TableHead>{t("customer.fitterName")}</TableHead>
                      <TableHead>{t("customer.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          {t("common.loading")}
                        </TableCell>
                      </TableRow>
                    ) : customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          {t("common.noData")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers.map((customer) => (
                        <TableRow key={customer._id}>
                          <TableCell className="font-medium">
                            {customer.name}
                          </TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>
                            {format(new Date(customer.registrationDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            {t("common.rs")}{customer.totalAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-green-600">
                            {t("common.rs")}{customer.givenAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-orange-600">
                            {t("common.rs")}{customer.remainingAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>{customer.fitterName || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                customer.status === "Active"
                                  ? "default"
                                  : customer.status === "Completed"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {customer.status}
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
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-end gap-2 print:hidden mb-4">
            <Button onClick={downloadItemPDF}>
              <Download className="h-4 w-4 mr-2" />
              {t("report.downloadPDF")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("items.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {itemSummary.totalItems || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("items.totalQuantity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {itemSummary.totalQuantity || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("items.available")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {itemSummary.availableQuantity || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("items.rentedQuantity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {itemSummary.rentedQuantity || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('report.totalValues')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {t("common.rs")}{(itemSummary.totalValue || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("report.inventoryDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("items.name")}</TableHead>
                      <TableHead>{t("items.category")}</TableHead>
                      <TableHead>{t("items.totalQuantity")}</TableHead>
                      <TableHead>{t("items.availableQuantity")}</TableHead>
                      <TableHead>{t("items.rentedQuantity")}</TableHead>
                      <TableHead>{t("items.price")}</TableHead>
                      <TableHead>{t("items.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          {t("common.loading")}
                        </TableCell>
                      </TableRow>
                    ) : items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          {t("common.noData")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>{item.category || "-"}</TableCell>
                          <TableCell>{item.totalQuantity}</TableCell>
                          <TableCell className="text-green-600">
                            {item.availableQuantity}
                          </TableCell>
                          <TableCell className="text-orange-600">
                            {item.rentedQuantity}
                          </TableCell>
                          <TableCell>{t("common.rs")}{item.price}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "Available"
                                  ? "default"
                                  : item.status === "InUse"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {item.status}
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
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="flex justify-end gap-2 print:hidden mb-4">
            <Button onClick={downloadFinancialPDF}>
              <Download className="h-4 w-4 mr-2" />
              {t("report.downloadPDF")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.totalRevenue")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {t("common.rs")}{(financial.totalRevenue || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.pendingPayments")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {t("common.rs")}{(financial.pendingPayments || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.collectionRate")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {financial.collectionRate || 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("customer.transport")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {t("common.rs")}{(financial.transportRevenue || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("customer.maintenanceCharges")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {t("common.rs")}{(financial.maintenanceCharges || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("customer.depositAmount")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {t("common.rs")}{(financial.depositCollected || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>
          </div>

          {dailyRevenue.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("report.dailyRevenue")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("report.date")}</TableHead>
                        <TableHead>{t("report.bookings")}</TableHead>
                        <TableHead>{t("report.revenue")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyRevenue.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {format(new Date(day._id), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>{day.bookings}</TableCell>
                          <TableCell className="font-semibold">
                            {t("common.rs")}{day.revenue.toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}