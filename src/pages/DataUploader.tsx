import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChartColumnStacked,
  FileSpreadsheet,
  FileText,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DataUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setLinks, links } = useOutletContext() || {};

  const handleAddSidebarLinks = () => {
    if (!setLinks || !links) return;
    const logoutIndex = links.findIndex((l) => l.label === "Logout");
    const newLinks = [...links];
    const analysisLink = {
      label: "Data Analysis",
      to: "/data-analysis",
      icon: <ChartColumnStacked className="h-5 w-5" />,
    };
    const viewerLink = {
      label: "Dataset Viewer",
      to: "/dataset-viewer",
      icon: <FileSpreadsheet className="h-5 w-5" />,
    };
    [analysisLink.label, viewerLink.label].forEach((label) => {
      const idx = newLinks.findIndex((l) => l.label === label);
      if (idx !== -1) newLinks.splice(idx, 1);
    });
    const insertAt = logoutIndex !== -1 ? logoutIndex : newLinks.length;
    newLinks.splice(insertAt, 0, viewerLink);
    newLinks.splice(insertAt, 0, analysisLink);
    setLinks(newLinks);
  };

  // Reset file state after successful upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const validExtensions = [".csv", ".xlsx", ".xls"];
      if (
        validTypes.includes(selectedFile.type) ||
        validExtensions.some((ext) =>
          selectedFile.name.toLowerCase().endsWith(ext)
        )
      ) {
        setFile(selectedFile);
      } else {
        setFile(null);
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file.",
          variant: "destructive",
        });
      }
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/data/upload-file`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Upload failed");
      }
      const data = await response.json();
      toast({
        title: "File uploaded successfully",
        description: `Dataset analyzed: ${data.shape?.[0] || 0} rows, ${
          data.shape?.[1] || 0
        } columns`,
      });
      //   function to handle successful upload
      onUploadSuccess?.(data, file);
      handleAddSidebarLinks();
      // Optionally reset file after upload
      // setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error.message ||
          `Please ensure the backend server is running on ${
            import.meta.env.VITE_BACKEND_URL
          } and try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full h-screen">
      <Card className="shadow-lg  border-0 bg-gradient-to-br from-blue-50 to-white dark:from-neutral-900 dark:to-neutral-800 px-6 py-8 sm:px-10 sm:py-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-2xl font-bold">
            <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Upload Dataset
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
            Effortlessly upload your{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-300">
              CSV
            </span>{" "}
            or{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-300">
              Excel
            </span>{" "}
            files to unlock powerful data analysis and visualization features.{" "}
            <br />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Supported formats: .csv, .xlsx, .xls. Your data is processed
              securely and never stored without your consent.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="cursor-pointer border-2 border-blue-200 dark:border-blue-700 rounded-lg py-3 px-4 bg-white dark:bg-neutral-900 hover:border-blue-400 transition-colors text-base"
            />
            {file && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-blue-100/70 dark:bg-blue-900/30 rounded-xl gap-4 border border-blue-200 dark:border-blue-700 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300 flex-shrink-0" />
                  <span className="text-base font-medium truncate text-blue-900 dark:text-blue-100">
                    {file.name}
                  </span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={uploadFile}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold px-8 py-2 rounded-lg shadow-md transition-all duration-200 w-full sm:w-auto text-base"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Upload & Analyze
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>
              Need help formatting your data?{" "}
              <span className="font-medium text-blue-700 dark:text-blue-300">
                See our{" "}
                <a href="#" className="underline hover:text-blue-500">
                  sample files
                </a>
              </span>{" "}
              or{" "}
              <span className="font-medium text-blue-700 dark:text-blue-300">
                read the upload guide
              </span>{" "}
              for best results.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUploader;
