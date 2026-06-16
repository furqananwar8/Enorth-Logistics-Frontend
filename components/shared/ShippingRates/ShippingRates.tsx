import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BadgeCheck,
  CheckCheck,
  ClipboardPen,
  Coins,
  TruckElectric,
} from "lucide-react";
import { ChevronUp } from "lucide-react";
import FormRadio from "@/components/common/form/fields/FormRadio";
import { useMutation } from "@tanstack/react-query";
import { getShipmentRates } from "@/api/services/shipment.api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShippingRatesTable } from "./ShippingRatesTable";
import { ShippingRatesStream } from "./ShippingRatesStream";
import { useSearchParams } from "next/navigation";
import { ShipmentOptions } from "../DynamicQuote/DynamicQuote.types";
// shipping rates table component
export default function ShippingRates({
  quoteId,
  dimensions,
  fromAddress,
  toAddress,
  openGetRates,
  setOpenGetRates,
  selectedCarrier,
  setSelectedCarrier,
  ref,
  getRatesLoading,
  setGetRatesLoading,
  shipmentType,
}: {
  quoteId?: string | number;
  dimensions: any;
  fromAddress: any;
  toAddress: any;
  openGetRates: string;
  setOpenGetRates: (value: string) => void;
  selectedCarrier: string | null;
  setSelectedCarrier: (value: string) => void;
  ref: any;
  getRatesLoading: boolean;
  setGetRatesLoading: (value: boolean) => void;
  shipmentType: ShipmentOptions[keyof ShipmentOptions];
}) {
  const dimensionsPayload = () => {
    if (dimensions?.lineItem?.units?.length === 0) {
      return [];
    }
    return dimensions?.lineItem?.units?.map((unit: any) => {
      console.log("UNIT:", unit);
      return {
        weightUnit:
          dimensions.lineItem.measurementUnit === "IMPERIAL" ? "LB" : "KG",
        weight: unit.weight,
        dimensionsUnit:
          dimensions.lineItem.measurementUnit === "IMPERIAL" ? "IN" : "CM",
        ...(unit.length > 0 ? { length: unit.length } : {}),
        ...(unit.width > 0 ? { width: unit.width } : {}),
        ...(unit.height > 0 ? { height: unit.height } : {}),
        handlingUnits:
          shipmentType === "STANDARD_FTL"
            ? unit.count
            : (unit.unitsOnPallet ?? 1),
        //   packaging: unit.palletUnitType,
        packaging: "BOX",
      };
    });
  };
  console.log("FROM ADDRESS", fromAddress);
  console.log("TO ADDRESS", toAddress);

  const payload = {
    quoteType: "STANDARD",
    fedex: {
      from: {
        postalCode: fromAddress?.address?.postalCode,
        countryCode: fromAddress?.address?.country,
        isResidential: fromAddress?.isResidential,
      },
      to: {
        postalCode: toAddress?.address?.postalCode,
        countryCode: toAddress?.address?.country,
        isResidential: toAddress?.isResidential,
      },
    },
    tst: {
      from: {
        name: fromAddress?.contactName,
        address: fromAddress?.address?.address1,
        city: fromAddress?.address?.city,
        state: fromAddress?.address?.state,
        postalCode: fromAddress?.address?.postalCode,
        ...(toAddress?.isResidential
          ? { isResidential: toAddress?.isResidential }
          : {}),
      },
      to: {
        name: toAddress?.contactName,
        address: toAddress?.address?.address1,
        city: toAddress?.address?.city,
        state: toAddress?.address?.state,
        postalCode: toAddress?.address?.postalCode,
        ...(toAddress?.isResidential
          ? { isResidential: toAddress?.isResidential }
          : {}),
      },
    },
    tforce: {
      from: {
        city: fromAddress?.address?.city,
        state: fromAddress?.address?.state,
        postalCode: fromAddress?.address?.postalCode,
        countryCode: fromAddress?.address?.country,
        // isResidential: toAddress?.isResidential,
      },
      to: {
        city: toAddress?.address?.city,
        state: toAddress?.address?.state,
        postalCode: toAddress?.address?.postalCode,
        countryCode: toAddress?.address?.country,
        // isResidential: toAddress?.isResidential,
      },
    },
    xpo: {
      from: {
        city: fromAddress?.address?.city,
        postalCode: fromAddress?.address?.postalCode,
        countryCode: fromAddress?.address?.country,
        state: toAddress?.address?.state,
        ...(toAddress?.isResidential
          ? { isResidential: toAddress?.isResidential }
          : {}),
      },
      to: {
        city: toAddress?.address?.city,
        postalCode: toAddress?.address?.postalCode,
        countryCode: toAddress?.address?.country,
        state: toAddress?.address?.state,
        ...(toAddress?.isResidential
          ? { isResidential: toAddress?.isResidential }
          : {}),
      },
    },
    minimax: {
      from: {
        city: fromAddress?.address?.city,
        postalCode: fromAddress?.address?.postalCode,
        countryCode: fromAddress?.address?.country,
        state: toAddress?.address?.state,
        ...(toAddress?.isResidential
          ? { isResidential: toAddress?.isResidential }
          : {}),
      },
      to: {
        city: toAddress?.address?.city,
        postalCode: toAddress?.address?.postalCode,
        countryCode: toAddress?.address?.country,
        state: toAddress?.address?.state,
        ...(toAddress?.isResidential
          ? { isResidential: toAddress?.isResidential }
          : {}),
      },
    },
    pickupType: "DROPOFF_AT_FEDEX_LOCATION",
    rateRequestType: ["LIST"],
    serviceType: "FEDEX_EXPRESS_SAVER",
    services: {
      limitedAccess: {},
      tradeShowDelivery: true,
      protectFromFreeze: true,
    },

    packages: dimensionsPayload(),
    shipmentType: shipmentType === "COURIER_PAK" ? "COURIER" : shipmentType,
    stackable: false,
    // shipmentType: "",
  };

  return (
    <Accordion
      value={openGetRates}
      onValueChange={(val) => setOpenGetRates(val)}
      type="single"
      collapsible
      className="px-6 shadow-lg border border-border rounded-md bg-white dark:bg-card"
    >
      <AccordionItem value="shippingRates" className="border-none">
        <AccordionTrigger className="group  hover:no-underline items-center cursor-pointer [&>svg]:hidden!">
          <h2 className="font-semibold flex items-center gap-2 text-lg text-slate-800 dark:text-white">
            <Coins />
            Shipping Rates
            <ChevronUp className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </h2>
        </AccordionTrigger>
        <AccordionContent content="rates" className="h-max">
          {/* // 2 tabs Best Price and Quickest */}
          {/* <div className="flex items-center gap-2 w-full mb-4">
                        <div className="border border-primary bg-primary/10 rounded-md p-2 w-1/2">
                    
                            <div className="flex gap-2 items-center mb-2">
                                <BadgeCheck className="text-primary" />
                                Best Price:
                            </div>
                            <span className="text-primary font-bold">Cheapest Carrier Name</span>
                        </div>
                        <div className="border border-yellow-500 bg-yellow-500/10 rounded-md p-2 w-1/2">
                    
                            <div className="flex gap-2 items-center mb-2">
                                <TruckElectric className="text-yellow-500" />
                                Quickest:
                            </div>
                            <span className="text-yellow-500 font-bold">Fastest Carrier Name</span>
                        </div>
                    </div> */}
          <ShippingRatesStream
            getRatesLoading={getRatesLoading}
            setGetRatesLoading={setGetRatesLoading}
            ref={ref}
            payload={payload}
            selectedCarrier={selectedCarrier}
            setSelectedCarrier={setSelectedCarrier}
          />
          {/* <ShippingRatesTable selectedCarrier={selectedCarrier} setSelectedCarrier={setSelectedCarrier} dimensions={dimensions} fromAddress={fromAddress} toAddress={toAddress} /> */}
          {/* get rates button */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
