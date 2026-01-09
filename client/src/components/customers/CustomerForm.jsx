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
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { customerService } from "@/services/customerService";
// import { itemService } from "@/services/itemService";
// import ItemSelector from "./ItemSelector";

// const inputStyles = `
//   input[type="number"]::-webkit-outer-spin-button,
//   input[type="number"]::-webkit-inner-spin-button {
//     -webkit-appearance: none;
//     margin: 0;
//   }
//   input[type="number"] {
//     -moz-appearance: textfield;
//   }
//   input:focus,
//   textarea:focus {
//     outline: none !important;
//     box-shadow: none !important;
//   }
// `;

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
//   checkOutDate: z.string().optional().nullable(),
//   checkOutTime: z.string().optional().nullable(),
//   // totalAmount: z.number().min(0, "Total amount cannot be negative"),
//   totalAmount: optionalNumber,
//   // depositAmount: z.number().min(0, "Deposit amount cannot be negative"),
//   depositAmount: optionalNumber,
//   // givenAmount: z.number().min(0, "Given amount cannot be negative"),
//   givenAmount: optionalNumber,
//   transportRequired: z.boolean().default(false),
//   // transportCost: z.number().min(0, "Transport cost cannot be negative"),
//   transportCost: optionalNumber,
//   transportLocation: z.string().optional().nullable(),
//   // maintenanceCharges: z.number().min(0, "Maintenance charges cannot be negative"),
//   maintenanceCharges: optionalNumber,
//   // hourlyRate: z.number().min(0, "Hourly rate cannot be negative").optional(),
//   hourlyRate: optionalNumber,
//   // extraCharges: z.number().min(0, "Extra charges cannot be negative").optional(),
//   extraCharges: optionalNumber,
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
//   const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
//   const [checkoutData, setCheckoutData] = useState({
//     checkOutDate: "",
//     checkOutTime: "",
//     hourlyRate: null,
//     extraCharges: null,
//     rentalDays: null,
//     extraHours: null,
//   });
//   const [isLoadingCustomer, setIsLoadingCustomer] = useState(!!customer?._id);

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
//       checkOutDate: "",
//       checkOutTime: "",
//       totalAmount: "",
//       depositAmount: "",
//       givenAmount: "",
//       transportRequired: false,
//       transportCost: "",
//       transportLocation: "",
//       maintenanceCharges: "",
//       hourlyRate: "",
//       extraCharges: "",
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
//         console.log("🔵 FETCHING CUSTOMER DATA FOR ID:", customer._id);

//         const response = await customerService.getById(customer._id);
//         const fetchedCustomer = response.data.data || response.data;

//         console.log("📥 ✅ CUSTOMER DATA LOADED SUCCESSFULLY");
//         console.log(JSON.stringify(fetchedCustomer, null, 2));

//         if (fetchedCustomer) {
//           setValue("name", fetchedCustomer.name || "");
//           setValue("phone", fetchedCustomer.phone || "");
//           setValue("address", fetchedCustomer.address || "");

//           if (fetchedCustomer.checkInDate) {
//             const checkInDate = new Date(fetchedCustomer.checkInDate);
//             setValue("checkInDate", checkInDate.toISOString().split("T")[0]);
//           }

//           setValue("checkInTime", fetchedCustomer.checkInTime || "10:00");

//           if (fetchedCustomer.checkOutDate) {
//             const checkOutDate = new Date(fetchedCustomer.checkOutDate);
//             setValue("checkOutDate", checkOutDate.toISOString().split("T")[0]);
//           }

//           setValue("checkOutTime", fetchedCustomer.checkOutTime || "");
//           setValue("totalAmount", fetchedCustomer.totalAmount || 0);
//           setValue("depositAmount", fetchedCustomer.depositAmount || 0);
//           setValue("givenAmount", fetchedCustomer.givenAmount || 0);
//           setValue("transportRequired", fetchedCustomer.transportRequired || false);
//           setValue("transportCost", fetchedCustomer.transportCost || 0);
//           setValue("transportLocation", fetchedCustomer.transportLocation || "");
//           setValue("maintenanceCharges", fetchedCustomer.maintenanceCharges || 0);
//           setValue("hourlyRate", fetchedCustomer.hourlyRate || 0);
//           setValue("extraCharges", fetchedCustomer.extraCharges || 0);
//           setValue("fitterName", fetchedCustomer.fitterName || "");
//           setValue("status", fetchedCustomer.status || "Active");
//           setValue("notes", fetchedCustomer.notes || "");

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
//             console.log("📦 ✅ ITEMS LOADED:", formattedItems);
//           }

//           if (fetchedCustomer.checkOutDate && fetchedCustomer.checkOutTime) {
//             setCheckoutData({
//               checkOutDate: new Date(fetchedCustomer.checkOutDate)
//                 .toISOString()
//                 .split("T")[0],
//               checkOutTime: fetchedCustomer.checkOutTime,
//               hourlyRate: fetchedCustomer.hourlyRate || 0,
//               extraCharges: fetchedCustomer.extraCharges || 0,
//               rentalDays: fetchedCustomer.rentalDays || 0,
//               extraHours: fetchedCustomer.extraHours || 0,
//             });
//             console.log("📋 ✅ CHECKOUT DATA LOADED");
//           }
//         }

//         setIsLoadingCustomer(false);
//       } catch (error) {
//         console.error("❌ Error fetching customer:", error);
//         toast.error("Failed to load customer data: " + error.message);
//         setIsLoadingCustomer(false);
//       }
//     };

//     fetchCustomerData();
//   }, [customer?._id, setValue]);

//   useEffect(() => {
//     const total = selectedItems.reduce(
//       (sum, item) =>
//         sum + parseFloat(item.quantity || 0) * parseFloat(item.price || 0),
//       0
//     );
//     console.log("📊 Items Total Calculated:", total);
//     console.log("Selected Items:", selectedItems);
//     setItemsTotal(total);
//   }, [selectedItems]);

//   useEffect(() => {
//     const transportCost = parseFloat(watch("transportCost")) || 0;
//     const maintenanceCharges = parseFloat(watch("maintenanceCharges")) || 0;
//     const extraCharges = parseFloat(watch("extraCharges")) || 0;
//     const newTotal = itemsTotal + transportCost + maintenanceCharges + extraCharges;

//     console.log("💰 Total Amount Calculation:");
//     console.log("  Items Total:", itemsTotal);
//     console.log("  Transport Cost:", transportCost);
//     console.log("  Maintenance Charges:", maintenanceCharges);
//     console.log("  Extra Charges:", extraCharges);
//     console.log("  NEW TOTAL:", newTotal);

//     setValue("totalAmount", newTotal);
//   }, [
//     itemsTotal,
//     watch("transportCost"),
//     watch("maintenanceCharges"),
//     watch("extraCharges"),
//     setValue,
//   ]);

//   // ✅ CALCULATE DURATION FUNCTION - FIXED
//   const calculateDuration = async () => {
//     const formData = getValues();

//     if (!formData.checkOutDate || !formData.checkOutTime) {
//       toast.error("Please enter checkout date and time");
//       return;
//     }

//     if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
//       toast.error("Please enter a valid hourly rate");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await customerService.calculateDuration({
//         checkInDate: formData.checkInDate,
//         checkInTime: formData.checkInTime,
//         checkOutDate: formData.checkOutDate,
//         checkOutTime: formData.checkOutTime,
//         hourlyRate: parseFloat(formData.hourlyRate),
//       });

//       if (response.data.success) {
//         const { fullDays, extraHours, extraCharges } = response.data.data;
//         const extraChargesNum = parseFloat(extraCharges);

//         console.log("✅ Duration Calculated:");
//         console.log("Full Days:", fullDays);
//         console.log("Extra Hours:", extraHours);
//         console.log("Extra Charges:", extraChargesNum);

//         setCheckoutData({
//           ...checkoutData,
//           extraCharges: extraChargesNum,
//           rentalDays: fullDays,
//           extraHours: extraHours,
//         });

//         setValue("extraCharges", extraChargesNum);

//         console.log("📝 Form updated with extra charges:", extraChargesNum);

//         toast.success(
//           `✅ Duration: ${fullDays} day(s) and ${extraHours} hour(s)\nExtra Charge: ₹${extraChargesNum}`
//         );
//       }
//     } catch (error) {
//       console.error("Calculate duration error:", error);
//       toast.error("Failed to calculate duration");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const checkoutMutation = useMutation({
//     mutationFn: async (formData) => {
//       console.log("🔵 CHECKOUT MUTATION STARTED");
//       console.log("Current Status:", formData.status);
//       console.log("Current Extra Charges:", formData.extraCharges);
//       console.log("Current Total Amount:", formData.totalAmount);

