import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Info,
  Hash,
  AlertCircle,
} from "lucide-react";
import { dataAnalysisData } from "../../data/analysis";
import { cn } from "@/lib/utils";

interface CategoryItem {
  category: string;
  count: number;
}

export default function CategoricalDataVisual({
  file,
  datasetInfo,
}: {
  file: any;
  datasetInfo: any;
}) {
  const COLORS = dataAnalysisData.getColors();
  const [chartTypes, setChartTypes] = useState<Record<string, "bar" | "pie">>({});

  const getDataProperty = (
    key: string,
    defaultValue: Record<string, any> | any[] = {}
  ) => {
    if (file && key in file) return file[key];
    if (datasetInfo && key in datasetInfo) return datasetInfo[key];
    return defaultValue;
  };

  const categoricalData: Record<string, CategoryItem[]> = getDataProperty(
    "categorical_data",
    {}
  );
  const shape = getDataProperty("shape", [0, 0]);
  const totalRows = shape[0] || 0;

  // Determine if a column represents unique identifiers, hashes, phone numbers, or keys
  const isIdentifierColumn = (
    columnName: string,
    items: CategoryItem[]
  ): boolean => {
    if (!Array.isArray(items) || items.length === 0) return true;

    const nameLower = columnName.toLowerCase();
    const hasIdentifierName =
      /id$|^id|_id|uuid|phone|mobile|contact|email|serial|hash|token|voter_ser_no|address|timestamp|url/i.test(
        nameLower
      );

    // If every single entry has count === 1, it's 100% unique data
    const allCountOne = items.length > 1 && items.every((i) => i.count === 1);

    // Check if values look like UUIDs, hex codes, or random hashes
    const looksLikeUUID = items.some(
      (i) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(i.category) ||
        (i.category && i.category.length > 25)
    );

    // Check if values look like phone numbers
    const looksLikePhone = items.some((i) =>
      /^(\+?\d[\d\s-]{7,}|[*]{4,}\d+)/.test(i.category)
    );

    return (
      allCountOne ||
      (hasIdentifierName && items.every((i) => i.count <= 2)) ||
      (looksLikeUUID && allCountOne) ||
      (looksLikePhone && items.every((i) => i.count <= 2))
    );
  };

  // Group columns into analytical categories vs identifiers
  const { analyticalColumns, identifierColumns } = Object.entries(
    categoricalData
  ).reduce(
    (acc, [column, data]) => {
      const items = Array.isArray(data) ? data : [];
      if (isIdentifierColumn(column, items)) {
        acc.identifierColumns.push({ column, items });
      } else {
        acc.analyticalColumns.push({ column, items });
      }
      return acc;
    },
    {
      analyticalColumns: [] as Array<{ column: string; items: CategoryItem[] }>,
      identifierColumns: [] as Array<{ column: string; items: CategoryItem[] }>,
    }
  );

  const getChartType = (column: string, itemCount: number): "bar" | "pie" => {
    if (chartTypes[column]) return chartTypes[column];
    // Default to pie chart if 5 or fewer categories, otherwise bar chart
    return itemCount <= 5 ? "pie" : "bar";
  };

  const toggleChartType = (column: string, type: "bar" | "pie") => {
    setChartTypes((prev) => ({ ...prev, [column]: type }));
  };

  const prepareCategoricalChartData = (columnData: CategoryItem[]) => {
    if (!Array.isArray(columnData)) return [];
    return columnData.slice(0, 10).map((item, index) => ({
      category:
        item.category && item.category.length > 18
          ? `${item.category.substring(0, 18)}...`
          : item.category || "Unknown",
      fullCategory: item.category || "Unknown",
      count: item.count || 0,
      fill: COLORS[index % COLORS.length],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Informational Banner if Identifier Columns were Filtered Out */}
      {identifierColumns.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/40 shadow-sm">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg mt-0.5 sm:mt-0">
                <Hash className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Unique Identifiers & Primary Keys Detected
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  The following fields contain unique record identifiers (UUIDs, phone numbers, etc.) rather than categorical groups:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {identifierColumns.map(({ column }) => (
                    <Badge
                      key={column}
                      variant="outline"
                      className="text-xs bg-white text-slate-700 border-slate-300 font-mono"
                    >
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500 italic shrink-0 self-end sm:self-center">
              Excluded from category charts to prevent 1-count skew
            </span>
          </CardContent>
        </Card>
      )}

      {/* No Analytical Categories Fallback */}
      {analyticalColumns.length === 0 && (
        <Card className="border border-slate-200 text-center p-8 bg-white">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <CardTitle className="text-base font-semibold text-slate-800 mb-1">
            No Categorical Groupings Found
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 max-w-md mx-auto">
            All text columns in this dataset appear to be unique identifiers, names, or contact fields with mostly unique values per row.
          </CardDescription>
        </Card>
      )}

      {/* Meaningful Analytical Categorical Charts (One per Column, No Duplicates) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analyticalColumns.map(({ column, items }) => {
          const chartData = prepareCategoricalChartData(items);
          const currentType = getChartType(column, items.length);

          const totalColumnSamples = items.reduce(
            (sum, item) => sum + (item.count || 0),
            0
          );
          const topItem = items[0] || { category: "N/A", count: 0 };
          const topPercentage =
            totalColumnSamples > 0
              ? ((topItem.count / totalColumnSamples) * 100).toFixed(1)
              : "0";

          // Generate analytical conclusion
          let conclusion = "";
          if (Number(topPercentage) >= 50) {
            conclusion = `Dominant Pattern: "${topItem.category}" accounts for over half (${topPercentage}%) of all recorded entries.`;
          } else if (items.length <= 3) {
            conclusion = `Concentrated: Entries are distributed across just ${items.length} primary groups.`;
          } else {
            conclusion = `Distribution: "${topItem.category}" leads with ${topPercentage}%, followed by ${items.length - 1} other categories.`;
          }

          return (
            <Card
              key={column}
              className="border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden"
            >
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {column}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Distribution across {items.length} observed categories
                    </CardDescription>
                  </div>

                  {/* Chart Type Toggle: No duplicate charts */}
                  <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-md shrink-0">
                    <Button
                      variant={currentType === "bar" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => toggleChartType(column, "bar")}
                      className={cn(
                        "h-6 px-2 text-[11px] flex items-center gap-1 rounded",
                        currentType === "bar"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                      title="View as Bar Chart"
                    >
                      <BarChart3 className="h-3 w-3" />
                      <span>Bar</span>
                    </Button>
                    <Button
                      variant={currentType === "pie" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => toggleChartType(column, "pie")}
                      className={cn(
                        "h-6 px-2 text-[11px] flex items-center gap-1 rounded",
                        currentType === "pie"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                      title="View as Pie Chart"
                    >
                      <PieChartIcon className="h-3 w-3" />
                      <span>Pie</span>
                    </Button>
                  </div>
                </div>

                {/* Analytical Conclusion Banner */}
                <div className="mt-2.5 p-2 bg-blue-50/60 border border-blue-100 rounded text-xs text-blue-900 flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium truncate">{conclusion}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {currentType === "bar" ? (
                      <BarChart
                        data={chartData}
                        margin={{ top: 15, right: 20, left: 0, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="category"
                          angle={-35}
                          textAnchor="end"
                          height={60}
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis fontSize={11} tickLine={false} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              const pct =
                                totalColumnSamples > 0
                                  ? (
                                      (d.count / totalColumnSamples) *
                                      100
                                    ).toFixed(1)
                                  : "0";
                              return (
                                <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs">
                                  <p className="font-semibold">{d.fullCategory}</p>
                                  <p className="text-blue-300 mt-1">
                                    Count: <span className="text-white font-mono">{d.count}</span> ({pct}%)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="count"
                          radius={[4, 4, 0, 0]}
                          fill="#3b82f6"
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`bar-${idx}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ percent }) =>
                            percent > 0.05
                              ? `${(percent * 100).toFixed(0)}%`
                              : ""
                          }
                          outerRadius={95}
                          dataKey="count"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              const pct =
                                totalColumnSamples > 0
                                  ? (
                                      (d.count / totalColumnSamples) *
                                      100
                                    ).toFixed(1)
                                  : "0";
                              return (
                                <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs">
                                  <p className="font-semibold">{d.fullCategory}</p>
                                  <p className="text-blue-300 mt-1">
                                    Count: <span className="text-white font-mono">{d.count}</span> ({pct}%)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Values Breakdown Chips */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                  {items.slice(0, 6).map((item, idx) => {
                    const pct =
                      totalColumnSamples > 0
                        ? ((item.count / totalColumnSamples) * 100).toFixed(0)
                        : "0";
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700"
                      >
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{
                            backgroundColor: COLORS[idx % COLORS.length],
                          }}
                        />
                        <span className="font-medium truncate max-w-[100px]">
                          {item.category || "Empty"}
                        </span>
                        <span className="text-slate-400 font-mono">
                          {item.count} ({pct}%)
                        </span>
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
