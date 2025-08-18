
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Download, FileText } from "lucide-react";

const SalesGST = () => {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [calculatedGST, setCalculatedGST] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateGST = () => {
    const baseAmount = parseFloat(amount) || 0;
    const rate = parseFloat(gstRate) || 0;
    const gst = (baseAmount * rate) / 100;
    const total = baseAmount + gst;
    
    setCalculatedGST(gst);
    setTotalAmount(total);
  };

  const gstRates = [
    { rate: 0, description: "Exempt goods" },
    { rate: 5, description: "Essential items" },
    { rate: 12, description: "Standard goods" },
    { rate: 18, description: "Most goods & services" },
    { rate: 28, description: "Luxury items" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">GST Calculations</h1>
        <p className="text-muted-foreground">Calculate GST for sales transactions and generate reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              GST Calculator
            </CardTitle>
            <CardDescription>Calculate GST for your sales amounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Base Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount without GST"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Input
                id="gstRate"
                type="number"
                placeholder="Enter GST rate"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
              />
            </div>

            <Button onClick={calculateGST} className="w-full">
              Calculate GST
            </Button>

            {calculatedGST > 0 && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>₹{parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({gstRate}%):</span>
                    <span>₹{calculatedGST.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Standard GST Rates</CardTitle>
            <CardDescription>Common GST rates for different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rate</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gstRates.map((rate) => (
                  <TableRow key={rate.rate}>
                    <TableCell className="font-medium">{rate.rate}%</TableCell>
                    <TableCell>{rate.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GST Reports</CardTitle>
          <CardDescription>Generate GST reports for your sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download GSTR-1
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Sales Register
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              GST Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesGST;