//       if (formData.status === "Completed" && checkoutData.checkOutDate) {
//         const extraChargesAmount = parseFloat(formData.extraCharges) || 0;
//         const baseTotal =
//           itemsTotal +
//           (parseFloat(formData.transportCost) || 0) +
//           (parseFloat(formData.maintenanceCharges) || 0);

//         const updateData = {
//           ...formData,
//           checkOutDate: checkoutData.checkOutDate,
//           checkOutTime: checkoutData.checkOutTime,
//           extraCharges: extraChargesAmount,
//           rentalDays: checkoutData.rentalDays,
//           extraHours: checkoutData.extraHours,
//           totalAmount: baseTotal + extraChargesAmount,
//           remainingAmount:
//             baseTotal + extraChargesAmount - parseFloat(formData.givenAmount),
//         };

//         console.log("📦 Update Data with Extra Charges:", updateData);
//         console.log("Base Total (items + transport + maintenance):", baseTotal);
//         console.log("Extra Charges:", extraChargesAmount);
//         console.log("Final Total:", updateData.totalAmount);

//         const response = await customerService.update(customer._id, updateData);

//         if (selectedItems && selectedItems.length > 0) {
//           try {
//             console.log("🔄 Returning items to inventory");
//             await itemService.returnItems(
//               selectedItems.map((item) => ({
//                 itemId: item.itemId || item._id,
//                 quantity: item.quantity,
//               }))
//             );
//             toast.success("✅ Items returned to inventory");
//           } catch (itemError) {
//             console.error("⚠️ Error returning items:", itemError);
//             toast.warning("Customer updated but error returning items");
//           }
//         }

//         return response;
//       } else if (formData.status === "Cancelled") {
//         const response = await customerService.update(customer._id, formData);

//         if (selectedItems && selectedItems.length > 0) {
//           try {
//             console.log("🔄 Returning items to inventory (Cancelled)");
//             await itemService.returnItems(
//               selectedItems.map((item) => ({
//                 itemId: item.itemId || item._id,
//                 quantity: item.quantity,
//               }))
//             );
//             toast.success("✅ Items returned to inventory");
//           } catch (itemError) {
//             console.error("⚠️ Error returning items:", itemError);
//             toast.warning("Customer updated but error returning items");
//           }
//         }

//         return response;
//       }

//       return await customerService.update(customer._id, formData);
//     },
//     onSuccess: () => {
//       setCheckoutDialogOpen(false);
//       setIsSubmitting(false);
//       setDebugErrors([]);
//       console.log("✅ CHECKOUT SUCCESSFUL!");
//       toast.success("✅ Customer updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["customers"] });
//       queryClient.invalidateQueries({ queryKey: ["customer"] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       setIsSubmitting(false);
//       console.error("❌ Checkout Error:", error);
//       let errorMsg = error.message || "Failed to update customer";
//       if (error.response?.data?.message) {
//         errorMsg = error.response.data.message;
//       }
//       setDebugErrors([errorMsg]);
//       toast.error(`❌ ${errorMsg}`);
//     },
//   });

//   const mutation = useMutation({
//     mutationFn: async (formData) => {
//       const errors = [];

//       console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//       console.log("🔵 FORM SUBMISSION STARTED");
//       console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

//       console.log("✅ Step 1: Raw Form Data");
//       console.log(JSON.stringify(formData, null, 2));

//       console.log("\n✅ Step 2: Selected Items");
//       console.log("Items Count:", selectedItems.length);
//       if (selectedItems.length === 0) {
//         const msg = "❌ NO ITEMS SELECTED - This is why submission failed!";
//         console.error(msg);
//         errors.push(msg);
//         throw new Error("Please select at least one item before submitting");
//       }
//       console.log(JSON.stringify(selectedItems, null, 2));

//       console.log("\n✅ Step 3: Validating Required Fields");
//       if (!formData.name?.trim()) {
//         const msg = "❌ Customer name is empty";
//         console.error(msg);
//         errors.push(msg);
//       }
//       if (!formData.phone?.trim()) {
//         const msg = "❌ Phone number is empty";
//         console.error(msg);
//         errors.push(msg);
//       }
//       if (!formData.checkInDate) {
//         const msg = "❌ Check-in date is empty";
//         console.error(msg);
//         errors.push(msg);
//       }
//       if (!formData.checkInTime) {
//         const msg = "❌ Check-in time is empty";
//         console.error(msg);
//         errors.push(msg);
//       }
//       if (!formData.status) {
//         const msg = "❌ Status is empty";
//         console.error(msg);
//         errors.push(msg);
//       }
//       console.log("Required Fields Valid: ", errors.length === 0);

//       console.log("\n✅ Step 4: Validating Amounts");
//       const totalAmount = parseFloat(formData.totalAmount) || 0;
//       const depositAmount = parseFloat(formData.depositAmount) || 0;
//       const givenAmount = parseFloat(formData.givenAmount) || 0;

//       console.log("Total Amount:", totalAmount);
//       console.log("Deposit Amount:", depositAmount);
//       console.log("Given Amount:", givenAmount);

//       if (depositAmount > totalAmount) {
//         const msg = `❌ Deposit (${depositAmount}) exceeds Total (${totalAmount})`;
//         console.error(msg);
//         errors.push(msg);
//       }
//       if (givenAmount > totalAmount) {
//         const msg = `❌ Given (${givenAmount}) exceeds Total (${totalAmount})`;
//         console.error(msg);
//         errors.push(msg);
//       }

//       console.log("\n✅ Step 5: Validating Item Structure");
//       selectedItems.forEach((item, idx) => {
//         console.log(`Item ${idx + 1}:`, {
//           itemId: item.itemId || item._id,
//           itemName: item.itemName || item.name,
//           quantity: item.quantity,
//           price: item.price,
//         });

//         if (!item.itemId && !item._id) {
//           const msg = `❌ Item ${idx + 1}: Missing item ID`;
//           console.error(msg);
//           errors.push(msg);
//         }
//         if (!item.itemName && !item.name) {
//           const msg = `❌ Item ${idx + 1}: Missing item name`;
//           console.error(msg);
//           errors.push(msg);
//         }
//         if (!item.quantity || parseInt(item.quantity) <= 0) {
//           const msg = `❌ Item ${idx + 1}: Invalid quantity (${item.quantity})`;
//           console.error(msg);
//           errors.push(msg);
//         }
//         if (
//           item.price === null ||
//           item.price === undefined ||
//           item.price < 0
//         ) {
//           const msg = `❌ Item ${idx + 1}: Invalid price (${item.price})`;
//           console.error(msg);
//           errors.push(msg);
//         }
//       });

//       if (errors.length > 0) {
//         console.error("\n❌ VALIDATION ERRORS:");
//         errors.forEach((err) => console.error("  -", err));
//         setDebugErrors(errors);
//         throw new Error(errors.join("\n"));
//       }

//       console.log("\n✅ Step 6: Building API Payload");
//       const payload = {
//         name: formData.name?.trim() || "",
//         phone: formData.phone?.trim() || "",
//         address: formData.address?.trim() || "",
//         checkInDate: formData.checkInDate || "",
//         checkInTime: formData.checkInTime || "",
//         checkOutDate: formData.checkOutDate || "",
//         checkOutTime: formData.checkOutTime || "",
//         totalAmount: parseFloat(formData.totalAmount) || 0,
//         depositAmount: parseFloat(formData.depositAmount) || 0,
//         givenAmount: parseFloat(formData.givenAmount) || 0,
//         transportRequired: formData.transportRequired || false,
//         transportCost: parseFloat(formData.transportCost) || 0,
//         transportLocation: formData.transportLocation?.trim() || "",
//         maintenanceCharges: parseFloat(formData.maintenanceCharges) || 0,
//         hourlyRate: parseFloat(formData.hourlyRate) || 0,
//         extraCharges: parseFloat(formData.extraCharges) || 0,
//         fitterName: formData.fitterName?.trim() || "",
//         status: formData.status || "Active",
//         notes: formData.notes?.trim() || "",
//         items: selectedItems.map((item) => ({
//           itemId: item.itemId || item._id,
//           itemName: item.itemName || item.name,
//           quantity: parseInt(item.quantity) || 1,
//           price: parseFloat(item.price) || 0,
//         })),
//       };

