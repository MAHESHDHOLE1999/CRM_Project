// // File: components/customers/ItemSelector.jsx
// // UPDATED: All numeric inputs changed to text inputs
// // No scroll-based number changes allowed

// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useTranslation } from "react-i18next";
// import { Plus, Trash2, Package } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { itemService } from "@/services/itemService";

// // ✅ Helper function to format number input - only allows numeric characters
// const formatNumberInput = (value) => {
//   if (value === "" || value === null) return "";
//   // Remove all non-numeric characters
//   return value.toString().replace(/[^0-9]/g, "");
// };

// // ✅ Helper function to format decimal input - allows numbers and decimal point
// const formatDecimalInput = (value) => {
//   if (value === "" || value === null) return "";
//   // Remove non-numeric characters except decimal point
//   const cleaned = value.toString().replace(/[^0-9.]/g, "");
//   // Ensure only one decimal point
//   const parts = cleaned.split(".");
//   if (parts.length > 2) {
//     return parts[0] + "." + parts[1];
//   }
//   return cleaned;
// };

// export default function ItemSelector({ selectedItems = [], onItemsChange }) {
//   const { t } = useTranslation();
//   const [items, setItems] = useState(selectedItems);

//   const { data: availableItems, isLoading } = useQuery({
//     queryKey: ["available-items"],
//     queryFn: () => itemService.getAll({ inStock: "true" }),
//   });

//   const allItems = availableItems?.data?.data?.items || [];

//   useEffect(() => {
//     onItemsChange(items);
//   }, [items, onItemsChange]);

//   const addItem = () => {
//     setItems([
//       ...items,
//       { itemId: "", itemName: "", quantity: 1, price: 0, availableQty: 0 },
//     ]);
//   };

//   const removeItem = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const updateItem = (index, field, value) => {
//     const newItems = [...items];

//     if (field === "itemId") {
//       const selectedItem = allItems.find((item) => item._id === value);
//       if (selectedItem) {
//         newItems[index] = {
//           itemId: selectedItem._id,
//           itemName: selectedItem.name,
//           quantity: 1,
//           price: selectedItem.price,
//           availableQty: selectedItem.availableQuantity,
//         };
//       }
//     } else {
//       newItems[index][field] = value;
//     }

//     setItems(newItems);
//   };

//   const calculateTotal = () => {
//     return items.reduce((sum, item) => sum + parseInt(item.quantity || 0) * parseFloat(item.price || 0), 0);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <Label className="text-lg font-semibold">{t("customer.selectItem") || "Select Items"}</Label>
//         <Button type="button" onClick={addItem} size="sm">
//           <Plus className="h-4 w-4 mr-2" />
//           {t("common.addItem") || "Add Item"}
//         </Button>
//       </div>

//       {/* Info Banner */}
//       <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
//         <p className="text-sm text-amber-800">
//           ✅ <strong>Text Input Mode:</strong> Quantity and Price fields use text input only. No mouse wheel scrolling allowed.
//         </p>
//       </div>

//       {items.length === 0 ? (
//         <Card className="border-dashed">
//           <CardContent className="flex flex-col items-center justify-center py-8">
//             <Package className="h-12 w-12 text-muted-foreground mb-4" />
//             <p className="text-muted-foreground text-center">
//               {t("customer.noItemsSelected") || "No items selected. Click 'Add Item' to select items for this booking."}
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-3">
//           {items.map((item, index) => (
//             <Card key={index}>
//               <CardContent className="pt-4">
//                 <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
//                   {/* Item Selection */}
//                   <div className="md:col-span-2">
//                     <Label className="text-xs font-semibold">{t("customer.item") || "Item"} *</Label>
//                     <Select
//                       value={item.itemId}
//                       onValueChange={(value) =>
//                         updateItem(index, "itemId", value)
//                       }
//                     >
//                       <SelectTrigger
//                         style={{ outline: "none", boxShadow: "none" }}
//                       >
//                         <SelectValue placeholder={t("customer.selectItem") || "Select item"} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {isLoading ? (
//                           <div className="p-2 text-sm text-muted-foreground">
//                             {t("common.loading") || "Loading"}...
//                           </div>
//                         ) : allItems.length === 0 ? (
//                           <div className="p-2 text-sm text-muted-foreground">
//                             {t("common.noData") || "No items available"}
//                           </div>
//                         ) : (
//                           allItems.map((availableItem) => (
//                             <SelectItem
//                               key={availableItem._id}
//                               value={availableItem._id}
//                             >
//                               {availableItem.name}
//                               <span className="text-xs text-muted-foreground ml-2">
//                                 ({t("items.availableQuantity") || "Available"}: {availableItem.availableQuantity})
//                               </span>
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Quantity - TEXT INPUT ONLY */}
//                   <div>
//                     <Label className="text-xs font-semibold">{t("customer.quantity") || "Qty"} *</Label>
//                     <Input
//                       type="text"
//                       inputMode="numeric"
//                       value={item.quantity}
//                       onChange={(e) => {
//                         const formatted = formatNumberInput(e.target.value);
//                         updateItem(
//                           index,
//                           "quantity",
//                           formatted === "" ? "" : parseInt(formatted)
//                         );
//                       }}
//                       placeholder="1"
//                       className="border border-gray-300 bg-white font-semibold"
//                       style={{ outline: "none", boxShadow: "none" }}
//                       onWheel={(e) => e.preventDefault()}
//                     />
//                     {item.availableQty > 0 && (
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {t("common.max") || "Max"}: {item.availableQty}
//                       </p>
//                     )}
//                   </div>

