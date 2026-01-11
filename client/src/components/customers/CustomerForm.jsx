// // File: components/customers/CustomerForm.jsx
// // UPDATED: ALL number inputs converted to text inputs
// // Admin must manually enter all amounts - no scroll wheel changes

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { useTranslation } from "react-i18next";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card } from "@/components/ui/card";
// import { customerService } from "@/services/customerService";
// import ItemSelector from "./ItemSelector";
// import { Calculator } from "lucide-react";

// const inputStyles = `
//   input:focus,
//   textarea:focus {
//     outline: none !important;
//     box-shadow: none !important;
//   }
// `;

// // ✅ Helper function to format decimal input
// const formatDecimalInput = (value) => {
//   if (value === "" || value === null) return "";
//   const cleaned = value.toString().replace(/[^0-9.]/g, "");
//   const parts = cleaned.split(".");
//   if (parts.length > 2) {
//     return parts[0] + "." + parts[1];
//   }
//   return cleaned;
// };

// // ✅ Helper function to parse number
// const parseNumberInput = (value) => {
//   if (value === "" || value === null) return 0;
//   const num = parseFloat(value);
//   return isNaN(num) ? 0 : num;
// };

// const optionalNumber = z.preprocess(
//   (val) => (val === "" || val === null ? undefined : Number(val)),
//   z.number().min(0).optional()
// );

// const customerSchema = z.object({
//   name: z.string().min(1, "Customer name is required"),
//   phone: z
//     .string()
//     .min(10, "Phone number must be at least 10 digits")
//     .regex(/^[0-9+\-\s()]*$/, "Phone number contains invalid characters"),
//   address: z.string().optional().nullable(),
//   checkInDate: z.string().min(1, "Check-in date is required"),
//   checkInTime: z.string().min(1, "Check-in time is required"),
//   totalAmount: optionalNumber,
//   depositAmount: optionalNumber,
//   givenAmount: optionalNumber,
//   transportRequired: z.boolean().default(false),
//   transportCost: optionalNumber,
//   transportLocation: z.string().optional().nullable(),
//   maintenanceCharges: optionalNumber,
//   fitterName: z.string().optional().nullable(),
//   status: z.string().min(1, "Status is required"),
//   notes: z.string().optional().nullable(),
// });

// export default function CustomerForm({ customer, onSuccess }) {
//   const { t } = useTranslation();
//   const queryClient = useQueryClient();
//   const [selectedItems, setSelectedItems] = useState(
//     customer?.items ? customer.items : []
//   );
//   const [itemsTotal, setItemsTotal] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [debugErrors, setDebugErrors] = useState([]);
//   const [isLoadingCustomer, setIsLoadingCustomer] = useState(!!customer?._id);
  
//   const [itemsCheckoutData, setItemsCheckoutData] = useState({});
//   const [totalPerItemExtraCharges, setTotalPerItemExtraCharges] = useState(0);
//   const [isCalculating, setIsCalculating] = useState(false);

//   const getTodayDate = () => new Date().toISOString().split("T")[0];

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//     getValues,
//   } = useForm({
//     resolver: zodResolver(customerSchema),
//     mode: "onChange",
//     defaultValues: {
//       name: "",
//       phone: "",
//       address: "",
//       checkInDate: getTodayDate(),
//       checkInTime: "10:00",
//       totalAmount: "",
//       depositAmount: "",
//       givenAmount: "",
//       transportRequired: false,
//       transportCost: "",
//       transportLocation: "",
//       maintenanceCharges: "",
//       fitterName: "",
//       status: "Active",
//       notes: "",
//     },
//   });

//   useEffect(() => {
//     const fetchCustomerData = async () => {
//       if (!customer?._id) {
//         setIsLoadingCustomer(false);
//         return;
//       }

//       try {
//         setIsLoadingCustomer(true);
//         const response = await customerService.getById(customer._id);
//         const fetchedCustomer = response.data.data || response.data;

//         if (fetchedCustomer) {
//           setValue("name", fetchedCustomer.name || "");
//           setValue("phone", fetchedCustomer.phone || "");
//           setValue("address", fetchedCustomer.address || "");

