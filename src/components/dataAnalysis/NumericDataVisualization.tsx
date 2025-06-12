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
  AreaChart,
  Area,
} from "recharts";
import { dataAnalysisData } from "../../data/analysis";
import { CustomTooltip } from "../layout/CustomToolTip";

export default function NumericDataVisualization({ file, datasetInfo }) {
  const COLORS = dataAnalysisData.getColors();
  const getDataProperty = (key: string, defaultValue: any = null) => {
    if (file && key in file) return file[key];
    if (datasetInfo && key in datasetInfo) return datasetInfo[key];
    return defaultValue;
  };

  const summary = getDataProperty("summary", {});

  const shape = getDataProperty("shape", [0, 0]);

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
  return (
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
  );
}
