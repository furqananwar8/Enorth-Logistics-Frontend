import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/table/DataTable";
import { DataTablePagination } from "@/components/common/table/DataTablePagination";
import { columns } from "./ColumnsTableInvoices";
import { SortingState } from "@tanstack/react-table";
import { CircleSlash, FileText, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce.hook";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/common/Loader";
import EmptyUI from "@/components/common/empty/Empty";
import Link from "next/link";
import { getAllInvoices } from "@/api/services/invoices.api";

interface Props {
  filters: {
    dateRange: any;
    search: string;
    selectedPackaging: string[];
    selectedCarrier: string;
    selectedService: string;
    selectedStatus: string;
    shipmentDetail: string;
    selectedBookedBy: string;
  };
  invoiceCategory: any;
  currencyFilter: string;
  setCount: any;
}

export default function DynamicInvoicesTable({
  filters,
  invoiceCategory,
  currencyFilter,
  setCount,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedShipmentDetail = useDebounce(filters.shipmentDetail, 500);
  // const displayData = useMemo(() => invoicesResponse?.data || [], [invoicesResponse]);

  const {
    data: invoicesResponse,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: [
      "invoices",
      invoiceCategory,
      debouncedSearch,
      debouncedShipmentDetail,
      filters,
      currencyFilter,
    ],
    queryFn: () => {
      const dateFrom = filters.dateRange?.from
        ? new Date(filters.dateRange.from).toISOString().split("T")[0]
        : "";
      const dateTo = filters.dateRange?.to
        ? new Date(filters.dateRange.to).toISOString().split("T")[0]
        : "";

      return getAllInvoices(
        debouncedSearch,
        [dateFrom, dateTo],
        filters.selectedPackaging?.join(",") || "",
        filters.selectedCarrier || "",
        filters.selectedService || "",
        filters.selectedStatus || "",
        debouncedShipmentDetail,
        filters.selectedBookedBy || "",
        invoiceCategory,
        currencyFilter,
      );
    },
    retry: 1,
    enabled: true,
  });
  useEffect(() => {
    if (invoicesResponse?.data?.length > 0 && (!isLoading || !isPending)) {
      setCount({
        all: invoicesResponse?.data?.length || 0,
        // upcoming:
        //   claims?.claims.filter((c: any) => c.status === "PENDING").length || 0,
        // overdue:
        //   claims?.claims.filter((c: any) => c.status === "APPROVED").length ||
        //   0,
        // urgent:
        //   claims?.claims.filter((c: any) => c.status === "DENIED").length || 0,
        // unpaid:
        //   claims?.claims.filter((c: any) => c.status === "PAID").length || 0,
        upcoming: 0,
        overdue: 0,
        urgent: 0,
        unpaid: 0,
      });
    }
  }, [invoicesResponse]);
  if (isLoading || isPending) return <Loader className="py-20" />;
  if (isError)
    return (
      <EmptyUI
        icon={<CircleSlash size={80} />}
        title="Error"
        description="Failed to fetch invoices"
        action={
          <Button
            variant="outline"
            className="text-muted-foreground border-border"
          >
            <RefreshCcw size={16} /> Retry
          </Button>
        }
      />
    );

  return invoicesResponse.data.length > 0 ? (
    <>
      <div className="shadow-sm border rounded-md mb-4">
        <DataTable
          columns={columns}
          data={invoicesResponse.data}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
      <div className="flex justify-end items-center mb-10">
        <DataTablePagination page={page} totalPages={1} setPage={setPage} />
      </div>
    </>
  ) : (
    <EmptyUI
      icon={<FileText size={80} />}
      title="No Invoices Found"
      description="You have no invoices matching these filters."
      action={
        <Link href="/track">
          <Button
            variant="outline"
            className="text-muted-foreground border-border"
          >
            Go to Tracking
          </Button>
        </Link>
      }
    />
  );
}
