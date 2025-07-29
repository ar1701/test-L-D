import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, Users, Shield, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              LearnDemo Pro
            </span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/user-portal/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              to="/user-portal/register"
              className="text-gray-600 hover:text-gray-900"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Now with Demo Account Management
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Complete L&D Management
            <span className="text-blue-600"> & Demo Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your Learning & Development programs and manage demo
            accounts with ease. Get 5 hours free monthly for L&D, plus 10-day
            demo access for prospects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/user-portal/register?type=ld">
              <Button size="lg" className="px-8">
                Start L&D Free Trial
              </Button>
            </Link>
            <Link to="/user-portal/register?type=demo">
              <Button
                size="lg"
                variant="outline"
                className="px-8 bg-transparent"
              >
                Get Demo Access
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Two Powerful Solutions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* L&D Management */}
            <Card className="p-6">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl">L&D Management</CardTitle>
                </div>
                <CardDescription>
                  Complete learning and development platform for your
                  organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span>5 hours free monthly usage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Full access to L&D tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span>Demo credentials for testing</span>
                </div>
                <Link to="/user-portal/register?type=ld">
                  <Button className="w-full mt-4">Register for L&D</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Demo Account */}
            <Card className="p-6">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <CardTitle className="text-2xl">Demo Account</CardTitle>
                </div>
                <CardDescription>
                  10-day trial access to explore our platform capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>10 days validity period</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Instant demo credentials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span>Full platform exploration</span>
                </div>
                <Link to="/user-portal/register?type=demo">
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                  >
                    Get Demo Access
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LD</span>
            </div>
            <span className="text-xl font-bold">LearnDemo Pro</span>
          </div>
          <p className="text-gray-400">
            © 2024 LearnDemo Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
