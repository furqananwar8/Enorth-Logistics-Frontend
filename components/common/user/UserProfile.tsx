import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  DollarSign,
  FileQuestionMark,
  Info,
  LogOut,
  Menu,
  Settings,
  User,
  UserRound,
} from "lucide-react";
import { navItems } from "@/lib/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { UserProfileSkeleton } from "./UserProfileSkeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogoutMutation } from "@/hooks/useLogout";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { AccountBalanceModal } from "./AccountBalanceModal";
import Image from "next/image";
import { useAuth } from "@/context/auth.context";

export default function UserProfile() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: user, isLoading, error } = useUser();
  const logoutMutation = useLogoutMutation({
    onSuccess: () => toast.success("User logged out successfully"),
    onError: (error: AxiosError<ApiError>) =>
      toast.error(error?.response?.data?.message),
  });
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const { isAdmin } = useAuth();
  return (
    <>
      {isLoading ? (
        <UserProfileSkeleton />
      ) : (
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">
              Welcome, {user?.user?.firstName} {user?.user?.lastName}
            </p>
            {user?.user?.role.name !== "superAdmin" && (
              <p className="text-xs dark:text-white text-primary">
                Available Credit: ${user?.user?.company?.wallet?.balance}
              </p>
            )}
          </div>

          {/* USER MENU */}
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger>
              <div className="cursor-pointer">
                {user?.user?.profilePic ? (
                  <Image
                    src={`${BASE_URL}${user?.user?.profilePic}`}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover h-10 w-10 rounded-full border focus-visible:outline-none"
                    unoptimized
                  />
                ) : (
                  <Avatar className="h-10 w-10 focus-visible:outline-none">
                    <AvatarFallback>
                      {user?.user?.firstName?.charAt(0)}
                      {user?.user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-full" align="end">
              {/* account balance */}
              {user?.user?.role.name === "superAdmin" && (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleNavigate("/settings")}
                  >
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </>
              )}
              {user?.user?.role.name !== "superAdmin" && (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <div
                      className="flex items-center gap-2"
                      onClick={() => setModalOpen(true)}
                    >
                      <DollarSign />
                      Account Balance
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleNavigate("/settings")}
                  >
                    <Settings />
                    Settings
                  </DropdownMenuItem>

                  {/* <DropdownMenuItem className="cursor-pointer">
                    <CreditCard />
                    <Link href="/billing">Billing</Link>
                  </DropdownMenuItem> */}

                  <DropdownMenuItem className="cursor-pointer">
                    <Info />
                    <Link href="/">FAQs and resources</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <AccountBalanceModal open={modalOpen} onOpenChange={setModalOpen} />

          {/* MOBILE MENU */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu size={22} />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[280px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible>
                  {navItems.map((item) => (
                    <div key={item.title}>
                      {!item.items ? (
                        <Link
                          href={item.href!}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block p-4 text-sm font-medium"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <AccordionItem value={item.title}>
                          <AccordionTrigger className="px-4">
                            {item.title}
                          </AccordionTrigger>

                          <AccordionContent>
                            <div className="flex flex-col gap-2 pl-2">
                              {item.items.map((sub) => (
                                <Link
                                  key={sub.title}
                                  href={sub.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="text-sm px-4 text-muted-foreground hover:text-black"
                                >
                                  {sub.title}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </div>
                  ))}
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
}
