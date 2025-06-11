import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartTooltip } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  BarChart3,
  TrendingUp,
  Download,
  AlertTriangle,
  Database,
  Eye,
} from "lucide-react";

interface DatasetInfo {
  filename: string;
  file_type: string;
  columns: { [key: string]: string };
  shape: [number, number];
  preview: { [key: string]: string }[];
  summary: { [key: string]: { [key: string]: number } };
  numeric_columns: string[];
  categorical_columns: string[];
  categorical_data: {
    [key: string]: Array<{ category: string; count: number }>;
  };
  missing_values: {
    [key: string]: {
      null_count: number;
      null_percentage: number;
      total_rows: number;
    };
  };
}

interface DataAnalysisDetailsProps {
  datasetInfo: DatasetInfo | null;
  file: File | null;
  converting: boolean;
  loadingFullDataset: boolean;
  onConvertFile: (targetFormat: string) => void;
  onLoadFullDataset: () => void;
}

const DataAnalysisDetails: React.FC<DataAnalysisDetailsProps> = ({
  datasetInfo,
  file,
  converting,
  loadingFullDataset,
  onConvertFile,
  onLoadFullDataset,
}) => {
  console.log(datasetInfo);
  if (!datasetInfo) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>No Dataset Available</CardTitle>
            <CardDescription>
              Please upload a dataset first to view analysis details.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Defensive: handle missing or malformed shape
  const rows =
    typeof datasetInfo.shape?.[0] === "number" ? datasetInfo.shape[0] : 0;
  const cols =
    typeof datasetInfo.shape?.[1] === "number" ? datasetInfo.shape[1] : 0;

  // Use correct types for all fields
  const columns =
    datasetInfo.columns && typeof datasetInfo.columns === "object"
      ? datasetInfo.columns
      : {};
  const missingValues =
    datasetInfo.missing_values && typeof datasetInfo.missing_values === "object"
      ? datasetInfo.missing_values
      : {};
  const summary =
    datasetInfo.summary && typeof datasetInfo.summary === "object"
      ? datasetInfo.summary
      : {};
  const numericColumns = Array.isArray(datasetInfo.numeric_columns)
    ? datasetInfo.numeric_columns
    : [];
  const categoricalColumns = Array.isArray(datasetInfo.categorical_columns)
    ? datasetInfo.categorical_columns
    : [];
  const categoricalData =
    datasetInfo.categorical_data &&
    typeof datasetInfo.categorical_data === "object"
      ? datasetInfo.categorical_data
      : {};

  const prepareCategoricalChartData = (
    columnData: Array<{ category: string; count: number }>
  ) => {
    if (!Array.isArray(columnData)) return [];
    return columnData.map((item) => ({
      category:
        item.category && item.category.length > 15
          ? `${item.category.substring(0, 15)}...`
          : item.category || "Unknown",
      fullCategory: item.category || "Unknown",
      count: item.count || 0,
    }));
  };

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(220, 70%, 50%)",
    },
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-8">
      {/* Dataset Viewer Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dataset Exploration
          </CardTitle>
          <CardDescription>
            View, search, filter, and explore your complete dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onLoadFullDataset}
            disabled={loadingFullDataset}
            className="flex items-center gap-2 w-full sm:w-auto bg-[#3b82f6]"
          >
            <Eye className="h-4 w-4" />
            {loadingFullDataset ? "Loading..." : "Open Dataset Viewer"}
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Interactive table with pagination, search, filtering, and column
            selection
          </p>
        </CardContent>
      </Card>

      {/* File Conversion Section */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              File Conversion
            </CardTitle>
            <CardDescription>
              Convert your file between CSV and Excel formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => onConvertFile("csv")}
                disabled={
                  converting || file.name.toLowerCase().endsWith(".csv")
                }
                variant="outline"
                className="w-full sm:w-auto"
              >
                {converting ? "Converting..." : "Convert to CSV"}
              </Button>
              <Button
                onClick={() => onConvertFile("excel")}
                disabled={
                  converting ||
                  file.name.toLowerCase().endsWith(".xlsx") ||
                  file.name.toLowerCase().endsWith(".xls")
                }
                variant="outline"
                className="w-full sm:w-auto"
              >
                {converting ? "Converting..." : "Convert to Excel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dataset Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dataset Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">File Type:</span>{" "}
                {datasetInfo?.file_type?.toUpperCase() || "Unknown"}
              </p>
              <p>
                <span className="font-semibold">Rows:</span> {rows}
              </p>
              <p>
                <span className="font-semibold">Columns:</span> {cols}
              </p>
              <p>
                <span className="font-semibold">Numeric Cols:</span>{" "}
                {numericColumns.length}
              </p>
              <p>
                <span className="font-semibold">Categorical Cols:</span>{" "}
                {categoricalColumns.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Column Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {Object.keys(columns).length > 0 ? (
                Object.entries(columns).map(([col, type]) => (
                  <div key={col} className="flex justify-between text-sm">
                    <span className="truncate">{col}</span>
                    <span className="text-gray-500 ml-2">{type}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No column information available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Missing Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {Object.keys(missingValues).length > 0 ? (
                Object.entries(missingValues)
                  .filter(([_, info]) => info && info.null_count > 0)
                  .slice(0, 5)
                  .map(([col, info]) => (
                    <div key={col} className="text-sm">
                      <div className="flex justify-between">
                        <span className="truncate">{col}</span>
                        <span className="text-red-500">{info.null_count}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {info.null_percentage.toFixed(1)}% missing
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-green-600">
                  No missing values found!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p>Data types: {new Set(Object.values(columns)).size}</p>
              <p>
                Total missing:{" "}
                {Object.keys(missingValues).length > 0
                  ? Object.values(missingValues).reduce(
                      (sum, info) => sum + (info?.null_count || 0),
                      0
                    )
                  : 0}
              </p>
              <p>Total cells: {rows * cols}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categorical Data Visualization */}
      {categoricalColumns.length > 0 &&
        Object.keys(categoricalData).length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(categoricalData).map(([column, data]) => (
              <Card key={column}>
                <CardHeader>
                  <CardTitle className="truncate">
                    Categorical Analysis: {column}
                  </CardTitle>
                  <CardDescription>
                    Distribution of categories in {column} column
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareCategoricalChartData(data)}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 80,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="category"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={12}
                          interval={0}
                        />
                        <YAxis fontSize={12} />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border rounded shadow">
                                  <p className="font-medium">
                                    {data.fullCategory}
                                  </p>
                                  <p className="text-blue-600">
                                    Count: {payload[0].value}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill={chartConfig.count.color}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      {/* Summary Statistics */}
      {Object.keys(summary).length > 0 && numericColumns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
            <CardDescription>
              Statistical summary of numeric columns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">
                      Statistic
                    </TableHead>
                    {numericColumns.map((col) => (
                      <TableHead
                        key={col}
                        className="whitespace-nowrap min-w-[100px]"
                      >
                        <div className="truncate">{col}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["mean", "min", "max", "std"].map((stat) => (
                    <TableRow key={stat}>
                      <TableCell className="font-medium capitalize">
                        {stat}
                      </TableCell>
                      {numericColumns.map((col) => (
                        <TableCell key={col} className="whitespace-nowrap">
                          {summary[col]?.[stat]?.toFixed(2) || "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missing Values Detailed Table */}
      {Object.keys(missingValues).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Missing Values Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of null and missing values by column
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Column</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Data Type
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Missing Count
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Missing %
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(missingValues).map(([col, info]) => (
                    <TableRow key={col}>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[150px]" title={col}>
                          {col}
                        </div>
                      </TableCell>
                      <TableCell>{columns[col] || "Unknown"}</TableCell>
                      <TableCell>{info?.null_count || 0}</TableCell>
                      <TableCell>
                        {info?.null_percentage?.toFixed(1) || 0}%
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            (info?.null_count || 0) === 0
                              ? "bg-green-100 text-green-800"
                              : (info?.null_percentage || 0) > 50
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {(info?.null_count || 0) === 0
                            ? "Complete"
                            : (info?.null_percentage || 0) > 50
                            ? "High Missing"
                            : "Some Missing"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataAnalysisDetails;
