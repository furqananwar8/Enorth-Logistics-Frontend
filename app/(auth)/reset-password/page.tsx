"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import FormField from "@/components/common/form/fields/FormField";
import { Loader } from "@/components/common/Loader";
import { AuthLayout } from "../AuthLayout";

import { useOTPFlow } from "@/context/otp.context";
import {
    resetPasswordSchema,
    ResetPasswordValues,
} from "@/lib/validations/auth/reset-password-schema";
import { resetPassword } from "@/api/services/auth.api";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token, email } = useOTPFlow(); // use OTP context
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            resetToken: token || "",
        },
    });
    // Populate form with context values when available
    useEffect(() => {
        if (token && email) {
            form.reset({
                email,
                password: "",
                confirmPassword: "",
                resetToken: token,
            });
        }

        const t = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(t);
    }, [token, email, form.reset]);

    const resetMutation = useMutation({
        mutationFn: (data: any) => resetPassword(data),
        onSuccess: () => {
            toast("Password Reset Successful", {
                description: "You can now login with your new password.",
            });
            router.push("/login");
        },
        onError: (error: any) => {
            toast("Reset Failed", {
                description: error?.response?.data?.message || "Reset link may be expired.",
            });
        },
    });

    const onSubmit = (data: ResetPasswordValues) => {
        const payload = {
            email: email,
            password: data.password,
            resetToken: token,
        };
        resetMutation.mutate(payload);
    };

    if (isLoading) return <Loader className="min-h-screen" />;

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter a new password for your account."
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        field={{
                            name: "password",
                            label: "New Password*",
                            placeholder: "Enter new password",
                            type: "password",
                        }}
                    />
                    <FormField
                        field={{
                            name: "confirmPassword",
                            label: "Confirm Password*",
                            placeholder: "Confirm your password",
                            type: "password",
                        }}
                    />
                    <Button disabled={resetMutation.isPending || !form.formState.isValid} type="submit" className="w-full">
                        Reset Password
                    </Button>
                </form>
            </FormProvider>
            <div className="mt-6 text-sm text-center">
                <Link href="/login" className="text-primary hover:underline font-medium">
                    Back to Login
                </Link>
            </div>
        </AuthLayout>
    );
}