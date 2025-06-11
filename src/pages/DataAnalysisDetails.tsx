import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const DataAnalysisDetails = ({ datasetInfo }) => {
  if (!datasetInfo) return null;
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Dataset Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">File Type:</span>{" "}
              {datasetInfo.file_type.toUpperCase()}
            </p>
            <p>
              <span className="font-semibold">Rows:</span>{" "}
              {datasetInfo.shape[0]}
            </p>
            <p>
              <span className="font-semibold">Columns:</span>{" "}
              {datasetInfo.shape[1]}
            </p>
            <p>
              <span className="font-semibold">Numeric Cols:</span>{" "}
              {datasetInfo.numeric_columns.length}
            </p>
            <p>
              <span className="font-semibold">Categorical Cols:</span>{" "}
              {datasetInfo.categorical_columns.length}
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Add more cards for column types, missing values, quick stats, etc. as needed */}
    </div>
  );
};

export default DataAnalysisDetails;
