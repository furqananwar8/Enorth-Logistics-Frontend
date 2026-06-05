"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info, Loader2, PackageIcon, PackagePlus } from "lucide-react";
import FormField from "@/components/common/form/fields/FormField";
import { useState, useEffect, useMemo } from "react";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import {
  createPackage,
  CreatePackagePayload,
  PackagePayload,
  updatePackage,
  UpdatePackagePayload,
} from "@/api/services/packages.api";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { calculateClass } from "@/components/shared/Dimensions/DensityCalculatorModal";
import { ShipmentOptions } from "@/components/shared/DynamicQuote/DynamicQuote.types";

const baseSchema = z.object({
  measurementUnit: z.enum(["METRIC", "IMPERIAL"]),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  weight: z.number().min(0, "Weight is required"),
});
const palletSchema = baseSchema.extend({
  shipmentType: z.literal("PALLET"),
  length: z.number().min(0, "Length is required"),
  height: z.number().min(0, "Height is required"),
  width: z.number().min(0, "Width is required"),
  freightClass: z.string().min(1, "Freight Class is required"),
  nmfc: z.string().optional(),
  unitsOnPallet: z.number().min(1, "Units on Pallet is required"),
  palletUnitType: z.string().min(1, "Pallet Unit Type is required"),
});
const packageSchema = palletSchema.extend({
  shipmentType: z.literal("PACKAGE"),
  specialHandlingRequired: z.boolean().optional(),
});
const courierPakSchema = baseSchema.extend({
  shipmentType: z.literal("COURIER_PAK"),
});

const shipmentSchema = z.discriminatedUnion("shipmentType", [
  palletSchema,
  packageSchema,
  courierPakSchema,
]);
export type ShipmentFormValues = z.infer<typeof shipmentSchema>;
export type PalletFormValues = z.infer<typeof palletSchema>;
export type PackageFormValues = z.infer<typeof packageSchema>;
export type CourierPakFormValues = z.infer<typeof courierPakSchema>;

type AddPackageProps = {
  id?: string;
  initialData?: Partial<PackageFormValues>;
  onSave?: (data: PackageFormValues) => void;
  children?: React.ReactNode;
  shipmentType?: ShipmentOptions[keyof ShipmentOptions];
  open: boolean;
  setOpen: (open: boolean) => void;
};
export const normalText = (text: string) =>
  text?.toLowerCase().replaceAll("_", " ");

