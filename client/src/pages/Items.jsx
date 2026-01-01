import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Plus, Search, Filter, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { itemService } from "@/services/itemService";
import ItemForm from "@/components/items/ItemForm";

export default function Items() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["items", { search, status: statusFilter }],
    queryFn: () => itemService.getAll({ search, status: statusFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => itemService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
      toast.success(t("common.deleteSuccess"));
    },
    onError: () => {
      toast.error(t("common.deleteError"));
    },
  });

  const items = data?.data?.data?.items || [];

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm(t("common.confirmDelete"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  // Determine actual status based on quantities (NOT stored status field)
  const getActualStatus = (item) => {
    if (item.totalQuantity === 0) {
      return "NotAvailable";
    }
    
    if (item.availableQuantity === 0) {
      return "NotAvailable"; // All items are rented
    }
    
    if (item.rentedQuantity > 0) {
      return "InUse"; // Some items are rented, some are available
    }
    
    return "Available"; // All items are available for rent
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-500";
      case "InUse":
        return "bg-blue-500";
      case "NotAvailable":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Available: "default",
      InUse: "secondary",
      NotAvailable: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {t(`items.${status.toLowerCase()}`)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("items.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("items.manageInventory")}
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t("items.addNew")}
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("items.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 focus:outline-none focus:ring-0"
              style={{ outline: 'none', boxShadow: 'none' }}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 focus:outline-none focus:ring-0" style={{ outline: 'none', boxShadow: 'none' }}>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("common.filter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.selectOption")}</SelectItem>
              <SelectItem value="Available">{t("items.available")}</SelectItem>
              <SelectItem value="InUse">{t("items.inUse")}</SelectItem>
              <SelectItem value="NotAvailable">
                {t("items.notAvailable")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">{t("common.loading")}</div>
        </div>
      ) : items.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("common.noData")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("items.getStarted")}
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              {t("items.addNew")}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => {
            const actualStatus = getActualStatus(item);
            
            return (
              <Card key={item._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        actualStatus
                      )}`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <CardTitle className="text-lg mb-1">{item.name}</CardTitle>
                    {item.nameMarathi && (
                      <p className="text-sm text-muted-foreground">
                        {item.nameMarathi}
                      </p>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {item.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  )}

                  {/* Quantity Information */}
                  <div className="space-y-1 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("items.totalQuantity")}:
                      </span>
                      <span className="font-semibold">{item.totalQuantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("items.availableQuantity")}:
                      </span>
                      <span className={`font-semibold ${
                        item.availableQuantity > 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {item.availableQuantity}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("items.rentedQuantity")}:
                      </span>
                      <span className={`font-semibold ${
                        item.rentedQuantity > 0 
                          ? 'text-orange-600' 
                          : 'text-gray-500'
                      }`}>
                        {item.rentedQuantity}
                      </span>
                    </div>

                    {/* Utilization Bar */}
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">
                          Utilization
                        </span>
                        <span className="text-xs font-semibold">
                          {item.totalQuantity > 0 
                            ? Math.round((item.rentedQuantity / item.totalQuantity) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{
                            width: item.totalQuantity > 0 
                              ? `${(item.rentedQuantity / item.totalQuantity) * 100}%`
                              : '0%'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold">
                      {t("common.rs")}{item.price}{t("items.priceSuffix")}
                    </span>
                    {getStatusBadge(actualStatus)}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                      disabled={item.rentedQuantity > 0}
                      title={item.rentedQuantity > 0 ? "Cannot delete items that are currently rented" : "Delete item"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? t("common.edit") : t("items.addNew")}
            </DialogTitle>
          </DialogHeader>
          <ItemForm
            item={selectedItem}
            onSuccess={() => {
              setDialogOpen(false);
              queryClient.invalidateQueries(["items"]);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}