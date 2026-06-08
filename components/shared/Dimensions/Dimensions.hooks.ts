// Isolates ALL form wiring and data-fetching logic.
// Dimensions.tsx becomes a pure layout component.
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getSingleQuote } from "@/api/services/quotes.api";
// import { shipmentSchema, ShipmentFormValues } from "./Dimensions.schema"

import {
  courierLineItemSchema,
  ftlLineItemSchema,
  packageLineItemSchema,
  palletLineItemSchema,
  spotFtlLineItemSchema,
  spotLtlLineItemSchema,
} from "./Dimensions.schema";
import { ShipmentOptions } from "../DynamicQuote/DynamicQuote.types";

export function useDimensions(
  shipmentType: ShipmentOptions[keyof ShipmentOptions],
) {
  const [isOpen, setIsOpen] = useState(true);
  const dynamicSchema = (shipmentType: string) => {
    switch (shipmentType) {
      case "PALLET":
        return palletLineItemSchema;
      case "PACKAGE":
        return packageLineItemSchema;
      case "COURIER_PAK":
        return courierLineItemSchema;
      case "STANDARD_FTL":
        return ftlLineItemSchema;
      case "SPOT_LTL":
        return spotLtlLineItemSchema;
      case "SPOT_FTL":
        return spotFtlLineItemSchema;
      case "TIME_CRITICAL":
        return spotFtlLineItemSchema;
    }
  };

  const schema = useMemo(() => {
    return dynamicSchema(shipmentType);
  }, [shipmentType]);
  const resolver = useMemo(() => zodResolver(schema as any), [schema]);
  const methods = useForm<any>({
    resolver,
    // mode: "onChange",
    defaultValues: {
      shipmentType: shipmentType,
      lineItem: {
        type: shipmentType,
        description: "",
        measurementUnit: "IMPERIAL",
        stackable: false,
        units: [
          {
            palletUnitType: "PALLET",
            description: "",
            // @ts-ignore
            ...(shipmentType === "PACKAGE"
              ? { specialHandlingRequired: false }
              : {}),
          },
        ],
      },
    },
  });

  const {
    control,
    setValue,
    reset,
    formState: { errors },
    getValues,
  } = methods;
  const fieldArray = useFieldArray({ control, name: "lineItem.units" });

  const quoteId = useSearchParams().get("id");
  const { data: cachedSingleQuote } = useQuery({
    queryKey: ["singleQuote", quoteId],
    queryFn: () => (quoteId ? getSingleQuote(quoteId) : null),
    enabled: !!quoteId,
    staleTime: 1000 * 60 * 5,
  });
  // print errors
  console.log("DIMENSION ERRORS: ", errors);
  useEffect(() => {
    if (!cachedSingleQuote) return;
    const units = cachedSingleQuote.quote.lineItems?.units ?? [];
    if (shipmentType !== "STANDARD_FTL") {
      setValue(
        "lineItem.units",
        units.length === 0
          ? [
              {
                quantity: 1,
                length: 0,
                width: 0,
                height: 0,
                weight: 0,
                description: "",
              },
            ]
          : units,
      );
    } else {
      const isLooseFreight =
        cachedSingleQuote?.quote?.standardFTLService?.looseFreight;
      const isPallet = cachedSingleQuote?.quote?.standardFTLService?.pallet;

      const FTLUnits = isLooseFreight ? isLooseFreight : isPallet;
      if(FTLUnits){
        setValue("lineItem.units.0.name", isLooseFreight ? "looseFreight" : "pallets")
        setValue("lineItem.units.0.count", FTLUnits.totalCount || 0)
        setValue("lineItem.units.0.weight", FTLUnits.totalWeight || 0)
      }
    }

    if (shipmentType === "STANDARD_FTL") {
      setValue(
        "lineItem.measurementUnit",
        cachedSingleQuote?.quote?.standardFTLService?.looseFreight
          ?.measurementUnit,
      );
    } else {
      setValue(
        "lineItem.measurementUnit",
        cachedSingleQuote?.quote?.lineItems?.measurementUnit,
      );
    }
    setValue(
      "lineItem.dangerousGoods",
      cachedSingleQuote?.quote?.lineItems?.dangerousGoods,
    );
    // Dangerous Goods
    setValue(
      "lineItem.dangerousGoods.un",
      cachedSingleQuote?.quote?.lineItems?.dangerousGoods?.un,
    );
    setValue(
      "lineItem.dangerousGoods.class",
      cachedSingleQuote?.quote?.lineItems?.dangerousGoods?.class,
    );

    setValue("lineItem.stackable", cachedSingleQuote.lineItem?.stackable);

    setValue("lineItem.quantity", cachedSingleQuote.lineItem?.quantity ?? 1);
    setIsOpen(true);
  }, [cachedSingleQuote, setValue, shipmentType]);

  useEffect(() => {
    setValue("shipmentType", shipmentType);
    setValue("lineItem.type", shipmentType);
  }, [shipmentType]);
  // print special handling required
  useEffect(() => {
    console.log("DIMENSIONS values", getValues());
  }, [getValues]);
  const handleAddPackage = () => {
    fieldArray.append({
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      description: "",
    });
    setValue("lineItem.quantity", fieldArray.fields.length);
  };

  const handleClearDimensions = (index: number) => {
    setValue(`lineItem.units.${index}.length`, null);
    setValue(`lineItem.units.${index}.width`, null);
    setValue(`lineItem.units.${index}.height`, null);
    setValue(`lineItem.units.${index}.weight`, null);
    setValue(`lineItem.units.${index}.description`, "");
  };

  return {
    methods,
    fieldArray,
    handleAddPackage,
    handleClearDimensions,
    isOpen,
    setIsOpen,
    cachedSingleQuote,
  };
}
