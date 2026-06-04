"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Eye, Mail, MoreVertical } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // CLAIM ID
  {
    accessorKey: "claimId",
    header: "Claim #",
    cell: ({ row }) => (
      <span className="text-primary font-medium whitespace-nowrap">
        {row.original.claimId}
      </span>
    ),
  },

  // TRACKING
  {
    id: "trackingNumber",
    header: "Tracking / BOL #",
    cell: ({ row }) => {
      const tracking = row.original.shipment?.trackingNumber;
      const bol = row.original.shipment?.bolNumber;

      return (
        <span className="text-primary font-medium whitespace-nowrap">
          {tracking || bol || "-"}
        </span>
      );
    },
  },

  // DATE
  {
    accessorKey: "createdAt",
    header: "Claim Date",
    cell: ({ row }) => {
      const date = row.original.createdAt
        ? new Date(row.original.createdAt)
        : null;

      return (
        <span className="whitespace-nowrap text-muted-foreground">
          {date
            ? date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </span>
      );
    },
  },

  // AGE (real instead of random)
  {
    id: "age",
    header: "Age",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      const diffDays = Math.floor(
        (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      return <span>{diffDays} Days</span>;
    },
  },

  // STATUS
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      let statusColor = "text-primary";
      if (status === "APPROVED") statusColor = "text-green-600";
      if (status === "PAID") statusColor = "text-green-600";
      if (status === "DENIED") statusColor = "text-red-600";
      if (status === "SUBMITTED") statusColor = "text-orange-500";
      if (status === "PENDING") statusColor = "text-orange-500";

      return (
        <div className="flex items-center gap-1 font-medium whitespace-nowrap">
          <span className={statusColor}>{status}</span>
        </div>
      );
    },
  },

  // AMOUNT
  {
    accessorKey: "totalValueOfGoods",
    header: "Claim Amount",
    cell: ({ row }) => {
      const amount = row.original.totalValueOfGoods;
      const currency = row.original.currency || "USD";

      return (
        <span className="whitespace-nowrap font-medium">
          {amount} {currency}
        </span>
      );
    },
  },

  // ACTIONS
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 w-max">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical
                size={16}
                className="cursor-pointer text-muted-foreground"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-max">
              <DropdownMenuItem>
                <Link
                  className="flex gap-1 items-center text-primary hover:underline text-sm font-medium"
                  href={`/claims/file?claimId=${row.original.id}&shipmentId=${row.original.shipment.id}&action=edit`}
                >
                  <Eye size={14} />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="w-max cursor-pointer">
                <Download size={14} />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="w-max cursor-pointer">
                <Mail size={14} />
                Send via Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