//       console.log("📦 Final Payload:");
//       console.log(JSON.stringify(payload, null, 2));

//       console.log("\n✅ Step 7: Sending to API");
//       console.log(
//         customer?._id
//           ? `🔄 UPDATING customer: ${customer._id}`
//           : "🆕 CREATING new customer"
//       );

//       try {
//         let response;
//         if (customer?._id) {
//           console.log("API Call: customerService.update()");
//           response = await customerService.update(customer._id, payload);
//         } else {
//           console.log("API Call: customerService.create()");
//           response = await customerService.create(payload);
//         }

//         console.log("✅ API Response Received:");
//         console.log(JSON.stringify(response, null, 2));

//         return response;
//       } catch (apiError) {
//         console.error("❌ API Error Details:");
//         console.error("Message:", apiError.message);
//         console.error("Status:", apiError.response?.status);
//         console.error("Status Text:", apiError.response?.statusText);
//         console.error("Response Data:", apiError.response?.data);
//         console.error("Full Error:", apiError);

//         throw apiError;
//       }
//     },
//     onSuccess: (response) => {
//       setIsSubmitting(false);
//       setDebugErrors([]);
//       console.log("✅ SUBMISSION SUCCESSFUL!");
//       toast.success(
//         customer
//           ? "✅ Customer updated successfully!"
//           : "✅ Customer created successfully!"
//       );
//       queryClient.invalidateQueries({ queryKey: ["customers"] });
//       queryClient.invalidateQueries({ queryKey: ["customer"] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       setIsSubmitting(false);

//       console.error("❌ SUBMISSION FAILED!");
//       console.error("Error Message:", error.message);
//       console.error("Full Error:", error);

//       let errorMsg = error.message || "Failed to save customer";

//       if (error.response?.data?.message) {
//         errorMsg = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMsg = error.response.data.error;
//       } else if (error.response?.data?.errors) {
//         const errObj = error.response.data.errors;
//         if (typeof errObj === "object") {
//           errorMsg = Object.values(errObj).join(", ");
//         }
//       }

//       setDebugErrors([errorMsg]);
//       toast.error(`❌ ${errorMsg}`);
//     },
//   });

//   const onSubmit = (formData) => {
//     console.log("\n\n");
//     console.log(
//       "═══════════════════════════════════════════════════════"
//     );
//     console.log("CUSTOMER FORM SUBMISSION INITIATED");
//     console.log("Mode:", customer?._id ? "EDIT" : "CREATE");
//     console.log(
//       "═══════════════════════════════════════════════════════"
//     );

//     // If status is Completed, always submit directly (with or without calculated data)
//     if (customer?._id && formData.status === "Completed") {
//       console.log(
//         "📋 EDIT MODE: Status changing to Completed - submitting directly"
//       );
//       setIsSubmitting(true);
//       checkoutMutation.mutate(formData);
//       return;
//     }

//     // For other status changes (Active, Cancelled)
//     if (customer?._id) {
//       console.log("📋 EDIT MODE: Updating existing customer");
//       setIsSubmitting(true);
//       checkoutMutation.mutate(formData);
//       return;
//     }

//     console.log("✨ CREATE MODE: Creating new customer");
//     setIsSubmitting(true);
//     mutation.mutate(formData);
//   };

//   const handleCheckout = async () => {
//     if (!checkoutData.checkOutDate || !checkoutData.checkOutTime) {
//       toast.error("Please enter checkout date and time");
//       return;
//     }

//     setIsSubmitting(true);

//     const formData = getValues();
//     const checkInTime = formData.checkInTime;
//     const hourlyRate = parseFloat(formData.hourlyRate) || 0;

//     try {
//       const response = await customerService.calculateDuration({
//         checkInDate: formData.checkInDate,
//         checkInTime: checkInTime,
//         checkOutDate: checkoutData.checkOutDate,
//         checkOutTime: checkoutData.checkOutTime,
//         hourlyRate: hourlyRate,
//       });

//       if (response.data.success) {
//         const { fullDays, extraHours, extraCharges } = response.data.data;
//         const extraChargesNum = parseFloat(extraCharges);

//         console.log("✅ Duration Calculated:");
//         console.log("Full Days:", fullDays);
//         console.log("Extra Hours:", extraHours);
//         console.log("Extra Charges:", extraChargesNum);

//         setCheckoutData({
//           ...checkoutData,
//           extraCharges: extraChargesNum,
//           rentalDays: fullDays,
//           extraHours: extraHours,
//         });

//         setValue("extraCharges", extraChargesNum);

//         console.log("📝 Form updated with extra charges:", extraChargesNum);

//         toast.success(
//           `✅ Duration: ${fullDays} day(s) and ${extraHours} hour(s)\nExtra Charge: ₹${extraChargesNum}`
//         );

//         // Close dialog and submit immediately
//         setCheckoutDialogOpen(false);
//         setTimeout(() => {
//           const updatedFormData = getValues();
//           console.log("🔄 Submitting with updated form data:", updatedFormData);
//           checkoutMutation.mutate(updatedFormData);
//         }, 300);
//       }
//     } catch (error) {
//       setIsSubmitting(false);
//       console.error("Calculate duration error:", error);
//       toast.error("Failed to calculate duration");
//     }
//   };

//   const transportRequired = watch("transportRequired");
//   const currentStatus = watch("status");

//   if (isLoadingCustomer && customer?._id) {
//     return (
//       <div className="space-y-4">
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
//           <p className="text-lg font-semibold text-blue-900">
//             ⏳ Loading customer data...
//           </p>
//           <p className="text-sm text-blue-700 mt-2">
//             Please wait while we fetch the customer information
//           </p>
//           <p className="text-xs text-blue-600 mt-3">
//             Check console (F12) for detailed logs
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{inputStyles}</style>
//       <div className="space-y-6">
//         {debugErrors.length > 0 && (
//           <div className="bg-red-50 border border-red-300 rounded-lg p-4">
//             <h4 className="font-semibold text-red-800 mb-2">
//               ❌ Issues Found:
//             </h4>
//             {debugErrors.map((error, idx) => (
//               <p key={idx} className="text-sm text-red-700 mb-1">
//                 • {error}
//               </p>
//             ))}
//             <p className="text-xs text-red-600 mt-3">
//               ℹ️ Check browser console (F12) for detailed debugging information
//             </p>
//           </div>
//         )}

//         {/* 24-Hour Cycle Info */}
//         <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//           <div className="flex items-center gap-2">
//             <Badge
//               variant="outline"
//               className="bg-blue-100 dark:bg-blue-900"
//             >
//               ⏰ 24-Hour Cycle
//             </Badge>
//             <p className="text-sm text-muted-foreground">
//               Check-in to check-out follows 24-hour cycles (e.g., 10:00 AM to
//               10:00 AM next day)
//             </p>
//           </div>
//         </div>

//         {/* Customer Information */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">
//             Customer Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label
//                 className={
//                   Object.keys(errors).includes("name")
//                     ? "text-red-600 font-semibold"
//                     : ""
//                 }
//               >
//                 {t("customer.name")} *
//               </Label>
//               <Input
//                 {...register("name")}
//                 placeholder="John Doe"
//                 className={`border ${
//                   Object.keys(errors).includes("name")
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300"
//                 } bg-white`}
//               />
//               {errors.name && (
//                 <p className="text-sm text-red-600 mt-1 font-medium">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Label
//                 className={
//                   Object.keys(errors).includes("phone")
//                     ? "text-red-600 font-semibold"
//                     : ""
//                 }
//               >
//                 {t("customer.phone")} *
//               </Label>
//               <Input
//                 {...register("phone")}
//                 placeholder="9876543210"
//                 className={`border ${
//                   Object.keys(errors).includes("phone")
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300"
//                 } bg-white`}
//               />
//               {errors.phone && (
//                 <p className="text-sm text-red-600 mt-1 font-medium">
//                   {errors.phone.message}
//                 </p>
//               )}
//             </div>

//             <div className="md:col-span-2">
//               <Label>{t("customer.address")}</Label>
//               <Input
//                 {...register("address")}
//                 placeholder="123 Main Street, City"
//                 className="border border-gray-300 bg-white"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Item Selection */}
//         <div>
//           <ItemSelector
//             selectedItems={selectedItems}
//             onItemsChange={setSelectedItems}
//           />
//           {selectedItems.length === 0 && (
//             <p className="text-sm text-red-600 font-medium mt-2">
//               ⚠️ Please select at least one item
//             </p>
//           )}
//           <p className="text-xs text-blue-600 mt-2">
//             Items selected: {selectedItems.length}
//           </p>
//         </div>

