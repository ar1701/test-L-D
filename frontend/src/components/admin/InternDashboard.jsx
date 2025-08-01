import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Users,
  FileText,
  MoreHorizontal,
  Calendar,
  Shield,
  TrendingUp,
  Eye,
  RefreshCw,
  Edit,
  User,
  Building,
  Phone,
  Mail,
  MessageSquare,
  Filter,
  Search,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  Menu,
  X,
  Clipboard,
  EyeOff,
  Check,
} from "lucide-react";
import { apiService } from "../../services/api";
import { NotificationDropdown } from "../ui/notifications";

// Industry domains for filtering
const industryDomains = [
  "Healthcare",
  "Agriculture",
  "Drone Technology",
  "Manufacturing",
  "Information Technology",
  "Finance & Banking",
  "Education",
  "Retail & E-commerce",
  "Construction",
  "Automotive",
  "Aerospace",
  "Energy & Utilities",
  "Telecommunications",
  "Real Estate",
  "Food & Beverage",
  "Logistics & Supply Chain",
  "Pharmaceuticals",
  "Media & Entertainment",
  "Government",
  "Non-Profit",
];

// Available datasources (same as admin dashboard)
const availableIntegrations = [
  "CSV",
  "Excel",
  "Google Sheet",
  "Excel Sheet",
  "PDF",
  "Image",
  "Video",
  "PostgreSQL",
  "MySQL",
  "MSSQL",
  "MongoDB",
  "Snowflake",
  "Airtable",
  "Databricks",
  "Supabase",
  "Neo4j",
  "Zoho",
  "Salesforce",
  "ServiceNow",
  "SAP",
  "HubSpot",
  "FreshWorks",
  "Odoo",
  "Tally",
  "IBM DB2",
  "Elastic Search",
  "InfluxDB",
  "Apache Cassandra",
  "Redis",
  "TimescaleDB",
  "Prometheus",
  "Grafna Loki",
  "Grafna Tempo",
  "ClickHouse",
  "Shopify",
];

// Use cases for filtering
const smartcardUseCases = [
  "Training progress tracking and analytics",
  "Employee performance visualization",
  "Learning outcome assessment dashboards",
  "Compliance training monitoring",
  "Skills gap analysis and reporting",
  "Course effectiveness measurement",
  "Real-time learning analytics",
  "Custom training reports for management",
  "Interactive data presentations",
  "Automated insights and recommendations",
];

