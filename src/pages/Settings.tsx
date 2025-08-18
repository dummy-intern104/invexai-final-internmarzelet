
import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailsTab from "@/components/settings/DetailsTab";
import AddressTab from "@/components/settings/AddressTab";
import LogoTab from "@/components/settings/LogoTab";
import DefaultsTab from "@/components/settings/DefaultsTab";
import DocumentsTab from "@/components/settings/DocumentsTab";
import CustomFieldsTab from "@/components/settings/CustomFieldsTab";
import UserManagementTab from "@/components/settings/UserManagementTab";
import ChangePasswordTab from "@/components/settings/ChangePasswordTab";

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your company settings and preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Company Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="defaults">Defaults</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
              <TabsTrigger value="user-management">Users</TabsTrigger>
              <TabsTrigger value="change-password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <DetailsTab />
            </TabsContent>
            
            <TabsContent value="address" className="mt-6">
              <AddressTab />
            </TabsContent>
            
            <TabsContent value="logo" className="mt-6">
              <LogoTab />
            </TabsContent>
            
            <TabsContent value="defaults" className="mt-6">
              <DefaultsTab />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <DocumentsTab />
            </TabsContent>
            
            <TabsContent value="custom-fields" className="mt-6">
              <CustomFieldsTab />
            </TabsContent>
            
            <TabsContent value="user-management" className="mt-6">
              <UserManagementTab />
            </TabsContent>
            
            <TabsContent value="change-password" className="mt-6">
              <ChangePasswordTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
