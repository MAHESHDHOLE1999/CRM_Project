import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  Globe,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { customerService } from "@/services/customerService";
import CustomerForm from "@/components/customers/CustomerForm";
import { format } from "date-fns";
import { useAuthStore } from "../store/authStore";

export default function Customers() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [billLanguageDialogOpen, setBillLanguageDialogOpen] = useState(false);
  const [selectedCustomerForBill, setSelectedCustomerForBill] = useState(null);
  const [billLanguage, setBillLanguage] = useState("en");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["customers", { search, status: statusFilter }],
    queryFn: () => customerService.getAll({ search, status: statusFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      toast.success(t("common.deleteSuccess"));
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      setIsDeleting(false);
    },
    onError: () => {
      toast.error(t("common.deleteError"));
      setIsDeleting(false);
    },
  });

  const customers = data?.data?.data?.customers || [];

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      setIsDeleting(true);
      deleteMutation.mutate(customerToDelete._id);
    }
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      Active: "default",
      Completed: "secondary",
      Cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {t(`customer.${status.toLowerCase()}`)}
      </Badge>
    );
  };

  // ✅ Open language selector dialog
  const handleDownloadBillClick = (customer) => {
    setSelectedCustomerForBill(customer);
    setBillLanguage("en"); // Reset to English
    setBillLanguageDialogOpen(true);
  };

  // ✅ Download bill with selected language
  const handleDownloadBill = () => {
    if (!selectedCustomerForBill || !selectedCustomerForBill._id) {
      toast.error(t("common.deleteError"));
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const downloadUrl = `${apiUrl}/customers/${selectedCustomerForBill._id}/bill?language=${billLanguage}`;

    fetch(downloadUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const languageLabel = billLanguage === 'mr' ? 'Marathi' : 'English';
        a.download = `Bill_${selectedCustomerForBill.name}_${billLanguage.toUpperCase()}_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(t("common.savingSuccess"));
        setBillLanguageDialogOpen(false);
      })
      .catch((error) => {
        console.error("Download error:", error);
        toast.error(t("common.deleteError"));
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("customer.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("customer.manageCustomers")}
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t("customer.addNew")}
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("customer.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 focus:outline-none focus:ring-0"
              style={{ outline: 'none', boxShadow: 'none' }}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 focus:outline-none focus:ring-0" style={{ outline: 'none', boxShadow: 'none' }}>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("customer.filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.selectOption")}</SelectItem>
              <SelectItem value="Active">{t("customer.active")}</SelectItem>
              <SelectItem value="Completed">
                {t("customer.completed")}
              </SelectItem>
              <SelectItem value="Cancelled">
                {t("customer.cancelled")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("customer.name")}</TableHead>
                <TableHead>{t("customer.phone")}</TableHead>
                <TableHead>{t("customer.registrationDate")}</TableHead>
                <TableHead>{t("customer.totalAmount")}</TableHead>
                <TableHead>{t("customer.remainingAmount")}</TableHead>
                <TableHead>{t("customer.status")}</TableHead>
                <TableHead>{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {t("common.loading")}
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
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
                      {format(
                        new Date(customer.registrationDate),
                        "dd/MM/yyyy"
                      )}
                    </TableCell>
                    <TableCell>
                      {t("common.rs")}{customer.totalAmount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          customer.remainingAmount > 0
                            ? "text-orange-600 font-semibold"
                            : "text-green-600"
                        }
                      >
                        {t("common.rs")}{customer.remainingAmount.toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("common.edit")}
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("common.delete")}
                          onClick={() => handleDeleteClick(customer)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("customer.downloadBill")}
                          onClick={() => handleDownloadBillClick(customer)}
                        >
                          <Download className="h-4 w-4" />
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

      {/* Edit Customer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer ? t("common.edit") : t("customer.addNew")}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={selectedCustomer}
            onSuccess={() => {
              setDialogOpen(false);
              queryClient.invalidateQueries(["customers"]);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Bill Language Selection Dialog */}
      <Dialog open={billLanguageDialogOpen} onOpenChange={setBillLanguageDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Select Bill Language / बिल भाषा निवडा
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Choose the language for the bill / बिलासाठी भाषा निवडा
            </p>

            <div className="space-y-2">
              {/* English Option */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  billLanguage === 'en'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setBillLanguage('en')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                    {billLanguage === 'en' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">English</p>
                    <p className="text-sm text-gray-600">Download bill in English</p>
                  </div>
                </div>
              </div>

              {/* Marathi Option */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  billLanguage === 'mr'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setBillLanguage('mr')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                    {billLanguage === 'mr' && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">मराठी (Marathi)</p>
                    <p className="text-sm text-gray-600">बिल मराठीमध्ये डाउनलोड करा</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setBillLanguageDialogOpen(false)}
                className="flex-1"
              >
                Cancel / रद्द करा
              </Button>
              <Button
                onClick={handleDownloadBill}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download / डाउनलोड करा
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Professional Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-lg">{t("common.deleteConfirmation")}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="mt-4">
              <div className="space-y-4">
                <p>{t("common.deleteWarning") || "This action cannot be undone. Please be certain."}</p>
                
                {customerToDelete && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">{t("customer.name")}</p>
                        <p className="font-semibold text-slate-900">{customerToDelete.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("customer.phone")}</p>
                        <p className="font-semibold text-slate-900">
                          {customerToDelete.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("customer.totalAmount")}</p>
                        <p className="font-semibold text-slate-900">
                          ₹{customerToDelete.totalAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    {t("common.deleteWarning2") || "Once deleted, this customer cannot be recovered."}
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {t("common.deleting") || "Deleting..."}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("common.delete")}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}