"use client";
import { createContext, useEffect, useState, useRef, useCallback } from "react";
import { SideBar } from "../SideBar";
import z from "zod";
import { getSingleQuote } from "@/api/services/quotes.api";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShippingTypeSelector } from "../Shipping/ShippingTypeSelector";
import { ShippingAddressSection } from "../Shipping/ShippingAddressSection";
import { EquimentTypeSelector } from "../EquimentSelection/EquimentTypeSelector";
import ContactInformation from "../ContactInformation/ContactInformation";
import Dimensions from "../Dimensions/Dimensions";
import AdditionalServices from "../AdditionalService/AdditionalServices";
import AdditionalInsurance from "../AdditionalInsurance/AdditionalInsurance";
import SignaturePreference from "../SignaturePreference/SignaturePreference";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import ShippingRates from "../ShippingRates/ShippingRates";
import SendRequest from "../SendRequest/SendRequest";
import { useAuth } from "@/context/auth.context";
import AddFundsModal from "@/components/common/AddFundsModal";
import { useDynamicQuote } from "./DynamicQuote.hooks";
import { ShipmentOptions } from "./DynamicQuote.types";
import { useDynamicQuoteMutations } from "./DynamicQuote.mutations";
import { useDynamicQuotePayloads } from "./DynamicQuote.payload";
import { formatShipDate } from "@/utils/formatShipDate";
import { getDayFromDateString } from "@/utils/getShipDate";

