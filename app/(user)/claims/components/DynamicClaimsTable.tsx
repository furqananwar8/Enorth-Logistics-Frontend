import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/table/DataTable";
import { DataTablePagination } from "@/components/common/table/DataTablePagination";
import { columns } from "./ColumnsTableClaims";
import { SortingState } from "@tanstack/react-table";
import { CircleSlash, FileText, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce.hook";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/common/Loader";
import EmptyUI from "@/components/common/empty/Empty";
import Link from "next/link";
import { getAllClaims } from "@/api/services/claims.api";

interface Props {
  filters: {
    dateRange: any;
    search: string;
    selectedPackaging: string[];
    selectedCarrier?: string;
    selectedService?: string;
    selectedStatus?: string;
    shipmentDetail?: string;
    selectedBookedBy?: string;
    selectedUsername?: string;
    selectedOrderSource?: string;
    originPostal?: string;
    destinationPostal?: string;
  };
  claimCategory: any;
  setCount: (count: {
    all: number;
    pending: number;
    approved: number;
    denied: number;
    paid: number;
  }) => void;
}

export default function DynamicClaimsTable({
  filters,
  claimCategory,
  setCount,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search, 500);

  const {
    data: claims,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["claims", claimCategory, debouncedSearch, filters],
    queryFn: () => getAllClaims(filters),
    retry: 1,
    enabled: true,
  });
  useEffect(() => {
    if (claims?.claims?.length > 0 && (!isLoading || !isPending)) {
      setCount({
        all: claims?.claims.length || 0,
        pending:
          claims?.claims.filter((c: any) => c.status === "PENDING").length || 0,
        approved:
          claims?.claims.filter((c: any) => c.status === "APPROVED").length ||
          0,
        denied:
          claims?.claims.filter((c: any) => c.status === "DENIED").length || 0,
        paid:
          claims?.claims.filter((c: any) => c.status === "PAID").length || 0,
      });
    }
  }, [claims]);
  if (isLoading || isPending) return <Loader className="py-20" />;
  if (isError)
    return (
      <EmptyUI
        icon={<CircleSlash size={80} />}
        title="Error"
        description="Failed to fetch claims"
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

  let displayData = claims?.claims || [];
  // set count on useEffect when claims change


  return displayData.length > 0 ? (
    <>
      <div className="shadow-sm border rounded-md mb-4">
        <DataTable
          columns={columns}
          data={displayData}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
      <div className="flex justify-between items-center mb-10">
        <Button
          variant="outline"
          className="text-muted-foreground border-border"
        >
          <Trash2 size={16} className="mr-2" /> Delete
        </Button>
        <DataTablePagination page={page} totalPages={1} setPage={setPage} />
      </div>
    </>
  ) : (
    <EmptyUI
      icon={<FileText size={80} />}
      title="No Claims Found"
      description="You have no claims matching these filters."
      action={
        <Link href="/claims/file">
          <Button
            variant="outline"
            className="text-muted-foreground border-border"
          >
            Submit New Claim
          </Button>
        </Link>
      }
    />
  );
}
