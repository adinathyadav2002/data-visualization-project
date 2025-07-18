import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";

const DataCleaning = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeStep, setActiveStep] = useState(null);

  const toggleStepCompletion = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const cleaningSteps = [
    {
      id: "preview",
      title: "Preview & Inspect Data",
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      description:
        "View and inspect your dataset structure to understand the data quality and composition.",
      details: [
        "Show first 10 rows of data in a clean table format",
        "Display column types (numeric, text, date, etc.)",
        "Allow toggling between full dataset and sample preview",
        "Show basic statistics like row count and column count",
        "Identify potential data quality issues at first glance",
      ],
      operations: [
        "Toggle preview mode (sample vs full)",
        "Inspect column data types",
        "View data summary statistics",
        "Identify columns with mixed data types",
      ],
    },
    {
      id: "missing",
      title: "Handle Missing Data",
      icon: AlertCircle,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      description:
        "Deal with null values and missing entries using various imputation strategies.",
      details: [
        "Show count of missing/null values per column",
        "Provide multiple imputation options for different data types",
        "Drop rows with missing values (complete case analysis)",
        "Fill with mean for numeric columns",
        "Fill with mode for categorical columns",
        "Fill with custom value specified by user",
      ],
      operations: [
        "Drop rows with any missing values",
        "Fill numeric columns with mean/median",
        "Fill categorical columns with mode",
        "Forward fill or backward fill for time series",
        "Custom value imputation",
      ],
    },
    {
      id: "duplicates",
      title: "Remove Duplicate Rows",
      icon: Copy,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      buttonColor: "bg-red-500 hover:bg-red-600",
      description:
        "Identify and remove duplicate records to ensure data uniqueness.",
      details: [
        "Show number of duplicate rows detected in the dataset",
        "Provide option to remove duplicates based on all columns",
        "Allow selection of subset of columns for duplicate checking",
        "Choose to keep first, last, or custom occurrence of duplicates",
        "Preview duplicates before removal for confirmation",
      ],
      operations: [
        "Detect duplicates across all columns",
        "Remove duplicates keeping first occurrence",
        "Remove duplicates keeping last occurrence",
        "Custom duplicate detection on selected columns",
        "Preview and confirm duplicate removal",
      ],
    },
    {
      id: "types",
      title: "Correct Data Types",
      icon: Type,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      description: "Fix and standardize column data types for proper analysis.",
      details: [
        "Display current data types for each column",
        "Provide dropdown to manually change types (string, int, float, date)",
        "Auto-detect best-fit data types based on content analysis",
        "Handle type conversion errors gracefully",
        "Validate data type changes before applying",
        "Show preview of type conversion results",
      ],
      operations: [
        "Auto-detect optimal data types",
        "Manual type conversion (string to numeric)",
        "Date parsing and formatting",
        "Boolean type conversion",
        "Handle conversion errors and invalid values",
      ],
    },
    {
      id: "text",
      title: "Standardize Text Columns",
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      buttonColor: "bg-green-500 hover:bg-green-600",
      description: "Clean and standardize text columns for consistency.",
      details: [
        "Show all string/text columns in the dataset",
        "Convert text to lowercase for standardization",
        "Strip leading and trailing whitespace",
        "Remove special characters and punctuation",
        "Apply text cleaning globally or per specific column",
        "Preview text changes before applying",
      ],
      operations: [
        "Convert all text to lowercase",
        "Trim whitespace from text fields",
        "Remove special characters and symbols",
        "Standardize text encoding (UTF-8)",
        "Apply text cleaning to selected columns only",
      ],
    },
    {
      id: "outliers",
      title: "Outlier Detection",
      icon: Target,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      description: "Identify and handle unusual values in numeric columns.",
      details: [
        "Show all numeric columns available for outlier detection",
        "Detect outliers using IQR (Interquartile Range) method",
        "Detect outliers using Z-score statistical method",
        "Allow manual threshold setting for outlier detection",
        "Option to remove outliers or flag them for review",
        "Visualize outliers in the data distribution",
      ],
      operations: [
        "IQR-based outlier detection",
        "Z-score based outlier detection",
        "Custom threshold outlier detection",
        "Remove or flag outliers",
        "Visual outlier identification",
      ],
    },
    {
      id: "scaling",
      title: "Scaling & Normalization",
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-700",
      buttonColor: "bg-indigo-500 hover:bg-indigo-600",
      description: "Scale numeric columns for machine learning and analysis.",
      details: [
        "Show all numeric columns available for scaling",
        "Apply MinMax scaling (0-1 range normalization)",
        "Apply Z-score standardization (mean=0, std=1)",
        "Robust scaling using median and IQR",
        "Show before and after statistics for scaled columns",
        "Option to save scaling parameters for future use",
      ],
      operations: [
        "MinMax scaling (0-1 normalization)",
        "Z-score standardization",
        "Robust scaling with median and IQR",
        "Unit vector scaling",
        "Custom range scaling",
      ],
    },
    {
      id: "encoding",
      title: "Encode Categorical Variables",
      icon: BarChart3,
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100",
      borderColor: "border-pink-200",
      textColor: "text-pink-700",
      buttonColor: "bg-pink-500 hover:bg-pink-600",
      description: "Convert categorical data to numeric format for analysis.",
      details: [
        "Show all categorical/string columns for encoding",
        "One-hot encoding for nominal categorical variables",
        "Label encoding for ordinal categorical variables",
        "Show resulting column expansion after one-hot encoding",
        "Handle rare categories with frequency-based encoding",
        "Option to drop original categorical columns after encoding",
      ],
      operations: [
        "One-hot encoding for nominal categories",
        "Label encoding for ordinal categories",
        "Target encoding for high-cardinality categories",
        "Frequency-based encoding for rare categories",
        "Binary encoding for memory efficiency",
      ],
    },
    {
      id: "columns",
      title: "Column Name Standardization",
      icon: Settings,
      color: "from-teal-500 to-teal-600",
      bgColor: "from-teal-50 to-teal-100",
      borderColor: "border-teal-200",
      textColor: "text-teal-700",
      buttonColor: "bg-teal-500 hover:bg-teal-600",
      description:
        "Standardize column names for consistency and best practices.",
      details: [
        "Convert all column names to lowercase",
        "Replace spaces with underscores for programming compatibility",
        "Remove special characters from column names",
        "Strip leading and trailing whitespaces from names",
        "Ensure column names follow naming conventions",
        "Preview column name changes before applying",
      ],
      operations: [
        "Convert column names to lowercase",
        "Replace spaces with underscores",
        "Remove special characters from names",
        "Standardize naming conventions",
        "Validate column name uniqueness",
      ],
    },
    {
      id: "export",
      title: "Export Cleaned Data",
      icon: Download,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      buttonColor: "bg-emerald-500 hover:bg-emerald-600",
      description: "Export the final cleaned dataset in your preferred format.",
      details: [
        "Export cleaned data as CSV format",
        "Export cleaned data as JSON format",
        "Export cleaned data as Excel format",
        "Include data cleaning log/report with export",
        "Option to export only selected columns",
        "Compress large datasets for easier download",
      ],
      operations: [
        "Export as CSV file",
        "Export as JSON file",
        "Export as Excel file",
        "Export data cleaning report",
        "Batch export with multiple formats",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b w-full">
        <div className="px-6 py-8">
          <div className="text-left ">
            <div className="flex gap-4 items-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h1 className="lg:text-3xl text-xl font-semibold text-slate-900 mb-1">
                Data Cleaning Steps Guide
              </h1>
            </div>
            <div>
              <p className="text-lg text-slate-600 max-w-3xl">
                A comprehensive guide to cleaning and preparing your data for
                analysis. Follow these steps to transform raw data into
                analysis-ready datasets.
              </p>
              <div className="mt-2 flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">
                    {completedSteps.size} Completed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
                  <span className="text-sm text-slate-600">
                    {cleaningSteps.length - completedSteps.size} Remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Overall Progress
            </span>
            <span className="text-sm font-medium text-slate-700">
              {Math.round((completedSteps.size / cleaningSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(completedSteps.size / cleaningSteps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {cleaningSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.has(step.id);
            const isActive = activeStep === step.id;

            return (
              <Card
                key={step.id}
                className={`bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 ${
                  isCompleted ? "ring-2 ring-green-200" : ""
                } ${isActive ? "ring-2 ring-blue-300" : ""}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                          {index + 1}
                        </div>
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center relative`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <Icon className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-slate-800 flex items-center">
                          {step.title}
                          {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-slate-600 mt-1">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setActiveStep(isActive ? null : step.id)}
                        variant="outline"
                        size="sm"
                        className={`${step.borderColor} ${step.textColor} hover:bg-opacity-10`}
                      >
                        <Info className="w-4 h-4 mr-2" />
                        {isActive ? "Hide Details" : "View Details"}
                      </Button>
                      <Button
                        onClick={() => toggleStepCompletion(step.id)}
                        size="sm"
                        className={
                          isCompleted
                            ? "bg-green-500 hover:bg-green-600"
                            : step.buttonColor
                        }
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Mark Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isActive && (
                  <CardContent className="pt-0">
                    <div
                      className={`p-6 bg-gradient-to-r ${step.bgColor} rounded-xl border ${step.borderColor}`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <Info className="w-5 h-5 mr-2" />
                            Step Details
                          </h4>
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li
                                key={idx}
                                className="flex items-start space-x-2 text-slate-700"
                              >
                                <ChevronRight className="w-4 h-4 mt-0.5 text-slate-500 flex-shrink-0" />
                                <span className="text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <Zap className="w-5 h-5 mr-2" />
                            Available Operations
                          </h4>
                          <ul className="space-y-2">
                            {step.operations.map((operation, idx) => (
                              <li
                                key={idx}
                                className="flex items-start space-x-2 text-slate-700"
                              >
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">{operation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          size="sm"
                          className={step.buttonColor + " text-white"}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Run Step
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`${step.borderColor} ${step.textColor} hover:bg-opacity-10`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Changes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`${step.borderColor} ${step.textColor} hover:bg-opacity-10`}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset Step
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl border-0 mt-12">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Data Cleaning Complete!
              </h3>
              <p className="text-blue-100 mb-6">
                You've completed {completedSteps.size} out of{" "}
                {cleaningSteps.length} data cleaning steps. Your data is now
                ready for analysis and machine learning.
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export Cleaned Data
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataCleaning;
