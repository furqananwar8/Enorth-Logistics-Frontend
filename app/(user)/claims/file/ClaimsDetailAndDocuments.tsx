"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListTodo, Info, Upload, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlobalForm } from "@/components/common/form/GlobalForm";

const claimDetailsSchema = z.object({
  shipmentStatus: z.enum(["missing", "damaged"]),
  freightDescription: z.string().nonempty("Description of freight is required"),
  totalMissingGoodsValue: z.string().nonempty("Value is required"),
  currency: z.enum(["CAD", "USD"]),
});
type ClaimDetailsFormValues = z.infer<typeof claimDetailsSchema>;
const ClaimDetailsAndDocuments = forwardRef(
  ({ onChange }: { onChange?: (data: any) => void }, ref: any) => {
    const form = useForm<ClaimDetailsFormValues>({
      resolver: zodResolver(claimDetailsSchema),
      defaultValues: {
        shipmentStatus: "missing",
        freightDescription: "",
        totalMissingGoodsValue: "0",
        currency: "CAD",
      },
    });

    useEffect(() => {
      const subscription = form.watch((value) => {
        onChange?.(value);
      });

      return () => subscription.unsubscribe();
    }, [form, onChange]);

    useImperativeHandle(ref, () => ({
      getValues: form.getValues,
      trigger: form.trigger,
    }));

    return (
      <div className="border rounded-md bg-white dark:bg-card overflow-hidden mb-5">
        <Accordion type="single" collapsible defaultValue="claim">
          <AccordionItem value="claim" className="border-none">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="flex items-center gap-2 font-semibold text-slate-700 dark:text-white">
                <ListTodo className="w-5 h-5" />
                Claim Details And Documents
              </h2>

              <AccordionTrigger className="p-0 hover:no-underline text-sm text-slate-500">
                Hide
              </AccordionTrigger>
            </div>

            <AccordionContent className="p-5">
              <FormProvider {...form}>
                <form className="space-y-6">
                  <GlobalForm
                    formWrapperClassName="grid grid-cols-1 sm:grid-cols-4 gap-4"
                    fields={[
                      {
                        name: "shipmentStatus",
                        label: "My Shipment is:",
                        type: "radio",
                        options: [
                          { value: "in-transit", label: "In Transit" },
                          { value: "delivered", label: "Delivered" },
                          { value: "delayed", label: "Delayed" },
                        ],
                        wrapperClassName:
                          "flex flex-col gap-4 col-span-1 sm:col-span-2",
                      },
                      // shipment Status

                      {
                        name: "freightDescription",
                        label: "Description of Freight *",
                        type: "textarea",
                        placeholder: "Describe the freight...",
                        wrapperClassName: "col-span-1 sm:col-span-4 w-1/2",
                      },
                      {
                        name: "totalMissingGoodsValue",
                        label: "Total Value of Missing Goods *",
                        type: "number",
                        placeholder: "Enter the total value...",
                        wrapperClassName: "col-span-1/2",
                      },
                      {
                        name: "currency",
                        label: "Currency *",
                        type: "radio",
                        options: [
                          { value: "CAD", label: "CAD" },
                          { value: "USD", label: "USD" },
                        ],
                        wrapperClassName: "flex flex-col gap-4 col-span-1",
                      },
                    ]}
                  />
                </form>
              </FormProvider>
              <div className="border-t pt-6">
                <h3 className="font-semibold text-sm text-slate-700 dark:text-white mb-3">
                  Claim Documents
                </h3>

                <p className="text-sm text-slate-500 mb-4">
                  Please note that accepted files must be .PDF or Word format.
                </p>

                <div className="border rounded-md overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-3 bg-white dark:bg-card px-4 py-3 text-sm font-medium border-b">
                    <div>File Name</div>
                    <div>Document Type</div>
                    <div>Actions</div>
                  </div>

                  {/* Row */}
                  <div className="grid grid-cols-3 px-4 py-4 text-sm items-center">
                    <div className="text-red-600">Documentation Required</div>

                    <div>Cost Invoice</div>

                    <button
                      type="button"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Document
                    </button>
                  </div>
                </div>

                {/* Add Doc */}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-md text-sm hover:bg-slate-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Documentation
                  </button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
);

export default ClaimDetailsAndDocuments;
