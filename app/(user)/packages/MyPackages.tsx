"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/common/table/DataTable"
import { DataTableToolbar } from "@/components/common/table/DataTableToolbar"
import { DataTablePagination } from "@/components/common/table/DataTablePagination"
import { columns } from "./ColumnTablePackages"
import { useDebounce } from "@/hooks/useDebounce.hook"
import { getAllAddressBookContacts, getRecentContacts } from "@/api/services/address-book.api"
import { Loader } from "@/components/common/Loader"
import EmptyUI from "@/components/common/empty/Empty"
import { BookUser, PackagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllPackages } from "@/api/services/packages.api"
import AddPackage from "./AddPackage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MyPackages({ selectedPackage, onSelect }: { selectedPackage?: string, onSelect?: (contact: any) => void }) {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [sorting, setSorting] = useState([])
    const [open, setOpen] = useState(false)
    const [packageType, setPackageType] = useState(selectedPackage ? selectedPackage : "all")

    const debouncedSearch = useDebounce(search, 500)

    const { data: packages, isLoading, isPending } = useQuery({
        queryKey: ["packages", debouncedSearch, packageType],
        queryFn: () => getAllPackages({ search: debouncedSearch, type: packageType === "all" ? "" : packageType }),
        staleTime: 5 * 60 * 1000,
        retry: 1
    })

    let updatedColumns = columns
    if (onSelect) {
        updatedColumns = columns.map((column) => {
            if (column.id === "actions") {
                const originalCell = column.cell

                return {
                    ...column,
                    cell: (props: any) => (
                        <div className="flex flex-row-reverse items-center gap-2">
                            {/* @ts-ignore */}
                            {originalCell?.(props)}

                            <Button
                                size="sm"
                                onClick={() => {
                                    onSelect(props.row.original);
                                    setOpen(false)
                                }}
                                className="bg-primary hover:bg-[#005999]"
                            >
                                Select
                            </Button>
                        </div>
                    ),
                }
            }

            return column
        })
    }

    return (
        <div className="h-full">
            {isLoading || isPending ? (
                <Loader className="h-full" />
            ) : (
                <div className="space-y-4 w-full">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 w-max sm:w-9/10">
                        <DataTableToolbar
                            search={search}
                            setSearch={setSearch}
                            selectedRows={[]}
                            onBulkDelete={(rows) => console.log(rows)}
                            placeholder="Search Package/Pallet"
                        />
                        <AddPackage
                            open={open}
                            setOpen={setOpen}
                        />
                    </div>
                    <div className={`flex gap-2 rounded-md bg-black/5 p-1 w-max ${!!selectedPackage ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {[
                            { value: "all", label: "All" },
                            { value: "PALLET", label: "Pallet" },
                            { value: "PACKAGE", label: "Package" },
                            { value: "COURIER_PAK", label: "Courier Pak" },
                        ].map((tab) => (
                            <button
                                type="button"
                                disabled={!!selectedPackage}
                                onClick={() => setPackageType(tab.value)}
                                className={`
                                    cursor-pointer px-2 py-1 
                                    rounded-md
                                    disabled:cursor-not-allowed
                                 data-[state=active]:border-primary
                                  data-[state=active]:bg-primary/10
                                   data-[state=active]:text-primary
                                    border 
                                     ${packageType === tab.value ? " border-primary bg-primary/10 text-primary" : "border-transparent"}`} key={tab.value}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {packages?.data.length > 0 ?
                        <>
                            <DataTable
                                columns={updatedColumns}
                                data={packages.data ?? []}
                                sorting={sorting}
                                // @ts-ignore
                                setSorting={setSorting}
                            />


                            <DataTablePagination
                                page={page}
                                totalPages={packages?.meta.totalPages ?? 1}
                                setPage={setPage}
                            />
                        </>
                        :
                        <EmptyUI
                            title="No Packages Found"
                            description="You haven't added any packages yet."
                            icon={<PackagePlus />}
                            action={
                                <AddPackage
                                    open={open}
                                    setOpen={setOpen}
                                />
                            }
                        />

                    }
                </div>)
            }
        </div>
    )
}