export function AnalyticsConsultantDashboard({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDemoAccount, setSelectedDemoAccount] = useState(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isDemoNoteDialogOpen, setIsDemoNoteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDemoDetailsDialogOpen, setIsDemoDetailsDialogOpen] = useState(false);
  const [isAdminNoteViewDialogOpen, setIsAdminNoteViewDialogOpen] =
    useState(false);
  const [isDemoAdminNoteViewDialogOpen, setIsDemoAdminNoteViewDialogOpen] =
    useState(false);
  const [noteText, setNoteText] = useState("");
  const [demoNoteText, setDemoNoteText] = useState("");
  const [adminNoteText, setAdminNoteText] = useState("");

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [useCaseFilter, setUseCaseFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: "",
    end: "",
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] =
    useState("customer-requests");

  // Demo Account Filter states
  const [demoStatusFilter, setDemoStatusFilter] = useState("all");
  const [demoIndustryFilter, setDemoIndustryFilter] = useState("all");
  const [demoIntegrationFilter, setDemoIntegrationFilter] = useState("all");
  const [demoSearchFilter, setDemoSearchFilter] = useState("");
  const [demoDateRangeFilter, setDemoDateRangeFilter] = useState({
    start: "",
    end: "",
  });
  const [isDemoMobileFiltersOpen, setIsDemoMobileFiltersOpen] = useState(false);

  // Password visibility and copy feedback state
  const [visiblePasswords, setVisiblePasswords] = useState({}); // { [demoId]: true/false }
  const [copied, setCopied] = useState({}); // { [demoId-field]: true/false }

  // Dialog states for viewing integrations
  const [
    isViewDemoIntegrationsDialogOpen,
    setIsViewDemoIntegrationsDialogOpen,
  ] = useState(false);
  const [selectedDemoForView, setSelectedDemoForView] = useState(null);

  // Dialog states for viewing customer feedback
  const [
    isViewCustomerFeedbackDialogOpen,
    setIsViewCustomerFeedbackDialogOpen,
  ] = useState(false);
  const [selectedRequestForFeedback, setSelectedRequestForFeedback] =
    useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [requestsResponse, demoAccountsResponse] = await Promise.all([
        apiService.intern.getRequests(user.id),
        apiService.intern.getDemoAccounts(user.id),
      ]);

      if (requestsResponse.data.success) {
        setRequests(requestsResponse.data.data);
      } else {
        setError("Failed to load requests: " + requestsResponse.data.message);
      }

      if (demoAccountsResponse.data.success) {
        setDemoAccounts(demoAccountsResponse.data.data);
      } else {
        setError(
          "Failed to load demo accounts: " + demoAccountsResponse.data.message
        );
      }
    } catch (err) {
      setError("Failed to load data: " + err.message);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = loadData; // Keep backward compatibility

  const handleAddNote = (request) => {
    setSelectedRequest(request);
    setNoteText(request.intern_note || "");
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = async () => {
    try {
      const response = await apiService.intern.updateNote(
        selectedRequest.id,
        noteText
      );

      if (response.data.success) {
        // Update the local state
        setRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest.id
              ? { ...req, intern_note: noteText }
              : req
          )
        );
        setIsNoteDialogOpen(false);
        setSelectedRequest(null);
        setNoteText("");
      } else {
        setError("Failed to save note: " + response.data.message);
      }
    } catch (err) {
      setError("Error saving note: " + err.message);
      console.error("Error saving note:", err);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const handleViewAdminNote = (request) => {
    setSelectedRequest(request);
    setAdminNoteText(request.admin_note || "");
    setIsAdminNoteViewDialogOpen(true);
  };

  // Demo account handlers
  const handleAddDemoNote = (demoAccount) => {
    setSelectedDemoAccount(demoAccount);
    setDemoNoteText(demoAccount.intern_note || "");
    setIsDemoNoteDialogOpen(true);
  };

  const handleSaveDemoNote = async () => {
    try {
      const response = await apiService.intern.updateDemoNote(
        selectedDemoAccount.id,
        demoNoteText,
        user.id
      );

      if (response.data.success) {
        // Update the local state
        setDemoAccounts((prev) =>
          prev.map((demo) =>
            demo.id === selectedDemoAccount.id
              ? { ...demo, intern_note: demoNoteText }
              : demo
          )
        );
        setIsDemoNoteDialogOpen(false);
        setSelectedDemoAccount(null);
        setDemoNoteText("");
      } else {
        setError("Failed to save demo note: " + response.data.message);
      }
    } catch (err) {
      setError("Error saving demo note: " + err.message);
      console.error("Error saving demo note:", err);
    }
  };

  const handleViewDemoDetails = (demoAccount) => {
    setSelectedDemoAccount(demoAccount);
    setIsDemoDetailsDialogOpen(true);
  };

  const handleViewDemoAdminNote = (demoAccount) => {
    setSelectedDemoAccount(demoAccount);
    setAdminNoteText(demoAccount.admin_note || "");
    setIsDemoAdminNoteViewDialogOpen(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setIndustryFilter("all");
    setUseCaseFilter("all");
    setSearchFilter("");
    setDateRangeFilter({ start: "", end: "" });
  };

  // Apply filters to requests
  const filteredRequests = requests.filter((request) => {
    // Status filter
    if (statusFilter !== "all" && request.status !== statusFilter) return false;

    // Industry filter
    if (industryFilter !== "all" && request.industry_domain !== industryFilter)
      return false;

    // Use case filter
    if (useCaseFilter !== "all") {
      if (useCaseFilter === "custom") {
        const isCustom =
          request.primary_use_case_type === "custom" ||
          (request.primary_use_case &&
            !smartcardUseCases.includes(request.primary_use_case));
        if (!isCustom) return false;
      } else {
        if (request.primary_use_case !== useCaseFilter) return false;
      }
    }

    // Search filter (searches in customer name, company, email, phone)
    if (searchFilter) {
      const searchTerm = searchFilter.toLowerCase();
      const searchableText =
        `${request.first_name} ${request.last_name} ${request.company} ${request.email} ${request.phone}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    // Date range filter
    if (dateRangeFilter.start || dateRangeFilter.end) {
      const requestDate = new Date(request.created_at);
      if (
        dateRangeFilter.start &&
        requestDate < new Date(dateRangeFilter.start)
      )
        return false;
      if (dateRangeFilter.end && requestDate > new Date(dateRangeFilter.end))
        return false;
    }

    return true;
  });

  // Clear demo account filters
  const clearDemoFilters = () => {
    setDemoStatusFilter("all");
    setDemoIndustryFilter("all");
    setDemoIntegrationFilter("all");
    setDemoSearchFilter("");
    setDemoDateRangeFilter({ start: "", end: "" });
  };

  // Apply filters to demo accounts
  const filteredDemoAccounts = demoAccounts.filter((demo) => {
    // Status filter (active/expired)
    if (demoStatusFilter !== "all") {
      const isExpired = new Date(demo.expires_at) < new Date();
      const isActive = demo.is_active && !isExpired;
      if (demoStatusFilter === "active" && !isActive) return false;
      if (demoStatusFilter === "expired" && isActive) return false;
    }

    // Industry filter
    if (
      demoIndustryFilter !== "all" &&
      demo.industry_domain !== demoIndustryFilter
    )
      return false;

    // Integration filter
    if (demoIntegrationFilter !== "all") {
      if (
        !demo.selected_integrations ||
        !Array.isArray(demo.selected_integrations)
      ) {
        return false;
      }
      if (!demo.selected_integrations.includes(demoIntegrationFilter)) {
        return false;
      }
    }

    // Search filter (searches in customer name, company, email, phone)
    if (demoSearchFilter) {
      const searchTerm = demoSearchFilter.toLowerCase();
      const searchableText =
        `${demo.first_name} ${demo.last_name} ${demo.company} ${demo.email} ${demo.phone}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    // Date range filter
    if (demoDateRangeFilter.start || demoDateRangeFilter.end) {
      const demoDate = new Date(demo.created_at);
      if (
        demoDateRangeFilter.start &&
        demoDate < new Date(demoDateRangeFilter.start)
      )
        return false;
      if (
        demoDateRangeFilter.end &&
        demoDate > new Date(demoDateRangeFilter.end)
      )
        return false;
    }

    return true;
  });

  // Stats calculations
  const stats = {
    totalAssigned: requests.length,
    completed: requests.filter((r) => r.status === "completed").length,
    inProgress: requests.filter(
      (r) => r.status === "assigned" || r.status === "in-progress"
    ).length,
    pending: requests.filter((r) => r.status === "pending").length,
    totalDemoAccounts: demoAccounts.length,
    filteredDemoAccounts: filteredDemoAccounts.length,
    activeDemoAccounts: demoAccounts.filter(
      (demo) => demo.is_active && new Date(demo.expires_at) > new Date()
    ).length,
    // New metrics
    dashboardsPending: requests.filter((r) => r.status !== "completed").length,
    clientSatisfiedDashboards: requests.filter(
      (r) => r.status === "completed" && r.customer_satisfaction_score >= 8
    ).length,
    pilotDashboards: requests.filter((r) => r.project_type === "pilot").length,
    pilotDashboardsCompleted: requests.filter(
      (r) => r.project_type === "pilot" && r.status === "completed"
    ).length,
    averageCustomerScore:
      requests.filter((r) => r.customer_satisfaction_score).length > 0
        ? Math.round(
            (requests
              .filter((r) => r.customer_satisfaction_score)
              .reduce((sum, r) => sum + r.customer_satisfaction_score, 0) /
              requests.filter((r) => r.customer_satisfaction_score).length) *
              10
          ) / 10
        : 0,
  };

  // Copy to clipboard handler
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }));
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      {/* Mobile Header */}
      <div className="sm:hidden bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                Analytics Consultant Dashboard
              </h1>
              <p className="text-xs text-emerald-100">Welcome, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationDropdown
              recipientType="intern"
              recipientId={user.id}
            />
            <Button
              onClick={onLogout}
              size="sm"
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:block bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl mr-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Analytics Consultant Dashboard
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Welcome, {user.name} ({user.specialization})
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <NotificationDropdown
                recipientType="intern"
                recipientId={user.id}
              />
              <div className="text-sm text-gray-600 bg-white/80 rounded-lg px-4 py-2 border border-gray-200/50 w-full sm:w-auto">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                {user.phone && (
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                )}
                {user.whatsapp && (
                  <p>
                    <strong>WhatsApp:</strong> {user.whatsapp}
                  </p>
                )}
                {user.integrations && user.integrations.length > 0 && (
                  <div className="mt-2">
                    <p>
                      <strong>Datasources:</strong>
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.integrations.slice(0, 3).map((datasource) => (
                        <Badge
                          key={datasource}
                          variant="outline"
                          className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          {datasource}
                        </Badge>
                      ))}
                      {user.integrations.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                        >
                          +{user.integrations.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="bg-white/80 hover:bg-white border-gray-300 shadow-sm w-full sm:w-auto"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Stats Cards */}
        <div className="sm:hidden mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-2">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalAssigned}
                </div>
                <div className="text-xs text-gray-600">Total Requests</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mx-auto mb-2">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.inProgress}
                </div>
                <div className="text-xs text-gray-600">In Progress</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl mx-auto mb-2">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalAssigned > 0
                    ? Math.round((stats.completed / stats.totalAssigned) * 100)
                    : 0}
                  %
                </div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl mx-auto mb-2">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalDemoAccounts}
                </div>
                <div className="text-xs text-gray-600">Demo Accounts</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl mx-auto mb-2">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.activeDemoAccounts}
                </div>
                <div className="text-xs text-gray-600">Active Demos</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mx-auto mb-2">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.dashboardsPending}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto mb-2">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.clientSatisfiedDashboards}
                </div>
                <div className="text-xs text-gray-600">Satisfied</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto mb-2">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.pilotDashboards}
                </div>
                <div className="text-xs text-gray-600">Pilot Projects</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.averageCustomerScore}/10
                </div>
                <div className="text-xs text-gray-600">Avg Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Stats Cards */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-8 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                Total Requests
              </CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats.totalAssigned}
              </div>
              <p className="text-xs text-blue-700 flex items-center mt-1">
                <Target className="h-3 w-3 inline mr-1" />
                Customer requests
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">
                In Progress
              </CardTitle>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">
                {stats.inProgress}
              </div>
              <p className="text-xs text-amber-700">Currently working</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900">
                Completed
              </CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">
                {stats.completed}
              </div>
              <p className="text-xs text-emerald-700">Successfully done</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Success Rate
              </CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {stats.totalAssigned > 0
                  ? Math.round((stats.completed / stats.totalAssigned) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-purple-700">Completion rate</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-900">
                Demo Accounts
              </CardTitle>
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Shield className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900">
                {stats.totalDemoAccounts}
              </div>
              <p className="text-xs text-indigo-700">Total assigned</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-900">
                Active Demos
              </CardTitle>
              <div className="p-2 bg-teal-500/10 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">
                {stats.activeDemoAccounts}
              </div>
              <p className="text-xs text-teal-700">Currently active</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">
                Dashboards Pending
              </CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {stats.dashboardsPending}
              </div>
              <p className="text-xs text-orange-700">Awaiting completion</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Client Satisfied
              </CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {stats.clientSatisfiedDashboards}
              </div>
              <p className="text-xs text-green-700">Score ≥ 8/10</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Pilot Projects
              </CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {stats.pilotDashboards}
              </div>
              <p className="text-xs text-purple-700">Total pilot projects</p>
            </CardContent>
          </Card>
          <Card
            className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200/50 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedRequestForFeedback(
                requests.filter((r) => r.customer_satisfaction_score)
              );
              setIsViewCustomerFeedbackDialogOpen(true);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-900">
                Avg Customer Score
              </CardTitle>
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">
                {stats.averageCustomerScore}/10
              </div>
              <p className="text-xs text-pink-700">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Mobile Section Selector */}
        <div className="sm:hidden">
          <div className="bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-1 mb-6">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setActiveMobileSection("customer-requests")}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${
                  activeMobileSection === "customer-requests"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <Users
                  className={`h-6 w-6 mb-2 ${
                    activeMobileSection === "customer-requests"
                      ? "text-white"
                      : "text-emerald-600"
                  }`}
                />
                <span className="text-xs font-medium text-center leading-tight">
                  Customer
                  <br />
                  Requests
                </span>
                {activeMobileSection === "customer-requests" && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveMobileSection("demo-accounts")}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${
                  activeMobileSection === "demo-accounts"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <Shield
                  className={`h-6 w-6 mb-2 ${
                    activeMobileSection === "demo-accounts"
                      ? "text-white"
                      : "text-indigo-600"
                  }`}
                />
                <span className="text-xs font-medium text-center leading-tight">
                  Demo
                  <br />
                  Accounts
                </span>
                {activeMobileSection === "demo-accounts" && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Assigned Requests - Mobile: conditional, Desktop: always shown */}
        <div
          className={`${
            activeMobileSection === "customer-requests"
              ? "block"
              : "hidden sm:block"
          }`}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-emerald-50 border-b border-gray-200/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl text-gray-900">
                    Assigned Customer Requests
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your assigned customer requests and add notes
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="bg-white/80 hover:bg-white border-gray-300 w-full sm:w-auto"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                  <Button
                    onClick={loadRequests}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 w-full sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Mobile Filter Toggle */}
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                  className="border-gray-300"
                >
                  {isMobileFiltersOpen ? (
                    <X className="h-4 w-4 mr-2" />
                  ) : (
                    <Menu className="h-4 w-4 mr-2" />
                  )}
                  {isMobileFiltersOpen ? "Hide" : "Show"} Filters
                </Button>
              </div>

              {/* Desktop Filters - Always visible on medium+ screens */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl border border-gray-200/50 shadow-sm">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Under Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Industry</Label>
                  <Select
                    value={industryFilter}
                    onValueChange={setIndustryFilter}
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="all">All Industries</SelectItem>
                      {industryDomains.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Use Case</Label>
                  <Select
                    value={useCaseFilter}
                    onValueChange={setUseCaseFilter}
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="all">All Use Cases</SelectItem>
                      {smartcardUseCases.map((useCase) => (
                        <SelectItem key={useCase} value={useCase}>
                          {useCase}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Use Case</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Date From</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={dateRangeFilter.start}
                      onChange={(e) =>
                        setDateRangeFilter((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Date To</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={dateRangeFilter.end}
                      onChange={(e) =>
                        setDateRangeFilter((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Filters - Collapsible */}
              {isMobileFiltersOpen && (
                <div className="md:hidden mb-6 space-y-4 p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl border border-gray-200/50 shadow-sm">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Industry
                    </Label>
                    <Select
                      value={industryFilter}
                      onValueChange={setIndustryFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="all">All Industries</SelectItem>
                        {industryDomains.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Use Case
                    </Label>
                    <Select
                      value={useCaseFilter}
                      onValueChange={setUseCaseFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="all">All Use Cases</SelectItem>
                        {smartcardUseCases.map((useCase) => (
                          <SelectItem key={useCase} value={useCase}>
                            {useCase}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom Use Case</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search customers..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Date From
                    </Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={dateRangeFilter.start}
                        onChange={(e) =>
                          setDateRangeFilter((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Date To</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={dateRangeFilter.end}
                        onChange={(e) =>
                          setDateRangeFilter((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Results count */}
              <div className="text-sm text-gray-600 mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-200/50">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-emerald-600" />
                  Showing {filteredRequests.length} of {requests.length}{" "}
                  requests
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-emerald-600 bg-emerald-50 transition ease-in-out duration-150">
                    <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Loading...
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200/50 shadow-sm">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-emerald-50">
                      <TableRow className="border-gray-200/50">
                        <TableHead className="font-semibold text-gray-700 min-w-[200px]">
                          Customer
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[150px]">
                          Company
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Industry
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[200px]">
                          Use Case
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[100px]">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[100px]">
                          Created
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Admin Note
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          My Note
                        </TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 min-w-[100px]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center py-12 text-gray-500"
                          >
                            <div className="flex flex-col items-center">
                              <Users className="h-12 w-12 text-gray-300 mb-4" />
                              <p className="text-lg font-medium">
                                {requests.length === 0
                                  ? "No requests assigned to you yet"
                                  : "No requests match your filters"}
                              </p>
                              <p className="text-sm">
                                {requests.length > 0 &&
                                  "Try adjusting your filters to see more results"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequests.map((request, index) => (
                          <TableRow
                            key={request.id}
                            className={
                              index % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                            }
                          >
                            <TableCell className="py-4">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {request.first_name} {request.last_name}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {request.email}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {request.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="flex items-center">
                                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                                  <span className="font-medium text-gray-900">
                                    {request.company}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <div>Phone: {request.phone}</div>
                                  <div>Domain: {request.industry_domain}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {request.industry_domain}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-48 truncate text-gray-700">
                                {request.primary_use_case || "Not specified"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  request.status === "pending"
                                    ? "destructive"
                                    : request.status === "assigned" ||
                                      request.status === "in-progress"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  request.status === "pending"
                                    ? "bg-red-100 text-red-700 border-red-200"
                                    : request.status === "assigned"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : request.status === "in-progress"
                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                    : request.status === "completed"
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                    : request.status === "review"
                                    ? "bg-purple-100 text-purple-700 border-purple-200"
                                    : request.status === "on-hold"
                                    ? "bg-orange-100 text-orange-700 border-orange-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                }
                              >
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewAdminNote(request)}
                                  className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                  title="View Admin Note"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddNote(request)}
                                  className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                  title={
                                    request.intern_note
                                      ? "View/Edit Intern Note"
                                      : "Add Intern Note"
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-gray-100"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-white/95 backdrop-blur-sm"
                                >
                                  <DropdownMenuItem
                                    onClick={() => handleViewDetails(request)}
                                    className="hover:bg-blue-50"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleAddNote(request)}
                                    className="hover:bg-emerald-50"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    {request.intern_note
                                      ? "Edit Note"
                                      : "Add Note"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assigned Demo Accounts - Mobile: conditional, Desktop: always shown */}
        <div
          className={`mt-8 ${
            activeMobileSection === "demo-accounts"
              ? "block"
              : "hidden sm:block"
          }`}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-indigo-50 border-b border-gray-200/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl text-gray-900">
                    Assigned Demo Accounts
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your assigned demo accounts and add notes
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    onClick={clearDemoFilters}
                    variant="outline"
                    className="bg-white/80 hover:bg-white border-gray-300 w-full sm:w-auto"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                  <Button
                    onClick={loadData}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 w-full sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Results count */}
              <div className="text-sm text-gray-600 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-200/50">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-indigo-600" />
                  Showing {filteredDemoAccounts.length} of {demoAccounts.length}{" "}
                  demo accounts
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setIsDemoMobileFiltersOpen(!isDemoMobileFiltersOpen)
                  }
                  className="border-gray-300"
                >
                  {isDemoMobileFiltersOpen ? (
                    <X className="h-4 w-4 mr-2" />
                  ) : (
                    <Menu className="h-4 w-4 mr-2" />
                  )}
                  {isDemoMobileFiltersOpen ? "Hide" : "Show"} Filters
                </Button>
              </div>

              {/* Desktop Filters - Always visible on medium+ screens */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-200/50 shadow-sm">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Status</Label>
                  <Select
                    value={demoStatusFilter}
                    onValueChange={setDemoStatusFilter}
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Industry</Label>
                  <Select
                    value={demoIndustryFilter}
                    onValueChange={setDemoIndustryFilter}
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="all">All Industries</SelectItem>
                      {industryDomains.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    Datasource
                  </Label>
                  <Select
                    value={demoIntegrationFilter}
                    onValueChange={setDemoIntegrationFilter}
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="all">All Datasources</SelectItem>
                      {availableIntegrations.map((datasource) => (
                        <SelectItem key={datasource} value={datasource}>
                          {datasource}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search demo accounts..."
                      value={demoSearchFilter}
                      onChange={(e) => setDemoSearchFilter(e.target.value)}
                      className="pl-10 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Date From</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={demoDateRangeFilter.start}
                      onChange={(e) =>
                        setDemoDateRangeFilter((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="pl-10 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Date To</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={demoDateRangeFilter.end}
                      onChange={(e) =>
                        setDemoDateRangeFilter((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="pl-10 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Filters - Collapsible */}
              {isDemoMobileFiltersOpen && (
                <div className="md:hidden mb-6 space-y-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-200/50 shadow-sm">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Status</Label>
                    <Select
                      value={demoStatusFilter}
                      onValueChange={setDemoStatusFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Industry
                    </Label>
                    <Select
                      value={demoIndustryFilter}
                      onValueChange={setDemoIndustryFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="all">All Industries</SelectItem>
                        {industryDomains.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Datasource
                    </Label>
                    <Select
                      value={demoIntegrationFilter}
                      onValueChange={setDemoIntegrationFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="all">All Datasources</SelectItem>
                        {availableIntegrations.map((datasource) => (
                          <SelectItem key={datasource} value={datasource}>
                            {datasource}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search demo accounts..."
                        value={demoSearchFilter}
                        onChange={(e) => setDemoSearchFilter(e.target.value)}
                        className="pl-10 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Date From
                    </Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={demoDateRangeFilter.start}
                        onChange={(e) =>
                          setDemoDateRangeFilter((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="pl-10 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Date To</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={demoDateRangeFilter.end}
                        onChange={(e) =>
                          setDemoDateRangeFilter((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="pl-10 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-indigo-600 bg-indigo-50 transition ease-in-out duration-150">
                    <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Loading...
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200/50 shadow-sm">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-indigo-50">
                      <TableRow className="border-gray-200/50">
                        <TableHead className="font-semibold text-gray-700 min-w-[200px]">
                          Customer
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[150px]">
                          Company
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Industry
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[200px]">
                          Datasources
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Username
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Password
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[100px]">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[100px]">
                          Created
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[100px]">
                          Expires
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Admin Note
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          My Note
                        </TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 min-w-[100px]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDemoAccounts.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={12}
                            className="text-center py-12 text-gray-500"
                          >
                            <div className="flex flex-col items-center">
                              <Shield className="h-12 w-12 text-gray-300 mb-4" />
                              <p className="text-lg font-medium">
                                {demoAccounts.length === 0
                                  ? "No demo accounts assigned to you yet"
                                  : "No demo accounts match your filters"}
                              </p>
                              <p className="text-sm">
                                {demoAccounts.length === 0
                                  ? "Demo accounts will appear here when assigned by admin"
                                  : "Try adjusting your filters to see more results"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDemoAccounts.map((demo, index) => {
                          const isExpired =
                            new Date(demo.expires_at) < new Date();
                          const isActive = demo.is_active && !isExpired;

                          return (
                            <TableRow
                              key={demo.id}
                              className={
                                index % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                              }
                            >
                              <TableCell className="py-4">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {demo.first_name} {demo.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {demo.email}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {demo.phone}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="flex items-center">
                                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium text-gray-900">
                                      {demo.company}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {demo.industry_domain}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-48">
                                  {demo.selected_integrations &&
                                  demo.selected_integrations.length > 0 ? (
                                    <div className="flex items-center gap-2">
                                      <div className="flex flex-wrap gap-1 flex-1">
                                        {demo.selected_integrations
                                          .slice(0, 2)
                                          .map((datasource) => (
                                            <Badge
                                              key={datasource}
                                              variant="outline"
                                              className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                                            >
                                              {datasource}
                                            </Badge>
                                          ))}
                                        {demo.selected_integrations.length >
                                          2 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                                          >
                                            +
                                            {demo.selected_integrations.length -
                                              2}
                                          </Badge>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedDemoForView(demo);
                                          setIsViewDemoIntegrationsDialogOpen(
                                            true
                                          );
                                        }}
                                        className="hover:bg-purple-50 p-1"
                                      >
                                        <Eye className="h-3 w-3 text-purple-600" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-400">
                                      No datasources
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm text-gray-800">
                                <div className="flex items-center gap-2">
                                  {demo.username}
                                  <button
                                    onClick={() =>
                                      handleCopy(
                                        demo.username,
                                        `${demo.id}-username`
                                      )
                                    }
                                    className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                                    title="Copy username"
                                  >
                                    {copied[`${demo.id}-username`] ? (
                                      <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Clipboard className="h-4 w-4 text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm text-gray-800">
                                <div className="flex items-center gap-2">
                                  {visiblePasswords[demo.id]
                                    ? demo.password
                                    : "•".repeat(demo.password.length)}
                                  <button
                                    onClick={() =>
                                      setVisiblePasswords((prev) => ({
                                        ...prev,
                                        [demo.id]: !prev[demo.id],
                                      }))
                                    }
                                    className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                                    title={
                                      visiblePasswords[demo.id]
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                  >
                                    {visiblePasswords[demo.id] ? (
                                      <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCopy(
                                        demo.password,
                                        `${demo.id}-password`
                                      )
                                    }
                                    className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                                    title="Copy password"
                                  >
                                    {copied[`${demo.id}-password`] ? (
                                      <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Clipboard className="h-4 w-4 text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={isActive ? "default" : "destructive"}
                                  className={
                                    isActive
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-red-100 text-red-700 border-red-200"
                                  }
                                >
                                  {isActive ? "Active" : "Expired"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                  {new Date(
                                    demo.created_at
                                  ).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                  {new Date(
                                    demo.expires_at
                                  ).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleViewDemoAdminNote(demo)
                                    }
                                    className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    title="View Admin Note"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddDemoNote(demo)}
                                    className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    title={
                                      demo.intern_note
                                        ? "View/Edit My Note"
                                        : "Add My Note"
                                    }
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="hover:bg-gray-100"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="bg-white/95 backdrop-blur-sm"
                                  >
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleViewDemoDetails(demo)
                                      }
                                      className="hover:bg-blue-50"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleAddDemoNote(demo)}
                                      className="hover:bg-emerald-50"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      {demo.intern_note
                                        ? "Edit Note"
                                        : "Add Note"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Note Dialog */}
        <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {selectedRequest?.intern_note ? "Edit Note" : "Add Note"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Add your notes for {selectedRequest?.first_name}{" "}
                {selectedRequest?.last_name} from {selectedRequest?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note" className="text-gray-700 font-medium">
                  Your Note
                </Label>
                <Textarea
                  id="note"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your notes about this customer request..."
                  rows={4}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveNote}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Save Note
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsNoteDialogOpen(false)}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Customer Details Dialog */}
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Customer Details
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Complete information for {selectedRequest?.first_name}{" "}
                {selectedRequest?.last_name}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center text-gray-900">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-sm bg-blue-50 p-4 rounded-lg">
                      <p>
                        <strong>Name:</strong> {selectedRequest.first_name}{" "}
                        {selectedRequest.last_name}
                      </p>
                      <p className="flex items-center">
                        <Mail className="h-3 w-3 mr-1 text-blue-600" />
                        {selectedRequest.email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-blue-600" />
                        {selectedRequest.phone}
                      </p>
                      <p className="flex items-center">
                        <Building className="h-3 w-3 mr-1 text-blue-600" />
                        {selectedRequest.company}
                      </p>
                      <p>
                        <strong>Industry:</strong>{" "}
                        {selectedRequest.industry_domain}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Project Status
                    </h3>
                    <div className="space-y-2 text-sm bg-emerald-50 p-4 rounded-lg">
                      <p>
                        <strong>Account Type:</strong>{" "}
                        {selectedRequest.account_type}
                      </p>
                      <p className="flex items-center">
                        <strong>Status:</strong>{" "}
                        <Badge className="ml-2">{selectedRequest.status}</Badge>
                      </p>
                      <p>
                        <strong>Dashboards Requested:</strong>{" "}
                        {selectedRequest.dashboards_requested || 0}
                      </p>
                      <p>
                        <strong>Dashboards Delivered:</strong>{" "}
                        {selectedRequest.dashboards_delivered || 0}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                          selectedRequest.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Use Case */}
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Use Case</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    {selectedRequest.primary_use_case || "Not specified"}
                  </div>
                </div>

                {/* Selected Datasources */}
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">
                    Selected Datasources
                  </h3>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    {selectedRequest.selected_integrations &&
                    selectedRequest.selected_integrations.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedRequest.selected_integrations.map(
                          (datasource) => (
                            <Badge
                              key={datasource}
                              variant="outline"
                              className="bg-indigo-100 text-indigo-700 border-indigo-300"
                            >
                              {datasource}
                            </Badge>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        No datasources selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Custom Integration */}
                {selectedRequest.custom_integration && (
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Custom Integration
                    </h3>
                    <div className="bg-orange-50 p-4 rounded-lg text-sm border border-orange-200">
                      {selectedRequest.custom_integration}
                    </div>
                  </div>
                )}

                {/* Admin Note */}
                {selectedRequest.admin_note && (
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Admin Note
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg text-sm border border-blue-200">
                      {selectedRequest.admin_note}
                    </div>
                  </div>
                )}

                {/* My Note */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center text-gray-900">
                    <MessageSquare className="h-4 w-4 mr-2 text-emerald-600" />
                    My Note
                  </h3>
                  <div className="bg-emerald-50 p-4 rounded-lg text-sm min-h-[60px] border border-emerald-200">
                    {selectedRequest.intern_note || "No notes added yet"}
                  </div>
                  <Button
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      handleAddNote(selectedRequest);
                    }}
                    className="mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    size="sm"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    {selectedRequest.intern_note ? "Edit Note" : "Add Note"}
                  </Button>
                </div>

                {/* Customer Feedback */}
                {selectedRequest.customer_feedback && (
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Customer Feedback
                    </h3>
                    <div className="bg-yellow-50 p-4 rounded-lg text-sm border border-yellow-200">
                      {selectedRequest.customer_feedback}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {selectedRequest.next_steps && (
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Next Steps
                    </h3>
                    <div className="bg-purple-50 p-4 rounded-lg text-sm border border-purple-200">
                      {selectedRequest.next_steps}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Admin Note View Dialog (Intern can only view, not edit) */}
        <Dialog
          open={isAdminNoteViewDialogOpen}
          onOpenChange={setIsAdminNoteViewDialogOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                View Admin Note
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Admin note for {selectedRequest?.first_name}{" "}
                {selectedRequest?.last_name} from {selectedRequest?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Admin Note (Read Only)
                </Label>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 min-h-[100px]">
                  <p className="text-sm text-gray-700">
                    {adminNoteText || "No admin note available"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsAdminNoteViewDialogOpen(false)}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Demo Account Add/Edit Note Dialog */}
        <Dialog
          open={isDemoNoteDialogOpen}
          onOpenChange={setIsDemoNoteDialogOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {selectedDemoAccount?.intern_note
                  ? "Edit Demo Note"
                  : "Add Demo Note"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Add your notes for {selectedDemoAccount?.first_name}{" "}
                {selectedDemoAccount?.last_name} from{" "}
                {selectedDemoAccount?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="demo-note"
                  className="text-gray-700 font-medium"
                >
                  Your Note
                </Label>
                <Textarea
                  id="demo-note"
                  value={demoNoteText}
                  onChange={(e) => setDemoNoteText(e.target.value)}
                  placeholder="Enter your notes about this demo account..."
                  rows={4}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveDemoNote}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Save Note
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDemoNoteDialogOpen(false)}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Demo Account Details Dialog */}
        <Dialog
          open={isDemoDetailsDialogOpen}
          onOpenChange={setIsDemoDetailsDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Demo Account Details
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Complete information for {selectedDemoAccount?.first_name}{" "}
                {selectedDemoAccount?.last_name}
              </DialogDescription>
            </DialogHeader>
            {selectedDemoAccount && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center text-gray-900">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-sm bg-blue-50 p-4 rounded-lg">
                      <p>
                        <strong>Name:</strong> {selectedDemoAccount.first_name}{" "}
                        {selectedDemoAccount.last_name}
                      </p>
                      <p className="flex items-center">
                        <Mail className="h-3 w-3 mr-1 text-blue-600" />
                        {selectedDemoAccount.email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-blue-600" />
                        {selectedDemoAccount.phone}
                      </p>
                      <p className="flex items-center">
                        <Building className="h-3 w-3 mr-1 text-blue-600" />
                        {selectedDemoAccount.company}
                      </p>
                      <p>
                        <strong>Industry:</strong>{" "}
                        {selectedDemoAccount.industry_domain}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Demo Account Status
                    </h3>
                    <div className="space-y-2 text-sm bg-emerald-50 p-4 rounded-lg">
                      <p>
                        <strong>Username:</strong>{" "}
                        {selectedDemoAccount.username}
                      </p>
                      <p>
                        <strong>Password:</strong>{" "}
                        {selectedDemoAccount.password}
                      </p>
                      <p className="flex items-center">
                        <strong>Status:</strong>{" "}
                        <Badge className="ml-2">
                          {selectedDemoAccount.is_active &&
                          new Date(selectedDemoAccount.expires_at) > new Date()
                            ? "Active"
                            : "Expired"}
                        </Badge>
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                          selectedDemoAccount.created_at
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Expires:</strong>{" "}
                        {new Date(
                          selectedDemoAccount.expires_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Integrations */}
                {selectedDemoAccount.selected_integrations &&
                  selectedDemoAccount.selected_integrations.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900">
                        Selected Integrations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDemoAccount.selected_integrations.map(
                          (integration) => (
                            <Badge
                              key={integration}
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                              {integration}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Admin Note */}
                {selectedDemoAccount.admin_note && (
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      Admin Note
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg text-sm border border-blue-200">
                      {selectedDemoAccount.admin_note}
                    </div>
                  </div>
                )}

                {/* My Note */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center text-gray-900">
                    <MessageSquare className="h-4 w-4 mr-2 text-indigo-600" />
                    My Note
                  </h3>
                  <div className="bg-indigo-50 p-4 rounded-lg text-sm min-h-[60px] border border-indigo-200">
                    {selectedDemoAccount.intern_note || "No notes added yet"}
                  </div>
                  <Button
                    onClick={() => {
                      setIsDemoDetailsDialogOpen(false);
                      handleAddDemoNote(selectedDemoAccount);
                    }}
                    className="mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    size="sm"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    {selectedDemoAccount.intern_note ? "Edit Note" : "Add Note"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Demo Admin Note View Dialog (Intern can only view, not edit) */}
        <Dialog
          open={isDemoAdminNoteViewDialogOpen}
          onOpenChange={setIsDemoAdminNoteViewDialogOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                View Admin Note
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Admin note for {selectedDemoAccount?.first_name}{" "}
                {selectedDemoAccount?.last_name} from{" "}
                {selectedDemoAccount?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Admin Note (Read Only)
                </Label>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 min-h-[100px]">
                  <p className="text-sm text-gray-700">
                    {adminNoteText || "No admin note available"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDemoAdminNoteViewDialogOpen(false)}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Demo Integrations Dialog */}
        <Dialog
          open={isViewDemoIntegrationsDialogOpen}
          onOpenChange={setIsViewDemoIntegrationsDialogOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {selectedDemoForView?.first_name}{" "}
                {selectedDemoForView?.last_name} - Datasources
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                All datasources selected for this demo account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDemoForView?.selected_integrations &&
              selectedDemoForView.selected_integrations.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedDemoForView.selected_integrations.map(
                    (datasource) => (
                      <Badge
                        key={datasource}
                        variant="outline"
                        className="text-sm bg-purple-50 text-purple-700 border-purple-200 p-2"
                      >
                        {datasource}
                      </Badge>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">No datasources selected</div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* View Customer Feedback Dialog */}
        <Dialog
          open={isViewCustomerFeedbackDialogOpen}
          onOpenChange={setIsViewCustomerFeedbackDialogOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Customer Feedback Scores
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Detailed customer feedback and satisfaction scores for completed
                projects
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedRequestForFeedback &&
              selectedRequestForFeedback.length > 0 ? (
                <div className="space-y-4">
                  {selectedRequestForFeedback.map((request) => (
                    <div
                      key={request.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {request.first_name} {request.last_name} -{" "}
                            {request.company}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {request.primary_use_case}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-sm ${
                            request.customer_satisfaction_score >= 8
                              ? "bg-green-50 text-green-700 border-green-200"
                              : request.customer_satisfaction_score >= 6
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {request.customer_satisfaction_score}/10
                        </Badge>
                      </div>

                      {request.customer_feedback && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-800">
                            Feedback:
                          </h5>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <p className="text-sm text-gray-700">
                              {request.customer_feedback}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Pilot Projects Delivered:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {request.pilot_projects_delivered || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            L&D Session Satisfactory:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {request.ld_session_satisfactory ? "Yes" : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Delivered On Time:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {request.delivered_on_time ? "Yes" : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Effective Support:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {request.effective_support ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    No customer feedback available yet
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
