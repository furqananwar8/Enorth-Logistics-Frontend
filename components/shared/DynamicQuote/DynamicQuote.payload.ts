import { formatTime12h } from "@/app/(user)/settings/(address-book)/mappers/contact.mapper";
import { ShipmentOptions } from "./DynamicQuote.types";
const spotShipmentType: any = {
  SPOT_LTL: "LTL_PARTIAL",
  SPOT_FTL: "FULL_TRUCK_LOAD",
  TIME_CRITICAL: "TIME_CRITICAL",
};
export function useDynamicQuotePayloads({
  fromAddressRef,
  toAddressRef,
  dimensionsRef,
  servicesRef,
  insuranceRef,
  signatureRef,
  equipmentRef,
  contactRef,
  sendRequestRef,
  shipmentType,
  quoteType,
  isConversion,
  isEditing,
  quoteStatus,
  singleQuote,
}: {
  fromAddressRef: React.RefObject<any>;
  toAddressRef: React.RefObject<any>;
  dimensionsRef: React.RefObject<any>;
  servicesRef: React.RefObject<any>;
  insuranceRef: React.RefObject<any>;
  signatureRef: React.RefObject<any>;
  equipmentRef: React.RefObject<any>;
  contactRef: React.RefObject<any>;
  sendRequestRef: React.RefObject<any>;
  shipmentType: ShipmentOptions[keyof ShipmentOptions];
  quoteType: keyof ShipmentOptions;
  isConversion: boolean;
  isEditing: boolean;
  quoteStatus: "DRAFT" | "SAVED";
  singleQuote: any;
}) {
  const getMergedPayload = () => {
    const fromAddress = fromAddressRef.current?.getValues() || {};
    const toAddress = toAddressRef.current?.getValues() || {};
    const dimensions = dimensionsRef.current?.getValues() || {};
    // these are optional only include if they have some values
    const services = servicesRef.current?.getValues() || {};
    const insurance = insuranceRef.current?.getValues() || {};
    const signature = signatureRef.current?.getValues() || {};
    const equipment = equipmentRef.current?.getValues() || {};
    const spotContact = contactRef.current?.getValues() || {};
    let completePayload = {
      addresses: [fromAddress, toAddress],
      ...dimensions,
    };

    const addresses = [];
    if (Object.keys(fromAddress).length > 0) addresses.push(fromAddress);
    if (Object.keys(toAddress).length > 0) addresses.push(toAddress);

    if (insurance?.insurance?.amount > 0) {
      completePayload = { ...completePayload, ...insurance };
    }
    if (Object.keys(services).length > 0) {
      completePayload = { ...services, ...completePayload };
    }
    // equipment
    if (Object.keys(equipment).length > 0) {
      completePayload = {
        ...completePayload,
        services: { ...equipment.services },
        spotDetails: {
          spotType:
            spotShipmentType[
              shipmentType as ShipmentOptions[keyof ShipmentOptions]
            ],
        },
      };
      console.log("completePayload", completePayload);
    }
    if (Object.keys(signature).length > 0) {
      completePayload = { ...completePayload, ...signature };
    }
    // spotContact
    if (Object.keys(spotContact).length > 0) {
      completePayload = {
        ...completePayload,
        spotDetails: { ...completePayload.spotDetails, ...spotContact,
          spotEquipment: {
            // ...(equipment?.spotEquipment ?? {}),
            refrigerated: {
              type: "FRESH",
            },
          },
         },
      };
    }

    const sendRequestData = sendRequestRef.current?.getValues() || {};
    if (Object.keys(sendRequestData).length > 0) {
      completePayload = { ...completePayload, ...sendRequestData };
    }
    if (quoteType === "SPOT") {
      completePayload = {
        ...completePayload,
        spotDetails: {
          ...equipment,
          ...spotContact,
          // hard coded remove later
          spotEquipment: {
            ...(equipment?.spotEquipment ?? {}),
            // refrigerated: {
            //   type: "FRESH",
            // },
          },
          spotType:
            spotShipmentType[
              shipmentType as ShipmentOptions[keyof ShipmentOptions]
            ],
        },
      };
    }
    const { limitedAccess, ...updatedPayload } = completePayload;
    return updatedPayload;
  };
  const buildPayloads = () => {
    const mergedData = getMergedPayload();
    return payloadTransformer(mergedData);
  };
  const payloadTransformer = (data: any) => {
    // console.log("THIS IS ADDRESS!!!!", data);
    const formattedAddresses = data.addresses?.map(
      (address: any, index: number) => {
        if (address.addressBookId && !isConversion) {
          return {
            addressBookId: address.addressBookId,
            type: address.type,
          };
        }

        const palletShippingReadyTime = formatTime12h(
          address.readyTimeHour,
          address.readyTimeMinute,
          address.readyTimeAmPm,
        );

        const palletShippingCloseTime = formatTime12h(
          address.closeTimeHour,
          address.closeTimeMinute,
          address.closeTimeAmPm,
        );

        return {
          palletShippingReadyTime,
          palletShippingCloseTime,
          contactName: address.contactName,
          phoneNumber: address.phoneNumber,
          email: address.email,
          locationType: address.address.locationTypeId,
          companyName: address.companyName,
          signatureId: address.signatureId,
          defaultInstruction: address.defaultInstruction,
          type: index === 0 ? "FROM" : "TO",
          ...address.address,
        };
      },
    );

    // -----------------------------
    // BASE PAYLOAD
    // -----------------------------
    const basePayload = {
      ...data,
      addresses: formattedAddresses,
      quoteType,
      shipmentType,

      ...(!isEditing &&
        quoteStatus !== singleQuote?.quote.status && {
          status: quoteStatus,
        }),

      ...(shipmentType === "STANDARD_FTL" && {
        ...(data.includeStraps && {
          includeStraps: data.includeStraps,
        }),

        ...(data.appointmentDelivery && {
          appointmentDelivery: data.appointmentDelivery,
        }),
      }),
    };

    // -----------------------------
    // ADDRESS TRANSFORMATION
    // -----------------------------
    const transformedAddresses = basePayload.addresses.map((addr: any) => {
      if (addr.addressBookId) {
        return {
          type: addr.type,
          addressBookId: addr.addressBookId,
        };
      }

      return addr;
    });

    const payloadTransformed = {
      ...basePayload,
      addresses: transformedAddresses,
    };

    // -----------------------------
    // FTL TRANSFORMATION
    // -----------------------------
    let finalQuotePayload = payloadTransformed;

    if (shipmentType === "STANDARD_FTL") {
      const firstUnit = payloadTransformed?.lineItem?.units?.[0];

      const selectedService = firstUnit?.name;

      const ftlPayload = {
        ...payloadTransformed,
        services: {
          [selectedService]: {
            totalWeight: firstUnit?.weight,
            measurementUnit: payloadTransformed?.lineItem?.measurementUnit,
            totalCount: firstUnit?.count,
          },
        },
      };

      // remove lineItem from FTL payload
      let { lineItem, ...rest } = ftlPayload;

      finalQuotePayload = rest;
    }

    // -----------------------------
    // SHIPMENT PAYLOAD
    // -----------------------------
    const shipmentPayload = {
      shipDate: data.addresses[0].shipDate,
      mode: "SHIPMENT",
      shipmentType,
      quote: { ...finalQuotePayload, status: singleQuote?.quote?.status },
    };

    return {
      finalQuotePayload,
      shipmentPayload,
    };
  };
  return { buildPayloads, payloadTransformer, getMergedPayload };
}
