"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/services/auth.api";
import GeneralSettings from "./GeneralSettings";
import UserPreferences from "./(user-preference)/UserPreferences";
import EmailNotification from "./(email-notifications)/EmailNotification";
import { AddressBookTab } from "./(address-book)/AddressBookTab";
import ShippingPreferences from "./(shipping-preferences)/ShippingPreferences";

import {
  BellDot,
  CircleUserRound,
  Code,
  CreditCard,
  Settings2,
  User,
  UserCog,
  UserRoundCog,
  Truck,
  BookUser,
  PackageOpen,
  ShoppingBasket,
  FileStack,
} from "lucide-react";
import { MyPackages } from "../packages/MyPackages";
import ULSWalletSettings from "./(payment-settings)/ULSWalletSettings";
import { Wallet, Landmark, ReceiptText } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function Settings() {
  const { data: user, isLoading, error } = useUser();
  // get active tab from params
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  // console.log("user", user)

  const settings =
    user.user.role.name === "superAdmin"
      ? [
          {
            title: "Account Settings",
            value: "account",
            icon: <CircleUserRound />,
          },
        ]
      : [
          {
            title: "Account Settings",
            value: "account",
            icon: <CircleUserRound />,
          },
          {
            title: "Shipment Settings",
            value: "shipment",
            icon: <UserRoundCog />,
          },
          {
            title: "Payment Settings",
            value: "payment",
            icon: <CreditCard />,
          },
          {
            title: "API Settings",
            value: "api",
            icon: <Code />,
          },
        ];

  const accountSettings =
    user.user.role.name === "superAdmin"
      ? [
          {
            title: "User Preferences",
            value: "user-preference",
            icon: <Settings />,
          },
        ]
      : [
          {
            title: "General Settings",
            value: "general-settings",
            icon: <UserRoundCog />,
          },
          {
            title: "User Preferences",
            value: "user-preference",
            icon: <Settings />,
          },
          {
            title: "Email Notifications",
            value: "email-notification",
            icon: <BellDot />,
          },
        ];

  return (
    <div className="p-4 md:p-8 w-full mx-auto">
      <Tabs defaultValue={activeTab || "account"} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          {settings.map((setting) => (
            <TabsTrigger
              key={setting.value}
              value={setting.value}
              className="cursor-pointer p-4! data-[state=active]:text-primary data-[state=active]:bg-primary/10  data-[state=active]:border-primary border"
            >
              {setting.icon} {setting.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="account">
          <Tabs
            defaultValue="general-settings"
            orientation="vertical"
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <TabsList className="h-max w-full gap-4 bg-transparent">
                  {accountSettings.map((setting) => (
                    <TabsTrigger
                      key={setting.value}
                      value={setting.value}
                      className="w-max  cursor-pointer p-2 data-[state=active]:text-primary data-[state=active]:bg-primary/10  data-[state=active]:border-primary border"
                    >
                      {setting.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardContent>
            </Card>
            <Card className="px-6 lg:col-span-3">
              <TabsContent value="general-settings">
                <GeneralSettings />
              </TabsContent>
              <TabsContent value="user-preference">
                <UserPreferences />
              </TabsContent>
              <TabsContent value="email-notification">
                <EmailNotification />
              </TabsContent>
            </Card>
          </Tabs>
        </TabsContent>

        <TabsContent value="shipment">
          <Tabs
            defaultValue="general-settings"
            orientation="vertical"
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Shipment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <TabsList className="h-max w-full gap-4 bg-transparent">
                  {[
                    {
                      title: "Shipping Preferences",
                      value: "shipping-preferences",
                      icon: <Settings2 />,
                    },
                    {
                      title: "Carrier Preferences",
                      value: "carrier-preferences",
                      icon: <Truck />,
                    },
                    {
                      title: "Address Book",
                      value: "address-book",
                      icon: <BookUser />,
                    },
                    {
                      title: "My Package & Pallets",
                      value: "my-packages",
                      icon: <PackageOpen />,
                    },
                    {
                      title: "My Products",
                      value: "my-products",
                      icon: <ShoppingBasket />,
                    },
                    {
                      title: "Request Shipping Supplies",
                      value: "request-shipping-supplies",
                      icon: <FileStack />,
                    },
                  ].map((subTab) => (
                    <TabsTrigger
                      key={subTab.value}
                      value={subTab.value}
                      className="p-2 w-max cursor-pointer data-[state=active]:text-primary data-[state=active]:bg-primary/10  data-[state=active]:border-primary border data-[state=active]:shadow-lg"
                    >
                      {" "}
                      {subTab.icon} {subTab.title}{" "}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardContent>
            </Card>
            <Card className="px-6 lg:col-span-3">
              <TabsContent value="shipping-preferences">
                <ShippingPreferences />
              </TabsContent>
              <TabsContent value="carrier-preferences"></TabsContent>
              <TabsContent value="address-book" className="mt-0 pt-0">
                <AddressBookTab />
              </TabsContent>
              <TabsContent value="my-packages">
                {/* <MyPackages /> */}
                <MyPackages />
              </TabsContent>
            </Card>
          </Tabs>
        </TabsContent>

        <TabsContent value="payment">
          <Tabs
            defaultValue="wallet-settings"
            orientation="vertical"
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <TabsList className="h-max w-full gap-4 bg-transparent">
                  {[
                    {
                      title: "Enorth Wallet",
                      value: "wallet-settings",
                      icon: <Wallet />,
                    },
                    {
                      title: "Billing Preferences",
                      value: "billing-preferences",
                      icon: <Landmark />,
                    },
                    {
                      title: "Invoicing Preferences",
                      value: "invoicing-preferences",
                      icon: <ReceiptText />,
                    },
                  ].map((subTab) => (
                    <TabsTrigger
                      key={subTab.value}
                      value={subTab.value}
                      className="p-2 w-full justify-start cursor-pointer data-[state=active]:text-primary data-[state=active]:bg-primary/10 data-[state=active]:border-primary border data-[state=active]:shadow-lg gap-2"
                    >
                      {subTab.icon}
                      {subTab.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardContent>
            </Card>
            <Card className="px-6 py-6 lg:col-span-3">
              <TabsContent value="wallet-settings">
                <ULSWalletSettings />
              </TabsContent>
              <TabsContent value="billing-preferences">
                <div className="text-muted-foreground italic">
                  Billing Preferences section is coming soon...
                </div>
              </TabsContent>
              <TabsContent value="invoicing-preferences">
                <div className="text-muted-foreground italic">
                  Invoicing Preferences section is coming soon...
                </div>
              </TabsContent>
            </Card>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
