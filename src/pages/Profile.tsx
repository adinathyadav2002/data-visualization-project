import React, { useState } from "react";
import {
  User,
  Edit3,
  Save,
  X,
  Lock,
  Mail,
  Calendar,
  Camera,
  Shield,
  Settings,
  Bell,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Trash2,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  Activity,
  Database,
  FileText,
  Key,
  CreditCard,
  HelpCircle,
  LogOut,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react";

const ProfileComponent = () => {
  const [user, setUser] = useState({
    name: "Adinath Yadav",
    email: "adinath.yadav@example.com",
    role: "Research Student",
    institution: "University of Technology",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra, India",
    bio: "Passionate data scientist with expertise in statistical analysis and machine learning. Currently pursuing advanced research in predictive analytics.",
    joinDate: "2024-01-15",
    avatar: null,
    timezone: "Asia/Kolkata",
    language: "English",
  });

  const [stats] = useState({
    totalProjects: 12,
    completedReports: 8,
    storageUsed: 2.4,
    daysActive: 86,
    collaborations: 5,
    achievements: 3,
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState({ ...user });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    projectUpdates: true,
    collaborationRequests: true,
    systemMaintenance: false,
  });

  const [loginSessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows 11",
      location: "Pune, Maharashtra, India",
      ip: "192.168.1.1",
      time: "2 hours ago",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone 14",
      location: "Mumbai, Maharashtra, India",
      ip: "192.168.1.2",
      time: "1 day ago",
      current: false,
    },
    {
      id: 3,
      device: "Firefox on MacBook Air",
      location: "Delhi, India",
      ip: "192.168.1.3",
      time: "3 days ago",
      current: false,
    },
  ]);

  const [recentActivity] = useState([
    {
      type: "project",
      action: 'Created new project "Market Analysis 2024"',
      time: "2 hours ago",
    },
    {
      type: "report",
      action: "Generated statistical report",
      time: "4 hours ago",
    },
    {
      type: "collaboration",
      action: "Shared project with team member",
      time: "1 day ago",
    },
    {
      type: "upload",
      action: 'Uploaded dataset "sales_data.csv"',
      time: "2 days ago",
    },
    {
      type: "analysis",
      action: "Completed trend analysis",
      time: "3 days ago",
    },
  ]);

  const handleSaveProfile = () => {
    setUser({ ...editUser });
    setEditMode(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match");
      return;
    }
    setPasswordData({ current: "", new: "", confirm: "" });
    alert("Password changed successfully");
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Profile Information Tab
  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Profile Information
          </h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              editMode
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {editMode ? (
              <X className="w-4 h-4" />
            ) : (
              <Edit3 className="w-4 h-4" />
            )}
            <span>{editMode ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Avatar and Basic Info */}
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            {editMode && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
            <p className="text-slate-600 mb-1">{user.role}</p>
            <p className="text-slate-500 text-sm">{user.institution}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-slate-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {user.location}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={editMode ? editUser.name : user.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
              disabled={!editMode}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={editMode ? editUser.email : user.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              disabled={!editMode}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={editMode ? editUser.phone : user.phone}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
              disabled={!editMode}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <input
              type="text"
              value={editMode ? editUser.role : user.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
              disabled={!editMode}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Institution
            </label>
            <input
              type="text"
              value={editMode ? editUser.institution : user.institution}
              onChange={(e) =>
                setEditUser({ ...editUser, institution: e.target.value })
              }
              disabled={!editMode}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={editMode ? editUser.location : user.location}
              onChange={(e) =>
                setEditUser({ ...editUser, location: e.target.value })
              }
              disabled={!editMode}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bio
            </label>
            <textarea
              value={editMode ? editUser.bio : user.bio}
              onChange={(e) =>
                setEditUser({ ...editUser, bio: e.target.value })
              }
              disabled={!editMode}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors resize-none"
            />
          </div>
        </div>

        {editMode && (
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      {/* <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Account Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalProjects}
            </div>
            <div className="text-sm text-slate-600">Total Projects</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {stats.completedReports}
            </div>
            <div className="text-sm text-slate-600">Completed Reports</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {stats.storageUsed} GB
            </div>
            <div className="text-sm text-slate-600">Storage Used</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {stats.daysActive}
            </div>
            <div className="text-sm text-slate-600">Days Active</div>
          </div>
          <div className="text-center p-4 bg-teal-50 rounded-lg">
            <User className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {stats.collaborations}
            </div>
            <div className="text-sm text-slate-600">Collaborations</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {stats.achievements}
            </div>
            <div className="text-sm text-slate-600">Achievements</div>
          </div>
        </div>
      </div> */}
    </div>
  );

  // Security Tab
  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Change Password
        </h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, current: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirm}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirm: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <button
            onClick={handlePasswordChange}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Active Sessions
        </h3>
        <div className="space-y-4">
          {loginSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {session.device.includes("iPhone") ? (
                  <Smartphone className="w-8 h-8 text-slate-400" />
                ) : (
                  <Monitor className="w-8 h-8 text-slate-400" />
                )}
                <div>
                  <div className="font-medium text-slate-900 flex items-center">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600">
                    {session.location} • {session.ip}
                  </div>
                  <div className="text-xs text-slate-500">{session.time}</div>
                </div>
              </div>
              {!session.current && (
                <button className="text-red-600 hover:text-red-700 p-2">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Notifications Tab
  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <div className="font-medium text-slate-900">
                  Email Notifications
                </div>
                <div className="text-sm text-slate-600">
                  Receive notifications via email
                </div>
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange("email")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.email ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-slate-400" />
              <div>
                <div className="font-medium text-slate-900">
                  Push Notifications
                </div>
                <div className="text-sm text-slate-600">
                  Receive push notifications in browser
                </div>
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange("push")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.push ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.push ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-slate-400" />
              <div>
                <div className="font-medium text-slate-900">
                  SMS Notifications
                </div>
                <div className="text-sm text-slate-600">
                  Receive important alerts via SMS
                </div>
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange("sms")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.sms ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.sms ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <hr className="border-slate-200" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-slate-400" />
              <div>
                <div className="font-medium text-slate-900">
                  Project Updates
                </div>
                <div className="text-sm text-slate-600">
                  Notifications about project changes
                </div>
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange("projectUpdates")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.projectUpdates ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.projectUpdates
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <div className="font-medium text-slate-900">
                  Collaboration Requests
                </div>
                <div className="text-sm text-slate-600">
                  Notifications for team invitations
                </div>
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange("collaborationRequests")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.collaborationRequests
                  ? "bg-blue-600"
                  : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.collaborationRequests
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-slate-400" />
              <div>
                <div className="font-medium text-slate-900">
                  System Maintenance
                </div>
                <div className="text-sm text-slate-600">
                  Notifications about system updates
                </div>
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange("systemMaintenance")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.systemMaintenance ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.systemMaintenance
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Activity Tab
  const ActivityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {activity.type === "project" && (
                  <FileText className="w-5 h-5 text-blue-600" />
                )}
                {activity.type === "report" && (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                )}
                {activity.type === "collaboration" && (
                  <User className="w-5 h-5 text-purple-600" />
                )}
                {activity.type === "upload" && (
                  <Upload className="w-5 h-5 text-orange-600" />
                )}
                {activity.type === "analysis" && (
                  <Activity className="w-5 h-5 text-teal-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-slate-900">{activity.action}</div>
                <div className="text-sm text-slate-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Account Settings
          </h1>
          <p className="text-slate-600">
            Manage your profile, security, and preferences
          </p>
        </div>

        {/* Navigation Tabs */}
        {/* <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "profile"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "security"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "notifications"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab("activity")}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "activity"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Activity</span>
            </button>
          </div>
        </div> */}

        {/* Active Tab Content */}
        <div className="space-y-6">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "activity" && <ActivityTab />}
        </div>
      </div>
    </div>
  );
};
export default ProfileComponent;
