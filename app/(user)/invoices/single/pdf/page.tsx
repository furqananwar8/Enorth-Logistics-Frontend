"use client"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getInvoiceById } from "@/api/services/invoices.api"
import { Loader } from "@/components/common/Loader"

export default function InvoicePdfPage() {
    const searchParams = useSearchParams()
    const invoiceId = searchParams.get("id")

    const { data, isLoading, isError } = useQuery({
        queryKey: ["invoice-pdf", invoiceId],
        queryFn: () => getInvoiceById(Number(invoiceId)),
        enabled: !!invoiceId,
    })

    const invoice = data?.invoice

    useEffect(() => {
        if (!invoice) return

        const timer = setTimeout(() => {
            window.print()
        }, 700)

        return () => clearTimeout(timer)
    }, [invoice])

    if (isLoading) return <Loader className="py-20" />

    if (isError || !invoice) {
        return (
            <div className="py-20 text-center text-red-500">
                Invoice not found
            </div>
        )
    }

    const shipment = invoice.shipment

    const surchargeTotal =
        invoice.surcharges?.reduce(
            (sum: number, s: any) => sum + Number(s.amount || 0),
            0
        ) || 0

    const totalDue = invoice.paid
        ? 0
        : Number(shipment?.totalNetCharge || 0)

    return (
        <div className="bg-white text-black min-h-screen p-8 max-w-212.5 mx-auto font-sans text-sm">

            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <img
                    src="https://live.enorthlogistics.com/enorth-logo.svg"
                    alt="Enorth Logo"
                    style={{
                        width: 200,
                        height: 200,
                        objectFit: "contain"
                    }}
                />

                <div className="text-xl">
                    <span className="font-normal">
                        Invoice # / # de facture :
                    </span>

                    <span className="font-bold ml-2">
                        {invoice.invoiceNumber}
                    </span>
                </div>
            </div>

            {/* Billing Info */}
            <div className="flex justify-between mb-8 text-sm">
                <div>
                    <div className="text-gray-600 mb-1">
                        Bill to / Facturer à :
                    </div>

                    <div className="font-medium">
                        {invoice.company?.name}
                    </div>

                    <div>
                        {shipment?.bookedBy?.email}
                    </div>

                    <div>
                        {shipment?.bookedBy?.phoneNumber}
                    </div>
                </div>

                <div className="text-right flex flex-col gap-1">
                    <div className="flex justify-end gap-2">
                        <span className="text-gray-600">
                            Invoice Date:
                        </span>

                        <span className="font-medium w-28 text-left">
                            {new Date(
                                invoice.createdAt
                            ).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex justify-end gap-2">
                        <span className="text-gray-600">
                            Payment Due:
                        </span>

                        <span className="font-medium w-28 text-left">
                            {new Date(
                                invoice.dueDate
                            ).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex justify-end gap-2">
                        <span className="text-gray-600">
                            Amount Due:
                        </span>

                        <span className="font-bold w-28 text-left">
                            ${totalDue.toFixed(2)}{" "}
                            {shipment?.currency}
                        </span>
                    </div>
                </div>
            </div>

            {/* Charges Table */}
            <div className="mb-6">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#d2e3f0] text-xs">
                        <tr>
                            <th className="py-2 px-3 font-normal">
                                # Shipments
                            </th>

                            <th className="py-2 px-3 font-normal">
                                Freight Charges
                            </th>

                            <th className="py-2 px-3 font-normal">
                                Fuel Charges
                            </th>

                            <th className="py-2 px-3 font-normal">
                                Accessorials
                            </th>

                            <th className="py-2 px-3 font-normal">
                                Taxes
                            </th>
                        </tr>
                    </thead>

                    <tbody className="border-b border-gray-300">
                        <tr>
                            <td className="py-3 px-3">
                                1
                            </td>

                            <td className="py-3 px-3">
                                $
                                {Number(
                                    shipment?.totalBaseCharge || 0
                                ).toFixed(2)}
                            </td>

                            <td className="py-3 px-3">
                                $
                                {surchargeTotal.toFixed(2)}
                            </td>

                            <td className="py-3 px-3">
                                $
                                {Number(
                                    shipment?.totalSurcharges || 0
                                ).toFixed(2)}
                            </td>

                            <td className="py-3 px-3">
                                $
                                {Number(
                                    shipment?.totalTax || 0
                                ).toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-16 text-sm">
                <div className="w-[350px]">
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-600">
                            Invoice Subtotal:
                        </span>

                        <span>
                            $
                            {Number(
                                shipment?.totalNetCharge || 0
                            ).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">
                            Total Amount Paid:
                        </span>

                        <span>
                            $
                            {invoice.paid
                                ? Number(
                                      shipment?.totalNetCharge || 0
                                  ).toFixed(2)
                                : "0.00"}
                        </span>
                    </div>

                    <div className="border-t border-gray-300 my-2" />

                    <div className="flex justify-between mb-1">
                        <span className="text-gray-600 font-medium">
                            Invoice Total:
                        </span>

                        <span className="font-bold">
                            $
                            {Number(
                                shipment?.totalNetCharge || 0
                            ).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                            Total Amount Due:
                        </span>

                        <span className="font-bold">
                            ${totalDue.toFixed(2)}{" "}
                            {shipment?.currency}
                        </span>
                    </div>
                </div>
            </div>

            {/* Thank You */}
            <div className="text-center mb-16 text-lg font-bold text-gray-800">
                <div className="mb-1">
                    We appreciate your business. Thank you!
                </div>

                <div>
                    Nous apprécions votre clientèle. Merci !
                </div>
            </div>

            {/* Shipment Info */}
            <div className="mb-6 text-xs">
                <div className="text-gray-500 mb-2">
                    Shipment Details
                </div>

                <div className="flex justify-between">
                    <div>
                        <div>
                            Tracking:
                            {" "}
                            <strong>
                                {shipment?.trackingNumber || "-"}
                            </strong>
                        </div>

                        <div>
                            Carrier:
                            {" "}
                            <strong>
                                {shipment?.carrier}
                            </strong>
                        </div>
                    </div>

                    <div>
                        <div>
                            Service:
                            {" "}
                            <strong>
                                {shipment?.serviceName}
                            </strong>
                        </div>

                        <div>
                            Status:
                            {" "}
                            <strong>
                                {shipment?.currentStatus}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div className="text-[9px] text-gray-400 leading-tight mb-8">
                <div className="font-bold mb-1">
                    Terms & Conditions
                </div>

                <p>
                    You have thirty (30) days from the Invoice Date
                    to dispute charges. Please pay the Amount Due
                    in full before initiating any dispute.
                </p>
            </div>

            <div className="text-center text-xs text-gray-500 font-medium pb-8">
                Page 1 of 1
            </div>

            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                    }

                    @page {
                        margin: 0;
                        size: auto;
                    }
                }
            `}</style>
        </div>
    )
}