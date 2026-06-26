"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ListTodo,
  Upload,
  Eye,
  Trash,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import AddDocumentationModal from "./AddDocumentationModal";
import { Button } from "@/components/ui/button";
import { deleteClaimDocument } from "@/api/services/claims.api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/auth.context";

const claimDetailsSchema = z.object({
  claimType: z.enum(["MISSING", "DAMAGED"], "Claim Type is required"),
  goodsDescription: z.string().nonempty("Description of goods is required"),
  totalValueOfGoods: z
    .number()
    .positive("Value must be greater than zero"),
  currency: z.enum(["CAD", "USD"]),
});

type ClaimDetailsFormValues = z.infer<typeof claimDetailsSchema>;

const ClaimDetailsAndDocuments = forwardRef(
  (
    {
      onChange,
      uploadedDocument,
      setUploadedDocument,
      initialValues,
    }: {
      onChange?: (data: any) => void;
      uploadedDocument: any;
      setUploadedDocument: (doc: any) => void;
      initialValues?: any;
    },
    ref: any,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [documentType, setDocumentType] = useState<any>();
    const { isAdmin } = useAuth();

    const form = useForm<ClaimDetailsFormValues>({
      resolver: zodResolver(claimDetailsSchema),
      mode: "onChange",
      defaultValues: {
        claimType: "MISSING",
        goodsDescription: "",
        currency: "CAD",
      },
    });

    useEffect(() => {
      if (initialValues) {
        form.reset({
          claimType: initialValues.claimType || "MISSING",
          goodsDescription: initialValues.goodsDescription || "",
          totalValueOfGoods: Number(initialValues.totalValueOfGoods) || 0,
          currency: initialValues.currency || "CAD",
        });
      }
    }, [initialValues, form, uploadedDocument]);

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

    const deleteUserMutation = useMutation({
      mutationFn: (fileName: any) => deleteClaimDocument(fileName),
      onSuccess: () => {
        toast.success("Document deleted successfully");
        setUploadedDocument([]);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to delete document",
        );
      },
    });

    const handleDeleteDocument = (fileUrl: string) => {
      const fileName = fileUrl.split("/").pop();
      if (!fileName) return;
      deleteUserMutation.mutate(fileName);
    };

    return (
      <div className="border rounded-md bg-white dark:bg-card mb-5">
        <Accordion type="single" collapsible defaultValue="claim">
          <AccordionItem value="claim" className="border-none">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="flex items-center gap-2 font-semibold text-slate-700 dark:text-white">
                <ListTodo className="w-5 h-5" />
                Claim Details And Documents
              </h2>
              <AccordionTrigger className="p-0 hover:no-underline text-sm text-slate-500 cursor-pointer"></AccordionTrigger>
            </div>
            <AccordionContent className="p-5 h-max">
              <FormProvider {...form}>
                <form className="space-y-6">
                  <GlobalForm
                    formWrapperClassName="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5"
                    fields={[
                      {
                        name: "claimType",
                        label: "My Shipment is:",
                        type: "radio",
                        options: [
                          { value: "MISSING", label: "Missing" },
                          { value: "DAMAGED", label: "Damaged" },
                        ],
                        wrapperClassName:
                          "flex flex-col gap-4 col-span-1 sm:col-span-2",
                        disabled: isAdmin,
                      },
                      {
                        name: "goodsDescription",
                        label: "Description of Freight *",
                        type: "textarea",
                        placeholder: "Describe the freight...",
                        wrapperClassName: "col-span-1 sm:col-span-4 w-1/2",
                        disabled: isAdmin,
                      },
                      {
                        name: "totalValueOfGoods",
                        label: "Total Value of Missing Goods *",
                        type: "number",
                        placeholder: "Enter the total value...",
                        wrapperClassName: "col-span-1/2",
                        disabled: isAdmin,
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
                        disabled: isAdmin,
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
                  <div className="grid grid-cols-3 bg-white dark:bg-card px-4 py-3 text-sm font-medium border-b">
                    <div>File Name</div>
                    <div>Document Type</div>
                    <div>Actions</div>
                  </div>

                  {uploadedDocument?.length > 0 ? (
                    uploadedDocument?.map((document: any) => (
                      <div
                        className="grid grid-cols-3 px-4 py-4 text-sm items-center border-b"
                        key={document.fileUrl}
                      >
                        <div>{document.fileName}</div>
                        <div className="capitalize">
                          {document.documentType
                            .replaceAll("_", " ")
                            .toLowerCase()}
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline">
                            <Link
                              className="w-max no-underline!"
                              href={`${process.env.NEXT_PUBLIC_BASE_URL}${document.fileUrl}`}
                              target="_blank"
                            >
                              <Eye />
                              View
                            </Link>
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeleteDocument(document.fileUrl)
                            }
                            variant="destructive"
                            disabled={deleteUserMutation.isPending || isAdmin}
                          >
                            {deleteUserMutation.isPending ? (
                              <LoaderCircle
                                className="animate-spin mr-2"
                                size={16}
                              />
                            ) : (
                              <Trash className="w-4 h-4" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-3 px-4 py-4 text-sm items-center">
                      <div className="text-red-600">Documentation Required</div>
                      <div>Cost Invoice</div>
                      <Button
                        className="w-max border-primary"
                        variant="outline"
                        onClick={() => {
                          setDocumentType("COST-INVOICE");
                          setIsOpen(true);
                        }}
                        disabled={isAdmin}
                      >
                        <Upload className="w-4 h-4" />
                        Upload Document
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <AddDocumentationModal
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    uploadedDocument={uploadedDocument}
                    setUploadedDocument={setUploadedDocument}
                    documentType={documentType}
                    setDocumentType={setDocumentType}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
);

ClaimDetailsAndDocuments.displayName = "ClaimDetailsAndDocuments";

export default ClaimDetailsAndDocuments;