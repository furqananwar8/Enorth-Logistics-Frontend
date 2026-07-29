"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";
import AddCardForm from "./AddCardForm";

interface AddCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCardModal({
  open,
  onOpenChange,
}: AddCardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="h-5 w-5" />
            Add New Credit Card
          </DialogTitle>
        </DialogHeader>
        <AddCardForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}