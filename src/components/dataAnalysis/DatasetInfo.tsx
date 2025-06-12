import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, BarChart3, FileText, TrendingUp } from "lucide-react";

export default function DatasetInfo({ file, datasetInfo }) {
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

  return (
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
                      {safeInfo(info).null_percentage?.toFixed(1) || 0}% missing
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-green-600">No missing values found!</p>
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
  );
}
