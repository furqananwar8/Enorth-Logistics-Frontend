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
  // console.log("fromAddress", fromAddress);
  // console.log("toAddress", toAddress);
  // console.log("dimensions", dimensions);
  // const fedexPayload = {
  //     "from": {
  //         "postalCode": fromAddress.address.postalCode,
  //         "countryCode": fromAddress.address.country
  //     },
  //     "to": {
  //         "postalCode": toAddress.address.postalCode,
  //         "countryCode": toAddress.address.country
  //     }
  // }
  // const tstPayload = {
  //     "from": {
  //         "name": fromAddress.contactName,
  //         "address": fromAddress.address.address1,
  //         "postalCode": fromAddress.address.postalCode,
  //         "city": fromAddress.address.city,
  //         "state": fromAddress.address.state
  //     },
  //     "to": {
  //         "name": toAddress.contactName,
  //         "address": toAddress.address.address1,
  //         "postalCode": toAddress.address.postalCode,
  //         "city": toAddress.address.city,
  //         "state": toAddress.address.state
  //     }
  // }
  // console.log("QUOTE ID:", quoteId);
  const dimensionsPayload = () => {
    if (dimensions?.lineItem?.units?.length === 0) {
      return [];
    }
    return dimensions?.lineItem?.units?.map((unit: any) => {
      console.log("UNIT:", unit)
      return {
        weightUnit:
          dimensions.lineItem.measurementUnit === "IMPERIAL" ? "LB" : "KG",
        weight: unit.weight,
        dimensionsUnit:
          dimensions.lineItem.measurementUnit === "IMPERIAL" ? "IN" : "CM",
        ...(unit.length > 0 ? { length: unit.length } : {}),
        ...(unit.width > 0 ? { width: unit.width } : {}),
        ...(unit.height > 0 ? { height: unit.height } : {}),
        handlingUnits: shipmentType === "STANDARD_FTL" ? unit.count : (unit.unitsOnPallet ?? 1),
        //   packaging: unit.palletUnitType,
        packaging: "BOX",
      };
    });
  };
  // const payload =
  // {
  //     "quoteType": "STANDARD",
  //     "fedex": fedexPayload,
  //     "tst": tstPayload,
  //     "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
  //     "rateRequestType": ["LIST"],
  //     "serviceType": "FEDEX_EXPRESS_SAVER",
  //     // "packages": [{
  //     //     "weightUnit": "LB",
  //     //     "weight": 10,
  //     //     "dimensionsUnit": "IN",
  //     //     "length": 20,
  //     //     "width": 20,
  //     //     "height": 40,
  //     //     "handlingUnits": 1,
  //     //     "packaging": "BOX"
  //     // }]
  //     "packages": dimensionsPayload()
  // }
  // get id from search params
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // console.log("FROM ADDRESS", fromAddress);
  // console.log("TO ADDRESS", toAddress);
  // console.log("DIMENSIONS", dimensions);
  const payload = {
    quoteType: "STANDARD",
    fedex: {
      // "from": {
      //     "postalCode": "38117",
      //     "countryCode": "US",
      //     "isResidential": true
      // },
      // "to": {
      //     "postalCode": "M5V3A8",
      //     "countryCode": "CA",
      //     "isResidential": true
      // }
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
      //   from: {
      //     name: "ENorth Logistics",
      //     address: "123 Main St",
      //     postalCode: "M5V3A8",
      //     city: "Toronto",
      //     state: "ON",
      //   },
      //   to: {
      //     name: "ENorth Logistics",
      //     address: "456 Hollywood Blvd",
      //     postalCode: "48226",
      //     city: "Detroit",
      //     state: "MI",
      //   },

      from: {
        name: fromAddress?.contactName,
        address: fromAddress?.address?.address1,
        city: fromAddress?.address?.city,
        state: fromAddress?.address?.state,
        postalCode: fromAddress?.address?.postalCode,
      },
      to: {
        name: toAddress?.contactName,
        address: toAddress?.address?.address1,
        city: toAddress?.address?.city,
        state: toAddress?.address?.state,
        postalCode: toAddress?.address?.postalCode,
      },

      // "quoteId": id || 1,
      // "carrier": "TST",
      // "shipDate": "2026-07-24",
      // "selectedRate": {
      //     "serviceType": "ST",
      //     "serviceName": "Standard LTL",
      //     "packagingType": "SKD",
      //     "totalCharge": 245.50,
      //     "currency": "CAD",
      //     "transitDays": 2
      // }
    },
    tforce: {
      //   quoteId: quoteId,
      //   carrier: "TFORCE",
      //   shipDate: "2026-07-24",
      //   selectedRate: {
      //     serviceType: "308", // 308=LTL US/CA | 309=Guaranteed | 349=US/MX
      //     serviceName: "TForce Freight LTL",
      //     totalCharge: 245.5,
      //     currency: "USD",
      //   },

      from: {
        city: fromAddress?.address?.city,
        state: fromAddress?.address?.state,
        postalCode: fromAddress?.address?.postalCode,
        countryCode: fromAddress?.address?.country,
        isResidential: toAddress?.isResidential,
      },
      to: {
        city: toAddress?.address?.city,
        state: toAddress?.address?.state,
        postalCode: toAddress?.address?.postalCode,
        countryCode: toAddress?.address?.country,
        isResidential: toAddress?.isResidential,
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
    // packages: [
    //   {
    //     weightUnit: "LB",
    //     weight: 10,
    //     dimensionsUnit: "IN",
    //     length: 20,
    //     width: 20,
    //     height: 40,
    //     handlingUnits: 2,
    //     packaging: "BOX",
    //   },
    // ],
    packages: dimensionsPayload(),
    shipmentType: shipmentType === "COURIER_PAK" ? "COURIER" : shipmentType,
    stackable: false,
    // shipmentType: "",
  };
  // const mutation = useMutation({
  //     mutationFn: (payload: any) => getShipmentRates(payload),
  //     // onSuccess: () => {

  //     // },
  //     onError: (error: AxiosError<ApiError>) => {
  //         toast.error(error.response?.data.message)
  //     }
  // })
  // async function streamRates(dto: any) {
  //     const response = await fetch('/shipment-carrier/rates/stream', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(dto),
  //     });

  //     const reader = response?.body?.getReader() as any;
  //     const decoder = new TextDecoder();

  //     while (true) {
  //         const { done, value } = await reader?.read();
  //         if (done) break;

  //         const chunk = decoder.decode(value);
  //         const lines = chunk.split('\n').filter(l => l.startsWith('data:'));

  //         for (const line of lines) {
  //             const result = JSON.parse(line.replace('data: ', ''));

  //             if (result.error) {
  //                 console.error(`${result.carrier} failed:`, result.error);
  //                 continue;
  //             }

  //             // Render as each arrives
  //             //             if (result.carrier === 'fedex') {
  //             //                 renderFedExQuote(result.quotes);
  //             //             } else if (result.carrier === 'tst') {
  //             //                 renderTSTQuote(result.quotes);
  //             //             }
  //             // print result
  //             // console.log("result", result.quotes)
  //         }
  //     }
  // }
  // useEffect(() => {
  //     if (openGetRates === "shippingRates") {
  //         mutation.mutate(payload)
  //         streamRates(payload)
  //     }
  // }, [openGetRates])
  // const renderFedExQuote = (quotes: any[]) => {
  //     // render fedex quotes here
  //     {

  // const renderTSTQuote = (quotes: any[]) => {
  //     // render tst quotes here
  // }
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
