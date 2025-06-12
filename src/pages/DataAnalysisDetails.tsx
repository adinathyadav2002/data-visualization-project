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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  BarChart3,
  Download,
  AlertTriangle,
  Database,
  Eye,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import { CustomTooltip } from "../components/layout/CustomToolTip";
import OverviewCharts from "@/components/dataAnalysis/OverviewCharts";
import { dataAnalysisData } from "../data/analysis";
import CategoricalDataVisual from "@/components/dataAnalysis/CategoricalDataVisual";
import NumericDataVisualization from "@/components/dataAnalysis/NumericDataVisualization";
import SummaryStatTable from "@/components/dataAnalysis/SummaryStatTable";
import MissingValuesTable from "@/components/dataAnalysis/MissingValuesTable";
import MissingValuesVisualization from "@/components/dataAnalysis/MissingValuesVisualization";

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
  const COLORS = dataAnalysisData.getColors();

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
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
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

          {/* Optional floating elements for visual interest */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-25 animate-bounce"></div>
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
        <OverviewCharts datasetInfo={datasetInfo} file={file} />
      )}

      {/* Categorical Data Visualization */}
      {activeChart === "categorical" && categoricalColumns.length > 0 && (
        <CategoricalDataVisual file={file} datasetInfo={datasetInfo} />
      )}

      {/* Numeric Data Visualization */}
      {activeChart === "numeric" && numericColumns.length > 0 && (
        <NumericDataVisualization file={file} datasetInfo={datasetInfo} />
      )}

      {/* Missing Data Visualization */}
      {activeChart === "missing" && Object.keys(missingValues).length > 0 && (
        <MissingValuesVisualization file={file} datasetInfo={datasetInfo} />
      )}

      {/* Summary Statistics Table */}
      <SummaryStatTable file={file} datasetInfo={datasetInfo} />

      {/* Missing Values Detailed Table */}
      <MissingValuesTable file={file} datasetInfo={datasetInfo} />
    </div>
  );
};

export default DataAnalysisDetails;
