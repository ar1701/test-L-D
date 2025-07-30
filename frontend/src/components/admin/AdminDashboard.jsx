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
import { Progress } from "../ui/progress";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Users,
  UserPlus,
  Database,
  FileText,
  ImageIcon,
  Video,
  FileSpreadsheet,
  MoreHorizontal,
  Calendar,
  Shield,
  TrendingUp,
  Eye,
  EyeOff,
  RefreshCw,
  Star,
  Settings,
  Copy,
  Plus,
  Filter,
  UserCheck,
  BarChart3,
  ClipboardList,
  Zap,
  CalendarDays,
  FolderOpen,
  Edit,
  MessageSquare,
  Phone,
  MessageCircle,
  Menu,
  Search,
  Building,
  User,
  Trash2,
  Bell,
  MessageCircleIcon,
} from "lucide-react";
import { apiService } from "../../services/api";
import { NotificationDropdown } from "../ui/notifications";

// Generate random password
const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Generate username
const generateUsername = (name) => {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
  const randomNum = Math.floor(Math.random() * 1000);
  return `intern_${cleanName}_${randomNum}`;
};

// Available integrations
const availableIntegrations = [
  "Salesforce",
  "Databricks",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "AWS S3",
  "Azure",
  "Google Cloud",
  "Tableau",
  "Power BI",
  "Slack",
  "Microsoft Teams",
  "Jira",
  "Confluence",
  "HubSpot",
  "Zendesk",
];

// Industry domains from register form
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

// Use cases from register form
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

