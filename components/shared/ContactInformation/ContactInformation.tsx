import { forwardRef, useEffect, useImperativeHandle } from "react";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import { FormProvider, useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ListTodo } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuoteTypes } from "../DynamicQuote/DynamicQuote.types";
import { isFuture } from "date-fns";

const contactInfoSchema = z.object({
  spotContact: z.object({
    contactName: z.string().min(1, "Contact Name is required"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
    email: z.email("Invalid email address"),
    shipDate: z
      .date({
        message: "Ship date is required",
      })
      .min(new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Ship date cannot be in the past",
      }),
    spotQuoteName: z.string().optional(),
  }),
});

const ContactInformation = forwardRef(
  (
    {
      quoteType,
      onChange,
      quoteDetails,
      viewOnly,
    }: {
      quoteType: QuoteTypes;
      onChange?: (data: any) => void;
      quoteDetails: any;
      viewOnly: boolean;
    },
    ref: any,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm({
      resolver: zodResolver(contactInfoSchema),
      defaultValues: {
        spotContact: {
          contactName: "",
          phoneNumber: "",
          shipDate: undefined,
          email: "",
          spotQuoteName: "",
        },
      },
    });

    useEffect(() => {
      const subscription = form.watch((value) => {
        if (onChange) {
          onChange(value);
        }
      });
      return () => subscription.unsubscribe();
    }, [form, onChange]);

    useImperativeHandle(ref, () => ({
      getValues: form.getValues,
      trigger: form.trigger,
    }));

    useEffect(() => {
      if (quoteDetails?.quote?.spotDetails?.spotContact) {
        const contact = quoteDetails.quote.spotDetails.spotContact;

        form.setValue("spotContact.contactName", contact.contactName || "");
        form.setValue("spotContact.phoneNumber", contact.phoneNumber || "");
        form.setValue("spotContact.email", contact.email || "");
        form.setValue("spotContact.spotQuoteName", contact.spotQuoteName || "");

        if (contact.shipDate) {
          form.setValue("spotContact.shipDate", new Date(contact.shipDate));
        }
      }
    }, [quoteDetails, form]);

    return (
      <Accordion
        type="single"
        collapsible
        value={isOpen || viewOnly ? "insurance" : ""}
        onValueChange={(val) => setIsOpen(!!val)}
        className="shadow-lg border border-border rounded-md bg-white dark:bg-card"
      >
        <AccordionItem value="insurance" className="border-none">
          <AccordionTrigger className="group px-6 py-4 hover:no-underline items-center cursor-pointer [&>svg]:hidden!">
            <h2 className="font-semibold flex items-center gap-2 text-lg text-slate-700 dark:text-white ">
              <ListTodo />
              Contact Information
              <ChevronUp className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </h2>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-6 h-full">
            <FormProvider {...form}>
              <form>
                <GlobalForm
                  formWrapperClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  fields={[
                    {
                      name: "spotContact.contactName",
                      label: "Contact Name *",
                      type: "text",
                      placeholder: "Contact Name",
                      disabled: viewOnly,
                    },
                    {
                      name: "spotContact.phoneNumber",
                      label: "Phone Number*",
                      type: "phone",
                      placeholder: "Phone Number",
                      disabled: viewOnly,

                    },
                    {
                      name: "spotContact.shipDate",
                      label: "Ship Date*",
                      type: "date",
                      placeholder: "Ship Date",
                      futureDatesOnly: true,
                      disabled: viewOnly,

                    },
                    {
                      name: "spotContact.email",
                      label: "Email Address*",
                      type: "email",
                      placeholder: "Email Address",
                      disabled: viewOnly,

                    },
                    {
                      name: "spotContact.spotQuoteName",
                      label: "Spot Quote Name (optional)",
                      type: "text",
                      placeholder: "Spot Quote Name",
                      disabled: viewOnly,

                    },
                  ]}
                />
              </form>
            </FormProvider>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
);

export default ContactInformation;
