
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Signature } from "lucide-react";
import useCompanyStore from "@/store/slices/companySlice";

const LogoTab = () => {
  const { logo, updateLogo } = useCompanyStore();
  const [logoPreview, setLogoPreview] = useState<string>(logo.logoUrl);
  const [signaturePreview, setSignaturePreview] = useState<string>(logo.signatureUrl || '');

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setLogoPreview(dataUrl);
        updateLogo({ logoUrl: dataUrl, logoFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSignaturePreview(dataUrl);
        updateLogo({ signatureUrl: dataUrl, signatureFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview('');
    updateLogo({ logoUrl: '', logoFile: undefined });
  };

  const removeSignature = () => {
    setSignaturePreview('');
    updateLogo({ signatureUrl: '', signatureFile: undefined });
  };

  return (
    <div className="space-y-6">
      {/* Company Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Upload Logo</Label>
            <div className="mt-2 flex items-center gap-4">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Company logo"
                    className="h-24 w-24 object-contain border rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div>
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a logo for your company. Recommended size: 200x200px
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Logo Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use PNG or JPG format</li>
              <li>• Maximum file size: 2MB</li>
              <li>• Square aspect ratio works best</li>
              <li>• Transparent background recommended for PNG files</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Digital Signature Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Signature className="h-5 w-5" />
            Digital Signature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Upload Signature</Label>
            <div className="mt-2 flex items-center gap-4">
              {signaturePreview ? (
                <div className="relative">
                  <img
                    src={signaturePreview}
                    alt="Digital signature"
                    className="h-16 w-32 object-contain border rounded-lg bg-white"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeSignature}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="h-16 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <Signature className="h-6 w-6 text-gray-400" />
                </div>
              )}
              
              <div>
                <input
                  type="file"
                  id="signature-upload"
                  accept="image/*"
                  onChange={handleSignatureChange}
                  className="hidden"
                />
                <Label htmlFor="signature-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>Choose Signature</span>
                  </Button>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your digital signature. Recommended size: 300x100px
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Signature Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use PNG format with transparent background</li>
              <li>• Maximum file size: 1MB</li>
              <li>• Horizontal aspect ratio works best (3:1)</li>
              <li>• Black ink on transparent background recommended</li>
              <li>• Will appear on invoices and official documents</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoTab;
