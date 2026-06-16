import apiClient from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddDocumentationModalSchemaType } from "./AddDocumentationModal";

export function useUploadDocuments(
  uploadedDocument: any,
  setUploadedDocument: (doc: any) => void,
  setSelectedFile: (file: File | null) => void,
  onOpenChange: (open: boolean) => void,
  selectedDocumentType?: AddDocumentationModalSchemaType["documentType"],
) {
  const uploadDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", selectedDocumentType || "OTHERS");
      // const uploadDocumentPayload = {
      //   formData,
      //   documentType:documentType
      // }
      const response = await apiClient.post(
        "/claims/upload-documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      uploadedDocument?.length > 0
        ? setUploadedDocument([...uploadedDocument, ...data.document])
        : setUploadedDocument(data.document);
      toast.success("Document uploaded successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      console.log("Upload error:", error);
      toast.error("Failed to upload document");
    },
  });
  const getAcceptedFileTypes = (
    documentType?: AddDocumentationModalSchemaType["documentType"],
  ) => {
    switch (documentType) {
      case "PHOTO":
        return ".jpg,.jpeg,.png,.webp";
      case "COST-INVOICE":
      case "REPAIR-COST-INVOICE":
      case "SALES-INVOICE":
      case "STATEMENT-OF-NON-REPAIRABILITY":
      case "PACKING-SLIP":
      case "DESTRUCTION":
      case "OTHER":
        return ".jpg,.jpeg,.png,.webp,.pdf";
      default:
        return "";
    }
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    uploadDocumentMutation.mutate(file);
  };
  return { uploadDocumentMutation, getAcceptedFileTypes, handleFileChange };
}
