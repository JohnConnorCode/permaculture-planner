import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingTable } from '@/components/loading-states'
import {
  ArrowUpDown, ArrowUp, ArrowDown, Search, Filter,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: keyof T | string
  header: string | React.ReactNode
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  error?: Error | null
  // Selection
  selectable?: boolean
  selectedRows?: Set<string | number>
  onSelectionChange?: (selected: Set<string | number>) => void
  getRowId?: (row: T) => string | number
  // Sorting
  sortable?: boolean
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  // Filtering
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  // Pagination
  paginated?: boolean
  pageSize?: number
  currentPage?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  // Actions
  actions?: (row: T) => React.ReactNode
  bulkActions?: React.ReactNode
  // Styling
  className?: string
  emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row) => row.id,
  sortable = false,
  onSort,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  paginated = false,
  pageSize = 10,
  currentPage = 1,
  totalItems,
  onPageChange,
  actions,
  bulkActions,
  className,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [localSelectedRows, setLocalSelectedRows] = React.useState(selectedRows)

  const effectiveSelectedRows = onSelectionChange ? selectedRows : localSelectedRows

  const handleSort = (key: string) => {
    if (!sortable) return

    let newDirection: 'asc' | 'desc' = 'asc'
    if (sortColumn === key && sortDirection === 'asc') {
      newDirection = 'desc'
    }

    setSortColumn(key)
    setSortDirection(newDirection)
    onSort?.(key, newDirection)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleSelectAll = () => {
    if (!selectable) return

    const newSelection = new Set<string | number>()
    if (effectiveSelectedRows.size !== data.length) {
      data.forEach(row => newSelection.add(getRowId(row)))
    }

    if (onSelectionChange) {
      onSelectionChange(newSelection)
    } else {
      setLocalSelectedRows(newSelection)
    }
  }

  const handleSelectRow = (rowId: string | number) => {
    if (!selectable) return

    const newSelection = new Set(effectiveSelectedRows)
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId)
    } else {
      newSelection.add(rowId)
    }

    if (onSelectionChange) {
      onSelectionChange(newSelection)
    } else {
      setLocalSelectedRows(newSelection)
    }
  }

  const getCellValue = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row)
    }

    const keys = String(column.key).split('.')
    let value: any = row
    for (const key of keys) {
      value = value?.[key]
    }
    return value?.toString() || '-'
  }

  // Pagination calculations
  const totalPages = paginated && totalItems ? Math.ceil(totalItems / pageSize) : 1
  const startItem = paginated ? (currentPage - 1) * pageSize + 1 : 1
  const endItem = paginated ? Math.min(currentPage * pageSize, totalItems || data.length) : data.length

  if (loading) {
    return <LoadingTable rows={pageSize} />
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading data: {error.message}</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header Actions */}
      {(searchable || bulkActions) && (
        <div className="flex items-center justify-between">
          {searchable && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={handleSearch}
                placeholder={searchPlaceholder}
                className="pl-10"
              />
            </div>
          )}
          {bulkActions && effectiveSelectedRows.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {effectiveSelectedRows.size} selected
              </span>
              {bulkActions}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={effectiveSelectedRows.size === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    column.className,
                    sortable && column.sortable && 'cursor-pointer hover:bg-muted/50'
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {typeof column.header === 'string' ? column.header : column.header}
                    {sortable && column.sortable && (
                      <span className="ml-auto">
                        {sortColumn === String(column.key) ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row)
                const isSelected = effectiveSelectedRows.has(rowId)

                return (
                  <TableRow
                    key={rowId}
                    className={cn(isSelected && 'bg-muted/50')}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectRow(rowId)}
                          aria-label={`Select row ${rowId}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={column.className}
                      >
                        {getCellValue(row, column)}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>{actions(row)}</TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {totalItems} items
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 2 + i
                  }
                  if (currentPage > totalPages - 3) {
                    pageNum = totalPages - 4 + i
                  }
                }
                if (pageNum > totalPages) return null

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => onPageChange?.(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}