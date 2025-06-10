import React from "react";
import DatasetViewer from "./DatasetViewer";
import type { DatasetInfo } from "./DataAnalysis";

const DatasetViewerPage = ({ data }: { data: DatasetInfo | null }) => {
  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        No dataset loaded. Please upload a file first.
      </div>
    );
  }
  return (
    <div className="w-full bg-gray-50 p-4">
      <DatasetViewer data={data.preview} columns={data.columns} />
    </div>
  );
};

export default DatasetViewerPage;
