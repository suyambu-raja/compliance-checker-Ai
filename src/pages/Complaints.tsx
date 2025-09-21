import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare
} from "lucide-react";

export default function Complaints() {
  const [newComplaint, setNewComplaint] = useState({
    productName: "",
    issue: "",
    description: "",
    severity: "",
    category: ""
  });

  const complaints = [
    {
      id: "C001",
      productName: "Organic Face Cream 50ml",
      issue: "Missing manufacture date",
      description: "The product packaging does not show any manufacture date, which is mandatory under legal metrology act.",
      status: "pending",
      severity: "medium",
      category: "labeling",
      date: "2024-01-15",
      assignedTo: "John Doe",
      responses: 2
    },
    {
      id: "C002",
      productName: "Premium Smartphone Case",
      issue: "MRP not clearly visible",
      description: "The MRP is printed in very small font and is barely readable.",
      status: "resolved",
      severity: "low",
      category: "pricing",
      date: "2024-01-14",
      assignedTo: "Jane Smith",
      responses: 5
    },
    {
      id: "C003",
      productName: "Herbal Supplements 60 caps",
      issue: "Suspected fake product",
      description: "Product appears to be counterfeit based on packaging quality and seller history.",
      status: "investigating",
      severity: "high",
      category: "authenticity",
      date: "2024-01-13",
      assignedTo: "Mike Johnson",
      responses: 8
    },
    {
      id: "C004",
      productName: "Organic Honey 250g",
      issue: "Incorrect net quantity",
      description: "Actual weight is 230g but packaging claims 250g.",
      status: "pending",
      severity: "high",
      category: "quantity",
      date: "2024-01-12",
      assignedTo: "Sarah Wilson",
      responses: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-success text-success-foreground";
      case "pending": return "bg-warning text-warning-foreground";
      case "investigating": return "bg-primary text-primary-foreground";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return CheckCircle;
      case "investigating": return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Complaints Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Track and manage product compliance complaints</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="sm:size-default w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              File Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle>File New Complaint</DialogTitle>
              <DialogDescription>
                Report a product compliance issue or concern.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product">Product Name</Label>
                <Input 
                  id="product"
                  placeholder="Enter product name"
                  value={newComplaint.productName}
                  onChange={(e) => setNewComplaint({...newComplaint, productName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="issue">Issue Summary</Label>
                <Input 
                  id="issue"
                  placeholder="Brief description of the issue"
                  value={newComplaint.issue}
                  onChange={(e) => setNewComplaint({...newComplaint, issue: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={newComplaint.severity} onValueChange={(value) => setNewComplaint({...newComplaint, severity: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newComplaint.category} onValueChange={(value) => setNewComplaint({...newComplaint, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="labeling">Labeling</SelectItem>
                      <SelectItem value="pricing">Pricing</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                      <SelectItem value="authenticity">Authenticity</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Provide detailed information about the compliance issue"
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Submit Complaint</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search complaints..." className="pl-8" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="sm:size-default">
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">More Filters</span>
                <span className="sm:hidden">Filters</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.map((complaint) => {
          const StatusIcon = getStatusIcon(complaint.status);
          return (
            <Card key={complaint.id}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-medium text-sm text-muted-foreground">#{complaint.id}</span>
                      <Badge className={getSeverityColor(complaint.severity)} variant="secondary">
                        {complaint.severity}
                      </Badge>
                      <Badge className={getStatusColor(complaint.status)} variant="secondary">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {complaint.status}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">{complaint.issue}</h3>
                    <p className="text-sm text-primary mb-2">{complaint.productName}</p>
                    <p className="text-sm text-muted-foreground mb-3">{complaint.description}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{complaint.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Assigned to: {complaint.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{complaint.responses} responses</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Total Complaints</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">23</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">Under Investigation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">12</div>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}