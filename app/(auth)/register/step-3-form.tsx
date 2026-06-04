"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Controller, useFormContext } from "react-hook-form"
import { RegisterSchemaTypes } from "@/lib/validations/auth/register-schema"
import FormField from "@/components/common/form/fields/FormField"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import LegalPolicyModal from "@/components/static/LegalPolicyModal"
import { GlobalForm } from "@/components/common/form/GlobalForm"
import { Loader2 } from "lucide-react"

interface Step3FormProps {
  onBack: () => void
  isPending: boolean
}

export function Step3Form({ onBack, isPending }: Step3FormProps) {
  const router = useRouter()
  const form = useFormContext<RegisterSchemaTypes>()
  const {
    register,
    control,
    watch,

    formState: { errors, isValid }
  } = form

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <GlobalForm
            formWrapperClassName="flex flex-col gap-2 space-y-2"
            fields={[
              // {
              //   name: "user.username",
              //   label: "Create a Username*",
              //   placeholder: "Enter your username",
              //   type: "text",
              // },
              // password
              {
                name: "user.password",
                label: "Create Password*",
                placeholder: "Enter your password",
                type: "password",
              },
              {
                name: "user.confirmPassword",
                label: "Confirm Password*",
                placeholder: "Confirm your password",
                type: "password",
              },
            ]}
          />

        </div>


        <div className="pt-2 flex flex-col gap-2">
          <div>
            <Controller
              name="user.termsAndConditionAccepted"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2 text-sm">
                  <Checkbox
                    value={field.value ? "checked" : "unchecked"}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="cursor-pointer border border-primary/50"
                  />
                  <p>Accept</p>
                  <LegalPolicyModal>
                    <p className="text-primary font-bold cursor-pointer">Terms and Conditions</p>
                  </LegalPolicyModal>
                </div>
              )}
            />
          </div>
          <FieldError>
            {errors.user?.termsAndConditionAccepted?.message}
          </FieldError>
          <div>
            <Controller
              name="user.companyPolicyAccepted"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2 text-sm">
                  <Checkbox
                    value={field.value ? "checked" : "unchecked"}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="cursor-pointer border border-primary/50"
                  />
                  <p>Accept</p>
                  <LegalPolicyModal defaultTab="privacy">
                    <p className="text-primary font-bold cursor-pointer">Company Policies</p>
                  </LegalPolicyModal>
                </div>
              )}
            />
          </div>
          <FieldError>
            {errors.user?.companyPolicyAccepted?.message}
          </FieldError>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row justify-between items-center pt-18">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-max text-primary border border-primary hover:bg-primary/10 bg-transparent px-8"
        >
          Previous Step
        </Button>
        <Button
          type="submit"
          disabled={!isValid || isPending}
          className="w-full sm:w-max bg-primary hover:bg-[#005999] text-white px-8"
        >
          {isPending ? <Loader2 className="animate-spin" /> : ""}
          Finish Registration
        </Button>

      </div>
    </div>
  )
}
