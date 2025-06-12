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
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { dataAnalysisData } from "../../data/analysis";

export default function CategoricalDataVisual({ file, datasetInfo }) {
  const COLORS = dataAnalysisData.getColors();
  const getDataProperty = (
    key: string,
    defaultValue: Record<string, number> | any[] = {}
  ) => {
    if (file && key in file) return file[key];
    if (datasetInfo && key in datasetInfo) return datasetInfo[key];
    return defaultValue;
  };
  const categoricalData = getDataProperty("categorical_data", {});
  const shape = getDataProperty("shape", [0, 0]);

  // Helper for categorical chart data
  const safeCategoricalData = (data: unknown) =>
    Array.isArray(data) ? data : [];

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
  return (
    <div className="space-y-6">
      {Object.entries(categoricalData).map(([column, data]) => (
        <div key={column} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="truncate">{column} - Bar Chart</CardTitle>
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
                              <p className="font-medium">{data.fullCategory}</p>
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
              <CardTitle className="truncate">{column} - Pie Chart</CardTitle>
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
                              <p className="font-medium">{data.fullCategory}</p>
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
  );
}
