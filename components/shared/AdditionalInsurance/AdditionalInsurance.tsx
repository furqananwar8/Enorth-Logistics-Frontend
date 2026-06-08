import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Info, ShieldCheck } from "lucide-react";
import { Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { getSingleQuote } from "@/api/services/quotes.api";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/common/Loader";

import { FormProvider, useForm } from "react-hook-form";
import { forwardRef, useImperativeHandle, useState } from "react";

const AdditionalInsurance = forwardRef((props, ref) => {
    const methods = useForm({
        // defaultValues: {
        //     insurance: {
        //         amount: 0,
        //         currency: "CAD",
        //         type: "Freightcom"
        //     }
        // }
    });
    const { register, control, setValue } = methods;

    const [isOpen, setIsOpen] = useState(false);
    useImperativeHandle(ref, () => ({
        getValues: methods.getValues,
        setValues: (vals: any) => methods.reset({ ...vals }),
        trigger: methods.trigger,
        open: () => setIsOpen(true)
    }), [methods]);
    const quoteId = useSearchParams().get("id");
    const { data: cachedSingleQuote, isLoading, isPending } = useQuery({
        queryKey: ["singleQuote", quoteId],
        queryFn: () => quoteId ? getSingleQuote(quoteId) : null,
        enabled: !!quoteId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    useEffect(() => {
        if (cachedSingleQuote) {
            const insurance = cachedSingleQuote.quote.insurance;
            if (insurance) {
                setValue("insurance.amount", insurance.amount)
                setValue("insurance.currency", insurance.currency)
                setValue("insurance.type", insurance.type)
            }
        }
    }, [cachedSingleQuote, setValue]);
    if (quoteId) {
        if (isLoading || isPending) {
            return <Loader />
        }
    }
    return (
        <FormProvider {...methods}>
            <Accordion type="single" collapsible value={isOpen ? "insurance" : ""} onValueChange={(val) => setIsOpen(!!val)} className="shadow-lg border border-border rounded-md bg-white dark:bg-card">
                <AccordionItem value="insurance" className="border-none">
                    <AccordionTrigger className="group px-6 py-4 hover:no-underline items-center cursor-pointer [&>svg]:hidden!" >
                        <h2 className="font-semibold flex items-center gap-2 text-lg text-slate-800 dark:text-white">
                            <ShieldCheck />
                            Additional Insurance
                            <ChevronUp className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </h2>
                    </AccordionTrigger>

                    <AccordionContent className="px-6 pb-6 space-y-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-3">
                                <Label className="flex items-center gap-1 text-slate-500 font-normal">
                                    Total Cost Value of Goods being Shipped <Info size={14} className="text-slate-800" />
                                </Label>
                                <div className="flex items-center gap-4">
                                    <div className="relative max-w-[200px] w-full">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            {...register("insurance.amount", { valueAsNumber: true })}
                                            className="pl-7"
                                            placeholder="0"
                                            min={0}
                                        />
                                    </div>

                                    <Controller
                                        control={control}
                                        name="insurance.currency"
                                        defaultValue="CAD"
                                        render={({ field }) => (
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="flex space-x-4 cursor-pointer"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="CAD" id="currency-cad" className="text-amber-500 border-amber-500 cursor-pointer" />
                                                    <Label htmlFor="currency-cad" className="font-semibold cursor-pointer text-slate-800">CAD</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="USD" id="currency-usd" className="cursor-pointer" />
                                                    <Label htmlFor="currency-usd" className="font-normal cursor-pointer text-slate-500">USD</Label>
                                                </div>
                                            </RadioGroup>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-slate-500 font-normal">Insurance Type</Label>
                                <Controller
                                    control={control}
                                    name={"insurance.type"}
                                    render={({ field }) => (
                                        <Select value={field.value || "Freightcom"} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-[200px] bg-white cursor-pointer">
                                                <SelectValue placeholder="Freightcom" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem className="cursor-pointer" value="enorth">ENorth</SelectItem>
                                                <SelectItem className="cursor-pointer" value="thirdParty">Third Party</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-md flex gap-3 items-start text-sm text-slate-600 border border-blue-100">
                            <Info size={18} className="text-slate-800 shrink-0 mt-0.5" />
                            <p>
                                Please note that without the purchase of <span className="font-semibold text-slate-800">ENorth Insurance</span>, the carrier's liability for any loss or damage to your Parcel
                                Shipment will be limited to <span className="font-semibold text-slate-800">$2.00 per pound</span> or <span className="font-semibold text-slate-800">$100.00 per shipment</span>, whichever is applicable.
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </FormProvider>
    )
})

export default AdditionalInsurance;