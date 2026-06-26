"use client";

import { useEffect } from "react";
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
import { DollarSign } from "lucide-react";

import {
  companyRatesSchema,
  type CompanyRatesFormValues,
} from "./CompanyRates.schema";

import { GlobalForm } from "@/components/common/form/GlobalForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCompanyRates } from "@/api/services/auth.api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";

interface AddRatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: {
    ftlAmount?: number;
    ltlAmount?: number;
  };
  companyId: string;
}

export default function AddRatesModal({
  open,
  onOpenChange,
  initialValues,
  companyId,
}: AddRatesModalProps) {
  const methods = useForm<CompanyRatesFormValues>({
    resolver: zodResolver(companyRatesSchema),
    defaultValues: {
      ftlAmount: initialValues?.ftlAmount ?? 0,
      ltlAmount: initialValues?.ltlAmount ?? 0,
    },
  });

  useEffect(() => {
    if (open) {
      methods.reset({
        ftlAmount: initialValues?.ftlAmount ?? 0,
        ltlAmount: initialValues?.ltlAmount ?? 0,
      });
    }
  }, [open, initialValues, methods]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CompanyRatesFormValues) =>
      addCompanyRates(companyId, { payload: data }),
    onSuccess: () => {
      toast.success("Rates updated successfully");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      onOpenChange(false);
      methods.reset();
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to update company rates",
      );
    },
  });

  const handleFormSubmit = (data: CompanyRatesFormValues) => {
    mutation.mutate(data);
  };

  const fields = [
    {
      name: "ftlAmount",
      label: "FTL Amount",
      type: "number",
      placeholder: "Enter FTL amount",
      wrapperClassName: "w-full mb-4",
    },
    {
      name: "ltlAmount",
      label: "LTL Amount",
      type: "number",
      placeholder: "Enter LTL amount",
      wrapperClassName: "w-full mb-4",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Add Rates
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            id="add-rates-form"
            onSubmit={methods.handleSubmit(handleFormSubmit)}
          >
            <GlobalForm fields={fields} />
          </form>
        </FormProvider>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            form="add-rates-form"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Add Rates"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}