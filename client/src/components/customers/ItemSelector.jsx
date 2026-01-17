// // File: components/customers/ItemSelector.jsx
// // UPDATED: Dark Mode Support + Text Input Mode

// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useTranslation } from "react-i18next";
// import { Plus, Trash2, Package, Search, X } from "lucide-react";
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

// const formatNumberInput = (value) => {
//   if (value === "" || value === null) return "";
//   return value.toString().replace(/[^0-9]/g, "");
// };

// const formatDecimalInput = (value) => {
//   if (value === "" || value === null) return "";
//   const cleaned = value.toString().replace(/[^0-9.]/g, "");
//   const parts = cleaned.split(".");
//   if (parts.length > 2) {
//     return parts[0] + "." + parts[1];
//   }
//   return cleaned;
// };

// export default function ItemSelector({ selectedItems = [], onItemsChange }) {
//   const { t } = useTranslation();
//   const [items, setItems] = useState(selectedItems);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openDropdown, setOpenDropdown] = useState(null);

//   const { data: availableItems, isLoading } = useQuery({
//     queryKey: ["available-items"],
//     queryFn: () => itemService.getAll({ inStock: "true" }),
//   });

//   const allItems = availableItems?.data?.data?.items || [];

//   // Filter items based on search query
//   const filteredItems = allItems.filter(item =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

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
//       setSearchQuery("");
//       setOpenDropdown(null);
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
//         <Label className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//           {t("customer.selectItem") || "Select Items"}
//         </Label>
//         <Button type="button" onClick={addItem} size="sm">
//           <Plus className="h-4 w-4 mr-2" />
//           {t("common.addItem") || "Add Item"}
//         </Button>
//       </div>

//       {/* Info Banner */}
//       <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
//         <p className="text-sm text-amber-800 dark:text-amber-200">
//           ✅ <strong>Text Input Mode:</strong> Quantity and Price fields use text input only. No mouse wheel scrolling allowed.
//         </p>
//       </div>

//       {items.length === 0 ? (
//         <Card className="border-dashed border-gray-300 dark:border-gray-700">
//           <CardContent className="flex flex-col items-center justify-center py-8">
//             <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
//             <p className="text-gray-600 dark:text-gray-400 text-center">
//               {t("customer.noItemsSelected") || "No items selected. Click 'Add Item' to select items for this booking."}
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-3">
//           {items.map((item, index) => (
//             <Card key={index} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
//               <CardContent className="pt-4">
//                 <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
//                   {/* Item Selection with Search */}
//                   <div className="md:col-span-2 relative">
//                     <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                       {t("customer.item") || "Item"} *
//                     </Label>

//                     {/* ✅ NEW: Searchable Item Dropdown */}
//                     <div className="relative">
//                       <button
//                         type="button"
//                         onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
//                         className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500"
//                       >
//                         <span className="truncate">{item.itemName || "Select item..."}</span>
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                         </svg>
//                       </button>

//                       {/* ✅ Dropdown with Search */}
//                       {openDropdown === index && (
//                         <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 shadow-lg z-50">
//                           {/* Search Input */}
//                           <div className="p-2 border-b border-gray-200 dark:border-gray-700">
//                             <div className="relative">
//                               <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
//                               <input
//                                 type="text"
//                                 placeholder={t("common.search") || "Search items..."}
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 autoFocus
//                               />
//                             </div>
//                           </div>

//                           {/* Items List */}
//                           <div className="max-h-48 overflow-y-auto">
//                             {isLoading ? (
//                               <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
//                                 {t("common.loading") || "Loading..."}
//                               </div>
//                             ) : filteredItems.length === 0 ? (
//                               <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
//                                 {t("common.noData") || "No items found"}
//                               </div>
//                             ) : (
//                               filteredItems.map((availableItem) => (
//                                 <button
//                                   key={availableItem._id}
//                                   type="button"
//                                   onClick={() => {
//                                     updateItem(index, "itemId", availableItem._id);
//                                   }}
//                                   className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
//                                 >
//                                   <div className="flex-1">
//                                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                                       {availableItem.name}
//                                     </p>
//                                     <p className="text-xs text-gray-600 dark:text-gray-400">
//                                       ₹{availableItem.price.toLocaleString("en-IN")}
//                                     </p>
//                                   </div>
//                                   <Badge variant="outline" className="text-xs">
//                                     {availableItem.availableQuantity}
//                                   </Badge>
//                                 </button>
//                               ))
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>  

//                     {/* <Select
//                       value={item.itemId}
//                       onValueChange={(value) => updateItem(index, "itemId", value)}
//                     >
//                       <SelectTrigger className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
//                         <SelectValue placeholder={t("customer.selectItem") || "Select item"} />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600">
//                         {isLoading ? (
//                           <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
//                             {t("common.loading") || "Loading"}...
//                           </div>
//                         ) : allItems.length === 0 ? (
//                           <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
//                             {t("common.noData") || "No items available"}
//                           </div>
//                         ) : (
//                           allItems.map((availableItem) => (
//                             <SelectItem key={availableItem._id} value={availableItem._id}>
//                               <span className="text-gray-900 dark:text-gray-100">{availableItem.name}</span>
//                               <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
//                                 (Available: {availableItem.availableQuantity})
//                               </span>
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select> */}
//                   </div>

