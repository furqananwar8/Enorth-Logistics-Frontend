import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MyPackages } from "./MyPackages";
import { PackageOpen } from "lucide-react";
import { useState } from "react";

export default function PackageSelectionModal({ selectedPackage, onSelect }: { selectedPackage: string, onSelect: (lineItem: any) => void }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-primary dark:text-accent">
                    <PackageOpen /> My Packages
                </Button>
            </DialogTrigger>
            <DialogContent className="overflow-scroll no-scrollbar sm:max-w-3xl!">
                <DialogHeader>
                    <DialogTitle>My Packages</DialogTitle>
                    <DialogDescription>
                        Select a package to use for this shipment.
                    </DialogDescription>
                </DialogHeader>
                <MyPackages selectedPackage={selectedPackage} onSelect={onSelect} />
            </DialogContent>
        </Dialog>
    )
}