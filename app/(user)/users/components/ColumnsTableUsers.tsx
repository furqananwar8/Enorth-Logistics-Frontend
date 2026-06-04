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

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const firstName = row.original.firstName || "";
      const lastName = row.original.lastName || "";
      return (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            <UserIcon size={16} />
          </div>
          <span className="font-semibold text-foreground">
            {firstName} {lastName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "User Role",
    cell: ({ row }) => {
      const roleId = row.original.role;
      const isSystemAdmin = roleId === 1;
      return (
        <Badge
          variant={isSystemAdmin ? "default" : "secondary"}
          className="flex gap-1 items-center w-max"
        >
          <Shield size={12} />
          {isSystemAdmin ? "Admin" : "User"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.original.permissions || [];
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {permissions.length > 0 ? (
            permissions.map((permission: any) => (
              <Badge
                key={permission.id || permission}
                variant="outline"
                className="capitalize text-[10px]"
              >
                {permission.name || permission}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">
              No Permissions
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      const dateStr = row.original.updatedAt || row.original.createdAt;
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      return (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>{date.toLocaleDateString()}</span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const user = row.original;


      const approveMutation = useMutation({
        mutationFn: (action: string) =>
          approveUser(user.id, { action: action }),
        onSuccess: () => {
          toast.success("User Status updated successfully");
          queryClient.invalidateQueries({ queryKey: ["unverified-users"] });
        },
        onError: (error: AxiosError<ApiError>) => {
          toast.error(
            error.response?.data?.message || "Failed to update user status",
          );
        },
      });

      return (
        <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              className="bg-green-500 hover:bg-green-700 text-white flex items-center gap-1"
              onClick={() => approveMutation.mutate("APPROVE")}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? (
                "Approving..."
              ) : (
                <>
                  <Check size={14} /> Approve
                </>
              )}
            </Button>
            {/* reject button */}
            {/* <Button
              size="sm"
              variant="default"
              className="bg-red-500 hover:bg-red-700 text-white flex items-center gap-1"
              onClick={() => approveMutation.mutate("REJECT")}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? (
                "Rejecting..."
              ) : (
                <>
                  <X size={14} /> Reject
                </>
              )}
            </Button> */}
          
        </div>
      );
    },
  },
];
