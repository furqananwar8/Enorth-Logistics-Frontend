// "use client"

// import { useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { Info, FileText, Download, Calendar, MapPin, Phone, Mail, Building2 } from "lucide-react"
// import { useState } from "react"
// import { PayInvoiceModal } from "../components/PayInvoiceModal"
// import { useQuery } from "@tanstack/react-query"
// import { getInvoiceById } from "@/api/services/invoices.api"
// import { Loader } from "@/components/common/Loader"

// // Mock Data
// const MOCK_INVOICE = {
//     id: "FC15017348",
//     status: "Upcoming",
//     dueDate: "May 12, 2026",
//     invoiceDate: "Apr 12, 2026",
//     currency: "CAD",
//     billTo: {
//         company: "ENorth Logistics Inc",
//         address: "2960 Drew Rd Suite 156",
//         city: "Mississauga",
//         state: "ON",
//         postalCode: "L4T0A5",
//         country: "CA",
//         phone: "2893241968"
//     },
//     charges: {
//         freight: 105.48,
//         fuel: 41.03,
//         accessorials: 70.01,
//         tax: 0.00,
//         subtotal: 216.52,
//         paid: 0.00,
//         totalDue: 216.52
//     },
//     shipments: [
//         {
//             trackingNumber: "7914856338",
//             referenceNumber: "REF123456",
//             freight: 105.48,
//             adjustment: 0.00,
//             additional: 111.04,
//             tax: 0.00,
//             total: 216.52
//         }
//     ],
//     remitPayment: {
//         canadian: {
//             address: "77 Pillsworth Ave, Unit #1",
//             city: "Bolton",
//             state: "ON",
//             postalCode: "L7E 4G4"
//         },
//         american: {
//             address: "9220 Bass Lake Road, Suite 302",
//             city: "New Hope",
//             state: "MN",
//             postalCode: "55428"
//         }
//     },
//     contact: {
//         email: "info@enorthlogtistics.com",
//         phoneCA: "(289) 371-1005",
//         phoneUS: "(718) 535-3358",
//         tollFree: "(877) 335-8740"
//     }
// }

// export default function SingleInvoicePage() {
//     const searchParams = useSearchParams()
//     const invoiceId = searchParams.get("id")

//     const { data: apiInvoice, isLoading, isError } = useQuery({
//         queryKey: ["invoice", invoiceId],
//         queryFn: () => getInvoiceById(Number(invoiceId)),
//         enabled: !!invoiceId,
//     })

//     const invoice = apiInvoice?.invoice || MOCK_INVOICE
//     const [isPayModalOpen, setIsPayModalOpen] = useState(false)

//     if (isLoading) return <Loader className="py-20" />

//     const handleCSVDownload = () => {
//         const headers = [
//             "Tracking/BOL #",
//             "Reference Number",
//             "Freight Charge",
//             "Adjustment",
//             "Additional",
//             "Tax",
//             "Applicable Charge"
//         ];

//         const rows = (invoice.shipments || MOCK_INVOICE.shipments).map((s: any) => [
//             s.trackingNumber,
//             s.referenceNumber,
//             s.freight,
//             s.adjustment,
//             s.additional,
//             s.tax,
//             s.total
//         ]);

//         const csvArray = [headers, ...rows];
//         const csvContent = "\uFEFF" + csvArray.map(row => row.join(",")).join("\n");
//         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", `invoice_${invoiceId || invoice.id}_shipments.csv`);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     };

