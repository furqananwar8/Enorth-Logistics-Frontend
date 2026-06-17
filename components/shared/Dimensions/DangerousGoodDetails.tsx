import { Info } from "lucide-react";
import { GlobalForm } from "@/components/common/form/GlobalForm";

interface fieldNameProps {
  type: string;
  un: string;
  packagingGroup: string;
  dgClass: string;
  technicalName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  viewOnly?: boolean;
}
const DangerousGoodsForm = ({
  type,
  un,
  packagingGroup,
  dgClass,
  technicalName,
  emergencyContactName,
  emergencyContactPhone,
  viewOnly,
}: fieldNameProps) => {
  return (
    <div className="border border-blue-100 p-6 rounded-sm">
      <p className="text-sm text-slate-700 mb-6">
        Please provide the{" "}
        <span className="font-bold">Dangerous Goods details</span>, as these
        details will show up on the BOL. Failure to enter this data may result
        in <span className="font-bold">delayed pickups</span>.
      </p>
      <GlobalForm
        formWrapperClassName="grid grid-cols-1 md:grid-cols-3 gap-4"
        fields={[
          {
            name: type,
            label: "Dangerous Good Type",
            type: "radio",
            options: [
              {
                value: "LIMITED",
                label: "Limited Quantity",
                icon: <Info size={16} className="fill-blue-900 text-white" />,
              },
              {
                value: "EXEMPTION",
                label: "500 kg Exemption",
                icon: <Info size={16} className="fill-blue-900 text-white" />,
              },
              {
                value: "REGULATED",
                label: "Fully Regulated",
                icon: <Info size={16} className="fill-blue-900 text-white" />,
              },
            ],
            wrapperClassName: "col-span-3",
            className: "mt-4",
            disabled: viewOnly,
          },
          {
            name: un,
            label: "UN #",
            type: "text",
            placeholder: "Enter UN #",
            wrapperClassName: "md:col-span-",
            className: "bg-white dark:bg-card",
            disabled: viewOnly,

          },
          {
            name: packagingGroup,
            label: "Packaging Group",
            type: "select",
            placeholder: "Select Packaging Group",
            options: [
              { value: "pg1", label: "PG I" },
              { value: "pg2", label: "PG II" },
              { value: "pg3", label: "PG III" },
              { value: "none", label: "N/A" },
            ],
            className: "bg-white dark:bg-card",
            disabled: viewOnly,

          },
          {
            name: dgClass,
            label: "Class",
            placeholder: "Enter Class",
            type: "select",
            options: [
              { value: "CLASS_1", label: "Class 1" },
              { value: "CLASS_2", label: "Class 2" },
              { value: "CLASS_3", label: "Class 3" },
              { value: "CLASS_4", label: "Class 4" },
              { value: "CLASS_5", label: "Class 5" },
              { value: "CLASS_6", label: "Class 6" },
              { value: "CLASS_7", label: "Class 7" },
              { value: "CLASS_8", label: "Class 8" },
              { value: "CLASS_9", label: "Class 9" },
            ],
            className: "bg-white dark:bg-card",
            disabled: viewOnly,

          },
          {
            name: technicalName,
            label: "Technical Name or Description",
            type: "text",
            placeholder: "Enter Technical Name or Description",
            wrapperClassName: "md:col-span-3",
            className: "bg-white dark:bg-card",
            disabled: viewOnly,

          },
          {
            name: emergencyContactName,
            label: "24-hr Emergency Contact Name",
            type: "text",
            placeholder: "Enter Emergency Contact Name",
            className: "bg-white dark:bg-card",
            disabled: viewOnly,

          },
          {
            name: emergencyContactPhone,
            label: "Contact Phone Number",
            type: "phone",
            placeholder: "Enter Contact Phone Number",
            className: "bg-white dark:bg-card",
            disabled: viewOnly,

          },
        ]}
      />
    </div>
  );
};

export default DangerousGoodsForm;
