import { Truck, ChevronUp } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ShipmentOptions } from "../DynamicQuote/DynamicQuote.types";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import InBond from "../AdditionalService/InBond";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { LIMITED_ACCESS_LOCATIONS } from "@/shared-data/shipment.data";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  spotFtlLineItemSchema,
  spotLtlLineItemSchema,
} from "../Dimensions/Dimensions.schema";
import DangerousGoodsForm from "../Dimensions/DangerousGoodDetails";
import { ltlEquipmentSelectorSchema, timeCriticalEquipmentSelectorSchema } from "./EquipmentTypeSelector.schema";

export const EquimentTypeSelector = forwardRef(
  (
    {
      shipmentType,
      onChange,
      quoteDetails,
    }: {
      shipmentType: ShipmentOptions[keyof ShipmentOptions];
      onChange?: (data: any) => void;
      quoteDetails: any;
    },
    ref,
  ) => {
    const dynamicSchema = (shipmentType: string) => {
      switch (shipmentType) {
        case "SPOT_LTL":
          return ltlEquipmentSelectorSchema;
        case "SPOT_FTL":
          return ltlEquipmentSelectorSchema;
        case "TIME_CRITICAL":
          return timeCriticalEquipmentSelectorSchema;
        default:
          return ltlEquipmentSelectorSchema;
      }
    };

    const schema = useMemo(() => {
      return dynamicSchema(shipmentType);
    }, [shipmentType]);
    const resolver = useMemo(() => zodResolver(schema as any), [schema]);
    const [isOpen, setIsOpen] = useState(false);
    const methods = useForm({
      resolver,
      defaultValues: {
        spotEquipment: {
          dryVan: true,
          //   flatbed: false,
          // isRefrigeratedCheck: false,
          //   ventilatedTrailer: false,
          //   refrigerated: {
          //     type: "",
          //   },
          //   nextFlighOut: {
          //     isKnownShipper: false,
          //   },
        },
        // refrigerated: {
        //   type: "FRESH",
        // },
        // services: {
        //   inBondCheckbox: false,
        //   inBond: {
        //     bondType: "",
        //     bondCancler: "",
        //     contactKey: "",
        //     contactValue: "",
        //     address: "",
        //   },
        //   //   protectFromFreeze: false,
        //   limitedAccessCheckbox: false,
        //   //   limitedAccess: "AMUSEMENT_PARK",
        //   //   limitedAccessDescription: "",
        //   //   dangerousGoods: false,
        //   //   allPalletsStackable: false,
        //   //   somePalletsStackable: false,
        // },
      },
    });

    useEffect(() => {
      const subscription = methods.watch((value) => {
        if (onChange) {
          onChange(value);
        }
      });
      return () => subscription.unsubscribe();
    }, [methods, onChange]);

    useImperativeHandle(ref, () => ({
      getValues: methods.getValues,
      trigger: methods.trigger,
      open: () => setIsOpen(true),
    }));

    // const [isRefrigerated, setIsRefrigerated] = useState(false)
    const isTimeCritical = shipmentType === "TIME_CRITICAL";

    const ltlOptions = [
      { label: "Dry Van", value: "dryVan" },
      { label: "Refrigerated Services", value: "refrigerated" },
    ];
    const timeCriticalOptions = [
      { label: "Truck", value: "truck" },
      { label: "Car", value: "car" },
      { label: "Van", value: "van" },
      { label: "Next Flight Out", value: "nextFlightOut" },
    ];
    const ftlOptions = [
      { label: "Dry Van", value: "dryVan" },
      { label: "Refrigerated Services", value: "refrigerated" },
      { label: "Flatbed", value: "flatbed" },
      { label: "Ventilated Trailer", value: "ventilatedTrailer" },
    ];
    // let isRefrigerated = false;
    // useEffect(() => {
    //   let isRefrigerated =
    //     methods.watch("spotEquipment.isRefrigeratedCheck") === true;
    //   console.log("isRefrigerated", isRefrigerated);
    // }, [methods]);

    useEffect(() => {
      const spotDetails = quoteDetails?.quote?.spotDetails;

      if (!spotDetails) return;
      const type =
        spotDetails?.spotEquipment?.dryVan === "true"
          ? "dryVan"
          : spotDetails?.spotEquipment?.flatbed === "true"
            ? "flatBed"
            : spotDetails?.spotEquipment?.ventilatedTrailer === "true"
              ? "ventilatedTrailer"
              : "";
      methods.reset({
        spotEquipment: {
          type,
          isRefrigeratedCheck:
            spotDetails?.spotEquipment?.isRefrigeratedCheck ?? false,
          refrigerated: {
            type: spotDetails?.spotEquipment?.refrigerated?.type ?? "",
          },
          isKnownShipper: spotDetails?.spotEquipment?.isKnownShipper ?? "",
          protectFromFreeze:
            spotDetails?.spotEquipment?.protectFromFreeze ?? false,
          dangerousGoods: spotDetails?.spotEquipment?.dangerousGoods ?? false,
          allPalletsStackable:
            spotDetails?.spotEquipment?.allPalletsStackable ?? false,
          somePalletsStackable:
            spotDetails?.spotEquipment?.somePalletsStackable ?? false,
        },

        services: {
          inBondCheckbox: spotDetails?.services?.inBondCheckbox ?? false,
          inBound: {
            bondType: spotDetails?.services?.inBond?.bondType ?? "",
            bondCancler: spotDetails?.services?.inBond?.bondCancler ?? "",
            contactKey: spotDetails?.services?.inBond?.contactKey ?? "",
            contactValue: spotDetails?.services?.inBond?.contactValue ?? "",
            address: spotDetails?.services?.inBond?.address ?? "",
          },
          // limitedAccessCheckbox:
          // spotDetails?.services?.limitedAccessCheckbox ?? false,
          // limitedAccess: spotDetails?.services?.limitedAccess ?? "",
          // limitedAccessDescription:
          // spotDetails?.services?.limitedAccessDescription ?? "",
        },
      });
    }, [quoteDetails, methods]);
    const isRefrigerated = methods.watch("spotEquipment") === "refrigerated";
    useEffect(() => {
      const subscription = methods.watch((value) => {
        console.log("EQUIPMENT VALUES:", value);
      });

      return () => subscription.unsubscribe();
    }, [methods.watch]);

    useEffect(() => {
      console.log("methods.formState.errors", methods.formState.errors);
    }, [methods.formState.errors]);

    const equipmentType = methods.watch("spotEquipment.type")
    return (
      <FormProvider {...methods}>
        <Accordion
          type="single"
          collapsible
          value={isOpen ? "equipment" : ""}
          onValueChange={(val) => setIsOpen(!!val)}
          className="shadow-lg border border-border rounded-md bg-white dark:bg-card"
        >
          <AccordionItem value="equipment" className="border-none">
            <AccordionTrigger className="group px-6 py-4 hover:no-underline items-center cursor-pointer [&>svg]:hidden!">
              <h2 className="flex gap-2 items-center text-lg font-semibold text-slate-800 dark:text-slate-100">
                <Truck size={20} />
                Equipment Type & {!isTimeCritical ? "Additional Services" : ""}
                <ChevronUp className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </h2>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-6 h-full">
              <div className="space-y-6">
                <GlobalForm
                  formWrapperClassName="grid grid-cols-1 md:grid-cols-6 gap-6"
                  fields={[
                    {
                      name: "spotEquipment.type",
                      type: "radio",
                      label:
                        "Please describe the equipment required for this shipment",
                      options:
                        shipmentType === "SPOT_LTL"
                          ? ltlOptions
                          : shipmentType === "SPOT_FTL"
                            ? ftlOptions
                            : timeCriticalOptions,
                      wrapperClassName: "col-span-full flex flex-col gap-4",
                    },
                    {
                      name: "refrigerated.type",
                      type: "radio",
                      label:
                        "Please specify what kind of Refrigerated Service is required:",
                      options: [
                        { label: "Fresh (32°F / 0°C)", value: "FRESH" },
                        { label: "Frozen (0°F / -17°C)", value: "FROZEN" },
                      ],
                      selectedClassName: "text-amber-500 border-amber-500",
                      show: isRefrigerated,
                      wrapperClassName: "col-span-full flex flex-col gap-4",
                    },
                    {
                      name: "spotEquipment.isKnownShipper",
                      type: "radio",
                      label:
                        "For Next Flight Out service, please verify if you are a known shipper",
                      options: [
                        { label: "Yes, I am a known shipper", value: "Yes" },
                        { label: "No, I am not a known shipper", value: "No" },
                      ],
                      selectedClassName: "text-amber-500 border-amber-500",
                      show: equipmentType === "nextFlightOut",
                    },
                    {
                      type: "non-input",
                      children: (
                        <p className="mt-4 text-sm font-medium">
                          Please specify any details regarding this shipment
                        </p>
                      ),
                      wrapperClassName: "col-span-full",
                    },
                    {
                      name: "services.inBondCheckbox",
                      type: "checkbox",
                      label: "In-Bond",
                      show: shipmentType === "SPOT_LTL",
                      wrapperClassName: "col-span-1",
                    },
                    {
                      name: "spotEquipment.protectFromFreeze",
                      type: "checkbox",
                      label: "Protect from Freeze",
                      show: shipmentType === "SPOT_LTL",
                      wrapperClassName: "col-span-1",
                    },
                    {
                      name: "services.limitedAccessCheckbox",
                      type: "checkbox",
                      label: "Limited Access",
                      show: shipmentType === "SPOT_LTL",
                      wrapperClassName: "col-span-1",
                    },
                    {
                      name: "dangerousGoods",
                      type: "checkbox",
                      label: "Dangerous Goods",
                      show: shipmentType === "SPOT_FTL",
                    },
                    {
                      name: "allPalletsStackable",
                      type: "checkbox",
                      label: "All Pallets Stackable",
                      show: shipmentType === "SPOT_FTL",
                    },
                    {
                      name: "somePalletsStackable",
                      type: "checkbox",
                      label: "Some Pallets Stackable",
                      show: shipmentType === "SPOT_FTL",
                    },
                  ]}
                />
                {methods.watch("services.inBondCheckbox") && (
                  <div className="my-4">
                    <InBond />
                  </div>
                )}
                {methods.watch("dangerousGoods") && (
                  <div className="my-4">
                    <DangerousGoodsForm />
                  </div>
                )}

                {methods.watch("services.limitedAccessCheckbox") && (
                  <div className="my-4">
                    <GlobalForm
                      fields={[
                        {
                          name: "services.limitedAccess",
                          label: "Location",
                          type: "radio",
                          valueType: "string",
                          options: LIMITED_ACCESS_LOCATIONS,
                          className: "grid grid-cols-2 gap-4",
                          wrapperClassName: "flex flex-col gap-4",
                        },
                        {
                          name: "services.limitedAccessDescription",
                          // label: "Other Location",
                          placeholder: "Please specify",
                          type: "text",
                          className: "w-1/3 ml-[50%]",
                          //   show:
                          //     methods.watch("services.limitedAccess") === "OTHER",
                        },
                      ]}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </FormProvider>
    );
  },
);