export const SchemaContext = createContext<z.ZodType<any> | null>(null);
export default function DynamicQuote({
  quoteType,
  initialShipmentType,
}: {
  quoteType: keyof ShipmentOptions;
  initialShipmentType: ShipmentOptions[keyof ShipmentOptions];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isShipment = pathname.includes("shipment");
  const [shipmentType, setShipmentType] =
    useState<ShipmentOptions[keyof ShipmentOptions]>(initialShipmentType);
  const [quoteStatus, setQuoteStatus] = useState<"DRAFT" | "SAVED">("DRAFT");
  const quoteId = useSearchParams().get("id");
  const [shipmentId, setShipmentId] = useState<string | null>(null);
  const totalSteps = 2;
  // query params include mode=edit/create/view
  const mode = useSearchParams().get("mode");
  const isEditing = mode === "edit";
  const isConversion = mode === "conversion";
  const isSpotQuote = quoteType === "SPOT";
  const isStandardQuote = quoteType === "STANDARD";
  const fromAddressRef = useRef<any>(null);
  const toAddressRef = useRef<any>(null);
  const dimensionsRef = useRef<any>(null);
  const servicesRef = useRef<any>(null);
  const insuranceRef = useRef<any>(null);
  const signatureRef = useRef<any>(null);
  const equipmentRef = useRef<any>(null);
  const contactRef = useRef<any>(null);
  const sendRequestRef = useRef<any>(null);
  const getRatesRef = useRef<any>(null);
  const [getRatesLoading, setGetRatesLoading] = useState(false);
  const [isFetchedQuoteShipment, setIsFetchedQuoteShipment] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [openGetRates, setOpenGetRates] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [staticLoading, setStaticLoading] = useState(false);
  const { user } = useAuth();
  const [inSufficientModal, setInSufficientModal] = useState(false);
  const [fromAddressLocked, setFromAddressLocked] = useState(false);
  const [toAddressLocked, setToAddressLocked] = useState(false);

  const {
    data: singleQuote,
    isLoading: isSingleQuoteLoading,
    isError: isSingleQuoteError,
    isSuccess: isSingleQuoteSuccess,
  } = useQuery({
    queryKey: ["singleQuote", quoteId],
    queryFn: () => (quoteId ? getSingleQuote(quoteId) : null),
    enabled: !!quoteId,
  });
  const { handleSwapAddress } = useDynamicQuote(fromAddressRef, toAddressRef, fromAddressLocked, setFromAddressLocked, toAddressLocked, setToAddressLocked, );
  const {
    createQuoteMutation,
    updateQuoteMutation,
    createShipmentMutation,
    updateShipmentMutation,
    bookShipmentMutation,
    createQuoteAndConvertToShipmentMutation,
  } = useDynamicQuoteMutations({
    shipmentId: shipmentId!,
    quoteId: quoteId!,
    quoteType: quoteType,
    setStaticLoading,
  });
  const { buildPayloads, payloadTransformer, getMergedPayload } =
    useDynamicQuotePayloads({
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
    });

  useEffect(() => {
    if (singleQuote?.quote?.shipment?.id) {
      setShipmentId(singleQuote.quote.shipment.id);
    }
  }, [singleQuote]);

  const fromAddress = fromAddressRef.current?.getValues() || {};
  const toAddress = toAddressRef.current?.getValues() || {};
  const dimensions = dimensionsRef.current?.getValues() || {};
  const services = servicesRef.current?.getValues() || {};
  const insurance = insuranceRef.current?.getValues() || {};
  const signature = signatureRef.current?.getValues() || {};
  const [isDimensionsValid, setIsDimensionsValid] = useState(false);
  const [realTimeData, setRealTimeData] = useState<any>({});
  const [newlyCreatedQuoteId, setNewlyCreatedQuoteId] = useState<any>(null);
  const searchParams = useSearchParams();
  const isSpotEditPage = searchParams.get("isSpotQuote")!;
  const isSpotQuotePage = pathname.includes("spot-quote");
  const [isFromAddressValid, setIsFromAddressValid] = useState(false);
  const [isToAddressValid, setIsToAddressValid] = useState(false);
  const [spotDetailsValidConfirmation, setSpotDetailsValidConfirmation] =
    useState(false);
  const syncRealTimeData = useCallback(() => {
    setRealTimeData(getMergedPayload());
  }, []);

  const transformAddress = (values: any, type: "FROM" | "TO") => {
    const addr = values?.address || values;

    const readyTime = values?.readyTimeHour
      ? `${values.readyTimeHour}:${values.readyTimeMinute ?? "00"} ${values.readyTimeAmPm ?? "AM"}`
      : values?.palletShippingReadyTime;

    const closeTime = values?.closeTimeHour
      ? `${values.closeTimeHour}:${values.closeTimeMinute ?? "00"} ${values.closeTimeAmPm ?? "AM"}`
      : values?.palletShippingCloseTime;

    return {
      type,
      address1: addr.address1,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      locationType: addr.locationTypeId ?? addr.locationType,
      companyName: values.companyName,
      contactName: values.contactName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      unit: addr.unit ?? values.unit,
      palletShippingReadyTime: readyTime,
      palletShippingCloseTime: closeTime,
      signatureId: values.signatureId,
    };
  };
  
  const scrollToSection = (id: string, offset = 100) => {
    const element = document.getElementById(id);

    if (!element) return;

    const top =
      element.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };
  const validateAllForms = async () => {
    const fromValid = await fromAddressRef.current?.trigger();
    const toValid = await toAddressRef.current?.trigger();
    const dimTriggerValid = await dimensionsRef.current?.trigger();

    // Validate dangerous goods inside its own container
    const dgValid = dimensionsRef.current?.validateDangerousGoods?.() ?? true;

    let valid = fromValid && toValid && dimTriggerValid && dgValid;

    if (quoteType === "SPOT") {
      const contactValid = await contactRef.current?.trigger();
      const equipmentValid = await equipmentRef.current?.trigger();
      valid = valid && contactValid && equipmentValid;
    }

    if (!valid) {
      toast.error("Please fill in all required fields correctly.");
      if (!dimTriggerValid || !dgValid) {
        scrollToSection(`dimensions`);
      }
      if (!fromValid || !toValid) {
        scrollToSection(`shippingAddressSectionFROM`);
      }
      return false;
    }

    return valid;
  };

  const onSubmit = async () => {
    const valid = await validateAllForms();
    if (!valid) return;

    const { finalQuotePayload, shipmentPayload } = buildPayloads();

    if (isEditing) {
      if (isShipment) {
        updateShipmentMutation.mutate(shipmentPayload);
      } else {
        updateQuoteMutation.mutate(finalQuotePayload);
      }
    } else {
      if (isShipment) {
        const fromValues = fromAddressRef.current?.getValues() || {};
        const toValues = toAddressRef.current?.getValues() || {};

        const enrichedShipmentPayload = {
          ...shipmentPayload,
          quote: {
            ...shipmentPayload?.quote,
            addresses: [
              transformAddress(fromValues, "FROM"),
              transformAddress(toValues, "TO"),
            ],
          },
        };

        createShipmentMutation.mutate(enrichedShipmentPayload);
      } else {
        createQuoteMutation.mutate(finalQuotePayload);
      }
    }
  };

  const handleGetRates = async () => {
    setSelectedCarrier(null);
    const valid = await validateAllForms();
    if (!valid) return;

    if (servicesRef.current) await servicesRef.current.trigger();
    if (insuranceRef.current) await insuranceRef.current.trigger();
    if (signatureRef.current) await signatureRef.current.trigger();
    if (sendRequestRef.current) await sendRequestRef.current.trigger();

    // 1. Open accordion so ShippingRatesStream mounts
    setOpenGetRates("shippingRates");
    setGetRatesLoading(true);

    // 2. Wait for accordion animation + DOM mount, then start stream and scroll
    setTimeout(() => {
      getRatesRef.current?.handleStart();
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 300); // 300ms covers Radix accordion open animation
  };

  function extractDays(str: string) {
    const match = str?.match(/\d+/);
    return match ? match[0] : null;
  }

  const handleBookShipment = async () => {
    setStaticLoading(true);
    try {
      const valid = await validateAllForms();
      if (!valid) return;

      if (!selectedCarrier) {
        toast.error("Please select a carrier");
        return;
      }

      const { finalQuotePayload } = buildPayloads();

      const fromValues = fromAddressRef.current?.getValues() || {};
      const toValues = toAddressRef.current?.getValues() || {};

      const addresses = [
        transformAddress(fromValues, "FROM"),
        transformAddress(toValues, "TO"),
      ];

      const newShipmentPayload = {
        mode: "SHIPMENT",
        shipmentType: singleQuote?.quote?.shipmentType || shipmentType,
        shipDate: formatShipDate(fromValues?.shipDate),
        quote: {
          ...(singleQuote?.quote?.id
            ? {
                id: singleQuote?.quote?.id,
                quoteType: singleQuote?.quote?.quoteType,
                shipmentType: singleQuote?.quote?.shipmentType,
              }
            : {
                ...finalQuotePayload,
                shipmentType,
                quoteType,
              }),
          addresses,
        },
      };

      let res = null;
      if (!singleQuote?.quote?.shipment?.id) {
        res = await createShipmentMutation.mutateAsync(newShipmentPayload);
        setNewlyCreatedQuoteId(res?.quote?.id);
      }

      const bookShipmentPayload = {
        ...(singleQuote?.quote?.id
          ? {
              quoteId: singleQuote?.quote?.id,
              shipDate:
                formatShipDate(fromValues?.shipDate) ||
                formatShipDate(singleQuote?.quote?.shipment?.shipDate),
            }
          : {
              quoteId: res?.quote?.id,
              shipDate:
                formatShipDate(fromValues?.shipDate) ||
                formatShipDate(res?.quote?.shipment?.shipDate),
            }),
        carrier: selectedCarrier.carrier,
        selectedRate: {
          serviceType: selectedCarrier.serviceType,
          serviceName: selectedCarrier.serviceName,
          totalCharge: selectedCarrier.totalPrice,
          currency: selectedCarrier.currency,
          ...(selectedCarrier.carrier === "TST" && {
            packagingType: selectedCarrier.packagingType || "BOX",
            transitDays: extractDays(selectedCarrier.estimatedDeliveryDays),
          }),
          ...(selectedCarrier.carrier === "XPO" && {
            totalSurcharges: selectedCarrier.totalSurcharges,
            surcharges: selectedCarrier.surcharges || [],
            confirmationNumber: selectedCarrier.confirmationNumber,
            totalDiscount: selectedCarrier.totalDiscount,
          }),
        },
      };

      if (
        selectedCarrier?.carrier?.toUpperCase() === "XPO" &&
        bookShipmentPayload.shipDate
      ) {
        const day = getDayFromDateString(bookShipmentPayload.shipDate);
        if (day === 0 || day === 6) {
          scrollToSection(`shippingAddressSectionFROM`);
          toast.error("XPO shipments cannot be scheduled on weekends.");
          return;
        }
      }

      await bookShipmentMutation.mutateAsync(bookShipmentPayload);
    } catch (err) {
      console.error("Book shipment error:", err);
    } finally {
      setStaticLoading(false);
    }
  };

  const handleConvertToShipment = async () => {
    const valid = await validateAllForms();

    if (!valid) return;

    const { finalQuotePayload } = buildPayloads();

    createQuoteAndConvertToShipmentMutation.mutate(finalQuotePayload);
  };

  const [step, setStep] = useState(1);
  const { isAdmin } = useAuth();
  const viewOnly = isAdmin;
  return (
    <>
      <AddFundsModal
        onOpenChange={setInSufficientModal}
        open={inSufficientModal}
      />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {!isShipment ? (
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold capitalize">
              {isAdmin
                ? "Quote Detail"
                : isEditing
                  ? `Edit ${quoteType.toLowerCase()} Quote`
                  : `Create New ${quoteType.toLowerCase()} Quote`}
            </h1>
          </div>
        ) : (
          ""
        )}

        <div
          className={!viewOnly ? "grid grid-cols-1 lg:grid-cols-4 gap-8" : ""}
        >
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ShippingTypeSelector
                quoteType={isSpotEditPage ? "SPOT" : quoteType}
                shipmentType={shipmentType}
                setShipmentType={setShipmentType}
              />
              <div className="flex flex-col md:flex-row gap-6">
                <div className="border border-border rounded-md p-4 space-y-4 flex-1 bg-white dark:bg-card shadow-lg">
                  <ShippingAddressSection
                    setStep={setStep}
                    step={step}
                    isFetchedQuoteShipment={isFetchedQuoteShipment}
                    setIsFetchedQuoteShipment={setIsFetchedQuoteShipment}
                    ref={fromAddressRef}
                    onSwap={handleSwapAddress}
                    quoteType={quoteType}
                    shipmentType={shipmentType}
                    type="FROM"
                    title="Shipping From"
                    onChange={syncRealTimeData}
                    onValidityChange={setIsFromAddressValid}
                    selectedCarrierName={
                      selectedCarrier ? selectedCarrier.carrier : ""
                    }
                    viewOnly={viewOnly}
                    addressLocked={fromAddressLocked}
                    setAddressLocked={setFromAddressLocked}
                  />
                </div>
                <div className="border border-border rounded-md p-4 space-y-4 flex-1 bg-white dark:bg-card shadow-lg">
                  <ShippingAddressSection
                    setStep={setStep}
                    step={step}
                    isFetchedQuoteShipment={isFetchedQuoteShipment}
                    setIsFetchedQuoteShipment={setIsFetchedQuoteShipment}
                    ref={toAddressRef}
                    onSwap={handleSwapAddress}
                    quoteType={quoteType}
                    shipmentType={shipmentType}
                    type="TO"
                    title="Shipping To"
                    onChange={syncRealTimeData}
                    onValidityChange={setIsToAddressValid}
                    viewOnly={viewOnly}
                    addressLocked={toAddressLocked}
                    setAddressLocked={setToAddressLocked}
                  />
                </div>
              </div>
              {quoteType === "SPOT" || isSpotEditPage ? (
                <div className="space-y-6 mt-6">
                  <EquimentTypeSelector
                    ref={equipmentRef}
                    shipmentType={shipmentType}
                    onChange={syncRealTimeData}
                    quoteDetails={singleQuote}
                    viewOnly={viewOnly}
                  />
                </div>
              ) : (
                ""
              )}
              {quoteType === "SPOT" || isSpotEditPage ? (
                <div className="space-y-6 mt-6">
                  <ContactInformation
                    quoteType={quoteType}
                    ref={contactRef}
                    onChange={syncRealTimeData}
                    quoteDetails={singleQuote}
                    viewOnly={viewOnly}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="space-y-6 mt-6">
                <Dimensions
                  ref={dimensionsRef}
                  shipmentType={shipmentType}
                  onChange={syncRealTimeData}
                  quoteType={quoteType}
                  setIsDimensionsValid={setIsDimensionsValid}
                  viewOnly={viewOnly}
                />
              </div>
              {shipmentType !== "STANDARD_FTL" ? (
                <div className="mt-6">
                  <AdditionalServices
                    quoteType={quoteType}
                    ref={servicesRef}
                    shipmentType={shipmentType}
                    onChange={syncRealTimeData}
                    viewOnly={viewOnly}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="mt-6">
              <AdditionalInsurance viewOnly={viewOnly} ref={insuranceRef} />
            </div>
            {(shipmentType === "PACKAGE" ||
              shipmentType === "COURIER_PAK" ||
              isShipment) && (
              <div className="mt-6">
                <SignaturePreference ref={signatureRef} />
              </div>
            )}
            {(quoteType === "SPOT" || isSpotEditPage) && (
              <div className="mt-6">
                <SendRequest
                  ref={sendRequestRef}
                  contactInfo={realTimeData?.spotDetails}
                  equipmentDetails={realTimeData?.spotDetails}
                  fromAddress={realTimeData?.addresses?.[0]}
                  toAddress={realTimeData?.addresses?.[1]}
                  dimensions={realTimeData}
                  services={realTimeData?.services}
                  onPrevious={() => {}}
                  onSubmit={onSubmit}
                  setSpotDetailsValidConfirmation={
                    setSpotDetailsValidConfirmation
                  }
                  viewOnly={viewOnly}
                />
              </div>
            )}
            {!isSpotEditPage && !isSpotQuotePage ? (
              <div className="mt-6">
                <ShippingRates
                  getRatesLoading={getRatesLoading}
                  setGetRatesLoading={setGetRatesLoading}
                  ref={getRatesRef}
                  selectedCarrier={selectedCarrier}
                  setSelectedCarrier={setSelectedCarrier}
                  openGetRates={openGetRates}
                  setOpenGetRates={setOpenGetRates}
                  dimensions={dimensions}
                  fromAddress={fromAddress}
                  toAddress={toAddress}
                  quoteId={singleQuote?.quote?.id || newlyCreatedQuoteId}
                  shipmentType={shipmentType}
                />
              </div>
            ) : (
              ""
            )}

            {!viewOnly && (
              <div className="w-full z-10 flex justify-end pt-8 sticky bottom-0 bg-white/10 backdrop-blur-md p-5 rounded-lg mt-2">
                <div className="flex gap-4">
                  {!isSpotEditPage && !isSpotQuotePage && (
                    <Button
                      variant={"secondary"}
                      disabled={getRatesLoading}
                      onClick={handleGetRates}
                      className="border border-primary/50"
                    >
                      {getRatesLoading ? (
                        <LoaderCircle className="animate-spin mr-2" size={16} />
                      ) : (
                        ""
                      )}
                      Get Rates
                    </Button>
                  )}
                  {isShipment ? (
                    <Button
                      onClick={handleBookShipment}
                      disabled={bookShipmentMutation.isPending || staticLoading}
                    >
                      {bookShipmentMutation.isPending || staticLoading ? (
                        <LoaderCircle className="animate-spin mr-2" size={16} />
                      ) : (
                        ""
                      )}
                      Book Shipment
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        handleConvertToShipment();
                      }}
                      disabled={
                        createQuoteAndConvertToShipmentMutation.isPending ||
                        (quoteType !== "STANDARD" || isSpotEditPage
                          ? !spotDetailsValidConfirmation
                          : false)
                      }
                    >
                      {createQuoteAndConvertToShipmentMutation.isPending ? (
                        <LoaderCircle className="animate-spin mr-2" size={16} />
                      ) : (
                        ""
                      )}
                      {quoteType === "STANDARD" && !isSpotEditPage
                        ? "Convert to Shipment"
                        : "Request Quote"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          {!isAdmin && (
            <SideBar
              isPending={
                createQuoteMutation.isPending || updateQuoteMutation.isPending
              }
              onSubmit={onSubmit}
              setQuoteStatus={setQuoteStatus}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isFromAddressValid={isFromAddressValid}
              isToAddressValid={isToAddressValid}
              isDimensionsValid={isDimensionsValid}
            />
          )}
        </div>
      </div>
    </>
  );
}
