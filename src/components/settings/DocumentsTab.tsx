
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAppStore from "@/store/appStore";

const DocumentsTab = () => {
  const { documents, updateDocuments } = useAppStore();
  
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: documents
  });

  const onSubmit = (data: any) => {
    updateDocuments(data);
  };

  const templateOptions = ["Standard", "Modern", "Classic", "Minimal"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="invoiceTemplate">Invoice Template</Label>
              <Select onValueChange={(value) => setValue("invoiceTemplate", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templateOptions.map((template) => (
                    <SelectItem key={template} value={template.toLowerCase()}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="estimateTemplate">Estimate Template</Label>
              <Select onValueChange={(value) => setValue("estimateTemplate", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templateOptions.map((template) => (
                    <SelectItem key={template} value={template.toLowerCase()}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
            <Textarea
              id="termsAndConditions"
              {...register("termsAndConditions")}
              placeholder="Enter your terms and conditions"
              rows={5}
            />
          </div>
          
          <div>
            <Label htmlFor="footerText">Footer Text</Label>
            <Textarea
              id="footerText"
              {...register("footerText")}
              placeholder="Enter footer text for documents"
              rows={2}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Document Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
