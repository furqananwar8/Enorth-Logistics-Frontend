"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { topupSchema, type TopupFormValues } from "./ULSWalletSettings.schema";
import { GlobalForm } from "@/components/common/form/GlobalForm";

interface TopupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TopupFormValues) => void;
  isPending: boolean;
  isSuccess:boolean;
}

export default function TopupModal({ open, onOpenChange, onSubmit, isPending, isSuccess }: TopupModalProps) {
  const methods = useForm<TopupFormValues>({
    resolver: zodResolver(topupSchema),
    defaultValues: {
      amount: 50,
      currency: "usd",
    },
  });

  const handleFormSubmit = (data: TopupFormValues) => {
    onSubmit(data);
    onOpenChange(false);
    methods.reset();
  };

  const fields = [
    {
      name: "amount",
      label: "Amount",
      type: "number",
      placeholder: "Enter amount",
      wrapperClassName: "w-full mb-4",
    },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      options: [
        { label: "USD", value: "usd" },
        { label: "CAD", value: "cad", disabled: true },
      ],
      wrapperClassName: "w-full mb-4",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary border-primary">
          Add Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Top Up Wallet
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleFormSubmit)} id="topup-form">
            <GlobalForm fields={fields} />
          </form>
        </FormProvider>

        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form="topup-form"
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={isPending}
          >
            {isPending ? "Processing..." : "Add Funds"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
