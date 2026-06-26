import { ColumnDef, RowSelectionState, SortingState } from "@tanstack/react-table"
export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    sorting?: SortingState
    setSorting?: (updater: SortingState | ((prev: SortingState) => SortingState)) => void
    rowSelection?: RowSelectionState
    setRowSelection?: (updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => void
    enableMultiRowSelection?: boolean
    enableRowSelection?: boolean
}
export interface DataTableToolbarProps<TData, TValue> {
    search: string
    setSearch: (search: string) => void
    selectedRows: TData[]
    onBulkDelete: (selectedRows: TData[]) => void
    placeholder?: string
}

export interface DataTablePaginationProps<TData, TValue> {
    page: number
    totalPages: number
    setPage: (page: number) => void
}