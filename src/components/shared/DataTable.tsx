'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export type SortOrder = 'asc' | 'desc' | null;

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectChange?: (selectedIds: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  statusFilterOptions?: { label: string; value: string }[];
  selectedStatus?: string;
  onStatusFilterChange?: (status: string) => void;
  onExport?: () => void;
  exportLabel?: string;
  actions?: React.ReactNode;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  isLoading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyAction?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  selectable = false,
  selectedIds = [],
  onSelectChange,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  statusFilterOptions,
  selectedStatus = '',
  onStatusFilterChange,
  onExport,
  exportLabel = 'Export',
  actions,
  pagination,
  isLoading = false,
  emptyTitle = 'No entries found',
  emptySubtitle = 'There are no records matching your current filter criteria.',
  emptyAction,
  className,
}: DataTableProps<T>) {
  const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
  const [internalSortOrder, setInternalSortOrder] = useState<SortOrder>(null);

  const handleSort = (key: string) => {
    if (internalSortKey === key) {
      if (internalSortOrder === 'asc') setInternalSortOrder('desc');
      else if (internalSortOrder === 'desc') {
        setInternalSortKey(null);
        setInternalSortOrder(null);
      }
    } else {
      setInternalSortKey(key);
      setInternalSortOrder('asc');
    }
  };

  const allPageIds = useMemo(
    () => data.map((item) => keyExtractor(item)),
    [data, keyExtractor]
  );

  const isAllSelected =
    allPageIds.length > 0 &&
    allPageIds.every((id) => selectedIds.includes(id));

  const isSomeSelected =
    allPageIds.some((id) => selectedIds.includes(id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (!onSelectChange) return;
    if (isAllSelected) {
      onSelectChange(selectedIds.filter((id) => !allPageIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedIds, ...allPageIds]));
      onSelectChange(merged);
    }
  };

  const toggleSelectOne = (id: string) => {
    if (!onSelectChange) return;
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectChange([...selectedIds, id]);
    }
  };

  const hasToolbar =
    searchable ||
    (statusFilterOptions && statusFilterOptions.length > 0) ||
    onExport ||
    actions;

  return (
    <div
      className={cn(
        'w-full border border-solid border-slate-200 rounded-[18px] bg-white overflow-hidden shadow-xs flex flex-col',
        className
      )}
    >
      {/* Top Filter & Actions Toolbar */}
      {hasToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-200 bg-white">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
            {/* Search Box */}
            {searchable && (
              <div className="relative flex items-center min-w-[220px] max-w-sm flex-1">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-10 pl-9.5 pr-3.5 rounded-[11px] border border-slate-300 bg-white text-14 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 focus:ring-3 focus:ring-brand-100 transition"
                />
              </div>
            )}

            {/* Status Filter */}
            {statusFilterOptions && statusFilterOptions.length > 0 && (
              <select
                value={selectedStatus}
                onChange={(e) => onStatusFilterChange?.(e.target.value)}
                className="h-10 rounded-[11px] border border-slate-300 bg-white px-3 pr-8 text-13 font-semibold text-slate-700 focus:outline-none focus:border-brand-600 focus:ring-3 focus:ring-brand-100 transition cursor-pointer"
              >
                <option value="">All statuses</option>
                {statusFilterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-2.5">
            {onExport && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onExport}
                leftIcon={
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                }
              >
                {exportLabel}
              </Button>
            )}
            {actions}
          </div>
        </div>
      )}

      {/* Multi-selection bar */}
      {selectable && selectedIds.length > 0 && (
        <div className="bg-brand-50 px-5 py-2.5 border-b border-brand-200 flex items-center justify-between text-13 font-bold text-brand-900 animate-in fade-in">
          <span>{selectedIds.length} item(s) selected</span>
          <button
            type="button"
            onClick={() => onSelectChange?.([])}
            className="text-xs text-brand-700 hover:text-brand-900 underline cursor-pointer"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="w-full overflow-x-auto relative">
        <table className="w-full border-collapse text-14 text-left">
          <thead>
            <tr>
              {selectable && (
                <th className="py-3 px-4 bg-slate-50 uppercase whitespace-nowrap text-12 font-bold tracking-[.05em] text-slate-600 border-b border-slate-200 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={toggleSelectAll}
                    aria-label="Select all on this page"
                    className="w-4.5 h-4.5 rounded border-slate-300 accent-brand-600 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = internalSortKey === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      'py-3 px-4 bg-slate-50 uppercase whitespace-nowrap text-12 font-bold tracking-[.05em] text-slate-600 border-b border-slate-200 select-none',
                      col.sortable && 'cursor-pointer hover:bg-slate-100',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.className
                    )}
                  >
                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5',
                        col.align === 'center' && 'justify-center',
                        col.align === 'right' && 'justify-end'
                      )}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400 text-xs">
                          {isSorted ? (
                            internalSortOrder === 'asc' ? (
                              '▲'
                            ) : (
                              '▼'
                            )
                          ) : (
                            <span className="opacity-40">▲▼</span>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-slate-500"
                >
                  <div className="inline-flex items-center gap-2.5 font-semibold text-14">
                    <svg
                      className="animate-spin h-5 w-5 text-brand-600"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-16 text-center"
                >
                  <div className="max-w-xs mx-auto flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </div>
                    <h3 className="m-0 text-16 font-bold text-slate-900">
                      {emptyTitle}
                    </h3>
                    <p className="m-0 text-13 text-slate-500">
                      {emptySubtitle}
                    </p>
                    {emptyAction && <div className="mt-3">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => {
                const itemId = keyExtractor(item);
                const isSelected = selectedIds.includes(itemId);

                return (
                  <tr
                    key={itemId}
                    className={cn(
                      'transition-colors hover:bg-[#FAFCFF]',
                      isSelected && 'bg-brand-50/40'
                    )}
                  >
                    {selectable && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(itemId)}
                          aria-label="Select row"
                          className="w-4.5 h-4.5 rounded border-slate-300 accent-brand-600 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'py-3 px-4 whitespace-nowrap text-14 text-slate-800',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right',
                          col.className
                        )}
                      >
                        {col.render
                          ? col.render(item, rowIndex)
                          : (item as Record<string, unknown>)[col.key] != null
                          ? String((item as Record<string, unknown>)[col.key])
                          : '-'}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 px-5 border-t border-slate-100 bg-slate-50/50">
          <span className="text-13 text-slate-600" aria-live="polite">
            Showing{' '}
            <b className="text-slate-900 font-bold">
              {pagination.total === 0
                ? 0
                : (pagination.page - 1) * pagination.pageSize + 1}
              -
              {Math.min(pagination.page * pagination.pageSize, pagination.total)}
            </b>{' '}
            of <b className="text-slate-900 font-bold">{pagination.total}</b>
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={
                pagination.page * pagination.pageSize >= pagination.total ||
                isLoading
              }
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

