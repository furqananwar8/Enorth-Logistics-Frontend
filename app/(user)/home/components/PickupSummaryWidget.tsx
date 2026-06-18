import React from "react";
import { Truck, AlertCircle } from "lucide-react";

export default function PickupSummaryWidget({
  todaysPickups,
  missedPickups,
}: {
  todaysPickups: number;
  missedPickups: number;
}) {
  return (
    <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-border bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
          Pickup Summary
        </h3>
      </div>

      <div className="p-4 flex gap-3">
        {/* Today's Pickups */}
        <div className="flex-1 border-2 border-primary dark:border-[#3da9fc] rounded flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            <Truck className="size-5 text-slate-700 dark:text-slate-300" />
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {todaysPickups}
            </span>
          </div>
          <div className="text-xs font-semibold text-primary dark:text-[#3da9fc] text-center">
            Today's Pickups
          </div>
        </div>

        {/* Missed Pickups */}
        <div className="flex-1 border-2 border-primary dark:border-[#3da9fc] rounded flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle className="size-5 text-red-600 dark:text-red-400" />
            <span className="text-xl font-bold text-red-600 dark:text-red-400">
              {missedPickups}
            </span>
          </div>
          <div className="text-xs font-semibold text-primary dark:text-[#3da9fc] text-center">
            Missed Pickups
          </div>
        </div>
      </div>
    </div>
  );
}
