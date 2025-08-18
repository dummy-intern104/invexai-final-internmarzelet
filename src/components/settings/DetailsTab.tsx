
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppStore from "@/store/appStore";

const DetailsTab = () => {
  const { details, updateDetails } = useAppStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: details
  });

  const onSubmit = (data: any) => {
    updateDetails(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                {...register("companyName", { required: "Company name is required" })}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-sm text-destructive mt-1">
                  {typeof errors.companyName.message === 'string' ? errors.companyName.message : 'Company name is required'}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                {...register("registrationNumber")}
                placeholder="Enter registration number"
              />
            </div>
            
            <div>
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input
                id="taxId"
                {...register("taxId")}
                placeholder="Enter tax ID or EIN"
              />
            </div>
            
            <div>
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                {...register("gstin")}
                placeholder="Enter GSTIN number"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Details</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DetailsTab;