//           if (fetchedCustomer.checkInDate) {
//             const checkInDate = new Date(fetchedCustomer.checkInDate);
//             setValue("checkInDate", checkInDate.toISOString().split("T")[0]);
//           }

//           setValue("checkInTime", fetchedCustomer.checkInTime || "10:00");
//           setValue("hourlyRate", fetchedCustomer.hourlyRate || "");
//           setValue("totalAmount", fetchedCustomer.totalAmount || 0);
//           setValue("depositAmount", fetchedCustomer.depositAmount || 0);
//           setValue("givenAmount", fetchedCustomer.givenAmount || 0);
//           setValue("transportRequired", fetchedCustomer.transportRequired || false);
//           setValue("transportCost", fetchedCustomer.transportCost || 0);
//           setValue("transportLocation", fetchedCustomer.transportLocation || "");
//           setValue("maintenanceCharges", fetchedCustomer.maintenanceCharges || 0);
//           setValue("fitterName", fetchedCustomer.fitterName || "");
//           setValue("status", fetchedCustomer.status || "Active");
//           setValue("notes", fetchedCustomer.notes || "");

//           if (fetchedCustomer.itemsCheckoutData) {
//             setItemsCheckoutData(fetchedCustomer.itemsCheckoutData);
            
//             const totalExtra = Object.values(fetchedCustomer.itemsCheckoutData)
//               .reduce((sum, item) => sum + (parseFloat(item.extraCharges) || 0), 0);
//             setTotalPerItemExtraCharges(totalExtra);
//           }

//           if (fetchedCustomer.items && Array.isArray(fetchedCustomer.items)) {
//             const formattedItems = fetchedCustomer.items.map((item) => ({
//               _id: item._id || item.itemId,
//               itemId: item.itemId || item._id,
//               name: item.name || item.itemName,
//               itemName: item.itemName || item.name,
//               quantity: item.quantity,
//               price: item.price,
//             }));
//             setSelectedItems(formattedItems);
//           }
//         }

//         setIsLoadingCustomer(false);
//       } catch (error) {
//         console.error("Error fetching customer:", error);
//         toast.error(t("common.failedLoad") || "Failed to load customer data");
//         setIsLoadingCustomer(false);
//       }
//     };

//     fetchCustomerData();
//   }, [customer?._id, setValue, t]);

//   useEffect(() => {
//     const total = selectedItems.reduce(
//       (sum, item) =>
//         sum + parseFloat(item.quantity || 0) * parseFloat(item.price || 0),
//       0
//     );
//     setItemsTotal(total);
//   }, [selectedItems]);

//   useEffect(() => {
//     const transportCost = parseNumberInput(watch("transportCost")) || 0;
//     const maintenanceCharges = parseNumberInput(watch("maintenanceCharges")) || 0;
//     const newTotal =
//       itemsTotal + transportCost + maintenanceCharges + totalPerItemExtraCharges;

//     setValue("totalAmount", newTotal);
//   }, [
//     itemsTotal,
//     watch("transportCost"),
//     watch("maintenanceCharges"),
//     totalPerItemExtraCharges,
//     setValue,
//   ]);

//   const updateItemCheckout = (itemId, field, value) => {
//     setItemsCheckoutData((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         [field]: value,
//       },
//     }));
//   };

//   const calculateItemExtraCharges = async (itemId) => {
//     const formData = getValues();
//     const itemCheckout = itemsCheckoutData[itemId];

//     if (!itemCheckout?.checkOutDate || !itemCheckout?.checkOutTime) {
//       toast.error(t("customer.checkOutDateTimeRequired") || "Please enter checkout date and time");
//       return;
//     }

//     const hourlyRate = parseNumberInput(itemCheckout.hourlyRate);
//     if (!hourlyRate || hourlyRate <= 0) {
//       toast.error(t("customer.validHourlyRateRequired") || "Please enter a valid hourly rate");
//       return;
//     }

//     setIsCalculating(true);

