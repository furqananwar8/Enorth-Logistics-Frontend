"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Calendar } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
    cell: ({ row }) => {
      const invoiceNumber = row?.original?.invoiceNumber;
      return (
        <span className="text-primary font-medium whitespace-nowrap">
          {invoiceNumber}
        </span>
      );
    },
  },
  {
    accessorKey: "invoiceCreatedDate",
    header: "Invoice Created Date",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      const formattedDate = createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return (
        <span className="whitespace-nowrap text-muted-foreground">
          {formattedDate}
        </span>
      );
    },
  },
  {
    accessorKey: "invoiceAge",
    header: "Invoice Age",
    cell: ({ row }) => {
      // Mocking age
      const createdAt = new Date(row.original.createdAt);
      const today = new Date();

      const ageDays = Math.floor(
        (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      return <span className="whitespace-nowrap">{ageDays} Day(s)</span>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      // Mocking due date
      const dueDate = new Date(row.original.dueDate);
      const formattedDueDate = dueDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return (
        <div className="leading-tight whitespace-nowrap">
          <div className="flex items-center text-primary font-medium">
            <Calendar className="w-3 h-3 mr-1" /> Upcoming
          </div>
          <span className="text-xs text-muted-foreground">
            Due {formattedDueDate}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "invoiceAmount",
    header: "Invoice Amount",
    cell: ({ row }) => {
      console.log("row.original", row.original);
      const amount = row.original.totalAmount;
      const currency = row.original.currency;
      return (
        <span className="whitespace-nowrap">
          ${amount} {currency}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isPaid = row.original.paid
      return <span className="whitespace-nowrap">{isPaid ? "Paid" : "Pending"}</span>;
    },
  },
  // {
  //   accessorKey: "balanceDue",
  //   header: "Balance Due",
  //   cell: ({ row }) => {
  //     // Mocking same as amount
  //     const amount = (Math.random() * 500 + 50).toFixed(2);
  //     const currency = Math.random() > 0.5 ? "CAD" : "USD";
  //     return (
  //       <span className="font-semibold whitespace-nowrap">
  //         ${amount} {currency}
  //       </span>
  //     );
  //   },
  // },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 w-max">
          <Link
            className="flex gap-1 items-center text-primary hover:underline text-sm font-medium"
            href={`/invoices/single?id=${row.original.id || "FC15017348"}`}
          >
            <Eye size={14} /> View
          </Link>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical
                size={16}
                className="cursor-pointer text-muted-foreground"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-max">
              <DropdownMenuItem className="cursor-pointer">
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Send via Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      );
    },
  },
];
