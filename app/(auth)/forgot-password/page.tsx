"use client"

import { useState, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import FormField from "@/components/common/form/fields/FormField"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/common/Loader"
import { AuthLayout } from "../AuthLayout"
import { forgotPasswordSchema, ForgotPasswordValues } from "@/lib/validations/auth/forgot-password-schema"
import { forgotPassword } from "@/api/services/auth.api"
import { useOTPFlow } from "@/context/otp.context"
import { AxiosError } from "axios"
import { ApiError } from "next/dist/server/api-utils"

export default function ForgotPasswordPage() {
    const { setFlow } = useOTPFlow()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => { setTimeout(() => setIsLoading(false), 300) }, [])

    const forgotMutation = useMutation({
        mutationFn: (data: ForgotPasswordValues) => forgotPassword(data),
        onSuccess: () => {
            toast("Email Sent", { description: "An OTP has been sent to your email." })
            router.push("/otp-verification")
        },
        onError: (error: AxiosError<ApiError>) => {
            toast("Request Failed", { description: error?.response?.data?.message })
        },
    })

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" }
    })
    const { register, handleSubmit, formState: { errors } } = form

    const onSubmit = (data: ForgotPasswordValues) => {
        setFlow(data.email, "password_reset")
        forgotMutation.mutate(data)
    }

    if (isLoading) return <Loader className="min-h-screen" />

    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="Enter your email and we will send you a password reset link."
            
            footerText={
                <>
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        Create an account
                    </Link>
                </>
            }
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        field={{
                            name: "email",
                            label: "Email*",
                            placeholder: "Enter your email",
                            type: "email",
                        }}
                    />
                    <Button disabled={forgotMutation.isPending || Object.keys(errors).length > 0} type="submit" className="w-full">
                        Send Reset OTP
                    </Button>
                </form>
            </FormProvider>

            <div className="mt-6 text-sm text-center">
                <Link href="/login" className="text-primary hover:underline font-medium">
                    Back to Login
                </Link>
            </div>
        </AuthLayout>
    )
}