import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { dataAnalysisData } from "../../data/analysis";
import { CustomTooltip } from "../layout/CustomToolTip";

export default function MissingValuesVisualization({ file, datasetInfo }) {
  const getDataProperty = (key: string, defaultValue: any = null) => {
    if (file && key in file) return file[key];
    if (datasetInfo && key in datasetInfo) return datasetInfo[key];
    return defaultValue;
  };
  const COLORS = dataAnalysisData.getColors();
  const missingValues = getDataProperty("missing_values", {});

  // Helper to safely cast info to expected type
  const safeInfo = (info: unknown) =>
    typeof info === "object" && info !== null
      ? (info as {
          null_count?: number;
          null_percentage?: number;
          total_rows?: number;
        })
      : {};

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

  return (
    <>
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
                                <p className="font-medium">{data.fullColumn}</p>
                                <p className="text-red-600">
                                  Missing: {data.missing}
                                </p>
                                <p className="text-green-600">
                                  Complete: {data.complete}
                                </p>
                                <p>Missing %: {data.percentage.toFixed(1)}%</p>
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
    </>
  );
}