//         {/* Check-in/Check-out Details */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Check-in Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label
//                 className={
//                   Object.keys(errors).includes("checkInDate")
//                     ? "text-red-600 font-semibold"
//                     : ""
//                 }
//               >
//                 {t("customer.checkInDate")} *
//               </Label>
//               <Input
//                 type="date"
//                 {...register("checkInDate")}
//                 className={`border ${
//                   Object.keys(errors).includes("checkInDate")
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300"
//                 }`}
//               />
//               {errors.checkInDate && (
//                 <p className="text-sm text-red-600 mt-1 font-medium">
//                   {errors.checkInDate.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Label
//                 className={
//                   Object.keys(errors).includes("checkInTime")
//                     ? "text-red-600 font-semibold"
//                     : ""
//                 }
//               >
//                 {t("customer.checkInTime")} *
//               </Label>
//               <Input
//                 type="time"
//                 {...register("checkInTime")}
//                 className={`border ${
//                   Object.keys(errors).includes("checkInTime")
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300"
//                 }`}
//               />
//               <p className="text-xs text-muted-foreground mt-1">
//                 Standard: 10:00 AM
//               </p>
//               {errors.checkInTime && (
//                 <p className="text-sm text-red-600 mt-1 font-medium">
//                   {errors.checkInTime.message}
//                 </p>
//               )}
//             </div>

//             {customer && (
//               <>
//                 <div>
//                   <Label
//                     className={
//                       Object.keys(errors).includes("checkOutDate")
//                         ? "text-red-600 font-semibold"
//                         : ""
//                     }
//                   >
//                     {t("customer.checkOutDate")}
//                   </Label>
//                   <Input
//                     type="date"
//                     {...register("checkOutDate")}
//                     className={`border ${
//                       Object.keys(errors).includes("checkOutDate")
//                         ? "border-red-500 bg-red-50"
//                         : "border-gray-300"
//                     }`}
//                   />
//                 </div>

//                 <div>
//                   <Label
//                     className={
//                       Object.keys(errors).includes("checkOutTime")
//                         ? "text-red-600 font-semibold"
//                         : ""
//                     }
//                   >
//                     {t("customer.checkOutTime")}
//                   </Label>
//                   <Input
//                     type="time"
//                     {...register("checkOutTime")}
//                     className={`border ${
//                       Object.keys(errors).includes("checkOutTime")
//                         ? "border-red-500 bg-red-50"
//                         : "border-gray-300"
//                     }`}
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <div className="flex gap-2 items-end">
//                     <div className="flex-1">
//                       <Label>{t("customer.hourlyRate")}</Label>
//                       <Input
//                         type="text"
//                         {...register("hourlyRate", {
//                           setValueAs: (value) => {
//                             if (value === "" || value === null) return 0;
//                             const num = parseFloat(value);
//                             return isNaN(num) ? 0 : num;
//                           },
//                         })}
//                         placeholder="Enter rate"
//                         className="border border-gray-300 bg-white"
//                       />
//                       <p className="text-xs text-muted-foreground mt-1">
//                         Charged for hours exceeding 24-hour cycles
//                       </p>
//                     </div>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={calculateDuration}
//                       className="h-10"
//                       disabled={isSubmitting}
//                     >
//                       📊 Calculate
//                     </Button>
//                   </div>
//                 </div>

//                 {watch("checkOutDate") && watch("checkOutTime") && (
//                   <div className="md:col-span-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3">
//                     <h4 className="font-semibold text-amber-900 dark:text-amber-100">
//                       ⏱️ Rental Duration & Extra Charges
//                     </h4>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="bg-white dark:bg-gray-800 p-3 rounded">
//                         <p className="text-xs text-muted-foreground">
//                           Rental Days
//                         </p>
//                         <p className="text-2xl font-bold text-blue-600">
//                           {checkoutData.rentalDays || 0}
//                         </p>
//                       </div>
//                       <div className="bg-white dark:bg-gray-800 p-3 rounded">
//                         <p className="text-xs text-muted-foreground">
//                           Extra Hours
//                         </p>
//                         <p className="text-2xl font-bold text-orange-600">
//                           {checkoutData.extraHours || 0}h
//                         </p>
//                       </div>
//                       <div className="bg-white dark:bg-gray-800 p-3 rounded">
//                         <p className="text-xs text-muted-foreground">
//                           Extra Charge
//                         </p>
//                         <p className="text-2xl font-bold text-red-600">
//                           ₹
//                           {(checkoutData.extraCharges || 0).toLocaleString(
//                             "en-IN"
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {/* Payment Information */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">
//             Payment Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Items Total (Auto-calculated)</Label>
//               <Input
//                 type="text"
//                 value={itemsTotal.toLocaleString("en-IN")}
//                 disabled
//                 className="border border-gray-300 bg-gray-100"
//               />
//             </div>

//             <div>
//               <Label
//                 className={
//                   Object.keys(errors).includes("maintenanceCharges")
//                     ? "text-red-600 font-semibold"
//                     : ""
//                 }
//               >
//                 {t("customer.maintenanceCharges")}
//               </Label>
//               <Input
//                 type="text"
//                 {...register("maintenanceCharges", {
//                   setValueAs: (value) => {
//                     if (value === "" || value === null) return 0;
//                     const num = parseFloat(value);
//                     return isNaN(num) ? 0 : num;
//                   },
//                 })}
//                 placeholder="Enter amount"
//                 className={`border ${
//                   Object.keys(errors).includes("maintenanceCharges")
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300"
//                 } bg-white`}
//               />
//             </div>

//             <div className="flex items-center space-x-2 md:col-span-2">
//               <Checkbox
//                 id="transport"
//                 checked={transportRequired}
//                 onCheckedChange={(checked) =>
//                   setValue("transportRequired", checked)
//                 }
//               />
//               <Label htmlFor="transport">
//                 {t("customer.transport")}
//               </Label>
//             </div>

//             {transportRequired && (
//               <>
//                 <div>
//                   <Label
//                     className={
//                       Object.keys(errors).includes("transportCost")
//                         ? "text-red-600 font-semibold"
//                         : ""
//                     }
//                   >
//                     {t("customer.transportCost")}
//                   </Label>
//                   <Input
//                     type="text"
//                     {...register("transportCost", {
//                       setValueAs: (value) => {
//                         if (value === "" || value === null) return 0;
//                         const num = parseFloat(value);
//                         return isNaN(num) ? 0 : num;
//                       },
//                     })}
//                     placeholder="Enter amount"
//                     className={`border ${
//                       Object.keys(errors).includes("transportCost")
//                         ? "border-red-500 bg-red-50"
//                         : "border-gray-300"
//                     } bg-white`}
//                   />
//                 </div>

//                 <div>
//                   <Label>{t("customer.transportLocation")}</Label>
//                   <Input
//                     {...register("transportLocation")}
//                     className="border border-gray-300 bg-white"
//                   />
//                 </div>
//               </>
//             )}

//             <div>
//               <Label
//                 className={
//                   Object.keys(errors).includes("totalAmount")
//                     ? "text-red-600 font-semibold"
//                     : ""
//                 }
//               >
//                 {t("customer.totalAmount")} (Auto-calculated) *
//               </Label>
//               <Input
//                 type="text"
//                 value={parseFloat(watch("totalAmount") || 0).toLocaleString(
//                   "en-IN"
//                 )}
//                 disabled
//                 className="bg-gray-100 font-bold text-lg border border-gray-300"
//               />
//             </div>

//             <div>
//               <Label
//                 className={
//                   Object.keys(errors).includes("depositAmount")
//                     ? "text-red-600 font-semibold"
//                     : ""
//                 }
//               >
//                 {t("customer.depositAmount")}
//               </Label>
//               <Input
//                 type="text"
//                 {...register("depositAmount", {
//                   setValueAs: (value) => {
//                     if (value === "" || value === null) return 0;
//                     const num = parseFloat(value);
//                     return isNaN(num) ? 0 : num;
//                   },
//                 })}
//                 placeholder="Enter amount"
//                 className={`border ${
//                   Object.keys(errors).includes("depositAmount")
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300"
//                 } bg-white`}
//               />
//             </div>

//             <div>
//               <Label
//                 className={
//                   Object.keys(errors).includes("givenAmount")
//                     ? "text-red-600 font-semibold"
//                     : ""
//                 }
//               >
//                 {t("customer.givenAmount")}
//               </Label>
//               <Input
//                 type="text"
//                 {...register("givenAmount", {
//                   setValueAs: (value) => {
//                     if (value === "" || value === null) return 0;
//                     const num = parseFloat(value);
//                     return isNaN(num) ? 0 : num;
//                   },
//                 })}
//                 placeholder="Enter amount"
//                 className={`border ${
//                   Object.keys(errors).includes("givenAmount")
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300"
//                 } bg-white`}
//               />
//             </div>

//             <div>
//               <Label>Remaining Amount (Auto-calculated)</Label>
//               <Input
//                 type="text"
//                 value={(
//                   parseFloat(watch("totalAmount") || 0) -
//                   parseFloat(watch("givenAmount") || 0)
//                 ).toLocaleString("en-IN")}
//                 disabled
//                 className="bg-gray-100 border border-gray-300 font-semibold"
//               />
//             </div>

//             {customer && (
//               <div>
//                 <Label
//                   className={
//                     Object.keys(errors).includes("extraCharges")
//                       ? "text-red-600 font-semibold"
//                       : ""
//                   }
//                 >
//                   Extra Charges (from rental hours)
//                 </Label>
//                 <Input
//                   type="text"
//                   {...register("extraCharges", {
//                     setValueAs: (value) => {
//                       if (value === "" || value === null) return 0;
//                       const num = parseFloat(value);
//                       return isNaN(num) ? 0 : num;
//                     },
//                   })}
//                   placeholder="Auto-calculated"
//                   className="bg-gray-50 border border-gray-300"
//                   disabled={currentStatus !== "Completed"}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Additional Information */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">
//             Additional Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>{t("customer.fitterName")}</Label>
//               <Input
//                 {...register("fitterName")}
//                 className="border border-gray-300 bg-white"
//               />
//             </div>

//             <div>
//               <Label
//                 className={
//                   Object.keys(errors).includes("status")
//                     ? "text-red-600 font-semibold"
//                     : ""
//                 }
//               >
//                 {t("customer.status")} *
//               </Label>
//               <Select
//                 value={watch("status")}
//                 onValueChange={(value) => setValue("status", value)}
//               >
//                 <SelectTrigger className="border border-gray-300 bg-white focus:outline-none focus:ring-0 focus:shadow-none focus:border-none">
//                   <SelectValue />
//                 </SelectTrigger >
//                 <SelectContent className="border border-gray-300 bg-white">
//                   <SelectItem value="Active">Active</SelectItem>
//                   <SelectItem value="Completed">Completed</SelectItem>
//                   <SelectItem value="Cancelled">Cancelled</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.status && (
//                 <p className="text-sm text-red-600 mt-1 font-medium">
//                   {errors.status.message}
//                 </p>
//               )}
//             </div>

//             <div className="md:col-span-2">
//               <Label>Notes</Label>
//               <Input
//                 {...register("notes")}
//                 placeholder="Additional notes or requirements..."
//                 className="border border-gray-300 bg-white"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end gap-2 pt-4 border-t">
//           <Button
//             type="button"
//             onClick={handleSubmit(onSubmit)}
//             disabled={
//               isSubmitting ||
//               mutation.isPending ||
//               checkoutMutation.isPending ||
//               selectedItems.length === 0
//             }
//             size="lg"
//             className="min-w-[140px]"
//           >
//             {isSubmitting ||
//             mutation.isPending ||
//             checkoutMutation.isPending ? (
//               <>
//                 <span className="animate-spin mr-2">⏳</span>
//                 Saving...
//               </>
//             ) : (
//               t("common.save")
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Checkout Dialog - REMOVED - Dialog no longer shown */}
//     </>
//   );
// }


