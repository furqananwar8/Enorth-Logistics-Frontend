import { useQuery } from "@tanstack/react-query";

export function useDynamicQuote(
  fromAddressRef: React.RefObject<any>,
  toAddressRef: React.RefObject<any>,
  fromAddressLocked: boolean,
  setFromAddressLocked: (value: boolean) => void,
  toAddressLocked: boolean,
  setToAddressLocked: (value: boolean) => void,
) {
  const handleSwapAddress = () => {
    if (!fromAddressRef.current || !toAddressRef.current) return;

    const fromVals = fromAddressRef.current.getValues();
    const toVals = toAddressRef.current.getValues();

    const fromState = fromVals.address?.state;
    const toState = toVals.address?.state;

    // 1. Swap with state cleared first
    fromAddressRef.current.setValues({
      ...toVals,
      type: "FROM",
      address: {
        ...toVals.address,
        state: "",
      },
    });

    toAddressRef.current.setValues({
      ...fromVals,
      type: "TO",
      address: {
        ...fromVals.address,
        state: "",
      },
    });

    // 2. Reapply state after country-based filtering updates
    setTimeout(() => {
      const updatedFrom = fromAddressRef.current?.getValues();

      const updatedTo = toAddressRef.current?.getValues();

      fromAddressRef.current?.setValues({
        ...updatedFrom,
        address: {
          ...updatedFrom.address,
          state: toState || "",
        },
      });

      toAddressRef.current?.setValues({
        ...updatedTo,
        address: {
          ...updatedTo.address,
          state: fromState || "",
        },
      });
    }, 0);

    const temp = fromAddressLocked;
    setFromAddressLocked(toAddressLocked);
    setToAddressLocked(temp);
  };
  // const handleSwapAddress = () => {
  //   if (fromAddressRef.current && toAddressRef.current) {
  //     const fromVals = fromAddressRef.current.getValues();
  //     const toVals = toAddressRef.current.getValues();
  //     fromAddressRef.current.setValues({ ...toVals, type: "FROM" });
  //     toAddressRef.current.setValues({ ...fromVals, type: "TO" });
  //   }

  //   // CONTINUE FROM HERE

  //   // const validateAllForms = async () => {
  //   //   const fromValid = await fromAddressRef.current?.trigger();
  //   //   const toValid = await toAddressRef.current?.trigger();
  //   //   const dimValid = await dimensionsRef.current?.trigger();

  //   //   let valid = fromValid && toValid && dimValid;

  //   //   // print all valid with false value
  //   //   // console.log("FROM VALID:", fromValid);
  //   //   // console.log("TO VALID:", toValid);
  //   //   // console.log("DIM VALID:", dimValid);

  //   //   if (quoteType === "SPOT") {
  //   //     const contactValid = await contactRef.current?.trigger();
  //   //     const equipmentValid = await equipmentRef.current?.trigger();
  //   //     valid = valid && contactValid && equipmentValid;
  //   //   }

  //   //   if (!valid) {
  //   //     toast.error("Please fill in all required fields correctly.");
  //   //     return false;
  //   //   }

  //   //   return valid;
  //   // };

  //   // const onSubmit = async () => {
  //   //   const valid = await validateAllForms();

  //   //   if (!valid) return;

  //   //   const { finalQuotePayload, shipmentPayload } = buildPayloads();

  //   //   if (isEditing) {
  //   //     if (isShipment) {
  //   //       // console.log("UPDATING SHIPMENT WITH PAYLOAD:", shipmentPayload);
  //   //       updateShipmentMutation.mutate(shipmentPayload);
  //   //     } else {
  //   //       updateQuoteMutation.mutate(finalQuotePayload);
  //   //     }
  //   //   } else {
  //   //     if (isShipment) {
  //   //       createShipmentMutation.mutate(shipmentPayload);
  //   //       // // console.log(shipmentPayload)
  //   //     } else {
  //   //       createQuoteMutation.mutate(finalQuotePayload);
  //   //       // // console.log("FINAL QUOTE PAYLOAD:", finalQuotePayload)
  //   //     }
  //   //   }
  //   // };

  //   // const handleGetRates = async () => {
  //   //   const valid = await validateAllForms();

  //   //   if (!valid) return;

  //   //   if (servicesRef.current) await servicesRef.current.trigger();
  //   //   if (insuranceRef.current) await insuranceRef.current.trigger();
  //   //   if (signatureRef.current) await signatureRef.current.trigger();
  //   //   if (sendRequestRef.current) await sendRequestRef.current.trigger();

  //   //   getRatesRef.current?.handleStart();
  //   //   setGetRatesLoading(true);
  //   // };
  //   // const handleBookShipment = async () => {
  //   //   // if (!singleQuote?.quote?.id) {
  //   //   //     toast.error("Quote not found")
  //   //   //     return
  //   //   // }
  //   //   const valid = await validateAllForms();

  //   //   if (!valid) return;

  //   //   if (!selectedCarrier) {
  //   //     toast.error("Please select a carrier");
  //   //     return;
  //   //   }

  //   //   // create shipment first if not created already
  //   //   // if (!singleQuote?.quote?.shipment?.id) {
  //   //   //     bookShipmentMutation.mutate(bookShipmentPayload)
  //   //   // }
  //   //   // else {
  //   //   // }
  //   //   const { finalQuotePayload } = buildPayloads();
  //   //   const newShipmentPayload = {
  //   //     mode: "SHIPMENT",
  //   //     shipmentType: singleQuote?.quote?.shipmentType,
  //   //     shipDate: fromAddress?.shipDate,
  //   //     ...(singleQuote?.quote?.id
  //   //       ? {
  //   //           quote: {
  //   //             shipmentType: singleQuote?.quote?.shipmentType,
  //   //             id: singleQuote?.quote?.id,
  //   //             quoteType: singleQuote?.quote?.quoteType,
  //   //           },
  //   //         }
  //   //       : {
  //   //           quote: { ...finalQuotePayload },
  //   //           shipmentType: shipmentType,
  //   //           quoteType: quoteType,
  //   //         }),
  //   //   };
  //   //   const res = await createShipmentMutation.mutateAsync(newShipmentPayload);
  //   //   setNewlyCreatedQuoteId(res?.quote?.id);
  //   //   // console.log("CREATE SHIPMENT RESPONSE:", res);
  //   //   const bookShipmentPayload = {
  //   //     ...(singleQuote?.quote?.id
  //   //       ? {
  //   //           quoteId: singleQuote?.quote?.id,
  //   //           shipDate: singleQuote?.quote?.shipment?.shipDate,
  //   //         }
  //   //       : {
  //   //           quoteId: res?.quote?.id,
  //   //           shipDate: res?.quote?.shipment?.shipDate,
  //   //         }),
  //   //     carrier: selectedCarrier.carrier,
  //   //     selectedRate: {
  //   //       serviceType: selectedCarrier.serviceType,
  //   //       serviceName: selectedCarrier.serviceName,
  //   //       totalCharge: selectedCarrier.totalPrice,
  //   //       currency: selectedCarrier.currency,
  //   //       ...(selectedCarrier.carrier === "TST" && {
  //   //         packagingType: selectedCarrier.packagingType || "BOX",
  //   //         //   transitDays: selectedCarrier.estimatedDeliveryDays,
  //   //         transitDays: 3,
  //   //       }),
  //   //     },
  //   //   };
  //   //   // console.log("BOOK SHIPMENT PAYLOAD:", bookShipmentPayload);

  //   //   if (res) {
  //   //     bookShipmentMutation.mutate(bookShipmentPayload);
  //   //   }
  //   // };

  //   // const handleConvertToShipment = async () => {
  //   //   const valid = await validateAllForms();

  //   //   if (!valid) return;

  //   //   const { finalQuotePayload } = buildPayloads();

  //   //   // // console.log("FINAL QUOTE PAYLOAD:", finalQuotePayload)
  //   //   createQuoteAndConvertToShipmentMutation.mutate(finalQuotePayload);
  //   // };
  // };
  return { handleSwapAddress };
}
