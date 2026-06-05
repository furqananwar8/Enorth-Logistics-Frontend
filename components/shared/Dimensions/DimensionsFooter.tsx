// Special handling checkbox + Add Package button + Dangerous Goods checkboxes
import { Controller, useFormContext } from "react-hook-form"
import { Plus, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { GlobalForm } from "@/components/common/form/GlobalForm"
import { ShipmentOptions } from "../DynamicQuote/DynamicQuote.types"


type Props = {
    shipmentType: ShipmentOptions[keyof ShipmentOptions]
    onAddPackage: () => void
}

export function DimensionsFooter({ shipmentType, onAddPackage }: Props) {
    const { control } = useFormContext<any>()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            {/* {shipmentType === "PACKAGE" && (
                <div className="flex items-center space-x-2">
                    <Controller
                        control={control}
                        name="lineItem.specialHandlingRequired"
                        render={({ field }) => (
                            <Checkbox checked={!!field.value} onCheckedChange={field.onChange} id="special-handling" />
                        )}
                    />
                    <Label htmlFor="special-handling" className="font-normal flex items-center gap-1 cursor-pointer">
                        Special Handling Required <Info size={14} className="text-slate-800 dark:text-white" />
                    </Label>
                </div>
            )} */}
            {shipmentType !== "COURIER_PAK" && <Button type="button" variant="outline" onClick={onAddPackage}>
                <Plus size={16} className="mr-1" /> Add Package
            </Button>}
        </div>
    )
}