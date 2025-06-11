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
  Search,
  Filter,
  Columns,
  ArrowLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

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
  // Type-safe check for object with data/columns fields
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
  };

  const getUniqueValues = (column: string) => {
    const values = data
      .map((row) => row[column])
      .filter((val) => val !== null && val !== undefined);
    return [...new Set(values)].slice(0, 20);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 7;

    if (totalPages <= maxButtons) {
      // Show all pages if total pages are less than or equal to maxButtons
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(i)}
            className="mx-1"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Complex pagination logic
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(1)}
          className="mx-1"
        >
          1
        </Button>
      );

      if (currentPage > 4) {
        buttons.push(
          <span key="dots1" className="mx-2">
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
              className="mx-1"
            >
              {i}
            </Button>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        buttons.push(
          <span key="dots2" className="mx-2">
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
            className="mx-1"
          >
            {totalPages}
          </Button>
        );
      }
    }

    return buttons;
  };

  // Handle empty data
  if (!data.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Dataset Available
          </h2>
          <p className="text-gray-600 mb-6">
            Please upload a dataset first to view it here.
          </p>
          {onBack && (
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

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
              Showing {paginatedData.length} of {sortedData.length} filtered
              rows ({data.length} total rows)
            </p>
          </div>
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Analysis
            </Button>
          )}
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="250">250</SelectItem>
                    <SelectItem value="500">500</SelectItem>
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
                <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
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
              {visibleColumns.slice(0, 12).map((column) => (
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
                      <SelectContent>
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
            {visibleColumns.length > 12 && (
              <p className="text-sm text-gray-500 mt-4">
                Showing first 12 column filters. Use column visibility to manage
                displayed columns.
              </p>
            )}
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
                        className="cursor-pointer hover:bg-gray-100 whitespace-nowrap min-w-[100px] select-none"
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="truncate">{column}</span>
                          {sortColumn === column ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="h-4 w-4 opacity-50" />
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

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {renderPaginationButtons()}
                  </div>

                  <Button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>Go to page:</span>
                    <Input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          goToPage(page);
                        }
                      }}
                      className="w-16 text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mt-4 text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
                {sortedData.length} filtered results ({data.length} total rows)
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DatasetViewer;
