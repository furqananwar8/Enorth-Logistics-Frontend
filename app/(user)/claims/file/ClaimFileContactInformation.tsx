"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import { FormProvider, useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ListTodo, BookUser, X } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectAddressBookModal } from "@/components/shared/Shipping/SelectAddressBookModal";
import { Button } from "@/components/ui/button";
import { useMarkContactAsRecent } from "@/app/(user)/quote/hooks";
import { ContactType } from "@/app/(user)/settings/(address-book)/types/addContact.types";
import { useAuth } from "@/context/auth.context";

const contactInfoSchema = z.object({
  contactFullName: z.string().min(1, "Contact Name is required"),
  contactPhoneNumber: z.string().min(1, "Phone Number is required"),
  contactEmailAddress: z.email("Invalid email address"),
  claimName: z.string().min(1, "Claim Name is required"),
});

const ContactInformation = forwardRef(
  (
    {
      onChange,
      initialValues,
    }: {
      onChange?: (data: any) => void;
      initialValues?: any;
    },
    ref: any,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAddressLocked, setIsAddressLocked] = useState(false);
    const markContactAsRecent = useMarkContactAsRecent();
    const { isAdmin } = useAuth();

    const form = useForm({
      resolver: zodResolver(contactInfoSchema),
      defaultValues: {
        contactFullName: "",
        contactPhoneNumber: "",
        contactEmailAddress: "",
        claimName: "",
      },
    });

    const handleAddressSelect = (contact: ContactType) => {
      markContactAsRecent.mutate(contact.id || "");
      setIsAddressLocked(true);

      form.setValue("contactFullName", contact.contactName || "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("contactPhoneNumber", contact.phoneNumber || "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("contactEmailAddress", contact.email || "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

    const handleClearContact = () => {
      setIsAddressLocked(false);
      form.reset({
        contactFullName: "",
        contactPhoneNumber: "",
        contactEmailAddress: "",
        claimName: "",
      });
    };

    useEffect(() => {
      const subscription = form.watch((value) => {
        if (onChange) {
          onChange(value);
        }
      });
      return () => subscription.unsubscribe();
    }, [form, onChange]);

    useEffect(() => {
      if (initialValues) {
        form.reset(initialValues);
      }
    }, [initialValues, form]);

    useImperativeHandle(ref, () => ({
      getValues: form.getValues,
      trigger: form.trigger,
    }));

    return (
      <div className="space-y-4 mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2 text-lg text-slate-700 dark:text-white">
            <ListTodo />
            Contact Information
          </h2>
          <div className="flex gap-2">
            <SelectAddressBookModal
              onSelect={handleAddressSelect}
              triggerButton={
                <Button
                  variant="outline"
                  type="button"
                  className="text-sm flex items-center gap-2 hover:underline"
                >
                  <BookUser className="w-4 h-4" />
                  Address Book
                </Button>
              }
            />
            {isAddressLocked && (
              <Button
                variant="ghost"
                type="button"
                onClick={handleClearContact}
                className="text-sm flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
        <FormProvider {...form}>
          <form>
            <GlobalForm
              formWrapperClassName="grid grid-cols-1 sm:grid-cols-4 gap-4"
              fields={[
                {
                  name: "contactFullName",
                  label: "Contact Name *",
                  type: "text",
                  placeholder: "Contact Name",
                  wrapperClassName: "col-span-1",
                  disabled:isAdmin
                },
                {
                  name: "contactPhoneNumber",
                  label: "Phone Number*",
                  type: "phone",
                  placeholder: "Phone Number",
                  wrapperClassName: "col-span-1",
                  flagClassName: "border-none!",
                  disabled:isAdmin

                },
                {
                  name: "contactEmailAddress",
                  label: "Email Address*",
                  type: "email",
                  placeholder: "Email Address",
                  wrapperClassName: "col-span-1",
                  disabled:isAdmin

                },
                {
                  name: "claimName",
                  label: "Claim Name *",
                  type: "text",
                  placeholder: "Claim Name",
                  wrapperClassName: "col-span-1",
                  disabled:isAdmin
                },
              ]}
            />
          </form>
        </FormProvider>
      </div>
    );
  },
);

export default ContactInformation;
