import {
  getAllPalletShippingLocationTypes,
  getAllSignatures,
} from "@/api/services/address-book.api";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactType } from "../../../app/(user)/settings/(address-book)/types/addContact.types";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import { SelectAddressBookModal } from "./SelectAddressBookModal";
import { useQuery } from "@tanstack/react-query";
import { useMarkContactAsRecent } from "../../../app/(user)/quote/hooks";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, BookUser, InfoIcon, Plus, X } from "lucide-react";
// import { ShipmentOptions } from "../DynamicQuote/DynamicQuote"
import z, { ZodType } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getSingleQuote } from "@/api/services/quotes.api";
import { addressSchema } from "@/lib/validations/quote/standard-quote-schema";
import { getFormFields } from "./ShippingAddressFields";
export { addressSchema };

export const addressesSchema = z.object({
  addresses: z.array(addressSchema).length(2),
});

export type AddressesSchemaTypes = z.infer<typeof addressesSchema>;

function getRequiredFields(schema: z.ZodObject<any>) {
  const shape = schema.shape;
  if (!shape) return [];
  return Object.keys(shape).filter((key) => {
    const field = shape[key];
    // check if the field is optional or has default
    return !(
      field.isOptional?.() ||
      field.isNullable?.() ||
      field._def.defaultValue
    );
  });
}

