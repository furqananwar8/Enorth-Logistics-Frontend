// Quantity select + metric/imperial radio — zero business logic here.
import { Controller, useFormContext } from "react-hook-form"
import { DensityCalculatorModal } from "./DensityCalculatorModal"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import type { ShipmentFormValues } from "./Dimensions.schema"

type Props = { shipmentType: string; fieldCount: number; onQuantityChange: (count: number) => void }

export function DimensionsMeasurementControls({ shipmentType, fieldCount, onQuantityChange }: Props) {
    const { control } = useFormContext<any>()
    
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-card border p-4 rounded-md">
            {shipmentType !== "STANDARD_FTL" && shipmentType !== "COURIER_PAK" ?
                <div className="flex items-center gap-4">
                    <Label className="font-semibold text-slate-800 dark:text-slate-100 mb-0">Quantity</Label>
                    <Select
                        value={fieldCount.toString()}
                        onValueChange={(val) => onQuantityChange(parseInt(val, 10))}
                    >
                        <SelectTrigger className="w-24 bg-white dark:bg-card">
                            <SelectValue placeholder="1" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: Math.max(10, fieldCount) }, (_, i) => i + 1).map((n) => (
                                <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div> : ""}

            <div className={`${shipmentType === "STANDARD_FTL" || shipmentType === "COURIER_PAK" ? "w-full" : "flex-col sm:items-end space-y-3"} flex `}>
                <Controller
                    control={control}
                    name="lineItem.measurementUnit"
                    defaultValue="IMPERIAL"
                    render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex space-x-6">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="METRIC" id="metric-global" />
                                <Label htmlFor="metric-global" className="font-normal cursor-pointer flex items-center gap-1 text-slate-500">
                                    Metric <span className="hidden sm:inline">(cm & kg)</span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="IMPERIAL" id="imperial-global" className="text-amber-500 border-amber-500" />
                                <Label htmlFor="imperial-global" className="font-semibold cursor-pointer text-slate-800 dark:text-slate-100">
                                    Imperial <span className="hidden sm:inline">(in & lbs)</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    )}
                />
                <DensityCalculatorModal />
            </div>
        </div>
    )
}