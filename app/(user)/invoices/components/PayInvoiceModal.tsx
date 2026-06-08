"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  CreditCard,
  Info,
  Plus,
  CheckCircle2,
  Loader2,
  LoaderCircle,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCards } from "@/api/services/payment.api";
import { cn } from "@/lib/utils";
import { payInvoice } from "@/api/services/invoices.api";
import { toast } from "sonner";

interface PayInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  currency: string;
  invoiceId: string;
}

export function PayInvoiceModal({
  open,
  onOpenChange,
  amount,
  currency,
  invoiceId,
}: PayInvoiceModalProps) {
  const { data: userData, isLoading: isLoadingUser } = useUser();
  const { data: cards, isLoading: isLoadingCards } = useQuery({
    queryKey: ["cards"],
    queryFn: () => getCards(),
    enabled: open,
  });

  const balance = userData?.user?.company?.wallet?.balance || 0;
  const primaryCard = cards?.[0]; // Assuming the first card is the primary for now

  const canPayWithBalance = balance >= amount;
  const payInvoiceMutation = useMutation({
    mutationFn: () => payInvoice(Number(invoiceId)),
    onSuccess: () => {
      toast("Invoice Paid!");
      onOpenChange(false)
      
    },
    onError: () => {
      toast("Unable to pay invoice");
    },
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <div className="bg-primary p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              Pay Invoice #{invoiceId}
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Select your preferred payment method below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col items-center">
            <span className="text-sm font-medium text-blue-100 uppercase tracking-widest">
              Amount Due
            </span>
            <div className="text-4xl font-black mt-1">
              ${amount.toFixed(2)}{" "}
              <span className="text-lg font-bold opacity-80">{currency}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {/* Payment Option: Wallet Balance */}
          <div
            className={cn(
              "group relative border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer",
              canPayWithBalance
                ? "border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"
                : "opacity-60 cursor-not-allowed border-slate-100 bg-slate-50",
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
                  canPayWithBalance
                    ? "bg-green-50 text-green-600"
                    : "bg-slate-200 text-slate-400",
                )}
              >
                <Wallet className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">
                    Enorth Wallet Balance
                  </h4>
                  {canPayWithBalance && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Current Balance:{" "}
                  <span className="font-bold text-slate-900">
                    ${balance.toFixed(2)} {currency}
                  </span>
                </p>
                {!canPayWithBalance && !isLoadingUser && (
                  <p className="text-[10px] text-red-500 font-bold uppercase mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Insufficient funds
                  </p>
                )}
              </div>
            </div>
            {canPayWithBalance && (
              <Button
                onClick={() => payInvoiceMutation.mutate()}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold h-10 shadow-md shadow-green-100"
              >
                {payInvoiceMutation.isPending ? (
                  <LoaderCircle className="animate-spin mr-2" size={16} />
                ) : (
                  ""
                )}
                Pay with Balance
              </Button>
            )}
          </div>

          {/* <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">
                OR
              </span>
            </div>
          </div> */}

          {/* Payment Option: Credit Card */}
          {/* <div className="border-2 border-slate-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-slate-800">Saved Credit Card</h4>
                                    <Plus className="w-4 h-4 text-blue-600 cursor-pointer hover:scale-110 transition-transform" />
                                </div>
                                {isLoadingCards ? (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                                        <span className="text-xs text-slate-400">Loading cards...</span>
                                    </div>
                                ) : primaryCard ? (
                                    <div className="mt-2 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-mono text-slate-600">**** **** **** {primaryCard.last4}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{primaryCard.brand} Card</p>
                                        </div>
                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">PRIMARY</span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 mt-2 italic">No cards on file</p>
                                )}
                            </div>
                        </div>
                        <Button className="w-full mt-4 bg-primary hover:bg-[#005999] text-white font-bold h-10 shadow-md shadow-blue-100">
                            {primaryCard ? 'Pay with Card' : 'Add Card & Pay'}
                        </Button>
                    </div> */}

          <div className="pt-2 text-center">
            <p className="text-[10px] text-slate-400 leading-relaxed px-4">
              By clicking pay, you authorize ENorth Logistics to charge your
              selected payment method for the full amount of{" "}
              <span className="font-bold">${amount.toFixed(2)}</span>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
