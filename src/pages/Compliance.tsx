import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Package,
  Factory,
  Calendar,
  DollarSign
} from "lucide-react";

export default function Compliance() {
  const complianceCategories = [
    {
      name: "Labeling Requirements",
      score: 92,
      total: 1250,
      compliant: 1150,
      issues: 100,
      status: "good"
    },
    {
      name: "Pricing & MRP",
      score: 88,
      total: 1250,
      compliant: 1100,
      issues: 150,
      status: "good"
    },
    {
      name: "Net Quantity",
      score: 95,
      total: 1250,
      compliant: 1188,
      issues: 62,
      status: "excellent"
    },
    {
      name: "Manufacturing Info",
      score: 89,
      total: 1250,
      compliant: 1113,
      issues: 137,
      status: "good"
    },
    {
      name: "Expiry Dates",
      score: 97,
      total: 1250,
      compliant: 1213,
      issues: 37,
      status: "excellent"
    }
  ];

  const recentViolations = [
    {
      productId: "P12345",
      productName: "Organic Face Wash 150ml",
      violation: "Missing manufacture date",
      severity: "medium",
      seller: "BeautyCare Store",
      detectedDate: "2024-01-15",
      status: "pending"
    },
    {
      productId: "P12346",
      productName: "Herbal Tea Bags 25ct",
      violation: "Unclear MRP display",
      severity: "low",
      seller: "Herbal Solutions",
      detectedDate: "2024-01-14",
      status: "notified"
    },
    {
      productId: "P12347",
      productName: "Protein Powder 1kg",
      violation: "Incorrect net quantity",
      severity: "high",
      seller: "FitnessWorld",
      detectedDate: "2024-01-13",
      status: "investigating"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-success";
    if (score >= 85) return "text-warning";
    return "text-error";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-success text-success-foreground";
      case "good": return "bg-primary text-primary-foreground";
      case "needs-improvement": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getViolationSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-error text-error-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getViolationStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-success text-success-foreground";
      case "investigating": return "bg-primary text-primary-foreground";
      case "notified": return "bg-warning text-warning-foreground";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Compliance Monitoring</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Track product compliance across different categories</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" className="sm:size-default">Export Report</Button>
          <Button size="sm" className="sm:size-default">Run Compliance Check</Button>
        </div>
      </div>

      {/* Overall Compliance Score */}
      <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Overall Compliance Score</h2>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-3xl sm:text-4xl font-bold text-success">92%</div>
                <div className="text-muted-foreground text-sm sm:text-base">
                  <div>1,150 of 1,250 products compliant</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1 text-success" />
                    <span className="text-success">+3% from last month</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row lg:flex-col xl:flex-row space-x-6 sm:space-x-8 lg:space-x-0 lg:space-y-4 xl:space-y-0 xl:space-x-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-success">1,150</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-warning">75</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Minor Issues</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-error">25</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Major Issues</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories" className="text-xs sm:text-sm">Categories</TabsTrigger>
          <TabsTrigger value="violations" className="text-xs sm:text-sm">Violations</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {complianceCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge className={getStatusColor(category.status)}>
                      {category.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {category.compliant} of {category.total} products compliant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        <span className={getScoreColor(category.score)}>
                          {category.score}%
                        </span>
                      </span>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{category.issues} issues found</div>
                      </div>
                    </div>
                    <Progress value={category.score} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>{category.compliant} Compliant</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span>{category.issues} Issues</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="violations">
          <Card>
            <CardHeader>
              <CardTitle>Recent Compliance Violations</CardTitle>
              <CardDescription>Products flagged for compliance issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentViolations.map((violation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{violation.productName}</span>
                        <Badge className={getViolationSeverityColor(violation.severity)} variant="secondary">
                          {violation.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{violation.violation}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Seller: {violation.seller}</span>
                        <span>ID: {violation.productId}</span>
                        <span>Detected: {violation.detectedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getViolationStatusColor(violation.status)} variant="secondary">
                        {violation.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Trends</CardTitle>
                <CardDescription>Monthly compliance performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["January", "February", "March", "April"].map((month, index) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={88 + index * 2} className="w-24 h-2" />
                        <span className="text-sm font-medium">{88 + index * 2}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Violation Categories</CardTitle>
                <CardDescription>Most common compliance issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Missing Labels", count: 45, percentage: 35 },
                    { category: "MRP Issues", count: 38, percentage: 30 },
                    { category: "Net Quantity", count: 25, percentage: 20 },
                    { category: "Expiry Dates", count: 19, percentage: 15 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="text-xs text-muted-foreground">{item.count} violations</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.percentage} className="w-16 h-2" />
                        <span className="text-sm">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}