//Version : 2
// File: components/customers/CustomerForm.jsx
// UPDATED: Per-item checkout with auto-calculated extra charges

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
// import { Calculator, AlertCircle } from "lucide-react";

// const inputStyles = `
//   input[type="number"]::-webkit-outer-spin-button,
//   input[type="number"]::-webkit-inner-spin-button {
//     -webkit-appearance: none;
//     margin: 0;
//   }
//   input[type="number"] {
//     -moz-appearance: textfield;
//   }
//   input:focus,
//   textarea:focus {
//     outline: none !important;
//     box-shadow: none !important;
//   }
// `;

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
  
//   // ✅ Per-item checkout data with auto-calculated charges
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

//   // ✅ Load customer data
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

//           // ✅ Load per-item checkout data
//           if (fetchedCustomer.itemsCheckoutData) {
//             setItemsCheckoutData(fetchedCustomer.itemsCheckoutData);
            
//             const totalExtra = Object.values(fetchedCustomer.itemsCheckoutData)
//               .reduce((sum, item) => sum + (item.extraCharges || 0), 0);
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
//         toast.error("Failed to load customer data: " + error.message);
//         setIsLoadingCustomer(false);
//       }
//     };

//     fetchCustomerData();
//   }, [customer?._id, setValue]);

//   // ✅ Calculate items total
//   useEffect(() => {
//     const total = selectedItems.reduce(
//       (sum, item) =>
//         sum + parseFloat(item.quantity || 0) * parseFloat(item.price || 0),
//       0
//     );
//     setItemsTotal(total);
//   }, [selectedItems]);

//   // ✅ Calculate total amount with all charges
//   useEffect(() => {
//     const transportCost = parseFloat(watch("transportCost")) || 0;
//     const maintenanceCharges = parseFloat(watch("maintenanceCharges")) || 0;
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

//   // ✅ Update per-item checkout field
//   const updateItemCheckout = (itemId, field, value) => {
//     setItemsCheckoutData((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         [field]: value,
//       },
//     }));
//   };

//   // ✅ Calculate extra charges for specific item
//   const calculateItemExtraCharges = async (itemId) => {
//     const formData = getValues();
//     const itemCheckout = itemsCheckoutData[itemId];

//     if (!itemCheckout?.checkOutDate || !itemCheckout?.checkOutTime) {
//       toast.error("Please enter checkout date and time for this item");
//       return;
//     }

//     const hourlyRate = parseFloat(itemCheckout.hourlyRate);
//     if (!hourlyRate || hourlyRate <= 0) {
//       toast.error("Please enter a valid hourly rate for this item");
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

//         // ✅ Update this item's checkout data with its own hourly rate
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

//         // ✅ Recalculate total extra charges
//         const totalExtra = Object.values(updatedCheckoutData).reduce(
//           (sum, item) => sum + (item.extraCharges || 0),
//           0
//         );

//         setTotalPerItemExtraCharges(totalExtra);

//         toast.success(
//           `✅ ${fullDays} day(s), ${extraHours} hour(s) @ ₹${hourlyRate}/hr\nExtra Charge: ₹${extraCharges.toLocaleString("en-IN")}`
//         );
//       }
//     } catch (error) {
//       console.error("Calculate duration error:", error);
//       toast.error("Failed to calculate duration");
//     } finally {
//       setIsCalculating(false);
//     }
//   };

//   const mutation = useMutation({
//     mutationFn: async (formData) => {
//       const errors = [];

//       if (selectedItems.length === 0) {
//         throw new Error("Please select at least one item");
//       }

//       if (!formData.name?.trim()) errors.push("Customer name is empty");
//       if (!formData.phone?.trim()) errors.push("Phone number is empty");
//       if (!formData.checkInDate) errors.push("Check-in date is empty");
//       if (!formData.checkInTime) errors.push("Check-in time is empty");
//       if (!formData.status) errors.push("Status is empty");

//       const totalAmount = parseFloat(formData.totalAmount) || 0;
//       const depositAmount = parseFloat(formData.depositAmount) || 0;
//       const givenAmount = parseFloat(formData.givenAmount) || 0;

//       if (givenAmount > totalAmount) {
//         errors.push(`Given (${givenAmount}) exceeds Total (${totalAmount})`);
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
//         totalAmount: parseFloat(formData.totalAmount) || 0,
//         depositAmount: parseFloat(formData.depositAmount) || 0,
//         givenAmount: givenAmount,
//         transportRequired: formData.transportRequired || false,
//         transportCost: parseFloat(formData.transportCost) || 0,
//         transportLocation: formData.transportLocation?.trim() || "",
//         maintenanceCharges: parseFloat(formData.maintenanceCharges) || 0,
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
//           ? "✅ Customer updated successfully!"
//           : "✅ Customer created successfully!"
//       );
//       queryClient.invalidateQueries({ queryKey: ["customers"] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       setIsSubmitting(false);
//       let errorMsg = error.message || "Failed to save customer";
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
//   const hourlyRate = watch("hourlyRate");

