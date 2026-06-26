"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { CircleSlash, RefreshCcw, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/table/DataTable";
import { DataTablePagination } from "@/components/common/table/DataTablePagination";
import { Loader } from "@/components/common/Loader";
import EmptyUI from "@/components/common/empty/Empty";
import { getAllUnverifiedUsers } from "@/api/services/auth.api";
import { columns } from "./ColumnsTableUsers";

interface Props {
  search: string;
  roleFilter: string;
  statusFilter: string;
  setCount: (count: { all: number; pending: number; approved: number }) => void;
}

export default function DynamicUsersTable({
  search,
  roleFilter,
  statusFilter,
  setCount,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);

  const {
    data: res,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["unverified-users"],
    queryFn: getAllUnverifiedUsers,
  });

  const usersList = res?.data || (Array.isArray(res) ? res : []);

  // Filter local data based on inputs
  const filteredUsers = usersList.filter((user: any) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = (user.phoneNumber || "").toLowerCase();

    const matchesSearch =
      search === "" ||
      fullName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      phone.includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && user.role === 1) ||
      (roleFilter === "user" && user.role === 2);

    const isApproved = user.accountIsVerified === true;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && isApproved) ||
      (statusFilter === "pending" && !isApproved);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate counts for parent tabs
  useEffect(() => {
    if (usersList && usersList.length > 0) {
      const pendingCount = usersList.filter(
        (u: any) => u.accountIsVerified !== true
      ).length;

      const approvedCount = usersList.filter(
        (u: any) => u.accountIsVerified === true
      ).length;

      setCount({
        all: usersList.length,
        pending: pendingCount,
        approved: approvedCount,
      });
    }
  }, [usersList, setCount]);

  if (isLoading || isPending) return <Loader className="py-20" />;

  if (isError)
    return (
      <EmptyUI
        icon={<CircleSlash size={80} />}
        title="Error"
        description="Failed to fetch users"
        action={
          <Button
            variant="outline"
            className="text-muted-foreground border-border"
            onClick={() => refetch()}
          >
            <RefreshCcw size={16} /> Retry
          </Button>
        }
      />
    );

  return filteredUsers.length > 0 ? (
    <>
      <div className="shadow-lg mb-4">
        <DataTable
          columns={columns}
          data={filteredUsers}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
      <div className="flex justify-end items-center mb-10">
        <DataTablePagination
          page={page}
          totalPages={1}
          setPage={setPage}
        />
      </div>
    </>
  ) : (
    <EmptyUI
      icon={<UsersIcon size={80} />}
      title="No Users Found"
      description="There are no users matching your filter criteria."
    />
  );
}