import { Truck, ChevronUp } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
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
import DangerousGoodsForm from "../Dimensions/DangerousGoodDetails";
import {
  ftlEquipmentSelectorSchema,
  ltlEquipmentSelectorSchema,
  timeCriticalEquipmentSelectorSchema,
} from "./EquipmentTypeSelector.schema";
import { useSearchParams } from "next/navigation";

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
          return ftlEquipmentSelectorSchema;
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
    const searchParams = useSearchParams();
    const isEdit = searchParams.get("mode") === "edit";
    console.log("isEdit,", isEdit);
    const methods = useForm({
      resolver,
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

    const [inBoundDetails, setInBoundDetails] = useState();
    useEffect(() => {
      const spotDetails = quoteDetails?.quote?.spotDetails;
      const inBoundDetails = quoteDetails?.quote?.palletServices;
      if (!spotDetails) return;
      console.log(
        "spotDetails?.spotEquipment?.refrigerated",
        spotDetails?.spotEquipment?.refrigerated,
      );
      setInBoundDetails(inBoundDetails);
      let type = "";

      switch (true) {
        // Common
        case spotDetails?.spotEquipment?.dryVan === "true":
          type = "dryVan";
          break;

        case !!spotDetails?.spotEquipment?.refrigerated:
          type = "refrigerated";
          break;

        // FTL
        case spotDetails?.spotEquipment?.flatbed === "true":
          type = "flatbed";
          break;

        case spotDetails?.spotEquipment?.ventilatedTrailer === "true":
          type = "ventilatedTrailer";
          break;

        // Time Critical
        case spotDetails?.spotEquipment?.truck === "true":
          type = "truck";
          break;

        case spotDetails?.spotEquipment?.car === "true":
          type = "car";
          break;

        case spotDetails?.spotEquipment?.van === "true":
          type = "van";
          break;

        case spotDetails?.spotEquipment?.nextFlightOut === "true":
          type = "nextFlightOut";
          break;

        default:
          type = "";
      }
      methods.reset({
        spotEquipment: {
          type,
          isRefrigeratedCheck: type === "refrigerated",
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
          inBondCheckbox: inBoundDetails?.inBound ?? false,
          inBound: {
            bondType: inBoundDetails?.inBound?.bondType ?? "",
            bondCancler: inBoundDetails?.inBound?.bondCancler ?? "",
            contactKey: inBoundDetails?.inBound?.contactKey ?? "",
            contactValue: inBoundDetails?.inBound?.contactValue ?? "",
            address: inBoundDetails?.inBound?.address ?? "",
          },
          // limitedAccessCheckbox:
          // spotDetails?.services?.limitedAccessCheckbox ?? false,
          // limitedAccess: spotDetails?.services?.limitedAccess ?? "",
          // limitedAccessDescription:
          // spotDetails?.services?.limitedAccessDescription ?? "",
        },
      });
    }, [quoteDetails, methods]);
    const isRefrigerated =
      methods.watch("spotEquipment.type") === "refrigerated";
    useEffect(() => {
      const subscription = methods.watch((value) => {
        console.log("EQUIPMENT VALUES:", value);
      });

      return () => subscription.unsubscribe();
    }, [methods.watch]);

    const dangerousGoodsCheckbox = methods.watch("dangerousGoodsCheckbox");
    useEffect(() => {
      if (dangerousGoodsCheckbox) {
        methods.setValue("services.dangerousGoods", {
          type: "",
          un: "",
          packagingGroup: "",
          class: "",
          technicalName: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
        });
      }
    }, [dangerousGoodsCheckbox]);

    const inBondCheckbox = methods.watch("services.inBondCheckbox");
    useEffect(() => {
      if (inBondCheckbox && !isEdit) {
        methods.setValue("services.inBound", {
          bondType: "",
          bondCancler: "",
          contactKey: "",
          contactValue: "",
          address: "",
        });
      }
    }, [inBondCheckbox]);
    const equipmentType = methods.watch("spotEquipment.type");
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
                Equipment Type {!isTimeCritical ? "& Additional Services" : ""}
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
                      name: "spotEquipment.refrigerated.type",
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
                      labelClassName: "whitespace-nowrap",
                      label: "Protect from Freeze",
                      show: shipmentType === "SPOT_LTL",
                    },
                    {
                      name: "services.limitedAccessCheckbox",
                      type: "checkbox",
                      labelClassName: "whitespace-nowrap",
                      label: "Limited Access",
                      show: shipmentType === "SPOT_LTL",
                    },
                    {
                      name: "dangerousGoodsCheckbox",
                      type: "checkbox",
                      labelClassName: "whitespace-nowrap",
                      label: "Dangerous Goods",
                      show: shipmentType === "SPOT_FTL",
                    },
                    {
                      name: "allPalletsStackable",
                      type: "checkbox",
                      labelClassName: "whitespace-nowrap",
                      label: "All Pallets Stackable",
                      show: shipmentType === "SPOT_FTL",
                    },
                    {
                      name: "somePalletsStackable",
                      type: "checkbox",
                      labelClassName: "whitespace-nowrap",
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
                {methods.watch("dangerousGoodsCheckbox") && (
                  <div className="my-4">
                    <DangerousGoodsForm
                      type="services.dangerousGoods.type"
                      un="services.dangerousGoods.un"
                      packagingGroup="services.dangerousGoods.packagingGroup"
                      dgClass="services.dangerousGoods.class"
                      technicalName="services.dangerousGoods.technicalName"
                      emergencyContactName="services.dangerousGoods.emergencyContactName"
                      emergencyContactPhone="services.dangerousGoods.emergencyContactPhone"
                    />
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
