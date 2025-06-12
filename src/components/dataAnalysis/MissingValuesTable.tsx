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

export default function MissingValuesTable({ file, datasetInfo }) {
  // Helper to safely cast info to expected type
  const safeInfo = (info: unknown) =>
    typeof info === "object" && info !== null
      ? (info as {
          null_count?: number;
          null_percentage?: number;
          total_rows?: number;
        })
      : {};
  const getDataProperty = (key: string, defaultValue: any = null) => {
    if (file && key in file) return file[key];
    if (datasetInfo && key in datasetInfo) return datasetInfo[key];
    return defaultValue;
  };
  const missingValues = getDataProperty("missing_values", {});
  const columns = getDataProperty("columns", {});

  return (
    <>
      {Object.keys(missingValues).length > 0 && (
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
                    <TableHead className="whitespace-nowrap">Column</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Data Type
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Missing Count
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Missing %
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(missingValues).map(([col, info]) => (
                    <TableRow key={col}>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[150px]" title={col}>
                          {col}
                        </div>
                      </TableCell>
                      <TableCell>{columns[col] || "Unknown"}</TableCell>
                      <TableCell>{safeInfo(info).null_count || 0}</TableCell>
                      <TableCell>
                        {safeInfo(info).null_percentage?.toFixed(1) || 0}%
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            (safeInfo(info).null_count || 0) === 0
                              ? "bg-green-100 text-green-800"
                              : (safeInfo(info).null_percentage || 0) > 50
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {(safeInfo(info).null_count || 0) === 0
                            ? "Complete"
                            : (safeInfo(info).null_percentage || 0) > 50
                            ? "High Missing"
                            : "Some Missing"}
                        </span>
                      </TableCell>
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
