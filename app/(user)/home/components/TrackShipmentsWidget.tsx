import React from "react"
import { Search, CalendarCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TrackShipmentsWidget() {
    return (
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded overflow-hidden mb-6">
           <div className="px-4 py-3 border-b border-slate-200 dark:border-border bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Search className="size-4 text-primary dark:text-[#3da9fc]" /> Track Shipments
                </h3>
            </div>

           <div className="p-4">
                <div className="flex items-center mb-3">
                    <input
                        disabled
                        type="text"
                        placeholder="#0000000000"
                        className="flex-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-l px-3 py-2 text-sm focus:outline-none focus:border-primary disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                    />
                    
                    <Button 
                        disabled
                        className="text-white px-3! py-2! rounded-r-lg! rounded-l-none flex items-center justify-center border! border-primary! dark:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Search className="size-4" />
                    </Button>
                </div>
        
                <Link href="/track" className="text-sm font-medium text-primary dark:text-[#3da9fc] hover:underline flex items-center gap-1.5">
                    <CalendarCheck className="size-4" />
                    View Today's Shipments (0)
                </Link>
            </div>
        </div>
    )
}
