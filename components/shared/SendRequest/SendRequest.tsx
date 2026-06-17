"use client";

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  Clipboard,
  User,
  MapPin,
  Truck,
  Package,
  Info,
  Check,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { GlobalForm } from "@/components/common/form/GlobalForm";

interface AddressData {
  address?: {
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  companyName?: string;
  contactName?: string;
  phoneNumber?: string;
  email?: string;
  locationTypeId?: number | string;
  additionalNotes?: string;
  isResidential?: boolean;
}

interface SendRequestProps {
  contactInfo?: {
    spotContact?: {
      contactName: string;
      phoneNumber: string;
      email: string;
      shipDate: any;
      spotQuoteName?: string;
    };
  };
  equipmentDetails?: {
    spotEquipment?: string;
  };
  fromAddress?: AddressData;
  toAddress?: AddressData;
  dimensions?: any;
  services?: any;
  onPrevious?: () => void;
  onSubmit: () => void;
  setSpotDetailsValidConfirmation: (value: boolean) => void;
  viewOnly?: boolean;
}

const SendRequest = forwardRef(
  (
    {
      contactInfo,
      equipmentDetails,
      fromAddress,
      toAddress,
      dimensions,
      services,
      onPrevious,
      onSubmit,
      setSpotDetailsValidConfirmation,
      viewOnly,
    }: SendRequestProps,
    ref,
  ) => {
    const methods = useForm({
      defaultValues: {
        preferredBudget: {
          amount: "",
          currency: "CAD",
        },
        confirmation: false,
      },
    });

    useImperativeHandle(ref, () => ({
      getValues: methods.getValues,
      trigger: methods.trigger,
    }));

    const formatAddress = (addr?: AddressData) => {
      if (!addr || !addr.address) return "-";
      const { address1, city, state, postalCode, country } = addr.address;
      return `${address1}, ${city}, ${state}, ${postalCode}, ${country}`;
    };

    // Helper to extract total values from dimensions
    const totalWeight =
      dimensions?.lineItem?.units?.reduce(
        (acc: number, unit: any) => acc + (Number(unit.weight) || 0),
        0,
      ) || 0;
    const totalPallets = dimensions?.lineItem?.units?.length || 0;
    const totalUnits =
      dimensions?.lineItem?.units?.reduce(
        (acc: number, unit: any) => acc + (Number(unit.unitsOnPallet) || 0),
        0,
      ) || 0;
    const totalCubicFeet =
      dimensions?.lineItem?.units?.reduce((acc: number, unit: any) => {
        const length = Number(unit.length) || 0;
        const width = Number(unit.width) || 0;
        const height = Number(unit.height) || 0;
        const cubicFeet = (length * width * height) / 1728;

        return Math.round(acc + cubicFeet);
      }, 0) || 0;

    const confirmation = methods.watch("confirmation");
    useEffect(() => {
      console.log("CONFIRMATION", confirmation);
      setSpotDetailsValidConfirmation(confirmation);
    }, [confirmation]);
    return (
      <FormProvider {...methods}>
        <form className="bg-white dark:bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50">
            <Clipboard className="text-slate-700" size={20} />
            <h1 className="text-xl font-bold">Send Request</h1>
          </div>

          <div className="p-6 space-y-8">
            {/* Contact Information Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary border-b pb-2">
                <Clipboard className="size-5" />
                <h2 className="font-semibold text-lg">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Name:</p>
                  <p className="font-medium">
                    {contactInfo?.spotContact?.contactName || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number:</p>
                  <p className="font-medium">
                    {contactInfo?.spotContact?.phoneNumber || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Email Address:
                  </p>
                  <p className="font-medium">
                    {contactInfo?.spotContact?.email || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Equipment Details:
                  </p>
                  <p className="font-medium capitalize">
                    {typeof equipmentDetails?.spotEquipment === "string"
                      ? equipmentDetails.spotEquipment
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ship Date:</p>
                  <p className="font-medium">
                    {contactInfo?.spotContact?.shipDate instanceof Date
                      ? contactInfo.spotContact.shipDate.toLocaleDateString()
                      : contactInfo?.spotContact?.shipDate || "-"}
                  </p>
                </div>
              </div>
            </section>

            {/* Shipment Details Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary border-b pb-2">
                <Send className="size-5 rotate-[-45deg]" />
                <h2 className="font-semibold text-lg">Shipment Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pickup Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <MapPin size={18} className="text-primary" />
                    <h3>Pickup Location</h3>
                  </div>
                  <div className="pl-7 space-y-2">
                    <p className="text-sm leading-relaxed">
                      {formatAddress(fromAddress)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <Check size={16} />
                      <span>Business - Tailgate Not Required</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground">
                        Additional Notes:
                      </p>
                      <p className="text-sm">
                        {fromAddress?.additionalNotes || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <MapPin size={18} className="text-primary" />
                    <h3>Delivery Location</h3>
                  </div>
                  <div className="pl-7 space-y-2">
                    <p className="text-sm leading-relaxed">
                      {formatAddress(toAddress)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <Check size={16} />
                      <span>Business - Tailgate Not Required</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground">
                        Additional Notes:
                      </p>
                      <p className="text-sm">
                        {toAddress?.additionalNotes || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Shipment Weight:
                  </p>
                  <p className="font-semibold">{totalWeight} lbs</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total # of Pallets:
                  </p>
                  <p className="font-semibold">{totalPallets}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total # of units on pallets:
                  </p>
                  <p className="font-semibold">{totalUnits}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Cubic Feet:
                  </p>
                  <p className="font-semibold">{totalCubicFeet} ft³</p>
                </div>
              </div>
            </section>

            {/* Additional Services Section */}

            {/* Preferred Budget Section */}
            <section className="space-y-4 border-t pt-6">
              <h2 className="font-semibold text-lg">
                What is your preferred budget?
              </h2>
              <div className="space-y-3">
                <GlobalForm
                  formWrapperClassName="flex flex-col gap-4"
                  fields={[
                    {
                      name: "preferredBudget.amount",
                      label: "Estimated Amount (optional)",
                      type: "input",
                      placeholder: "$ 0",
                      className: "max-w-[200px]",
                      disabled: viewOnly,
                    },
                    {
                      name: "preferredBudget.currency",
                      label: "Currency",
                      type: "radio",
                      options: [
                        { value: "CAD", label: "CAD" },
                        { value: "USD", label: "USD" },
                      ],
                      wrapperClassName: "flex flex-col gap-4",
                      disabled: viewOnly,

                    },
                    {
                      name: "confirmation",
                      type: "checkbox",
                      label:
                        "I am confirming that all the above information is correct. I understand and accept that any rates received are based on the information that has been provided.",
                      labelClassName: "leading-normal",
                      wrapperClassName: "flex items-start",
                      disabled: viewOnly,

                    },
                  ]}
                />
              </div>
            </section>

            {/* Confirmation Section */}
          </div>

          {/* Footer Buttons */}
          {/* <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t flex justify-end items-center">
                    <Button onClick={onSubmit} className="bg-primary hover:bg-[#005a9c] text-white px-8">
                        Request Quote
                    </Button>
                </div> */}
        </form>
      </FormProvider>
    );
  },
);

export default SendRequest;
