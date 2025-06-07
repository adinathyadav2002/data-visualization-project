import React, { useState } from "react";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Upload,
  FileText,
  BarChart3,
  TrendingUp,
  Download,
  AlertTriangle,
  Database,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DatasetViewer from "./DatasetViewer";

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

const DataAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [fullDataset, setFullDataset] = useState<{ [key: string]: string }[]>(
    []
  );
  const [showDatasetViewer, setShowDatasetViewer] = useState(false);
  const [loadingFullDataset, setLoadingFullDataset] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const validExtensions = [".csv", ".xlsx", ".xls"];

      if (
        validTypes.includes(selectedFile.type) ||
        validExtensions.some((ext) =>
          selectedFile.name.toLowerCase().endsWith(ext)
        )
      ) {
        setFile(selectedFile);
        setDatasetInfo(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file.",
          variant: "destructive",
        });
      }
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}data/upload-file`,
        {
          method: "POST",

          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setDatasetInfo(data);
      toast({
        title: "File uploaded successfully",
        description: `Dataset analyzed: ${data.shape[0]} rows, ${data.shape[1]} columns`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: `Please ensure the backend server is running on ${
          import.meta.env.VITE_BACKEND_URL
        } and try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const convertFile = async (targetFormat: string) => {
    console.log(targetFormat);
    if (!file) return;

    setConverting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }data/convert-file?output_format=${targetFormat}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const baseName = file.name.split(".")[0];
      a.download =
        targetFormat === "csv" ? `${baseName}.csv` : `${baseName}.xlsx`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "File converted successfully",
        description: `Downloaded as ${a.download}`,
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: "Please try again or check the file format",
        variant: "destructive",
      });
    } finally {
      setConverting(false);
    }
  };

  const loadFullDataset = async () => {
    if (!file) return;

    setLoadingFullDataset(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}data/upload-file?full_data=true`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load full dataset");
      }

      const data = await response.json();

      setFullDataset(data.preview);
      setShowDatasetViewer(true);

      toast({
        title: "Dataset loaded",
        description: "Opening dataset viewer with full data",
      });
    } catch (error) {
      console.error("Error loading full dataset:", error);
      toast({
        title: "Failed to load dataset",
        description: "Please try again or check the server connection",
        variant: "destructive",
      });
    } finally {
      setLoadingFullDataset(false);
    }
  };

  const prepareCategoricalChartData = (
    columnData: Array<{ category: string; count: number }>
  ) => {
    return columnData.map((item) => ({
      category:
        item.category.length > 15
          ? `${item.category.substring(0, 15)}...`
          : item.category,
      fullCategory: item.category,
      count: item.count,
    }));
  };

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(220, 70%, 50%)",
    },
  };

  if (showDatasetViewer && datasetInfo) {
    return (
      <div className=" w-full bg-gray-50 p-4">
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <DatasetViewer
              data={fullDataset}
              columns={datasetInfo.columns}
              onBack={() => setShowDatasetViewer(false)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 w-full">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className=" mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">
            Data Analysis Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Upload and analyze your CSV or Excel datasets
          </p>
        </div>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Dataset
            </CardTitle>
            <CardDescription>
              Upload a CSV or Excel file to analyze your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 rounded-lg gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {file.name}
                    </span>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={uploadFile}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    >
                      {loading ? "Analyzing..." : "Upload & Analyze"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dataset Viewer Button */}
        {datasetInfo && (
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
                onClick={loadFullDataset}
                disabled={loadingFullDataset}
                className="flex items-center gap-2 w-full sm:w-auto"
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
        )}

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
                  onClick={() => convertFile("csv")}
                  disabled={
                    converting || file.name.toLowerCase().endsWith(".csv")
                  }
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {converting ? "Converting..." : "Convert to CSV"}
                </Button>
                <Button
                  onClick={() => convertFile("excel")}
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
        {datasetInfo && (
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
                    {datasetInfo.file_type.toUpperCase()}
                  </p>
                  <p>
                    <span className="font-semibold">Rows:</span>{" "}
                    {datasetInfo.shape[0]}
                  </p>
                  <p>
                    <span className="font-semibold">Columns:</span>{" "}
                    {datasetInfo.shape[1]}
                  </p>
                  <p>
                    <span className="font-semibold">Numeric Cols:</span>{" "}
                    {datasetInfo.numeric_columns.length}
                  </p>
                  <p>
                    <span className="font-semibold">Categorical Cols:</span>{" "}
                    {datasetInfo.categorical_columns.length}
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
                  {Object.entries(datasetInfo.columns).map(([col, type]) => (
                    <div key={col} className="flex justify-between text-sm">
                      <span className="truncate">{col}</span>
                      <span className="text-gray-500 ml-2">{type}</span>
                    </div>
                  ))}
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
                  {Object.entries(datasetInfo.missing_values)
                    .filter(([_, info]) => info.null_count > 0)
                    .slice(0, 5)
                    .map(([col, info]) => (
                      <div key={col} className="text-sm">
                        <div className="flex justify-between">
                          <span className="truncate">{col}</span>
                          <span className="text-red-500">
                            {info.null_count}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {info.null_percentage.toFixed(1)}% missing
                        </div>
                      </div>
                    ))}
                  {Object.values(datasetInfo.missing_values).every(
                    (info) => info.null_count === 0
                  ) && (
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
                  <p>
                    Data types:{" "}
                    {new Set(Object.values(datasetInfo.columns)).size}
                  </p>
                  <p>
                    Total missing:{" "}
                    {Object.values(datasetInfo.missing_values).reduce(
                      (sum, info) => sum + info.null_count,
                      0
                    )}
                  </p>
                  <p>
                    Total cells: {datasetInfo.shape[0] * datasetInfo.shape[1]}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Preview Table */}
        {datasetInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Data Preview (First 5 Rows)</CardTitle>
              <CardDescription>
                Preview of your uploaded dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(datasetInfo.columns).map((col) => (
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
                    {datasetInfo.preview.map((row, index) => (
                      <TableRow key={index}>
                        {Object.keys(datasetInfo.columns).map((col) => (
                          <TableCell
                            key={col}
                            className="whitespace-nowrap max-w-[150px]"
                          >
                            <div
                              className="truncate"
                              title={row[col]?.toString() || "-"}
                            >
                              {row[col]?.toString() || "-"}
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
        )}

        {/* Categorical Data Visualization */}
        {datasetInfo && datasetInfo.categorical_columns.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(datasetInfo.categorical_data).map(
              ([column, data]) => (
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
              )
            )}
          </div>
        )}

        {/* Summary Statistics */}
        {datasetInfo &&
          datasetInfo.summary &&
          Object.keys(datasetInfo.summary).length > 0 && (
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
                        {datasetInfo.numeric_columns.map((col) => (
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
                          {datasetInfo.numeric_columns.map((col) => (
                            <TableCell key={col} className="whitespace-nowrap">
                              {datasetInfo.summary[col]?.[stat]?.toFixed(2) ||
                                "-"}
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
        {datasetInfo && (
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
                      <TableHead className="whitespace-nowrap">
                        Column
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Data Type
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Missing Count
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Missing %
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(datasetInfo.missing_values).map(
                      ([col, info]) => (
                        <TableRow key={col}>
                          <TableCell className="font-medium">
                            <div className="truncate max-w-[150px]" title={col}>
                              {col}
                            </div>
                          </TableCell>
                          <TableCell>{datasetInfo.columns[col]}</TableCell>
                          <TableCell>{info.null_count}</TableCell>
                          <TableCell>
                            {info.null_percentage.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                                info.null_count === 0
                                  ? "bg-green-100 text-green-800"
                                  : info.null_percentage > 50
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {info.null_count === 0
                                ? "Complete"
                                : info.null_percentage > 50
                                ? "High Missing"
                                : "Some Missing"}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DataAnalysis;