//     return (
//         <div className="container mx-auto pb-8 pt-20 px-4 max-w-7xl">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//                 <div>
//                     <div className="flex items-center gap-3 mb-1">
//                         <h1 className="text-3xl font-bold text-slate-900">Invoice #{invoice.invoiceNumber || invoice.id}</h1>
//                         <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
//                             {invoice.status}
//                         </span>
//                     </div>
//                     <div className="flex items-center text-slate-500 text-sm">
//                         <Calendar className="w-4 h-4 mr-1.5" />
//                         <span>Issued on {invoice.invoiceDate || invoice.createdAt} • Due by <span className="font-semibold text-slate-900">{invoice.dueDate}</span></span>
//                     </div>
//                 </div>
//                 <div className="flex gap-3">
//                     <Button variant="outline" className="text-slate-600 border-slate-200" onClick={() => window.open(`/invoices/single/pdf?id=${invoiceId || invoice.id}`, '_blank')}>
//                         <Download className="w-4 h-4 mr-2" />
//                         PDF Download
//                     </Button>
//                     <Button className="bg-primary hover:bg-[#005999] px-8 shadow-sm" onClick={() => setIsPayModalOpen(true)}>
//                         Pay ${(invoice.charges?.totalDue || invoice.totalAmount || 0).toFixed(2)} {invoice.currency}
//                     </Button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Left Column: Invoice Details */}
//                 <div className="lg:col-span-2 space-y-6">
//                     <Card className="rounded-xl border shadow-sm overflow-hidden">
//                         <CardHeader className="bg-slate-50/50 border-b py-4">
//                             <CardTitle className="text-lg font-bold flex items-center text-slate-800">
//                                 <Info className="w-5 h-5 mr-2.5 text-blue-600" />
//                                 Invoice Details
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-0">
//                             {/* Billing and Remit Info */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
//                                 <div>
//                                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
//                                         <Building2 className="w-4 h-4 mr-2" />
//                                         Bill To
//                                     </h3>
//                                     <div className="space-y-1.5">
//                                         <p className="font-bold text-slate-900 text-lg">{invoice.company.name}</p>
//                                         <p className="text-slate-600">{invoice.billTo.address}</p>
//                                         <p className="text-slate-600">{invoice.billTo.city}, {invoice.billTo.state}, {invoice.billTo.postalCode}, {invoice.billTo.country}</p>
//                                         <p className="text-slate-600 flex items-center mt-2">
//                                             <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
//                                             {invoice.billTo.phone}
//                                         </p>
                                        
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
//                                         <MapPin className="w-4 h-4 mr-2" />
//                                         Remit Payment To
//                                     </h3>
//                                     <div className="grid grid-cols-1 gap-4">
//                                         <div>
//                                             <p className="font-bold text-slate-800 text-xs mb-1">Canadian Address</p>
//                                             <p className="text-slate-600 text-sm">{MOCK_INVOICE.remitPayment.canadian.address}</p>
//                                             <p className="text-slate-600 text-sm">{MOCK_INVOICE.remitPayment.canadian.city}, {MOCK_INVOICE.remitPayment.canadian.state}, {MOCK_INVOICE.remitPayment.canadian.postalCode}</p>
//                                         </div>
//                                         <div>
//                                             <p className="font-bold text-slate-800 text-xs mb-1">American Address</p>
//                                             <p className="text-slate-600 text-sm">{MOCK_INVOICE.remitPayment.american.address}</p>
//                                             <p className="text-slate-600 text-sm">{MOCK_INVOICE.remitPayment.american.city}, {MOCK_INVOICE.remitPayment.american.state}, {MOCK_INVOICE.remitPayment.american.postalCode}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <Separator />

//                             {/* Charges Breakdown */}
//                             <div className="p-6">
//                                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
//                                     <FileText className="w-4 h-4 mr-2" />
//                                     Charges Breakdown
//                                 </h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
//                                     <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50">
//                                         <span className="text-slate-500">Freight Charges</span>
//                                         <span className="font-semibold text-slate-900">${MOCK_INVOICE.charges.freight.toFixed(2)}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50">
//                                         <span className="text-slate-500">Fuel Charges</span>
//                                         <span className="font-semibold text-slate-900">${MOCK_INVOICE.charges.fuel.toFixed(2)}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50">
//                                         <span className="text-slate-500">Accessorials</span>
//                                         <span className="font-semibold text-slate-900">${MOCK_INVOICE.charges.accessorials.toFixed(2)}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50">
//                                         <span className="text-slate-500">Taxes</span>
//                                         <span className="font-semibold text-slate-900">${MOCK_INVOICE.charges.tax.toFixed(2)}</span>
//                                     </div>
//                                 </div>

//                                 <div className="mt-8 flex justify-end">
//                                     <div className="w-full md:w-72 space-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
//                                         <div className="flex justify-between items-center text-sm">
//                                             <span className="text-slate-500 font-medium">Subtotal</span>
//                                             <span className="font-semibold text-slate-900">${MOCK_INVOICE.charges.subtotal.toFixed(2)}</span>
//                                         </div>
//                                         <div className="flex justify-between items-center text-sm">
//                                             <span className="text-slate-500 font-medium">Total Paid</span>
//                                             <span className="font-semibold text-green-600">-${MOCK_INVOICE.charges.paid.toFixed(2)}</span>
//                                         </div>
//                                         <Separator className="bg-slate-200" />
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-slate-900 font-bold">Amount Due</span>
//                                             <span className="text-xl font-black text-primary">${MOCK_INVOICE.charges.totalDue.toFixed(2)} <span className="text-xs font-bold text-slate-400">{MOCK_INVOICE.currency}</span></span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <Separator />

