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
  Edit,
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
import { useAuth } from "@/context/auth.context";

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
  // {
  //   accessorKey: "name",
  //   header: "Name",
  //   cell: ({ row }) => {
  //     return (
  //       <span className="text-primary dark:text-white font-medium whitespace-nowrap">
  //         {row.original.quoteId}
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: "quoteId",
    header: "Quote ID",
    cell: ({ row }) => {
      return (
        <span className="text-primary dark:text-white font-medium whitespace-nowrap">
          {row.original.quoteId ? row.original.quoteId : row.original.quote.quoteId}
        </span>
      );
    },
  },
  // {
  //   accessorKey: "transactionId",
  //   header: "Transaction #",
  //   cell: ({ row }) => {
  //     return (
  //       <span className="text-foreground whitespace-nowrap">
  //         {row.original.transactionId}
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: "dateCreated",
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
          <span className="text-muted-foreground ">{formattedDate}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "shipFrom",
    header: "Ship From",
    cell: ({ row }) => {
      

      const fromAddress = (row.original.addresses ? row.original.addresses : row.original.quote.addresses).find(
        (item: any) => item.type === "FROM",
      );

      const address = fromAddress?.addressBookEntry
        ? fromAddress.addressBookEntry.address
        : fromAddress?.address;

      const address1 = address?.address1;
      const city = address?.city;
      const state = address?.state;
      const country = address?.country;

      console.log("address1", row.original)

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
      const fromAddress = (row.original.addresses ? row.original.addresses : row.original.quote.addresses).find(
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
          <span className="text-muted-foreground">{totalWeight} lbs</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
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
      const { isAdmin } = useAuth();
      const isSpotQuote =
        row?.original?.shipmentType?.includes("SPOT") ||
        row?.original?.shipmentType?.includes("TIME_CRITICAL");
      return (
        <div className="flex items-center gap-4 w-max">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical size={16} className="cursor-pointer" />
            </DropdownMenuTrigger>
            {isAdmin ? (
              <DropdownMenuContent align="end" className="w-max">
                <DropdownMenuItem className="cursor-pointer">
                  <Link
                    className="flex gap-2 items-center w-full"
                    href={
                      `/quote?id=${row.original.id}&isSpotQuote=true`
                    }
                  >
                    <CircleCheck size={14} /> View
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent align="end" className="w-max">
                {!isSpotQuote ? (
                  <DropdownMenuItem className="cursor-pointer">
                    <Link
                      className="flex gap-2 items-center w-full"
                      href={
                        row.original.shipment
                          ? `/shipment?id=${row.original.id}`
                          : `/shipment?id=${row.original.id}&mode=conversion`
                      }
                    >
                      <CircleCheck size={14} /> Book Now
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="cursor-pointer">
                    <Link
                      className="flex gap-2 items-center w-full"
                      href={
                        row.original.shipment
                          ? `/shipment?id=${row.original.id}`
                          : `/shipment?id=${row.original.id}&mode=conversion`
                      }
                    >
                      <CircleCheck size={14} /> View
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  className="cursor-pointer w-max"
                  onClick={() => {
                    handleAddToFavorite(row.original.id);
                  }}
                >
                  <Heart size={14} /> Add to Favorites
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer">
                  <Link
                    className="flex gap-2 items-center w-full"
                    href={
                      isSpotQuote
                        ? `/quote?id=${row.original.id}&mode=edit&isSpotQuote=${isSpotQuote}`
                        : row.original.shipment
                          ? `/shipment?id=${row.original.id}&mode=edit`
                          : `/quote?id=${row.original.id}&mode=edit`
                    }
                  >
                    <Edit size={14} /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteQuote(row.original.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      );
    },
  },
];
