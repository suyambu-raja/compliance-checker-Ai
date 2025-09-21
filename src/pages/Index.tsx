import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ScanLine,
  FileText,
  BarChart3,
  CheckCircle,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Play
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: ScanLine,
      title: "QR/Barcode Scanning",
      description: "Instantly scan products to retrieve compliance information and verify authenticity.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "AI Compliance Checking",
      description: "Automated verification of packaging declarations including MRP, manufacturer info, and quantities.",
      color: "text-success"
    },
    {
      icon: FileText,
      title: "Complaint Management",
      description: "Streamlined system for filing, tracking, and resolving product compliance complaints.",
      color: "text-warning"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Comprehensive dashboards and reports for monitoring compliance trends and performance.",
      color: "text-error"
    }
  ];

  const stats = [
    { label: "Products Monitored", value: "12,435", icon: ScanLine },
    { label: "Compliance Rate", value: "92.4%", icon: CheckCircle },
    { label: "Active Users", value: "1,234", icon: Users },
    { label: "Issues Resolved", value: "156", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">ComplianceCheck</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link to="/scanner">
                <Button>
                  <ScanLine className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            AI-Powered Compliance Solution
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Automated Compliance & Complaint Checker
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Protect consumers and ensure e-commerce compliance with our AI-powered solution that automatically checks product declarations, handles complaints, and provides real-time alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="h-12 px-8 w-full sm:w-auto">
                <Play className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link to="/scanner" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-12 px-8 w-full sm:w-auto">
                <ScanLine className="h-5 w-5 mr-2" />
                Try Scanner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Comprehensive Compliance Solution</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to ensure product compliance and manage consumer complaints in one integrated platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg bg-muted ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="p-0 h-auto font-medium text-primary">
                    Learn more
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <AlertTriangle className="h-12 sm:h-16 w-12 sm:w-16 text-warning mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Protect Your Customers Today
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Join thousands of e-commerce platforms using our compliance solution to ensure product safety and build consumer trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="h-12 px-8 w-full sm:w-auto">
                Access Dashboard
              </Button>
            </Link>
            <Link to="/complaints" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-12 px-8 w-full sm:w-auto">
                View Complaints
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">ComplianceCheck</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              Ensuring e-commerce compliance and consumer protection through advanced AI technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
