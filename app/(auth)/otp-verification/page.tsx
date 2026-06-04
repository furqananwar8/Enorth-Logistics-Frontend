"use client";

import Image from "next/image"
import Link from "next/link"

import { LanguageToggle } from "@/components/language-toggle"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { otpSchema, OtpFormValues, VerifyOtpFormValues } from "@/lib/validations/auth/otp-verification-schema"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { sendEmailVerificationOTP, verifyEmailOTP } from "@/api/services/otp.api";
import { useUser } from "@/hooks/useUser";
import { Loader } from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOTPFlow } from "@/context/otp.context";
import { useAuth } from "@/context/auth.context";
import { AuthLayout } from "../AuthLayout";
import { LoaderCircle } from "lucide-react";

export default function OTPVerificationPage() {
    const { email, purpose, setToken } = useOTPFlow()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    // // console.log(email, purpose)

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 300)
        return () => clearTimeout(t)
    }, [])
    const verifyMutation = useMutation({
        mutationFn: (data: VerifyOtpFormValues) => verifyEmailOTP(data),
        onSuccess: (data) => {
            if (purpose === "password_reset") {
                toast("OTP Verified", {
                    description: "You're redirecting to reset password.",
                })
                setToken?.(data.resetToken)
                router.push("/reset-password")
            }

            if (purpose === "email_verification") {
                toast("Verification Successful", {
                    description: "Your account has been verified.",
                })
                router.push("/login")
            }
        },
        onError: () => {
            toast("Invalid OTP", {
                description: "Please enter the correct code.",
            })
        }
    })

    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            code: "",
            email: email ?? "",
            purpose: purpose || "email_verification"
        }
    });

    const onSubmit = (data: VerifyOtpFormValues) => {
        verifyMutation.mutate({
            code: data.code,
            email: email ?? "",
            purpose: purpose || "email_verification"
        })
        // console.log(data.code)
    }
    const handleResendOtp = () => {
        sendEmailVerificationOTP({
            email: email ?? "",
            purpose: "email_verification"
        })
        toast("OTP sent successfully", {
            description: "Please check your email for the verification code.",
        })
    }

    if (isLoading) return <Loader className="min-h-screen" />

    return (
        <AuthLayout
            title="OTP Verification"
            subtitle="Enter the OTP sent to your email to continue."
            
            footerText={
                <div className="text-sm text-center">
                    Didn't receive the OTP?{" "}
                    <Button
                        disabled={!email}
                        onClick={handleResendOtp}
                        type="button"
                        className="ml-2"
                    >
                        Resend OTP
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Label htmlFor="code">Verification Code*</Label>
                <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                        <InputOTP
                            maxLength={6}
                            value={field.value || ""}
                            onChange={field.onChange}
                            containerClassName="w-full"
                            size={20}
                            
                        >
                            <InputOTPGroup className="border! border-primary/20!">
                                <InputOTPSlot index={0} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup className="border! border-primary/20!">
                                <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup className="border! border-primary/20!">
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup className="border! border-primary/20!">
                                <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup className="border! border-primary/20!">
                                <InputOTPSlot index={4} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup className="border! border-primary/20!">
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    )}
                />
                <Button
                    disabled={verifyMutation.isPending}
                    type="submit" className="w-full">
                    {verifyMutation.isPending ? <LoaderCircle className="animate-spin mr-2" size={16} /> : ""}
                    Verify Code
                </Button>
            </form>
            <div className="mt-6 text-sm text-center">
                <Link href="/login" className="text-primary hover:underline font-medium">
                    Back to Login
                </Link>
            </div>
        </AuthLayout>
    )
}