//     try {
//       const response = await customerService.calculateDuration({
//         checkInDate: formData.checkInDate,
//         checkInTime: formData.checkInTime,
//         checkOutDate: itemCheckout.checkOutDate,
//         checkOutTime: itemCheckout.checkOutTime,
//         hourlyRate: hourlyRate,
//       });

//       if (response.data.success) {
//         const { fullDays, extraHours, extraCharges } = response.data.data;

//         const updatedCheckoutData = {
//           ...itemsCheckoutData,
//           [itemId]: {
//             ...itemsCheckoutData[itemId],
//             checkOutDate: itemCheckout.checkOutDate,
//             checkOutTime: itemCheckout.checkOutTime,
//             hourlyRate: hourlyRate,
//             rentalDays: fullDays,
//             extraHours: extraHours,
//             extraCharges: parseFloat(extraCharges),
//           },
//         };

//         setItemsCheckoutData(updatedCheckoutData);

//         const totalExtra = Object.values(updatedCheckoutData).reduce(
//           (sum, item) => sum + (parseFloat(item.extraCharges) || 0),
//           0
//         );

//         setTotalPerItemExtraCharges(totalExtra);

//         toast.success(
//           `✅ ${fullDays} ${t("customer.day") || "day"}(s), ${extraHours} ${t("customer.hour") || "hour"}(s) @ ₹${hourlyRate}/hr\n${t("customer.extraCharge") || "Extra Charge"}: ₹${extraCharges.toLocaleString("en-IN")}`
//         );
//       }
//     } catch (error) {
//       console.error("Calculate duration error:", error);
//       toast.error(t("customer.calculationFailed") || "Failed to calculate duration");
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const mutation = useMutation({
//     mutationFn: async (formData) => {
//       const errors = [];

//       if (selectedItems.length === 0) {
//         throw new Error(t("customer.selectAtLeastOneItem") || "Please select at least one item");
//       }

//       if (!formData.name?.trim()) errors.push(t("customer.nameRequired") || "Customer name is required");
//       if (!formData.phone?.trim()) errors.push(t("customer.phoneRequired") || "Phone number is required");
//       if (!formData.checkInDate) errors.push(t("customer.checkInDateRequired") || "Check-in date is required");
//       if (!formData.checkInTime) errors.push(t("customer.checkInTimeRequired") || "Check-in time is required");
//       if (!formData.status) errors.push(t("customer.statusRequired") || "Status is required");

//       const totalAmount = parseNumberInput(formData.totalAmount) || 0;
//       const givenAmount = parseNumberInput(formData.givenAmount) || 0;

//       if (givenAmount > totalAmount) {
//         errors.push(t("customer.givenExceedsTotal") || "Given amount exceeds total");
//       }

//       if (errors.length > 0) {
//         setDebugErrors(errors);
//         throw new Error(errors.join("\n"));
//       }

//       const payload = {
//         name: formData.name?.trim() || "",
//         phone: formData.phone?.trim() || "",
//         address: formData.address?.trim() || "",
//         checkInDate: formData.checkInDate || "",
//         checkInTime: formData.checkInTime || "",
//         totalAmount: parseNumberInput(formData.totalAmount) || 0,
//         depositAmount: parseNumberInput(formData.depositAmount) || 0,
//         givenAmount: givenAmount,
//         transportRequired: formData.transportRequired || false,
//         transportCost: parseNumberInput(formData.transportCost) || 0,
//         transportLocation: formData.transportLocation?.trim() || "",
//         maintenanceCharges: parseNumberInput(formData.maintenanceCharges) || 0,
//         fitterName: formData.fitterName?.trim() || "",
//         status: formData.status || "Active",
//         notes: formData.notes?.trim() || "",
//         items: selectedItems.map((item) => ({
//           itemId: item.itemId || item._id,
//           itemName: item.itemName || item.name,
//           quantity: parseInt(item.quantity) || 1,
//           price: parseFloat(item.price) || 0,
//         })),
//         itemsCheckoutData: itemsCheckoutData,
//       };

//       try {
//         let response;
//         if (customer?._id) {
//           response = await customerService.update(customer._id, payload);
//         } else {
//           response = await customerService.create(payload);
//         }
//         return response;
//       } catch (apiError) {
//         console.error("API Error:", apiError);
//         throw apiError;
//       }
//     },
//     onSuccess: () => {
//       setIsSubmitting(false);
//       setDebugErrors([]);
//       toast.success(
//         customer
//           ? t("customer.updateSuccess") || "Customer updated successfully!"
//           : t("customer.createSuccess") || "Customer created successfully!"
//       );
//       queryClient.invalidateQueries({ queryKey: ["customers"] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       setIsSubmitting(false);
//       let errorMsg = error.message || (t("common.savingError") || "Failed to save customer");
//       if (error.response?.data?.message) {
//         errorMsg = error.response.data.message;
//       }
//       setDebugErrors([errorMsg]);
//       toast.error(`❌ ${errorMsg}`);
//     },
//   });

//   const onSubmit = (formData) => {
//     setIsSubmitting(true);
//     mutation.mutate(formData);
//   };

//   const transportRequired = watch("transportRequired");

//   if (isLoadingCustomer && customer?._id) {
//     return (
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
//         <p className="text-lg font-semibold text-blue-900">
//           ⏳ {t("common.loading") || "Loading"}...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{inputStyles}</style>
//       <div className="space-y-6">
//         {debugErrors.length > 0 && (
//           <div className="bg-red-50 border border-red-300 rounded-lg p-4">
//             <h4 className="font-semibold text-red-800 mb-2">❌ {t("common.issuesFound") || "Issues Found"}:</h4>
//             {debugErrors.map((error, idx) => (
//               <p key={idx} className="text-sm text-red-700 mb-1">
//                 • {error}
//               </p>
//             ))}
//           </div>
//         )}

//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <Badge className="bg-blue-100">✅ TEXT INPUT MODE</Badge>
//           <p className="text-sm text-muted-foreground mt-2">
//             <strong>All numeric fields are text inputs.</strong> Admin must manually enter values. No scroll wheel changes allowed.
//           </p>
//         </div>

//         {/* Customer Information */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">{t("customer.customerInfo") || "Customer Information"}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>{t("customer.name")} *</Label>
//               <Input
//                 {...register("name")}
//                 placeholder={t("customer.name") || "Customer Name"}
//                 className="border border-gray-300 bg-white"
//               />
//               {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
//             </div>
//             <div>
//               <Label>{t("customer.phone")} *</Label>
//               <Input
//                 {...register("phone")}
//                 placeholder="9876543210"
//                 className="border border-gray-300 bg-white"
//               />
//               {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
//             </div>
//             <div className="md:col-span-2">
//               <Label>{t("customer.address") || "Address"}</Label>
//               <Input
//                 {...register("address")}
//                 placeholder={t("customer.address") || "Address"}
//                 className="border border-gray-300 bg-white"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Check-in Details */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">{t("customer.checkInDetails") || "Check-in Details"}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>{t("customer.checkInDate")} *</Label>
//               <Input
//                 type="date"
//                 {...register("checkInDate")}
//                 className="border border-gray-300"
//               />
//             </div>
//             <div>
//               <Label>{t("customer.checkInTime")} *</Label>
//               <Input
//                 type="time"
//                 {...register("checkInTime")}
//                 className="border border-gray-300"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Items with Per-Item Checkout */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">{t("customer.itemsCheckout") || "Items - Checkout & Hourly Rates"}</h3>
          
//           {selectedItems.length === 0 ? (
//             <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
//               <p className="text-muted-foreground">{t("customer.noItemsSelected") || "No items selected"}</p>
//             </div>
//           ) : (
//             <div className="space-y-4 mb-6">
//               {selectedItems.map((item, idx) => {
//                 const itemKey = item.itemId || item._id;
//                 const itemCheckout = itemsCheckoutData[itemKey] || {};

//                 return (
//                   <Card key={idx} className="p-4 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <Label className="text-sm font-semibold">{t("customer.item") || "Item"}</Label>
//                           <p className="text-base font-medium">{item.itemName || item.name}</p>
//                         </div>
//                         <div>
//                           <Label className="text-sm font-semibold">{t("customer.cost") || "Cost"}</Label>
//                           <p className="text-base">
//                             {item.quantity} × ₹{item.price.toLocaleString("en-IN")} = ₹
//                             {(item.quantity * item.price).toLocaleString("en-IN")}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="border-t pt-4">
//                         <Label className="text-sm font-semibold block mb-3">{t("customer.itemCheckoutDetails") || "Item Checkout Details"}</Label>
//                         <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
//                           <div>
//                             <Label className="text-xs">{t("customer.checkOutDate") || "Checkout Date"}</Label>
//                             <Input
//                               type="date"
//                               value={itemCheckout.checkOutDate || ""}
//                               onChange={(e) =>
//                                 updateItemCheckout(itemKey, "checkOutDate", e.target.value)
//                               }
//                               className="border border-gray-300"
//                             />
//                           </div>
//                           <div>
//                             <Label className="text-xs">{t("customer.time") || "Time"}</Label>
//                             <Input
//                               type="time"
//                               value={itemCheckout.checkOutTime || ""}
//                               onChange={(e) =>
//                                 updateItemCheckout(itemKey, "checkOutTime", e.target.value)
//                               }
//                               className="border border-gray-300"
//                             />
//                           </div>
//                           <div>
//                             <Label className="text-xs">{t("customer.hourlyRate")} (₹) *</Label>
//                             <Input
//                               type="text"
//                               inputMode="decimal"
//                               value={itemCheckout.hourlyRate || ""}
//                               onChange={(e) => {
//                                 const formatted = formatDecimalInput(e.target.value);
//                                 updateItemCheckout(itemKey, "hourlyRate", formatted);
//                               }}
//                               placeholder="100"
//                               className="border border-gray-300 bg-white font-semibold"
//                               onWheel={(e) => e.preventDefault()}
//                             />
//                           </div>
//                           <div className="md:col-span-2 flex items-end">
//                             <Button
//                               type="button"
//                               onClick={() => calculateItemExtraCharges(itemKey)}
//                               disabled={!itemCheckout.checkOutDate || !itemCheckout.checkOutTime || !itemCheckout.hourlyRate || isCalculating}
//                               className="w-full flex items-center justify-center gap-2"
//                             >
//                               <Calculator className="h-4 w-4" />
//                               {isCalculating ? t("common.calculating") || "Calculating..." : t("common.calculate") || "Calculate"}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>

//                       {itemCheckout.rentalDays !== undefined && (
//                         <div className="bg-white border border-orange-200 rounded-lg p-3">
//                           <div className="grid grid-cols-5 gap-2 text-center">
//                             <div>
//                               <p className="text-xs text-muted-foreground">{t("customer.days") || "Days"}</p>
//                               <p className="text-lg font-bold text-blue-600">{itemCheckout.rentalDays}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-muted-foreground">{t("customer.hours") || "Hours"}</p>
//                               <p className="text-lg font-bold text-orange-600">{itemCheckout.extraHours}h</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-muted-foreground">{t("customer.rate") || "Rate"}</p>
//                               <p className="text-sm font-bold text-purple-600">₹{itemCheckout.hourlyRate}/hr</p>
//                             </div>
//                             <div className="md:col-span-2">
//                               <p className="text-xs text-muted-foreground">{t("customer.extraCharge") || "Extra Charge"}</p>
//                               <p className="text-lg font-bold text-red-600">
//                                 ₹{itemCheckout.extraCharges?.toLocaleString("en-IN") || 0}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}

//           <ItemSelector selectedItems={selectedItems} onItemsChange={setSelectedItems} />
//           {selectedItems.length === 0 && (
//             <p className="text-sm text-red-600 font-medium mt-2">⚠️ {t("customer.selectAtLeastOneItem") || "Select at least one item"}</p>
//           )}
//         </div>

//         {/* Payment Summary */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">{t("customer.paymentInfo") || "Payment Summary"}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//               <p className="text-xs text-muted-foreground">{t("customer.itemsTotal") || "Items Cost"}</p>
//               <p className="text-2xl font-bold">₹{itemsTotal.toLocaleString("en-IN")}</p>
//             </div>

//             {totalPerItemExtraCharges > 0 && (
//               <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
//                 <p className="text-xs font-semibold text-orange-600">{t("customer.extraCharges") || "Extra Charges"}</p>
//                 <p className="text-2xl font-bold text-orange-600">
//                   ₹{totalPerItemExtraCharges.toLocaleString("en-IN")}
//                 </p>
//               </div>
//             )}

//             <div>
//               <Label>{t("customer.maintenanceCharges") || "Maintenance Charges"}</Label>
//               <Input
//                 type="text"
//                 inputMode="decimal"
//                 {...register("maintenanceCharges")}
//                 onChange={(e) => {
//                   const formatted = formatDecimalInput(e.target.value);
//                   setValue("maintenanceCharges", formatted);
//                 }}
//                 placeholder="0"
//                 className="border border-gray-300 bg-white font-semibold"
//                 onWheel={(e) => e.preventDefault()}
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Checkbox
//                 id="transport"
//                 checked={transportRequired}
//                 onCheckedChange={(checked) => setValue("transportRequired", checked)}
//               />
//               <Label htmlFor="transport">{t("customer.transport") || "Transport Required"}</Label>
//             </div>

//             {transportRequired && (
//               <>
//                 <div>
//                   <Label>{t("customer.transportCost") || "Transport Cost"}</Label>
//                   <Input
//                     type="text"
//                     inputMode="decimal"
//                     {...register("transportCost")}
//                     onChange={(e) => {
//                       const formatted = formatDecimalInput(e.target.value);
//                       setValue("transportCost", formatted);
//                     }}
//                     placeholder="0"
//                     className="border border-gray-300 bg-white font-semibold"
//                     onWheel={(e) => e.preventDefault()}
//                   />
//                 </div>
//                 <div>
//                   <Label>{t("customer.transportLocation") || "Transport Location"}</Label>
//                   <Input
//                     {...register("transportLocation")}
//                     className="border border-gray-300"
//                   />
//                 </div>
//               </>
//             )}

//             <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-lg p-4">
//               <Label className="text-base font-semibold">{t("customer.totalAmount") || "Total Bill Amount"}</Label>
//               <p className="text-3xl font-bold text-green-600">
//                 ₹{parseNumberInput(watch("totalAmount") || 0).toLocaleString("en-IN")}
//               </p>
//             </div>

//             <div>
//               <Label>{t("customer.depositAmount") || "Deposit"}</Label>
//               <Input
//                 type="text"
//                 inputMode="decimal"
//                 {...register("depositAmount")}
//                 onChange={(e) => {
//                   const formatted = formatDecimalInput(e.target.value);
//                   setValue("depositAmount", formatted);
//                 }}
//                 placeholder="0"
//                 className="border border-gray-300 bg-white font-semibold"
//                 onWheel={(e) => e.preventDefault()}
//               />
//             </div>

//             <div>
//               <Label>{t("customer.givenAmount") || "Given Amount"}</Label>
//               <Input
//                 type="text"
//                 inputMode="decimal"
//                 {...register("givenAmount")}
//                 onChange={(e) => {
//                   const formatted = formatDecimalInput(e.target.value);
//                   setValue("givenAmount", formatted);
//                 }}
//                 placeholder="0"
//                 className="border border-gray-300 bg-white font-semibold"
//                 onWheel={(e) => e.preventDefault()}
//               />
//             </div>

//             <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <Label className="text-base font-semibold">{t("customer.remainingAmount") || "Remaining Amount"}</Label>
//               <p className="text-2xl font-bold text-blue-600">
//                 ₹{(parseNumberInput(watch("totalAmount") || 0) - parseNumberInput(watch("givenAmount") || 0)).toLocaleString("en-IN")}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Additional Info */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">{t("customer.additionalInfo") || "Additional Information"}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>{t("customer.fitterName") || "Fitter Name"}</Label>
//               <Input {...register("fitterName")} className="border border-gray-300" />
//             </div>
//             <div>
//               <Label>{t("customer.status")} *</Label>
//               <Select value={watch("status")} onValueChange={(value) => setValue("status", value)}>
//                 <SelectTrigger className="border border-gray-300 focus:ring-0 focus:outline-none focus:border-none">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Active">{t("customer.active") || "Active"}</SelectItem>
//                   <SelectItem value="Completed">{t("customer.completed") || "Completed"}</SelectItem>
//                   <SelectItem value="Cancelled">{t("customer.cancelled") || "Cancelled"}</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="md:col-span-2">
//               <Label>{t("common.notes") || "Notes"}</Label>
//               <Input
//                 {...register("notes")}
//                 placeholder={t("common.notes") || "Add notes..."}
//                 className="border border-gray-300"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="flex justify-end gap-2 pt-4 border-t">
//           <Button
//             type="button"
//             onClick={handleSubmit(onSubmit)}
//             disabled={isSubmitting || mutation.isPending || selectedItems.length === 0}
//             size="lg"
//             className="min-w-[140px]"
//           >
//             {isSubmitting || mutation.isPending ? t("common.saving") || "Saving..." : t("common.save") || "Save"}
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";

const inputStyles = `
  input:focus,
  textarea:focus {
    outline: none !important;
    box-shadow: none !important;
  }
  
  /* Enhanced input styling for dark mode */
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
    
    input[type="date"],
    input[type="time"] {
      color: #ffffff !important;
    }
  }
`;

const formatDecimalInput = (value) => {
  if (value === "" || value === null) return "";
  const cleaned = value.toString().replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts[1];
  }
  return cleaned;
};

const parseNumberInput = (value) => {
  if (value === "" || value === null) return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const optionalNumber = z.preprocess(
  (val) => (val === "" || val === null ? undefined : Number(val)),
  z.number().min(0).optional()
);

const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional().nullable(),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkInTime: z.string().min(1, "Check-in time is required"),
  totalAmount: optionalNumber,
  depositAmount: optionalNumber,
  givenAmount: optionalNumber,
  transportRequired: z.boolean().default(false),
  transportCost: optionalNumber,
  transportLocation: z.string().optional().nullable(),
  maintenanceCharges: optionalNumber,
  fitterName: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional().nullable(),
});