import { forwardRef, useImperativeHandle } from "react";
import {
  FormFieldTypes,
  FormFieldUnion,
} from "@/components/common/form/fields/fields.types";
import FormDate from "@/components/common/form/fields/FormDate";
import { contactSchema } from "@/app/(user)/settings/(address-book)/schemas/addContact.schema";
import { getAddressByPostalCode } from "@/api/services/shipment.api";
import { Input } from "@/components/ui/input";
import { parseTime12h } from "@/app/(user)/settings/(address-book)/mappers/contact.mapper";
import { COUNTRIES, PROVINCES } from "@/shared-data/geo.data";
import { Loader } from "@/components/common/Loader";
import { ShipmentOptions } from "../DynamicQuote/DynamicQuote.types";
export const ShippingAddressSection = forwardRef(
  (
    {
      step,
      setStep,
      quoteType,
      shipmentType,
      type,
      title,
      onNextStep,
      onSwap,
      isFetchedQuoteShipment,
      setIsFetchedQuoteShipment,
      onChange,
    }: {
      quoteType: keyof ShipmentOptions;
      shipmentType: ShipmentOptions[keyof ShipmentOptions];
      type: "TO" | "FROM";
      title: string;
      onNextStep?: (data: any) => void;
      onSwap?: () => void;
      setShipDate?: (date: Date | undefined) => void;
      isFetchedQuoteShipment: boolean;
      setIsFetchedQuoteShipment: (value: boolean) => void;
      step: number;
      setStep: (step: number) => void;
      onChange?: (data: any) => void;
    },
    ref,
  ) => {
    // check if route includes shipment to check if it quote or shipment
    const pathname = usePathname();
    const isShipment = pathname.includes("shipment");
    const quoteId = useSearchParams().get("id");
    const markContactAsRecent = useMarkContactAsRecent();
    const [addressLocked, setAddressLocked] = useState(false);
    // const [finalShipmentType, setFinalShipmentType] = useState(shipmentType)
    // const [showLocationType, setShowLocationType] = useState(quoteType === "SPOT" || finalShipmentType === "PALLET");
    const showLocationType =
      shipmentType === "PALLET" || shipmentType === "PACKAGE";
    const showAdditionalNotes = quoteType === "SPOT";
    const [billingRefs, setBillingRefs] = useState<string[]>([""]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const {
      data: cachedSingleQuote,
      isLoading,
      isPending,
    } = useQuery({
      queryKey: ["singleQuote", quoteId],
      queryFn: () => (quoteId ? getSingleQuote(quoteId) : null),
      enabled: !!quoteId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
    const addressDefaultValues = {
      // @ts-ignore
      type: type,
      address: {
        address1: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    };

    const shipmentDefaultValues = {
      companyName: "",
      contactId: "",
      phoneNumber: "",
      email: "",
      contactName: "",
      // @ts-ignore
      type: type,
      address: {
        address1: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        // set mins to 00 and hours to 12
      },
      readyTimeHour: "09",
      readyTimeMinute: "00",
      readyTimeAmPm: "AM",
      closeTimeHour: "05",
      closeTimeMinute: "00",
      closeTimeAmPm: "PM",
      shipDate: undefined,
    };

    const defaultValues = isShipment
      ? shipmentDefaultValues
      : addressDefaultValues;
    const localSchema = useMemo(() => {
      if (isShipment) {
        // make a field optional from contact schema
        const { signatureId, ...rest } = contactSchema.shape;
        let baseShape: any = {
          ...rest,
          signatureId: signatureId.optional(),
        };

        if (type === "FROM") {
          baseShape.shipDate = z
            .date({
              message: "Ship date is required",
            })
            .min(new Date(new Date().setHours(0, 0, 0, 0)), {
              message: "Ship date cannot be in the past",
            });
        }

        return z.object(baseShape);
      } else {
        let schema = contactSchema.pick({
          address: true,
        });

        if (showLocationType) {
          schema = schema.extend({
            address: schema.shape.address.extend({
              locationTypeId: z.number("Location type is required"),
            }),
          }) as any;
        }
        return schema;
      }
    }, [shipmentType]);

    // print shipment type
    // console.log("shipmentType", shipmentType);
    const methods = useForm({
      // @ts-ignore
      resolver: zodResolver(localSchema),
      mode: "onChange",
      defaultValues: defaultValues,
      shouldUnregister: false,
    });

    useEffect(() => {
      const subscription = methods.watch((value) => {
        if (onChange) {
          onChange(value);
        }
      });
      return () => subscription.unsubscribe();
    }, [methods, onChange]);

    // set ship date to today
    // make ship date undefined

    const postalCodeWatch = methods.watch("address.postalCode") || "";

    const countryCode = postalCodeWatch.match(/^\d{5}(-\d{4})?$/) ? "us" : "ca";

    // const {
    //   data: postalCodeData,
    //   isLoading: postalCodeLoading,
    //   isPending: postalCodeIsPending,
    // } = useQuery({
    //   queryKey: ["postalCode", postalCodeWatch],
    //   // queryFn: () => getAddressByPostalCode(postalCodeWatch, countryCode),
    //   queryFn: () => getAddressByPostalCode(postalCodeWatch),
    //   // enabled: postalCodeWatch.length === 5,
    // });

    // useEffect(() => {
    //   if (postalCodeData) {
    //     console.log("address.city", postalCodeData["placeName"])
    //     console.log("address.state", postalCodeData["country"])
    //     console.log("address.country", postalCodeData["fsa_province"])

    //     methods.setValue("address.city", postalCodeData["placeName"]);
    //     // wrong mapping in DB, swapped values
    //     methods.setValue("address.state", postalCodeData["country"]);
    //     methods.setValue("address.country", postalCodeData["fsaProvince"]);
    //   }
    // }, [postalCodeData, postalCodeWatch]);

    // on change of ship date setshipdate state coming from parent

    // useEffect(() => {
    //   if (isShipment) {
    //     // @ts-ignore
    //     methods.register("shipDate");
    //   }
    // }, [isShipment]);

    // errors
    // console.log("errors", methods.formState.errors);

    useImperativeHandle(
      ref,
      () => ({
        getValues: methods.getValues,
        setValues: (vals: any) => methods.reset({ ...vals }),
        trigger: methods.trigger,
      }),
      [methods],
    );

    const index = type === "FROM" ? 0 : 1;
    // print errors
    // console.log("errors", methods.formState.errors);
    // console.log("cachedSingleQuote", cachedSingleQuote);

    const handleAddressSelect = (contact: ContactType) => {
      markContactAsRecent.mutate(contact.id || "");
      setAddressLocked(true);
      methods.setValue("addressBookId", Number(contact.id));
      methods.setValue("type", type);

      methods.setValue(
        "address",
        {
          address1: contact.address?.address1 || "",
          postalCode: contact.address?.postalCode || "",
          city: contact.address?.city || "",
          country: contact.address?.country || "",
          state: contact.address?.state || "",
          ...(isShipment && { unit: contact.address?.unit || "" }),
        },
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      // if shipment type is STANDARD_FTL
      console.log("shipmentType", shipmentType)
      if (shipmentType === "PACKAGE" || shipmentType === "COURIER_PAK") {
        console.log("contact.isResidential", contact)
        methods.setValue("isResidential", contact.isResidential || false, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (shipmentType === "COURIER_PAK") {
        methods.setValue(
          "signatureId",
          contact?.signatureId?.toString() || "",
          {
            shouldValidate: true,
          },
        );
      }
      if (showLocationType) {
        methods.setValue(
          "address.locationTypeId",
          (contact?.locationTypeId as any) || null,
          {
            shouldValidate: true,
          },
        );
      }

      if (isShipment) {
        methods.setValue("companyName", contact.companyName || "", {
          shouldValidate: true,
        });
        methods.setValue("address2", contact.address?.address2 || "", {
          shouldValidate: true,
        });
        methods.setValue("contactName", contact.contactName || "", {
          shouldValidate: true,
        });
        methods.setValue("email", contact.email || "", {
          shouldValidate: true,
        });
        methods.setValue("phoneNumber", contact.phoneNumber || "", {
          shouldValidate: true,
        });

        // readytime
        const [readyTimeHour, readyTimeMinute, readyTimeAmPm] = parseTime12h(
          contact.palletShippingReadyTime,
        );
        const [closeTimeHour, closeTimeMinute, closeTimeAmPm] = parseTime12h(
          contact.palletShippingCloseTime,
        );
        methods.setValue("readyTimeHour", readyTimeHour || "", {
          shouldValidate: true,
        });
        methods.setValue("readyTimeAmPm", readyTimeAmPm || "", {
          shouldValidate: true,
        });
        methods.setValue("readyTimeMinute", readyTimeMinute || "", {
          shouldValidate: true,
        });
        methods.setValue("closeTimeHour", closeTimeHour || "", {
          shouldValidate: true,
        });
        methods.setValue("closeTimeAmPm", closeTimeAmPm || "", {
          shouldValidate: true,
        });
        methods.setValue("closeTimeMinute", closeTimeMinute || "", {
          shouldValidate: true,
        });
      }
      // print location type
    };
    const country = methods.watch("address.country");

    const filteredProvinces = useMemo(() => {
      if (!country) return [];
      return PROVINCES.filter((p) => p.country === country);
    }, [country]);
    const {
      data: locationTypeData,
      isLoading: locationTypeLoading,
      isPending: locationTypeIsPending,
    } = useQuery({
      queryKey: ["palletShippingLocationTypes"],
      queryFn: getAllPalletShippingLocationTypes,
    });
    // params check mode
    const searchParam = useSearchParams();
    const isEdit = searchParam.get("mode") === "edit";
    const isConversion = searchParam.get("mode") === "conversion";
    const handleClearAddress = () => {
      setAddressLocked(false);
      methods.reset({
        address: {
          address1: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
        ...(showLocationType && { locationTypeId: "" }),
        ...(isShipment && { companyName: "" }),
        ...(isShipment && { contactId: "" }),
        ...(isShipment && { address2: "" }),
        ...(isShipment && { unit: "" }),
        ...(isShipment && { contactName: "" }),
        ...(isShipment && { email: "" }),
        ...(isShipment && { phoneNumber: "" }),
        ...(isShipment && { read: "" }),
      });
    };
    // show shipdate
    // show values
    // show errors

    // console values on change


    useEffect(() => {
      // console.log("cachedSingleQuote", cachedSingleQuote);
      setIsFetchedQuoteShipment(!!cachedSingleQuote?.quote?.shipment?.id);
      if (!cachedSingleQuote) return;
      setIsEditing(true);
      // if(isEdit){
      //   const quoteAddress = cachedSingleQuote.quote.addresses[index].address
      //     ? cachedSingleQuote.quote.addresses[index] : cachedSingleQuote.quote.addresses[index]?.id;
      //   const isAddressBookEntry = cachedSingleQuote.quote.addresses[index]?.addressBookEntry?.address;
      //   const completeAddressFromAddressBook = cachedSingleQuote.quote.addresses[index]?.addressBookEntry;

      // }

      const quoteAddress = cachedSingleQuote.quote.addresses[index];
      const isAddressBookEntry =
        cachedSingleQuote.quote.addresses[index]?.companyName;

      if (quoteAddress) {
        // console.log("THIS IS QUOTE ADDRESS!!!!!", addressLocked)
        // setFinalShipmentType(quoteAddress?.shipmentType);
        // setShowLocationType(quoteType === "SPOT" || finalShipmentType === "PALLET");
        methods.setValue("addressBookId", Number(quoteAddress.id));
        const isAddressFromAddressBook = !!quoteAddress?.address?.address1;
        if (isAddressFromAddressBook) {
          setAddressLocked(true);
        }
        methods.reset({
          ...(isAddressBookEntry && { addressBookId: quoteAddress.id ?? null }),
          address: {
            address1: isAddressFromAddressBook
              ? quoteAddress?.address?.address1
              : quoteAddress?.address1 || "",
            postalCode: isAddressFromAddressBook
              ? quoteAddress?.address?.postalCode
              : quoteAddress?.postalCode || "",
            city: isAddressFromAddressBook
              ? quoteAddress?.address?.city
              : quoteAddress?.city || "",
            country: isAddressFromAddressBook
              ? quoteAddress?.address?.country
              : quoteAddress?.country || "",
            state: isAddressFromAddressBook
              ? quoteAddress?.address?.state
              : quoteAddress?.state || "", // important
            // ...(showLocationType && { locationTypeId: quoteAddress?.locationTypeId }),
            locationTypeId: quoteAddress?.locationTypeId,
          },
          ...(isShipment && { companyName: quoteAddress.companyName }),
          ...(isShipment && { contactId: quoteAddress.contactId }),
          ...(isShipment && { address2: quoteAddress.address2 }),
          ...(isShipment && { unit: quoteAddress.unit }),
          ...(isShipment && { contactName: quoteAddress.contactName }),
          ...(isShipment && { email: quoteAddress.email }),
          ...(isShipment && { phoneNumber: quoteAddress.phoneNumber }),
        });
        if (showLocationType) {
          setTimeout(() => {
            methods.setValue(
              "address.locationTypeId",
              quoteAddress?.locationTypeId || null,
              {
                shouldValidate: true,
                shouldDirty: true,
              },
            );
          }, 10);
        }
        methods.setValue("type", type);
        // @ts-ignore
        // const fetchedShipDate = cachedSingleQuote.quote.shipment.shipDate;
        // methods.setValue("address.shipDate", new Date("2026-05-12T16:17:04.556Z"),
        //   {
        //     shouldValidate: true,
        //   }
        // );

        const [readyTimeHour, readyTimeMinute, readyTimeAmPm] = parseTime12h(
          quoteAddress.palletShippingReadyTime,
        );
        const [closeTimeHour, closeTimeMinute, closeTimeAmPm] = parseTime12h(
          quoteAddress.palletShippingCloseTime,
        );
        methods.setValue("readyTimeHour", readyTimeHour || "00", {
          shouldValidate: true,
        });
        methods.setValue("readyTimeAmPm", readyTimeAmPm || "AM", {
          shouldValidate: true,
        });
        methods.setValue("readyTimeMinute", readyTimeMinute || "00", {
          shouldValidate: true,
        });
        methods.setValue("closeTimeHour", closeTimeHour || "00", {
          shouldValidate: true,
        });
        methods.setValue("closeTimeAmPm", closeTimeAmPm || "PM", {
          shouldValidate: true,
        });
        methods.setValue("closeTimeMinute", closeTimeMinute || "00", {
          shouldValidate: true,
        });
        if (isShipment && cachedSingleQuote?.quote?.shipment?.shipDate) {
          methods.setValue(
            "shipDate",
            new Date(cachedSingleQuote?.quote?.shipment?.shipDate),
            {
              shouldValidate: true,
            },
          );
        }

        // wait for country-dependent provinces to render
        setTimeout(() => {
          methods.setValue(
            "address.state",
            (isAddressFromAddressBook
              ? quoteAddress.address.state
              : quoteAddress.state) || "",
            {
              shouldValidate: true,
              shouldDirty: true,
            },
          );
        }, 10);

        setTimeout(() => {
          methods.setValue(
            "address.country",
            (isAddressFromAddressBook
              ? quoteAddress?.address?.country
              : quoteAddress?.country) || "",
            {
              shouldValidate: true,
              shouldDirty: true,
            },
          );
        }, 10);
      }
    }, [
      cachedSingleQuote,
      index,
      type,
      shipmentType,
      methods,
      COUNTRIES,
      PROVINCES,
    ]);

    const handleSwap = () => {
      // Parent handles the actual swapping by fetching from refs
      if (onSwap) {
        onSwap();
      }
    };
    if (quoteId) {
      setTimeout(() => {
        if (isLoading || isPending) {
          return <Loader />;
        }
      }, 0);
    }

    const handleNext = (data: any) => {
      if (onNextStep) {
        onNextStep(data);
      }
    };

    const {
      data: signatures,
      isLoading: isLoadingSignatures,
      isPending: isPendingSignatures,
    } = useQuery({
      queryKey: ["signatures"],
      queryFn: getAllSignatures,
    });

    const formFields = getFormFields({
      addressLocked,
      isShipment,
      shipmentType,
      filteredProvinces,
      locationTypeLoading,
      locationTypeIsPending,
      locationTypeData,
      showAdditionalNotes,
      type,
      signatures,
      isLoadingSignatures,
    });
    const addBillingRef = () => {
      if (billingRefs.length < 3) {
        setBillingRefs([...billingRefs, ""]);
      }
    };

    const updateBillingRef = (index: number, value: string) => {
      const updated = [...billingRefs];
      updated[index] = value;
      setBillingRefs(updated);
    };

    const removeBillingRef = (index: number) => {
      const updated = billingRefs.filter((_, i) => i !== index);
      setBillingRefs(updated);
    };

    // console.log("values", methods.getValues());

    // show form errors
    // console.log("ADDRESS ERRORS", methods.formState.errors);
    return (
      <>
        <div id={`shippingAddressSection${type}`} className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              type="button"
              onClick={handleClearAddress}
            >
              <X />
              Clear
            </Button>
            <Button variant="outline" type="button" onClick={handleSwap}>
              <ArrowLeftRight />
              Swap
            </Button>
          </div>
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleNext)}
            className="space-y-4 mt-2"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Select Address</p>
              <SelectAddressBookModal onSelect={handleAddressSelect} />
            </div>
            <GlobalForm
              formWrapperClassName="grid grid-cols-1 sm:grid-cols-2 gap-6"
              fields={formFields}
              extra={
                shipmentType === "STANDARD_FTL" && (
                  <p className="col-span-2 text-muted-foreground text-sm">
                    FTL Location Type: Business - Tailgate Not Required
                  </p>
                )
              }
            />
            {isShipment && type === "TO" && (
              <div className="col-span-2 space-y-2">
                {billingRefs.map((ref, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder={`Billing Reference Code ${index + 1}`}
                      value={ref}
                      onChange={(e) => updateBillingRef(index, e.target.value)}
                      className="w-full"
                    />

                    {billingRefs.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeBillingRef(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <div className="w-full flex justify-end">
                  {billingRefs.length < 3 && (
                    <Button type="button" onClick={addBillingRef}>
                      <Plus />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </>
    );
  },
);