export default function AddPackage({
  id,
  shipmentType,
  initialData,
  onSave,
  children,
  open,
  setOpen,
}: AddPackageProps) {
  // Determine Add or Edit mode
  const isEdit = !!initialData?.name;
  const isNew = !shipmentType;
  const queryClient = useQueryClient();
  const methods = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      measurementUnit: "METRIC",
      shipmentType: shipmentType as ShipmentFormValues["shipmentType"],
    },
  });

  useEffect(() => {
    if (open && initialData) {
      // console.log("initialData", initialData)
      methods.reset({ ...initialData, shipmentType: shipmentType as any });
    } else if (open && !initialData) {
      methods.reset({
        measurementUnit: "METRIC",
        name: "",
        shipmentType: shipmentType as any,
      });
    }
  }, [open]);

  const measurementUnit = methods.watch("measurementUnit");
  const isImperial = measurementUnit === "IMPERIAL";
  const lengthUnit = isImperial ? "in" : "cm";
  const weightUnit = isImperial ? "lbs" : "kg";

  const createMutation = useMutation({
    mutationFn: (data: CreatePackagePayload) => createPackage(data),
    onSuccess: () => {
      toast.success("Package created successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setOpen(false);
    },

    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to create package");
    },
  });
  const updateMutation = useMutation({
    mutationFn: (data: UpdatePackagePayload) => updatePackage(data),
    onSuccess: () => {
      toast.success("Package updated successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setOpen(false);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to update package");
    },
  });
  // errors
  // console.log("errors", methods.formState.errors)
  // values
  // console.log("values", methods.getValues())
  const onSubmit = () => {
    if (isEdit) {
      const data = { ...methods.getValues(), id };
      // // console.log(data)
      updateMutation.mutate(data as UpdatePackagePayload);
    } else {
      const data = methods.getValues();
      // // console.log(data)
      createMutation.mutate(data as CreatePackagePayload);
    }
  };
  // console.log("shipmentType", shipmentType)
  const ShipmentValueType = methods.watch("shipmentType") || shipmentType;

  const fields: any = useMemo(
    () => [
      {
        name: "shipmentType",
        type: "radio",
        label: "Packaging Type",
        defaultValue: shipmentType,
        options: [
          { value: "PALLET", label: "Pallet" },
          { value: "PACKAGE", label: "Package" },
          { value: "COURIER_PAK", label: "Courier Pak" },
        ],
        wrapperClassName: "col-span-4 sm:col-span-2",
        className: "mt-4",
        disabled: !isNew,
      },
      {
        name: "measurementUnit",
        type: "radio",
        label: "Unit of Measurement",
        defaultValue: measurementUnit,
        options: [
          { value: "METRIC", label: "Metric (cm & kg)" },
          { value: "IMPERIAL", label: "Imperial (in & lbs)" },
        ],
        wrapperClassName: "col-span-4",
        className: "mt-4",
      },
      {
        name: "name",
        type: "text",
        label: `${normalText(ShipmentValueType || "")} Name`,
        placeholder: "e.g. Generic",
        wrapperClassName: `${ShipmentValueType === "COURIER_PAK" ? "col-span-2" : "col-span-4"} capitalize`,
        className: `${ShipmentValueType === "COURIER_PAK" ? "w-full" : "w-1/2"}`,
      },
      {
        name: "length",
        type: "number",
        label: `Length (${lengthUnit})`,
        placeholder: "L",
        wrapperClassName: "col-span-4 sm:col-span-1",
        show: ShipmentValueType !== "COURIER_PAK",
      },
      {
        name: "width",
        type: "number",
        label: `Width (${lengthUnit})`,
        placeholder: "W",
        wrapperClassName: "col-span-4 sm:col-span-1",
        show: ShipmentValueType !== "COURIER_PAK",
      },
      {
        name: "height",
        type: "number",
        label: `Height (${lengthUnit})`,
        placeholder: "H",
        wrapperClassName: "col-span-4 sm:col-span-1",

        show: ShipmentValueType !== "COURIER_PAK",
        min: 0,
      },
      {
        name: "weight",
        type: "number",
        label: `Weight (${weightUnit})`,
        placeholder: "Weight",
        wrapperClassName: `${ShipmentValueType === "COURIER_PAK" ? "col-span-2" : "col-span-4 sm:col-span-1"}`,
      },
      {
        name: "freightClass",
        type: "select",
        label: "Freight Class",
        placeholder: "Select Class",
        options: [
          { value: "25", label: "25" },
          { value: "50", label: "50" },
          { value: "75", label: "75" },
          { value: "100", label: "100" },
          { value: "125", label: "125" },
          { value: "150", label: "150" },
          { value: "175", label: "175" },
          { value: "200", label: "200" },
          { value: "250", label: "250" },
          { value: "300", label: "300" },
          { value: "350", label: "350" },
          { value: "400", label: "400" },
          { value: "450", label: "450" },
          { value: "500", label: "500" },
          { value: "550", label: "550" },
          { value: "600", label: "600" },
          { value: "650", label: "650" },
          { value: "700", label: "700" },
          { value: "750", label: "750" },
          { value: "800", label: "800" },
          { value: "850", label: "850" },
          { value: "900", label: "900" },
          { value: "950", label: "950" },
          { value: "1000", label: "1000" },
        ],
        wrapperClassName: "col-span-4 sm:col-span-2",
        show: ShipmentValueType !== "COURIER_PAK",
      },
      {
        name: "nmfc",
        type: "text",
        label: "NMFC Code (optional)",
        placeholder: "#0000",
        wrapperClassName: "col-span-2",
        show: ShipmentValueType !== "COURIER_PAK",
      },
      {
        name: "palletUnitType",
        type: "select",
        label: "Type",
        placeholder: "Select Type",
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
        wrapperClassName: "col-span-2",
        show: ShipmentValueType !== "COURIER_PAK",
      },
      {
        name: "unitsOnPallet",
        type: "number",
        label: "# Units on pallet",
        placeholder: "2",
        wrapperClassName: "col-span-2",
        show: ShipmentValueType !== "COURIER_PAK",
      },
      {
        name: "description",
        type: "textarea",
        label: "Description (optional)",
        placeholder: "Describe the item(s) being shipped",
        wrapperClassName: "col-span-4",
      },
      {
        name: "specialHandlingRequired",
        type: "checkbox",
        label: "Special Handling Required",
        wrapperClassName: "col-span-2",
        className:"w-max",
        show: ShipmentValueType === "PACKAGE",
      },
    ],
    [ShipmentValueType, weightUnit, lengthUnit, isNew],
  );
  const watchLength = methods.watch("length");
  const watchWidth = methods.watch("width");
  const watchHeight = methods.watch("height");
  const watchWeight = methods.watch("weight");
  useEffect(() => {
    if (watchLength && watchWidth && watchHeight && watchWeight) {
      const res = calculateClass(
        watchLength,
        watchWidth,
        watchHeight,
        watchWeight,
        measurementUnit,
      );
      methods.setValue(`freightClass`, res?.classEstim as string);
    }
  }, [watchLength, watchWidth, watchHeight, watchWeight]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEdit && (
        <DialogTrigger asChild>
          {children ? (
            children
          ) : (
            <Button variant="outline">
              <PackagePlus /> Add New Package/Pallets
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-white">
            {/* <PackageIcon className="w-5 h-5 text-slate-700" /> */}
            {isEdit ? "Edit" : "Add"}{" "}
            {
              <span className="capitalize">
                {normalText(!isNew ? shipmentType : ShipmentValueType || "")}
              </span>
            }
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <GlobalForm
              formWrapperClassName="grid grid-cols-1 md:grid-cols-4 gap-6"
              fields={fields}
            />

            {/* {methods.formState.errors.freightClass?.message} */}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isEdit ? updateMutation.isPending : createMutation.isPending
                }
              >
                {/* Loader */}
                {isEdit
                  ? updateMutation.isPending
                  : createMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                {isEdit ? "Update" : "Save"}
                {
                  <span className="capitalize">
                    {normalText(
                      !isNew ? shipmentType : ShipmentValueType || "",
                    )}
                  </span>
                }
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
