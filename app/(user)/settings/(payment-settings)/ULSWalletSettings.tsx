"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  CreditCard,
  Plus,
  Download,
  Upload,
  Info,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import {
  TopupFormValues,
  ulswalletSettingsSchema,
  type ULSWalletSettingsValues,
} from "./ULSWalletSettings.schema";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import AddCardModal from "./AddCardModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIntent,
  getCards,
  topupWallet,
} from "@/api/services/payment.api";
import { Loader } from "@/components/common/Loader";
import { useAuth } from "@/context/auth.context";
import TopupModal from "./TopupModal";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";

const MOCK_BALANCES = {
  accountLimit: 3000.0,
  availableBalance: 343.71,
  invoicedCharges: 528.35,
  pendingCharges: 2127.94,
};

const MOCK_CARDS = [{ id: "1", brand: "VISA", last4: "9472", isPrimary: true }];

export default function ULSWalletSettings() {
  // get user
  const { user } = useAuth();

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const methods = useForm<ULSWalletSettingsValues>({
    // @ts-ignore
    resolver: zodResolver(ulswalletSettingsSchema),
    defaultValues: {
      primaryCard: "1",
      notifyExpiry: true,
      email: "",
    },
  });

  const onSubmit = (data: ULSWalletSettingsValues) => {
    // console.log("Saving wallet settings:", data);
  };

  // get cards
  const {
    data: cards,
    isLoading: isLoadingCards,
    isError: isErrorCards,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: () => getCards(),
  });

  // console.log("Cards:", cards)

  const fields = [
    {
      name: "primaryCard",
      label: "Select Primary Card :",
      type: "select",
      options: cards?.map((card: any) => ({
        label: `${card.brand} (Ending in ${card.last4} )`,
        value: card.id,
      })),
      // defaultValue: cards[0]?.id || "",
      wrapperClassName: "w-full md:w-1/2",
      optionClassName: "capitalize",
    },
    {
      type: "non-input",
      show: true,
      children: (
        <div className="flex items-start gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-md my-4">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            Please note that your primary card will be your default card when
            booking shipments on all Freightcom systems, including the previous
            version of Freightcom system.
          </p>
        </div>
      ),
    },
    {
      name: "notifyExpiry",
      label: "Notify me when my cards are close to expiry",
      type: "checkbox",
      wrapperClassName: "flex items-center gap-2 my-4",
    },
    {
      name: "email",
      label: "Email Address",
      type: "text",
      placeholder: "",
      wrapperClassName: "w-full md:w-1/2 mt-4",
    },
  ];
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  const handleTopupSubmit = (data: TopupFormValues) => {
    if (cards && cards.length > 0) {
      charge({
        amount: data.amount, // Convert to cents if needed, depends on backend
        currency: data.currency.toLowerCase(),
        cardId: cards[0].id, // Using the first card as a fallback
      });
    } else {
      console.error("No card available for top up");
    }
  };
  const [clientSecret, setClientSecret] = useState("");

  // create payment intent mutation
  const {
    mutate: createPaymentIntent,
    isPending: isPendingPaymentIntent,
    data: paymentIntent,
  } = useMutation({
    mutationFn: () => createIntent(user.user.stripeCustomerId!),
    retry: 1,
    onSuccess: (data) => {
      // console.log("Payment intent created");
      setClientSecret(data.clientSecret);
    },
    onError: () => {
      console.error("Failed to create payment intent");
    },
  });

  // get query client
  const queryClient = useQueryClient();
  const {
    mutate: charge,
    isPending: isPendingCharge,
    isSuccess: isTopupSuccess,
    data: chargeData,
  } = useMutation({
    mutationFn: (payload: any) => topupWallet(payload),
    retry: 1,
    onSuccess: () => {
      // console.log("Payment intent created");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // setClientSecret()
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });

  // console.log(user.user)
  const handleAddCard = () => {
    setIsAddCardModalOpen(true);
  };
  if (isPendingPaymentIntent || isLoadingCards) {
    return <Loader />;
  }

  // charge(chargePayload)

  console.log(
    "Last Card:",
    user?.user?.company?.savedCards[user?.user?.company?.savedCards.length - 1],
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xl font-semibold mb-6">
        <Wallet className="text-primary" />
        <h2>Freightcom Wallet</h2>
      </div>

      <Separator />

      {/* Account Balances Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-blue-900">Account Balances</h3>
          {/* <Button variant="link" className="text-primary flex items-center gap-1 p-0">
            <Download size={16} />
            Download New Credit Application
          </Button> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Account Limit:</p>
            <p className="font-bold">${3000}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Available Balance:</p>
            <p className="flex font-bold">
              {isPendingCharge ? (
                <LoaderCircle className="animate-spin mr-2" size={16} />
              ) : (
                ""
              )}
              ${user?.user?.company?.wallet?.balance || 0}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Invoiced Charges:</p>
            <p className="font-bold text-primary">${0}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pending Charges:</p>
            <p className="font-bold">${0}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" className="text-primary border-primary">
            Upload New Application
          </Button> */}
          <TopupModal
            open={isTopupModalOpen}
            onOpenChange={setIsTopupModalOpen}
            onSubmit={handleTopupSubmit}
            isPending={isPendingCharge}
            isSuccess={isTopupSuccess}
          />
        </div>
      </section>

      <Separator />

      {/* Credit Cards Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-blue-900">Credit Cards on File</h3>
          <Button
            variant="link"
            className="text-primary flex items-center gap-1 p-0"
            onClick={handleAddCard}
          >
            <Plus size={16} />
            Add New Card
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Primary Card Card */}
          {cards && cards.length > 0 ? (
            <div className="w-full md:w-72">
              {/* <div className="flex items-center gap-2 text-xs text-green-600 font-semibold mb-2">
              <CheckCircle2 size={14} />
              Primary Card
            </div> */}
              <div className="border-2 border-primary bg-blue-50 dark:bg-primary/10 rounded-lg p-4 relative overflow-hidden">
                {/* <div className="font-bold text-slate-700 text-sm mb-4">ENorth Logistics CARD</div> */}
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-italic text-primary dark:text-white font-bold italic capitalize">
                    {user?.user?.company?.savedCards[0]?.brand}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground uppercase">
                      Card Number
                    </div>
                    <div className="text-sm font-mono">
                      **** **** **** {user?.user?.company?.savedCards[0]?.last4}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* Add New Card Placeholder */}
          <div
            className="w-full md:w-64 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-4 hover:border-primary transition-colors cursor-pointer text-primary"
            onClick={handleAddCard}
          >
            <Plus size={24} />
            <span className="text-sm font-semibold mt-2">Add New Card</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-50 bg-blue-50 dark:bg-primary/10 border border-blue-100 p-3 rounded-md">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            If you would like to switch to a{" "}
            <span className="font-bold text-slate-800 dark:text-white">
              Credit Card account
            </span>{" "}
            (and no longer use your{" "}
            <span className="font-bold text-slate-800 dark:text-white">
              Account Balance
            </span>
            ), please select “Change Account Type”
          </p>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
          Change Account Type
        </Button>
      </section>

      <Separator />

      {/* Form Section */}
      {/* <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <GlobalForm
            fields={fields}
            extra={
              <Button
                type="button"
                onClick={() => methods.trigger("email")}
                className="bg-primary hover:bg-primary/90 text-white font-semibold mt-2"
              >
                Add Email
              </Button>
            }
          />
        </form>
      </FormProvider> */}

      <AddCardModal
        open={isAddCardModalOpen}
        onOpenChange={setIsAddCardModalOpen}
        clientSecret={clientSecret}
      />
    </div>
  );
}