export function AdminDashboard() {
  // State for interns
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for customers/free trial requests
  const [customers, setCustomers] = useState([]);

  // State for demo accounts
  const [demoAccounts, setDemoAccounts] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        internsResponse,
        customersResponse,
        companiesResponse,
        allCompaniesResponse,
        demoAccountsResponse,
      ] = await Promise.all([
        apiService.admin.getInterns(),
        apiService.admin.getCustomers(),
        apiService.admin.getCompanies(),
        apiService.admin.getAllCompanies(),
        apiService.admin.getDemoAccounts(),
      ]);

      if (internsResponse.data.success) {
        setInterns(internsResponse.data.data);
      }
      if (customersResponse.data.success) {
        setCustomers(customersResponse.data.data);
      }
      if (companiesResponse.data.success) {
        setAssignedCompanies(companiesResponse.data.data);
      }
      if (allCompaniesResponse.data.success) {
        setAllCompanies(allCompaniesResponse.data.data);
      }
      if (demoAccountsResponse.data.success) {
        setDemoAccounts(demoAccountsResponse.data.data);
      }
    } catch (err) {
      setError("Failed to load data: " + err.message);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Dialog states
  const [isAddInternDialogOpen, setIsAddInternDialogOpen] = useState(false);
  const [isViewCredentialsDialogOpen, setIsViewCredentialsDialogOpen] =
    useState(false);
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isEditInternDialogOpen, setIsEditInternDialogOpen] = useState(false);
  const [isViewCustomerDetailsDialogOpen, setIsViewCustomerDetailsDialogOpen] =
    useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isUseCasesModalOpen, setIsUseCasesModalOpen] = useState(false);
  const [isViewInternDetailsOpen, setIsViewInternDetailsOpen] = useState(false);
  const [isInternNoteModalOpen, setIsInternNoteModalOpen] = useState(false);
  const [isAdminNoteModalOpen, setIsAdminNoteModalOpen] = useState(false);
  const [isInternNoteViewModalOpen, setIsInternNoteViewModalOpen] =
    useState(false);
  const [isDeleteCustomerDialogOpen, setIsDeleteCustomerDialogOpen] =
    useState(false);
  const [isDeleteInternDialogOpen, setIsDeleteInternDialogOpen] =
    useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] =
    useState(false);
  const [isDeleteDemoAccountDialogOpen, setIsDeleteDemoAccountDialogOpen] =
    useState(false);
  const [isEditDemoAccountDialogOpen, setIsEditDemoAccountDialogOpen] =
    useState(false);
  const [isDemoAdminNoteDialogOpen, setIsDemoAdminNoteDialogOpen] =
    useState(false);
  const [isDemoInternNoteDialogOpen, setIsDemoInternNoteDialogOpen] =
    useState(false);
  const [isAssignInternToDemoDialogOpen, setIsAssignInternToDemoDialogOpen] =
    useState(false);

  // Filter states
  // Filter states
  const [filter, setFilter] = useState("all");
  const [internFilter, setInternFilter] = useState("all");
  const [dashboardsRequestedFilter, setDashboardsRequestedFilter] =
    useState("all");
  const [dashboardsDeliveredFilter, setDashboardsDeliveredFilter] =
    useState("all");
  const [useCaseFilter, setUseCaseFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: "",
    end: "",
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Advanced intern filter states
  const [internIntegrationFilter, setInternIntegrationFilter] = useState("all");
  const [internCompanyFilter, setInternCompanyFilter] = useState("all");
  const [internCustomerCountFilter, setInternCustomerCountFilter] =
    useState("all");
  const [internSearchFilter, setInternSearchFilter] = useState("");
  const [assignedCompanies, setAssignedCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);

  // State for inline editing dashboard counts
  const [editingDashboard, setEditingDashboard] = useState({});

  // Selected items for editing/viewing
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedDemoAccount, setSelectedDemoAccount] = useState(null);

  // Password visibility state
  const [passwordVisibility, setPasswordVisibility] = useState({});

  // Form states
  const [newIntern, setNewIntern] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    specialization: "L&D",
    integrations: [],
  });

  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    industryDomain: "",
    primaryUseCase: "",
    accountType: "ld",
  });

  const [projectEditData, setProjectEditData] = useState({
    dashboards_requested: 0,
    dashboards_delivered: 0,
    use_cases_list: [],
    integrations_list: [],
    ld_session_dates: [],
    project_info: {},
    customer_feedback: "",
    next_steps: "",
    admin_note: "",
    intern_note: "",
    api_username: "",
    api_password: "",
    api_key: "",
    api_endpoint: "",
  });

  const [selectedCredentials, setSelectedCredentials] = useState("");
  const [adminNoteText, setAdminNoteText] = useState("");
  const [internNoteText, setInternNoteText] = useState("");
  const [demoAdminNoteText, setDemoAdminNoteText] = useState("");
  const [demoInternNoteText, setDemoInternNoteText] = useState("");
  const [editedCustomer, setEditedCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    phone: "",
    industry_domain: "",
  });
  const [editedDemoAccount, setEditedDemoAccount] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    phone: "",
    industry_domain: "",
    selected_integrations: [],
  });

  // Demo account filter states
  const [demoStatusFilter, setDemoStatusFilter] = useState("all");
  const [demoIndustryFilter, setDemoIndustryFilter] = useState("all");
  const [demoSearchFilter, setDemoSearchFilter] = useState("");
  const [demoDateRangeFilter, setDemoDateRangeFilter] = useState({
    start: "",
    end: "",
  });

  // Filter states

  // Filter customers based on various criteria
  const filteredCustomers = customers.filter((customer) => {
    // Status filter
    if (filter !== "all" && customer.status !== filter) return false;

    // Dashboards requested filter
    if (dashboardsRequestedFilter !== "all") {
      const requestedCount = customer.dashboards_requested || 0;
      if (dashboardsRequestedFilter === "0" && requestedCount !== 0)
        return false;
      if (
        dashboardsRequestedFilter === "1-5" &&
        (requestedCount < 1 || requestedCount > 5)
      )
        return false;
      if (
        dashboardsRequestedFilter === "6-10" &&
        (requestedCount < 6 || requestedCount > 10)
      )
        return false;
      if (dashboardsRequestedFilter === "10+" && requestedCount <= 10)
        return false;
    }

    // Dashboards delivered filter
    if (dashboardsDeliveredFilter !== "all") {
      const deliveredCount = customer.dashboards_delivered || 0;
      if (dashboardsDeliveredFilter === "0" && deliveredCount !== 0)
        return false;
      if (
        dashboardsDeliveredFilter === "1-5" &&
        (deliveredCount < 1 || deliveredCount > 5)
      )
        return false;
      if (
        dashboardsDeliveredFilter === "6-10" &&
        (deliveredCount < 6 || deliveredCount > 10)
      )
        return false;
      if (dashboardsDeliveredFilter === "10+" && deliveredCount <= 10)
        return false;
    }

    // Use case filter
    if (useCaseFilter !== "all") {
      if (useCaseFilter === "custom") {
        // Show custom use cases (where primary_use_case_type is custom or use case is not in predefined list)
        const isCustom =
          customer.primary_use_case_type === "custom" ||
          (customer.primary_use_case &&
            !smartcardUseCases.includes(customer.primary_use_case));
        if (!isCustom) return false;
      } else {
        // Show specific predefined use case
        if (customer.primary_use_case !== useCaseFilter) return false;
      }
    }

    // Industry filter
    if (industryFilter !== "all" && customer.industry_domain !== industryFilter)
      return false;

    // Date range filter
    if (dateRangeFilter.start || dateRangeFilter.end) {
      const customerDate = new Date(customer.created_at);
      if (
        dateRangeFilter.start &&
        customerDate < new Date(dateRangeFilter.start)
      )
        return false;
      if (dateRangeFilter.end && customerDate > new Date(dateRangeFilter.end))
        return false;
    }

    // Search filter (searches in name, company, email, phone)
    if (searchFilter) {
      const searchTerm = searchFilter.toLowerCase();
      const searchableText =
        `${customer.first_name} ${customer.last_name} ${customer.company} ${customer.email} ${customer.phone}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    return true;
  });

  // Filter interns with advanced criteria
  const filteredInterns = interns.filter((intern) => {
    // Specialization filter
    if (internFilter !== "all" && intern.specialization !== internFilter)
      return false;

    // Integration filter
    if (internIntegrationFilter !== "all") {
      if (!intern.integrations || !Array.isArray(intern.integrations))
        return false;
      if (!intern.integrations.includes(internIntegrationFilter)) return false;
    }

    // Company filter (filter by companies assigned to this intern)
    if (internCompanyFilter !== "all") {
      if (
        !intern.customer_companies ||
        !Array.isArray(intern.customer_companies)
      )
        return false;
      if (!intern.customer_companies.includes(internCompanyFilter))
        return false;
    }

    // Customer count filter
    if (internCustomerCountFilter !== "all") {
      const assignedCount = intern.assigned_count || 0;
      switch (internCustomerCountFilter) {
        case "none":
          if (assignedCount !== 0) return false;
          break;
        case "1-5":
          if (assignedCount < 1 || assignedCount > 5) return false;
          break;
        case "6-10":
          if (assignedCount < 6 || assignedCount > 10) return false;
          break;
        case "10+":
          if (assignedCount <= 10) return false;
          break;
      }
    }

    // Search filter (searches in name, email, username)
    if (internSearchFilter) {
      const searchTerm = internSearchFilter.toLowerCase();
      const searchableText =
        `${intern.name} ${intern.email} ${intern.username}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    return true;
  });

  // Filter demo accounts
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

    // Search filter (searches in name, company, email, phone)
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

  // Add intern
  const handleAddIntern = async () => {
    try {
      const username = generateUsername(newIntern.name);
      const password = generatePassword();

      const internData = {
        name: newIntern.name,
        username,
        password,
        email: newIntern.email,
        phone: newIntern.phone,
        whatsapp: newIntern.whatsapp,
        specialization: newIntern.specialization,
        integrations: newIntern.integrations,
      };

      const response = await apiService.admin.createIntern(internData);

      if (response.data.success) {
        loadData();
        setNewIntern({
          name: "",
          email: "",
          phone: "",
          whatsapp: "",
          specialization: "L&D",
          integrations: [],
        });
        setIsAddInternDialogOpen(false);
      } else {
        setError("Failed to create intern: " + response.data.message);
      }
    } catch (err) {
      setError("Error creating intern: " + err.message);
      console.error("Error creating intern:", err);
    }
  };

  // Add customer manually
  const handleAddCustomer = async () => {
    try {
      const customerData = {
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email,
        company: newCustomer.company,
        phone: newCustomer.phone,
        industryDomain: newCustomer.industryDomain,
        primaryUseCase: newCustomer.primaryUseCase,
        accountType: newCustomer.accountType,
      };

      const response = await apiService.auth.register(customerData);

      if (response.data.success) {
        loadData();
        setNewCustomer({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          phone: "",
          industryDomain: "",
          primaryUseCase: "",
          accountType: "ld",
        });
        setIsAddCustomerDialogOpen(false);
      } else {
        setError("Failed to create customer: " + response.data.message);
      }
    } catch (err) {
      setError("Error creating customer: " + err.message);
      console.error("Error creating customer:", err);
    }
  };

  // Update project details
  const handleUpdateProjectDetails = async () => {
    try {
      const response = await apiService.admin.updateProjectDetails(
        selectedCustomer.id,
        projectEditData
      );

      if (response.data.success) {
        loadData();
        setIsEditProjectDialogOpen(false);
        setSelectedCustomer(null);
      } else {
        setError("Failed to update project details: " + response.data.message);
      }
    } catch (err) {
      setError("Error updating project details: " + err.message);
      console.error("Error updating project details:", err);
    }
  };

  // Assign intern to request
  const handleAssignIntern = async (requestId, internId) => {
    try {
      const response = await apiService.admin.assignIntern(requestId, internId);
      if (response.data.success) {
        loadData();
      } else {
        setError("Failed to assign intern: " + response.data.message);
      }
    } catch (err) {
      setError("Error assigning intern: " + err.message);
      console.error("Error assigning intern:", err);
    }
  };

  // Update request status
  const handleUpdateStatus = async (requestId, status) => {
    try {
      const response = await apiService.admin.updateRequestStatus(
        requestId,
        status
      );
      if (response.data.success) {
        loadData();
      } else {
        setError("Failed to update status: " + response.data.message);
      }
    } catch (err) {
      setError("Error updating status: " + err.message);
      console.error("Error updating status:", err);
    }
  };

  // Open project edit dialog
  const handleEditProject = (customer) => {
    setSelectedCustomer(customer);
    setProjectEditData({
      dashboards_requested: customer.dashboards_requested || 0,
      dashboards_delivered: customer.dashboards_delivered || 0,
      use_cases_list: customer.use_cases_list || [],
      integrations_list: customer.integrations_list || [],
      ld_session_dates: customer.ld_session_dates || [],
      project_info: customer.project_info || {},
      customer_feedback: customer.customer_feedback || "",
      next_steps: customer.next_steps || "",
      admin_note: customer.admin_note || "",
      intern_note: customer.intern_note || "",
      api_username: customer.api_username || "",
      api_password: customer.api_password || "",
      api_key: customer.api_key || "",
      api_endpoint: customer.api_endpoint || "",
    });
    setIsEditProjectDialogOpen(true);
  };

  // View customer details
  const handleViewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsViewCustomerDetailsDialogOpen(true);
  };

  // View intern details
  const handleViewInternDetails = (intern) => {
    setSelectedIntern(intern);
    setIsViewInternDetailsOpen(true);
  };

  // View intern note
  const handleViewInternNote = (customer) => {
    setSelectedCustomer(customer);
    setIsInternNoteModalOpen(true);
  };

  // Handle admin note editing
  const handleViewEditAdminNote = (customer) => {
    setSelectedCustomer(customer);
    setAdminNoteText(customer.admin_note || "");
    setIsAdminNoteModalOpen(true);
  };

  // Handle intern note viewing (admin can only view, not edit)
  const handleViewInternNoteOnly = (customer) => {
    setSelectedCustomer(customer);
    setInternNoteText(customer.intern_note || "");
    setIsInternNoteViewModalOpen(true);
  };

  // Save admin note
  const handleSaveAdminNote = async () => {
    try {
      const currentProjectData = {
        ...projectEditData,
        admin_note: adminNoteText,
      };

      const response = await apiService.admin.updateProjectDetails(
        selectedCustomer.id,
        currentProjectData
      );

      if (response.data.success) {
        // Update local state
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === selectedCustomer.id
              ? { ...customer, admin_note: adminNoteText }
              : customer
          )
        );
        setIsAdminNoteModalOpen(false);
        setSelectedCustomer(null);
        setAdminNoteText("");
      } else {
        setError("Failed to save admin note: " + response.data.message);
      }
    } catch (err) {
      setError("Error saving admin note: " + err.message);
      console.error("Error saving admin note:", err);
    }
  };

  // Delete customer
  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteCustomerDialogOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    try {
      const response = await apiService.admin.deleteCustomer(
        selectedCustomer.id
      );

      if (response.data.success) {
        // Remove from local state
        setCustomers((prev) =>
          prev.filter((c) => c.id !== selectedCustomer.id)
        );
        setIsDeleteCustomerDialogOpen(false);
        setSelectedCustomer(null);
      } else {
        setError("Failed to delete customer: " + response.data.message);
      }
    } catch (err) {
      setError("Error deleting customer: " + err.message);
      console.error("Error deleting customer:", err);
    }
  };

  // Edit customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditedCustomer({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      company: customer.company,
      phone: customer.phone,
      industry_domain: customer.industry_domain,
    });
    setIsEditCustomerDialogOpen(true);
  };

  const handleSaveCustomerEdit = async () => {
    try {
      const response = await apiService.admin.updateCustomer(
        selectedCustomer.id,
        editedCustomer
      );

      if (response.data.success) {
        // Update local state
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === selectedCustomer.id
              ? { ...customer, ...editedCustomer }
              : customer
          )
        );
        setIsEditCustomerDialogOpen(false);
        setSelectedCustomer(null);
        setEditedCustomer({
          first_name: "",
          last_name: "",
          email: "",
          company: "",
          phone: "",
          industry_domain: "",
        });
        loadData(); // Reload to get fresh data
      } else {
        setError("Failed to update customer: " + response.data.message);
      }
    } catch (err) {
      setError("Error updating customer: " + err.message);
      console.error("Error updating customer:", err);
    }
  };

  // Delete intern
  const handleDeleteIntern = (intern) => {
    setSelectedIntern(intern);
    setIsDeleteInternDialogOpen(true);
  };

  const confirmDeleteIntern = async () => {
    try {
      const response = await apiService.admin.deleteIntern(selectedIntern.id);

      if (response.data.success) {
        // Remove from local state
        setInterns((prev) => prev.filter((i) => i.id !== selectedIntern.id));
        setIsDeleteInternDialogOpen(false);
        setSelectedIntern(null);
      } else {
        setError("Failed to delete intern: " + response.data.message);
      }
    } catch (err) {
      setError("Error deleting intern: " + err.message);
      console.error("Error deleting intern:", err);
    }
  };

  // Update intern
  const handleUpdateIntern = async () => {
    try {
      const response = await apiService.admin.updateIntern(
        selectedIntern.id,
        selectedIntern
      );

      if (response.data.success) {
        // Update local state
        setInterns((prev) =>
          prev.map((intern) =>
            intern.id === selectedIntern.id ? { ...selectedIntern } : intern
          )
        );
        setIsEditInternDialogOpen(false);
        setSelectedIntern(null);
        loadData(); // Reload to get fresh data
      } else {
        setError("Failed to update intern: " + response.data.message);
      }
    } catch (err) {
      setError("Error updating intern: " + err.message);
      console.error("Error updating intern:", err);
    }
  };

  // Demo account handlers
  const handleDeleteDemoAccount = (demoAccount) => {
    setSelectedDemoAccount(demoAccount);
    setIsDeleteDemoAccountDialogOpen(true);
  };

  const confirmDeleteDemoAccount = async () => {
    try {
      const response = await apiService.admin.deleteDemoAccount(
        selectedDemoAccount.id
      );

      if (response.data.success) {
        // Remove from local state
        setDemoAccounts((prev) =>
          prev.filter((d) => d.id !== selectedDemoAccount.id)
        );
        setIsDeleteDemoAccountDialogOpen(false);
        setSelectedDemoAccount(null);
      } else {
        setError("Failed to delete demo account: " + response.data.message);
      }
    } catch (err) {
      setError("Error deleting demo account: " + err.message);
      console.error("Error deleting demo account:", err);
    }
  };

  const handleEditDemoAccount = (demoAccount) => {
    setSelectedDemoAccount(demoAccount);
    setEditedDemoAccount({
      first_name: demoAccount.first_name,
      last_name: demoAccount.last_name,
      email: demoAccount.email,
      company: demoAccount.company,
      phone: demoAccount.phone,
      industry_domain: demoAccount.industry_domain,
      selected_integrations: demoAccount.selected_integrations || [],
    });
    setIsEditDemoAccountDialogOpen(true);
  };

  const handleSaveDemoAccountEdit = async () => {
    try {
      const response = await apiService.admin.updateDemoAccount(
        selectedDemoAccount.id,
        editedDemoAccount
      );

      if (response.data.success) {
        // Update local state
        setDemoAccounts((prev) =>
          prev.map((demo) =>
            demo.id === selectedDemoAccount.id
              ? { ...demo, ...editedDemoAccount }
              : demo
          )
        );
        setIsEditDemoAccountDialogOpen(false);
        setSelectedDemoAccount(null);
        setEditedDemoAccount({
          first_name: "",
          last_name: "",
          email: "",
          company: "",
          phone: "",
          industry_domain: "",
          selected_integrations: [],
        });
        loadData(); // Reload to get fresh data
      } else {
        setError("Failed to update demo account: " + response.data.message);
      }
    } catch (err) {
      setError("Error updating demo account: " + err.message);
      console.error("Error updating demo account:", err);
    }
  };

  const handleRegenerateDemoCredentials = async (demoId) => {
    try {
      const response = await apiService.admin.regenerateDemoCredentials(demoId);

      if (response.data.success) {
        // Update local state with new credentials
        setDemoAccounts((prev) =>
          prev.map((demo) =>
            demo.id === demoId
              ? {
                  ...demo,
                  username: response.data.data.username,
                  password: response.data.data.password,
                  expires_at: response.data.data.expires_at,
                  is_active: true,
                }
              : demo
          )
        );
      } else {
        setError(
          "Failed to regenerate demo credentials: " + response.data.message
        );
      }
    } catch (err) {
      setError("Error regenerating demo credentials: " + err.message);
      console.error("Error regenerating demo credentials:", err);
    }
  };

  const handleUpdateDemoStatus = async (demoId, status) => {
    try {
      // Find the current demo account to get all required fields
      const currentDemo = demoAccounts.find((demo) => demo.id === demoId);
      if (!currentDemo) {
        setError("Demo account not found");
        return;
      }

      const updateData = {
        // Include required fields from current demo
        first_name: currentDemo.first_name,
        last_name: currentDemo.last_name,
        email: currentDemo.email,
        company: currentDemo.company,
        phone: currentDemo.phone,
        industry_domain: currentDemo.industry_domain,
        selected_integrations: currentDemo.selected_integrations || [],
        // Update the status
        is_active: status === "active" ? 1 : 0,
      };

      // If marking as active, extend expiry date
      if (status === "active") {
        const newExpiryDate = new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + 10);
        updateData.expires_at = newExpiryDate.toISOString();
      }

      const response = await apiService.admin.updateDemoAccount(
        demoId,
        updateData
      );

      if (response.data.success) {
        // Update local state
        setDemoAccounts((prev) =>
          prev.map((demo) =>
            demo.id === demoId
              ? {
                  ...demo,
                  is_active: status === "active" ? 1 : 0,
                  expires_at: updateData.expires_at || demo.expires_at,
                }
              : demo
          )
        );
      } else {
        setError("Failed to update demo status: " + response.data.message);
      }
    } catch (err) {
      setError("Error updating demo status: " + err.message);
      console.error("Error updating demo status:", err);
    }
  };

  // Demo note handlers
  const handleViewEditDemoAdminNote = (demo) => {
    setSelectedDemoAccount(demo);
    setDemoAdminNoteText(demo.admin_note || "");
    setIsDemoAdminNoteDialogOpen(true);
  };

  const handleViewDemoInternNote = (demo) => {
    setSelectedDemoAccount(demo);
    setDemoInternNoteText(demo.intern_note || "");
    setIsDemoInternNoteDialogOpen(true);
  };

  const handleSaveDemoAdminNote = async () => {
    try {
      const response = await apiService.admin.updateDemoAdminNote(
        selectedDemoAccount.id,
        demoAdminNoteText
      );

      if (response.data.success) {
        // Update local state
        setDemoAccounts((prev) =>
          prev.map((demo) =>
            demo.id === selectedDemoAccount.id
              ? { ...demo, admin_note: demoAdminNoteText }
              : demo
          )
        );
        setIsDemoAdminNoteDialogOpen(false);
        setSelectedDemoAccount(null);
        setDemoAdminNoteText("");
      } else {
        setError("Failed to update demo admin note: " + response.data.message);
      }
    } catch (err) {
      setError("Error updating demo admin note: " + err.message);
      console.error("Error updating demo admin note:", err);
    }
  };

  const handleOpenAssignInternDialog = (demo) => {
    setSelectedDemoAccount(demo);
    setIsAssignInternToDemoDialogOpen(true);
  };

  const handleSaveInternToDemoAssignment = async (internId) => {
    try {
      // Convert "unassigned" to empty string for API
      const apiInternId = internId === "unassigned" ? "" : internId;

      const response = await apiService.admin.assignInternToDemo(
        selectedDemoAccount.id,
        apiInternId
      );

      if (response.data.success) {
        // Reload data to get updated intern assignments
        loadData();
        setIsAssignInternToDemoDialogOpen(false);
        setSelectedDemoAccount(null);
      } else {
        setError("Failed to assign intern to demo: " + response.data.message);
      }
    } catch (err) {
      setError("Error assigning intern to demo: " + err.message);
      console.error("Error assigning intern to demo:", err);
    }
  };

  // Direct assignment handler for dropdown in table
  const handleDirectInternAssignment = async (demoId, internId) => {
    try {
      // Convert "unassigned" to empty string for API
      const apiInternId = internId === "unassigned" ? "" : internId;

      const response = await apiService.admin.assignInternToDemo(
        demoId,
        apiInternId
      );

      if (response.data.success) {
        // Update local state to reflect the change
        setDemoAccounts((prev) =>
          prev.map((demo) =>
            demo.id === demoId
              ? {
                  ...demo,
                  assigned_intern_id: apiInternId || null,
                  assigned_intern_name: apiInternId
                    ? interns.find((i) => i.id.toString() === apiInternId)
                        ?.name || null
                    : null,
                }
              : demo
          )
        );
      } else {
        setError("Failed to assign intern to demo: " + response.data.message);
      }
    } catch (err) {
      setError("Error assigning intern to demo: " + err.message);
      console.error("Error assigning intern to demo:", err);
    }
  };

  // Copy to clipboard utility
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Regenerate intern credentials and update in database
  const handleRegenerateCredentials = async (internId) => {
    try {
      const intern = interns.find((i) => i.id === internId);
      const newUsername = generateUsername(intern.name);
      const newPassword = generatePassword();

      const response = await apiService.admin.updateInternCredentials(
        internId,
        {
          username: newUsername,
          password: newPassword,
        }
      );

      if (response.data.success) {
        // Update local state
        setInterns((prev) =>
          prev.map((intern) =>
            intern.id === internId
              ? {
                  ...intern,
                  username: newUsername,
                  password: newPassword,
                }
              : intern
          )
        );
      } else {
        setError("Failed to regenerate credentials: " + response.data.message);
      }
    } catch (err) {
      setError("Error regenerating credentials: " + err.message);
      console.error("Error regenerating credentials:", err);
    }
  };

  // Handle edit intern
  const handleEditIntern = (intern) => {
    setSelectedIntern({ ...intern });
    setIsEditInternDialogOpen(true);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (internId) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [internId]: !prev[internId],
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilter("all");
    setDashboardsRequestedFilter("all");
    setDashboardsDeliveredFilter("all");
    setUseCaseFilter("all");
    setIndustryFilter("all");
    setDateRangeFilter({ start: "", end: "" });
  };

  // Stats calculations
  const stats = {
    totalInterns: interns.length,
    totalCustomers: customers.length,
    activeRecords: customers.filter((c) => c.status !== "completed").length,
    avgDashboards: Math.round(
      customers.reduce((sum, c) => sum + (c.dashboards_delivered || 0), 0) /
        customers.length || 0
    ),
  };

  // Handle dashboard count updates
  const handleDashboardCountUpdate = async (requestId, field, value) => {
    try {
      const currentRequest = customers.find((c) => c.id === requestId);
      const updatedData = {
        dashboards_requested:
          field === "dashboards_requested"
            ? parseInt(value)
            : currentRequest.dashboards_requested || 0,
        dashboards_delivered:
          field === "dashboards_delivered"
            ? parseInt(value)
            : currentRequest.dashboards_delivered || 0,
      };

      const response = await apiService.admin.updateDashboardCounts(
        requestId,
        updatedData
      );

      if (response.data.success) {
        // Update local state
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === requestId
              ? { ...customer, [field]: parseInt(value) }
              : customer
          )
        );

        // Clear editing state
        setEditingDashboard((prev) => ({
          ...prev,
          [`${requestId}_${field}`]: false,
        }));
      } else {
        setError("Failed to update dashboard count: " + response.data.message);
      }
    } catch (err) {
      setError("Error updating dashboard count: " + err.message);
      console.error("Error updating dashboard count:", err);
    }
  };

  const handleStartEdit = (requestId, field, currentValue) => {
    setEditingDashboard((prev) => ({
      ...prev,
      [`${requestId}_${field}`]: true,
    }));
  };

  const handleCancelEdit = (requestId, field) => {
    setEditingDashboard((prev) => ({
      ...prev,
      [`${requestId}_${field}`]: false,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Multi-Tenant Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Welcome, Admin User
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
              <NotificationDropdown recipientType="admin" />
              <Dialog
                open={isAddInternDialogOpen}
                onOpenChange={setIsAddInternDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/80 hover:bg-white border-gray-300 shadow-sm w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Intern
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/95 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Add New Intern
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Create a new intern account with credentials
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="internName"
                        className="text-gray-700 font-medium"
                      >
                        Name
                      </Label>
                      <Input
                        id="internName"
                        value={newIntern.name}
                        onChange={(e) =>
                          setNewIntern((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., John Doe"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="internEmail"
                        className="text-gray-700 font-medium"
                      >
                        Email
                      </Label>
                      <Input
                        id="internEmail"
                        type="email"
                        value={newIntern.email}
                        onChange={(e) =>
                          setNewIntern((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="e.g., john.doe@company.com"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="internPhone"
                          className="text-gray-700 font-medium"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="internPhone"
                          value={newIntern.phone}
                          onChange={(e) =>
                            setNewIntern((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="e.g., +1-555-0123"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="internWhatsapp"
                          className="text-gray-700 font-medium"
                        >
                          WhatsApp Number
                        </Label>
                        <Input
                          id="internWhatsapp"
                          value={newIntern.whatsapp}
                          onChange={(e) =>
                            setNewIntern((prev) => ({
                              ...prev,
                              whatsapp: e.target.value,
                            }))
                          }
                          placeholder="e.g., +1-555-0123"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="internSpecialization"
                        className="text-gray-700 font-medium"
                      >
                        Specialization
                      </Label>
                      <Select
                        value={newIntern.specialization}
                        onValueChange={(value) =>
                          setNewIntern((prev) => ({
                            ...prev,
                            specialization: value,
                          }))
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L&D">L&D</SelectItem>
                          <SelectItem value="Demo">Demo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Integrations
                      </Label>
                      <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {availableIntegrations.map((integration) => (
                            <label
                              key={integration}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={newIntern.integrations.includes(
                                  integration
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewIntern((prev) => ({
                                      ...prev,
                                      integrations: [
                                        ...prev.integrations,
                                        integration,
                                      ],
                                    }));
                                  } else {
                                    setNewIntern((prev) => ({
                                      ...prev,
                                      integrations: prev.integrations.filter(
                                        (i) => i !== integration
                                      ),
                                    }));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>{integration}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Select the integrations this intern can work with
                      </p>
                    </div>
                    <Button
                      onClick={handleAddIntern}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Add Intern
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isAddCustomerDialogOpen}
                onOpenChange={setIsAddCustomerDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/95 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Add New Customer Manually
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Create a customer record manually
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="customerFirstName"
                          className="text-gray-700 font-medium"
                        >
                          First Name
                        </Label>
                        <Input
                          id="customerFirstName"
                          value={newCustomer.firstName}
                          onChange={(e) =>
                            setNewCustomer((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          placeholder="e.g., John"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="customerLastName"
                          className="text-gray-700 font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="customerLastName"
                          value={newCustomer.lastName}
                          onChange={(e) =>
                            setNewCustomer((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          placeholder="e.g., Doe"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="customerEmail"
                        className="text-gray-700 font-medium"
                      >
                        Email
                      </Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="e.g., john.doe@company.com"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="customerCompany"
                        className="text-gray-700 font-medium"
                      >
                        Company
                      </Label>
                      <Input
                        id="customerCompany"
                        value={newCustomer.company}
                        onChange={(e) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder="e.g., Acme Corp"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="customerPhone"
                        className="text-gray-700 font-medium"
                      >
                        Phone
                      </Label>
                      <Input
                        id="customerPhone"
                        value={newCustomer.phone}
                        onChange={(e) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="e.g., +1-555-0123"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="customerIndustry"
                        className="text-gray-700 font-medium"
                      >
                        Industry Domain
                      </Label>
                      <Select
                        value={newCustomer.industryDomain}
                        onValueChange={(value) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            industryDomain: value,
                          }))
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {industryDomains.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="customerUseCase"
                        className="text-gray-700 font-medium"
                      >
                        Primary Use Case
                      </Label>
                      <Select
                        value={newCustomer.primaryUseCase}
                        onValueChange={(value) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            primaryUseCase: value,
                          }))
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select use case" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {smartcardUseCases.map((useCase) => (
                            <SelectItem key={useCase} value={useCase}>
                              {useCase}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="customerAccountType"
                        className="text-gray-700 font-medium"
                      >
                        Account Type
                      </Label>
                      <Select
                        value={newCustomer.accountType}
                        onValueChange={(value) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            accountType: value,
                          }))
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ld">L&D Management</SelectItem>
                          <SelectItem value="demo">Demo Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleAddCustomer}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Add Customer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                Total Interns
              </CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats.totalInterns}
              </div>
              <p className="text-xs text-blue-700 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Active team members
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900">
                Total Customers
              </CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Calendar className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">
                {stats.totalCustomers}
              </div>
              <p className="text-xs text-emerald-700">All customer records</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">
                Active Records
              </CardTitle>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Shield className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">
                {stats.activeRecords}
              </div>
              <p className="text-xs text-amber-700">In progress</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Avg Dashboards
              </CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {stats.avgDashboards}
              </div>
              <p className="text-xs text-purple-700">Average delivered</p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="customer-records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50">
            <TabsTrigger
              value="customer-records"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              Customer Records
            </TabsTrigger>
            <TabsTrigger
              value="intern-management"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              Intern Management
            </TabsTrigger>
            <TabsTrigger
              value="demo-accounts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              Demo Accounts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer-records" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl text-gray-900">
                      Customer Records
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage customer requests with project tracking
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="bg-white/80 hover:bg-white border-gray-300 w-full sm:w-auto"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                    <Button
                      onClick={loadData}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Enhanced Filters Section */}
                <div className="mb-6">
                  {/* Mobile Filter Button */}
                  <div className="md:hidden mb-4">
                    <Button
                      variant="outline"
                      className="w-full bg-white/80 hover:bg-white border-gray-300 shadow-sm"
                      onClick={() => setIsMobileFiltersOpen(true)}
                    >
                      <Menu className="h-4 w-4 mr-2" />
                      Filters (
                      {
                        Object.values({
                          filter,
                          dashboardsRequestedFilter,
                          dashboardsDeliveredFilter,
                          useCaseFilter,
                          industryFilter,
                          searchFilter,
                        }).filter((v) => v && v !== "all").length
                      }
                      )
                    </Button>
                  </div>

                  {/* Mobile Filter Dialog */}
                  <Dialog
                    open={isMobileFiltersOpen}
                    onOpenChange={setIsMobileFiltersOpen}
                  >
                    <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Customer Filters</DialogTitle>
                        <DialogDescription>
                          Filter customer records
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">
                            Status
                          </Label>
                          <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="review">
                                Under Review
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="on-hold">On Hold</SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">
                            Dashboards Requested
                          </Label>
                          <Select
                            value={dashboardsRequestedFilter}
                            onValueChange={setDashboardsRequestedFilter}
                          >
                            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1-5">1-5</SelectItem>
                              <SelectItem value="6-10">6-10</SelectItem>
                              <SelectItem value="10+">10+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">
                            Dashboards Delivered
                          </Label>
                          <Select
                            value={dashboardsDeliveredFilter}
                            onValueChange={setDashboardsDeliveredFilter}
                          >
                            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1-5">1-5</SelectItem>
                              <SelectItem value="6-10">6-10</SelectItem>
                              <SelectItem value="10+">10+</SelectItem>
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
                            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              <SelectItem value="all">All Use Cases</SelectItem>
                              {smartcardUseCases.map((useCase) => (
                                <SelectItem key={useCase} value={useCase}>
                                  {useCase}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">
                                Custom Use Case
                              </SelectItem>
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
                            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              <SelectItem value="all">
                                All Industries
                              </SelectItem>
                              {industryDomains.map((domain) => (
                                <SelectItem key={domain} value={domain}>
                                  {domain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">
                            Date Range Start
                          </Label>
                          <Input
                            type="date"
                            value={dateRangeFilter.start}
                            onChange={(e) =>
                              setDateRangeFilter((prev) => ({
                                ...prev,
                                start: e.target.value,
                              }))
                            }
                            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">
                            Date Range End
                          </Label>
                          <Input
                            type="date"
                            value={dateRangeFilter.end}
                            onChange={(e) =>
                              setDateRangeFilter((prev) => ({
                                ...prev,
                                end: e.target.value,
                              }))
                            }
                            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">
                            Search
                          </Label>
                          <Input
                            placeholder="Search customers..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={clearFilters}
                            variant="outline"
                            className="flex-1"
                          >
                            Clear Filters
                          </Button>
                          <Button
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="flex-1"
                          >
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Desktop Filters - Two Lines */}
                  <div className="hidden md:block bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 shadow-sm p-6">
                    {/* First Line */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Status
                        </Label>
                        <Select value={filter} onValueChange={setFilter}>
                          <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="review">Under Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Dashboards Requested
                        </Label>
                        <Select
                          value={dashboardsRequestedFilter}
                          onValueChange={setDashboardsRequestedFilter}
                        >
                          <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1-5">1-5</SelectItem>
                            <SelectItem value="6-10">6-10</SelectItem>
                            <SelectItem value="10+">10+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Dashboards Delivered
                        </Label>
                        <Select
                          value={dashboardsDeliveredFilter}
                          onValueChange={setDashboardsDeliveredFilter}
                        >
                          <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1-5">1-5</SelectItem>
                            <SelectItem value="6-10">6-10</SelectItem>
                            <SelectItem value="10+">10+</SelectItem>
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
                          <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="all">All Use Cases</SelectItem>
                            {smartcardUseCases.map((useCase) => (
                              <SelectItem key={useCase} value={useCase}>
                                {useCase}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">
                              Custom Use Case
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Second Line */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Industry
                        </Label>
                        <Select
                          value={industryFilter}
                          onValueChange={setIndustryFilter}
                        >
                          <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="all">All Industries</SelectItem>
                            {industryDomains.map((domain) => (
                              <SelectItem key={domain} value={domain}>
                                {domain}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Date Range Start
                        </Label>
                        <Input
                          type="date"
                          value={dateRangeFilter.start}
                          onChange={(e) =>
                            setDateRangeFilter((prev) => ({
                              ...prev,
                              start: e.target.value,
                            }))
                          }
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Date Range End
                        </Label>
                        <Input
                          type="date"
                          value={dateRangeFilter.end}
                          onChange={(e) =>
                            setDateRangeFilter((prev) => ({
                              ...prev,
                              end: e.target.value,
                            }))
                          }
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Search
                        </Label>
                        <Input
                          placeholder="Search customers..."
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-50 transition ease-in-out duration-150">
                      <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Loading...
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white rounded-lg border border-gray-200/50 shadow-sm">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
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
                            Dashboards Req.
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[100px]">
                            Dashboards Del.
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[150px]">
                            Admin Note
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[150px]">
                            Intern Note
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[150px]">
                            Assigned Intern
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[100px]">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[100px]">
                            Created
                          </TableHead>
                          <TableHead className="text-right font-semibold text-gray-700 min-w-[100px]">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={12}
                              className="text-center py-12 text-gray-500"
                            >
                              <div className="flex flex-col items-center">
                                <Users className="h-12 w-12 text-gray-300 mb-4" />
                                <p className="text-lg font-medium">
                                  No customer records found
                                </p>
                                <p className="text-sm">
                                  Try adjusting your filters or add a new
                                  customer
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCustomers.map((request, index) => (
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
                                  <div className="text-sm text-gray-500">
                                    {request.email}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {request.phone}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-gray-900">
                                {request.company}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {request.industry_domain}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-auto text-left justify-start max-w-48 hover:bg-blue-50"
                                  onClick={() => {
                                    setSelectedCustomer(request);
                                    setIsUseCasesModalOpen(true);
                                  }}
                                >
                                  <div className="truncate text-gray-700">
                                    {request.primary_use_case ||
                                      "Not specified"}
                                  </div>
                                </Button>
                              </TableCell>
                              <TableCell>
                                {editingDashboard[
                                  `${request.id}_dashboards_requested`
                                ] ? (
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={(
                                        request.dashboards_requested || 0
                                      ).toString()}
                                      onValueChange={(value) =>
                                        handleDashboardCountUpdate(
                                          request.id,
                                          "dashboards_requested",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger className="w-20 h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                          (num) => (
                                            <SelectItem
                                              key={num}
                                              value={num.toString()}
                                            >
                                              {num}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleCancelEdit(
                                          request.id,
                                          "dashboards_requested"
                                        )
                                      }
                                      className="h-6 w-6 p-0"
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer"
                                      onClick={() =>
                                        handleStartEdit(
                                          request.id,
                                          "dashboards_requested",
                                          request.dashboards_requested
                                        )
                                      }
                                    >
                                      {request.dashboards_requested || 0}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleStartEdit(
                                          request.id,
                                          "dashboards_requested",
                                          request.dashboards_requested
                                        )
                                      }
                                      className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {editingDashboard[
                                  `${request.id}_dashboards_delivered`
                                ] ? (
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={(
                                        request.dashboards_delivered || 0
                                      ).toString()}
                                      onValueChange={(value) =>
                                        handleDashboardCountUpdate(
                                          request.id,
                                          "dashboards_delivered",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger className="w-20 h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                          (num) => (
                                            <SelectItem
                                              key={num}
                                              value={num.toString()}
                                            >
                                              {num}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleCancelEdit(
                                          request.id,
                                          "dashboards_delivered"
                                        )
                                      }
                                      className="h-6 w-6 p-0"
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        (request.dashboards_delivered || 0) > 0
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={`cursor-pointer ${
                                        (request.dashboards_delivered || 0) > 0
                                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                          : "bg-gray-100 text-gray-600 border-gray-200"
                                      }`}
                                      onClick={() =>
                                        handleStartEdit(
                                          request.id,
                                          "dashboards_delivered",
                                          request.dashboards_delivered
                                        )
                                      }
                                    >
                                      {request.dashboards_delivered || 0}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleStartEdit(
                                          request.id,
                                          "dashboards_delivered",
                                          request.dashboards_delivered
                                        )
                                      }
                                      className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleViewEditAdminNote(request)
                                    }
                                    className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    title={
                                      request.admin_note
                                        ? "View/Edit Admin Note"
                                        : "Add Admin Note"
                                    }
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
                                    onClick={() =>
                                      handleViewInternNoteOnly(request)
                                    }
                                    className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    title="View Intern Note"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Select
                                    value={
                                      request.assigned_intern_id?.toString() ||
                                      "unassigned"
                                    }
                                    onValueChange={(value) =>
                                      handleAssignIntern(
                                        request.id,
                                        value === "unassigned" ? "" : value
                                      )
                                    }
                                    disabled={interns.length === 0}
                                  >
                                    <SelectTrigger className="w-36 bg-white border-gray-300">
                                      <SelectValue placeholder="Assign intern" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unassigned">
                                        Unassigned
                                      </SelectItem>
                                      {interns.map((intern) => (
                                        <SelectItem
                                          key={intern.id}
                                          value={intern.id.toString()}
                                        >
                                          {intern.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {request.assigned_intern_id && (
                                    <UserCheck className="h-4 w-4 text-emerald-600" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={request.status}
                                  onValueChange={(value) =>
                                    handleUpdateStatus(request.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-32 bg-white border-gray-300">
                                    <SelectValue>
                                      <Badge
                                        variant={
                                          request.status === "pending"
                                            ? "destructive"
                                            : request.status === "assigned"
                                            ? "default"
                                            : "secondary"
                                        }
                                        className={
                                          request.status === "pending"
                                            ? "bg-red-100 text-red-700 border-red-200"
                                            : request.status === "assigned"
                                            ? "bg-blue-100 text-blue-700 border-blue-200"
                                            : request.status === "completed"
                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                            : request.status === "in-progress"
                                            ? "bg-amber-100 text-amber-700 border-amber-200"
                                            : request.status === "review"
                                            ? "bg-purple-100 text-purple-700 border-purple-200"
                                            : request.status === "on-hold"
                                            ? "bg-orange-100 text-orange-700 border-orange-200"
                                            : "bg-gray-100 text-gray-600 border-gray-200"
                                        }
                                      >
                                        {request.status}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="assigned">
                                      Assigned
                                    </SelectItem>
                                    <SelectItem value="in-progress">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="review">
                                      Under Review
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      Completed
                                    </SelectItem>
                                    <SelectItem value="on-hold">
                                      On Hold
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                      Cancelled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
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
                                        handleViewCustomerDetails(request)
                                      }
                                      className="hover:bg-blue-50"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View All Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleEditProject(request)}
                                      className="hover:bg-blue-50"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Project Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(
                                          request.id,
                                          "completed"
                                        )
                                      }
                                      disabled={request.status === "completed"}
                                      className="hover:bg-emerald-50"
                                    >
                                      Mark Complete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(
                                          request.id,
                                          "in-progress"
                                        )
                                      }
                                      disabled={
                                        request.status === "in-progress"
                                      }
                                      className="hover:bg-yellow-50"
                                    >
                                      Mark In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(
                                          request.id,
                                          "on-hold"
                                        )
                                      }
                                      disabled={request.status === "on-hold"}
                                      className="hover:bg-orange-50"
                                    >
                                      Put On Hold
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleEditCustomer(request)
                                      }
                                      className="hover:bg-blue-50"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Customer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteCustomer(request)
                                      }
                                      className="hover:bg-red-50 text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Customer
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
          </TabsContent>

          {/* Intern Management Tab */}
          <TabsContent value="intern-management" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl text-gray-900">
                      Intern Management
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage intern accounts and credentials
                    </CardDescription>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={loadData}
                      className="bg-white/80 hover:bg-white border-gray-300"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setInternFilter("all");
                        setInternIntegrationFilter("all");
                        setInternCompanyFilter("all");
                        setInternCustomerCountFilter("all");
                        setInternSearchFilter("");
                      }}
                      className="bg-white/80 hover:bg-white border-gray-300"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Advanced Filtering Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 shadow-sm">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Specialization
                    </Label>
                    <Select
                      value={internFilter}
                      onValueChange={setInternFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specializations</SelectItem>
                        <SelectItem value="L&D">L&D</SelectItem>
                        <SelectItem value="Demo">Demo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Integration
                    </Label>
                    <Select
                      value={internIntegrationFilter}
                      onValueChange={setInternIntegrationFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="all">All Integrations</SelectItem>
                        {availableIntegrations.map((integration) => (
                          <SelectItem key={integration} value={integration}>
                            {integration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Company</Label>
                    <Select
                      value={internCompanyFilter}
                      onValueChange={setInternCompanyFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="all">All Companies</SelectItem>
                        {allCompanies.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Customer Count
                    </Label>
                    <Select
                      value={internCustomerCountFilter}
                      onValueChange={setInternCustomerCountFilter}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Counts</SelectItem>
                        <SelectItem value="none">No Customers (0)</SelectItem>
                        <SelectItem value="1-5">1-5 Customers</SelectItem>
                        <SelectItem value="6-10">6-10 Customers</SelectItem>
                        <SelectItem value="10+">10+ Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search interns..."
                        value={internSearchFilter}
                        onChange={(e) => setInternSearchFilter(e.target.value)}
                        className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200/50">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    Showing {filteredInterns.length} of {interns.length} interns
                  </div>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200/50 shadow-sm">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <TableRow className="border-gray-200/50">
                        <TableHead className="font-semibold text-gray-700 min-w-[150px]">
                          Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Username
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Password
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[200px]">
                          Email
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Phone
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          WhatsApp
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Specialization
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[200px]">
                          Integrations
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[200px]">
                          Customer Accounts
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[80px]">
                          Assigned
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[80px]">
                          Completed
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">
                          Success Rate
                        </TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 min-w-[100px]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInterns.map((intern, index) => (
                        <TableRow
                          key={intern.id}
                          className={
                            index % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                          }
                        >
                          <TableCell className="font-medium text-gray-900 py-4">
                            {intern.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {intern.username}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(intern.username)}
                                className="hover:bg-blue-50"
                              >
                                <Copy className="h-3 w-3 text-blue-600" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {passwordVisibility[intern.id]
                                  ? intern.password
                                  : "••••••••••••"}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  togglePasswordVisibility(intern.id)
                                }
                                className="hover:bg-blue-50"
                              >
                                {passwordVisibility[intern.id] ? (
                                  <EyeOff className="h-3 w-3 text-blue-600" />
                                ) : (
                                  <Eye className="h-3 w-3 text-blue-600" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(intern.password)}
                                className="hover:bg-blue-50"
                              >
                                <Copy className="h-3 w-3 text-blue-600" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {intern.email}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {intern.phone || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3 text-green-500" />
                              <span className="text-sm text-gray-700">
                                {intern.whatsapp || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                intern.specialization === "L&D"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                intern.specialization === "L&D"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : "bg-purple-100 text-purple-700 border-purple-200"
                              }
                            >
                              {intern.specialization}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-48">
                              {intern.integrations &&
                              intern.integrations.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {intern.integrations
                                    .slice(0, 3)
                                    .map((integration) => (
                                      <Badge
                                        key={integration}
                                        variant="outline"
                                        className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                                      >
                                        {integration}
                                      </Badge>
                                    ))}
                                  {intern.integrations.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                                    >
                                      +{intern.integrations.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">
                                  No integrations
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-48">
                              {intern.customer_companies &&
                              intern.customer_companies.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {intern.customer_companies
                                    .slice(0, 2)
                                    .map((company) => (
                                      <Badge
                                        key={company}
                                        variant="outline"
                                        className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                                      >
                                        {company}
                                      </Badge>
                                    ))}
                                  {intern.customer_companies.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                                    >
                                      +{intern.customer_companies.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">
                                  No customers
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200"
                            >
                              {intern.assigned_count}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200"
                            >
                              {intern.completed_count}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={intern.success_rate}
                                className="w-16"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {intern.success_rate}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-gray-100"
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
                                    handleViewInternDetails(intern)
                                  }
                                  className="hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View All Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRegenerateCredentials(intern.id)
                                  }
                                  className="hover:bg-orange-50"
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Regenerate Credentials
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditIntern(intern)}
                                  className="hover:bg-green-50"
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    copyToClipboard(
                                      `${intern.username}:${intern.password}`
                                    )
                                  }
                                  className="hover:bg-gray-50"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Login Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteIntern(intern)}
                                  className="hover:bg-red-50 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Intern
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Accounts Management Tab */}
          <TabsContent value="demo-accounts" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Demo Accounts Management
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={loadData}
                    className="bg-white/80 hover:bg-white border-gray-300"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Filters */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <Label
                        htmlFor="demo-search"
                        className="text-gray-700 font-medium mb-2 block"
                      >
                        Search Demo Accounts
                      </Label>
                      <Input
                        id="demo-search"
                        placeholder="Search by name, email, company, or phone..."
                        value={demoSearchFilter}
                        onChange={(e) => setDemoSearchFilter(e.target.value)}
                        className="bg-white border-gray-300"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">
                        Status
                      </Label>
                      <Select
                        value={demoStatusFilter}
                        onValueChange={setDemoStatusFilter}
                      >
                        <SelectTrigger className="w-32 bg-white border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">
                        Industry
                      </Label>
                      <Select
                        value={demoIndustryFilter}
                        onValueChange={setDemoIndustryFilter}
                      >
                        <SelectTrigger className="w-40 bg-white border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Industries</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Agriculture">
                            Agriculture
                          </SelectItem>
                          <SelectItem value="Drone Technology">
                            Drone Technology
                          </SelectItem>
                          <SelectItem value="Manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="Information Technology">
                            Information Technology
                          </SelectItem>
                          <SelectItem value="Finance & Banking">
                            Finance & Banking
                          </SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Retail & E-commerce">
                            Retail & E-commerce
                          </SelectItem>
                          <SelectItem value="Construction">
                            Construction
                          </SelectItem>
                          <SelectItem value="Automotive">Automotive</SelectItem>
                          <SelectItem value="Aerospace">Aerospace</SelectItem>
                          <SelectItem value="Energy & Utilities">
                            Energy & Utilities
                          </SelectItem>
                          <SelectItem value="Telecommunications">
                            Telecommunications
                          </SelectItem>
                          <SelectItem value="Real Estate">
                            Real Estate
                          </SelectItem>
                          <SelectItem value="Food & Beverage">
                            Food & Beverage
                          </SelectItem>
                          <SelectItem value="Logistics & Supply Chain">
                            Logistics & Supply Chain
                          </SelectItem>
                          <SelectItem value="Pharmaceuticals">
                            Pharmaceuticals
                          </SelectItem>
                          <SelectItem value="Media & Entertainment">
                            Media & Entertainment
                          </SelectItem>
                          <SelectItem value="Government">Government</SelectItem>
                          <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        value={demoDateRangeFilter.start}
                        onChange={(e) =>
                          setDemoDateRangeFilter((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="bg-white border-gray-300"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">
                        End Date
                      </Label>
                      <Input
                        type="date"
                        value={demoDateRangeFilter.end}
                        onChange={(e) =>
                          setDemoDateRangeFilter((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="bg-white border-gray-300"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDemoStatusFilter("all");
                          setDemoIndustryFilter("all");
                          setDemoSearchFilter("");
                          setDemoDateRangeFilter({ start: "", end: "" });
                        }}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Demo Accounts Table */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">
                          Name & Contact
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Company
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Industry
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Username
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Password
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Assigned Intern
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Admin Note
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Intern Note
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Created
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Expires
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">
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
                              <Users className="h-12 w-12 text-gray-300 mb-4" />
                              <p className="text-lg font-medium">
                                {demoAccounts.length === 0
                                  ? "No demo accounts created yet"
                                  : "No demo accounts match your filters"}
                              </p>
                              <p className="text-sm">
                                {demoAccounts.length > 0 &&
                                  "Try adjusting your filters to see more results"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDemoAccounts.map((demo) => {
                          const isExpired =
                            new Date(demo.expires_at) < new Date();
                          const isActive = demo.is_active && !isExpired;

                          return (
                            <TableRow
                              key={demo.id}
                              className="hover:bg-gray-50/50"
                            >
                              <TableCell className="font-medium text-gray-900">
                                <div>
                                  <div className="font-semibold">
                                    {demo.first_name} {demo.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    {demo.email}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {demo.phone}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {demo.company}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {demo.industry_domain}
                              </TableCell>
                              <TableCell className="font-mono text-sm text-gray-800">
                                <div className="flex items-center gap-2">
                                  <span>{demo.username}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(demo.username)
                                    }
                                    className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                    title="Copy Username"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="relative">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm text-gray-800">
                                    {passwordVisibility[demo.id]
                                      ? demo.password
                                      : "••••••••"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setPasswordVisibility((prev) => ({
                                        ...prev,
                                        [demo.id]: !prev[demo.id],
                                      }))
                                    }
                                    className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                    title={
                                      passwordVisibility[demo.id]
                                        ? "Hide Password"
                                        : "Show Password"
                                    }
                                  >
                                    {passwordVisibility[demo.id] ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(demo.password)
                                    }
                                    className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                    title="Copy Password"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={isActive ? "active" : "expired"}
                                  onValueChange={(value) =>
                                    handleUpdateDemoStatus(demo.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-24 bg-white border-gray-300">
                                    <SelectValue>
                                      <Badge
                                        variant={
                                          isActive ? "default" : "destructive"
                                        }
                                        className={
                                          isActive
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-red-100 text-red-700 border-red-200"
                                        }
                                      >
                                        {isActive ? "Active" : "Expired"}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">
                                      Active
                                    </SelectItem>
                                    <SelectItem value="expired">
                                      Expired
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                <Select
                                  value={
                                    demo.assigned_intern_id?.toString() ||
                                    "unassigned"
                                  }
                                  onValueChange={(value) =>
                                    handleDirectInternAssignment(demo.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-36 bg-white border-gray-300">
                                    <SelectValue placeholder="Assign intern">
                                      {demo.assigned_intern_name || (
                                        <span className="text-gray-400 italic">
                                          Unassigned
                                        </span>
                                      )}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="unassigned">
                                      <span className="text-gray-500">
                                        Unassign intern
                                      </span>
                                    </SelectItem>
                                    {interns.map((intern) => (
                                      <SelectItem
                                        key={intern.id}
                                        value={intern.id.toString()}
                                      >
                                        {intern.name} ({intern.specialization})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleViewEditDemoAdminNote(demo)
                                    }
                                    className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    title={
                                      demo.admin_note
                                        ? "View/Edit Admin Note"
                                        : "Add Admin Note"
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleViewDemoInternNote(demo)
                                    }
                                    className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    title={
                                      demo.intern_note
                                        ? "View Intern Note"
                                        : "No Intern Note"
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {/* Notification indicator for new intern note */}
                                  {demo.intern_note && (
                                    <div className="relative">
                                      <Bell
                                        className="h-3 w-3 text-blue-500"
                                        title="Has intern note"
                                      />
                                    </div>
                                  )}
                                  {/* Notification indicator for recent updates */}
                                  {demo.recently_updated && (
                                    <div className="relative">
                                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                                      <MessageCircle
                                        className="h-3 w-3 text-green-500"
                                        title="Recently updated"
                                      />
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {new Date(demo.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {new Date(demo.expires_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                  >
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleEditDemoAccount(demo)
                                      }
                                      className="hover:bg-blue-50"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Demo Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRegenerateDemoCredentials(demo.id)
                                      }
                                      className="hover:bg-green-50"
                                    >
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Regenerate Credentials
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        copyToClipboard(
                                          `Username: ${demo.username}\nPassword: ${demo.password}`
                                        )
                                      }
                                      className="hover:bg-purple-50"
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy Credentials
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleOpenAssignInternDialog(demo)
                                      }
                                      className="hover:bg-purple-50"
                                    >
                                      <UserPlus className="h-4 w-4 mr-2" />
                                      Assign Intern
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteDemoAccount(demo)
                                      }
                                      className="hover:bg-red-50 text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Demo Account
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <Dialog
          open={isViewCustomerDetailsDialogOpen}
          onOpenChange={setIsViewCustomerDetailsDialogOpen}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedCustomer?.first_name}{" "}
                {selectedCustomer?.last_name}
              </DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Name:</strong> {selectedCustomer.first_name}{" "}
                        {selectedCustomer.last_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedCustomer.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedCustomer.phone}
                      </p>
                      <p>
                        <strong>Company:</strong> {selectedCustomer.company}
                      </p>
                      <p>
                        <strong>Industry:</strong>{" "}
                        {selectedCustomer.industry_domain}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Project Status</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Account Type:</strong>{" "}
                        {selectedCustomer.account_type}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <Badge>{selectedCustomer.status}</Badge>
                      </p>
                      <p>
                        <strong>Dashboards Requested:</strong>{" "}
                        {selectedCustomer.dashboards_requested || 0}
                      </p>
                      <p>
                        <strong>Dashboards Delivered:</strong>{" "}
                        {selectedCustomer.dashboards_delivered || 0}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                          selectedCustomer.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* API Credentials */}
                {selectedCustomer.api_username && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">API Credentials</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Username:</strong>{" "}
                          {selectedCustomer.api_username}
                        </p>
                        <p>
                          <strong>Password:</strong>{" "}
                          {selectedCustomer.api_password}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>API Key:</strong> {selectedCustomer.api_key}
                        </p>
                        <p>
                          <strong>Endpoint:</strong>{" "}
                          {selectedCustomer.api_endpoint}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Use Cases */}
                <div>
                  <h3 className="font-semibold mb-2">Use Cases</h3>
                  <div className="text-sm">
                    <p>
                      <strong>Primary Use Case:</strong>{" "}
                      {selectedCustomer.primary_use_case || "Not specified"}
                    </p>
                    {selectedCustomer.use_cases_list &&
                      selectedCustomer.use_cases_list.length > 0 && (
                        <div className="mt-2">
                          <p>
                            <strong>Additional Use Cases:</strong>
                          </p>
                          <ul className="list-disc list-inside ml-4">
                            {selectedCustomer.use_cases_list.map(
                              (useCase, index) => (
                                <li key={index}>{useCase}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>

                {/* Admin Note */}
                {selectedCustomer.admin_note && (
                  <div>
                    <h3 className="font-semibold mb-2">Admin Note</h3>
                    <div className="bg-blue-50 p-3 rounded text-sm">
                      {selectedCustomer.admin_note}
                    </div>
                  </div>
                )}

                {/* Intern Note */}
                {selectedCustomer.intern_note && (
                  <div>
                    <h3 className="font-semibold mb-2">Intern Note</h3>
                    <div className="bg-green-50 p-3 rounded text-sm">
                      {selectedCustomer.intern_note}
                    </div>
                  </div>
                )}

                {/* Customer Feedback */}
                {selectedCustomer.customer_feedback && (
                  <div>
                    <h3 className="font-semibold mb-2">Customer Feedback</h3>
                    <div className="bg-blue-50 p-3 rounded text-sm">
                      {selectedCustomer.customer_feedback}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {selectedCustomer.next_steps && (
                  <div>
                    <h3 className="font-semibold mb-2">Next Steps</h3>
                    <div className="bg-green-50 p-3 rounded text-sm">
                      {selectedCustomer.next_steps}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Project Details Modal */}
        <Dialog
          open={isEditProjectDialogOpen}
          onOpenChange={setIsEditProjectDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project Details</DialogTitle>
              <DialogDescription>
                Update project information and tracking details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Dashboard Tracking */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dashboards Requested</Label>
                  <Input
                    type="number"
                    value={projectEditData.dashboards_requested}
                    onChange={(e) =>
                      setProjectEditData((prev) => ({
                        ...prev,
                        dashboards_requested: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dashboards Delivered</Label>
                  <Input
                    type="number"
                    value={projectEditData.dashboards_delivered}
                    onChange={(e) =>
                      setProjectEditData((prev) => ({
                        ...prev,
                        dashboards_delivered: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Admin Note</Label>
                  <Textarea
                    rows={3}
                    value={projectEditData.admin_note}
                    onChange={(e) =>
                      setProjectEditData((prev) => ({
                        ...prev,
                        admin_note: e.target.value,
                      }))
                    }
                    placeholder="Add admin notes..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Intern Note (Read Only)</Label>
                  <Textarea
                    rows={3}
                    value={projectEditData.intern_note}
                    readOnly
                    placeholder="Intern will add notes here..."
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* API Credentials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Username</Label>
                  <Input
                    value={projectEditData.api_username}
                    onChange={(e) =>
                      setProjectEditData((prev) => ({
                        ...prev,
                        api_username: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Password</Label>
                  <Input
                    value={projectEditData.api_password}
                    onChange={(e) =>
                      setProjectEditData((prev) => ({
                        ...prev,
                        api_password: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    value={projectEditData.api_key}
                    onChange={(e) =>
                      setProjectEditData((prev) => ({
                        ...prev,
                        api_key: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input
                    value={projectEditData.api_endpoint}
                    onChange={(e) =>
                      setProjectEditData((prev) => ({
                        ...prev,
                        api_endpoint: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Customer Feedback */}
              <div className="space-y-2">
                <Label>Customer Feedback</Label>
                <Textarea
                  rows={3}
                  value={projectEditData.customer_feedback}
                  onChange={(e) =>
                    setProjectEditData((prev) => ({
                      ...prev,
                      customer_feedback: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Next Steps */}
              <div className="space-y-2">
                <Label>Next Steps</Label>
                <Textarea
                  rows={3}
                  value={projectEditData.next_steps}
                  onChange={(e) =>
                    setProjectEditData((prev) => ({
                      ...prev,
                      next_steps: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateProjectDetails} className="flex-1">
                  Update Project Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditProjectDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Use Cases Modal */}
        <Dialog
          open={isUseCasesModalOpen}
          onOpenChange={setIsUseCasesModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Use Cases</DialogTitle>
              <DialogDescription>
                Use cases for {selectedCustomer?.first_name}{" "}
                {selectedCustomer?.last_name}
              </DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Primary Use Case:</h4>
                  <p className="text-sm">
                    {selectedCustomer.primary_use_case || "Not specified"}
                  </p>
                </div>
                {selectedCustomer.use_cases_list &&
                  selectedCustomer.use_cases_list.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Additional Use Cases:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {selectedCustomer.use_cases_list.map(
                          (useCase, index) => (
                            <li key={index}>{useCase}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Intern Details Modal */}
        <Dialog
          open={isViewInternDetailsOpen}
          onOpenChange={setIsViewInternDetailsOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Intern Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedIntern?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedIntern && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Name:</strong> {selectedIntern.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedIntern.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedIntern.phone || "N/A"}
                      </p>
                      <p>
                        <strong>WhatsApp:</strong>{" "}
                        {selectedIntern.whatsapp || "N/A"}
                      </p>
                      <p>
                        <strong>Specialization:</strong>{" "}
                        <Badge>{selectedIntern.specialization}</Badge>
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <Badge
                          className={
                            (selectedIntern.status || "active") === "active"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : (selectedIntern.status || "active") ===
                                "inactive"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          }
                        >
                          {selectedIntern.status || "active"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Assigned Count:</strong>{" "}
                        {selectedIntern.assigned_count}
                      </p>
                      <p>
                        <strong>Completed Count:</strong>{" "}
                        {selectedIntern.completed_count}
                      </p>
                      <p>
                        <strong>Success Rate:</strong>{" "}
                        {selectedIntern.success_rate}%
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                          selectedIntern.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Integrations Section */}
                <div>
                  <h3 className="font-semibold mb-2">Integrations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntern.integrations &&
                    selectedIntern.integrations.length > 0 ? (
                      selectedIntern.integrations.map((integration) => (
                        <Badge
                          key={integration}
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          {integration}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        No integrations assigned
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Accounts Section */}
                <div>
                  <h3 className="font-semibold mb-2">Customer Accounts</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntern.customer_companies &&
                    selectedIntern.customer_companies.length > 0 ? (
                      selectedIntern.customer_companies.map((company) => (
                        <Badge
                          key={company}
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          {company}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        No customers assigned
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Login Credentials</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Username:</strong>
                        <span className="font-mono ml-2">
                          {selectedIntern.username}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(selectedIntern.username)
                          }
                          className="ml-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Password:</strong>
                        <span className="font-mono ml-2">
                          {passwordVisibility[selectedIntern.id]
                            ? selectedIntern.password
                            : "••••••••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            togglePasswordVisibility(selectedIntern.id)
                          }
                          className="ml-2"
                        >
                          {passwordVisibility[selectedIntern.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(selectedIntern.password)
                          }
                          className="ml-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Intern Note Modal */}
        <Dialog
          open={isInternNoteModalOpen}
          onOpenChange={setIsInternNoteModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Intern Note</DialogTitle>
              <DialogDescription>
                Note from intern for {selectedCustomer?.first_name}{" "}
                {selectedCustomer?.last_name}
              </DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm">
                    {selectedCustomer.intern_note || "No intern note available"}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Intern Dialog */}
        <Dialog
          open={isEditInternDialogOpen}
          onOpenChange={setIsEditInternDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Intern Details</DialogTitle>
              <DialogDescription>
                Update intern information and specialization
              </DialogDescription>
            </DialogHeader>
            {selectedIntern && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editInternName">Name</Label>
                  <Input
                    id="editInternName"
                    value={selectedIntern.name}
                    onChange={(e) =>
                      setSelectedIntern((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editInternEmail">Email</Label>
                  <Input
                    id="editInternEmail"
                    type="email"
                    value={selectedIntern.email}
                    onChange={(e) =>
                      setSelectedIntern((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editInternPhone">Phone</Label>
                    <Input
                      id="editInternPhone"
                      value={selectedIntern.phone || ""}
                      onChange={(e) =>
                        setSelectedIntern((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editInternWhatsapp">WhatsApp</Label>
                    <Input
                      id="editInternWhatsapp"
                      value={selectedIntern.whatsapp || ""}
                      onChange={(e) =>
                        setSelectedIntern((prev) => ({
                          ...prev,
                          whatsapp: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editInternSpecialization">
                    Specialization
                  </Label>
                  <Select
                    value={selectedIntern.specialization}
                    onValueChange={(value) =>
                      setSelectedIntern((prev) => ({
                        ...prev,
                        specialization: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L&D">L&D</SelectItem>
                      <SelectItem value="Demo">Demo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleUpdateIntern}>
                    Update Intern
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditInternDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Admin Note Edit Dialog */}
        <Dialog
          open={isAdminNoteModalOpen}
          onOpenChange={setIsAdminNoteModalOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Edit Admin Note
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Add or edit admin note for {selectedCustomer?.first_name}{" "}
                {selectedCustomer?.last_name} from {selectedCustomer?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="adminNote"
                  className="text-gray-700 font-medium"
                >
                  Admin Note
                </Label>
                <Textarea
                  id="adminNote"
                  value={adminNoteText}
                  onChange={(e) => setAdminNoteText(e.target.value)}
                  placeholder="Enter admin notes about this customer request..."
                  rows={4}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveAdminNote}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Save Admin Note
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAdminNoteModalOpen(false)}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Intern Note View Dialog (Admin can only view, not edit) */}
        <Dialog
          open={isInternNoteViewModalOpen}
          onOpenChange={setIsInternNoteViewModalOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                View Intern Note
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Intern note for {selectedCustomer?.first_name}{" "}
                {selectedCustomer?.last_name} from {selectedCustomer?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Intern Note (Read Only)
                </Label>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 min-h-[100px]">
                  <p className="text-sm text-gray-700">
                    {internNoteText || "No intern note available"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsInternNoteViewModalOpen(false)}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Customer Confirmation Dialog */}
        <Dialog
          open={isDeleteCustomerDialogOpen}
          onOpenChange={setIsDeleteCustomerDialogOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-red-900">
                Delete Customer
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Are you sure you want to delete {selectedCustomer?.first_name}{" "}
                {selectedCustomer?.last_name} from {selectedCustomer?.company}?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={confirmDeleteCustomer}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Customer
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteCustomerDialogOpen(false)}
                className="bg-white hover:bg-gray-50 border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Intern Confirmation Dialog */}
        <Dialog
          open={isDeleteInternDialogOpen}
          onOpenChange={setIsDeleteInternDialogOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-red-900">
                Delete Intern
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Are you sure you want to delete {selectedIntern?.name}? This
                will unassign them from all customer requests. This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={confirmDeleteIntern}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Intern
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteInternDialogOpen(false)}
                className="bg-white hover:bg-gray-50 border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog
          open={isEditCustomerDialogOpen}
          onOpenChange={setIsEditCustomerDialogOpen}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Edit Customer
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update customer information for {selectedCustomer?.first_name}{" "}
                {selectedCustomer?.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="editFirstName"
                    className="text-gray-700 font-medium"
                  >
                    First Name
                  </Label>
                  <Input
                    id="editFirstName"
                    value={editedCustomer.first_name}
                    onChange={(e) =>
                      setEditedCustomer((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="editLastName"
                    className="text-gray-700 font-medium"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="editLastName"
                    value={editedCustomer.last_name}
                    onChange={(e) =>
                      setEditedCustomer((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editEmail"
                  className="text-gray-700 font-medium"
                >
                  Email
                </Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editedCustomer.email}
                  onChange={(e) =>
                    setEditedCustomer((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editCompany"
                  className="text-gray-700 font-medium"
                >
                  Company
                </Label>
                <Input
                  id="editCompany"
                  value={editedCustomer.company}
                  onChange={(e) =>
                    setEditedCustomer((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editPhone"
                  className="text-gray-700 font-medium"
                >
                  Phone
                </Label>
                <Input
                  id="editPhone"
                  value={editedCustomer.phone}
                  onChange={(e) =>
                    setEditedCustomer((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editIndustry"
                  className="text-gray-700 font-medium"
                >
                  Industry Domain
                </Label>
                <Select
                  value={editedCustomer.industry_domain}
                  onValueChange={(value) =>
                    setEditedCustomer((prev) => ({
                      ...prev,
                      industry_domain: value,
                    }))
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {industryDomains.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveCustomerEdit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditCustomerDialogOpen(false)}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Demo Account Confirmation Dialog */}
        <Dialog
          open={isDeleteDemoAccountDialogOpen}
          onOpenChange={setIsDeleteDemoAccountDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600 font-semibold">
                Delete Demo Account
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Are you sure you want to delete the demo account for{" "}
                {selectedDemoAccount?.first_name}{" "}
                {selectedDemoAccount?.last_name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDeleteDemoAccountDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={confirmDeleteDemoAccount}
              >
                Delete Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Demo Account Dialog */}
        <Dialog
          open={isEditDemoAccountDialogOpen}
          onOpenChange={setIsEditDemoAccountDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-blue-600 font-semibold">
                Edit Demo Account
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the demo account information for{" "}
                {selectedDemoAccount?.first_name}{" "}
                {selectedDemoAccount?.last_name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="editDemoFirstName"
                    className="text-gray-700 font-medium"
                  >
                    First Name
                  </Label>
                  <Input
                    id="editDemoFirstName"
                    value={editedDemoAccount.first_name}
                    onChange={(e) =>
                      setEditedDemoAccount((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="editDemoLastName"
                    className="text-gray-700 font-medium"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="editDemoLastName"
                    value={editedDemoAccount.last_name}
                    onChange={(e) =>
                      setEditedDemoAccount((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editDemoEmail"
                  className="text-gray-700 font-medium"
                >
                  Email
                </Label>
                <Input
                  id="editDemoEmail"
                  type="email"
                  value={editedDemoAccount.email}
                  onChange={(e) =>
                    setEditedDemoAccount((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="bg-white border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editDemoCompany"
                  className="text-gray-700 font-medium"
                >
                  Company
                </Label>
                <Input
                  id="editDemoCompany"
                  value={editedDemoAccount.company}
                  onChange={(e) =>
                    setEditedDemoAccount((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="bg-white border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editDemoPhone"
                  className="text-gray-700 font-medium"
                >
                  Phone
                </Label>
                <Input
                  id="editDemoPhone"
                  value={editedDemoAccount.phone}
                  onChange={(e) =>
                    setEditedDemoAccount((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="bg-white border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editDemoIndustry"
                  className="text-gray-700 font-medium"
                >
                  Industry Domain
                </Label>
                <Select
                  value={editedDemoAccount.industry_domain}
                  onValueChange={(value) =>
                    setEditedDemoAccount((prev) => ({
                      ...prev,
                      industry_domain: value,
                    }))
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Drone Technology">
                      Drone Technology
                    </SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Information Technology">
                      Information Technology
                    </SelectItem>
                    <SelectItem value="Finance & Banking">
                      Finance & Banking
                    </SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Retail & E-commerce">
                      Retail & E-commerce
                    </SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                    <SelectItem value="Aerospace">Aerospace</SelectItem>
                    <SelectItem value="Energy & Utilities">
                      Energy & Utilities
                    </SelectItem>
                    <SelectItem value="Telecommunications">
                      Telecommunications
                    </SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Food & Beverage">
                      Food & Beverage
                    </SelectItem>
                    <SelectItem value="Logistics & Supply Chain">
                      Logistics & Supply Chain
                    </SelectItem>
                    <SelectItem value="Pharmaceuticals">
                      Pharmaceuticals
                    </SelectItem>
                    <SelectItem value="Media & Entertainment">
                      Media & Entertainment
                    </SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditDemoAccountDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSaveDemoAccountEdit}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Demo Admin Note Dialog */}
        <Dialog
          open={isDemoAdminNoteDialogOpen}
          onOpenChange={setIsDemoAdminNoteDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-600 font-semibold">
                Demo Admin Note
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Add or edit admin note for {selectedDemoAccount?.first_name}{" "}
                {selectedDemoAccount?.last_name}'s demo account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label
                  htmlFor="demoAdminNote"
                  className="text-gray-700 font-medium"
                >
                  Admin Note
                </Label>
                <Textarea
                  id="demoAdminNote"
                  rows={4}
                  value={demoAdminNoteText}
                  onChange={(e) => setDemoAdminNoteText(e.target.value)}
                  placeholder="Add admin notes about this demo account..."
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDemoAdminNoteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSaveDemoAdminNote}>
                Save Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Demo Intern Note View Dialog (Read-Only) */}
        <Dialog
          open={isDemoInternNoteDialogOpen}
          onOpenChange={setIsDemoInternNoteDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-emerald-600 font-semibold">
                View Intern Note
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Intern note for {selectedDemoAccount?.first_name}{" "}
                {selectedDemoAccount?.last_name}'s demo account.
                <br />
                <span className="text-amber-600 font-medium">
                  Note: Only the assigned intern can modify this note.
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Intern Note</Label>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 min-h-[100px]">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {demoInternNoteText || (
                      <span className="text-gray-400 italic">
                        No intern note has been added yet.
                      </span>
                    )}
                  </p>
                </div>
                {selectedDemoAccount?.assigned_intern_id && (
                  <p className="text-sm text-gray-500">
                    Only the assigned intern can edit this note.
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                className="flex-1"
                onClick={() => setIsDemoInternNoteDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Intern to Demo Dialog */}
        <Dialog
          open={isAssignInternToDemoDialogOpen}
          onOpenChange={setIsAssignInternToDemoDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-purple-600 font-semibold">
                Assign Intern to Demo
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Assign an intern to manage {selectedDemoAccount?.first_name}{" "}
                {selectedDemoAccount?.last_name}'s demo account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Current Assignment
                </Label>
                <p className="text-sm text-gray-600">
                  {selectedDemoAccount?.assigned_intern_name ||
                    "No intern currently assigned"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Select Intern
                </Label>
                <Select
                  defaultValue={
                    selectedDemoAccount?.assigned_intern_id?.toString() || ""
                  }
                  onValueChange={handleSaveInternToDemoAssignment}
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Choose an intern or unassign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">
                      <span className="text-gray-500">Unassign intern</span>
                    </SelectItem>
                    {interns.map((intern) => (
                      <SelectItem key={intern.id} value={intern.id.toString()}>
                        {intern.name} ({intern.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsAssignInternToDemoDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
