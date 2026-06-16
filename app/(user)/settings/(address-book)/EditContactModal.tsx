"use client";
import { createContact, getSingleContact, updateContact } from "@/api/services/address-book.api"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ContactForm } from "./components/ContactForm"
import { mapFormToPayload, mapPayloadToForm } from "./mappers/contact.mapper"
import { ContactFormValues } from "./schemas/addContact.schema"
import { ContactType } from "./types/addContact.types"
import { AxiosError } from "axios"
import { ApiError } from "next/dist/server/api-utils"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserSquare2 } from "lucide-react";
import { Loader } from "@/components/common/Loader";
// import { ContactType } from "./types/addContact.types";

type EditContactModalProps = {
    id: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function EditContactModal(
    { id, open, setOpen }: EditContactModalProps) {
    const [isValid, setIsValid] = useState(false)
    const queryClient = useQueryClient()
    const { data, isLoading, isPending } = useQuery({
        queryKey: ["contact", id],
        queryFn: () => getSingleContact(id),
        select: (data) => mapPayloadToForm(data.addressBookContact),
        enabled: !!id
    })
    // console.log("id", id)
    // console.log("data", data)

    const mutation = useMutation({
        mutationFn: (data: ContactType) => updateContact(id, data),
        onSuccess: () => {
            toast.success("Contact updated successfully")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ["contact"] })


        },
        onError: (error: AxiosError<ApiError>) => {
            toast.error(error.response?.data.message)
        }
    })

    // console.log("editContactDefaults", data)


    const handleSubmit = (data: ContactFormValues) => {
        const payload = mapFormToPayload(data)
        mutation.mutate(payload)
    }
    if (mutation.isPending) {
        return <Loader className="absolute top-0 left-0 w-full h-full backdrop-blur-md rouned-xl"/>
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                aria-description="address-book-contact-form"
                className="sm:max-w-[700px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <UserSquare2 className="h-6 w-6" />
                        Edit Contact
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 overflow-y-auto px-6 py-6">
                    <ContactForm
                        onSubmit={handleSubmit}
                        defaultValues={data}
                        isLoading={mutation.isPending}
                        open={open}
                        setOpen={setOpen}
                        setIsValid={setIsValid}
                    />
                </ScrollArea>
                <DialogFooter className="px-6 py-4 border-t border-border bg-muted/20 sm:justify-start gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="w-[120px]">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button disabled={!isValid || mutation.isPending} onClick={() => handleSubmit} form="contact-form" className="bg-primary hover:bg-[#005999] text-white w-[140px]">
                        Update Contact
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}