//   if (isLoadingCustomer && customer?._id) {
//     return (
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
//         <p className="text-lg font-semibold text-blue-900">
//           ⏳ Loading customer data...
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
//             <h4 className="font-semibold text-red-800 mb-2">❌ Issues Found:</h4>
//             {debugErrors.map((error, idx) => (
//               <p key={idx} className="text-sm text-red-700 mb-1">
//                 • {error}
//               </p>
//             ))}
//           </div>
//         )}

//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <Badge className="bg-blue-100">⏰ Per-Item Checkout with Auto-Calculation</Badge>
//           <p className="text-sm text-muted-foreground mt-2">
//             Set checkout time for each item separately. Extra charges will be calculated automatically based on hourly rate.
//           </p>
//         </div>

//         {/* Customer Information */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Customer Name *</Label>
//               <Input
//                 {...register("name")}
//                 placeholder="John Doe"
//                 className="border border-gray-300 bg-white"
//               />
//               {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
//             </div>
//             <div>
//               <Label>Phone Number *</Label>
//               <Input
//                 {...register("phone")}
//                 placeholder="9876543210"
//                 className="border border-gray-300 bg-white"
//               />
//               {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
//             </div>
//             <div className="md:col-span-2">
//               <Label>Address</Label>
//               <Input
//                 {...register("address")}
//                 placeholder="123 Main Street, City"
//                 className="border border-gray-300 bg-white"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Check-in Details */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Check-in Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Check-in Date *</Label>
//               <Input
//                 type="date"
//                 {...register("checkInDate")}
//                 className="border border-gray-300"
//               />
//             </div>
//             <div>
//               <Label>Check-in Time *</Label>
//               <Input
//                 type="time"
//                 {...register("checkInTime")}
//                 className="border border-gray-300"
//               />
//             </div>
//           </div>
//           <p className="text-xs text-blue-600 mt-3">
//             💡 Tip: Each item can have its own hourly rate. You'll set the rate when calculating charges for each item.
//           </p>
//         </div>

//         {/* Items with Per-Item Checkout & Hourly Rate */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Items - Checkout & Hourly Rates</h3>
          
//           {selectedItems.length === 0 ? (
//             <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
//               <p className="text-muted-foreground">No items selected. Add items below.</p>
//             </div>
//           ) : (
//             <div className="space-y-4 mb-6">
//               {selectedItems.map((item, idx) => {
//                 const itemKey = item.itemId || item._id;
//                 const itemCheckout = itemsCheckoutData[itemKey] || {};

//                 return (
//                   <Card key={idx} className="p-4 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
//                     <div className="space-y-4">
//                       {/* Item Info */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <Label className="text-sm font-semibold">Item</Label>
//                           <p className="text-base font-medium">{item.itemName || item.name}</p>
//                         </div>
//                         <div>
//                           <Label className="text-sm font-semibold">Cost</Label>
//                           <p className="text-base">
//                             {item.quantity} × ₹{item.price.toLocaleString("en-IN")} = ₹
//                             {(item.quantity * item.price).toLocaleString("en-IN")}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Checkout Fields & Hourly Rate */}
//                       <div className="border-t pt-4">
//                         <Label className="text-sm font-semibold block mb-3">Item Details</Label>
//                         <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
//                           <div>
//                             <Label className="text-xs">Checkout Date</Label>
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
//                             <Label className="text-xs">Time</Label>
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
//                             <Label className="text-xs">Hourly Rate (₹)</Label>
//                             <Input
//                               type="number"
//                               value={itemCheckout.hourlyRate || ""}
//                               onChange={(e) =>
//                                 updateItemCheckout(itemKey, "hourlyRate", parseFloat(e.target.value) || 0)
//                               }
//                               placeholder="100"
//                               min="0"
//                               step="1"
//                               className="border border-gray-300"
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
//                               {isCalculating ? "Calculating..." : "Calculate"}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Charges Display */}
//                       {itemCheckout.rentalDays !== undefined && (
//                         <div className="bg-white border border-orange-200 rounded-lg p-3">
//                           <div className="grid grid-cols-5 gap-2 text-center">
//                             <div>
//                               <p className="text-xs text-muted-foreground">Days</p>
//                               <p className="text-lg font-bold text-blue-600">{itemCheckout.rentalDays}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-muted-foreground">Hours</p>
//                               <p className="text-lg font-bold text-orange-600">{itemCheckout.extraHours}h</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-muted-foreground">Rate</p>
//                               <p className="text-sm font-bold text-purple-600">₹{itemCheckout.hourlyRate}/hr</p>
//                             </div>
//                             <div className="md:col-span-2">
//                               <p className="text-xs text-muted-foreground">Extra Charge</p>
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
//             <p className="text-sm text-red-600 font-medium mt-2">⚠️ Select at least one item</p>
//           )}
//         </div>

//         {/* Payment Summary */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//               <p className="text-xs text-muted-foreground">Items Cost</p>
//               <p className="text-2xl font-bold">₹{itemsTotal.toLocaleString("en-IN")}</p>
//             </div>

//             {totalPerItemExtraCharges > 0 && (
//               <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
//                 <p className="text-xs font-semibold text-orange-600">Extra Charges (from checkouts)</p>
//                 <p className="text-2xl font-bold text-orange-600">
//                   ₹{totalPerItemExtraCharges.toLocaleString("en-IN")}
//                 </p>
//               </div>
//             )}

//             <div>
//               <Label>Maintenance Charges</Label>
//               <Input
//                 type="number"
//                 {...register("maintenanceCharges")}
//                 placeholder="0"
//                 min="0"
//                 className="border border-gray-300"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Checkbox
//                 id="transport"
//                 checked={transportRequired}
//                 onCheckedChange={(checked) => setValue("transportRequired", checked)}
//               />
//               <Label htmlFor="transport">Transport Required</Label>
//             </div>

//             {transportRequired && (
//               <>
//                 <div>
//                   <Label>Transport Cost</Label>
//                   <Input
//                     type="number"
//                     {...register("transportCost")}
//                     placeholder="0"
//                     min="0"
//                     className="border border-gray-300"
//                   />
//                 </div>
//                 <div>
//                   <Label>Transport Location</Label>
//                   <Input
//                     {...register("transportLocation")}
//                     className="border border-gray-300"
//                   />
//                 </div>
//               </>
//             )}

//             <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-lg p-4">
//               <Label className="text-base font-semibold">Total Bill Amount</Label>
//               <p className="text-3xl font-bold text-green-600">
//                 ₹{parseFloat(watch("totalAmount") || 0).toLocaleString("en-IN")}
//               </p>
//               <p className="text-xs text-green-700 mt-2">
//                 Items + Extra Charges + Transport + Maintenance
//               </p>
//             </div>

//             <div>
//               <Label>Deposit</Label>
//               <Input type="number" {...register("depositAmount")} placeholder="0" min="0" className="border border-gray-300" />
//             </div>

//             <div>
//               <Label>Given Amount</Label>
//               <Input type="number" {...register("givenAmount")} placeholder="0" min="0" className="border border-gray-300" />
//             </div>

//             <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <Label className="text-base font-semibold">Remaining Amount</Label>
//               <p className="text-2xl font-bold text-blue-600">
//                 ₹{(parseFloat(watch("totalAmount") || 0) - parseFloat(watch("givenAmount") || 0)).toLocaleString("en-IN")}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Additional Info */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Fitter Name</Label>
//               <Input {...register("fitterName")} className="border border-gray-300" />
//             </div>
//             <div>
//               <Label>Status *</Label>
//               <Select value={watch("status")} onValueChange={(value) => setValue("status", value)}>
//                 <SelectTrigger className="border border-gray-300">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Active">Active</SelectItem>
//                   <SelectItem value="Completed">Completed</SelectItem>
//                   <SelectItem value="Cancelled">Cancelled</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="md:col-span-2">
//               <Label>Notes</Label>
//               <Input {...register("notes")} placeholder="Add notes..." className="border border-gray-300" />
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
//             {isSubmitting || mutation.isPending ? "Saving..." : "Save Customer"}
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }

// File: components/customers/CustomerForm.jsx
// COMPLETE: Per-item checkout with auto-calculated extra charges

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
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
import { customerService } from "@/services/customerService";
import ItemSelector from "./ItemSelector";
import { Calculator, AlertCircle } from "lucide-react";

