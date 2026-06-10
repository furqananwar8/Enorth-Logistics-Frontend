"use client";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Loader } from "@/components/common/Loader";
import { useAuth } from "@/context/auth.context";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const exceptionalRoutes = ["/otp-verification", "/reset-password"];
  const pathname = usePathname();
  const isExceptionalRoute = exceptionalRoutes.includes(pathname);
  const { user, isLoading, isPending } = useAuth();
  if (isLoading || isPending || user === undefined) {
    return <Loader />
  }
  const noHeaderRoutes = ["/invoices/single/pdf"];
  const isNoHeaderRoute = noHeaderRoutes.includes(pathname);

  return (
    (!isExceptionalRoute || user?.user) ?
      <>
        {!isNoHeaderRoute && <Header />}
        {/* <Infobar/> */}
        <main className={`mx-auto container ${!isNoHeaderRoute ? 'pt-20' : ''} flex flex-col min-h-screen ${isNoHeaderRoute ? 'bg-white' : ''}`}>
          {children}
        </main>
        {!isNoHeaderRoute && <Footer />}
      </> :
      <>
        {children}
      </>
  );
}