//                             {/* Shipments Table */}
//                             <div className="p-6">
//                                 <div className="flex justify-between items-center mb-4">
//                                     <h3 className="text-sm font-bold text-slate-800">
//                                         Shipments Included ({MOCK_INVOICE.shipments.length})
//                                     </h3>
//                                     <Button variant="ghost" size="sm" className="text-primary hover:bg-blue-50" onClick={handleCSVDownload}>
//                                         <Download className="w-3.5 h-3.5 mr-1.5" />
//                                         Export CSV
//                                     </Button>
//                                 </div>
//                                 <div className="overflow-x-auto border rounded-xl bg-white">
//                                     <table className="w-full text-sm text-left">
//                                         <thead className="bg-slate-50/80 text-xs text-slate-500 uppercase tracking-wider border-b font-bold">
//                                             <tr>
//                                                 <th className="px-4 py-4">Tracking/BOL #</th>
//                                                 <th className="px-4 py-4">Reference</th>
//                                                 <th className="px-4 py-4 text-right">Freight</th>
//                                                 <th className="px-4 py-4 text-right">Adj.</th>
//                                                 <th className="px-4 py-4 text-right">Addtl.</th>
//                                                 <th className="px-4 py-4 text-right font-bold text-slate-900">Total</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-slate-100">
//                                             {MOCK_INVOICE.shipments.map((shipment, idx) => (
//                                                 <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
//                                                     <td className="px-4 py-4 text-primary font-bold underline cursor-pointer">{shipment.trackingNumber}</td>
//                                                     <td className="px-4 py-4 text-slate-600">{shipment.referenceNumber}</td>
//                                                     <td className="px-4 py-4 text-right text-slate-600">${shipment.freight.toFixed(2)}</td>
//                                                     <td className="px-4 py-4 text-right text-slate-600">${shipment.adjustment.toFixed(2)}</td>
//                                                     <td className="px-4 py-4 text-right text-slate-600">${shipment.additional.toFixed(2)}</td>
//                                                     <td className="px-4 py-4 text-right font-bold text-slate-900">${shipment.total.toFixed(2)}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Support and Contact Footer */}
//                     {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
//                         <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
//                             <Mail className="w-5 h-5 text-blue-500 mb-2" />
//                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Email Support</p>
//                             <p className="text-xs font-semibold text-slate-700">{MOCK_INVOICE.contact.email}</p>
//                         </div>
//                         <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
//                             <Phone className="w-5 h-5 text-green-500 mb-2" />
//                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Canada Phone</p>
//                             <p className="text-xs font-semibold text-slate-700">{MOCK_INVOICE.contact.phoneCA}</p>
//                         </div>
//                         <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
//                             <Phone className="w-5 h-5 text-red-500 mb-2" />
//                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">USA Phone</p>
//                             <p className="text-xs font-semibold text-slate-700">{MOCK_INVOICE.contact.phoneUS}</p>
//                         </div>
//                         <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
//                             <Info className="w-5 h-5 text-purple-500 mb-2" />
//                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Toll Free</p>
//                             <p className="text-xs font-semibold text-slate-700">{MOCK_INVOICE.contact.tollFree}</p>
//                         </div>
//                     </div> */}
//                 </div>

//                 {/* Right Column: Actions & Documents */}
//                 <div className="lg:col-span-1 space-y-6">
//                     <Card className="rounded-xl border shadow-sm sticky top-24 overflow-hidden">
//                         <CardHeader className="bg-white border-b py-4">
//                             <CardTitle className="text-lg font-bold text-slate-800">
//                                 Invoice Documents
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-6 space-y-4">
//                             <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex justify-between items-center group hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => window.open(`/invoices/single/pdf?id=${invoiceId}`, '_blank')}>
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 bg-white rounded-lg border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
//                                         <FileText className="w-5 h-5" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm font-bold text-slate-800">Detailed Invoice</p>
//                                         <p className="text-[10px] text-blue-600 font-bold uppercase">PDF Document</p>
//                                     </div>
//                                 </div>
//                                 <Download className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
//                             </div>

//                             <Separator />