export default function CustomerFormPreview({ customer, onSuccess }) {
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState([
    { itemId: "1", itemName: "Sample Item 1", quantity: 2, price: 500 },
    { itemId: "2", itemName: "Sample Item 2", quantity: 1, price: 1000 },
  ]);
  const [itemsTotal, setItemsTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugErrors, setDebugErrors] = useState([]);
  const [itemsCheckoutData, setItemsCheckoutData] = useState({});
  const [totalPerItemExtraCharges, setTotalPerItemExtraCharges] = useState(100);
  const [isCalculating, setIsCalculating] = useState(false);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      name: "John Doe",
      phone: "9876543210",
      address: "123 Main Street",
      checkInDate: getTodayDate(),
      checkInTime: "10:00",
      totalAmount: "2100",
      depositAmount: "500",
      givenAmount: "1000",
      transportRequired: false,
      transportCost: "",
      transportLocation: "",
      maintenanceCharges: "",
      fitterName: "John",
      status: "Active",
      notes: "Sample notes",
    },
  });

  useEffect(() => {
    const total = selectedItems.reduce(
      (sum, item) =>
        sum + parseFloat(item.quantity || 0) * parseFloat(item.price || 0),
      0
    );
    setItemsTotal(total);
  }, [selectedItems]);

  useEffect(() => {
    const transportCost = parseNumberInput(watch("transportCost")) || 0;
    const maintenanceCharges = parseNumberInput(watch("maintenanceCharges")) || 0;
    const newTotal =
      itemsTotal + transportCost + maintenanceCharges + totalPerItemExtraCharges;

    setValue("totalAmount", newTotal);
  }, [
    itemsTotal,
    watch("transportCost"),
    watch("maintenanceCharges"),
    totalPerItemExtraCharges,
    setValue,
  ]);

  const updateItemCheckout = (itemId, field, value) => {
    setItemsCheckoutData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const onSubmit = (formData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Form submitted successfully!");
      setIsSubmitting(false);
    }, 1000);
  };

  const transportRequired = watch("transportRequired");

  return (
    <>
      <style>{inputStyles}</style>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {debugErrors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Issues Found:</h4>
            {debugErrors.map((error, idx) => (
              <p key={idx} className="text-sm text-red-700 dark:text-red-300 mb-1">
                • {error}
              </p>
            ))}
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
            ✅ TEXT INPUT MODE
          </Badge>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
            <strong>All numeric fields use text input.</strong> No scroll wheel changes allowed.
          </p>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Name *</Label>
              <Input
                {...register("name")}
                placeholder="John Doe"
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
              />
              {errors.name && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Phone *</Label>
              <Input
                {...register("phone")}
                placeholder="9876543210"
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
              />
              {errors.phone && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone.message}</p>}
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Address</Label>
              <Input
                {...register("address")}
                placeholder="123 Main Street, City"
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Check-in Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Check-in Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Check-in Date *</Label>
              <Input
                type="date"
                {...register("checkInDate")}
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Check-in Time *</Label>
              <Input
                type="time"
                {...register("checkInTime")}
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Items - Checkout & Hourly Rates</h3>
          <div className="space-y-4 mb-6">
            {selectedItems.map((item, idx) => (
              <Card key={idx} className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-gray-900">
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Item</Label>
                      <p className="text-base font-medium text-gray-900 dark:text-white mt-1">{item.itemName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Cost</Label>
                      <p className="text-base text-gray-900 dark:text-white mt-1">
                        {item.quantity} × ₹{item.price.toLocaleString("en-IN")} = ₹
                        {(item.quantity * item.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                    <Label className="text-sm font-semibold block mb-3 text-gray-800 dark:text-gray-200">Checkout Details</Label>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                      <div>
                        <Label className="text-xs text-gray-700 dark:text-gray-300">Date</Label>
                        <Input type="date" className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-700 dark:text-gray-300">Time</Label>
                        <Input type="time" className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-700 dark:text-gray-300">Rate (₹) *</Label>
                        <Input
                          type="text"
                          placeholder="100"
                          className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold placeholder-gray-600 dark:placeholder-gray-400"
                          onWheel={(e) => e.preventDefault()}
                        />
                      </div>
                      <div className="md:col-span-2 flex items-end">
                        <Button type="button" className="w-full flex items-center justify-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Calculate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">Items Cost</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">₹{itemsTotal.toLocaleString("en-IN")}</p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">Extra Charges</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">₹{totalPerItemExtraCharges.toLocaleString("en-IN")}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Maintenance Charges</Label>
              <Input
                type="text"
                placeholder="0"
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold placeholder-gray-600 dark:placeholder-gray-400"
                onWheel={(e) => e.preventDefault()}
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <Checkbox id="transport" />
              <Label htmlFor="transport" className="text-sm font-medium text-gray-800 dark:text-gray-200">Transport Required</Label>
            </div>

            <div className="md:col-span-2 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <Label className="text-base font-semibold text-green-900 dark:text-green-100">Total Bill Amount</Label>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                ₹{parseNumberInput(watch("totalAmount") || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Deposit</Label>
              <Input
                type="text"
                placeholder="0"
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold placeholder-gray-600 dark:placeholder-gray-400"
                onWheel={(e) => e.preventDefault()}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Given Amount</Label>
              <Input
                type="text"
                placeholder="0"
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold placeholder-gray-600 dark:placeholder-gray-400"
                onWheel={(e) => e.preventDefault()}
              />
            </div>

            <div className="md:col-span-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <Label className="text-base font-semibold text-blue-900 dark:text-blue-100">Remaining Amount</Label>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                ₹{(parseNumberInput(watch("totalAmount") || 0) - parseNumberInput(watch("givenAmount") || 0)).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Fitter Name</Label>
              <Input
                {...register("fitterName")}
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Status *</Label>
              <Select value={watch("status")} onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Notes</Label>
              <Input
                {...register("notes")}
                placeholder="Add notes..."
                className="mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-300 dark:border-gray-700">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            size="lg"
            className="min-w-[140px]"
          >
            {isSubmitting ? "Saving..." : "Save Customer"}
          </Button>
        </div>
      </div>
    </>
  );
}