//                   {/* Quantity - TEXT INPUT ONLY */}
//                   <div>
//                     <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                       {t("customer.quantity") || "Qty"} *
//                     </Label>
//                     <Input
//                       type="text"
//                       inputMode="numeric"
//                       value={item.quantity}
//                       onChange={(e) => {
//                         const formatted = formatNumberInput(e.target.value);
//                         updateItem(index, "quantity", formatted === "" ? "" : parseInt(formatted));
//                       }}
//                       placeholder="1"
//                       className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold placeholder-gray-500 dark:placeholder-gray-400"
//                       onWheel={(e) => e.preventDefault()}
//                     />
//                     {item.availableQty > 0 && (
//                       <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                         Max: {item.availableQty}
//                       </p>
//                     )}
//                   </div>

//                   {/* Price - TEXT INPUT ONLY */}
//                   <div>
//                     <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                       {t("customer.pricePerUnit") || "Price"}
//                     </Label>
//                     <Input
//                       type="text"
//                       inputMode="decimal"
//                       value={item.price}
//                       onChange={(e) => {
//                         const formatted = formatDecimalInput(e.target.value);
//                         updateItem(index, "price", formatted === "" ? "" : parseFloat(formatted));
//                       }}
//                       placeholder="0"
//                       className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold placeholder-gray-500 dark:placeholder-gray-400"
//                       onWheel={(e) => e.preventDefault()}
//                     />
//                   </div>

//                   {/* Subtotal - Display Only */}
//                   <div>
//                     <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                       {t("customer.subtotal") || "Subtotal"}
//                     </Label>
//                     <div className="h-10 flex items-center font-bold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded border border-gray-200 dark:border-gray-700 px-3">
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
//                   <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded">
//                     <p className="text-sm text-red-700 dark:text-red-300">
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
//         <Card className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
//           <CardContent className="pt-4">
//             <div className="flex justify-between items-center">
//               <span className="font-semibold text-lg text-green-900 dark:text-green-100">
//                 {t("customer.itemsTotal") || "Items Total"}:
//               </span>
//               <span className="text-3xl font-bold text-green-600 dark:text-green-400">
//                 ₹{calculateTotal().toLocaleString("en-IN")}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

// =====================================================
// FILE 1: components/customers/ItemSelector.jsx
// =====================================================

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { itemService } from "@/services/itemService";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  const { data: availableItems, isLoading, error } = useQuery({
    queryKey: ["available-items"],
    queryFn: () => itemService.getAll({ inStock: "true" }),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const allItems = availableItems?.data?.data?.items || [];

  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      setSearchQuery("");
      setOpenDropdown(null);
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
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t("customer.selectItem") || "Select Items"}
        </Label>
        <Button type="button" onClick={addItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t("common.addItem") || "Add Item"}
        </Button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          ✅ <strong>Searchable Dropdown:</strong> Search and select from 50+ items. Text input only for quantity and price.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed border-gray-300 dark:border-gray-700">
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
                  {/* Item Selection Dropdown */}
                  <div className="md:col-span-2 relative">
                    <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {t("customer.item") || "Item"} *
                    </Label>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500"
                      >
                        <span className="truncate">{item.itemName || "Select item..."}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>

                      {openDropdown === index && (
                        <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 shadow-lg z-50">
                          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder={t("common.search") || "Search items..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                            </div>
                          </div>

                          <div className="max-h-48 overflow-y-auto">
                            {isLoading ? (
                              <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
                                {t("common.loading") || "Loading..."}
                              </div>
                            ) : error ? (
                              <div className="p-2 text-sm text-red-600 dark:text-red-400">
                                ❌ Error loading items
                              </div>
                            ) : filteredItems.length === 0 ? (
                              <div className="p-2 text-sm text-gray-600 dark:text-gray-400">
                                {allItems.length === 0 ? "No items available" : "No items found"}
                              </div>
                            ) : (
                              filteredItems.map((availableItem) => (
                                <button
                                  key={availableItem._id}
                                  type="button"
                                  onClick={() => {
                                    updateItem(index, "itemId", availableItem._id);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {availableItem.name}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      ₹{availableItem.price.toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {availableItem.availableQuantity}
                                  </Badge>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
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
                      className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold"
                      onWheel={(e) => e.preventDefault()}
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
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
                      className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold"
                      onWheel={(e) => e.preventDefault()}
                    />
                  </div>

                  {/* Subtotal */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {t("customer.subtotal") || "Subtotal"}
                    </Label>
                    <div className="h-10 flex items-center font-bold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded border border-gray-200 dark:border-gray-700 px-3">
                      ₹{(parseInt(item.quantity || 0) * parseFloat(item.price || 0)).toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Delete */}
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

                {item.quantity > item.availableQty && item.availableQty > 0 && (
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      ⚠️ Quantity exceeds available: {item.availableQty}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <Card className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
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