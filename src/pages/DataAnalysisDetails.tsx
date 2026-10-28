import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Download,
  AlertTriangle,
  Database,
  Eye,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import OverviewCharts from "@/components/dataAnalysis/OverviewCharts";
import CategoricalDataVisual from "@/components/dataAnalysis/CategoricalDataVisual";
import NumericDataVisualization from "@/components/dataAnalysis/NumericDataVisualization";
import SummaryStatTable from "@/components/dataAnalysis/SummaryStatTable";
import MissingValuesTable from "@/components/dataAnalysis/MissingValuesTable";
import MissingValuesVisualization from "@/components/dataAnalysis/MissingValuesVisualization";
import { cn } from "@/lib/utils";

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
  const navigate = useNavigate();
  const [activeChart, setActiveChart] = useState<string>("overview");

  const handleOpenDatasetViewer = () => {
    navigate("/dataset-viewer");
  };

  if (!datasetInfo && !file) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 p-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                No Dataset Available
              </CardTitle>

              <CardDescription className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Get started by uploading your dataset to unlock powerful
                analysis tools and insights.
              </CardDescription>

              <div className="pt-4">
                <button
                  onClick={() => navigate("/data-uploader")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload Dataset
                </button>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                Supported formats: CSV, JSON, Excel
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Normalize data structure
  const getDataProperty = (key: string, defaultValue: any = null) => {
    if (file && key in file) return file[key];
    if (datasetInfo && key in datasetInfo) return datasetInfo[key];
    return defaultValue;
  };

  const missingValues = getDataProperty("missing_values", {});
  const numericColumns = getDataProperty("numeric_columns", []);
  const categoricalColumns = getDataProperty("categorical_columns", []);
  const fileName =
    getDataProperty("filename", "") || getDataProperty("name", "");

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-8">
      {/* Combined Dataset Exploration & File Conversion in Single Line */}
      <Card className="border border-slate-200/80 shadow-sm">
        <CardContent className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Dataset Exploration (Left) */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 text-sm">
                  Dataset Exploration
                </span>
                {fileName && (
                  <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded truncate max-w-[200px]">
                    {fileName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Explore rows, search, and filter in Excel view
              </p>
            </div>
            <Button
              onClick={handleOpenDatasetViewer}
              disabled={loadingFullDataset}
              size="sm"
              className="ml-auto md:ml-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 h-8 text-xs shrink-0"
            >
              <Eye className="h-3.5 w-3.5" />
              {loadingFullDataset ? "Loading..." : "Open Dataset Viewer"}
            </Button>
          </div>

          {/* Divider on desktop */}
          {file && <div className="hidden md:block h-7 w-px bg-slate-200" />}

          {/* File Conversion (Right) */}
          {file && (
            <div className="flex items-center gap-2 justify-end">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Download className="h-3.5 w-3.5 text-slate-400" />
                <span>Convert:</span>
              </div>
              <Button
                onClick={() => onConvertFile("csv")}
                disabled={converting || fileName.toLowerCase().endsWith(".csv")}
                variant="outline"
                size="sm"
                className="h-8 text-xs px-2.5"
              >
                {converting ? "..." : "To CSV"}
              </Button>
              <Button
                onClick={() => onConvertFile("excel")}
                disabled={
                  converting ||
                  fileName.toLowerCase().endsWith(".xlsx") ||
                  fileName.toLowerCase().endsWith(".xls")
                }
                variant="outline"
                size="sm"
                className="h-8 text-xs px-2.5"
              >
                {converting ? "..." : "To Excel"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unified Data Visualization Component */}
      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Data Visualization Dashboard
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Interactive charts across categorical, numeric, and missing data dimensions
              </CardDescription>
            </div>

            {/* Embedded Switcher Controls */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/60 p-1 rounded-lg">
              <Button
                variant={activeChart === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveChart("overview")}
                className={cn(
                  "h-7 text-xs px-2.5 flex items-center gap-1.5 rounded-md",
                  activeChart === "overview"
                    ? "bg-white text-slate-900 shadow-sm hover:bg-white"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <PieChartIcon className="h-3.5 w-3.5" />
                Overview
              </Button>
              <Button
                variant={activeChart === "categorical" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveChart("categorical")}
                disabled={categoricalColumns.length === 0}
                className={cn(
                  "h-7 text-xs px-2.5 flex items-center gap-1.5 rounded-md",
                  activeChart === "categorical"
                    ? "bg-white text-slate-900 shadow-sm hover:bg-white"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Categorical ({categoricalColumns.length})
              </Button>
              <Button
                variant={activeChart === "numeric" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveChart("numeric")}
                disabled={numericColumns.length === 0}
                className={cn(
                  "h-7 text-xs px-2.5 flex items-center gap-1.5 rounded-md",
                  activeChart === "numeric"
                    ? "bg-white text-slate-900 shadow-sm hover:bg-white"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Activity className="h-3.5 w-3.5" />
                Numeric ({numericColumns.length})
              </Button>
              <Button
                variant={activeChart === "missing" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveChart("missing")}
                className={cn(
                  "h-7 text-xs px-2.5 flex items-center gap-1.5 rounded-md",
                  activeChart === "missing"
                    ? "bg-white text-slate-900 shadow-sm hover:bg-white"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Missing Data
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {activeChart === "overview" && (
            <OverviewCharts datasetInfo={datasetInfo} file={file} />
          )}

          {activeChart === "categorical" && categoricalColumns.length > 0 && (
            <CategoricalDataVisual file={file} datasetInfo={datasetInfo} />
          )}

          {activeChart === "numeric" && numericColumns.length > 0 && (
            <NumericDataVisualization file={file} datasetInfo={datasetInfo} />
          )}

          {activeChart === "missing" && Object.keys(missingValues).length > 0 && (
            <MissingValuesVisualization file={file} datasetInfo={datasetInfo} />
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics Table */}
      <SummaryStatTable file={file} datasetInfo={datasetInfo} />

      {/* Missing Values Detailed Table */}
      <MissingValuesTable file={file} datasetInfo={datasetInfo} />
    </div>
  );
};

export default DataAnalysisDetails;
