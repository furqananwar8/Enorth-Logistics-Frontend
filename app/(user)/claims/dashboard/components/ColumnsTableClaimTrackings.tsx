"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, FileText, MoreVertical } from "lucide-react";
import { getCarrierImg } from "@/components/shared/ShippingRates/Components/carrier-card";

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
  {
      accessorKey: "carrier",
      header: "Carrier",
      cell: ({ row }) => {
        console.log("row.original.shipment.carrier", row.original.shipment?.carrier);
        return (
          <div className="h-24 w-24 p-2 flex justify-center items-center">
            {/* <Image src={"/FedExFreight.svg"} width={100} height={100} alt="Carrier Logo" /> */}
            {getCarrierImg(row.original.shipment.carrier)}
          </div>
        );
      },
    },
  {
    accessorKey: "trackingNumber",
    header: "Tracking #/BOL #",
    cell: ({ row }) => {
      return (
        <span className="text-foreground whitespace-nowrap text-center">
          {row.original?.shipment?.trackingNumber ||
            row.original.trackingNumber ||
            "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "shipDate",
    header: "Ship Date",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
        ? new Date(row.original.createdAt)
        : new Date();
      const time = createdAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const formattedDate = createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return (
        <div className="leading-tight whitespace-nowrap">
          {time}
          <br />
          <span className="text-muted-foreground">{formattedDate}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "shipFrom",
    header: "Ship From",
    cell: ({ row }) => {
      const address = row.original.addresses?.[0]?.addressBookEntry
        ? row.original.addresses[0].addressBookEntry.address
        : row.original.addresses?.[0]?.address;
      const address1 = address?.address1 || "";
      const city = address?.city || "";
      const state = address?.state || "";
      const country = address?.country || "";
      return (
        <span className="text-primary font-medium whitespace-nowrap">
          {address1}
          <br />
          {city}, {state}, {country}
        </span>
      );
    },
  },
  {
    accessorKey: "shipTo",
    header: "Ship To",
    cell: ({ row }) => {
      const address = row.original.addresses?.[1]?.addressBookEntry
        ? row.original.addresses[1].addressBookEntry.address
        : row.original.addresses?.[1]?.address;
      const address1 = address?.address1 || "";
      const city = address?.city || "";
      const state = address?.state || "";
      const country = address?.country || "";
      return (
        <span className="text-primary font-medium whitespace-nowrap">
          {address1}
          <br />
          {city}, {state}, {country}
        </span>
      );
    },
  },
  {
    accessorKey: "packagingDetails",
    header: "Packaging Details",
    cell: ({ row }) => {
      const totalUnits = row.original?.lineItems?.units?.length || 0;
      const totalWeight = row.original?.lineItems?.units?.reduce(
        (sum: number, u: { weight?: number }) => sum + (u?.weight || 0),
        0,
      );
      return (
        <div className="leading-tight capitalize">
          {totalUnits} {totalUnits === 1 ? "Pallet" : "Pallets"}
          <br />
          <span className="text-muted-foreground">
            Total Weight: {totalWeight} lbs
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "Unknown";
      return (
        <div className="leading-tight capitalize">
          {status.replaceAll("_", " ").toLowerCase()}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
    
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical size={16} className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-max">
            <DropdownMenuItem className="cursor-pointer">
              <Link
                className="flex gap-2 items-center w-full"
                href={`/track/single?id=${row.original?.id}`}
              >
                <Eye size={14} /> View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link
                href={`/claims/file?shipmentId=${row.original?.id}&action=create`}
                className="flex gap-2 items-center w-full"
              >
                <FileText size={14} /> Start Claim
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
