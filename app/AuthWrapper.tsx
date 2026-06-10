"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader } from "@/components/common/Loader";
import { OTPFlowProvider } from "@/context/otp.context";
import { useAuth } from "@/context/auth.context";
import UserLayout from "./UserLayout";

export default function AuthWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, isPending } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const authRoutes = [
        "/login",
        "/register",
        "/reset-password",
        "/forgot-password",
    ];

    const exceptionalRoutes = [
        "/otp-verification",
        "/reset-password",
    ];

    const isAuthRoute = authRoutes.includes(pathname);
    const isExceptionalRoute =
        exceptionalRoutes.includes(pathname);

    useEffect(() => {
        if (
            !user &&
            !isLoading &&
            !isAuthRoute &&
            !isExceptionalRoute
        ) {
            router.replace("/login");
        }

        if (
            user &&
            !isLoading &&
            isAuthRoute &&
            !isExceptionalRoute
        ) {
            router.replace("/");
        }
    }, [
        user,
        isLoading,
        router,
        pathname,
        isAuthRoute,
        isExceptionalRoute,
    ]);

    if (isLoading || isPending) {
        return <Loader className="min-h-screen" />;
    }

    if (
        !user &&
        !isAuthRoute &&
        !isExceptionalRoute
    ) {
        return <Loader className="min-h-screen" />;
    }

    return (
        <OTPFlowProvider>
            {user ? (
                <UserLayout>{children}</UserLayout>
            ) : (
                children
            )}
        </OTPFlowProvider>
    );
}