//                             <div className="space-y-3 pt-2">
//                                 <Button className="w-full bg-primary hover:bg-[#005999] h-11 font-bold shadow-md shadow-blue-200/50" onClick={() => setIsPayModalOpen(true)}>
//                                     Pay This Invoice
//                                 </Button>
//                                 <Button variant="outline" className="w-full h-11 font-bold border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => window.open(`/invoices/single/pdf?id=${invoiceId}`, '_blank')}>
//                                     Download All (1)
//                                 </Button>
//                             </div>

//                             <div className="pt-4 mt-4 border-t border-slate-100">
//                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Terms & Conditions</p>
//                                 <p className="text-[11px] text-slate-500 leading-relaxed">
//                                     You have thirty (30) days from the Invoice Date to dispute charges. Please pay the Amount Due in full by the Due Date.
//                                 </p>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>

//             <PayInvoiceModal
//                 open={isPayModalOpen}
//                 onOpenChange={setIsPayModalOpen}
//                 amount={MOCK_INVOICE.charges.totalDue}
//                 currency={MOCK_INVOICE.currency}
//                 invoiceId={invoiceId || ""}
//             />
//         </div>
//     )
// }

"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Info,
    FileText,
    Download,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Building2
} from "lucide-react"
import { useState } from "react"
import { PayInvoiceModal } from "../components/PayInvoiceModal"
import { useQuery } from "@tanstack/react-query"
import { getInvoiceById } from "@/api/services/invoices.api"
import { Loader } from "@/components/common/Loader"

