import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SummaryStatTable({ file, datasetInfo }) {
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

  return (
    <>
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
    </>
  );
}
