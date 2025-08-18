
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppStore from "@/store/appStore";

const DefaultsTab = () => {
  const { defaults, updateDefaults } = useAppStore();
  
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: defaults
  });

  const onSubmit = (data: any) => {
    updateDefaults(data);
  };

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"];
  const paymentTermsOptions = ["Net 15", "Net 30", "Net 45", "Net 60", "Due on Receipt"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select onValueChange={(value) => setValue("currency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                {...register("taxRate")}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="paymentTerms">Default Payment Terms</Label>
              <Select onValueChange={(value) => setValue("paymentTerms", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                {...register("invoicePrefix")}
                placeholder="INV"
              />
            </div>
            
            <div>
              <Label htmlFor="estimatePrefix">Estimate Prefix</Label>
              <Input
                id="estimatePrefix"
                {...register("estimatePrefix")}
                placeholder="EST"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="defaultNote">Default Note for Invoices</Label>
            <Textarea
              id="defaultNote"
              {...register("defaultNote")}
              placeholder="Enter default note that will appear on invoices"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Defaults</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DefaultsTab;