export default function SingleInvoicePage() {
    const searchParams = useSearchParams()
    const invoiceId = searchParams.get("id")

    const { data: apiInvoice, isLoading, isError } = useQuery({
        queryKey: ["invoice", invoiceId],
        queryFn: () => getInvoiceById(Number(invoiceId)),
        enabled: !!invoiceId,
    })

    const invoice = apiInvoice?.invoice
    const [isPayModalOpen, setIsPayModalOpen] = useState(false)

    if (isLoading) return <Loader className="py-20" />

    if (isError || !invoice) {
        return (
            <div className="py-20 text-center text-red-500">
                Invoice not found
            </div>
        )
    }

    const shipment = invoice.shipment
    const totalSurchargeAmount =
        invoice.surcharges?.reduce(
            (sum: number, s: any) => sum + Number(s.amount || 0),
            0
        ) || 0

    const totalDue = invoice.paid
        ? 0
        : Number(shipment?.totalNetCharge || 0)

    const handleCSVDownload = () => {
        const headers = [
            "Tracking/BOL #",
            "Reference",
            "Freight",
            "Adjustment",
            "Additional",
            "Tax",
            "Total"
        ]

        const rows = shipment
            ? [[
                shipment.trackingNumber || shipment.bolNumber,
                shipment.serviceName,
                shipment.totalBaseCharge,
                0,
                shipment.totalSurcharges,
                shipment.totalTax,
                shipment.totalNetCharge
            ]]
            : []

        const csvArray = [headers, ...rows]
        const csvContent =
            "\uFEFF" +
            csvArray.map((row) => row.join(",")).join("\n")

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute(
            "download",
            `invoice_${invoice.invoiceNumber}.csv`
        )
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="container mx-auto pb-8 pt-20 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Invoice #{invoice.invoiceNumber}
                        </h1>

                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                            {invoice.paid ? "Paid" : "Pending"}
                        </span>
                    </div>

                    <div className="flex items-center text-slate-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>
                            Issued on{" "}
                            {new Date(
                                invoice.createdAt
                            ).toLocaleDateString()}{" "}
                            • Due by{" "}
                            <span className="font-semibold text-slate-900">
                                {new Date(
                                    invoice.dueDate
                                ).toLocaleDateString()}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="text-slate-600 border-slate-200"
                        onClick={() =>
                            window.open(
                                `/invoices/single/pdf?id=${invoiceId}`,
                                "_blank"
                            )
                        }
                    >
                        <Download className="w-4 h-4 mr-2" />
                        PDF Download
                    </Button>

                    <Button
                        className="bg-primary hover:bg-[#005999] px-8 shadow-sm"
                        onClick={() => setIsPayModalOpen(true)}
                    >
                        Pay ${totalDue.toFixed(2)}{" "}
                        {shipment?.currency}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2  space-y-6">
                    <Card className="rounded-xl pt-0 border shadow-sm overflow-hidden">
                        <CardHeader className="bg-primary text-white border-b py-4">
                            <CardTitle className="text-lg font-bold flex items-center ">
                                <Info className="w-5 h-5 mr-2.5" />
                                Invoice Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            {/* BILL TO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        Bill To
                                    </h3>

                                    <div className="space-y-2">
                                        <p className="font-bold text-slate-900 text-lg">
                                            {invoice.company?.name}
                                        </p>

                                        <p className="text-slate-600 flex items-center">
                                            <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                            {shipment?.bookedBy?.phoneNumber || "-"}
                                        </p>

                                        <p className="text-slate-600 flex items-center">
                                            <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                            {shipment?.bookedBy?.email || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Shipment */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Shipment Info
                                    </h3>

                                    <div className="space-y-2 text-sm text-slate-600">
                                        <p>
                                            Carrier:{" "}
                                            <strong>{shipment?.carrier}</strong>
                                        </p>
                                        <p>
                                            Service:{" "}
                                            <strong>{shipment?.serviceName}</strong>
                                        </p>
                                        <p>
                                            Status:{" "}
                                            <strong>{shipment?.currentStatus}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* CHARGES */}
                            <div className="p-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Charges Breakdown
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                                    <ChargeRow
                                        label="Freight Charges"
                                        value={shipment?.totalBaseCharge}
                                    />

                                    <ChargeRow
                                        label="Fuel / Surcharges"
                                        value={totalSurchargeAmount}
                                    />

                                    <ChargeRow
                                        label="Accessorials"
                                        value={shipment?.totalSurcharges}
                                    />

                                    <ChargeRow
                                        label="Taxes"
                                        value={shipment?.totalTax}
                                    />
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <div className="w-full md:w-72 space-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                                        <SummaryRow
                                            label="Subtotal"
                                            value={shipment?.totalNetCharge}
                                        />

                                        <SummaryRow
                                            label="Total Paid"
                                            value={
                                                invoice.paid
                                                    ? shipment?.totalNetCharge
                                                    : 0
                                            }
                                            paid
                                        />

                                        <Separator />

                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">
                                                Amount Due
                                            </span>

                                            <span className="text-xl font-black text-primary">
                                                ${totalDue.toFixed(2)}
                                                <span className="text-xs ml-1 text-slate-400">
                                                    {shipment?.currency}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* SHIPMENT TABLE */}
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Shipments Included (1)
                                    </h3>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCSVDownload}
                                    >
                                        <Download className="w-3.5 h-3.5 mr-1.5" />
                                        Export CSV
                                    </Button>
                                </div>

                                <div className="overflow-x-auto border rounded-xl border-primary">
                                    <table className="w-full text-sm">
                                        <thead className="bg-primary text-white border-b">
                                            <tr>
                                                <th className="px-4 py-4 text-left">
                                                    Tracking/BOL #
                                                </th>
                                                <th className="px-4 py-4 text-left">
                                                    Service
                                                </th>
                                                <th className="px-4 py-4 text-right">
                                                    Freight
                                                </th>
                                                <th className="px-4 py-4 text-right">
                                                    Adj.
                                                </th>
                                                <th className="px-4 py-4 text-right">
                                                    Addtl.
                                                </th>
                                                <th className="px-4 py-4 text-right">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-4 font-bold text-primary">
                                                    {shipment?.trackingNumber ||
                                                        shipment?.bolNumber ||
                                                        "-"}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {shipment?.serviceName}
                                                </td>

                                                <td className="px-4 py-4 text-right">
                                                    $
                                                    {Number(
                                                        shipment?.totalBaseCharge || 0
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="px-4 py-4 text-right">
                                                    $0.00
                                                </td>

                                                <td className="px-4 py-4 text-right">
                                                    $
                                                    {Number(
                                                        shipment?.totalSurcharges || 0
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="px-4 py-4 text-right font-bold">
                                                    $
                                                    {Number(
                                                        shipment?.totalNetCharge || 0
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <PayInvoiceModal
                open={isPayModalOpen}
                onOpenChange={setIsPayModalOpen}
                amount={totalDue}
                currency={shipment?.currency || "USD"}
                invoiceId={invoiceId || ""}
            />
        </div>
    )
}

function ChargeRow({
    label,
    value,
}: any) {
    return (
        <div className="flex justify-between text-sm py-1 border-b border-slate-50">
            <span className="text-slate-500">{label}</span>
            <span className="font-semibold">
                ${Number(value || 0).toFixed(2)}
            </span>
        </div>
    )
}

function SummaryRow({
    label,
    value,
    paid,
}: any) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-slate-500">{label}</span>
            <span className={paid ? "text-green-600 font-semibold" : "font-semibold"}>
                {paid ? "-" : ""}${Number(value || 0).toFixed(2)}
            </span>
        </div>
    )
}