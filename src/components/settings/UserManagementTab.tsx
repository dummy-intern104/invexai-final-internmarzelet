
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'salesperson';
  permissions: {
    products: boolean;
    sales: boolean;
    purchases: boolean;
    clients: boolean;
    reports: boolean;
    settings: boolean;
  };
  isActive: boolean;
}

const UserManagementTab = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@company.com',
      role: 'admin',
      permissions: {
        products: true,
        sales: true,
        purchases: true,
        clients: true,
        reports: true,
        settings: true,
      },
      isActive: true,
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'salesperson' as 'admin' | 'manager' | 'salesperson',
    permissions: {
      products: false,
      sales: false,
      purchases: false,
      clients: false,
      reports: false,
      settings: false,
    }
  });

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      isActive: true,
    };
    
    setUsers(prev => [...prev, newUser]);
    setFormData({
      name: '',
      email: '',
      role: 'salesperson',
      permissions: {
        products: false,
        sales: false,
        purchases: false,
        clients: false,
        reports: false,
        settings: false,
      }
    });
    setIsAddDialogOpen(false);
    toast.success("User added successfully");
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    setUsers(prev => prev.map(user => 
      user.id === editingUser.id 
        ? { ...user, ...formData }
        : user
    ));
    
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'salesperson',
      permissions: {
        products: false,
        sales: false,
        purchases: false,
        clients: false,
        reports: false,
        settings: false,
      }
    });
    toast.success("User updated successfully");
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success("User deleted successfully");
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'salesperson': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value: 'admin' | 'manager' | 'salesperson') => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="salesperson">Salesperson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Module Permissions</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {Object.entries(formData.permissions).map(([module, hasPermission]) => (
                      <div key={module} className="flex items-center justify-between">
                        <Label htmlFor={module} className="capitalize">{module}</Label>
                        <Switch
                          id={module}
                          checked={hasPermission}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({
                              ...prev,
                              permissions: { ...prev.permissions, [module]: checked }
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Add User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => toggleUserStatus(user.id)}
                    />
                    <span className="text-sm">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.role === 'admin'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName">Full Name</Label>
                  <Input
                    id="editName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email Address</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="editRole">Role</Label>
                <Select value={formData.role} onValueChange={(value: 'admin' | 'manager' | 'salesperson') => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="salesperson">Salesperson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Module Permissions</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(formData.permissions).map(([module, hasPermission]) => (
                    <div key={module} className="flex items-center justify-between">
                      <Label htmlFor={`edit-${module}`} className="capitalize">{module}</Label>
                      <Switch
                        id={`edit-${module}`}
                        checked={hasPermission}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({
                            ...prev,
                            permissions: { ...prev.permissions, [module]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser}>
                  Update User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagementTab;
