import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Clock,
  Users,
  Shield,
  Calendar,
  BarChart3,
  Settings,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [user] = useState({
    name: "John Doe",
    email: "john@company.com",
    company: "Acme Corp",
    accountType: "ld", // or "demo"
    status: "active",
    hoursUsed: 2.5,
    hoursLimit: 5,
    demoCredentials: {
      username: "demo_abc123",
      password: "temp_pass_456",
    },
    startDate: "2024-01-15",
    endDate: "2024-01-25", // for demo accounts
    nextBilling: "2024-02-15", // for L&D accounts
  });

  const hoursPercentage = (user.hoursUsed / user.hoursLimit) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant={user.accountType === "ld" ? "default" : "outline"}
              >
                {user.accountType === "ld" ? "L&D Account" : "Demo Account"}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage & Billing</TabsTrigger>
            <TabsTrigger value="demo">Demo Access</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Account Status
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    Active
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.accountType === "ld"
                      ? "L&D Management"
                      : "Demo Access"}
                  </p>
                </CardContent>
              </Card>

              {user.accountType === "ld" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Hours Used
                    </CardTitle>
                    <Clock className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {user.hoursUsed}/{user.hoursLimit}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${hoursPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.hoursLimit - user.hoursUsed} hours remaining
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {user.accountType === "ld"
                      ? "Next Billing"
                      : "Days Remaining"}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.accountType === "ld" ? "Feb 15" : "7 days"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.accountType === "ld"
                      ? "Monthly billing cycle"
                      : "Demo expires Jan 25"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                  >
                    <Users className="h-6 w-6 mb-2" />
                    Manage Users
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                  >
                    <BarChart3 className="h-6 w-6 mb-2" />
                    View Reports
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                  >
                    <Shield className="h-6 w-6 mb-2" />
                    Demo Login
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    Billing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            {user.accountType === "ld" ? (
              <>
                {/* Usage Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Usage</CardTitle>
                    <CardDescription>
                      Your L&D platform usage this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Hours Used</span>
                        <span className="font-semibold">
                          {user.hoursUsed} / {user.hoursLimit} hours
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${hoursPercentage}%` }}
                        />
                      </div>
                      {hoursPercentage > 80 && (
                        <div className="flex items-center space-x-2 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">
                            You're approaching your monthly limit
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>
                      Manage your subscription and billing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Current Plan</span>
                        <Badge>Free Trial (5 hours/month)</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Billing Date</span>
                        <span>{user.nextBilling}</span>
                      </div>
                      <Button className="w-full">Upgrade to Pro</Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Demo Account Information</CardTitle>
                  <CardDescription>Your demo access details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Account Type</span>
                      <Badge variant="outline">Demo Access</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Start Date</span>
                      <span>{user.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>End Date</span>
                      <span>{user.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days Remaining</span>
                      <span className="font-semibold text-orange-600">
                        7 days
                      </span>
                    </div>
                    <Button className="w-full">Upgrade to Full Account</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Demo Credentials</CardTitle>
                <CardDescription>
                  Use these credentials to test our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Demo Username
                        </label>
                        <p className="font-mono text-lg">
                          {user.demoCredentials.username}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Demo Password
                        </label>
                        <p className="font-mono text-lg">
                          {user.demoCredentials.password}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button>Test Demo Login</Button>
                    <Button variant="outline">Copy Credentials</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Features</CardTitle>
                <CardDescription>
                  What you can test with your demo account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>User Management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Course Creation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Progress Tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Reporting Dashboard</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-lg">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company</label>
                      <p className="text-lg">{user.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Account Type
                      </label>
                      <Badge>
                        {user.accountType === "ld"
                          ? "L&D Management"
                          : "Demo Account"}
                      </Badge>
                    </div>
                  </div>
                  <Button>Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
