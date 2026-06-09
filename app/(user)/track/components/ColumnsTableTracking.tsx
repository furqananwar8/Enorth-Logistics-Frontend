"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  CircleCheck,
  CircleDollarSign,
  Edit,
  Eye,
  Heart,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addToFavorite,
  deleteQuote,
  removeFromFavorite,
} from "@/api/services/quotes.api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { normalText } from "../../packages/AddPackage";
import Image from "next/image";
import { AddSurchargesModal } from "../(AdditionalSurcharges)/AddSurchargesModal";
import { useState } from "react";
import { useAuth } from "@/context/auth.context";
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
      console.log(
        "row.original.shipment.carrier",
        row.original.shipment?.carrier,
      );
      return (
        <div className="h-24 w-24 p-2 flex justify-center items-center">
          {/* <Image src={"/FedExFreight.svg"} width={100} height={100} alt="Carrier Logo" /> */}
          {getCarrierImg(row.original.shipment.carrier)}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "transactionId",
  //   header: "Transaction #",
  //   cell: ({ row }) => {
  //     return (
  //       <span className="text-primary font-medium whitespace-nowrap">
  //         {row.original.transactionId}
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: "trackingNumber",
    header: "Tracking #/BOL #",
    cell: ({ row }) => {
      return (
        <span className="text-foreground whitespace-nowrap text-center">
          {row.original?.shipment?.trackingNumber || "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => {
      // show time first and date after and use 12 hour format
      const createdAt = row.original.createdAt;
      const dateObj = new Date(createdAt);

      // Format time in 12-hour format
      const time = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Format date
      const formattedDate = dateObj.toLocaleDateString("en-US", {
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
      const fromAddress = row.original.addresses?.find(
        (item: any) => item.type === "FROM",
      );

      const address = fromAddress?.addressBookEntry
        ? fromAddress.addressBookEntry.address
        : fromAddress?.address;

      const address1 = address?.address1;
      const city = address?.city;
      const state = address?.state;
      const country = address?.country;

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
      const fromAddress = row.original.addresses?.find(
        (item: any) => item.type === "TO",
      );

      const address = fromAddress?.addressBookEntry
        ? fromAddress.addressBookEntry.address
        : fromAddress?.address;

      const address1 = address?.address1;
      const city = address?.city;
      const state = address?.state;
      const country = address?.country;

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
      const totalUnits = row?.original?.lineItems?.units?.length;
      const totalWeight = row?.original?.lineItems?.units?.reduce(
        (sum: number, u: { weight?: number }) => sum + (u.weight || 0),
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
      const status = normalText(row.original.status);
      return <div className="leading-tight capitalize">{status}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { user } = useAuth();
      const queryClient = useQueryClient();
      const mutation = useMutation({
        mutationFn: (id: string) => deleteQuote(id),
        onSuccess: () => {
          toast.success("Contact deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["quotes"] });
        },
        onError: (error: AxiosError<ApiError>) => {
          toast.error(error.response?.data.message);
        },
      });
      const mutationAddToFavorite = useMutation({
        mutationFn: (id: string) => addToFavorite(id),
        onSuccess: () => {
          toast.success("Contact added to favorite successfully");
          queryClient.invalidateQueries({ queryKey: ["quotes"] });
        },
        onError: (error: AxiosError<ApiError>) => {
          toast.error(error.response?.data.message);
        },
      });
      const mutationRemoveFromFavorite = useMutation({
        mutationFn: (id: string) => removeFromFavorite(id),
        onSuccess: () => {
          toast.success("Contact removed from favorite successfully");
          queryClient.invalidateQueries({ queryKey: ["quotes"] });
        },
        onError: (error: AxiosError<ApiError>) => {
          toast.error(error.response?.data.message);
        },
      });
      const handleDeleteQuote = (id: string) => {
        mutation.mutate(id);
      };
      const handleAddToFavorite = (id: string) => {
        mutationAddToFavorite.mutate(id);
      };
      const handleRemoveFromFavorite = (id: string) => {
        mutationRemoveFromFavorite.mutate(id);
      };
      const isFavorite = true;
      const [open, setOpen] = useState(false);
      return (
        <div className="flex items-center gap-4 w-max">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical size={16} className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-max">
              {/* if role is admin enabled for testing for now */}
              {user.user.role.name === "superAdmin" ? (
                <DropdownMenuItem className="cursor-pointer">
                  <button
                    // variant={"ghost"}
                    className="w-full flex gap-2 cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    <CircleDollarSign size={14} /> Add Surcharges
                  </button>
                </DropdownMenuItem>
              ) : (
                ""
              )}
              {row.original.shipment ? (
                <DropdownMenuItem className="cursor-pointer">
                  <Link
                    className="flex gap-2 items-center w-full"
                    href={`/track/single?id=${row.original.id}`}
                  >
                    {/* view */}
                    <Eye size={14} /> View
                  </Link>
                </DropdownMenuItem>
              ) : (
                ""
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddSurchargesModal
            bookedShipment={row.original}
            open={open}
            onOpenChange={(open) => setOpen(open)}
          />
        </div>
      );
    },
  },
];
