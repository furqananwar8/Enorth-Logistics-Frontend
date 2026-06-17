"use client";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import { useAuth } from "@/context/auth.context";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function InBond({ viewOnly }: { viewOnly: boolean }) {
  const methods = useFormContext();
  const contactType = methods
    .watch("services.inBound.contactKey")
    ?.toLowerCase();
  // useEffect(() => {
  //   if (!inBoundDetails) return;
  //   const InBound = inBoundDetails;
  //   methods.reset({
  //     services: {
  //       inBound: {
  //         bondType: InBound.bondType ?? "",
  //         bondCancler: InBound.bondCancler ?? "",
  //         contactKey: InBound.contactKey ?? "",
  //         contactValue: InBound.contactValue ?? "",
  //         address: InBound.address ?? "",
  //       },
  //     },
  //   });
  // }, [inBoundDetails]);
  return (
    <div className="border border-blue-100 bg-[#f8fbfe] rounded-md p-6 space-y-6">
      {/* Title */}
      <h3 className="font-semibold text-lg">In-Bond Details</h3>

      {/* Bond Type */}
      <GlobalForm
        formWrapperClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
        fields={[
          {
            name: "services.inBound.bondType",
            label: "(T&E) Transportation & Export Bond",
            type: "radio",
            options: [
              {
                label: "(T&E) Transportation & Export Bond",
                value: "T_E_BOND",
              },
              { label: "(IT) Immediate Transportation Bond", value: "IT_BOND" },
            ],

            wrapperClassName: "col-span-2 flex flex-col gap-4",
            disabled: viewOnly,
          },
          {
            name: "services.inBound.bondCancler",
            label: "Warehouse or Carrier who will cancel US Bond",
            type: "text",
            placeholder: "",
            inputClassName: "bg-white",
            disabled: viewOnly,
          },
          {
            name: "services.inBound.address",
            label: "Address",
            type: "text",
            placeholder: "123 Address",
            inputClassName: "bg-white",
            disabled: viewOnly,
          },
          {
            name: "services.inBound.contactKey",
            options: [
              { label: "Email", value: "EMAIL" },
              { label: "Fax Number", value: "FAX" },
              { label: "Phone", value: "PHONE" },
            ],
            type: "radio",
            className: "mb-4",
            disabled: viewOnly,
          },
          {
            name: "services.inBound.contactValue",
            label: contactType,
            placeholder: `Please enter your ${contactType}`,
            inputClassName: "w-1/2 bg-white",
            wrapperClassName: "col-span-2",
            type: "text",
            labelClassName: "capitalize",
            disabled: viewOnly,
          },
        ]}
      />
    </div>
  );
}
