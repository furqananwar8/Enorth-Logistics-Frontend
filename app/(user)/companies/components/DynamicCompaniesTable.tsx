"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { Building2, CircleSlash, RefreshCcw, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/table/DataTable";
import { DataTablePagination } from "@/components/common/table/DataTablePagination";
import { Loader } from "@/components/common/Loader";
import EmptyUI from "@/components/common/empty/Empty";
import { getAllCompanies, getAllUnverifiedUsers, getAllUsers } from "@/api/services/auth.api";
import { columns } from "./ColumnsTableCompanies";

interface Props {
  search: string;
  roleFilter: string;
  statusFilter: string;
  setCount: (count: { all: number; pending: number; approved: number }) => void;
}

export default function DynamicCompaniesTable({
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
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });

  const companyList = res?.data || (Array.isArray(res) ? res : []);

  // Filter local data based on inputs
  const filteredCompanies = companyList.filter((user: any) => {
    // Search filter
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = (user.phoneNumber || "").toLowerCase();
    const matchesSearch =
      search === "" ||
      fullName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      phone.includes(search.toLowerCase());

    // Role filter
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && user.role === 1) ||
      (roleFilter === "user" && user.role === 2);

    // Status filter
    const isApproved =
      user.isApproved ||
      user.approved ||
      user.status === "APPROVED" ||
      user.role === 1;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && isApproved) ||
      (statusFilter === "pending" && !isApproved);

    return matchesSearch && matchesRole && matchesStatus;
  });
  console.log("filteredCompanies", filteredCompanies)
  // Calculate counts for parent tabs
  useEffect(() => {
    if (companyList) {
      const pendingCount = companyList.filter(
        (u: any) =>
          !(
            u.isApproved ||
            u.approved ||
            u.status === "APPROVED" ||
            u.role === 1
          )
      ).length;

      const approvedCount = companyList.filter(
        (u: any) =>
          u.isApproved ||
          u.approved ||
          u.status === "APPROVED" ||
          u.role === 1
      ).length;

      // setCount({
      //   all: companyList.length,
      //   pending: pendingCount,
      //   approved: approvedCount,
      // });
    }
  }, [companyList, setCount]);

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

  return filteredCompanies.length > 0 ? (
    <>
      <div className="shadow-lg mb-4">
        <DataTable
          columns={columns}
          data={filteredCompanies}
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
      icon={<Building2 size={80} />}
      title="No Companies Found"
      description="There are no companies matching your filter criteria."
    />
  );
}
