"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Info, X } from "lucide-react";
import {
  addCardSchema,
  type AddCardFormValues,
} from "./ULSWalletSettings.schema";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import { toast } from "sonner";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddCardForm from "./AddCardForm";
import { Loader } from "@/components/common/Loader";

interface AddCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientSecret: string;
}

export default function AddCardModal({
  open,
  onOpenChange,
  clientSecret,
}: AddCardModalProps) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  );
  const methods = useForm<AddCardFormValues>({
    resolver: zodResolver(addCardSchema),
    defaultValues: {
      nickname: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (data: AddCardFormValues) => {
    // console.log("Adding card:", data);
    toast.success("Card added successfully (Mock)");
    onOpenChange(false);
    methods.reset();
  };

  const fields = [
    {
      name: "nickname",
      label: "Nickname for Card (optional)",
      type: "text",
      placeholder: "",
      wrapperClassName: "w-full mb-4",
    },
    {
      name: "cardNumber",
      label: "Credit Card Number*",
      type: "text",
      placeholder: "0000 0000 0000 0000",
      wrapperClassName: "w-full mb-4",
      // Note: In a real app, I'd add card brand detection and logos here
    },
    {
      type: "non-input",
      show: true,
      children: (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Expiry Month/Year*</label>
            <input
              {...methods.register("expiryDate")}
              placeholder="00 / 00"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {methods.formState.errors.expiryDate && (
              <p className="text-xs text-red-500">
                {methods.formState.errors.expiryDate.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CVV Code*</label>
            <input
              {...methods.register("cvv")}
              placeholder="000"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {methods.formState.errors.cvv && (
              <p className="text-xs text-red-500">
                {methods.formState.errors.cvv.message}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      type: "non-input",
      show: true,
      children: (
        <div className="flex items-start gap-2 text-xs text-blue-600 bg-blue-50 p-3 rounded-md mb-4 border border-blue-100">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>
            Please note that once you have added a credit card, you may receive
            additional charges (such as a Residential Delivery charge) on the
            card the shipment was booked on, even after removing the credit card
            from your account.
          </p>
        </div>
      ),
    },
    {
      name: "acceptTerms",
      label: "",
      type: "non-input",
      show: true,
      children: (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="acceptTerms"
            {...methods.register("acceptTerms")}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="acceptTerms"
            className="text-sm text-muted-foreground"
          >
            I have read and accepted the{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>
          </label>
        </div>
      ),
    },
  ];
  if (!stripePromise) {
    return <Loader />;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="h-5 w-5" />
            Add New Credit Card
          </DialogTitle>
        </DialogHeader>
        <AddCardForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
