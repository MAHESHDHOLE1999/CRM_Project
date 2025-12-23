

import { useState } from "react";
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
import "jspdf-autotable";

export default function Reports() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("all");
  const [fitterFilter, setFitterFilter] = useState("all");
  const [reportType, setReportType] = useState("fitter-wise");

  // Get date ranges based on selection
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

  // Fetch reports
  const { data: customerReport, isLoading: customerLoading } = useQuery({
    queryKey: ["customer-report", dates, status, fitterFilter, reportType],
    queryFn: () =>
      reportService.getCustomerReport({
        ...dates,
        status,
        fitterName: fitterFilter,
        reportType,
      }),
    enabled: !!dates.startDate || !!dates.endDate || dateRange !== "custom",
  });

  const { data: itemReport, isLoading: itemLoading } = useQuery({
    queryKey: ["item-report", dates],
    queryFn: () => reportService.getItemReport(dates),
  });

  const { data: financialReport, isLoading: financialLoading } = useQuery({
    queryKey: ["financial-report", dates],
    queryFn: () => reportService.getFinancialReport(dates),
  });

  const { data: fittersData } = useQuery({
    queryKey: ["fitters-list"],
    queryFn: () => reportService.getAllFitters(),
  });

  const customers = customerReport?.data?.data?.customers || [];
  const customerSummary = customerReport?.data?.data?.summary || {};
  const fitterReport = customerReport?.data?.data?.fitterReport || [];
  const items = itemReport?.data?.data?.items || [];
  const itemSummary = itemReport?.data?.data?.summary || {};
  const financial = financialReport?.data?.data?.financial || {};
  const dailyRevenue = financialReport?.data?.data?.dailyRevenue || [];
  const fitters = fittersData?.data?.data || [];

  // Download Customer Report PDF
  const downloadCustomerPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("Ajay Gadhi Bandar CRM", 105, 15, { align: "center" });

    doc.setFontSize(16);
    doc.text("Customer Report", 105, 25, { align: "center" });

    // Date range
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `Period: ${dates.startDate || "All"} to ${dates.endDate || "All"}`,
      14,
      35
    );
    doc.text(`Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 40);

    // Summary Box
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 45, 182, 30, "F");

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Summary", 16, 52);

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text(`Total Bookings: ${customerSummary.totalBookings || 0}`, 16, 58);
    doc.text(`Active: ${customerSummary.activeBookings || 0}`, 16, 63);
    doc.text(`Completed: ${customerSummary.completedBookings || 0}`, 16, 68);

    doc.text(
      `Total Revenue: ₹${(customerSummary.totalRevenue || 0).toLocaleString(
        "en-IN"
      )}`,
      100,
      58
    );
    doc.text(
      `Pending: ₹${(customerSummary.totalPending || 0).toLocaleString(
        "en-IN"
      )}`,
      100,
      63
    );
    doc.text(
      `Total Amount: ₹${(customerSummary.totalAmount || 0).toLocaleString(
        "en-IN"
      )}`,
      100,
      68
    );

    // Table
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

    doc.autoTable({
      startY: 80,
      head: [
        [
          "Customer",
          "Phone",
          "Date",
          "Total",
          "Paid",
          "Pending",
          "Fitter",
          "Status",
        ],
      ],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`customer-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  // Download Item Report PDF
  const downloadItemPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("Inventory Report", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 25);

    // Summary
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 30, 182, 25, "F");

    doc.setFontSize(9);
    doc.text(`Total Items: ${itemSummary.totalItems || 0}`, 16, 37);
    doc.text(`Total Quantity: ${itemSummary.totalQuantity || 0}`, 16, 43);
    doc.text(`Available: ${itemSummary.availableQuantity || 0}`, 16, 49);

    doc.text(`Rented: ${itemSummary.rentedQuantity || 0}`, 100, 37);
    doc.text(
      `Total Value: ₹${(itemSummary.totalValue || 0).toLocaleString("en-IN")}`,
      100,
      43
    );

    const tableData = items.map((item) => [
      item.name,
      item.category || "-",
      item.totalQuantity,
      item.availableQuantity,
      item.rentedQuantity,
      `₹${item.price}`,
      item.status,
    ]);

    doc.autoTable({
      startY: 60,
      head: [
        [
          "Item Name",
          "Category",
          "Total",
          "Available",
          "Rented",
          "Price",
          "Status",
        ],
      ],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(`inventory-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  // Download Financial Report PDF
  const downloadFinancialPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("Financial Report", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `Period: ${dates.startDate || "All"} to ${dates.endDate || "All"}`,
      14,
      25
    );
    doc.text(`Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30);

    // Financial Summary
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 35, 182, 40, "F");

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Financial Summary", 16, 42);

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text(
      `Total Revenue: ₹${(financial.totalRevenue || 0).toLocaleString(
        "en-IN"
      )}`,
      16,
      49
    );
    doc.text(
      `Total Booking Amount: ₹${(
        financial.totalBookingAmount || 0
      ).toLocaleString("en-IN")}`,
      16,
      55
    );
    doc.text(
      `Pending Payments: ₹${(financial.pendingPayments || 0).toLocaleString(
        "en-IN"
      )}`,
      16,
      61
    );
    doc.text(`Collection Rate: ${financial.collectionRate || 0}%`, 16, 67);

    doc.text(
      `Deposit Collected: ₹${(financial.depositCollected || 0).toLocaleString(
        "en-IN"
      )}`,
      100,
      49
    );
    doc.text(
      `Transport Revenue: ₹${(financial.transportRevenue || 0).toLocaleString(
        "en-IN"
      )}`,
      100,
      55
    );
    doc.text(
      `Maintenance Charges: ₹${(
        financial.maintenanceCharges || 0
      ).toLocaleString("en-IN")}`,
      100,
      61
    );

    // Daily Revenue Table
    if (dailyRevenue.length > 0) {
      const tableData = dailyRevenue.map((day) => [
        format(new Date(day._id), "dd/MM/yyyy"),
        day.bookings,
        `₹${day.revenue.toLocaleString("en-IN")}`,
      ]);

      doc.autoTable({
        startY: 80,
        head: [["Date", "Bookings", "Revenue"]],
        body: tableData,
        theme: "striped",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [66, 139, 202] },
      });
    }

    doc.save(`financial-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  // Download Fitter Report PDF
  const downloadFitterPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("Fitter Performance Report", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `Period: ${dates.startDate || "All"} to ${dates.endDate || "All"}`,
      14,
      25
    );
    doc.text(`Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30);

    const tableData = fitterReport.map((fitter) => [
      fitter._id || "Unassigned",
      fitter.totalBookings,
      fitter.activeBookings,
      fitter.completedBookings,
      `₹${fitter.totalRevenue.toLocaleString("en-IN")}`,
      `₹${fitter.totalAmount.toLocaleString("en-IN")}`,
      `₹${fitter.pendingAmount.toLocaleString("en-IN")}`,
    ]);

    doc.autoTable({
      startY: 40,
      head: [
        [
          "Fitter",
          "Total",
          "Active",
          "Completed",
          "Revenue",
          "Total Amt",
          "Pending",
        ],
      ],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(`fitter-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  // Download CSV
  const downloadCSV = () => {
    const headers = [
      "Name",
      "Phone",
      "Date",
      "Check-in",
      "Check-out",
      "Total Amount",
      "Given Amount",
      "Remaining",
      "Transport",
      "Maintenance",
      "Status",
      "Fitter",
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

  // Print Report
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
            Generate and download comprehensive business reports
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={printReport} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={downloadCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button onClick={downloadCustomerPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === "custom" && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  End Date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Fitter</label>
            <Select value={fitterFilter} onValueChange={setFitterFilter}>
              <SelectTrigger>
                <Users className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fitters</SelectItem>
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

      {/* Tabs for different reports */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="print:hidden">
          <TabsTrigger value="customers">
            <Users className="h-4 w-4 mr-2" />
            Customer Report
          </TabsTrigger>
          <TabsTrigger value="items">
            <Package className="h-4 w-4 mr-2" />
            Inventory Report
          </TabsTrigger>
          <TabsTrigger value="financial">
            <DollarSign className="h-4 w-4 mr-2" />
            Financial Report
          </TabsTrigger>
          <TabsTrigger value="fitters">
            <TrendingUp className="h-4 w-4 mr-2" />
            Fitter Performance
          </TabsTrigger>
        </TabsList>

        {/* Customer Report Tab */}
        <TabsContent value="customers" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Bookings
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
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{(customerSummary.totalRevenue || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  ₹{(customerSummary.totalPending || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {customerSummary.activeBookings || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Table */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Fitter</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No data available for selected filters
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
                            {format(
                              new Date(customer.registrationDate),
                              "dd/MM/yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            ₹{customer.totalAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-green-600">
                            ₹{customer.givenAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-orange-600">
                            ₹{customer.remainingAmount.toLocaleString("en-IN")}
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

        {/* Item Report Tab */}
        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-end gap-2 print:hidden mb-4">
            <Button onClick={downloadItemPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download Item Report PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Items
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
                  Total Quantity
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
                  Available
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
                  Rented
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
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{(itemSummary.totalValue || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Qty</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Rented</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No items available
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
                          <TableCell>₹{item.price}</TableCell>
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

        {/* Financial Report Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="flex justify-end gap-2 print:hidden mb-4">
            <Button onClick={downloadFinancialPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download Financial Report PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{(financial.totalRevenue || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  ₹{(financial.pendingPayments || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Collection Rate
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
                  Transport Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  ₹{(financial.transportRevenue || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Maintenance Charges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  ₹{(financial.maintenanceCharges || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Deposit Collected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  ₹{(financial.depositCollected || 0).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Revenue Table */}
          {dailyRevenue.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Revenue</TableHead>
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
                            ₹{day.revenue.toLocaleString("en-IN")}
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

        {/* Fitter Performance Tab */}
        <TabsContent value="fitters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fitter-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fitter Name</TableHead>
                      <TableHead>Total Bookings</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Pending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fitterReport.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          {customerLoading
                            ? "Loading..."
                            : 'No fitter data available. Try changing report type to "Fitter-wise".'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      fitterReport.map((fitter, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {fitter._id || "Unassigned"}
                          </TableCell>
                          <TableCell>{fitter.totalBookings}</TableCell>
                          <TableCell className="text-blue-600">
                            {fitter.activeBookings}
                          </TableCell>
                          <TableCell className="text-green-600">
                            {fitter.completedBookings}
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            ₹{fitter.totalRevenue.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            ₹{fitter.totalAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-orange-600">
                            ₹{fitter.pendingAmount.toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Tip: To see fitter-wise breakdown, make sure you have assigned
              fitters to your bookings and select a date range above.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
