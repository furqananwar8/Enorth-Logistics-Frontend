import React, { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { BellRing } from "lucide-react"
import { GlobalForm } from "@/components/common/form/GlobalForm"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth.context"
import { createReminder, CreateReminderType } from "@/api/services/notification.api"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"

const reminderSchema = z.object({
    recipients: z.array(z.number()).min(1, { message: "Select at least one recipient" }),
    date: z.date().nonoptional("Date is required"),
    // hourName: z.string().regex(/^(0?[1-9]|1[0-2])$/, "Invalid hour"),
    hourName: z.string(),
    minuteName: z.string().regex(/^([0-5]?[0-9])$/, "Invalid minute"),
    ampmName: z.enum(["AM", "PM"]),
    title: z.string().min(1, { message: "Reminder Title is required" }),
    message: z.string().min(1, { message: "Reminder Message is required" })
})

type ReminderFormValues = z.infer<typeof reminderSchema>

interface Props {
    children: React.ReactNode
}

export function CreateReminderDialog({ children }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    const methods = useForm<ReminderFormValues>({
        resolver: zodResolver(reminderSchema),
        mode: "all",
        defaultValues: {
            recipients: [],
            hourName: "11",
            date: new Date(),
            minuteName: "00",
            ampmName: "PM",
            title: "",
            message: ""
        }
    })

    // get reciepients list from user
    const { user } = useAuth()
    const createReminderMutation = useMutation({
        mutationFn: (data: CreateReminderType) => createReminder(data),
        onSuccess: () => {
            toast.success("Reminder created successfully"),
                setIsOpen(false),
                methods.reset()
        },
        onError: () => {
            toast.error("Failed to create reminder")
        }
    })
    const onSubmit = (data: ReminderFormValues) => {
        const baseDate = new Date(data.date);

        let hours = parseInt(data.hourName, 10);
        const minutes = parseInt(data.minuteName, 10);

        if (data.ampmName === "PM" && hours !== 12) hours += 12;
        if (data.ampmName === "AM" && hours === 12) hours = 0;

        baseDate.setHours(hours, minutes, 0, 0);

        // Convert local time to UTC ISO string before sending
        const utcString = baseDate.toISOString();

        const payload: CreateReminderType = {
            title: data.title,
            message: data.message,
            scheduledAt: utcString as any, // "2026-04-22T15:01:00.000Z" for Pakistan 20:01
            sendTo: recipients,
        };

        createReminderMutation.mutate(payload);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            methods.reset()
        }
    }
    const recipients = methods.watch("recipients")
    // // console.log(recipients)
    const isValid = methods.formState.isValid
    // console.log(isValid)

    // errors
    const errors = methods.formState.errors
    // console.log(errors)

    // watch all fields
    const watchAllFields = methods.watch()
    // console.log(watchAllFields)

    // print team members and user himself
    // console.log(user?.user?.teamMembers)
    // console.log(user?.user)
    const mySelf = {
        id: user?.user?.id,
        firstName: user?.user?.firstName,
        lastName: user?.user?.lastName,
    }
    const teamMembers = [mySelf, ...user?.user?.teamMembers]

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden font-sans dark:bg-slate-950 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <DialogHeader className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
                        <BellRing className="size-6 text-slate-800 dark:text-slate-100" />
                        Create Reminder
                    </DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="p-6 pt-0">
                        {/* map recipient as checkbox */}
                        <div className="flex flex-wrap gap-12 py-4">
                            {teamMembers?.map((member: any) => (
                                <div key={member.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={member.id}
                                        name="recipient"
                                        checked={recipients.includes(member.id)}
                                        onCheckedChange={(checked) => {
                                            const current = recipients
                                            if (checked) {
                                                methods.setValue("recipients", [...current, member.id])
                                            } else {
                                                methods.setValue("recipients", current.filter((item) => item !== member.id))
                                            }
                                        }}
                                        className="border-primary cursor-pointer"
                                    />
                                    <Label htmlFor={member.id} className="cursor-pointer">
                                        {user?.user?.id === member.id ? "Myself" : member.firstName + " " + member.lastName}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <GlobalForm
                            formWrapperClassName="grid grid-cols-2 gap-8 mt-4"
                            fields={
                                [
                                    {
                                        name: "date",
                                        type: "date",
                                        label: "Reminder Date",
                                        placeholder: "Enter reminder date",
                                        futureDatesOnly: true,


                                    },
                                    {
                                        name: "time",
                                        type: "time",
                                        label: "Reminder Time",
                                        placeholder: "Enter reminder time",
                                        hourName: "hourName",
                                        minuteName: "minuteName",
                                        ampmName: "ampmName",
                                    },
                                    {
                                        name: "title",
                                        type: "text",
                                        label: "Reminder Title",
                                        placeholder: "Enter reminder title",
                                        wrapperClassName: "col-span-2",
                                        className: "w-1/2",
                                    },
                                    {
                                        name: "message",
                                        type: "textarea",
                                        label: "Reminder Message",
                                        placeholder: "Enter reminder message",
                                        wrapperClassName: "col-span-2",
                                    },


                                ]}
                        />
                        {/* <Input
                            type="datetime-local"
                        /> */}
                        {/* Footer Actions */}
                        < div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800" >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="w-28 font-semibold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 dark:bg-transparent"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid || createReminderMutation.isPending}
                                className="bg-primary hover:bg-[#005f9e] text-white font-semibold flex-1 max-w-[180px]"
                            >
                                Create Reminder
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
