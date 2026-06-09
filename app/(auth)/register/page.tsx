"use client"

import * as React from "react"
import Link from "next/link"
import { Package2, ArrowRight } from "lucide-react"

import { LanguageToggle } from "@/components/language-toggle"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// We will split forms into separate components
import { Step1Form } from "./step-1-form"
import { Step2Form } from "./step-2-form"
import { Step3Form } from "./step-3-form"
import Image from "next/image"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterSchemaTypes } from "@/lib/validations/auth/register-schema"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "@/api/services/auth.api"
import { toast } from "sonner"
import { sendEmailVerificationOTP } from "@/api/services/otp.api"
import { OtpFormValues } from "@/lib/validations/auth/otp-verification-schema"
import { useRouter } from "next/navigation"
import { useOTPFlow } from "@/context/otp.context"
// import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser"
import { Loader } from "@/components/common/Loader"
import { AxiosError } from "axios"
import { ApiError } from "next/dist/server/api-utils"
import { useTheme } from "next-themes"
export default function RegisterPage() {

  // const { data, isLoading } = useUser();

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = React.useState(1)
  const { setFlow } = useOTPFlow()

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(t)
  }, [])
  const form = useForm<RegisterSchemaTypes>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",

    defaultValues: {
      shippingPreference: [],
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        freightBroker: false
      },
      company: {
        name: "",
        industryType: ""
      },
      address: {
        address1: "",
        address2: "",
        city: "",
        unit: "",
        state: "",
        country: "",
        postalCode: ""
      }
    }
  })
  const handleNext = () => setStep((s) => Math.min(s + 1, 3))
  const handleBack = () => setStep((s) => Math.max(s - 1, 1))
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast("User registered successfully", {
        description: "User registered. Please verify your email",
      })
      router.push(`/otp-verification`)
    },
    onError: (error: AxiosError<ApiError>) => {
      toast(error.response?.data?.message)
    },
  })
  const onSubmit = (data: RegisterSchemaTypes) => {
    setFlow(data.user.email, "email_verification")
    registerMutation.mutate(data)
  }


  if (isLoading) return <Loader className="min-h-screen" />
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Banner */}
      <div className="w-full py-2 flex justify-center items-center bg-gray-50 dark:bg-muted/50 border-b border-border text-sm">
        <span className="text-muted-foreground mr-1 flex items-center gap-1">
          <ArrowRight className="h-4 w-4 text-primary" />
          Already have a ENorth Logistics account?
        </span>
        <Link href="/login" className="text-primary hover:underline font-medium">
          Login here!
        </Link>
      </div>

      <div className="flex-1 w-full lg:grid lg:grid-cols-2">
        {/* Left Column - Dynamic Content */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-[#103b5f] text-white p-12">
          {step === 1 && (
            <div className="max-w-md text-center">
              <h1 className="text-3xl font-bold mb-8">You are on your way to...</h1>
              {/* Mockup graphic for step 1 */}
              <div className="bg-white rounded-lg p-6 shadow-xl relative mt-4">
                <div className="flex gap-1 mb-4">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
                <h3 className="text-slate-800 font-bold text-left mb-6">Extensive Offerings</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Logos placeholder */}
                  <div className="h-8 bg-slate-100 rounded"></div>
                  <div className="h-8 bg-slate-100 rounded"></div>
                  <div className="h-8 bg-slate-100 rounded"></div>
                  <div className="h-8 bg-slate-100 rounded"></div>
                </div>
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#e9a169] rotate-12 rounded shadow-lg flex items-center justify-center">
                  <Package2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="max-w-md">
              <h1 className="text-3xl font-bold mb-8 text-center">You are on your way to...</h1>
              <div className="bg-white text-slate-800 rounded-lg p-8 shadow-xl relative mt-4">
                <h3 className="text-xl font-bold text-center mb-4 text-[#103b5f]">Better Customer Service</h3>
                <div className="h-40 bg-slate-200 rounded mb-4 w-full object-cover"></div>
                <p className="italic text-sm text-[#103b5f] font-medium leading-relaxed">
                  "We have had nothing but great experiences... The whole shipping process on the platform is simple and quick!"
                </p>
                <p className="text-xs text-slate-500 mt-4">- Customer Testimonial</p>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="max-w-md text-center">
              <h1 className="text-3xl font-bold mb-8">Almost Done!</h1>
              <div className="bg-white text-slate-800 rounded-lg p-8 shadow-xl">
                <Package2 className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold text-[#103b5f]">Set up your account access</h3>
                <p className="text-sm mt-2 text-slate-500">Just a few final details to secure your new shipper account.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Form */}
        <div className="flex flex-col p-6 sm:p-12 h-[calc(100vh-40px)] overflow-y-auto">
          <div className="mx-auto w-full max-w-[500px] flex flex-col min-h-full">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                <Image loading="eager" src={theme === "dark" ? "/enorth-logo-dark.svg" : "/enorth-logo.svg"} alt="ENorth Logistics" width={200} height={200} />
              </Link>
              <div className="flex items-center gap-2">
                {/* <LanguageToggle /> */}
                <ModeToggle />
              </div>
            </div>

            {/* Intro Text & Progress */}
            <div className="mb-8">
              <h2 className="text-base font-medium text-foreground mb-6">
                {step === 1 && "Let us get to know you better, so we can customize your shipping solution."}
                {step === 2 && "Almost there - just need a few more details about your business!"}
                {step === 3 && "Final step: Secure your account login details."}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Step {step} of 3</span>
                </div>
                <Progress value={(step / 3) * 100} className="h-2" />
              </div>
            </div>

            {/* Form Container */}
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(
                onSubmit
              )} className="flex-1">
                {step === 1 && <Step1Form onNext={handleNext} />}
                {step === 2 && <Step2Form onNext={handleNext} onBack={handleBack} />}
                {step === 3 && <Step3Form onBack={handleBack} isPending={registerMutation.isPending} />}
              </form>
            </FormProvider>

          </div>
        </div>
      </div>
    </div>
  )
}
