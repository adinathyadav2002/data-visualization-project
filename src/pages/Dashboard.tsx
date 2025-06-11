import { useState } from "react";
import {
  Upload,
  Users,
  TrendingUp,
  FileText,
  Activity,
  Database,
  Eye,
  CheckCircle,
  PieChart,
  Download,
  Share2,
  Clock,
  BookOpen,
  Award,
  Bell,
  Filter,
  Search,
  RefreshCw,
  Target,
  Zap,
  Globe,
} from "lucide-react";

const DashboardComponent = () => {
  const [stats, setStats] = useState({
    totalProjects: 12,
    activeAnalyses: 3,
    completedReports: 8,
    storageUsed: 2.4,
    totalUsers: 1247,
    monthlyGrowth: 18.5,
    successRate: 94.2,
    avgProcessingTime: 4.2,
  });

  const [recentProjects] = useState([
    {
      id: 1,
      name: "Student Performance Analysis",
      type: "Statistical Analysis",
      lastModified: "2 hours ago",
      status: "completed",
      progress: 100,
    },
    {
      id: 2,
      name: "Market Research Data",
      type: "Data Visualization",
      lastModified: "1 day ago",
      status: "in-progress",
      progress: 75,
    },
    {
      id: 3,
      name: "Survey Results 2024",
      type: "Correlation Analysis",
      lastModified: "3 days ago",
      status: "completed",
      progress: 100,
    },
    {
      id: 4,
      name: "Sales Performance Q1",
      type: "Trend Analysis",
      lastModified: "1 week ago",
      status: "draft",
      progress: 25,
    },
    {
      id: 5,
      name: "Customer Feedback Analysis",
      type: "Sentiment Analysis",
      lastModified: "2 weeks ago",
      status: "in-progress",
      progress: 60,
    },
  ]);

  const [notifications] = useState([
    {
      id: 1,
      type: "success",
      message: "Analysis completed successfully",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "info",
      message: "New dataset uploaded",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "warning",
      message: "Storage limit approaching",
      time: "2 hours ago",
    },
    { id: 4, type: "info", message: "Report generated", time: "1 day ago" },
  ]);

  const [quickLinks] = useState([
    {
      icon: Upload,
      title: "Upload Dataset",
      description: "Import CSV or Excel files",
      color: "bg-blue-500",
      path: "/upload",
    },
    {
      icon: PieChart,
      title: "Create Analysis",
      description: "Start new data analysis",
      color: "bg-emerald-500",
      path: "/analytics",
    },
    {
      icon: FileText,
      title: "Generate Report",
      description: "Create detailed reports",
      color: "bg-violet-500",
      path: "/reports",
    },
    {
      icon: Users,
      title: "Collaborate",
      description: "Share and work together",
      color: "bg-orange-500",
      path: "/collaborate",
    },
    {
      icon: TrendingUp,
      title: "View Trends",
      description: "Analyze data patterns",
      color: "bg-pink-500",
      path: "/trends",
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Organize your datasets",
      color: "bg-indigo-500",
      path: "/data",
    },
  ]);

  const [learningResources] = useState([
    {
      icon: Award,
      title: "Statistics Fundamentals",
      description: "Master basic statistical concepts",
      color: "bg-blue-50 text-blue-600",
      progress: 85,
    },
    {
      icon: BookOpen,
      title: "Data Visualization",
      description: "Create compelling charts",
      color: "bg-emerald-50 text-emerald-600",
      progress: 60,
    },
    {
      icon: Target,
      title: "Machine Learning Basics",
      description: "Introduction to ML algorithms",
      color: "bg-violet-50 text-violet-600",
      progress: 40,
    },
    {
      icon: Globe,
      title: "Data Ethics",
      description: "Responsible data handling",
      color: "bg-orange-50 text-orange-600",
      progress: 75,
    },
  ]);

  // Stats Cards Component
  const StatsCard = ({ title, value, icon: Icon, color, change, subtitle }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-slate-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
          <div className="flex items-center space-x-2">
            <p
              className={`text-xs font-medium ${
                change.startsWith("+") ? "text-emerald-600" : "text-slate-600"
              }`}
            >
              {change}
            </p>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-sm`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Quick Action Card Component
  const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    color,
    onClick,
  }) => (
    <button
      onClick={onClick}
      className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 text-left group hover:border-slate-300 bg-white"
    >
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-sm`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </button>
  );

  // Project Card Component
  const ProjectCard = ({ project }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-slate-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
              project.status === "completed"
                ? "bg-emerald-100"
                : project.status === "in-progress"
                ? "bg-blue-100"
                : "bg-slate-100"
            }`}
          >
            {project.status === "completed" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : project.status === "in-progress" ? (
              <Activity className="w-5 h-5 text-blue-600" />
            ) : (
              <FileText className="w-5 h-5 text-slate-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-slate-900">{project.name}</h3>
            <p className="text-sm text-slate-600">{project.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium text-slate-900">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              project.status === "completed"
                ? "bg-emerald-500"
                : project.status === "in-progress"
                ? "bg-blue-500"
                : "bg-slate-400"
            }`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{project.lastModified}</span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            project.status === "completed"
              ? "bg-emerald-100 text-emerald-700"
              : project.status === "in-progress"
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {project.status.replace("-", " ")}
        </span>
      </div>
    </div>
  );

  // Notification Card Component
  const NotificationCard = ({ notification }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
      <div
        className={`w-2 h-2 rounded-full mt-2 ${
          notification.type === "success"
            ? "bg-emerald-500"
            : notification.type === "warning"
            ? "bg-orange-500"
            : "bg-blue-500"
        }`}
      ></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">
          {notification.message}
        </p>
        <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
      </div>
    </div>
  );

  // Learning Resource Card Component
  const LearningResourceCard = ({ resource }) => (
    <div className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-all duration-200 bg-white">
      <div className="flex items-center space-x-3 mb-3">
        <div
          className={`w-10 h-10 ${resource.color} rounded-lg flex items-center justify-center`}
        >
          <resource.icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-slate-900">{resource.title}</h3>
          <p className="text-sm text-slate-600">{resource.description}</p>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium text-slate-900">
            {resource.progress}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${resource.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-slate-600">
          Welcome back! Here's what's happening with your data analysis
          projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FileText}
          color="bg-blue-500"
          change="+12%"
          subtitle="vs last month"
        />
        <StatsCard
          title="Active Analyses"
          value={stats.activeAnalyses}
          icon={Activity}
          color="bg-emerald-500"
          change="+5%"
          subtitle="currently running"
        />
        <StatsCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={CheckCircle}
          color="bg-violet-500"
          change="+2.3%"
          subtitle="completion rate"
        />
        <StatsCard
          title="Storage Used"
          value={`${stats.storageUsed}GB`}
          icon={Database}
          color="bg-orange-500"
          change="2.4/5GB"
          subtitle="available space"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  Quick Actions
                </h2>
                <p className="text-slate-600 text-sm">
                  Get started with your data analysis
                </p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <QuickActionCard
                  key={index}
                  icon={link.icon}
                  title={link.title}
                  description={link.description}
                  color={link.color}
                  onClick={() => console.log(`Navigate to ${link.path}`)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 4).map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects and Learning Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Recent Projects
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Projects
              </button>
            </div>
            <div className="space-y-4">
              {recentProjects.slice(0, 4).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Learning Path
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {learningResources.map((resource, index) => (
              <LearningResourceCard key={index} resource={resource} />
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Performance Overview
          </h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Users</div>
            <div className="text-xs text-emerald-600 mt-1">
              +{stats.monthlyGrowth}% this month
            </div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {stats.avgProcessingTime.toFixed(1)}s
            </div>
            <div className="text-sm text-slate-600">Avg Processing Time</div>
            <div className="text-xs text-emerald-600 mt-1">-0.8s improved</div>
          </div>
          <div className="text-center p-4 bg-violet-50 rounded-lg">
            <div className="text-2xl font-bold text-violet-600 mb-1">
              {stats.successRate}%
            </div>
            <div className="text-sm text-slate-600">Success Rate</div>
            <div className="text-xs text-emerald-600 mt-1">+2.1% this week</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
            <div className="text-sm text-slate-600">System Uptime</div>
            <div className="text-xs text-emerald-600 mt-1">
              99.9% reliability
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
