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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle, UploadCloudIcon, Wallet } from "lucide-react";
// import { topupSchema, type TopupFormValues } from "./ULSWalletSettings.schema";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useUploadDocuments } from "./useUploadDocuments.hooks";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth.context";

const AddDocumentationModalSchema = z.object({
  documentType: z.enum([
    "COST-INVOICE",
    "DESTRUCTION",
    "OTHER",
    "PACKING-SLIP",
    "PHOTO",
    "REPAIR-COST-INVOICE",
    "SALES-INVOICE",
    "STATEMENT-OF-NON-REPAIRABILITY",
  ]),
});

export type AddDocumentationModalSchemaType = z.infer<
  typeof AddDocumentationModalSchema
>;
interface AddDocumentationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadedDocument: any;
  setUploadedDocument: (doc: any) => void;

  documentType: AddDocumentationModalSchemaType["documentType"];
  // setDocumentType: (field: keyof AddDocumentationModalSchemaType, value: any) => void;
  setDocumentType: (
    value: AddDocumentationModalSchemaType["documentType"],
  ) => void;
  //   onSubmit: (data: TopupFormValues) => void;
  //   isPending: boolean;
}
export default function AddDocumentationModal({
  open,
  onOpenChange,
  uploadedDocument,
  setUploadedDocument,
  documentType,
  setDocumentType,
  //   onSubmit,
  //   isPending,
}: AddDocumentationModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isAdmin } = useAuth();

  const methods = useForm<AddDocumentationModalSchemaType>({
    resolver: zodResolver(AddDocumentationModalSchema),
    defaultValues: {
      documentType: documentType || "COST_INVOICE",
    },
  });

  const handleFormSubmit = (data: AddDocumentationModalSchemaType) => {
    // onSubmit(data);
    onOpenChange(false);
    methods.reset();
  };

  const fields = [
    {
      name: "documentType",
      label: "Document Type",
      type: "select",
      options: [
        { label: "Cost Invoice", value: "COST_INVOICE" },
        { label: "Destruction", value: "DESTRUCTION" },
        { label: "Other Document", value: "OTHER_DOCUMENT" },
        { label: "Packing Slip", value: "PACKAGING_SLIP" },
        { label: "Photo", value: "PHOTO" },
        { label: "Repair Estimate / Invoice", value: "REPAIR_ESTIMATE" },
        { label: "Sales Invoice", value: "SALE_INVOICE" },
        {
          label: "Statement of Non-Repairability",
          value: "STATEMENT_OF_NON_REPAIRABILITY",
        },
      ],
      wrapperClassName: "w-full mb-4",
    },
  ];

  const selectedDocumentType = methods.watch("documentType");

  useEffect(() => {
    if (selectedDocumentType) {
      setDocumentType(selectedDocumentType);
    }
  }, [selectedDocumentType]);
  const { uploadDocumentMutation, getAcceptedFileTypes, handleFileChange } =
    useUploadDocuments(
      uploadedDocument,
      setUploadedDocument,
      setSelectedFile,
      onOpenChange,
      selectedDocumentType,
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isAdmin} variant="outline" className="text-primary border-primary">
          Add Documentation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {/* <Wallet className="h-5 w-5" /> */}
            <UploadCloudIcon className="h-5 w-5" />
            Upload Documents
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleFormSubmit)}
            id="topup-form"
          >
            <GlobalForm fields={fields} />
          </form>
        </FormProvider>

        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="border-primary">
              Cancel
            </Button>
          </DialogClose>
          <Input
            id="document-file"
            type="file"
            className="hidden"
            accept={getAcceptedFileTypes(selectedDocumentType)}
            onChange={handleFileChange}
          />
          {/* <Button
            type="submit"
            form="topup-form"
            className="bg-primary hover:bg-primary/90 text-white"
            asChild
            disabled={
              !methods.formState.isValid || uploadDocumentMutation.isPending
            }
          >
            <Label htmlFor="document-file">
              {uploadDocumentMutation.isPending ? (
                <LoaderCircle className="animate-spin mr-2" size={16} />
              ) : (
                ""
              )}
              Upload Document
            </Label>
          </Button> */}
          <Label
            htmlFor={
              uploadDocumentMutation.isPending ? undefined : "document-file"
            }
            className={cn(
              "cursor-pointer bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg",
              uploadDocumentMutation.isPending &&
                "pointer-events-none opacity-50",
            )}
          >
            {uploadDocumentMutation.isPending && (
              <LoaderCircle className="animate-spin mr-2" size={16} />
            )}
            Upload Document
          </Label>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