const inputStyles = `
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  input:focus,
  textarea:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const optionalNumber = z.preprocess(
  (val) => (val === "" || val === null ? undefined : Number(val)),
  z.number().min(0).optional()
);

const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]*$/, "Phone number contains invalid characters"),
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

export default function CustomerForm({ customer, onSuccess }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState(
    customer?.items ? customer.items : []
  );
  const [itemsTotal, setItemsTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugErrors, setDebugErrors] = useState([]);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(!!customer?._id);
  
  // ✅ Per-item checkout data with auto-calculated charges
  const [itemsCheckoutData, setItemsCheckoutData] = useState({});
  const [totalPerItemExtraCharges, setTotalPerItemExtraCharges] = useState(0);
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
      name: "",
      phone: "",
      address: "",
      checkInDate: getTodayDate(),
      checkInTime: "10:00",
      totalAmount: "",
      depositAmount: "",
      givenAmount: "",
      transportRequired: false,
      transportCost: "",
      transportLocation: "",
      maintenanceCharges: "",
      fitterName: "",
      status: "Active",
      notes: "",
    },
  });

  // ✅ Load customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customer?._id) {
        setIsLoadingCustomer(false);
        return;
      }

      try {
        setIsLoadingCustomer(true);
        console.log("🔵 FETCHING CUSTOMER DATA FOR ID:", customer._id);

        const response = await customerService.getById(customer._id);
        const fetchedCustomer = response.data.data || response.data;

        console.log("📥 ✅ CUSTOMER DATA LOADED SUCCESSFULLY");
        console.log("Items Checkout Data:", fetchedCustomer.itemsCheckoutData);

        if (fetchedCustomer) {
          setValue("name", fetchedCustomer.name || "");
          setValue("phone", fetchedCustomer.phone || "");
          setValue("address", fetchedCustomer.address || "");

          if (fetchedCustomer.checkInDate) {
            const checkInDate = new Date(fetchedCustomer.checkInDate);
            setValue("checkInDate", checkInDate.toISOString().split("T")[0]);
          }

          setValue("checkInTime", fetchedCustomer.checkInTime || "10:00");
          setValue("hourlyRate", fetchedCustomer.hourlyRate || "");
          setValue("totalAmount", fetchedCustomer.totalAmount || 0);
          setValue("depositAmount", fetchedCustomer.depositAmount || 0);
          setValue("givenAmount", fetchedCustomer.givenAmount || 0);
          setValue("transportRequired", fetchedCustomer.transportRequired || false);
          setValue("transportCost", fetchedCustomer.transportCost || 0);
          setValue("transportLocation", fetchedCustomer.transportLocation || "");
          setValue("maintenanceCharges", fetchedCustomer.maintenanceCharges || 0);
          setValue("fitterName", fetchedCustomer.fitterName || "");
          setValue("status", fetchedCustomer.status || "Active");
          setValue("notes", fetchedCustomer.notes || "");

          // ✅ Load per-item checkout data
          if (fetchedCustomer.itemsCheckoutData) {
            setItemsCheckoutData(fetchedCustomer.itemsCheckoutData);
            
            const totalExtra = Object.values(fetchedCustomer.itemsCheckoutData)
              .reduce((sum, item) => sum + (parseFloat(item.extraCharges) || 0), 0);
            setTotalPerItemExtraCharges(totalExtra);
            
            console.log("✅ Per-item checkout data loaded:", fetchedCustomer.itemsCheckoutData);
          }

          if (fetchedCustomer.items && Array.isArray(fetchedCustomer.items)) {
            const formattedItems = fetchedCustomer.items.map((item) => ({
              _id: item._id || item.itemId,
              itemId: item.itemId || item._id,
              name: item.name || item.itemName,
              itemName: item.itemName || item.name,
              quantity: item.quantity,
              price: item.price,
            }));
            setSelectedItems(formattedItems);
            console.log("📦 ✅ ITEMS LOADED:", formattedItems);
          }
        }

        setIsLoadingCustomer(false);
      } catch (error) {
        console.error("❌ Error fetching customer:", error);
        toast.error("Failed to load customer data: " + error.message);
        setIsLoadingCustomer(false);
      }
    };

    fetchCustomerData();
  }, [customer?._id, setValue]);

  // ✅ Calculate items total
  useEffect(() => {
    const total = selectedItems.reduce(
      (sum, item) =>
        sum + parseFloat(item.quantity || 0) * parseFloat(item.price || 0),
      0
    );
    setItemsTotal(total);
  }, [selectedItems]);

  // ✅ Calculate total amount with all charges
  useEffect(() => {
    const transportCost = parseFloat(watch("transportCost")) || 0;
    const maintenanceCharges = parseFloat(watch("maintenanceCharges")) || 0;
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

  // ✅ Update per-item checkout field
  const updateItemCheckout = (itemId, field, value) => {
    setItemsCheckoutData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  // ✅ Calculate extra charges for specific item
  const calculateItemExtraCharges = async (itemId) => {
    const formData = getValues();
    const itemCheckout = itemsCheckoutData[itemId];

    if (!itemCheckout?.checkOutDate || !itemCheckout?.checkOutTime) {
      toast.error("Please enter checkout date and time for this item");
      return;
    }

    const hourlyRate = parseFloat(itemCheckout.hourlyRate);
    if (!hourlyRate || hourlyRate <= 0) {
      toast.error("Please enter a valid hourly rate for this item");
      return;
    }

    setIsCalculating(true);

    try {
      const response = await customerService.calculateDuration({
        checkInDate: formData.checkInDate,
        checkInTime: formData.checkInTime,
        checkOutDate: itemCheckout.checkOutDate,
        checkOutTime: itemCheckout.checkOutTime,
        hourlyRate: hourlyRate,
      });

      if (response.data.success) {
        const { fullDays, extraHours, extraCharges } = response.data.data;

        // ✅ Update this item's checkout data
        const updatedCheckoutData = {
          ...itemsCheckoutData,
          [itemId]: {
            ...itemsCheckoutData[itemId],
            checkOutDate: itemCheckout.checkOutDate,
            checkOutTime: itemCheckout.checkOutTime,
            hourlyRate: hourlyRate,
            rentalDays: fullDays,
            extraHours: extraHours,
            extraCharges: parseFloat(extraCharges),
          },
        };

        setItemsCheckoutData(updatedCheckoutData);

        // ✅ Recalculate total extra charges
        const totalExtra = Object.values(updatedCheckoutData).reduce(
          (sum, item) => sum + (parseFloat(item.extraCharges) || 0),
          0
        );

        setTotalPerItemExtraCharges(totalExtra);

        console.log("✅ Item checkout data updated:", updatedCheckoutData);

        toast.success(
          `✅ ${fullDays} day(s), ${extraHours} hour(s) @ ₹${hourlyRate}/hr\nExtra Charge: ₹${extraCharges.toLocaleString("en-IN")}`
        );
      }
    } catch (error) {
      console.error("Calculate duration error:", error);
      toast.error("Failed to calculate duration");
    } finally {
      setIsCalculating(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const errors = [];

      console.log("🔵 FORM SUBMISSION STARTED");
      console.log("Items Checkout Data:", itemsCheckoutData);

      if (selectedItems.length === 0) {
        throw new Error("Please select at least one item");
      }

      if (!formData.name?.trim()) errors.push("Customer name is empty");
      if (!formData.phone?.trim()) errors.push("Phone number is empty");
      if (!formData.checkInDate) errors.push("Check-in date is empty");
      if (!formData.checkInTime) errors.push("Check-in time is empty");
      if (!formData.status) errors.push("Status is empty");

      const totalAmount = parseFloat(formData.totalAmount) || 0;
      const depositAmount = parseFloat(formData.depositAmount) || 0;
      const givenAmount = parseFloat(formData.givenAmount) || 0;

      if (givenAmount > totalAmount) {
        errors.push(`Given (${givenAmount}) exceeds Total (${totalAmount})`);
      }

      if (errors.length > 0) {
        setDebugErrors(errors);
        throw new Error(errors.join("\n"));
      }

      const payload = {
        name: formData.name?.trim() || "",
        phone: formData.phone?.trim() || "",
        address: formData.address?.trim() || "",
        checkInDate: formData.checkInDate || "",
        checkInTime: formData.checkInTime || "",
        totalAmount: parseFloat(formData.totalAmount) || 0,
        depositAmount: parseFloat(formData.depositAmount) || 0,
        givenAmount: givenAmount,
        transportRequired: formData.transportRequired || false,
        transportCost: parseFloat(formData.transportCost) || 0,
        transportLocation: formData.transportLocation?.trim() || "",
        maintenanceCharges: parseFloat(formData.maintenanceCharges) || 0,
        fitterName: formData.fitterName?.trim() || "",
        status: formData.status || "Active",
        notes: formData.notes?.trim() || "",
        items: selectedItems.map((item) => ({
          itemId: item.itemId || item._id,
          itemName: item.itemName || item.name,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
        })),
        itemsCheckoutData: itemsCheckoutData, // ✅ IMPORTANT: Include checkout data
      };

      console.log("📦 Final Payload:", payload);

      try {
        let response;
        if (customer?._id) {
          console.log("🔄 UPDATING customer:", customer._id);
          response = await customerService.update(customer._id, payload);
        } else {
          console.log("🆕 CREATING new customer");
          response = await customerService.create(payload);
        }
        return response;
      } catch (apiError) {
        console.error("API Error:", apiError);
        throw apiError;
      }
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setDebugErrors([]);
      toast.success(
        customer
          ? "✅ Customer updated successfully!"
          : "✅ Customer created successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onSuccess?.();
    },
    onError: (error) => {
      setIsSubmitting(false);
      let errorMsg = error.message || "Failed to save customer";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      setDebugErrors([errorMsg]);
      toast.error(`❌ ${errorMsg}`);
    },
  });

  const onSubmit = (formData) => {
    setIsSubmitting(true);
    mutation.mutate(formData);
  };

  const transportRequired = watch("transportRequired");

  if (isLoadingCustomer && customer?._id) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-blue-900">
          ⏳ Loading customer data...
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{inputStyles}</style>
      <div className="space-y-6">
        {debugErrors.length > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">❌ Issues Found:</h4>
            {debugErrors.map((error, idx) => (
              <p key={idx} className="text-sm text-red-700 mb-1">
                • {error}
              </p>
            ))}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Badge className="bg-blue-100">⏰ Per-Item Checkout with Auto-Calculation</Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Set checkout time and hourly rate for each item separately. Extra charges will be calculated automatically.
          </p>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Customer Name *</Label>
              <Input
                {...register("name")}
                placeholder="John Doe"
                className="border border-gray-300 bg-white"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input
                {...register("phone")}
                placeholder="9876543210"
                className="border border-gray-300 bg-white"
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                {...register("address")}
                placeholder="123 Main Street, City"
                className="border border-gray-300 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Check-in Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Check-in Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Check-in Date *</Label>
              <Input
                type="date"
                {...register("checkInDate")}
                className="border border-gray-300"
              />
            </div>
            <div>
              <Label>Check-in Time *</Label>
              <Input
                type="time"
                {...register("checkInTime")}
                className="border border-gray-300"
              />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3">
            💡 Tip: Each item can have its own hourly rate and checkout time. Set rate when calculating.
          </p>
        </div>

        {/* Items with Per-Item Checkout */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Items - Checkout & Hourly Rates</h3>
          
          {selectedItems.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No items selected. Add items below.</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {selectedItems.map((item, idx) => {
                const itemKey = item.itemId || item._id;
                const itemCheckout = itemsCheckoutData[itemKey] || {};

                return (
                  <Card key={idx} className="p-4 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="space-y-4">
                      {/* Item Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold">Item</Label>
                          <p className="text-base font-medium">{item.itemName || item.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Cost</Label>
                          <p className="text-base">
                            {item.quantity} × ₹{item.price.toLocaleString("en-IN")} = ₹
                            {(item.quantity * item.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Checkout Fields */}
                      <div className="border-t pt-4">
                        <Label className="text-sm font-semibold block mb-3">Item Checkout Details</Label>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                          <div>
                            <Label className="text-xs">Checkout Date</Label>
                            <Input
                              type="date"
                              value={itemCheckout.checkOutDate || ""}
                              onChange={(e) =>
                                updateItemCheckout(itemKey, "checkOutDate", e.target.value)
                              }
                              className="border border-gray-300"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Time</Label>
                            <Input
                              type="time"
                              value={itemCheckout.checkOutTime || ""}
                              onChange={(e) =>
                                updateItemCheckout(itemKey, "checkOutTime", e.target.value)
                              }
                              className="border border-gray-300"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Hourly Rate (₹)</Label>
                            <Input
                              type="number"
                              value={itemCheckout.hourlyRate || ""}
                              onChange={(e) =>
                                updateItemCheckout(itemKey, "hourlyRate", parseFloat(e.target.value) || 0)
                              }
                              placeholder="100"
                              min="0"
                              step="1"
                              className="border border-gray-300"
                            />
                          </div>
                          <div className="md:col-span-2 flex items-end">
                            <Button
                              type="button"
                              onClick={() => calculateItemExtraCharges(itemKey)}
                              disabled={!itemCheckout.checkOutDate || !itemCheckout.checkOutTime || !itemCheckout.hourlyRate || isCalculating}
                              className="w-full flex items-center justify-center gap-2"
                            >
                              <Calculator className="h-4 w-4" />
                              {isCalculating ? "Calculating..." : "Calculate"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Charges Display */}
                      {itemCheckout.rentalDays !== undefined && (
                        <div className="bg-white border border-orange-200 rounded-lg p-3">
                          <div className="grid grid-cols-5 gap-2 text-center">
                            <div>
                              <p className="text-xs text-muted-foreground">Days</p>
                              <p className="text-lg font-bold text-blue-600">{itemCheckout.rentalDays}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Hours</p>
                              <p className="text-lg font-bold text-orange-600">{itemCheckout.extraHours}h</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Rate</p>
                              <p className="text-sm font-bold text-purple-600">₹{itemCheckout.hourlyRate}/hr</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs text-muted-foreground">Extra Charge</p>
                              <p className="text-lg font-bold text-red-600">
                                ₹{itemCheckout.extraCharges?.toLocaleString("en-IN") || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <ItemSelector selectedItems={selectedItems} onItemsChange={setSelectedItems} />
          {selectedItems.length === 0 && (
            <p className="text-sm text-red-600 font-medium mt-2">⚠️ Select at least one item</p>
          )}
        </div>

        {/* Payment Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Items Cost</p>
              <p className="text-2xl font-bold">₹{itemsTotal.toLocaleString("en-IN")}</p>
            </div>

            {totalPerItemExtraCharges > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-orange-600">Extra Charges (from checkouts)</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{totalPerItemExtraCharges.toLocaleString("en-IN")}
                </p>
              </div>
            )}

            <div>
              <Label>Maintenance Charges</Label>
              <Input
                type="number"
                {...register("maintenanceCharges")}
                placeholder="0"
                min="0"
                className="border border-gray-300"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="transport"
                checked={transportRequired}
                onCheckedChange={(checked) => setValue("transportRequired", checked)}
              />
              <Label htmlFor="transport">Transport Required</Label>
            </div>

            {transportRequired && (
              <>
                <div>
                  <Label>Transport Cost</Label>
                  <Input
                    type="number"
                    {...register("transportCost")}
                    placeholder="0"
                    min="0"
                    className="border border-gray-300"
                  />
                </div>
                <div>
                  <Label>Transport Location</Label>
                  <Input
                    {...register("transportLocation")}
                    className="border border-gray-300"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-lg p-4">
              <Label className="text-base font-semibold">Total Bill Amount</Label>
              <p className="text-3xl font-bold text-green-600">
                ₹{parseFloat(watch("totalAmount") || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-green-700 mt-2">
                Items + Extra Charges + Transport + Maintenance
              </p>
            </div>

            <div>
              <Label>Deposit</Label>
              <Input type="number" {...register("depositAmount")} placeholder="0" min="0" className="border border-gray-300" />
            </div>

            <div>
              <Label>Given Amount</Label>
              <Input type="number" {...register("givenAmount")} placeholder="0" min="0" className="border border-gray-300" />
            </div>

            <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Label className="text-base font-semibold">Remaining Amount</Label>
              <p className="text-2xl font-bold text-blue-600">
                ₹{(parseFloat(watch("totalAmount") || 0) - parseFloat(watch("givenAmount") || 0)).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Fitter Name</Label>
              <Input {...register("fitterName")} className="border border-gray-300" />
            </div>
            <div>
              <Label>Status *</Label>
              <Select value={watch("status")} onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger className="border border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Input {...register("notes")} placeholder="Add notes..." className="border border-gray-300" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || mutation.isPending || selectedItems.length === 0}
            size="lg"
            className="min-w-[140px]"
          >
            {isSubmitting || mutation.isPending ? "Saving..." : "Save Customer"}
          </Button>
        </div>
      </div>
    </>
  );
}