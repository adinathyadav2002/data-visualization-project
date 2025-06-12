import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { NavbarMain } from "./components/layout/NavbarMain";
import { SignupForm } from "./pages/SignupForm";
import SigninForm from "./pages/SignInForm";
import { SidebarMain } from "./components/layout/Sidebar";
import { LoginProvider } from "./context/user";
import DashboardComponent from "./pages/Dashboard";
import ProfileComponent from "./pages/Profile";
import DatasetViewerPage from "./pages/DatasetViewerPage";
import DataUploader from "./pages/DataUploader";
import { useState } from "react";
import DataAnalysisDetails from "./pages/DataAnalysisDetails";
import { useToast } from "@/hooks/use-toast";
import { DatasetInfo, File } from "@/types/types";
import ChartBuilder from "./pages/CreateCharts";

const queryClient = new QueryClient();

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DatasetInfo | null>(null);
  const [converting, setConverting] = useState(false);
  const [loadingFullDataset, setLoadingFullDataset] = useState(false);
  const [originalFile, setOriginalFile] = useState<any>(null);
  const { toast } = useToast();

  const onUploadSuccess = (
    data: DatasetInfo,
    file: File,
    originalFile: any
  ) => {
    console.log(data, file);
    setData(data);
    setFile(file);
    setOriginalFile(originalFile);
  };

  // File conversion handler
  const handleConvertFile = async (outputFormat = "csv") => {
    try {
      const formData = new FormData();
      formData.append("file", originalFile);

      // Add the output_format as a query parameter
      const url = new URL(
        `${import.meta.env.VITE_BACKEND_URL}api/data/convert-file`
      );
      url.searchParams.append("output_format", outputFormat);

      const response = await fetch(url.toString(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Conversion failed");
      }

      // Handle the file download
      const blob = await response.blob();
      const filename =
        response.headers
          .get("Content-Disposition")
          ?.split("filename=")[1]
          ?.replace(/"/g, "") ||
        `converted.${outputFormat === "excel" ? "xlsx" : "csv"}`;

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "File converted successfully",
        description: `File converted to ${outputFormat.toUpperCase()} format`,
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: error.message || "Failed to convert file",
        variant: "destructive",
      });
    }
  };

  // Load full dataset handler
  const handleLoadFullDataset = async () => {
    if (!file) return;
    setLoadingFullDataset(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/data/get-full-dataset`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load full dataset");
      }

      const fullData = await response.json();
      setData(fullData);

      toast({
        title: "Dataset loaded successfully",
        description: "Full dataset is now available in the dataset viewer.",
      });

      // Optionally navigate to dataset viewer
      // You can use react-router's navigate here if needed
    } catch (error) {
      console.error("Load dataset error:", error);
      toast({
        title: "Failed to load dataset",
        description:
          error.message || "Failed to load full dataset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingFullDataset(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LoginProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<NavbarMain children={<Index />} />} />
              <Route
                path="/register"
                element={<NavbarMain children={<SignupForm />} />}
              />
              <Route
                path="/login"
                element={<NavbarMain children={<SigninForm />} />}
              />
              <Route element={<SidebarMain />}>
                <Route
                  path="dashboard"
                  element={
                    <DashboardComponent dataUploaded={file ? true : false} />
                  }
                />
                <Route path="profile" element={<ProfileComponent />} />
                <Route
                  path="data-uploader"
                  element={<DataUploader onUploadSuccess={onUploadSuccess} />}
                />
                <Route
                  path="data-analysis"
                  element={
                    <DataAnalysisDetails
                      datasetInfo={data}
                      file={file}
                      converting={converting}
                      loadingFullDataset={loadingFullDataset}
                      onConvertFile={handleConvertFile}
                      onLoadFullDataset={handleLoadFullDataset}
                    />
                  }
                />
                <Route
                  path="dataset-viewer"
                  element={<DatasetViewerPage data={data} />}
                />
                <Route path="charts-creator" element={<ChartBuilder />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LoginProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
