import { useState, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ArrowLeft, Clock, Shield, CheckCircle } from "lucide-react";
import { apiService } from "../../services/api";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Use useMemo to get the initial account type from URL params
  const initialAccountType = useMemo(() => {
    const type = searchParams.get("type");
    return type === "demo" || type === "ld" ? type : "ld";
  }, [searchParams]);

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

  const availableIntegrations = [
    "Salesforce",
    "HubSpot",
    "Microsoft Teams",
    "Slack",
    "Zoom",
    "Google Workspace",
    "Microsoft 365",
    "Tableau",
    "Power BI",
    "AWS",
    "Azure",
    "Shopify",
    "WordPress",
    "Zapier",
    "Monday.com",
    "Asana",
    "Trello",
    "Jira",
    "GitHub",
    "GitLab",
  ];

  const demoUseCases = [
    "Employee onboarding and training",
    "Customer training and certification",
    "Product demonstration and tutorials",
    "Compliance and safety training",
    "Sales team enablement",
    "Partner and reseller training",
    "Technical documentation and guides",
    "Software user training",
    "Process improvement training",
    "Skills assessment and development",
  ];

  const demoTestingUseCases = [
    "Employee onboarding and training",
    "Customer training and certification",
    "Product demonstration and tutorials",
    "Compliance and safety training",
    "Sales team enablement",
    "Partner and reseller training",
    "Technical documentation and guides",
    "Software user training",
    "Process improvement training",
    "Skills assessment and development",
  ];

  const [accountType, setAccountType] = useState(initialAccountType);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    industryDomain: "",
    domainType: "predefined",
    primaryUseCase: "",
    primaryUseCaseType: "predefined",
    customPrimaryUseCase: "",
    // Demo-specific fields
    selectedIntegrations: [],
    customIntegration: "",
    demoUseCaseType: "predefined",
    customDemoUseCase: "",
    demoTestingUseCase: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare submission data with proper field mapping
      const submissionData = { ...formData, accountType };

      // For L&D accounts, ensure proper field mapping for custom use cases
      if (accountType === "ld") {
        // Handle primary use case field mapping
        if (formData.primaryUseCaseType === "custom") {
          submissionData.primaryUseCase = formData.customPrimaryUseCase;
        }

        // Validate required primary use case
        if (
          formData.primaryUseCaseType === "predefined" &&
          !formData.primaryUseCase
        ) {
          setError("Please select your primary use case for Smartcard AI");
          setIsSubmitting(false);
          return;
        }

        if (
          formData.primaryUseCaseType === "custom" &&
          !formData.customPrimaryUseCase
        ) {
          setError("Please enter your custom use case for Smartcard AI");
          setIsSubmitting(false);
          return;
        }
      }

      console.log("Registration data:", submissionData);

      // Call the API
      const response = await apiService.auth.register(submissionData);

      if (response.data.success) {
        // For L&D account type, show success dialog instead of redirect
        if (accountType === "ld") {
          setShowSuccessDialog(true);
        } else {
          // For demo accounts, use the credentials from the backend response
          const { username, password, expires_at } = response.data;
          navigate(
            `/user-portal/register-success?username=${username}&password=${password}&expires_at=${expires_at}&type=${accountType}&message=${encodeURIComponent(
              response.data.message
            )}`
          );
        }
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error occurred");
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccountTypeChange = (value) => {
    setAccountType(value);
  };

  const handleIntegrationChange = (integration, checked) => {
    setFormData((prev) => ({
      ...prev,
      selectedIntegrations: checked
        ? [...prev.selectedIntegrations, integration]
        : prev.selectedIntegrations.filter((item) => item !== integration),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-lg">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {accountType === "ld" ? (
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <Badge variant="secondary">L&D Account</Badge>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <Badge variant="outline">Demo Account</Badge>
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {accountType === "ld"
                ? "Register for L&D Management"
                : "Get Demo Access"}
            </CardTitle>
            <CardDescription>
              {accountType === "ld"
                ? "Get 5 hours free monthly + demo credentials for testing"
                : "10-day trial access with instant demo credentials"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domainType">Industry Domain</Label>
                <Select
                  value={formData.domainType}
                  onValueChange={(value) =>
                    handleInputChange("domainType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="predefined">
                      Select from industry list
                    </SelectItem>
                    <SelectItem value="custom">
                      Enter custom industry
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.domainType === "predefined" ? (
                <div className="space-y-2">
                  <Label htmlFor="industryDomain">Select Industry</Label>
                  <Select
                    value={formData.industryDomain}
                    onValueChange={(value) =>
                      handleInputChange("industryDomain", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your industry" />
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
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="customIndustry">Custom Industry</Label>
                  <Input
                    id="customIndustry"
                    type="text"
                    placeholder="e.g., Renewable Energy, Biotechnology, etc."
                    value={formData.industryDomain}
                    onChange={(e) =>
                      handleInputChange("industryDomain", e.target.value)
                    }
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Enter your specific industry or business domain
                  </p>
                </div>
              )}

              {/* L&D-specific fields */}
              {accountType === "ld" && (
                <>
                  {/* How would you like to use Smartcard AI? - Required with custom option */}
                  <div className="space-y-2">
                    <Label htmlFor="primaryUseCaseType">
                      How would you like to use Smartcard AI? *
                    </Label>
                    <Select
                      value={formData.primaryUseCaseType}
                      onValueChange={(value) =>
                        handleInputChange("primaryUseCaseType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="predefined">
                          Select from common use cases
                        </SelectItem>
                        <SelectItem value="custom">
                          Enter custom use case
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.primaryUseCaseType === "predefined" ? (
                    <div className="space-y-2">
                      <Label htmlFor="primaryUseCase">
                        Select Common Use Case
                      </Label>
                      <Select
                        value={formData.primaryUseCase}
                        onValueChange={(value) =>
                          handleInputChange("primaryUseCase", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your common use case" />
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
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="customPrimaryUseCase">
                        Custom Use Case
                      </Label>
                      <Textarea
                        id="customPrimaryUseCase"
                        placeholder="Describe your specific use case for Smartcard AI..."
                        value={formData.customPrimaryUseCase}
                        onChange={(e) =>
                          handleInputChange(
                            "customPrimaryUseCase",
                            e.target.value
                          )
                        }
                        rows={3}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Please describe your specific use case for Smartcard AI
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Demo-specific fields */}
              {accountType === "demo" && (
                <>
                  {/* Integrations Selection */}
                  <div className="space-y-3">
                    <Label>Integrations to Test</Label>
                    <p className="text-sm text-gray-600">
                      Select the integrations you'd like to explore during your
                      demo
                    </p>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                      {availableIntegrations.map((integration) => (
                        <div
                          key={integration}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={integration}
                            checked={formData.selectedIntegrations.includes(
                              integration
                            )}
                            onCheckedChange={(checked) =>
                              handleIntegrationChange(integration, checked)
                            }
                          />
                          <Label
                            htmlFor={integration}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {integration}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.selectedIntegrations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.selectedIntegrations.map((integration) => (
                          <Badge
                            key={integration}
                            variant="secondary"
                            className="text-xs"
                          >
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Custom Integration */}
                  <div className="space-y-2">
                    <Label htmlFor="customIntegration">
                      Custom Integration (Optional)
                    </Label>
                    <Textarea
                      id="customIntegration"
                      placeholder="e.g., SAP, Oracle, Custom API, etc."
                      value={formData.customIntegration}
                      onChange={(e) =>
                        handleInputChange("customIntegration", e.target.value)
                      }
                      rows={2}
                    />
                    <p className="text-xs text-gray-500">
                      Mention any specific integration not listed above that
                      you'd like to test
                    </p>
                  </div>

                  {/* Demo Use Case */}
                  <div className="space-y-2">
                    <Label htmlFor="demoUseCaseType">Demo Use Case</Label>
                    <Select
                      value={formData.demoUseCaseType}
                      onValueChange={(value) =>
                        handleInputChange("demoUseCaseType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="predefined">
                          Select common use case
                        </SelectItem>
                        <SelectItem value="custom">
                          Describe custom use case
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.demoUseCaseType === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="customDemoUseCase">Custom Use Case</Label>
                      <Textarea
                        id="customDemoUseCase"
                        placeholder="Describe your specific demo use case..."
                        value={formData.customDemoUseCase}
                        onChange={(e) =>
                          handleInputChange("customDemoUseCase", e.target.value)
                        }
                        rows={3}
                      />
                      <p className="text-xs text-gray-500">
                        Please describe your specific use case requirements
                      </p>
                    </div>
                  )}

                  {/* What would you like to test? */}
                  <div className="space-y-2">
                    <Label htmlFor="demoTestingUseCase">
                      What would you like to test?
                    </Label>
                    <Select
                      value={formData.demoTestingUseCase}
                      onValueChange={(value) =>
                        handleInputChange("demoTestingUseCase", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your common use case" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {demoTestingUseCases.map((useCase) => (
                          <SelectItem key={useCase} value={useCase}>
                            {useCase}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select
                  value={accountType}
                  onValueChange={handleAccountTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ld">
                      L&D Management (5 hours free/month)
                    </SelectItem>
                    <SelectItem value="demo">
                      Demo Account (10 days trial)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : accountType === "ld" ? (
                  "Request L&D Free Trial"
                ) : (
                  "Get Demo Access"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <DialogTitle className="text-center text-xl">
                Request Submitted Successfully!
              </DialogTitle>
              <DialogDescription className="text-center">
                Your L&D free trial request has been received. We will contact
                you soon to assign an intern specialist and get you started.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  What happens next?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Admin will review your request</li>
                  <li>• An intern specialist will be assigned</li>
                  <li>• You'll receive setup instructions via email</li>
                  <li>• Process typically takes 1-2 business days</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/user-portal")}
                  className="flex-1"
                >
                  Go to Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSuccessDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
