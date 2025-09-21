import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Upload,
  Search,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  DollarSign,
  Factory
} from "lucide-react";

export default function Scanner() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Mock scan result
  const mockScanResult = {
    productId: "P123456789",
    name: "Organic Face Cream - Natural Glow",
    brand: "NatureCare",
    barcode: "8901234567890",
    mrp: "₹899",
    netQuantity: "50ml",
    manufactureDate: "2024-01-15",
    expiryDate: "2025-01-15",
    manufacturer: "NatureCare Pvt Ltd, Mumbai",
    compliance: {
      overall: "compliant",
      mrpVisible: true,
      manufacturerInfo: true,
      netQuantityVisible: true,
      expiryDatePresent: true,
      packagingIntegrity: true
    },
    riskScore: 15, // out of 100
    lastVerified: "2024-01-20"
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setScanResult(mockScanResult);
      setIsScanning(false);
    }, 2000);
  };

  const handleManualEntry = () => {
    setScanResult(mockScanResult);
  };

  const getComplianceStatus = (status: string) => {
    switch (status) {
      case "compliant":
        return { color: "bg-success text-success-foreground", icon: CheckCircle, text: "Compliant" };
      case "warning":
        return { color: "bg-warning text-warning-foreground", icon: AlertTriangle, text: "Warning" };
      case "non-compliant":
        return { color: "bg-error text-error-foreground", icon: XCircle, text: "Non-Compliant" };
      default:
        return { color: "bg-muted text-muted-foreground", icon: Package, text: "Unknown" };
    }
  };

  const complianceStatus = scanResult ? getComplianceStatus(scanResult.compliance.overall) : null;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Product Scanner</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Scan or search products to check compliance status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Scanner Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Product</CardTitle>
            <CardDescription>Use camera or upload image to scan product barcode/QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="camera">Camera</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
              </TabsList>
              
              <TabsContent value="camera" className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-8 text-center">
                  <Camera className="h-10 sm:h-12 w-10 sm:w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">Position product barcode/QR code in camera frame</p>
                  <Button 
                    onClick={handleScan} 
                    disabled={isScanning}
                    className="w-full"
                    size="sm"
                  >
                    {isScanning ? "Scanning..." : "Start Camera Scan"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-8 text-center">
                  <Upload className="h-10 sm:h-12 w-10 sm:w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">Upload image containing barcode/QR code</p>
                  <Button variant="outline" className="w-full" size="sm">
                    Choose Image
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="barcode">Barcode/Product ID</Label>
                    <Input id="barcode" placeholder="Enter barcode or product ID" />
                  </div>
                  <Button onClick={handleManualEntry} className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search Product
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Scan Results */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>Product details and compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            {!scanResult ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No product scanned yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{scanResult.name}</h3>
                  <p className="text-muted-foreground">{scanResult.brand}</p>
                  <div className="flex items-center space-x-2">
                    {complianceStatus && (
                      <Badge className={complianceStatus.color}>
                        <complianceStatus.icon className="h-3 w-3 mr-1" />
                        {complianceStatus.text}
                      </Badge>
                    )}
                    <Badge variant="outline">Risk Score: {scanResult.riskScore}/100</Badge>
                  </div>
                </div>

                <Separator />

                {/* Product Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">MRP:</span>
                    <span className="font-medium">{scanResult.mrp}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{scanResult.netQuantity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Mfg Date:</span>
                    <span className="font-medium">{scanResult.manufactureDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Exp Date:</span>
                    <span className="font-medium">{scanResult.expiryDate}</span>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Factory className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Manufacturer:</span>
                  </div>
                  <p className="text-sm">{scanResult.manufacturer}</p>
                </div>

                <Separator />

                {/* Compliance Checklist */}
                <div>
                  <h4 className="font-medium mb-3">Compliance Checklist</h4>
                  <div className="space-y-2">
                    {Object.entries(scanResult.compliance).filter(([key]) => key !== 'overall').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {value ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-error" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <Button variant="destructive" size="sm" className="flex-1">
                    Report Issue
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>Your recent product scans and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Product Scan #{i}</p>
                    <p className="text-sm text-muted-foreground">Scanned 2 hours ago</p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Compliant
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}