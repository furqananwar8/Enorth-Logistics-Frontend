// One row. Knows nothing about the field array or form state above it.
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { X, PackageOpen, Save, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import AddPackage from "@/app/(user)/packages/AddPackage";
import { FREIGHT_CLASS_OPTIONS } from "./constants";
import { usePathname, useSearchParams } from "next/navigation";
import PackageSelectionModal from "@/app/(user)/packages/PackageSelectionModal";
import { useEffect, useMemo } from "react";
import { calculateClass } from "./DensityCalculatorModal";
import { PAGE_TYPES } from "next/dist/lib/page-types";
import { validateDimensionFields } from "./packageRow.utility";
import { ShipmentOptions } from "../DynamicQuote/DynamicQuote.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  index: number;
  fieldId: string;
  shipmentType: ShipmentOptions[keyof ShipmentOptions];
  canRemove: boolean;
  onRemove: (index: number) => void;
  onClear: (index: number) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  viewOnly?: boolean;
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
  viewOnly,
}: Props & { quoteType: keyof ShipmentOptions }) {
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    control,
    formState: { errors },
  } = useFormContext<any>();

  const measurementUnit = useWatch({ name: "lineItem.measurementUnit" });
  const searchParams = useSearchParams();
  const isSpotEditPage = searchParams.get("isSpotQuote")!;
  const isImperial = measurementUnit === "IMPERIAL";
  const lengthUnit = isImperial ? "in" : "cm";
  const weightUnit = isImperial ? "lbs" : "kg";
  const rowErrors = (errors as any)?.lineItem?.units?.[index];

  const pathname = usePathname();
  const isShipment = pathname.includes("shipment");

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
  };

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
    const length = Number(watchedLength);
    const width = Number(watchedWidth);
    const height = Number(watchedHeight);
    const weight = Number(watchedWeight);

    const allValid =
      !isNaN(length) && length > 0 &&
      !isNaN(width) && width > 0 &&
      !isNaN(height) && height > 0 &&
      !isNaN(weight) && weight > 0;

    if (allValid) {
      const res = calculateClass(length, width, height, weight, measurementUnit);
      if (res?.classEstim) {
        setValue(
          `lineItem.units.${index}.freightClass`,
          res.classEstim,
          { shouldTouch: true, shouldDirty: true }
        );
      }
    }
  }, [watchedLength, watchedWidth, watchedHeight, watchedWeight, measurementUnit, index, setValue]);

  useEffect(() => {
    if (quoteType !== "SPOT" && !isSpotEditPage) {
      const weightField = `lineItem.units.${index}.weight`;
      const lengthField = `lineItem.units.${index}.length`;
      const widthField = `lineItem.units.${index}.width`;
      const heightField = `lineItem.units.${index}.height`;

      const weight = Number(watchedWeight);
      const length = Number(watchedLength);
      const width = Number(watchedWidth);
      const height = Number(watchedHeight);

      const maxWeight = isImperial ? 5000 : 2268;
      const maxLength = isImperial ? 140 : 305;
      const maxWidth = isImperial ? 96 : 244;
      const maxHeight = isImperial ? 96 : 244;

      if (weight && weight > maxWeight) {
        setError(weightField, {
          type: "manual",
          message: `Weight exceeds maximum allowed (${maxWeight} ${weightUnit})`,
        });
      } else {
        clearErrors(weightField);
      }

      if (length && length > maxLength) {
        setError(lengthField, {
          type: "manual",
          message: `Length exceeds maximum allowed (${maxLength} ${lengthUnit})`,
        });
      } else {
        clearErrors(lengthField);
      }

      if (width && width > maxWidth) {
        setError(widthField, {
          type: "manual",
          message: `Width exceeds maximum allowed (${maxWidth} ${lengthUnit})`,
        });
      } else {
        clearErrors(widthField);
      }

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

  const watchedFreightClass = useWatch({
    name: `lineItem.units.${index}.freightClass`,
  });

  const freightClassOptions = useMemo(() => {
    const current = watchedFreightClass;
    if (current && !FREIGHT_CLASS_OPTIONS.some((o) => o.value === current)) {
      return [...FREIGHT_CLASS_OPTIONS, { value: current, label: current }];
    }
    return FREIGHT_CLASS_OPTIONS;
  }, [watchedFreightClass]);

  return (
    <div
      key={fieldId}
      className="space-y-4 pb-6 border-b last:border-0 relative group"
    >
      <div className="flex items-start gap-2">
        {shipmentType !== "STANDARD_FTL" && shipmentType !== "COURIER_PAK" && (
          <span className="mt-8 mr-2">{index + 1}</span>
        )}

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {/* Order 1-4: length, width, height, weight */}
          <GlobalForm
            formWrapperClassName="contents"
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
                className: "order-1",
                show: !(shipmentType === "COURIER_PAK"),
                disabled: viewOnly,
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
                className: rowErrors?.width ? "border-red-500 order-2" : "order-2",
                show: !(shipmentType === "COURIER_PAK"),
                disabled: viewOnly,
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
                className: rowErrors?.height ? "border-red-500 order-3" : "order-3",
                show: !(shipmentType === "COURIER_PAK"),
                disabled: viewOnly,
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
                className: rowErrors?.weight ? "border-red-500 order-4" : "order-4",
                disabled: viewOnly,
              },
              {
                name: `lineItem.units.${index}.nmfc`,
                label: `NMFC`,
                type: "text",
                placeholder: "NMFC",
                labelClassName: "text-xs text-muted-foreground",
                className: "order-6",
                show: shipmentType === "PALLET",
                disabled: viewOnly,
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
                className: "order-7",
                show:
                  shipmentType === "PALLET" ||
                  shipmentType === "SPOT_LTL" ||
                  shipmentType === "SPOT_FTL" ||
                  shipmentType === "TIME_CRITICAL",
                disabled: viewOnly,
              },
              {
                name: `lineItem.units.${index}.unitsOnPallet`,
                label: "Units on Pallet",
                type: "number",
                placeholder: "Units on Pallet",
                min: 0,
                labelClassName: "text-xs text-muted-foreground",
                className: "order-8",
                show:
                  shipmentType === "PALLET" ||
                  shipmentType === "SPOT_LTL" ||
                  shipmentType === "SPOT_FTL" ||
                  shipmentType === "TIME_CRITICAL",
                disabled: viewOnly,
              },
              {
                name: `lineItem.units.${index}.description`,
                label: "Description",
                type: "text",
                placeholder: "Description",
                labelClassName: "text-xs text-muted-foreground",
                wrapperClassName: `order-9 col-span-1 sm:col-span-2 ${shipmentType === "STANDARD_FTL" || shipmentType === "COURIER_PAK" ? "md:col-span-3" : "md:col-span-4"}`,
                disabled: viewOnly,
              },
              {
                name: `lineItem.units.${index}.specialHandlingRequired`,
                label: "Special Handling Required",
                type: "checkbox",
                defaultValue: false,
                labelClassName: "text-xs text-muted-foreground",
                wrapperClassName: "order-10 col-span-8",
                show: shipmentType === "PACKAGE",
                disabled: viewOnly,
              },
            ]}
            extra={!viewOnly &&
              <div className="flex items-center gap-4 text-sm mt-6 col-span-full order-11">
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
                    disabled={viewOnly}
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

          {/* Order 5: Freight Class — right after weight (order-4) */}
          {(shipmentType === "PALLET" || shipmentType === "SPOT_LTL") && (
            <div className="flex flex-col gap-1.5 order-5">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">Freight Class</Label>
              <Controller
                name={`lineItem.units.${index}.freightClass`}
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={viewOnly}
                    key={field.value || "empty"}
                  >
                    <SelectTrigger className="bg-white dark:bg-card w-full">
                      <SelectValue placeholder="Class" className="truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      {freightClassOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </div>
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