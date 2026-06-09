"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, MoveDown } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { navItems, superAdminNavItems } from "@/lib/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import UserProfile from "./user/UserProfile";
// import { DropdownMenu } from "radix-ui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LanguageToggle } from "../language-toggle";
import { ModeToggle } from "../mode-toggle";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/context/auth.context";
import { useEffect, useState } from "react";
import { User } from "@/app/(user)/settings/(user-preference)/UserTable";
import { Loader } from "./Loader";
import NotificationsWidget from "@/app/(user)/home/NotificationsWidget";
import { useTheme } from "next-themes";

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  const userPermissions = user?.user?.permissions.map(
    (permission: Record<string, any>) => permission.name,
  );
  const { theme } = useTheme();
  return (
    <header className="w-full  fixed bg-white/10 backdrop-blur-md border-b border-b-black/20 dark:border-b-white/20 z-10">
      <div className="flex h-20 container mx-auto items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link href={user.user.role.name === "superAdmin" ? "/track" : "/"}>
            <Image
              src={theme === "dark" ? "/enorth-logo-dark.svg" : "/enorth-logo.svg"}
              alt="logo"
              width={200}
              height={200}
              unoptimized
              className="focus-visible:outline-none"
            />
          </Link>

          {/* DESKTOP NAV */}
          {/*  */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {user?.user?.role.name !== "superAdmin" &&
                navItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {!item.items ? (
                      <Button variant="link" asChild>
                        <Link
                          href={item.href!}
                          className={`px-3 py-2 text-black dark:text-white text-sm rounded-md w-max ${
                            pathname === item.href
                              ? " font-medium"
                              : "hover:bg-gray-50 dark:hover:text-black!"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </Button>
                    ) : (
                      <DropdownMenu>
                        {user.user.role.name.includes("admin") ? (
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="link"
                              className="hover:no-underline text-black dark:text-white"
                            >
                              {item.title}
                              <ChevronDown className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        ) : (
                          <DropdownMenuTrigger asChild>
                            {item.title === "Shipment" ? (
                              userPermissions.includes("shipping") ? (
                                <button className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 dark:hover:text-black">
                                  {item.title}
                                  <ChevronDown className="size-4" />
                                </button>
                              ) : (
                                ""
                              )
                            ) : item.title === "Invoices" ? (
                              userPermissions.includes("invoicing") ? (
                                <button className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 dark:hover:text-black">
                                  {item.title}
                                  <ChevronDown className="size-4" />
                                </button>
                              ) : (
                                ""
                              )
                            ) : item.title === "Claims" ? (
                              userPermissions.includes("claims") ? (
                                <button className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 dark:hover:text-black">
                                  {item.title}
                                  <ChevronDown className="size-4" />
                                </button>
                              ) : (
                                ""
                              )
                            ) : (
                              <button className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 dark:hover:text-black">
                                {item.title}
                                <ChevronDown className="size-4" />
                              </button>
                            )}
                          </DropdownMenuTrigger>
                        )}

                        <DropdownMenuContent align="start" className="w-max">
                          {item.items.map((sub) => (
                            <DropdownMenuItem key={sub.title} asChild>
                              <Link href={sub.href} className="cursor-pointer ">
                                {sub.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </NavigationMenuItem>
                ))}
              {user?.user?.role.name === "superAdmin" &&
                superAdminNavItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <Button
                      variant="link"
                      className="hover:no-underline text-black dark:text-white"
                    >
                      <Link href={item.href} className="cursor-pointer ">
                        {item.title}
                      </Link>
                      <ChevronDown className="size-4" />
                    </Button>
                  </NavigationMenuItem>
                ))}
              
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* <p>User Role : {currentUser.role.id}</p> */}
        {/* RIGHT SIDE */}
        <div className="flex items-center gap-8">
          <div className="flex gap-2">
            {/* <LanguageToggle /> */}
            <NotificationsWidget />
            <ModeToggle />
          </div>
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
