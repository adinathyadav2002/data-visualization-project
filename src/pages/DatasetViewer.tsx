import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Columns,
  ArrowLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  RotateCcw,
  FileSpreadsheet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DatasetRow {
  [key: string]: any;
}

interface DatasetViewerProps {
  data: DatasetRow[];
  columns: { [key: string]: string };
  onBack?: () => void;
}

const DatasetViewer: React.FC<DatasetViewerProps> = (props) => {
  // Support both legacy and new full dataset structure
  let data = props.data;
  let columns = props.columns;
  if (
    typeof props.data === "object" &&
    !Array.isArray(props.data) &&
    props.data !== null &&
    "data" in props.data &&
    "columns" in props.data
  ) {
    const d = props.data as {
      data: DatasetRow[];
      columns: { [key: string]: string };
    };
    data = d.data;
    columns = d.columns;
  }
  const { onBack } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    Object.keys(columns)
  );
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterModalSearch, setFilterModalSearch] = useState("");

  const activeFilterCount = useMemo(() => {
    return Object.values(columnFilters).filter((v) => Boolean(v && v.trim())).length;
  }, [columnFilters]);

  // Filter data based on search and column filters
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Global search
      const matchesSearch =
        searchTerm === "" ||
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Column filters
      const matchesFilters = Object.entries(columnFilters).every(
        ([column, filterValue]) => {
          if (!filterValue) return true;
          const cellValue = row[column]?.toString().toLowerCase() || "";
          return cellValue.includes(filterValue.toLowerCase());
        }
      );

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, columnFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = aValue.toString().localeCompare(bValue.toString());
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters((prev) => {
      const updated = { ...prev };
      if (!value || value.trim() === "") {
        delete updated[column];
      } else {
        updated[column] = value;
      }
      return updated;
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setColumnFilters({});
    setSortColumn("");
    setCurrentPage(1);
  };

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const getUniqueValues = (column: string) => {
    const values = data
      .map((row) => row[column])
      .filter((val) => val !== null && val !== undefined)
      .map((val) => val.toString().trim())
      .filter((val) => val.length > 0);
    return Array.from(new Set(values)).slice(0, 20);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(i)}
            className="h-7 w-7 p-0 text-xs"
          >
            {i}
          </Button>
        );
      }
    } else {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(1)}
          className="h-7 w-7 p-0 text-xs"
        >
          1
        </Button>
      );

      if (currentPage > 3) {
        buttons.push(
          <span key="dots1" className="px-1 text-xs text-gray-400">
            ...
          </span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          buttons.push(
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(i)}
              className="h-7 w-7 p-0 text-xs"
            >
              {i}
            </Button>
          );
        }
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="dots2" className="px-1 text-xs text-gray-400">
            ...
          </span>
        );
      }

      if (totalPages > 1) {
        buttons.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(totalPages)}
            className="h-7 w-7 p-0 text-xs"
          >
            {totalPages}
          </Button>
        );
      }
    }

    return buttons;
  };

  // Filter columns list in modal based on search
  const modalColumns = useMemo(() => {
    const allCols = Object.keys(columns);
    if (!filterModalSearch.trim()) return allCols;
    return allCols.filter((col) =>
      col.toLowerCase().includes(filterModalSearch.toLowerCase())
    );
  }, [columns, filterModalSearch]);

  if (!data.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Dataset Available
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Please upload a dataset first to view it here.
          </p>
          {onBack && (
            <Button onClick={onBack} size="sm" className="bg-blue-600 hover:bg-blue-700">
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 p-3 sm:p-5 flex flex-col gap-3">
      {/* Top Header & Compact Search/Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200/80 p-3 shadow-sm flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Dataset Viewer
              </h1>
              <p className="text-xs text-gray-500">
                {sortedData.length === data.length
                  ? `${data.length.toLocaleString()} total rows`
                  : `Showing ${sortedData.length.toLocaleString()} of ${data.length.toLocaleString()} filtered rows`}
                {" • "}
                {visibleColumns.length} of {Object.keys(columns).length} columns visible
              </p>
            </div>
          </div>

          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="h-8 text-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Analysis
            </Button>
          )}
        </div>

        {/* Compact Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left side: Search & Filter triggers */}
          <div className="flex flex-1 items-center gap-2 min-w-[260px] max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search across all data..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 pl-8 pr-7 text-xs bg-gray-50/50 border-gray-200 focus-visible:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Filter Modal Trigger Button */}
            <Button
              variant={activeFilterCount > 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setIsFilterModalOpen(true)}
              className={cn(
                "h-8 text-xs flex items-center gap-1.5 shrink-0",
                activeFilterCount > 0
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-white text-blue-600 text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Clear All Button if any filter/search is active */}
            {(searchTerm || activeFilterCount > 0 || sortColumn) && (
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 shrink-0"
                title="Clear all filters and search"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>

          {/* Right side: Columns & Rows Per Page */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-gray-200 flex items-center gap-1.5"
                >
                  <Columns className="h-3.5 w-3.5 text-gray-500" />
                  <span className="hidden sm:inline">Columns</span>
                  <span className="text-[11px] font-medium text-gray-500">
                    ({visibleColumns.length})
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="text-xs">Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(columns).map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column}
                    checked={visibleColumns.includes(column)}
                    onCheckedChange={() => toggleColumnVisibility(column)}
                    className="text-xs py-1.5"
                  >
                    {column}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Rows Per Page */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="hidden md:inline">Rows:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-20 text-xs border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="250">250</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
            <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
              <Filter className="h-3 w-3 text-blue-600" />
              Active Filters:
            </span>
            {Object.entries(columnFilters).map(([col, val]) => {
              if (!val) return null;
              return (
                <span
                  key={col}
                  className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-800 border border-blue-200/80 rounded px-1.5 py-0.5"
                >
                  <span className="font-semibold text-gray-700">{col}:</span>
                  <span className="truncate max-w-[120px]">{val}</span>
                  <button
                    onClick={() => handleColumnFilter(col, "")}
                    className="hover:text-red-600 ml-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => setColumnFilters({})}
              className="text-[11px] text-blue-600 hover:text-blue-800 underline ml-1"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal Dialog */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-5">
          <DialogHeader className="pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between pr-4">
              <DialogTitle className="text-base font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                Filter Columns
              </DialogTitle>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            <DialogDescription className="text-xs text-gray-500">
              Filter by specific column values or keywords. Only matching rows will be shown.
            </DialogDescription>
          </DialogHeader>

          {/* Search inside filter modal */}
          <div className="relative pt-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Find a column to filter..."
              value={filterModalSearch}
              onChange={(e) => setFilterModalSearch(e.target.value)}
              className="h-8 pl-8 pr-4 text-xs"
            />
          </div>

          {/* Column filter grid */}
          <div className="overflow-y-auto flex-1 max-h-[50vh] pr-1 py-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modalColumns.map((column) => {
              const uniqueVals = getUniqueValues(column);
              const isDropdown = columns[column] === "object" && uniqueVals.length <= 20;
              const hasFilter = Boolean(columnFilters[column]);

              return (
                <div
                  key={column}
                  className={cn(
                    "p-2.5 rounded-md border text-xs flex flex-col gap-1.5 transition-colors",
                    hasFilter
                      ? "border-blue-300 bg-blue-50/30"
                      : "border-gray-200 bg-gray-50/40 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <label className="font-semibold text-gray-700 truncate" title={column}>
                      {column}
                    </label>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                        {columns[column] || "text"}
                      </span>
                      {hasFilter && (
                        <button
                          onClick={() => handleColumnFilter(column, "")}
                          className="text-gray-400 hover:text-red-500 p-0.5"
                          title="Clear this filter"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isDropdown ? (
                    <Select
                      value={columnFilters[column] || "all-values"}
                      onValueChange={(val) =>
                        handleColumnFilter(column, val === "all-values" ? "" : val)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs bg-white border-gray-200">
                        <SelectValue placeholder="All values" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-values">All values (No filter)</SelectItem>
                        {uniqueVals.map((val, idx) => (
                          <SelectItem key={`${column}-${idx}`} value={val}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="relative">
                      <Input
                        placeholder={`Filter by ${column}...`}
                        value={columnFilters[column] || ""}
                        onChange={(e) => handleColumnFilter(column, e.target.value)}
                        className="h-8 text-xs bg-white border-gray-200 pr-6"
                      />
                      {columnFilters[column] && (
                        <button
                          onClick={() => handleColumnFilter(column, "")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter className="pt-3 border-t border-gray-100 flex sm:justify-between items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setColumnFilters({})}
              disabled={activeFilterCount === 0}
              className="h-8 text-xs text-gray-600"
            >
              Clear All ({activeFilterCount})
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsFilterModalOpen(false)}
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              Done & Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Excel-style Compact Dataset Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-250px)] relative">
          <table className="w-full border-collapse text-xs select-text">
            {/* Excel-style Table Header */}
            <thead className="sticky top-0 z-20 bg-gray-100/95 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border-b border-gray-300">
              <tr>
                {/* Excel Row index header cell */}
                <th className="w-12 min-w-[48px] px-2 py-1.5 text-center text-[11px] font-semibold text-gray-500 border-r border-gray-300 bg-gray-200/80 sticky left-0 z-30 select-none">
                  #
                </th>
                {visibleColumns.map((column) => {
                  const hasFilter = Boolean(columnFilters[column]);
                  const isSorted = sortColumn === column;

                  return (
                    <th
                      key={column}
                      onClick={() => handleSort(column)}
                      className={cn(
                        "px-2.5 py-1.5 text-left font-semibold border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-200/70 transition-colors select-none",
                        hasFilter ? "bg-blue-50/70 text-blue-900" : "text-gray-700"
                      )}
                    >
                      <div className="flex items-center justify-between gap-1.5 min-w-[90px]">
                        <span className="truncate max-w-[200px]" title={column}>
                          {column}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {hasFilter && (
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-blue-600"
                              title={`Filtered by: ${columnFilters[column]}`}
                            />
                          )}
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3 text-blue-600" />
                            ) : (
                              <ArrowDown className="h-3 w-3 text-blue-600" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-gray-400 opacity-40 hover:opacity-100" />
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Excel-style Table Body with compact row height */}
            <tbody className="divide-y divide-gray-200/70">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="py-12 text-center text-xs text-gray-500"
                  >
                    No matching rows found for current filters and search.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => {
                  const rowIndex = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={index}
                      className="h-7 hover:bg-blue-50/60 even:bg-gray-50/35 transition-colors group"
                    >
                      {/* Excel row numbering cell */}
                      <td className="w-12 min-w-[48px] px-2 py-0.5 text-center text-[10px] font-mono text-gray-400 bg-gray-50/90 group-hover:bg-blue-100/50 border-r border-gray-300 select-none sticky left-0 z-10">
                        {rowIndex}
                      </td>

                      {/* Excel data cells */}
                      {visibleColumns.map((column) => {
                        const rawVal = row[column];
                        const displayVal =
                          rawVal !== null && rawVal !== undefined && rawVal !== ""
                            ? rawVal.toString()
                            : "";
                        const isNumber =
                          typeof rawVal === "number" ||
                          (!isNaN(Number(rawVal)) &&
                            rawVal !== "" &&
                            rawVal !== null &&
                            typeof rawVal !== "boolean");

                        return (
                          <td
                            key={column}
                            className={cn(
                              "px-2.5 py-0.5 text-xs border-r border-gray-200 whitespace-nowrap max-w-[280px] truncate leading-tight",
                              isNumber ? "font-mono text-right text-gray-900" : "text-gray-800"
                            )}
                            title={displayVal || "(empty)"}
                          >
                            {displayVal || (
                              <span className="text-gray-300 italic select-none">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Compact Excel-style Status & Pagination Footer */}
        <div className="bg-gray-50/90 border-t border-gray-200 px-3 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span>
              Showing{" "}
              <strong className="text-gray-900">
                {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </strong>{" "}
              to{" "}
              <strong className="text-gray-900">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </strong>{" "}
              of <strong className="text-gray-900">{sortedData.length}</strong> entries
              {sortedData.length !== data.length && ` (filtered from ${data.length})`}
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">{renderPaginationButtons()}</div>

              <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
              >
                Next
              </Button>

              <div className="flex items-center gap-1 ml-2 text-gray-500">
                <span className="text-[11px]">Go:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const p = parseInt(e.target.value);
                    if (p >= 1 && p <= totalPages) {
                      goToPage(p);
                    }
                  }}
                  className="h-7 w-12 text-center text-xs border border-gray-300 rounded bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetViewer;

