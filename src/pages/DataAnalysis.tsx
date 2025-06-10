import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartTooltip } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Upload,
  FileText,
  BarChart3,
  TrendingUp,
  Download,
  AlertTriangle,
  Database,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DatasetViewer from "./DatasetViewer";
import Cookie from "js-cookie";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useUserContext } from "@/context/user";
import { verifyUserByToken } from "@/api/auth";
import DataUploader from "./DataUploader";
import DataAnalysisDetails from "./DataAnalysisDetails";

interface DatasetInfo {
  filename: string;
  file_type: string;
  columns: { [key: string]: string };
  shape: [number, number];
  preview: { [key: string]: string }[];
  summary: { [key: string]: { [key: string]: number } };
  numeric_columns: string[];
  categorical_columns: string[];
  categorical_data: {
    [key: string]: Array<{ category: string; count: number }>;
  };
  missing_values: {
    [key: string]: {
      null_count: number;
      null_percentage: number;
      total_rows: number;
    };
  };
}

// Add a type for the outlet context
interface SidebarLink {
  label: string;
  to?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}
interface SidebarContext {
  setLinks: (links: SidebarLink[]) => void;
  links: SidebarLink[];
}

const DataAnalysis = () => {
  // Get setLinks and links from Outlet context
  const { setLinks, links } = useOutletContext<SidebarContext>();
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useUserContext();

  // Ensure the user is authenticated before accessing this page
  useEffect(() => {
    // check if the user is verified using jwt token
    const verifyUser = async () => {
      const token = Cookie.get("access_token");

      if (!token) {
        toast({
          title: "Unauthorized",
          description: "Please login to access the data analysis features.",
          variant: "destructive",
        });
        navigate("/login");
      }

      if (!isAuthenticated) {
        try {
          await verifyUserByToken(token);
        } catch (error) {
          console.error("Verification error:", error);
          navigate("/login");
        }
      }
    };
    verifyUser();
  }, [isAuthenticated, navigate, toast]);

  // Handler for successful upload
  const handleUploadSuccess = (data, uploadedFile) => {
    if (!data || !data.shape || !data.columns) {
      // Defensive: show error if API response is not as expected
      toast({
        title: "Invalid API response",
        description: "The server did not return valid dataset info.",
        variant: "destructive",
      });
      return;
    }
    setDatasetInfo(data);
    setFile(uploadedFile);
    // Insert Data Analysis and Dataset Viewer links before Logout
    const logoutIndex = links.findIndex((l) => l.label === "Logout");
    const newLinks = [...links];
    const analysisLink = {
      label: "Data Analysis",
      to: "/data-analysis",
      icon: <BarChart3 className="h-5 w-5" />,
    };
    const viewerLink = {
      label: "Dataset Viewer",
      to: "/dataset-viewer",
      icon: <Database className="h-5 w-5" />,
    };
    // Remove if already present
    [analysisLink.label, viewerLink.label].forEach((label) => {
      const idx = newLinks.findIndex((l) => l.label === label);
      if (idx !== -1) newLinks.splice(idx, 1);
    });
    // Insert before logout or at end if logout not found
    const insertAt = logoutIndex !== -1 ? logoutIndex : newLinks.length;
    newLinks.splice(insertAt, 0, viewerLink);
    newLinks.splice(insertAt, 0, analysisLink);
    setLinks(newLinks);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 w-full">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">
            Data Analysis
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Upload and analyze your CSV or Excel datasets
          </p>
        </div>
        <DataUploader onUploadSuccess={handleUploadSuccess} />
        {datasetInfo && <DataAnalysisDetails datasetInfo={datasetInfo} />}
      </div>
    </div>
  );
};

export default DataAnalysis;
