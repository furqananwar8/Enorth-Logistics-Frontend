// One row. Knows nothing about the field array or form state above it.
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { X, PackageOpen, Save, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import AddPackage from "@/app/(user)/packages/AddPackage";
import { FREIGHT_CLASS_OPTIONS } from "./constants";
import { usePathname } from "next/navigation";
import PackageSelectionModal from "@/app/(user)/packages/PackageSelectionModal";
import { useEffect } from "react";
import { calculateClass } from "./DensityCalculatorModal";
import { PAGE_TYPES } from "next/dist/lib/page-types";
import { validateDimensionFields } from "./packageRow.utility";
import { ShipmentOptions } from "../DynamicQuote/DynamicQuote.types";

type Props = {
  index: number;
  fieldId: string;
  shipmentType: ShipmentOptions[keyof ShipmentOptions];
  canRemove: boolean;
  onRemove: (index: number) => void;
  onClear: (index: number) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

export function PackageRow({
  index,
  fieldId,
  shipmentType,
  canRemove,
  onRemove,
  onClear,
  open,
  setOpen,
  quoteType,
}: Props & { quoteType: keyof ShipmentOptions }) {
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext<any>();

  const measurementUnit = useWatch({ name: "lineItem.measurementUnit" });
  //   const watchedWeight = useWatch({ name: `lineItem.units.${index}.weight` });
  const isImperial = measurementUnit === "IMPERIAL";
  const lengthUnit = isImperial ? "in" : "cm";
  const weightUnit = isImperial ? "lbs" : "kg";
  const rowErrors = (errors as any)?.lineItem?.units?.[index];

  const pathname = usePathname();
  const isShipment = pathname.includes("shipment");
  // Snapshot current row values for the SavePackage dialog
  const rowSnapshot = {
    measurementUnit,
    length: watch(`lineItem.units.${index}.length`) as number | undefined,
    width: watch(`lineItem.units.${index}.width`) as number | undefined,
    height: watch(`lineItem.units.${index}.height`) as number | undefined,
    weight: watch(`lineItem.units.${index}.weight`) as number | undefined,
    freightClass: watch(`lineItem.units.${index}.freightClass`),
    nmfc: watch(`lineItem.units.${index}.nmfc`),
    shipmentType: watch(`lineItem.units.${index}.shipmentType`) as any,
    unitsOnPallet: watch(`lineItem.units.${index}.unitsOnPallet`) as
      | number
      | undefined,
    palletUnitType: watch(`lineItem.units.${index}.palletUnitType`),
    description: watch(`lineItem.units.${index}.description`),
  };
  const handlePackageSelect = (index: number, lineItem: any) => {
    // setAddressLocked(true)
    // methods.setValue("addressBookId", Number(contact.id));
    // methods.setValue("type", type);

    setValue(`lineItem.units.${index}`, {
      length: lineItem.length,
      width: lineItem.width,
      height: lineItem.height,
      weight: lineItem.weight,
      freightClass: lineItem.freightClass,
      nmfc: lineItem.nmfc,
      shipmentType: lineItem.shipmentType,
      unitsOnPallet: lineItem.unitsOnPallet,
      palletUnitType: lineItem.palletUnitType,
      description: lineItem.description,
    });
    // print location type
  };
  // if l,w,h,wg have values call calculate class function and set freight class
  useEffect(() => {
    const { length, width, height, weight } = rowSnapshot;
    if (length && width && height && weight) {
      const res = calculateClass(
        length,
        width,
        height,
        weight,
        measurementUnit,
      );
      setValue(`lineItem.units.${index}.freightClass`, res?.classEstim);
    }
  }, [
    rowSnapshot.length,
    rowSnapshot.width,
    rowSnapshot.height,
    rowSnapshot.weight,
  ]);

  const length = useWatch({
    name: `lineItem.units.${index}.length`,
  });

  const width = useWatch({
    name: `lineItem.units.${index}.width`,
  });

  const height = useWatch({
    name: `lineItem.units.${index}.height`,
  });

  const weight = useWatch({
    name: `lineItem.units.${index}.weight`,
  });
  //   useEffect(() => {
  //     // const { length, width, height, weight } = rowSnapshot;
  //     validateDimensionFields({
  //       index,
  //       weight,
  //       length,
  //       width,
  //       height,
  //       isImperial,
  //       weightUnit,
  //       lengthUnit,
  //       setError,
  //       clearErrors,
  //     });
  //   }, [
  //     rowSnapshot.length,
  //     rowSnapshot.width,
  //     rowSnapshot.height,
  //     rowSnapshot.weight,
  //     index,
  //   ]);

  const watchedLength = useWatch({
    name: `lineItem.units.${index}.length`,
  });

  const watchedWidth = useWatch({
    name: `lineItem.units.${index}.width`,
  });

  const watchedHeight = useWatch({
    name: `lineItem.units.${index}.height`,
  });

  const watchedWeight = useWatch({
    name: `lineItem.units.${index}.weight`,
  });

  useEffect(() => {
    if (quoteType !== "SPOT") {
      const weightField = `lineItem.units.${index}.weight`;
      const lengthField = `lineItem.units.${index}.length`;
      const widthField = `lineItem.units.${index}.width`;
      const heightField = `lineItem.units.${index}.height`;

      const weight = Number(watchedWeight);
      const length = Number(watchedLength);
      const width = Number(watchedWidth);
      const height = Number(watchedHeight);

      // Limits
      const maxWeight = isImperial ? 5000 : 2268;
      const maxLength = isImperial ? 120 : 305; // example
      const maxWidth = isImperial ? 96 : 244;
      const maxHeight = isImperial ? 96 : 244;

      // Weight
      if (weight && weight > maxWeight) {
        setError(weightField, {
          type: "manual",
          message: `Weight exceeds maximum allowed (${maxWeight} ${weightUnit})`,
        });
      } else {
        clearErrors(weightField);
      }

      // Length
      if (length && length > maxLength) {
        setError(lengthField, {
          type: "manual",
          message: `Length exceeds maximum allowed (${maxLength} ${lengthUnit})`,
        });
      } else {
        clearErrors(lengthField);
      }

      // Width
      if (width && width > maxWidth) {
        setError(widthField, {
          type: "manual",
          message: `Width exceeds maximum allowed (${maxWidth} ${lengthUnit})`,
        });
      } else {
        clearErrors(widthField);
      }

      // Height
      if (height && height > maxHeight) {
        setError(heightField, {
          type: "manual",
          message: `Height exceeds maximum allowed (${maxHeight} ${lengthUnit})`,
        });
      } else {
        clearErrors(heightField);
      }
    }
  }, [
    watchedWeight,
    watchedLength,
    watchedWidth,
    watchedHeight,
    isImperial,
    index,
  ]);
  const exceedDimensionLimitsError =
    rowErrors?.weight?.type === "manual" ||
    rowErrors?.length?.type === "manual" ||
    rowErrors?.width?.type === "manual" ||
    rowErrors?.height?.type === "manual";
  return (
    <div
      key={fieldId}
      className="space-y-4 pb-6 border-b last:border-0 relative group"
    >
      {/* Row header */}

      {/* Dimension fields */}
      <div className="flex items-start gap-2">
        {shipmentType !== "STANDARD_FTL" && shipmentType !== "COURIER_PAK" && (
          <span className="mt-8 mr-2">{index + 1}</span>
        )}
        <GlobalForm
          formWrapperClassName="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
          fields={[
            {
              name: `lineItem.units.${index}.length`,
              label: `Length (${lengthUnit})*`,
              type: "number",
              placeholder: "L",
              min: 0,
              labelClassName: rowErrors?.length
                ? "text-xs text-muted-foreground text-red-400"
                : "text-xs text-muted-foreground",
              show: !(shipmentType === "COURIER_PAK"),
            },
            {
              name: `lineItem.units.${index}.width`,
              label: `Width (${lengthUnit})*`,
              type: "number",
              placeholder: "W",
              min: 0,
              labelClassName: rowErrors?.length
                ? "text-xs text-muted-foreground text-red-400"
                : "text-xs text-muted-foreground",
              className: rowErrors?.width ? "border-red-500" : "",
              show: !(shipmentType === "COURIER_PAK"),
            },
            {
              name: `lineItem.units.${index}.height`,
              label: `Height (${lengthUnit})*`,
              type: "number",
              placeholder: "H",
              min: 0,
              labelClassName: rowErrors?.length
                ? "text-xs text-muted-foreground text-red-400"
                : "text-xs text-muted-foreground",
              className: rowErrors?.height ? "border-red-500" : "",
              show: !(shipmentType === "COURIER_PAK"),
            },
            {
              name: `lineItem.units.${index}.weight`,
              label: `Weight (${weightUnit})*`,
              type: "number",
              placeholder: "W",
              min: 0,
              labelClassName: rowErrors?.length
                ? "text-xs text-muted-foreground text-red-400"
                : "text-xs text-muted-foreground",
              className: rowErrors?.weight ? "border-red-500" : "",
            },
            {
              label: "Freight Class",
              type: "select",
              name: `lineItem.units.${index}.freightClass`,
              options: FREIGHT_CLASS_OPTIONS,
              labelClassName: "text-xs text-muted-foreground",
              placeholder: "Select Freight Class",
              show: shipmentType === "PALLET" || shipmentType === "SPOT_LTL",
            },
            {
              name: `lineItem.units.${index}.nmfc`,
              label: `NMFC`,
              type: "text",
              placeholder: "NMFC",
              labelClassName: "text-xs text-muted-foreground",
              show: shipmentType === "PALLET",
            },
            {
              name: `lineItem.units.${index}.palletUnitType`,
              label: "Type",
              type: "select",
              options: [
                { value: "PALLET", label: "Pallet" },
                { value: "DRUM", label: "Drum" },
                { value: "BOXES", label: "Boxes" },
                { value: "ROLLS", label: "Rolls" },
                { value: "PIPES_OR_TUBES", label: "Pipes or Tubes" },
                { value: "BALES", label: "Bales" },
                { value: "BAGS", label: "Bags" },
                { value: "CYLINDER", label: "Cylinder" },
                { value: "PAILS", label: "Pails" },
                { value: "REELS", label: "Reels" },
                { value: "CRATE", label: "Crate" },
                { value: "LOOSE", label: "Loose" },
                { value: "PIECES", label: "Pieces" },
              ],
              labelClassName: "text-xs text-muted-foreground",
              placeholder: "Select Pallet Unit Type",
              show:
                shipmentType === "PALLET" ||
                shipmentType === "SPOT_LTL" ||
                shipmentType === "SPOT_FTL" ||
                shipmentType === "TIME_CRITICAL",
            },
            {
              name: `lineItem.units.${index}.unitsOnPallet`,
              label: "Units on Pallet",
              type: "number",
              placeholder: "Units on Pallet",
              min: 0,
              labelClassName: "text-xs text-muted-foreground",
              show:
                shipmentType === "PALLET" ||
                shipmentType === "SPOT_LTL" ||
                shipmentType === "SPOT_FTL" ||
                shipmentType === "TIME_CRITICAL",
            },
            {
              name: `lineItem.units.${index}.description`,
              label: "Description",
              type: "text",
              placeholder: "Description",
              labelClassName: "text-xs text-muted-foreground",
              wrapperClassName: `col-span-1 sm:col-span-2 ${shipmentType === "STANDARD_FTL" || shipmentType === "COURIER_PAK" ? "md:col-span-3" : "md:col-span-4"}`,
            },
            // specialHandlingRequired
            {
              name: `lineItem.units.${index}.specialHandlingRequired`,
              label: "Special Handling Required",
              type: "checkbox",
              defaultValue: false,
              labelClassName: "text-xs text-muted-foreground",
              wrapperClassName: "col-span-8",
              show: shipmentType === "PACKAGE",
            },
          ]}
          extra={
            <div className="flex items-center gap-4 text-sm mt-6">
              <PackageSelectionModal
                selectedPackage={shipmentType}
                onSelect={(lineItem: any) =>
                  handlePackageSelect(index, lineItem)
                }
              />
              <AddPackage
                shipmentType={shipmentType}
                open={open}
                setOpen={setOpen}
                initialData={rowSnapshot}
              >
                <Button
                  variant="link"
                  type="button"
                  className="text-primary dark:text-accent"
                >
                  <Save /> Save Package
                </Button>
              </AddPackage>
              {canRemove ? (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 size={18} />
                  Delete
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onClear(index)}
                >
                  <X /> Clear
                </Button>
              )}
            </div>
          }
        />
      </div>
      {rowErrors && Object.keys(rowErrors).length > 0 && (
        <p className="text-xs text-red-500 ml-5">
          Please fill required dimensions
        </p>
      )}
      {exceedDimensionLimitsError && (
        <div className="flex items-start gap-3 rounded-md border border-secondary bg-ring/10 px-4 py-3 text-sm text-ring">
          <AlertCircle
            size={16}
            className="mt-0.5 text-secondary shrink-0 fill-ring"
          />

          <p className="leading-6">
            The pallet you are trying to ship is either too heavy or too large.
            Please{" "}
            <button
              type="button"
              className="text-primary underline hover:text-blue-700"
            >
              click here
            </button>{" "}
            to send the shipment details to our Spot Quoting team for a manual
            quote.
          </p>
        </div>
      )}
    </div>
  );
}
