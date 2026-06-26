"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CircleCheck,
  Check,
  Shield,
  User as UserIcon,
  Calendar,
  CheckCircle,
  X,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveUser } from "@/api/services/auth.api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { User } from "../../settings/(user-preference)/UserTable";
import { useState } from "react";
import AddRatesModal from "../AddCompanyRatesModal";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name || "";
      return (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            <UserIcon size={16} />
          </div>
          <span className="font-semibold text-foreground">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address;
      return (
        <span className="text-primary font-medium whitespace-nowrap">
          {address.address1}
          <br />
          {address.city}, {address.state}, {address.country}
        </span>
      );
    },
  },
  {
    accessorKey: "totalRates",
    header: "Total Rates",
    cell: ({ row }) => {
      const ftl = row.original.ftlRateToBeChargedPerShipment;
      const ltl = row.original.ltlRateToBeChargedPerShipment;
      return (
        <div className="flex flex-col">
          <span className="text-primary font-medium whitespace-nowrap">
            LTL: {ltl} USD
          </span>
          <span className="text-primary font-medium whitespace-nowrap">
            FTL: {ftl} USD
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              className="bg-primary text-white flex items-center gap-1"
              onClick={() => setOpen(true)}
            >
              Add Rates
            </Button>
          </div>
          <AddRatesModal
            open={open}
            onOpenChange={setOpen}
            companyId={row.original.id}
          />
        </div>
      );
    },
  },
];
