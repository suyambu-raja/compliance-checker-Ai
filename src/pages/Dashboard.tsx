import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Package,
  FileText,
  ScanLine,
  Users
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Products Scanned",
      value: "12,435",
      change: "+12%",
      icon: ScanLine,
      color: "text-primary"
    },
    {
      title: "Compliant Products",
      value: "11,892",
      change: "+8%",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      title: "Active Complaints",
      value: "47",
      change: "-15%",
      icon: FileText,
      color: "text-warning"
    },
    {
      title: "High Risk Products",
      value: "12",
      change: "-25%",
      icon: AlertTriangle,
      color: "text-error"
    }
  ];

  const recentComplaints = [
    {
      id: "C001",
      product: "Organic Face Cream 50ml",
      issue: "Missing manufacture date",
      status: "pending",
      severity: "medium",
      date: "2024-01-15"
    },
    {
      id: "C002", 
      product: "Premium Smartphone Case",
      issue: "MRP not clearly visible",
      status: "resolved",
      severity: "low",
      date: "2024-01-14"
    },
    {
      id: "C003",
      product: "Herbal Supplements 60 caps",
      issue: "Fake product suspected",
      status: "investigating",
      severity: "high",
      date: "2024-01-13"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-success text-success-foreground";
      case "pending": return "bg-warning text-warning-foreground";
      case "investigating": return "bg-error text-error-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-error text-error-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Compliance Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Monitor product compliance and manage complaints</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" className="sm:size-default">Export Report</Button>
          <Button size="sm" className="sm:size-default">Scan Product</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-success' : 'text-error'}>
                  {stat.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Compliance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Compliance Overview
            </CardTitle>
            <CardDescription>Current compliance status across all products</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fully Compliant</span>
                <span className="text-success">95.6%</span>
              </div>
              <Progress value={95.6} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Minor Issues</span>
                <span className="text-warning">3.8%</span>
              </div>
              <Progress value={3.8} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Major Violations</span>
                <span className="text-error">0.6%</span>
              </div>
              <Progress value={0.6} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Recent Complaints
            </CardTitle>
            <CardDescription>Latest compliance issues reported</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                      <span className="font-medium text-sm">{complaint.product}</span>
                      <Badge className={getSeverityColor(complaint.severity)} variant="secondary">
                        {complaint.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{complaint.issue}</p>
                    <p className="text-xs text-muted-foreground mt-1">{complaint.date}</p>
                  </div>
                  <Badge className={getStatusColor(complaint.status)} variant="secondary">
                    {complaint.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Complaints
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span>Bulk Product Upload</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}