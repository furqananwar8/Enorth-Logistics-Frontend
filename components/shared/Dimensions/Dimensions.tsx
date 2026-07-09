"use client";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Cuboid, ChevronUp, Info, PackageCheck } from "lucide-react";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import DangerousGoodsForm from "./DangerousGoodDetails";
import { useDimensions } from "./Dimensions.hooks";
import { DimensionsMeasurementControls } from "./DimensionsMesurementControls";
import { PackageRow } from "./PackageRow";
import { DimensionsFooter } from "./DimensionsFooter";
// import type { ShipmentOptions } from "../DynamicQuote/DynamicQuote"
import { usePathname } from "next/navigation";
import { FTLPackageDimensions } from "./FTLPackageDimensions";
import type { ShipmentOptions } from "../DynamicQuote/DynamicQuote.types";
import { toast } from "sonner";

const Dimensions = forwardRef(
  (
    {
      shipmentType,
      onChange,
      quoteType,
      setIsDimensionsValid,
      viewOnly
    }: {
      shipmentType: ShipmentOptions[keyof ShipmentOptions];
      onChange?: (data: any) => void;
      quoteType: keyof ShipmentOptions;
      setIsDimensionsValid: (value: boolean) => void;
      viewOnly?:boolean;
    },
    ref,
  ) => {
    const {
      methods,
      fieldArray,
      handleAddPackage,
      handleClearDimensions,
      isOpen,
      setIsOpen,
      cachedSingleQuote,
    } = useDimensions(shipmentType);
    const { watch, setValue } = methods;

    useEffect(() => {
      const subscription = methods.watch((value) => {
        if (onChange) {
          onChange(value);
        }
      });
      return () => subscription.unsubscribe();
    }, [methods, onChange]);
    const { fields, append, remove } = fieldArray;

    const [packageDialogOpen, setPackageDialogOpen] = useState(false);
    // isShipment
    const pathname = usePathname();
    const isShipment = pathname.includes("shipment");
    useImperativeHandle(
      ref,
      () => ({
        getValues: methods.getValues,
        isValid: methods.formState.isValid,
        setValues: (vals: any) => methods.reset({ ...vals }),
        trigger: methods.trigger,
        open: () => setIsOpen(true),
      }),
      [methods],
    );

    // show error
    const errors = methods.formState.errors;
    // console.log("errors", errors)

    // is valid
    const isValid = methods.formState.isValid;

    useEffect(() => {
      setIsDimensionsValid(isValid)
    }, [isValid]);

    const handleQuantityChange = (targetCount: number) => {
      const currentCount = fields.length;
      
      // Read the current stackable value directly from the form
      const isStackable = methods.getValues("lineItem.stackable");

      if (shipmentType === "PALLET" && targetCount > 6 && !isStackable) {
        toast.info("Pallets more than 6 need to be stackable");
        // Optionally cap it at 6, or just return early to block the change
        targetCount = 6;
      }

      setValue("lineItem.quantity", targetCount);

      if (targetCount > currentCount) {
        append(
          Array(targetCount - currentCount).fill({
            quantity: 1,
            length: '',
            width: '',
            height: '',
            weight: '',
            description: "",
          }),
        );
      } else {
        remove(
          Array.from(
            { length: currentCount - targetCount },
            (_, i) => currentCount - 1 - i,
          ),
        );
      }
    };

    const isDangerousGood = watch("lineItem.dangerousGood");

    return (
      <FormProvider {...methods} key={shipmentType}>
        <form id="dimensions" className="space-y-6">
          <Accordion
            type="single"
            collapsible
            value={isOpen || viewOnly ? "dimensions" : ""}
            onValueChange={(val) => setIsOpen(!!val)}
            className="shadow-lg border border-border rounded-md bg-white dark:bg-card"
          >
            <AccordionItem value="dimensions" className="border-none">
              <AccordionTrigger className="group px-6 py-4 hover:no-underline items-center cursor-pointer [&>svg]:hidden!">
                <h2 className="flex gap-2 items-center text-lg font-semibold text-slate-800 dark:text-slate-100">
                  <PackageCheck />
                  {isShipment ? " Packaging Details" : "Dimensions & Weight"}
                  <ChevronUp className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </h2>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6 h-full space-y-6">
                <DimensionsMeasurementControls
                  shipmentType={shipmentType}
                  fieldCount={fields.length}
                  onQuantityChange={handleQuantityChange}
                  viewOnly={viewOnly}
                />
                {shipmentType !== "STANDARD_FTL" ? (
                  <div className="space-y-6 flex flex-col">
                    {fields.map((field, index) => (
                      <PackageRow
                        key={field.id}
                        index={index}
                        fieldId={field.id}
                        shipmentType={shipmentType}
                        canRemove={fields.length > 1}
                        onRemove={remove}
                        onClear={handleClearDimensions}
                        open={packageDialogOpen}
                        setOpen={setPackageDialogOpen}
                        quoteType={quoteType}
                        viewOnly={viewOnly}

                      />
                    ))}
                    {!viewOnly && <DimensionsFooter
                      shipmentType={shipmentType}
                      onAddPackage={handleAddPackage}
                    />}
                  </div>
                ) : (
                  <FTLPackageDimensions />
                )}

                <div className="pt-2">
                  <GlobalForm
                    formWrapperClassName="flex items-center gap-4"
                    fields={[
                      // { name: "lineItem.units.0.length", label: "Length", type: "number", defaultValue: 1, icon: <Info size={14} className="text-slate-800 dark:text-white" /> },
                      {
                        name: "lineItem.dangerousGood",
                        label: "Dangerous Goods",
                        type: "checkbox",
                        defaultValue: false,
                        icon: (
                          <Info
                            size={14}
                            className="text-slate-800 dark:text-white"
                          />
                        ),
                        show:
                          shipmentType === "PALLET" ||
                          shipmentType === "PACKAGE",
                      },
                      {
                        name: "lineItem.stackable",
                        label: "Stackable",
                        type: "checkbox",
                        defaultValue: false,
                        icon: (
                          <Info
                            size={14}
                            className="text-slate-800 dark:text-white"
                          />
                        ),
                        show: shipmentType === "PALLET",
                      },
                    ]}
                  />
                </div>

                {isDangerousGood && (
                  <DangerousGoodsForm
                    type="lineItem.dangerousGoods.type"
                    un="lineItem.dangerousGoods.un"
                    packagingGroup="lineItem.dangerousGoods.packagingGroup"
                    dgClass="lineItem.dangerousGoods.class"
                    technicalName="lineItem.dangerousGoods.technicalName"
                    emergencyContactName="lineItem.dangerousGoods.emergencyContactName"
                    emergencyContactPhone="lineItem.dangerousGoods.emergencyContactPhone"
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </FormProvider>
    );
  },
);

Dimensions.displayName = "Dimensions";
export default Dimensions;
