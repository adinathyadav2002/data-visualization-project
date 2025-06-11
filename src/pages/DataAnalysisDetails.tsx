import React, { useState } from "react";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BoxPlot,
} from "recharts";
import {
  FileText,
  BarChart3,
  TrendingUp,
  Download,
  AlertTriangle,
  Database,
  Eye,
  PieChart as PieChartIcon,
  Activity,
  Scatter3D,
  BarChart4,
} from "lucide-react";

// Type definitions
interface DatasetInfo {
  columns: Array<{ name: string; type: string }>;
  totalRows: number;
  data: Array<{
    [key: string]: string | number;
  }>;
}

interface File {
  filename: string;
  file_type: string;
  shape: [number, number];
  columns: Record<string, string>;
  preview: Array<Record<string, string>>;
  numeric_columns: string[];
  categorical_columns: string[];
  summary: Record<
    string,
    { mean: number; min: number; max: number; std: number; count: number }
  >;
  categorical_data: Record<string, Array<{ category: string; count: number }>>;
  missing_values: Record<
    string,
    { null_count: number; null_percentage: number; total_rows: number }
  >;
  full_data: boolean;
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
  const [activeChart, setActiveChart] = useState<string>("overview");

  if (!datasetInfo && !file) {
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

  // Use file data if available, otherwise fall back to datasetInfo
  const data = file || datasetInfo;

  // Normalize data structure
  const getDataProperty = (key: string, defaultValue: any = null) => {
    if (file && key in file) return file[key];
    if (datasetInfo && key in datasetInfo) return datasetInfo[key];
    return defaultValue;
  };

  const columns = getDataProperty("columns", {});
  const missingValues = getDataProperty("missing_values", {});
  const summary = getDataProperty("summary", {});
  const numericColumns = getDataProperty("numeric_columns", []);
  const categoricalColumns = getDataProperty("categorical_columns", []);
  const categoricalData = getDataProperty("categorical_data", {});
  const shape = getDataProperty("shape", [0, 0]);
  const fileType = getDataProperty("file_type", "Unknown");
  const fileName =
    getDataProperty("filename", "") || getDataProperty("name", "");

  const rows = shape[0] || 0;
  const cols = shape[1] || 0;

  // Chart configuration
  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(220, 70%, 50%)",
    },
    value: {
      label: "Value",
      color: "hsl(160, 70%, 50%)",
    },
    distribution: {
      label: "Distribution",
      color: "hsl(280, 70%, 50%)",
    },
  };

  // Color palette for charts
  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#84cc16",
    "#ec4899",
    "#6366f1",
    "#14b8a6",
    "#f59e0b",
  ];

  const prepareCategoricalChartData = (
    columnData: Array<{ category: string; count: number }>
  ) => {
    if (!Array.isArray(columnData)) return [];
    return columnData.slice(0, 10).map((item, index) => ({
      category:
        item.category && item.category.length > 15
          ? `${item.category.substring(0, 15)}...`
          : item.category || "Unknown",
      fullCategory: item.category || "Unknown",
      count: item.count || 0,
      fill: COLORS[index % COLORS.length],
    }));
  };

  // Prepare data for numeric distribution charts
  const prepareNumericDistributionData = () => {
    if (!summary || Object.keys(summary).length === 0) return [];

    return Object.entries(summary).map(([column, stats]) => ({
      column: column.length > 10 ? `${column.substring(0, 10)}...` : column,
      fullColumn: column,
      mean: stats.mean || 0,
      min: stats.min || 0,
      max: stats.max || 0,
      std: stats.std || 0,
      count: stats.count || 0,
    }));
  };

  // Prepare missing values chart data
  const prepareMissingValuesData = () => {
    if (!missingValues || Object.keys(missingValues).length === 0) return [];

    return Object.entries(missingValues)
      .filter(([_, info]) => safeInfo(info).null_count > 0)
      .map(([column, info], index) => ({
        column: column.length > 10 ? `${column.substring(0, 10)}...` : column,
        fullColumn: column,
        missing: info.null_count,
        percentage: info.null_percentage,
        complete: info.total_rows - info.null_count,
        fill: COLORS[index % COLORS.length],
      }));
  };

  // Prepare data type distribution
  const prepareDataTypeDistribution = () => {
    if (!columns || Object.keys(columns).length === 0) return [];

    const typeCount = {};
    Object.values(columns).forEach((type) => {
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count], index) => ({
      type,
      count,
      fill: COLORS[index % COLORS.length],
    }));
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Defensive: avoid division by zero in completeness
  const totalCells =
    typeof rows === "number" && typeof cols === "number" ? rows * cols : 0;
  const totalMissing = Object.values(missingValues).reduce(
    (sum: number, info: unknown) => {
      if (
        typeof info === "object" &&
        info !== null &&
        "null_count" in info &&
        typeof (info as { null_count: number }).null_count === "number"
      ) {
        return sum + (info as { null_count: number }).null_count;
      }
      return sum;
    },
    0
  );
  const completeness =
    totalCells > 0
      ? (((totalCells - totalMissing) / totalCells) * 100).toFixed(1)
      : "0.0";

  // Helper to safely cast info to expected type
  const safeInfo = (info: unknown) =>
    typeof info === "object" && info !== null
      ? (info as {
          null_count?: number;
          null_percentage?: number;
          total_rows?: number;
        })
      : {};

  // Helper for categorical chart data
  const safeCategoricalData = (data: unknown) =>
    Array.isArray(data) ? data : [];

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
                disabled={converting || fileName.toLowerCase().endsWith(".csv")}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {converting ? "Converting..." : "Convert to CSV"}
              </Button>
              <Button
                onClick={() => onConvertFile("excel")}
                disabled={
                  converting ||
                  fileName.toLowerCase().endsWith(".xlsx") ||
                  fileName.toLowerCase().endsWith(".xls")
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
                <span className="font-semibold">File Type:</span> {fileType}
              </p>
              <p>
                <span className="font-semibold">Rows:</span>{" "}
                {rows.toLocaleString()}
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
                  .filter(([_, info]) => safeInfo(info).null_count > 0)
                  .slice(0, 5)
                  .map(([col, info]) => (
                    <div key={col} className="text-sm">
                      <div className="flex justify-between">
                        <span className="truncate">{col}</span>
                        <span className="text-red-500">
                          {safeInfo(info).null_count}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {safeInfo(info).null_percentage?.toFixed(1) || 0}%
                        missing
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
              <p>Total cells: {totalCells.toLocaleString()}</p>
              <p>Data completeness: {completeness}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Data Visualization Dashboard</CardTitle>
          <CardDescription>
            Explore your data through interactive charts and graphs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activeChart === "overview" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("overview")}
              className="flex items-center gap-2"
            >
              <PieChartIcon className="h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeChart === "categorical" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("categorical")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Categorical
            </Button>
            <Button
              variant={activeChart === "numeric" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("numeric")}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Numeric
            </Button>
            <Button
              variant={activeChart === "missing" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("missing")}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Missing Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Charts */}
      {activeChart === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Data Type Distribution</CardTitle>
              <CardDescription>
                Distribution of column types in the dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareDataTypeDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) =>
                        `${type} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {prepareDataTypeDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Column Count by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Column Statistics</CardTitle>
              <CardDescription>
                Breakdown of numeric vs categorical columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        type: "Numeric",
                        count: numericColumns.length,
                        fill: COLORS[0],
                      },
                      {
                        type: "Categorical",
                        count: categoricalColumns.length,
                        fill: COLORS[1],
                      },
                      {
                        type: "Other",
                        count:
                          cols -
                          numericColumns.length -
                          categoricalColumns.length,
                        fill: COLORS[2],
                      },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Categorical Data Visualization */}
      {activeChart === "categorical" && categoricalColumns.length > 0 && (
        <div className="space-y-6">
          {Object.entries(categoricalData).map(([column, data]) => (
            <div key={column} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="truncate">
                    {column} - Bar Chart
                  </CardTitle>
                  <CardDescription>
                    Category distribution in {column}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareCategoricalChartData(
                          safeCategoricalData(data)
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="category"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={12}
                        />
                        <YAxis />
                        <Tooltip
                          content={({ active, payload }) => {
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
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="truncate">
                    {column} - Pie Chart
                  </CardTitle>
                  <CardDescription>
                    Percentage distribution in {column}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareCategoricalChartData(
                            safeCategoricalData(data)
                          )}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, percent }) =>
                            `${category} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={120}
                          dataKey="count"
                        >
                          {prepareCategoricalChartData(
                            safeCategoricalData(data)
                          ).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border rounded shadow">
                                  <p className="font-medium">
                                    {data.fullCategory}
                                  </p>
                                  <p className="text-blue-600">
                                    Count: {data.count}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Numeric Data Visualization */}
      {activeChart === "numeric" && numericColumns.length > 0 && (
        <div className="space-y-6">
          {/* Statistical Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Numeric Columns Statistics</CardTitle>
              <CardDescription>
                Statistical overview of all numeric columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareNumericDistributionData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="column"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow">
                              <p className="font-medium">{data.fullColumn}</p>
                              <p>Mean: {data.mean.toFixed(2)}</p>
                              <p>Min: {data.min.toFixed(2)}</p>
                              <p>Max: {data.max.toFixed(2)}</p>
                              <p>Std: {data.std.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="mean" fill={COLORS[0]} name="Mean" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Range Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Value Ranges</CardTitle>
              <CardDescription>
                Min and max values for each numeric column
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={prepareNumericDistributionData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="column"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="max"
                      stackId="1"
                      stroke={COLORS[0]}
                      fill={COLORS[0]}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="min"
                      stackId="1"
                      stroke={COLORS[1]}
                      fill={COLORS[1]}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Missing Data Visualization */}
      {activeChart === "missing" && Object.keys(missingValues).length > 0 && (
        <div className="space-y-6">
          {prepareMissingValuesData().length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Missing Values Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Missing Values Count</CardTitle>
                  <CardDescription>
                    Number of missing values per column
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareMissingValuesData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="column"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border rounded shadow">
                                  <p className="font-medium">
                                    {data.fullColumn}
                                  </p>
                                  <p className="text-red-600">
                                    Missing: {data.missing}
                                  </p>
                                  <p className="text-green-600">
                                    Complete: {data.complete}
                                  </p>
                                  <p>
                                    Missing %: {data.percentage.toFixed(1)}%
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="missing"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Missing Values Percentage */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Completeness</CardTitle>
                  <CardDescription>
                    Percentage of complete vs missing data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareMissingValuesData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="column"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="complete" stackId="a" fill="#10b981" />
                        <Bar dataKey="missing" stackId="a" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Summary Statistics Table */}
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
                  {["mean", "min", "max", "std", "count"].map((stat) => (
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
                      <TableCell>{safeInfo(info).null_count || 0}</TableCell>
                      <TableCell>
                        {safeInfo(info).null_percentage?.toFixed(1) || 0}%
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            (safeInfo(info).null_count || 0) === 0
                              ? "bg-green-100 text-green-800"
                              : (safeInfo(info).null_percentage || 0) > 50
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {(safeInfo(info).null_count || 0) === 0
                            ? "Complete"
                            : (safeInfo(info).null_percentage || 0) > 50
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
