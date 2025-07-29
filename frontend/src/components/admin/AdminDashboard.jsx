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
  RefreshCw,
  Star,
  Settings,
  Copy,
  Plus,
  Filter,
  UserCheck,
} from "lucide-react";
import { apiService } from "../../services/api";

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

export function AdminDashboard() {
  // State for interns
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for customers/free trial requests
  const [customers, setCustomers] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [internsResponse, customersResponse] = await Promise.all([
        apiService.admin.getInterns(),
        apiService.admin.getCustomers(),
      ]);

      if (internsResponse.data.success) {
        setInterns(internsResponse.data.data);
      }
      if (customersResponse.data.success) {
        setCustomers(customersResponse.data.data);
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
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] =
    useState(false);

  // Selected items for editing/viewing
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form states
  const [newIntern, setNewIntern] = useState({
    name: "",
    email: "",
    specialization: "L&D",
  });

  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    industryDomain: "",
  });

  const [selectedCredentials, setSelectedCredentials] = useState("");
  const [filter, setFilter] = useState("all");
  const [internFilter, setInternFilter] = useState("all");

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
        specialization: newIntern.specialization,
      };

      const response = await apiService.admin.createIntern(internData);

      if (response.data.success) {
        // Reload data to get updated list
        loadData();
        setNewIntern({ name: "", email: "", specialization: "L&D" });
        setIsAddInternDialogOpen(false);
      } else {
        setError("Failed to create intern: " + response.data.message);
      }
    } catch (err) {
      setError("Error creating intern: " + err.message);
      console.error("Error creating intern:", err);
    }
  };

  // Regenerate intern credentials
  const handleRegenerateCredentials = (internId) => {
    setInterns((prev) =>
      prev.map((intern) =>
        intern.id === internId
          ? {
              ...intern,
              username: generateUsername(intern.name),
              password: generatePassword(),
            }
          : intern
      )
    );
  };

  // Assign intern to request
  const handleAssignIntern = async (requestId, internId) => {
    try {
      const response = await apiService.admin.assignIntern(requestId, internId);

      if (response.data.success) {
        // Reload data to get updated list
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
        // Reload data to get updated list
        loadData();
      } else {
        setError("Failed to update status: " + response.data.message);
      }
    } catch (err) {
      setError("Error updating status: " + err.message);
      console.error("Error updating status:", err);
    }
  };

  // Add new customer
  const handleAddCustomer = async () => {
    try {
      const customerData = {
        first_name: newCustomer.firstName,
        last_name: newCustomer.lastName,
        email: newCustomer.email,
        company: newCustomer.company,
        phone: newCustomer.phone,
        industry_domain: newCustomer.industryDomain,
        request_type: "L&D", // Default to L&D for manual entries
        status: "pending",
      };

      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        await loadData(); // Refresh the data
        setNewCustomer({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          phone: "",
          industryDomain: "",
        });
        setIsAddCustomerDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  // View credentials
  const handleViewCredentials = (credentials) => {
    setSelectedCredentials(credentials);
    setIsViewCredentialsDialogOpen(true);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Edit intern
  const handleEditIntern = (intern) => {
    setSelectedIntern(intern);
    setIsEditInternDialogOpen(true);
  };

  // Update intern
  const handleUpdateIntern = () => {
    setInterns((prev) =>
      prev.map((intern) =>
        intern.id === selectedIntern.id ? selectedIntern : intern
      )
    );
    setIsEditInternDialogOpen(false);
    setSelectedIntern(null);
  };

  // View customer details
  const handleViewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsViewCustomerDetailsDialogOpen(true);
  };

  // Edit customer details
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsEditCustomerDialogOpen(true);
  };

  // Update customer
  const handleUpdateCustomer = () => {
    if (selectedCustomer) {
      setCustomers(
        customers.map((customer) =>
          customer.id === selectedCustomer.id ? selectedCustomer : customer
        )
      );
      setIsEditCustomerDialogOpen(false);
      setIsViewCustomerDetailsDialogOpen(false);
      setSelectedCustomer(null);
    }
  };

  // Filter functions
  const filteredCustomers = customers.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const filteredInterns = interns.filter((intern) => {
    if (internFilter === "all") return true;
    return intern.specialization === internFilter;
  });

  // Stats calculations
  const stats = {
    totalInterns: interns.length,
    totalCustomers: customers.length,
    activeRecords: customers.filter((c) => c.progress < 100).length,
    avgProgress: Math.round(
      customers.reduce((sum, c) => sum + c.progress, 0) / customers.length
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Multi-Tenant Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 ml-4">Welcome, Admin User</p>
            </div>
            <div className="flex gap-2">
              <Dialog
                open={isAddInternDialogOpen}
                onOpenChange={setIsAddInternDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Intern
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Intern</DialogTitle>
                    <DialogDescription>
                      Create a new intern account with credentials
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="internName">Name</Label>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internEmail">Email</Label>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internSpecialization">
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
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L&D">L&D</SelectItem>
                          <SelectItem value="Demo">Demo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddIntern} className="w-full">
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
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer Manually</DialogTitle>
                    <DialogDescription>
                      Create a customer record manually (for non-registration
                      entries)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerFirstName">First Name</Label>
                        <Input
                          id="customerFirstName"
                          value={newCustomer.firstName || ""}
                          onChange={(e) =>
                            setNewCustomer((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          placeholder="e.g., John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerLastName">Last Name</Label>
                        <Input
                          id="customerLastName"
                          value={newCustomer.lastName || ""}
                          onChange={(e) =>
                            setNewCustomer((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          placeholder="e.g., Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newCustomer.email || ""}
                        onChange={(e) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="e.g., john.doe@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerCompany">Company</Label>
                      <Input
                        id="customerCompany"
                        value={newCustomer.company || ""}
                        onChange={(e) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder="e.g., Acme Corp"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone</Label>
                      <Input
                        id="customerPhone"
                        value={newCustomer.phone || ""}
                        onChange={(e) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="e.g., +1-555-0123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerIndustry">Industry Domain</Label>
                      <Input
                        id="customerIndustry"
                        value={newCustomer.industryDomain || ""}
                        onChange={(e) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            industryDomain: e.target.value,
                          }))
                        }
                        placeholder="e.g., Technology"
                      />
                    </div>
                    <Button onClick={handleAddCustomer} className="w-full">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Interns
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInterns}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Active team members
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                All customer records
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Records
              </CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.activeRecords}
              </div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">
                Overall completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="intern-management">
              Intern Management
            </TabsTrigger>
            <TabsTrigger value="customer-records">Customer Records</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates from your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customers.slice(0, 3).map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {customer.company}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            Assigned to {customer.assignedTo} • {customer.stage}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={customer.progress}
                            className="w-16"
                          />
                          <span className="text-sm text-gray-500">
                            {customer.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>
                    Intern success rates and completion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {interns.map((intern) => (
                      <div
                        key={intern.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{intern.name}</p>
                          <p className="text-xs text-gray-500">
                            {intern.completed}/{intern.assigned} completed
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={intern.successRate}
                            className="w-16"
                          />
                          <span className="text-sm text-gray-500">
                            {intern.successRate}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="intern-management" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Intern Management</CardTitle>
                    <CardDescription>
                      Manage intern roles and auto-generated credentials
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={internFilter}
                      onValueChange={setInternFilter}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Interns</SelectItem>
                        <SelectItem value="L&D">L&D Only</SelectItem>
                        <SelectItem value="Demo">Demo Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog
                      open={isAddInternDialogOpen}
                      onOpenChange={setIsAddInternDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Intern
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Intern</DialogTitle>
                          <DialogDescription>
                            Create a new intern with auto-generated credentials
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="internName">Name</Label>
                            <Input
                              id="internName"
                              value={newIntern.name}
                              onChange={(e) =>
                                setNewIntern((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="internEmail">Email</Label>
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
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="internSpecialization">
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
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="L&D">L&D</SelectItem>
                                <SelectItem value="Demo">Demo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleAddIntern} className="w-full">
                            Add Intern
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">
                  Showing all {filteredInterns.length} interns
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInterns.map((intern) => (
                      <TableRow key={intern.id}>
                        <TableCell className="font-medium">
                          {intern.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">
                              {intern.username}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(intern.username)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">
                              ••••••••••••
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(intern.password)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{intern.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              intern.specialization === "L&D"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {intern.specialization}
                          </Badge>
                        </TableCell>
                        <TableCell>{intern.assigned_count}</TableCell>
                        <TableCell>{intern.completed_count}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={intern.success_rate}
                              className="w-16"
                            />
                            <span className="text-sm">
                              {intern.success_rate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRegenerateCredentials(intern.id)
                                }
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Regenerate Credentials
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditIntern(intern)}
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
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Login Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer-records" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Free Trial Requests</CardTitle>
                    <CardDescription>
                      Manage L&D free trial requests and assign interns
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={loadData}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <>
                    <div className="text-sm text-gray-500 mb-4">
                      Showing {filteredCustomers.length} requests
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Industry</TableHead>
                            <TableHead>Use Case</TableHead>
                            <TableHead>Assigned Intern</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCustomers.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                className="text-center py-8 text-gray-500"
                              >
                                No free trial requests found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredCustomers.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {request.first_name} {request.last_name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {request.email}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {request.phone}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{request.company}</TableCell>
                                <TableCell>{request.industry_domain}</TableCell>
                                <TableCell>
                                  <div
                                    className="max-w-48 truncate"
                                    title={request.primary_use_case}
                                  >
                                    {request.primary_use_case ||
                                      request.smartcard_usage ||
                                      "Not specified"}
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
                                      <SelectTrigger className="w-36">
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
                                      <UserCheck className="h-4 w-4 text-green-600" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      request.status === "pending"
                                        ? "destructive"
                                        : request.status === "assigned"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {request.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    request.created_at
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateStatus(
                                            request.id,
                                            "completed"
                                          )
                                        }
                                        disabled={
                                          request.status === "completed"
                                        }
                                      >
                                        Mark Complete
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateStatus(
                                            request.id,
                                            "pending"
                                          )
                                        }
                                        disabled={request.status === "pending"}
                                      >
                                        Mark Pending
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
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Credentials Dialog */}
        <Dialog
          open={isViewCredentialsDialogOpen}
          onOpenChange={setIsViewCredentialsDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Integration Credentials</DialogTitle>
              <DialogDescription>
                Training credentials used for integration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="text-sm whitespace-pre-wrap">
                  {selectedCredentials}
                </pre>
              </div>
              <Button
                onClick={() => copyToClipboard(selectedCredentials)}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Credentials
              </Button>
            </div>
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
                <div className="space-y-2">
                  <Label htmlFor="editInternUsername">Username</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="editInternUsername"
                      value={selectedIntern.username}
                      onChange={(e) =>
                        setSelectedIntern((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedIntern.username)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editInternPassword">Password</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="editInternPassword"
                      type="text"
                      value={selectedIntern.password}
                      onChange={(e) =>
                        setSelectedIntern((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedIntern.password)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateIntern} className="flex-1">
                    Update Intern
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditInternDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* View Customer Details Dialog */}
        <Dialog
          open={isViewCustomerDetailsDialogOpen}
          onOpenChange={setIsViewCustomerDetailsDialogOpen}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                Complete information about the customer and their project
              </DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6">
                {/* Customer Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Name</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedCustomer.first_name} {selectedCustomer.last_name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Email</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedCustomer.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Company</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedCustomer.company}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Phone</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedCustomer.phone || "Not provided"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Industry Domain
                    </Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedCustomer.industry_domain || "Not specified"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Request Type
                    </Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <Badge
                        variant={
                          selectedCustomer.request_type === "L&D"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedCustomer.request_type}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Request Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Request Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Current Status
                      </Label>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <Badge variant="outline">
                          {selectedCustomer.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Assigned Intern
                      </Label>
                      <div className="p-3 bg-gray-50 rounded-md">
                        {selectedCustomer.assigned_intern_name ||
                          "Not assigned yet"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Request Date
                      </Label>
                      <div className="p-3 bg-gray-50 rounded-md">
                        {new Date(
                          selectedCustomer.created_at
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credentials Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Username:</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("acme_training_001")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                    acme_training_001
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Password:</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("train_csv_2024")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                    train_csv_2024
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">API Key:</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("ak_csv_acme_12345")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                    ak_csv_acme_12345
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Endpoint:</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard("https://api.training.com/csv")
                      }
                    >
                      <Copy className="h-3 w-3 mr-1" />
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                    https://api.training.com/csv
                  </div>
                </div>

                {/* Use Case */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Use Case</Label>
                  <div className="p-4 bg-gray-50 rounded-md min-h-[80px]">
                    <p className="text-sm">
                      Employee skill assessment and personalized learning paths
                      for 500+ employees
                    </p>
                  </div>
                </div>

                {/* Customer Feedback */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Customer Feedback
                  </Label>
                  <div className="p-4 bg-gray-50 rounded-md min-h-[80px]">
                    <p className="text-sm">
                      Very interested in the platform. Wants to see more
                      advanced features for employee training.
                    </p>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Next Steps</Label>
                  <div className="p-4 bg-gray-50 rounded-md min-h-[80px]">
                    <p className="text-sm">
                      Schedule technical deep-dive session with their IT team
                    </p>
                  </div>
                </div>

                {/* Progress and Rating */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Progress</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={selectedCustomer.progress}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium">
                          {selectedCustomer.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Rating</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < selectedCustomer.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Pilot Ready</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <Badge
                        variant={
                          selectedCustomer.canGoPilot ? "default" : "secondary"
                        }
                      >
                        {selectedCustomer.canGoPilot ? "Ready" : "Not Ready"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Pilot Project Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Pilot Date</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedCustomer.pilotDate}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Last Contact
                    </Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedCustomer.lastContact}
                    </div>
                  </div>
                </div>

                {/* Credentials Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">
                          Username:
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              selectedCustomer.credentials?.username || ""
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                        {selectedCustomer.credentials?.username || "Not set"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">
                          Password:
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              selectedCustomer.credentials?.password || ""
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                        {selectedCustomer.credentials?.password || "Not set"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">API Key:</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            selectedCustomer.credentials?.apiKey || ""
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                      {selectedCustomer.credentials?.apiKey || "Not set"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Endpoint:</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            selectedCustomer.credentials?.endpoint || ""
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                      {selectedCustomer.credentials?.endpoint || "Not set"}
                    </div>
                  </div>
                </div>

                {/* Editable Sections */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Use Case</Label>
                    <Textarea
                      value={selectedCustomer.useCase || ""}
                      onChange={(e) =>
                        setSelectedCustomer((prev) => ({
                          ...prev,
                          useCase: e.target.value,
                        }))
                      }
                      placeholder="Describe the customer's use case..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Customer Feedback
                    </Label>
                    <Textarea
                      value={selectedCustomer.feedback || ""}
                      onChange={(e) =>
                        setSelectedCustomer((prev) => ({
                          ...prev,
                          feedback: e.target.value,
                        }))
                      }
                      placeholder="Customer feedback and comments..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Next Steps</Label>
                    <Textarea
                      value={selectedCustomer.nextStep || ""}
                      onChange={(e) =>
                        setSelectedCustomer((prev) => ({
                          ...prev,
                          nextStep: e.target.value,
                        }))
                      }
                      placeholder="Next steps and action items..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewCustomerDetailsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCustomer} className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog
          open={isEditCustomerDialogOpen}
          onOpenChange={setIsEditCustomerDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4">
                {/* Credentials Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Username</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {selectedCustomer.credentials?.username || "N/A"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            selectedCustomer.credentials?.username || ""
                          )
                        }
                        className="h-6 w-6 p-0"
                      >
                        📋
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Password</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {selectedCustomer.credentials?.password || "N/A"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            selectedCustomer.credentials?.password || ""
                          )
                        }
                        className="h-6 w-6 p-0"
                      >
                        📋
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">API Key</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {selectedCustomer.credentials?.apiKey || "N/A"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            selectedCustomer.credentials?.apiKey || ""
                          )
                        }
                        className="h-6 w-6 p-0"
                      >
                        📋
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Endpoint</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {selectedCustomer.credentials?.endpoint || "N/A"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            selectedCustomer.credentials?.endpoint || ""
                          )
                        }
                        className="h-6 w-6 p-0"
                      >
                        📋
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-use-case">Use Case</Label>
                    <Textarea
                      id="edit-use-case"
                      value={selectedCustomer.useCase || ""}
                      onChange={(e) =>
                        setSelectedCustomer({
                          ...selectedCustomer,
                          useCase: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Enter use case details..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-feedback">Customer Feedback</Label>
                    <Textarea
                      id="edit-feedback"
                      value={selectedCustomer.feedback || ""}
                      onChange={(e) =>
                        setSelectedCustomer({
                          ...selectedCustomer,
                          feedback: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Enter customer feedback..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-next-steps">Next Steps</Label>
                    <Textarea
                      id="edit-next-steps"
                      value={selectedCustomer.nextStep || ""}
                      onChange={(e) =>
                        setSelectedCustomer({
                          ...selectedCustomer,
                          nextStep: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Enter next steps..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setIsEditCustomerDialogOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
