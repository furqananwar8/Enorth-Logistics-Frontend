"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import FormField from "@/components/common/form/fields/FormField"
import { Controller, useForm, useFormContext } from "react-hook-form"
import { registerSchema, RegisterSchemaTypes } from "@/lib/validations/auth/register-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { GlobalForm } from "@/components/common/form/GlobalForm"
import { COUNTRIES, PROVINCES } from "@/shared-data/geo.data"

interface Step2FormProps {
  onNext: () => void
  onBack: () => void
}

export function Step2Form({ onNext, onBack }: Step2FormProps) {
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   onNext()
  // }
  const form = useFormContext<RegisterSchemaTypes>()
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors }
  } = form
  const handleNext = async () => {
    const valid = await trigger([
      "address.address1",
      "address.unit",
      "address.address2",
      "address.postalCode",
      "address.city",
      "address.state",
      "address.country",
    ])

    if (valid) onNext()
    // // console.log(form.getValues())
  }
  const country = watch("address.country");

  const filteredProvinces = React.useMemo(() => {
    if (!country) return [];
    return PROVINCES.filter((p) => p.country === country);
  }, [country]);

  return (
    <div className="space-y-6">
      <GlobalForm
        formWrapperClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
        fields={[
          {
            name: "address.address1",
            label: "Registered Business Address*",
            placeholder: "Enter your business address",
            type: "text",
          },
          {
            name: "address.unit",
            label: "Unit/Floor # (optional)",
            placeholder: "Enter your unit/floor #",
            type: "text",
          },
          {
            name: "address.address2",
            label: "Address 2 (optional)",
            placeholder: "Enter your address 2",
            type: "text",
          },
          {
            name: "address.postalCode",
            label: "Postal/ZIP Code*",
            placeholder: "Enter your postal/ZIP code",
            type: "text",
          },
          {
            name: "address.city",
            label: "City*",
            placeholder: "Enter your city",
            type: "text",
          },
          {
            name: "address.state",
            label: "Province/State*",
            placeholder: "Enter your province/state",
            type: "select",
            options: filteredProvinces?.length ? filteredProvinces : PROVINCES,

          },
          {
            name: "address.country",
            label: "Country*",
            placeholder: "Enter your country",
            type: "select",
            options: COUNTRIES,
          },
        ]}
      />

      <div className="flex justify-between items-center pt-18">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="text-primary border border-primary hover:bg-primary/10 bg-transparent px-8"
        >
          Previous Step
        </Button>
        <Button
          onClick={handleNext}
          // type="submit"
          className="bg-primary hover:bg-[#005999] text-white px-8"
        >
          Next Step
        </Button>
      </div>
    </div>
  )
}
