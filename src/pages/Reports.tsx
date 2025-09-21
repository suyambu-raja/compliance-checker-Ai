import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  ShoppingCart
} from "lucide-react";

export default function Reports() {
  const reports = [
    {
      title: "Monthly Compliance Report",
      description: "Comprehensive compliance analysis for the current month",
      type: "compliance",
      status: "ready",
      lastGenerated: "2024-01-20",
      format: "PDF"
    },
    {
      title: "Complaint Analysis Report",
      description: "Detailed analysis of consumer complaints and resolutions",
      type: "complaints",
      status: "generating",
      lastGenerated: "2024-01-19",
      format: "Excel"
    },
    {
      title: "Product Risk Assessment",
      description: "Risk scoring and analysis for all tracked products",
      type: "risk",
      status: "ready",
      lastGenerated: "2024-01-18",
      format: "PDF"
    },
    {
      title: "Seller Performance Report",
      description: "Performance metrics and compliance scores by seller",
      type: "seller",
      status: "ready",
      lastGenerated: "2024-01-17",
      format: "Excel"
    }
  ];

  const analytics = [
    {
      title: "Total Products Monitored",
      value: "12,435",
      change: "+8.2%",
      trend: "up",
      icon: Package
    },
    {
      title: "Compliance Rate",
      value: "92.4%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle
    },
    {
      title: "Active Complaints",
      value: "47",
      change: "-15.3%",
      trend: "down",
      icon: AlertTriangle
    },
    {
      title: "Resolved Issues",
      value: "156",
      change: "+23.5%",
      trend: "up",
      icon: FileText
    }
  ];

  const topViolations = [
    { type: "Missing manufacture date", count: 45, percentage: 32 },
    { type: "Unclear MRP display", count: 38, percentage: 27 },
    { type: "Incorrect net quantity", count: 25, percentage: 18 },
    { type: "Missing expiry date", count: 19, percentage: 13 },
    { type: "Fake product suspected", count: 14, percentage: 10 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-success text-success-foreground";
      case "generating": return "bg-warning text-warning-foreground";
      case "failed": return "bg-error text-error-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-success" : "text-error";
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Generate and view compliance reports and analytics</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="sm:size-default">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {analytics.map((metric, index) => {
          const TrendIcon = getTrendIcon(metric.trend);
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendIcon className={`h-4 w-4 mr-1 ${getTrendColor(metric.trend)}`} />
                  <span className={getTrendColor(metric.trend)}>{metric.change}</span>
                  <span className="ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="reports" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="custom" className="text-xs sm:text-sm">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {reports.map((report, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>Last generated: {report.lastGenerated}</span>
                      </div>
                      <div>Format: {report.format}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={report.status === "generating"}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={report.status === "generating"}
                    >
                      Generate New
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Compliance Violations</CardTitle>
                <CardDescription>Most common violation types this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topViolations.map((violation, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{violation.type}</div>
                        <div className="text-xs text-muted-foreground">{violation.count} occurrences</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${violation.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{violation.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Timeline</CardTitle>
                <CardDescription>Average time to resolve different issue types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Missing labels", avgTime: "2.3 days", trend: "down" },
                    { type: "MRP issues", avgTime: "1.8 days", trend: "down" },
                    { type: "Quantity issues", avgTime: "3.1 days", trend: "up" },
                    { type: "Fake products", avgTime: "7.2 days", trend: "down" },
                    { type: "Expiry dates", avgTime: "1.2 days", trend: "down" }
                  ].map((item, index) => {
                    const TrendIcon = getTrendIcon(item.trend);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.type}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{item.avgTime}</span>
                          <TrendIcon className={`h-4 w-4 ${getTrendColor(item.trend)}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance by Category</CardTitle>
                <CardDescription>Compliance rates across different product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Electronics", rate: 94, color: "bg-success" },
                    { category: "Cosmetics", rate: 88, color: "bg-warning" },
                    { category: "Food & Beverages", rate: 96, color: "bg-success" },
                    { category: "Health Supplements", rate: 85, color: "bg-warning" },
                    { category: "Clothing", rate: 92, color: "bg-success" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color}`} 
                            style={{ width: `${item.rate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{item.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Platform usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Active Users</span>
                    </div>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Products Scanned</span>
                    </div>
                    <span className="font-medium">8,956</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Reports Generated</span>
                    </div>
                    <span className="font-medium">245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Seller Accounts</span>
                    </div>
                    <span className="font-medium">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Report</CardTitle>
              <CardDescription>Generate tailored reports based on specific criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Report Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliance">Compliance Analysis</SelectItem>
                        <SelectItem value="complaints">Complaints Summary</SelectItem>
                        <SelectItem value="seller">Seller Performance</SelectItem>
                        <SelectItem value="product">Product Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time Range</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Format</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Categories</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="cosmetics">Cosmetics</SelectItem>
                        <SelectItem value="food">Food & Beverages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Severity Filter</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="high">High Only</SelectItem>
                        <SelectItem value="medium">Medium & High</SelectItem>
                        <SelectItem value="low">Low Issues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Custom Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}