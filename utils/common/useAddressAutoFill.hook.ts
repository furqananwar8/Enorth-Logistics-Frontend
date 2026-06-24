// usePostalCodeAutoFill.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { getAddressByPostalCode } from "@/api/services/shipment.api";
import { useDebounce } from "@/hooks/useDebounce.hook";

const provinceMap: Record<string, string> = {
  "10": "NL",
  "11": "PE",
  "12": "NS",
  "13": "NB",
  "24": "QC",
  "35": "ON",
  "46": "MB",
  "47": "SK",
  "48": "AB",
  "59": "BC",
  "60": "YT",
  "61": "NT",
  "62": "NU",
};

const getProvinceCode = (provinceNumber: string) =>
  provinceMap[provinceNumber] ?? "";

interface UsePostalCodeAutoFillProps {
  methods: UseFormReturn<any>;
  postalCodeField: string;
  cityField: string;
  stateField: string;
  countryField: string;
  addressLocked?: boolean;
  enabled?: boolean;
}

export const usePostalCodeAutoFill = ({
  methods,
  postalCodeField,
  cityField,
  stateField,
  countryField,
  addressLocked,
  enabled = true,
}: UsePostalCodeAutoFillProps) => {
  const postalCode = methods.watch(postalCodeField) || "";
  const debouncedPostalCode = useDebounce(postalCode, 250);

  const query = useQuery({
    queryKey: ["postalCode", debouncedPostalCode],
    queryFn: () => getAddressByPostalCode(debouncedPostalCode),
    enabled: enabled && debouncedPostalCode.length > 0,
    retry: false,
  });

  useEffect(() => {
    if (!query.data || addressLocked || query.isLoading) return;
    if (!debouncedPostalCode) return;
    if (!query.data) return;
    if (addressLocked) return;
    const currentPostalCode = methods.getValues(postalCodeField);
    if (!currentPostalCode) return;

    methods.setValue(cityField, query.data.placeName);

    methods.setValue(
      stateField,
      query.data.fsaProvince === "CA"
        ? getProvinceCode(query.data.country)
        : query.data.country,
    );

    methods.setValue(countryField, query.data.fsaProvince);
  }, [
    query.data,
    query.isLoading,
    addressLocked,
    methods,
    cityField,
    stateField,
    countryField,
  ]);

  return query;
};
