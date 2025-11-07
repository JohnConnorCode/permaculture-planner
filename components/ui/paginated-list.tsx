/**
 * PaginatedList - Reusable component for handling large lists
 *
 * Features:
 * - Client-side pagination
 * - Customizable page size
 * - Loading states
 * - Empty states
 * - Accessible navigation
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginatedListProps<T> {
  /** Array of items to paginate */
  items: T[]
  /** Number of items per page (default: 20) */
  pageSize?: number
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Optional class name for list container */
  className?: string
  /** Optional empty state */
  emptyState?: React.ReactNode
  /** Show page numbers (default: true) */
  showPageNumbers?: boolean
  /** Show item count (default: true) */
  showItemCount?: boolean
}

export function PaginatedList<T>({
  items,
  pageSize = 20,
  renderItem,
  className,
  emptyState,
  showPageNumbers = true,
  showItemCount = true,
}: PaginatedListProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(items.length / pageSize)
  const hasMultiplePages = totalPages > 1

  const currentItems = useMemo(() => {
    const start = currentPage * pageSize
    const end = start + pageSize
    return items.slice(start, end)
  }, [items, currentPage, pageSize])

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const handlePageJump = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, page)))
  }

  // Reset to first page if items change
  React.useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0)
    }
  }, [items.length, totalPages, currentPage])

  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className="space-y-4">
      {/* Item count */}
      {showItemCount && items.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Showing {currentPage * pageSize + 1}-
          {Math.min((currentPage + 1) * pageSize, items.length)} of {items.length}
        </div>
      )}

      {/* Items list */}
      <div className={cn('space-y-2', className)}>
        {currentItems.map((item, index) => (
          <React.Fragment key={currentPage * pageSize + index}>
            {renderItem(item, currentPage * pageSize + index)}
          </React.Fragment>
        ))}
      </div>

      {/* Pagination controls */}
      {hasMultiplePages && (
        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {/* Page numbers */}
          {showPageNumbers && (
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show first 3, last 1, and current page
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i
                } else if (currentPage < 3) {
                  pageNum = i
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 5 + i
                } else {
                  if (i === 0) pageNum = 0
                  else if (i === 4) pageNum = totalPages - 1
                  else pageNum = currentPage - 1 + i
                }

                const isCurrentPage = pageNum === currentPage
                const showEllipsis =
                  totalPages > 5 &&
                  ((i === 1 && currentPage > 3) ||
                    (i === 3 && currentPage < totalPages - 3))

                if (showEllipsis) {
                  return (
                    <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  )
                }

                return (
                  <Button
                    key={pageNum}
                    variant={isCurrentPage ? 'default' : 'outline'}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => handlePageJump(pageNum)}
                    aria-label={`Go to page ${pageNum + 1}`}
                    aria-current={isCurrentPage ? 'page' : undefined}
                  >
                    {pageNum + 1}
                  </Button>
                )
              })}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Simplified version for "Show More" pattern
 */
interface ShowMoreListProps<T> {
  items: T[]
  initialCount?: number
  increment?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  emptyState?: React.ReactNode
}

export function ShowMoreList<T>({
  items,
  initialCount = 10,
  increment = 10,
  renderItem,
  className,
  emptyState,
}: ShowMoreListProps<T>) {
  const [displayCount, setDisplayCount] = useState(initialCount)

  const visibleItems = items.slice(0, displayCount)
  const hasMore = displayCount < items.length
  const remaining = items.length - displayCount

  const handleShowMore = () => {
    setDisplayCount((prev) => Math.min(prev + increment, items.length))
  }

  const handleShowAll = () => {
    setDisplayCount(items.length)
  }

  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className="space-y-4">
      {/* Items list */}
      <div className={cn('space-y-2', className)}>
        {visibleItems.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
        ))}
      </div>

      {/* Show more controls */}
      {hasMore && (
        <div className="flex items-center justify-center gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={handleShowMore}>
            Show {Math.min(increment, remaining)} More
          </Button>
          {remaining > increment && (
            <Button variant="ghost" size="sm" onClick={handleShowAll}>
              Show All ({remaining} remaining)
            </Button>
          )}
        </div>
      )}

      {/* Count indicator */}
      {items.length > initialCount && (
        <div className="text-center text-xs text-muted-foreground">
          Showing {visibleItems.length} of {items.length}
        </div>
      )}
    </div>
  )
}
