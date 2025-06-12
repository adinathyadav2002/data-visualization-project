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
  Legend,
} from "recharts";
import { CustomTooltip } from "../layout/CustomToolTip";
import { dataAnalysisData } from "../../data/analysis";

export default function OverviewCharts({ file, datasetInfo }) {
  const COLORS = dataAnalysisData.getColors();
  // default values can be object or []
  const getDataProperty = (
    key: string,
    defaultValue: Record<string, number> | any[] = {}
  ) => {
    if (file && key in file) return file[key];
    if (datasetInfo && key in datasetInfo) return datasetInfo[key];
    return defaultValue;
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

  const columns = getDataProperty("columns", {});
  const numericColumns = getDataProperty("numeric_columns", []);
  const categoricalColumns = getDataProperty("categorical_columns", []);
  const shape = getDataProperty("shape", [0, 0]);

  const cols = shape[1] || 0;

  return (
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
                      cols - numericColumns.length - categoricalColumns.length,
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
  );
}