//                   {/* Price - TEXT INPUT ONLY */}
//                   <div>
//                     <Label className="text-xs font-semibold">{t("customer.pricePerUnit") || "Price"}</Label>
//                     <Input
//                       type="text"
//                       inputMode="decimal"
//                       value={item.price}
//                       onChange={(e) => {
//                         const formatted = formatDecimalInput(e.target.value);
//                         updateItem(
//                           index,
//                           "price",
//                           formatted === "" ? "" : parseFloat(formatted)
//                         );
//                       }}
//                       placeholder="0"
//                       className="border border-gray-300 bg-white font-semibold"
//                       style={{ outline: "none", boxShadow: "none" }}
//                       onWheel={(e) => e.preventDefault()}
//                     />
//                   </div>

//                   {/* Subtotal - Display Only */}
//                   <div>
//                     <Label className="text-xs font-semibold">{t("customer.subtotal") || "Subtotal"}</Label>
//                     <div className="h-10 flex items-center font-bold bg-gray-50 rounded border border-gray-200 px-3">
//                       ₹{(parseInt(item.quantity || 0) * parseFloat(item.price || 0)).toLocaleString("en-IN")}
//                     </div>
//                   </div>

//                   {/* Delete Button */}
//                   <div>
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="icon"
//                       onClick={() => removeItem(index)}
//                       title={t("common.remove") || "Remove"}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Quantity Warning */}
//                 {item.quantity > item.availableQty && item.availableQty > 0 && (
//                   <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
//                     <p className="text-sm text-red-700">
//                       ⚠️ <strong>Warning:</strong> Requested quantity ({item.quantity}) exceeds available quantity ({item.availableQty})
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {items.length > 0 && (
//         <Card className="bg-green-50 border border-green-200">
//           <CardContent className="pt-4">
//             <div className="flex justify-between items-center">
//               <span className="font-semibold text-lg">{t("customer.itemsTotal") || "Items Total"}:</span>
//               <span className="text-3xl font-bold text-green-600">
//                 ₹{calculateTotal().toLocaleString("en-IN")}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

// File: components/customers/ItemSelector.jsx
// UPDATED: Dark Mode Support + Text Input Mode

// File: components/customers/ItemSelector.jsx
// UPDATED: Dark Mode Support + Text Input Mode

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { itemService } from "@/services/itemService";

const inputStyles = `
  input, textarea, select {
    color: #000000 !important;
  }
  
  input::placeholder {
    color: #999999 !important;
  }
  
  @media (prefers-color-scheme: dark) {
    input, textarea, select {
      color: #ffffff !important;
      background-color: #1f2937 !important;
      border-color: #4b5563 !important;
    }
    
    input::placeholder {
      color: #9ca3af !important;
    }
  }
`;

const formatNumberInput = (value) => {
  if (value === "" || value === null) return "";
  return value.toString().replace(/[^0-9]/g, "");
};

const formatDecimalInput = (value) => {
  if (value === "" || value === null) return "";
  const cleaned = value.toString().replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts[1];
  }
  return cleaned;
};

export default function ItemSelector({ selectedItems = [], onItemsChange }) {
  const { t } = useTranslation();
  const [items, setItems] = useState(selectedItems);

  const { data: availableItems, isLoading } = useQuery({
    queryKey: ["available-items"],
    queryFn: () => itemService.getAll({ inStock: "true" }),
  });

  const allItems = availableItems?.data?.data?.items || [];

  useEffect(() => {
    onItemsChange(items);
  }, [items, onItemsChange]);

  const addItem = () => {
    setItems([
      ...items,
      { itemId: "", itemName: "", quantity: 1, price: 0, availableQty: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];

    if (field === "itemId") {
      const selectedItem = allItems.find((item) => item._id === value);
      if (selectedItem) {
        newItems[index] = {
          itemId: selectedItem._id,
          itemName: selectedItem.name,
          quantity: 1,
          price: selectedItem.price,
          availableQty: selectedItem.availableQuantity,
        };
      }
    } else {
      newItems[index][field] = value;
    }

    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + parseInt(item.quantity || 0) * parseFloat(item.price || 0), 0);
  };

  return (
    <div className="space-y-4">
      <style>{inputStyles}</style>
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("customer.selectItem") || "Select Items"}
        </Label>
        <Button type="button" onClick={addItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t("common.addItem") || "Add Item"}
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          ✅ <strong>Text Input Mode:</strong> Quantity and Price fields use text input only. No mouse wheel scrolling allowed.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {t("customer.noItemsSelected") || "No items selected. Click 'Add Item' to select items for this booking."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  {/* Item Selection */}
                  <div className="md:col-span-2">
                    <Label className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {t("customer.item") || "Item"} *
                    </Label>
                    <Select
                      value={item.itemId}
                      onValueChange={(value) => updateItem(index, "itemId", value)}
                    >
                      <SelectTrigger className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white">
                        <SelectValue placeholder={t("customer.selectItem") || "Select item"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600">
                        {isLoading ? (
                          <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
                            {t("common.loading") || "Loading"}...
                          </div>
                        ) : allItems.length === 0 ? (
                          <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
                            {t("common.noData") || "No items available"}
                          </div>
                        ) : (
                          allItems.map((availableItem) => (
                            <SelectItem key={availableItem._id} value={availableItem._id}>
                              <span className="text-gray-900 dark:text-gray-100">{availableItem.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                (Available: {availableItem.availableQuantity})
                              </span>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity - TEXT INPUT ONLY */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {t("customer.quantity") || "Qty"} *
                    </Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) => {
                        const formatted = formatNumberInput(e.target.value);
                        updateItem(index, "quantity", formatted === "" ? "" : parseInt(formatted));
                      }}
                      placeholder="1"
                      className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold placeholder-gray-600 dark:placeholder-gray-400"
                      onWheel={(e) => e.preventDefault()}
                    />
                    {item.availableQty > 0 && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Max: {item.availableQty}
                      </p>
                    )}
                  </div>

                  {/* Price - TEXT INPUT ONLY */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {t("customer.pricePerUnit") || "Price"}
                    </Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={item.price}
                      onChange={(e) => {
                        const formatted = formatDecimalInput(e.target.value);
                        updateItem(index, "price", formatted === "" ? "" : parseFloat(formatted));
                      }}
                      placeholder="0"
                      className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold placeholder-gray-600 dark:placeholder-gray-400"
                      onWheel={(e) => e.preventDefault()}
                    />
                  </div>

                  {/* Subtotal - Display Only */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {t("customer.subtotal") || "Subtotal"}
                    </Label>
                    <div className="mt-1 h-10 flex items-center font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded border border-gray-200 dark:border-gray-700 px-3">
                      ₹{(parseInt(item.quantity || 0) * parseFloat(item.price || 0)).toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(index)}
                      title={t("common.remove") || "Remove"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Quantity Warning */}
                {item.quantity > item.availableQty && item.availableQty > 0 && (
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      ⚠️ <strong>Warning:</strong> Requested quantity ({item.quantity}) exceeds available quantity ({item.availableQty})
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <Card className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg text-green-900 dark:text-green-100">
                {t("customer.itemsTotal") || "Items Total"}:
              </span>
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                ₹{calculateTotal().toLocaleString("en-IN")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}