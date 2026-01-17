import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Calculator, Clock, DollarSign, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customerService } from "@/services/customerService";

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

export default function CheckoutModal({ customer, onSuccess, onClose }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [checkOutDate, setCheckOutDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkOutTime, setCheckOutTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );
  const [itemsExtraCharges, setItemsExtraCharges] = useState({});
  const [itemsExtraHours, setItemsExtraHours] = useState({});
  const [calculatedData, setCalculatedData] = useState({});
  const [activeTab, setActiveTab] = useState("calculate");
  const [isCalculating, setIsCalculating] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      return await customerService.checkout(customer._id, {
        checkOutDate,
        checkOutTime,
        itemsExtraCharges,
        itemsExtraHours,
      });
    },
    onSuccess: () => {
      toast.success("✅ Customer checked out successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onSuccess?.();
      onClose?.();
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(`❌ ${errorMsg}`);
    },
  });

  const handleCalculateAll = async () => {
    try {
      setIsCalculating(true);
      const calculations = {};
      let hasError = false;

      for (const item of customer.items || []) {
        const itemId = item.itemId || item._id;

        try {
          const response = await customerService.calculateDuration({
            checkInDate: new Date(customer.checkInDate)
              .toISOString()
              .split("T")[0],
            checkInTime: customer.checkInTime,
            checkOutDate: checkOutDate,
            checkOutTime: checkOutTime,
            hourlyRate: item.price || 0,
            quantity: item.quantity || 1,
          });

          if (response.data.success) {
            const { totalDays, totalExtraHours, extraCharges, isWithinFreeWindow } =
              response.data.data;

            calculations[itemId] = {
              itemName: item.itemName || item.name,
              totalDays,
              totalExtraHours,
              extraCharges,
              isWithinFreeWindow,
              quantity: item.quantity,
              dailyRate: item.price,
            };

            setItemsExtraCharges((prev) => ({
              ...prev,
              [itemId]: extraCharges,
            }));
          }
        } catch (error) {
          console.error(`Error calculating for item ${itemId}:`, error);
          hasError = true;
        }
      }

      setCalculatedData(calculations);
      setActiveTab("review");

      if (hasError) {
        toast.error("⚠️ Some calculations failed. Please review.");
      } else {
        toast.success("✅ Duration calculated for all items!");
      }
    } catch (error) {
      toast.error("❌ Failed to calculate duration");
    } finally {
      setIsCalculating(false);
    }
  };

  const updateExtraHours = (itemId, hours) => {
    setItemsExtraHours((prev) => ({
      ...prev,
      [itemId]: parseNumberInput(hours),
    }));
  };

  const updateExtraCharges = (itemId, charges) => {
    setItemsExtraCharges((prev) => ({
      ...prev,
      [itemId]: parseNumberInput(charges),
    }));
  };

  const getTotalExtraCharges = () => {
    return Object.values(itemsExtraCharges).reduce(
      (sum, charge) => sum + parseNumberInput(charge),
      0
    );
  };

  const isCalculationDone = Object.keys(calculatedData).length > 0;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculate" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculate" className="space-y-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">Checkout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Customer</Label>
                  <p className="text-lg font-medium">{customer.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Check-in</Label>
                  <p className="text-sm">
                    {new Date(customer.checkInDate).toLocaleDateString("en-IN")} at{" "}
                    {customer.checkInTime}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Current Total</Label>
                  <p className="text-lg font-bold text-green-600">
                    ₹{customer.totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold text-sm">Select Checkout Date & Time</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Checkout Date *</Label>
                    <Input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label>Checkout Time *</Label>
                    <Input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCalculateAll}
                  className="w-full"
                  disabled={isCalculating || mutation.isPending}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {isCalculating ? "Calculating..." : "Calculate Duration for All Items"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-amber-800">
                  <p><strong>24-Hour Cycle Calculation:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>First 24 hours from check-in time = FREE</li>
                    <li>Complete 24-hour cycles after = Charged per day</li>
                    <li>Remaining hours = Optional (you can add manually)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {!isCalculationDone ? (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-4 text-center">
                <p className="text-muted-foreground">Please calculate duration first</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3">
                {(customer.items || []).map((item) => {
                  const itemId = item.itemId || item._id;
                  const calc = calculatedData[itemId];
                  const extraCharge = parseNumberInput(itemsExtraCharges[itemId] || 0);
                  const extraHours = parseNumberInput(itemsExtraHours[itemId] || 0);

                  if (!calc) return null;

                  return (
                    <Card key={itemId} className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>{calc.itemName}</span>
                          {calc.isWithinFreeWindow && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              ✅ FREE
                            </span>
                          )}
                          {!calc.isWithinFreeWindow && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              ⏰ LATE
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="grid grid-cols-4 gap-2 text-center text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Days</p>
                              <p className="text-lg font-bold text-blue-600">{calc.totalDays}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Qty</p>
                              <p className="text-lg font-bold text-purple-600">{calc.quantity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Rate</p>
                              <p className="text-sm font-bold text-green-600">₹{calc.dailyRate}/day</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Extra Hours</p>
                              <p className="text-lg font-bold text-orange-600">{calc.totalExtraHours}h</p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-3 space-y-3">
                          {calc.totalExtraHours > 0 && (
                            <div>
                              <Label className="text-sm font-semibold flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Add Extra Hours Charge (Optional)
                              </Label>
                              <p className="text-xs text-gray-600 mb-2">
                                Remaining {calc.totalExtraHours} hours - charge if needed
                              </p>
                              <Input
                                type="text"
                                inputMode="decimal"
                                value={extraHours}
                                onChange={(e) => {
                                  const formatted = formatDecimalInput(e.target.value);
                                  updateExtraHours(itemId, formatted);
                                }}
                                placeholder="0"
                                className="border-gray-300 bg-white font-semibold"
                                onWheel={(e) => e.preventDefault()}
                              />
                              <p className="text-xs text-gray-500 mt-1">For {calc.totalExtraHours} hours</p>
                            </div>
                          )}

                          <div>
                            <Label className="text-sm font-semibold flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Extra Charge
                            </Label>
                            <p className="text-xs text-gray-600 mb-2">
                              Auto-calculated: ₹{calc.extraCharges}
                              {extraHours > 0 && ` + ₹${extraHours} (extra hours)`}
                            </p>
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={extraCharge}
                              onChange={(e) => {
                                const formatted = formatDecimalInput(e.target.value);
                                updateExtraCharges(itemId, formatted);
                              }}
                              placeholder="0"
                              className="border-gray-300 bg-white font-semibold"
                              onWheel={(e) => e.preventDefault()}
                            />
                            <p className="text-xs text-gray-500 mt-1">You can modify if needed</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-base">Checkout Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Current Total:</span>
                    <span className="font-semibold">₹{customer.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="font-semibold">Extra Charges (All Items):</span>
                    <span className="font-bold text-orange-600">₹{getTotalExtraCharges().toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-lg border-t pt-2 font-bold">
                    <span>New Total:</span>
                    <span className="text-green-600">
                      ₹{(customer.totalAmount + getTotalExtraCharges()).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Already Paid:</span>
                    <span>₹{customer.givenAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-lg border-t pt-2 font-bold">
                    <span>Still Remaining:</span>
                    <span className={getTotalExtraCharges() > 0 ? "text-red-600" : "text-green-600"}>
                      ₹{(customer.totalAmount + getTotalExtraCharges() - customer.givenAmount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {mutation.isPending ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>✅ Confirm Checkout</>
                  )}
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}