import { useSearchParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Copy, CheckCircle, Clock, Shield, Calendar } from "lucide-react";

export default function RegisterSuccessPage() {
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState({ username: false, password: false });

  // Memoize the credentials to prevent infinite re-renders
  const credentials = useMemo(() => {
    return {
      username: searchParams.get("username") || "",
      password: searchParams.get("password") || "",
      type: searchParams.get("type") || "ld",
      message: searchParams.get("message") || "",
      expires_at: searchParams.get("expires_at") || "",
    };
  }, [searchParams]);

  const copyToClipboard = async (text, field) => {
    await navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [field]: false }));
    }, 2000);
  };

  const startDate = new Date();
  const endDate = credentials.expires_at
    ? new Date(credentials.expires_at)
    : new Date();
  if (credentials.type === "demo" && !credentials.expires_at) {
    endDate.setDate(startDate.getDate() + 10);
  } else if (credentials.type === "ld") {
    endDate.setMonth(startDate.getMonth() + 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-800">
              Registration Successful!
            </CardTitle>
            <CardDescription className="text-lg">
              {credentials.type === "ld"
                ? "Your free trial request has been submitted successfully!"
                : "Your Demo account has been created"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Type Badge */}
            <div className="flex justify-center">
              {credentials.type === "ld" ? (
                <Badge variant="secondary" className="px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  L&D Free Trial Request
                </Badge>
              ) : (
                <Badge variant="outline" className="px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Demo Account
                </Badge>
              )}
            </div>

            {/* L&D Message or Demo Credentials */}
            {credentials.type === "ld" ? (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  What's Next?
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="font-medium">
                    {credentials.message ||
                      "Your request has been submitted successfully!"}
                  </p>
                  <div className="space-y-2">
                    <p>• An admin will review your request</p>
                    <p>• An intern specialist will be assigned to assist you</p>
                    <p>• You'll receive an email with further instructions</p>
                    <p>• Setup process typically takes 1-2 business days</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Your Demo Credentials
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Username
                      </Label>
                      <p className="font-mono text-lg">
                        {credentials.username}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(credentials.username, "username")
                      }
                    >
                      {copied.username ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Password
                      </Label>
                      <p className="font-mono text-lg">
                        {credentials.password}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(credentials.password, "password")
                      }
                    >
                      {copied.password ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Details - only show for demo accounts */}
            {credentials.type === "demo" && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Start Date
                    </Label>
                    <p className="text-lg">{startDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      End Date
                    </Label>
                    <p className="text-lg">{endDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Validity
                    </Label>
                    <p className="text-lg">10 days</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Status
                    </Label>
                    <Badge variant="outline">Demo Active</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center">
              <Link to="/" className="w-full max-w-sm">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Go to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
