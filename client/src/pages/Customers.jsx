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
    },
    onError: () => {
      toast.error(t("common.deleteError"));
    },
  });

  const customers = data?.data?.data?.customers || [];

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm(t("common.confirmDelete"))) {
      deleteMutation.mutate(id);
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

  const handleDownloadBill = (customer) => {
    if (!customer || !customer._id) {
      toast.error(t("common.deleteError"));
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const downloadUrl = `${apiUrl}/customers/${customer._id}/bill`;

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
        a.download = `Bill_${customer.name}_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(t("common.savingSuccess"));
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
              style={{outline: 'none', boxShadow: 'none'}}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 focus:outline-none focus:ring-0" style={{outline: 'none', boxShadow: 'none'}}>
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
                          onClick={() => handleDelete(customer._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("customer.downloadBill")}
                          onClick={() => handleDownloadBill(customer)}
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
    </div>
  );
}