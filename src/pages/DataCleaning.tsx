import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  AlertCircle,
  Copy,
  Type,
  FileText,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  Download,
  ChevronRight,
  Info,
  Play,
  CheckCircle,
  Database,
  Filter,
  Zap,
  RefreshCw,
  Undo2,
  Sparkles,
  UploadCloud,
  ArrowRight,
  Check,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataCleaningProps {
  datasetInfo?: any;
  file?: any;
  onUpdateData?: (newData: any) => void;
}

export default function DataCleaning({
  datasetInfo,
  file,
  onUpdateData,
}: DataCleaningProps) {
  const { toast } = useToast();

  // Helper to extract rows
  const extractInitialRows = (): any[] => {
    if (!datasetInfo) return [];
    if (Array.isArray(datasetInfo)) return datasetInfo;
    if (Array.isArray(datasetInfo.data)) return datasetInfo.data;
    if (Array.isArray(datasetInfo.preview)) return datasetInfo.preview;
    return [];
  };

  // Original raw data and current cleaned data state
  const [originalRows, setOriginalRows] = useState<any[]>(extractInitialRows);
  const [currentRows, setCurrentRows] = useState<any[]>(extractInitialRows);
  const [history, setHistory] = useState<any[][]>([]);
  const [cleaningLog, setCleaningLog] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [activeStep, setActiveStep] = useState<string | null>("missing");
  const [previewFilter, setPreviewFilter] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sync if new datasetInfo arrives from parent
  useEffect(() => {
    const rows = extractInitialRows();
    if (rows.length > 0 && originalRows.length === 0) {
      setOriginalRows(rows);
      setCurrentRows(rows);
    }
  }, [datasetInfo]);

  // Detected Columns
  const columns = useMemo(() => {
    if (currentRows.length === 0) return [];
    return Object.keys(currentRows[0]);
  }, [currentRows]);

  // Detect Column Types (numeric vs text vs date)
  const columnTypes = useMemo(() => {
    const types: Record<string, "numeric" | "text" | "date" | "boolean"> = {};
    if (currentRows.length === 0) return types;

    columns.forEach((col) => {
      let isNum = true;
      let isBool = true;
      let nonNullCount = 0;

      for (let i = 0; i < Math.min(currentRows.length, 50); i++) {
        const val = currentRows[i][col];
        if (val !== null && val !== undefined && val !== "") {
          nonNullCount++;
          if (typeof val !== "boolean" && val !== "true" && val !== "false") {
            isBool = false;
          }
          if (isNaN(Number(val))) {
            isNum = false;
          }
        }
      }

      if (nonNullCount > 0 && isBool) {
        types[col] = "boolean";
      } else if (nonNullCount > 0 && isNum) {
        types[col] = "numeric";
      } else {
        types[col] = "text";
      }
    });

    return types;
  }, [currentRows, columns]);

  // Duplicate Rows Detection
  const duplicateStats = useMemo(() => {
    if (currentRows.length === 0) return { count: 0, duplicateIndices: new Set<number>() };
    const seen = new Set<string>();
    const dupIndices = new Set<number>();

    currentRows.forEach((row, idx) => {
      const key = JSON.stringify(row);
      if (seen.has(key)) {
        dupIndices.add(idx);
      } else {
        seen.add(key);
      }
    });

    return { count: dupIndices.size, duplicateIndices: dupIndices };
  }, [currentRows]);

  // Missing Values Detection
  const missingStats = useMemo(() => {
    const perCol: Record<string, number> = {};
    let totalMissing = 0;

    columns.forEach((col) => {
      let missingInCol = 0;
      currentRows.forEach((row) => {
        const val = row[col];
        if (val === null || val === undefined || val === "" || String(val).trim() === "") {
          missingInCol++;
        }
      });
      perCol[col] = missingInCol;
      totalMissing += missingInCol;
    });

    return { total: totalMissing, perColumn: perCol };
  }, [currentRows, columns]);

  // Quality Health Score (0 - 100)
  const qualityScore = useMemo(() => {
    if (currentRows.length === 0 || columns.length === 0) return 100;
    const totalCells = currentRows.length * columns.length;
    const missingRatio = missingStats.total / totalCells;
    const dupRatio = duplicateStats.count / currentRows.length;
    const score = Math.max(10, Math.round(100 - (missingRatio * 50 + dupRatio * 50)));
    return score;
  }, [currentRows, columns, missingStats, duplicateStats]);

  // Push to undo stack
  const recordHistory = (newRows: any[], logMessage: string) => {
    setHistory((prev) => [...prev, currentRows]);
    setCurrentRows(newRows);
    setCleaningLog((prev) => [`[${new Date().toLocaleTimeString()}] ${logMessage}`, ...prev]);
  };

  // Undo Last Operation
  const handleUndo = () => {
    if (history.length === 0) return;
    const prevRows = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setCurrentRows(prevRows);
    setCleaningLog((prev) => [
      `[${new Date().toLocaleTimeString()}] Reverted last operation`,
      ...prev,
    ]);
    toast({
      title: "Undo Successful",
      description: "Previous dataset state restored.",
    });
  };

  // Reset to Raw Dataset
  const handleReset = () => {
    if (originalRows.length === 0) return;
    setHistory([]);
    setCurrentRows(originalRows);
    setCompletedSteps(new Set());
    setCleaningLog([`[${new Date().toLocaleTimeString()}] Dataset reset to original raw state`]);
    toast({
      title: "Dataset Reset",
      description: "All cleaning transformations have been reverted to raw data.",
    });
  };

  // Sync to Parent App (App.tsx)
  const handleApplyToApp = () => {
    if (onUpdateData) {
      const updated = {
        ...(datasetInfo || {}),
        data: currentRows,
        preview: currentRows.slice(0, 10),
        total_rows: currentRows.length,
        shape: [currentRows.length, columns.length],
        columns: columnTypes,
      };
      onUpdateData(updated);
      toast({
        title: "Cleaned Data Applied",
        description: "Updated dataset is now active across Dashboard, Viewer, and Charts!",
        variant: "default",
      });
    }
  };

  // Step 1: Remove Duplicates
  const [duplicateKeep, setDuplicateKeep] = useState<"first" | "last">("first");
  const handleRemoveDuplicates = () => {
    if (duplicateStats.count === 0) {
      toast({ title: "No Duplicates Found", description: "Dataset has 0 duplicate rows." });
      return;
    }

    const seen = new Set<string>();
    const newRows: any[] = [];
    const sourceRows = duplicateKeep === "last" ? [...currentRows].reverse() : currentRows;

    sourceRows.forEach((row) => {
      const key = JSON.stringify(row);
      if (!seen.has(key)) {
        seen.add(key);
        newRows.push(row);
      }
    });

    const finalRows = duplicateKeep === "last" ? newRows.reverse() : newRows;
    const removedCount = currentRows.length - finalRows.length;

    recordHistory(finalRows, `Removed ${removedCount} duplicate rows (keep='${duplicateKeep}')`);
    setCompletedSteps((prev) => new Set(prev).add("duplicates"));
    toast({
      title: "Duplicates Removed",
      description: `Successfully eliminated ${removedCount} duplicate rows.`,
    });
  };

  // Step 2: Handle Missing Data
  const [missingStrategy, setMissingStrategy] = useState<
    "drop" | "mean" | "median" | "mode" | "constant"
  >("mean");
  const [missingSelectedCol, setMissingSelectedCol] = useState<string>("all");
  const [customFillValue, setCustomFillValue] = useState<string>("");

  const handleFixMissing = () => {
    if (missingStats.total === 0) {
      toast({ title: "No Missing Data", description: "Dataset has no empty or null cells." });
      return;
    }

    let newRows = [...currentRows];
    let changesCount = 0;

    if (missingStrategy === "drop") {
      const initialCount = newRows.length;
      newRows = newRows.filter((row) => {
        if (missingSelectedCol === "all") {
          return columns.every(
            (col) =>
              row[col] !== null &&
              row[col] !== undefined &&
              String(row[col]).trim() !== ""
          );
        } else {
          return (
            row[missingSelectedCol] !== null &&
            row[missingSelectedCol] !== undefined &&
            String(row[missingSelectedCol]).trim() !== ""
          );
        }
      });
      changesCount = initialCount - newRows.length;
      recordHistory(newRows, `Dropped ${changesCount} rows containing missing values`);
    } else {
      const targetCols = missingSelectedCol === "all" ? columns : [missingSelectedCol];

      targetCols.forEach((col) => {
        const isNumeric = columnTypes[col] === "numeric";
        let fillVal: any = customFillValue || (isNumeric ? 0 : "Unknown");

        if (missingStrategy === "mean" && isNumeric) {
          const numbers = newRows
            .map((r) => Number(r[col]))
            .filter((n) => !isNaN(n) && n !== null && n !== undefined);
          const mean = numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
          fillVal = Math.round(mean * 100) / 100;
        } else if (missingStrategy === "median" && isNumeric) {
          const numbers = newRows
            .map((r) => Number(r[col]))
            .filter((n) => !isNaN(n))
            .sort((a, b) => a - b);
          fillVal = numbers.length > 0 ? numbers[Math.floor(numbers.length / 2)] : 0;
        } else if (missingStrategy === "mode") {
          const counts: Record<string, number> = {};
          newRows.forEach((r) => {
            const v = r[col];
            if (v !== null && v !== undefined && String(v).trim() !== "") {
              counts[String(v)] = (counts[String(v)] || 0) + 1;
            }
          });
          const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
          fillVal = best ? best[0] : isNumeric ? 0 : "N/A";
        }

        newRows = newRows.map((row) => {
          const val = row[col];
          if (val === null || val === undefined || String(val).trim() === "") {
            changesCount++;
            return { ...row, [col]: fillVal };
          }
          return row;
        });
      });

      recordHistory(
        newRows,
        `Imputed ${changesCount} missing values using strategy '${missingStrategy}'`
      );
    }

    setCompletedSteps((prev) => new Set(prev).add("missing"));
    toast({
      title: "Missing Data Fixed",
      description: `Updated missing cells across dataset successfully.`,
    });
  };

  // Step 3: Standardize Column Names
  const [colCasing, setColCasing] = useState<"snake_case" | "lowercase" | "uppercase" | "camelCase">(
    "snake_case"
  );
  const handleStandardizeColumns = () => {
    if (columns.length === 0) return;
    const renameMap: Record<string, string> = {};

    columns.forEach((col) => {
      let cleaned = col.trim();
      if (colCasing === "snake_case") {
        cleaned = cleaned
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, "_")
          .toLowerCase();
      } else if (colCasing === "lowercase") {
        cleaned = cleaned.toLowerCase();
      } else if (colCasing === "uppercase") {
        cleaned = cleaned.toUpperCase();
      } else if (colCasing === "camelCase") {
        cleaned = cleaned
          .replace(/[^\w\s]/g, "")
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
      }
      renameMap[col] = cleaned || col;
    });

    const newRows = currentRows.map((row) => {
      const newRow: any = {};
      Object.keys(row).forEach((k) => {
        newRow[renameMap[k] || k] = row[k];
      });
      return newRow;
    });

    recordHistory(newRows, `Standardized ${columns.length} column names to ${colCasing}`);
    setCompletedSteps((prev) => new Set(prev).add("columns"));
    toast({
      title: "Column Names Standardized",
      description: `Renamed headers to clean ${colCasing} convention.`,
    });
  };

  // Step 4: Text Cleaning
  const [textAction, setTextAction] = useState<
    "trim" | "lowercase" | "uppercase" | "titlecase" | "remove_symbols"
  >("trim");
  const handleCleanText = () => {
    const textCols = columns.filter((col) => columnTypes[col] === "text");
    if (textCols.length === 0) {
      toast({ title: "No Text Columns", description: "No string columns to clean." });
      return;
    }

    const toTitleCase = (str: string) =>
      str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    const newRows = currentRows.map((row) => {
      const updated = { ...row };
      textCols.forEach((col) => {
        const val = updated[col];
        if (typeof val === "string") {
          if (textAction === "trim") updated[col] = val.trim();
          else if (textAction === "lowercase") updated[col] = val.toLowerCase();
          else if (textAction === "uppercase") updated[col] = val.toUpperCase();
          else if (textAction === "titlecase") updated[col] = toTitleCase(val);
          else if (textAction === "remove_symbols")
            updated[col] = val.replace(/[^a-zA-Z0-9\s]/g, "");
        }
      });
      return updated;
    });

    recordHistory(newRows, `Applied text cleaning (${textAction}) across text columns`);
    setCompletedSteps((prev) => new Set(prev).add("text"));
    toast({
      title: "Text Columns Cleaned",
      description: `Successfully applied '${textAction}' formatting.`,
    });
  };

  // Step 5: Outlier Handling (IQR Method)
  const [outlierMultiplier, setOutlierMultiplier] = useState<number>(1.5);
  const [outlierAction, setOutlierAction] = useState<"remove" | "clip">("remove");
  const handleOutliers = () => {
    const numericCols = columns.filter((col) => columnTypes[col] === "numeric");
    if (numericCols.length === 0) {
      toast({ title: "No Numeric Columns", description: "Outlier filtering requires numeric fields." });
      return;
    }

    let newRows = [...currentRows];
    let detectedOutliers = 0;

    numericCols.forEach((col) => {
      const values = newRows
        .map((r) => Number(r[col]))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      if (values.length < 4) return;

      const q1 = values[Math.floor(values.length * 0.25)];
      const q3 = values[Math.floor(values.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - outlierMultiplier * iqr;
      const upperBound = q3 + outlierMultiplier * iqr;

      if (outlierAction === "remove") {
        const initial = newRows.length;
        newRows = newRows.filter((r) => {
          const val = Number(r[col]);
          return isNaN(val) || (val >= lowerBound && val <= upperBound);
        });
        detectedOutliers += initial - newRows.length;
      } else {
        newRows = newRows.map((r) => {
          const val = Number(r[col]);
          if (!isNaN(val)) {
            if (val < lowerBound) {
              detectedOutliers++;
              return { ...r, [col]: lowerBound };
            }
            if (val > upperBound) {
              detectedOutliers++;
              return { ...r, [col]: upperBound };
            }
          }
          return r;
        });
      }
    });

    recordHistory(
      newRows,
      `${outlierAction === "remove" ? "Removed" : "Clipped"} ${detectedOutliers} statistical outliers using IQR (${outlierMultiplier}x)`
    );
    setCompletedSteps((prev) => new Set(prev).add("outliers"));
    toast({
      title: "Outliers Handled",
      description: `Handled ${detectedOutliers} outlier values via IQR method.`,
    });
  };

  // Step 6: 1-Click Smart Auto-Clean
  const handleAutoClean = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let rows = [...currentRows];

      // 1. Remove exact duplicates
      const seen = new Set<string>();
      const deduped: any[] = [];
      rows.forEach((r) => {
        const key = JSON.stringify(r);
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(r);
        }
      });
      const dupsRemoved = rows.length - deduped.length;
      rows = deduped;

      // 2. Standardize column names to snake_case
      const renameMap: Record<string, string> = {};
      columns.forEach((col) => {
        renameMap[col] = col
          .trim()
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, "_")
          .toLowerCase();
      });
      rows = rows.map((r) => {
        const newR: any = {};
        Object.keys(r).forEach((k) => {
          newR[renameMap[k] || k] = r[k];
        });
        return newR;
      });

      // 3. Trim all string fields
      rows = rows.map((r) => {
        const updated: any = {};
        Object.keys(r).forEach((k) => {
          const val = r[k];
          updated[k] = typeof val === "string" ? val.trim() : val;
        });
        return updated;
      });

      // 4. Record history & log
      recordHistory(
        rows,
        `1-Click Auto-Clean: Standardized headers, trimmed strings, and removed ${dupsRemoved} duplicates`
      );
      setCompletedSteps(new Set(["preview", "missing", "duplicates", "columns", "text"]));
      setIsProcessing(false);

      toast({
        title: "Auto-Clean Completed!",
        description: "Standardized headers, trimmed strings, and eliminated duplicates.",
      });
    }, 300);
  };

  // Export Cleaned CSV
  const handleExportCSV = () => {
    if (currentRows.length === 0) return;
    const headers = Object.keys(currentRows[0]);
    const csvLines = [
      headers.join(","),
      ...currentRows.map((row) =>
        headers
          .map((h) => {
            const v = row[h] ?? "";
            const str = String(v).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(",")
      ),
    ];
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cleaned_${datasetInfo?.filename || "dataset"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV Exported", description: "Cleaned dataset saved as CSV." });
  };

  // Export Cleaned JSON
  const handleExportJSON = () => {
    if (currentRows.length === 0) return;
    const blob = new Blob([JSON.stringify(currentRows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cleaned_${datasetInfo?.filename || "dataset"}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "JSON Exported", description: "Cleaned dataset saved as JSON." });
  };

  // Filter preview table rows
  const filteredPreviewRows = useMemo(() => {
    if (!previewFilter) return currentRows.slice(0, 12);
    const q = previewFilter.toLowerCase();
    return currentRows
      .filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(q))
      )
      .slice(0, 12);
  }, [currentRows, previewFilter]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="w-full mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Data Cleaning & Preparation
                  </h1>
                  <p className="text-sm text-slate-500">
                    A comprehensive guide to cleaning and preparing your data for analysis. Follow these steps to transform raw data into analysis-ready datasets.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={history.length === 0}
                className="text-slate-700 hover:bg-slate-100"
              >
                <Undo2 className="w-4 h-4 mr-1.5" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={history.length === 0 && currentRows === originalRows}
                className="text-slate-700 hover:bg-slate-100"
              >
                <RefreshCw className="w-4 h-4 mr-1.5" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleAutoClean}
                disabled={isProcessing || currentRows.length === 0}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm font-medium"
              >
                <Zap className="w-4 h-4 mr-1.5 fill-current" />
                1-Click Auto Clean
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleApplyToApp}
                disabled={currentRows.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-medium"
              >
                <Check className="w-4 h-4 mr-1.5" />
                Apply to App
              </Button>
            </div>
          </div>

          {/* Dataset Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-5 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80">
              <span className="text-xs font-medium text-slate-500 block">Total Rows</span>
              <span className="text-lg font-bold text-slate-900">{currentRows.length}</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80">
              <span className="text-xs font-medium text-slate-500 block">Columns</span>
              <span className="text-lg font-bold text-slate-900">{columns.length}</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80">
              <span className="text-xs font-medium text-slate-500 block">Missing Values</span>
              <span className={`text-lg font-bold ${missingStats.total > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                {missingStats.total}
              </span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80">
              <span className="text-xs font-medium text-slate-500 block">Duplicate Rows</span>
              <span className={`text-lg font-bold ${duplicateStats.count > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                {duplicateStats.count}
              </span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 col-span-2 sm:col-span-1">
              <span className="text-xs font-medium text-slate-500 block">Quality Health</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-indigo-600">{qualityScore}%</span>
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 py-8">
        {/* Main Grid: Steps & Real-Time Transformation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Cleaning Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Handle Missing Data */}
            <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
              <CardHeader className="pb-3 bg-gradient-to-r from-amber-50/60 to-transparent border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        Handle Missing Data
                        {completedSteps.has("missing") && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Impute or remove null entries using smart statistical strategies
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={missingStats.total > 0 ? "outline" : "secondary"}>
                    {missingStats.total} missing cells
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      Target Column
                    </label>
                    <select
                      value={missingSelectedCol}
                      onChange={(e) => setMissingSelectedCol(e.target.value)}
                      className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="all">All Columns</option>
                      {columns.map((c) => (
                        <option key={c} value={c}>
                          {c} ({missingStats.perColumn[c] || 0} nulls)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">
                      Cleaning Strategy
                    </label>
                    <select
                      value={missingStrategy}
                      onChange={(e) => setMissingStrategy(e.target.value as any)}
                      className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="mean">Fill with Mean (Numeric)</option>
                      <option value="median">Fill with Median (Numeric)</option>
                      <option value="mode">Fill with Mode (Frequent)</option>
                      <option value="constant">Fill with Custom Value</option>
                      <option value="drop">Drop Rows with Nulls</option>
                    </select>
                  </div>
                  {missingStrategy === "constant" && (
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">
                        Custom Value
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0 or N/A"
                        value={customFillValue}
                        onChange={(e) => setCustomFillValue(e.target.value)}
                        className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Affects {missingSelectedCol === "all" ? columns.length : 1} column(s)
                  </span>
                  <Button
                    size="sm"
                    onClick={handleFixMissing}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs px-4"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Apply Missing Value Fix
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Remove Duplicate Rows */}
            <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
              <CardHeader className="pb-3 bg-gradient-to-r from-rose-50/60 to-transparent border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold">
                      <Copy className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        Remove Duplicate Rows
                        {completedSteps.has("duplicates") && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Identify and drop repeated records to guarantee uniqueness
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={duplicateStats.count > 0 ? "destructive" : "secondary"}>
                    {duplicateStats.count} duplicates detected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-4">
                    <label className="text-xs font-medium text-slate-600">Keep Occurrence:</label>
                    <div className="flex items-center space-x-3 text-xs text-slate-700">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="keep"
                          checked={duplicateKeep === "first"}
                          onChange={() => setDuplicateKeep("first")}
                        />
                        <span>First</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="keep"
                          checked={duplicateKeep === "last"}
                          onChange={() => setDuplicateKeep("last")}
                        />
                        <span>Last</span>
                      </label>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleRemoveDuplicates}
                    disabled={duplicateStats.count === 0}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs px-4"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Remove {duplicateStats.count} Duplicates
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Standardize Column Names */}
            <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
              <CardHeader className="pb-3 bg-gradient-to-r from-teal-50/60 to-transparent border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        Standardize Column Headers
                        {completedSteps.has("columns") && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Convert headers to clean programming conventions without spaces or special symbols
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <label className="text-xs font-medium text-slate-600">Naming Format:</label>
                    <select
                      value={colCasing}
                      onChange={(e) => setColCasing(e.target.value as any)}
                      className="text-xs py-1.5 px-3 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="snake_case">snake_case (e.g. first_name)</option>
                      <option value="camelCase">camelCase (e.g. firstName)</option>
                      <option value="lowercase">lowercase (e.g. first name)</option>
                      <option value="uppercase">UPPERCASE (e.g. FIRST NAME)</option>
                    </select>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleStandardizeColumns}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs px-4"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Standardize Column Names
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Text Normalization */}
            <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
              <CardHeader className="pb-3 bg-gradient-to-r from-purple-50/60 to-transparent border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500 text-white flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        Clean & Standardize Text
                        {completedSteps.has("text") && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Trim whitespaces, harmonize letter casing, and clean symbols
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <label className="text-xs font-medium text-slate-600">Action:</label>
                    <select
                      value={textAction}
                      onChange={(e) => setTextAction(e.target.value as any)}
                      className="text-xs py-1.5 px-3 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="trim">Trim Whitespace (Start & End)</option>
                      <option value="lowercase">Convert to Lowercase</option>
                      <option value="titlecase">Capitalize Words (Title Case)</option>
                      <option value="uppercase">Convert to UPPERCASE</option>
                      <option value="remove_symbols">Remove Special Characters</option>
                    </select>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCleanText}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-4"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Clean Text Columns
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 5: Statistical Outlier Handling */}
            <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50/60 to-transparent border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        Handle Statistical Outliers
                        {completedSteps.has("outliers") && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Filter or clip extreme anomaly values using the IQR (Interquartile Range) method
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-medium text-slate-600">IQR Multiplier:</label>
                      <select
                        value={outlierMultiplier}
                        onChange={(e) => setOutlierMultiplier(Number(e.target.value))}
                        className="text-xs py-1.5 px-3 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value={1.5}>1.5x (Standard Outliers)</option>
                        <option value={3.0}>3.0x (Extreme Outliers)</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-medium text-slate-600">Action:</label>
                      <select
                        value={outlierAction}
                        onChange={(e) => setOutlierAction(e.target.value as any)}
                        className="text-xs py-1.5 px-3 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="remove">Remove Outlier Rows</option>
                        <option value="clip">Clip to Lower/Upper Bounds</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleOutliers}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Apply Outlier Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Col: Audit Log, Column Inventory, & Exports */}
          <div className="space-y-6">
            {/* Export & Sync Card */}
            <Card className="border border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center">
                  <Download className="w-4 h-4 mr-2 text-indigo-600" />
                  Export & Sync
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Save your cleaned dataset or download directly
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <Button
                  onClick={handleApplyToApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 shadow-sm"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Cleaned Data to App
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    className="text-slate-700 text-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportJSON}
                    className="text-slate-700 text-xs"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                    Export JSON
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Audit Log */}
            <Card className="border border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-blue-600" />
                  Transformation History Log
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track of all operations performed in this session
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 max-h-64 overflow-y-auto space-y-2">
                {cleaningLog.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No cleaning operations applied yet. Use the action buttons to clean data.
                  </p>
                ) : (
                  cleaningLog.map((log, idx) => (
                    <div
                      key={idx}
                      className="text-xs p-2 rounded bg-slate-50 border border-slate-200/60 text-slate-700 flex items-start space-x-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Column Type Summary */}
            <Card className="border border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center">
                  <Type className="w-4 h-4 mr-2 text-purple-600" />
                  Detected Column Types
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {columns.length} columns in active dataset
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 max-h-56 overflow-y-auto space-y-1.5">
                {columns.map((col) => (
                  <div
                    key={col}
                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-50 text-xs"
                  >
                    <span className="font-mono text-slate-800 truncate max-w-[140px]">{col}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400">
                        {missingStats.perColumn[col] || 0} nulls
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 ${columnTypes[col] === "numeric"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                          }`}
                      >
                        {columnTypes[col]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Cleaned Dataset Preview Table */}
        <Card className="mt-8 border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-blue-600" />
                  Live Cleaned Dataset Preview
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Showing first {Math.min(currentRows.length, 12)} rows • Updates automatically on each cleaning step
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter preview rows..."
                  value={previewFilter}
                  onChange={(e) => setPreviewFilter(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardHeader>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="p-2.5 text-slate-500 font-semibold w-12 text-center">#</th>
                  {columns.map((col) => (
                    <th key={col} className="p-2.5 font-semibold text-slate-700 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span>{col}</span>
                        <span className="text-[10px] font-normal text-slate-400">
                          ({columnTypes[col]})
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredPreviewRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="p-8 text-center text-slate-400 italic"
                    >
                      No records to display. Upload a dataset or adjust your filter.
                    </td>
                  </tr>
                ) : (
                  filteredPreviewRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-2 text-slate-400 text-center font-mono text-[11px]">
                        {rIdx + 1}
                      </td>
                      {columns.map((col) => {
                        const val = row[col];
                        const isNull =
                          val === null || val === undefined || String(val).trim() === "";
                        return (
                          <td
                            key={col}
                            className={`p-2 max-w-[200px] truncate ${isNull ? "text-slate-300 italic" : "text-slate-700"
                              }`}
                          >
                            {isNull ? "null" : String(val)}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
