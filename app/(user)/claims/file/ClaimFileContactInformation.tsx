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

const contactInfoSchema = z.object({
  contactFullName: z.string().min(1, "Contact Name is required"),
  contactPhoneNumber: z.string().min(1, "Phone Number is required"),
  contactEmailAddress: z.email("Invalid email address"),
  claimName: z.string().optional(),
});

const ContactInformation = forwardRef(
  ({ onChange }: { onChange?: (data: any) => void }, ref: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm({
      resolver: zodResolver(contactInfoSchema),
      defaultValues: {
        contactFullName: "",
        contactPhoneNumber: "",
        contactEmailAddress: "",
        claimName: "",
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

    return (
      <div className="space-y-4 mb-5">
        <h2 className="font-semibold flex items-center gap-2 text-lg text-slate-700 dark:text-white ">
          <ListTodo />
          Contact Information
        </h2>
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
                },
                {
                  name: "contactPhoneNumber",
                  label: "Phone Number*",
                  type: "phone",
                  placeholder: "Phone Number",
                  wrapperClassName: "col-span-1",

                },
                {
                  name: "contactEmailAddress",
                  label: "Email Address*",
                  type: "email",
                  placeholder: "Email Address",
                  wrapperClassName: "col-span-1",

                },
                {
                  name: "claimName",
                  label: "Claim Name",
                  type: "text",
                  placeholder: "Claim Name",
                  wrapperClassName: "col-span-1",

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
