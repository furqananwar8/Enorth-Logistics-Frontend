"use client"

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTableProps } from "./data-table.types"

export function DataTable<TData, TValue>({
    columns,
    data,
    sorting,
    setSorting,
    enableMultiRowSelection=false,
    enableRowSelection=false
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        // @ts-ignore
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableMultiRowSelection: enableMultiRowSelection,
        enableRowSelection: enableRowSelection
    })
    return (
        <div className="rounded-md border">
            <Table>

                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>

                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>

                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}

                                </TableHead>
                            ))}

                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>

                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-primary/10">

                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}

                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                No results
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>

            </Table>
        </div>
    )
}