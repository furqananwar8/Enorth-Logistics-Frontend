import { GlobalForm } from "@/components/common/form/GlobalForm"
// import { FormCheckbox } from "@/components/common/form/fields/FormCheckbox"
import { ChevronUp, Info, ListTodo, ShieldCheck } from "lucide-react"
import { useFormContext } from "react-hook-form"
import InBond from "./InBond"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getSingleQuote } from "@/api/services/quotes.api"
import { useEffect } from "react"
import { Loader } from "@/components/common/Loader"
import { FormProvider, useForm } from "react-hook-form"
import { forwardRef, useImperativeHandle, useState } from "react"
import FormCheckbox from "@/components/common/form/fields/FormCheckbox"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import DangerousGoodsForm from "../Dimensions/DangerousGoodDetails"
import { LIMITED_ACCESS_LOCATIONS } from "@/shared-data/shipment.data"
import { ShipmentOptions } from "../DynamicQuote/DynamicQuote.types"

const AdditionalServices = forwardRef(({ shipmentType, quoteType, onChange }: { shipmentType: ShipmentOptions[keyof ShipmentOptions], quoteType: "SPOT" | "STANDARD", onChange?: (data: any) => void }, ref) => {
    const additionalServicesSchema = z.object({
        limitedAccess: z.boolean().optional(),
        inBondCheckbox: z.boolean().optional(),
        inBound: z.object({
            bondType: z.string().optional(),
            bondCancler: z.string().optional(),
            contactKey: z.string().optional(),
            contactValue: z.string().optional().default("EMAIL"),
            address: z.string().optional()
        }).optional(),
        services: z.object({
            limitedAccess: z.string().optional(),
            appointmentDelivery: z.boolean().optional(),
            thresholdDelivery: z.boolean().optional(),
            thresholdPickup: z.boolean().optional(),
            protectFromFreeze: z.boolean().optional(),
            tradeShowDelivery: z.boolean().optional(),
            amazonOrFbaDelivery: z.boolean().optional(),
            refrigeratedServices: z.boolean().optional(),
            looseFreight: z.boolean().optional(),
            pallets: z.boolean().optional(),
            liftGateRequired: z.boolean().optional(),
            residentialPickup: z.boolean().optional(),
            residentialDelivery: z.boolean().optional(),
            insideDelivery: z.boolean().optional(),
            insidePickup: z.boolean().optional(),
            insideDeliveryStairs: z.boolean().optional(),
            insidePickupStairs: z.boolean().optional(),
            // limitedAccess.location:z.string().optional(),
            limitedAccessDescription: z.string().optional(),
            dangerousGood: z.boolean().optional(),

        }),

    })
    const methods = useForm({
        resolver: zodResolver(additionalServicesSchema),
        mode: "onChange",
        defaultValues: {
            limitedAccess: false,
            inBound: {
                bondType: "",
                bondCancler: "",
                contactKey: "EMAIL",
                contactValue: "",
                address: ""
            }
        }
    })

    useEffect(() => {
        const subscription = methods.watch((value) => {
            if (onChange) {
                onChange(value);
            }
        });
        return () => subscription.unsubscribe();
    }, [methods, onChange]);

    const { watch, setValue, getValues } = methods
    const [isOpen, setIsOpen] = useState(false)
    useImperativeHandle(ref, () => ({
        getValues: methods.getValues,
        setValues: (vals: any) => methods.reset({ ...vals }),
        trigger: methods.trigger,
        open: () => setIsOpen(true)
    }), [methods]);
    const quoteId = useSearchParams().get("id")
    const { data: cachedSingleQuote, isLoading, isPending } = useQuery({
        queryKey: ["singleQuote", quoteId],
        queryFn: () => quoteId ? getSingleQuote(quoteId) : null,
        enabled: !!quoteId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
    useEffect(() => {
        if (cachedSingleQuote) {
            console.log("cachedSingleQuote.quote.palletServices", cachedSingleQuote.quote.palletServices)
            const services = cachedSingleQuote.quote.palletServices;
            if (services) {
                setValue("limitedAccess", true)
                setValue("services.limitedAccess", services.limitedAccess)
                setValue("services.appointmentDelivery", services.appointmentDelivery)
                setValue("services.thresholdDelivery", services.thresholdDelivery)
                setValue("services.thresholdPickup", services.thresholdPickup)
                // setValue("inbound", services.inbound)
                setValue("services.protectFromFreeze", services.protectFromFreeze)
                setValue("services.tradeShowDelivery", services.tradeShowDelivery)
                setValue("services.amazonOrFbaDelivery", services.amazonOrFbaDelivery)
                setValue("services.refrigeratedServices", services.refrigeratedServices)
                setValue("services.looseFreight", services.looseFreight)
                setValue("services.pallets", services.pallets)
                setValue("services.liftGateRequired", services.liftGateRequired)
                setValue("services.residentialPickup", services.residentialPickup)
                setValue("services.residentialDelivery", services.residentialDelivery)
                setValue("services.insideDelivery", services.insideDelivery)
                setValue("services.insidePickup", services.insidePickup)
                setValue("services.insideDeliveryStairs", services.insideDeliveryStairs)
                setValue("services.insidePickupStairs", services.insidePickupStairs)
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
                        <h2 className="font-semibold flex items-center gap-2 text-lg text-slate-700 dark:text-white ">
                            <ListTodo />
                            Additional Services
                            <ChevronUp className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </h2>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-6 h-full">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-3 ">
                                {/* {quoteType === "SPOT" ? <FormCheckbox
                                    field={{
                                        name: "limitedAccess",
                                        label: "Limited Access",
                                        defaultValue: false,
                                        icon: <Info size={16} />,
                                    }}
                                /> : ""} */}

                                <div className="my-4">
                                    <GlobalForm
                                        formWrapperClassName="grid grid-cols-1 sm:grid-cols-3 gap-4"
                                        fields={[
                                            // dangerous good
                                            {
                                                name: "services.dangerousGood",
                                                label: "Dangerous Good",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                                show: quoteType === "SPOT",
                                                wrapperClassName: "col-span-full"
                                            },
                                            {
                                                type: "non-input",
                                                children: <DangerousGoodsForm />,
                                                show: watch("services.dangerousGood"),
                                                wrapperClassName: "col-span-full"
                                            },
                                            // limited access
                                            {
                                                name: "limitedAccess",
                                                label: "Limited Access",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                                show: quoteType !== "SPOT"
                                            },
                                            {
                                                name: "services.limitedAccess",
                                                label: "Location",
                                                type: "radio",
                                                options: LIMITED_ACCESS_LOCATIONS,
                                                wrapperClassName: " col-span-full",
                                                className: "grid grid-cols-2 gap-4 mt-4",
                                                show: quoteType !== "SPOT" && watch("limitedAccess")
                                            },
                                            {
                                                name: "limitedAccessDescription",
                                                // label: "Other Location",
                                                placeholder: "Please specify",
                                                type: "text",
                                                className: "w-1/3 ml-[50%]",
                                                show: watch("services.limitedAccess") === "other",
                                                wrapperClassName: "col-span-full"
                                            },
                                            // services.appointmentDelivery
                                            {
                                                name: "services.appointmentDelivery",
                                                label: "Appointment Delivery",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                            },
                                            // services.thresholdDelivery
                                            {
                                                name: "services.thresholdDelivery",
                                                label: "Threshold Delivery",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                            },
                                            // services.thresholdPickup
                                            {
                                                name: "services.thresholdPickup",
                                                label: "Threshold Pickup",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                            },
                                            // services.protectFromFreeze
                                            {
                                                name: "services.protectFromFreeze",
                                                label: "Protect From Freeze",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                                show: quoteType !== "SPOT"

                                            },
                                            // services.tradeShowDelivery
                                            {
                                                name: "services.tradeShowDelivery",
                                                label: "Trade Show Delivery",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                            },
                                            // services.amazonOrFbaDelivery
                                            {
                                                name: "services.amazonOrFbaDelivery",
                                                label: "Amazon or FBA Delivery",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                            },
                                            // services.refrigeratedServices
                                            {
                                                name: "services.refrigeratedServices",
                                                label: "Refrigerated Services",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                                show: quoteType !== "SPOT"

                                            },
                                            // Grocery/Retail Distribution Center
                                            {
                                                name: "services.groceryRetailDistributionCenter",
                                                label: "Grocery/Retail Distribution Center",
                                                type: "checkbox",
                                                defaultValue: false,
                                                icon: <Info size={16} />,
                                                show: quoteType === "SPOT"
                                            },
                                            // services.looseFreight

                                        ]}
                                    />


                                </div>

                            </div>


                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </FormProvider>
    )
})

export default AdditionalServices;