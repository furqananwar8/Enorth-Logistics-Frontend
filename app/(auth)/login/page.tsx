"use client"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginFormValues } from "@/lib/validations/auth/login-schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginUser, getUser } from "@/api/services/auth.api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { AxiosError } from "axios"
import { ApiError } from "next/dist/server/api-utils"
import { useEffect, useState } from "react"
import { Loader } from "@/components/common/Loader"
import Link from "next/link"
import { AuthLayout } from "../AuthLayout"
import { GlobalForm } from "@/components/common/form/GlobalForm"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(true)

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => loginUser(data),
    onSuccess: async (data) => {
      toast("Login Successful", { description: "Welcome back! You are now logged in." })
      try {
        await queryClient.fetchQuery({ queryKey: ["user"], queryFn: getUser })
      } catch { }
      setTimeout(() => router.push("/"), 300)

    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Unexpected error occurred")
    },
  })

  useEffect(() => {

    setTimeout(() => setIsLoading(false), 300)
  }
    , [])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false }
  })
  const { register, handleSubmit, formState: { errors } } = form

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate(data)

  if (isLoading) return <Loader className="min-h-screen" />

  return (
    <AuthLayout
      title="To access your ENorth Logistics account, sign in below."
      // leftImage="/login-bg-new.webp"
      footerText={
        <>
          Don't have an account?{" "}
          <Link href="/register" className="text-primary dark:text-accent hover:underline font-medium">
            Create an account
          </Link>
        </>
      }
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <GlobalForm
            formWrapperClassName="space-y-5"
            fields={[
              {
                name: "email",
                label: "Email*",
                placeholder: "Enter your email",
                type: "text",
              },
              {
                name: "password",
                label: "Password*",
                placeholder: "Enter your password",
                type: "password",
              },
              {
                name: "rememberMe",
                label: "Remember me",
                type: "checkbox",
              },
            ]}
          />
          <div className="my-6 flex items-center justify-end">
            <Link href="/forgot-password" className="text-sm text-primary dark:text-accent hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" variant="default" className="w-full">
            {loginMutation.isPending ? <Loader2 className="animate-spin" /> : "Start Shipping!"}
          </Button>
        </form>
      </FormProvider>
    </AuthLayout>
  )
}