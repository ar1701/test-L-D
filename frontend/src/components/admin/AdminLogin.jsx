import React, { useState } from "react";
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
import { Shield } from "lucide-react";

// Mock users for demo
const mockUsers = [
  {
    id: "admin1",
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin User",
  },
  {
    id: "intern1",
    username: "intern_001",
    password: "temp123",
    role: "intern",
    name: "John Smith",
  },
  {
    id: "intern2",
    username: "intern_002",
    password: "temp456",
    role: "intern",
    name: "Sarah Johnson",
  },
  {
    id: "intern3",
    username: "intern_003",
    password: "temp789",
    role: "intern",
    name: "Mike Davis",
  },
];

export function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = mockUsers.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (user) {
      onLogin({ role: user.role, name: user.name, id: user.id });
    } else {
      alert("Invalid credentials. Try admin/admin123 or intern_001/temp123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Multi-Tenant Login</CardTitle>
          <CardDescription>Access the L&D management platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p className="font-semibold">Demo Credentials:</p>
            <p>Admin: admin / admin123</p>
            <p>Intern: intern_001 / temp123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
