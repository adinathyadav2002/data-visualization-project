import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter, Columns, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface DatasetRow {
  [key: string]: any;
}

interface DatasetViewerProps {
  data: DatasetRow[];
  columns: { [key: string]: string };
  onBack: () => void;
}

const DatasetViewer: React.FC<DatasetViewerProps> = ({
  data,
  columns,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>(
    {}
  );
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    Object.keys(columns)
  );
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

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
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setColumnFilters({});
    setSortColumn("");
    setCurrentPage(1);
    toast({
      title: "Filters cleared",
      description: "All filters have been reset",
    });
  };

  const getUniqueValues = (column: string) => {
    const values = data
      .map((row) => row[column])
      .filter((val) => val !== null && val !== undefined);
    return [...new Set(values)].slice(0, 20); // Limit to 20 unique values for performance
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dataset Viewer
            </h1>
            <p className="text-gray-600">
              Showing {sortedData.length} of {data.length} rows
            </p>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Back to Analysis
          </Button>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
              {/* Global Search */}
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium mb-2">
                  Search all columns
                </label>
                <Input
                  placeholder="Search across all data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Page Size */}
              <div className="w-full sm:w-32">
                <label className="block text-sm font-medium mb-2">
                  Rows per page
                </label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Columns className="h-4 w-4" />
                    Columns ({visibleColumns.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto bg-white border shadow-lg z-50">
                  <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.keys(columns).map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column}
                      checked={visibleColumns.includes(column)}
                      onCheckedChange={() => toggleColumnVisibility(column)}
                    >
                      {column}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters */}
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Column Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Column Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleColumns.map((column) => (
                <div key={column} className="space-y-2">
                  <label className="block text-sm font-medium truncate">
                    {column}
                  </label>
                  {columns[column] === "object" &&
                  getUniqueValues(column).length <= 20 ? (
                    <Select
                      value={columnFilters[column] || ""}
                      onValueChange={(value) =>
                        handleColumnFilter(
                          column,
                          value === "all-values" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All values" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        <SelectItem value="all-values">All values</SelectItem>
                        {getUniqueValues(column).map((value, index) => (
                          <SelectItem
                            key={`${column}-${index}`}
                            value={value.toString()}
                          >
                            {value.toString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder={`Filter ${column}...`}
                      value={columnFilters[column] || ""}
                      onChange={(e) =>
                        handleColumnFilter(column, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Dataset ({paginatedData.length} rows shown)</CardTitle>
            <CardDescription>
              Click column headers to sort. Use filters above to narrow down
              results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.map((column) => (
                      <TableHead
                        key={column}
                        className="cursor-pointer hover:bg-gray-100 whitespace-nowrap min-w-[100px]"
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="truncate">{column}</span>
                          {sortColumn === column && (
                            <span className="text-xs">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, index) => (
                    <TableRow key={index}>
                      {visibleColumns.map((column) => (
                        <TableCell
                          key={column}
                          className="whitespace-nowrap max-w-[200px]"
                        >
                          <div
                            className="truncate"
                            title={row[column]?.toString() || "-"}
                          >
                            {row[column]?.toString() || "-"}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="pt-6">
              <Pagination>
                <PaginationContent className="flex-wrap gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={`${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      } select-none`}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer select-none"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={`${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      } select-none`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="text-center mt-4 text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({sortedData.length} total
                results)
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DatasetViewer;
