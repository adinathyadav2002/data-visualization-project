import React, { useState, useEffect } from "react";
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
  CheckCircle,
  Database,
  Users,
  Zap,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Crown,
  Rocket,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DataCleaningSteps = () => {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    datasets: 0,
    accuracy: 0,
  });

  // Animate stats on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ users: 25000, datasets: 500000, accuracy: 99.8 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const platformFeatures = [
    {
      id: "preview",
      title: "Smart Data Preview & Inspection",
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      description:
        "Instantly visualize your data structure and quality with our intelligent preview system.",
      benefits: [
        "Automatic data type detection and validation",
        "Interactive table with sortable columns",
        "Real-time quality score assessment",
        "Visual indicators for potential issues",
        "Support for datasets up to 100GB",
      ],
    },
    {
      id: "missing",
      title: "Advanced Missing Data Handler",
      icon: AlertCircle,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      description:
        "AI-powered missing data imputation with multiple sophisticated strategies.",
      benefits: [
        "Smart imputation using ML algorithms",
        "Multiple imputation methods (MICE, KNN, etc.)",
        "Missing pattern analysis and visualization",
        "Custom imputation rules and validation",
        "Preserve data relationships during imputation",
      ],
    },
    {
      id: "duplicates",
      title: "Intelligent Duplicate Detection",
      icon: Copy,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      description:
        "Advanced algorithms to find and remove even fuzzy duplicates with high precision.",
      benefits: [
        "Fuzzy matching for similar records",
        "Configurable similarity thresholds",
        "Batch duplicate processing",
        "Duplicate merge suggestions",
        "Audit trail for all removals",
      ],
    },
    {
      id: "types",
      title: "Automatic Type Correction",
      icon: Type,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      description:
        "AI automatically detects and corrects data types with 99.8% accuracy.",
      benefits: [
        "Machine learning-based type detection",
        "Handles mixed-type columns intelligently",
        "Date format auto-recognition",
        "Custom type validation rules",
        "Error handling with detailed reports",
      ],
    },
    {
      id: "text",
      title: "Professional Text Standardization",
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      description:
        "Enterprise-grade text cleaning with NLP-powered standardization.",
      benefits: [
        "Multi-language text processing",
        "Named entity recognition and standardization",
        "Industry-specific text cleaning rules",
        "Regex pattern matching and replacement",
        "Preserve important formatting when needed",
      ],
    },
    {
      id: "outliers",
      title: "Smart Outlier Detection & Analysis",
      icon: Target,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      description:
        "Multi-algorithm outlier detection with visual analytics and business context.",
      benefits: [
        "Statistical and ML-based outlier detection",
        "Interactive outlier visualization",
        "Business rule-based outlier validation",
        "Seasonal outlier detection for time series",
        "Outlier impact analysis on downstream models",
      ],
    },
    {
      id: "scaling",
      title: "Advanced Scaling & Normalization",
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-700",
      description:
        "Multiple scaling methods optimized for different ML algorithms and use cases.",
      benefits: [
        "Auto-selection of optimal scaling method",
        "Preserve scaling parameters for new data",
        "Distribution-aware scaling techniques",
        "Feature-specific scaling strategies",
        "Integration with popular ML frameworks",
      ],
    },
    {
      id: "encoding",
      title: "Intelligent Categorical Encoding",
      icon: BarChart3,
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100",
      borderColor: "border-pink-200",
      textColor: "text-pink-700",
      description:
        "Smart encoding strategies that preserve information while optimizing for ML performance.",
      benefits: [
        "Automatic encoding method selection",
        "High-cardinality category handling",
        "Target-aware encoding for supervised learning",
        "Memory-efficient encoding options",
        "Rare category grouping and handling",
      ],
    },
    {
      id: "columns",
      title: "Professional Column Standardization",
      icon: Settings,
      color: "from-teal-500 to-teal-600",
      bgColor: "from-teal-50 to-teal-100",
      borderColor: "border-teal-200",
      textColor: "text-teal-700",
      description:
        "Enterprise naming conventions with industry best practices built-in.",
      benefits: [
        "Industry-standard naming conventions",
        "Bulk column renaming with patterns",
        "Conflict resolution for duplicate names",
        "Integration with data governance tools",
        "Custom naming rule validation",
      ],
    },
    {
      id: "export",
      title: "Flexible Export & Integration",
      icon: Download,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      description:
        "Export to 15+ formats with direct integration to popular platforms and tools.",
      benefits: [
        "15+ export formats (CSV, JSON, Parquet, etc.)",
        "Direct integration with AWS, GCP, Azure",
        "API endpoints for real-time data access",
        "Automated pipeline integration",
        "Data lineage and transformation logs",
      ],
    },
  ];

  const stats = [
    {
      label: "Active Users",
      value: animatedStats.users.toLocaleString(),
      icon: Users,
    },
    {
      label: "Datasets Cleaned",
      value: animatedStats.datasets.toLocaleString(),
      icon: Database,
    },
    {
      label: "Accuracy Rate",
      value: `${animatedStats.accuracy}%`,
      icon: Award,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Data Scientist at TechCorp",
      content:
        "This platform reduced our data cleaning time from days to hours. The AI-powered features are incredible!",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Analytics Manager",
      content:
        "The outlier detection saved us from making costly business decisions based on dirty data.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Director",
      content:
        "Finally, a platform that understands the complexity of real-world data. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-800 overflow-hidden">
        {/* <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div> */}

        <div className="relative container mx-auto px-6 py-20 text-gray-800">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-10 h-10 text-gray-800" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-800 bg-gray-800 bg-clip-text text-transparent">
              Clean Data like a Pro
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-4 font-light">
              Data Preprocessing Platform
            </p>
            <p className="text-xl text-gray-800 max-w-4xl mx-auto mb-8 leading-relaxed">
              Transform messy data into analysis-ready datasets with this
              platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200 rounded-lg flex items-center"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get Started Now
              </Link>
              <button className="border-2 border-blue-700 text-gray-800 hover:bg-white hover:text-blue-900 px-8 py-4 text-lg rounded-lg flex items-center transition-all duration-200">
                <Eye className="w-5 h-5 mr-2" />
                View in action
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Steps to Clean Data
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools handles every aspect of
            data cleaning, from basic preprocessing to advanced transformations.
          </p>
        </div>

        <div className="space-y-8">
          {platformFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredStep === feature.id;

            return (
              <Card
                key={feature.id}
                className={`bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isHovered ? "ring-2 ring-blue-300 scale-[1.02]" : ""
                }`}
                onMouseEnter={() => setHoveredStep(feature.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                          {index + 1}
                        </div>
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center relative shadow-lg`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-slate-800 flex items-center">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-slate-600 mt-1 text-lg">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div
                    className={`p-6 bg-gradient-to-r ${feature.bgColor} rounded-xl border ${feature.borderColor}`}
                  >
                    <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Key Benefits
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {feature.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-3 text-slate-700"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        className={`bg-gradient-to-r ${feature.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Try This Feature
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${feature.borderColor} ${feature.textColor} hover:bg-opacity-10`}
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* {show actual processing images} */}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold mb-4">
              Ready to Transform Your Data?
            </h3>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              No need to run complex scripts or worry about data preprocessing.
              Our platform handles everything for you, so you can focus on
              analysis and insights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-300" />
                <span>Steps Feasibility</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 text-green-300" />
                <span>Download Processed Dataset</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Award className="w-5 h-5 text-green-300" />
                <span>Detailed Steps Preview</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to={"/register"}
                className="flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 px-8 py-2 my-6 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Now for Free
              </Link>
            </div>

            <p className="text-blue-200 text-sm mt-4">
              Clean your data efficiently and effectively with our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCleaningSteps;
