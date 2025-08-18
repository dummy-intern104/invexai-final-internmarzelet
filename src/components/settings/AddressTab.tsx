
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppStore from "@/store/appStore";

const AddressTab = () => {
  const { address, updateAddress } = useAppStore();
  
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: address
  });

  const watchedCountry = watch("country");

  const onSubmit = (data: any) => {
    updateAddress(data);
  };

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "India",
    "Other"
  ];

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                {...register("street")}
                placeholder="Enter street address"
              />
            </div>
            
            <div>
              <Label htmlFor="aptSuite">Apt/Suite (Optional)</Label>
              <Input
                id="aptSuite"
                {...register("aptSuite")}
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <Label htmlFor="state">State/Province</Label>
                {watchedCountry === "United States" ? (
                  <Select onValueChange={(value) => setValue("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="state"
                    {...register("state")}
                    placeholder="Enter state/province"
                  />
                )}
              </div>
              
              <div>
                <Label htmlFor="postalCode">
                  {watchedCountry === "United States" ? "ZIP Code" : "Postal Code"}
                </Label>
                <Input
                  id="postalCode"
                  {...register("postalCode")}
                  placeholder={watchedCountry === "United States" ? "Enter ZIP code" : "Enter postal code"}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Select onValueChange={(value) => setValue("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressTab;
