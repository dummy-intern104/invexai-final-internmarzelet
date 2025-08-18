import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { KeyboardInput } from '@/components/ui/keyboard-input';
import { Trash2, Plus, Edit, Keyboard, Navigation, Info, TestTube2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface KeyboardShortcut {
  id: string;
  category: string;
  action: string;
  shortcut: string;
  description: string;
  route?: string;
  isCustom: boolean;
}

const Keywords = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<KeyboardShortcut | null>(null);
  const [newShortcut, setNewShortcut] = useState({
    category: '',
    action: '',
    shortcut: '',
    description: '',
    route: ''
  });

  // Comprehensive route mapping
  const availableRoutes = [
    { value: '/dashboard', label: 'Dashboard', category: 'Main' },
    { value: '/products', label: 'Products', category: 'Main' },
    { value: '/clients', label: 'Clients', category: 'Main' },
    { value: '/history', label: 'History', category: 'Main' },
    { value: '/payments', label: 'Payments', category: 'Main' },
    { value: '/estimates', label: 'Estimates', category: 'Main' },
    { value: '/delivery', label: 'Delivery', category: 'Main' },
    { value: '/expiry', label: 'Expiry Management', category: 'Main' },
    { value: '/keywords', label: 'Keywords', category: 'Main' },
    
    // Sales routes
    { value: '/sales/invoices', label: 'Sales Invoices', category: 'Sales' },
    { value: '/sales/invoices/new', label: 'New Invoice', category: 'Sales' },
    { value: '/sales/returns', label: 'Sales Returns', category: 'Sales' },
    
    // Purchase routes
    { value: '/purchases/orders', label: 'Purchase Orders', category: 'Purchases' },
    { value: '/purchases/list', label: 'Purchase List', category: 'Purchases' },
    { value: '/purchases/returns', label: 'Purchase Returns', category: 'Purchases' },
    { value: '/purchases/suppliers', label: 'Supplier Management', category: 'Purchases' },
    
    // Report routes
    { value: '/reports/daily-sales', label: 'Daily Sales Report', category: 'Reports' },
    { value: '/reports/monthly-sales', label: 'Monthly Sales Report', category: 'Reports' },
    { value: '/reports/yearly-sales', label: 'Yearly Sales Report', category: 'Reports' },
    { value: '/reports/stock', label: 'Stock Reports', category: 'Reports' },
    { value: '/reports/profit-loss', label: 'Profit & Loss', category: 'Reports' },
    
    // Stock routes
    { value: '/stock/in-stock', label: 'In Stock', category: 'Stock' },
    { value: '/stock/low-stock', label: 'Low Stock', category: 'Stock' },
    { value: '/stock/stock-out', label: 'Stock Out', category: 'Stock' },
    { value: '/stock/short-expiry', label: 'Short Expiry', category: 'Stock' },
    { value: '/stock/expiry', label: 'Stock Expiry', category: 'Stock' },
  ];

  // Default shortcuts
  const defaultShortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    { id: '1', category: 'Navigation', action: 'Go to item search', shortcut: 'F1', description: 'Open item search', route: '/products', isCustom: false },
    { id: '2', category: 'Navigation', action: 'Go to customer search', shortcut: 'F11', description: 'Open customer search', route: '/clients', isCustom: false },
    { id: '3', category: 'Navigation', action: 'Open New Tab', shortcut: 'Ctrl+T', description: 'Create new invoice', route: '/sales/invoices/new', isCustom: false },
    { id: '4', category: 'Navigation', action: 'Cancel & Close', shortcut: 'Ctrl+W', description: 'Go to dashboard', route: '/dashboard', isCustom: false },
    { id: '5', category: 'Navigation', action: 'Dashboard', shortcut: 'Ctrl+D', description: 'Go to dashboard', route: '/dashboard', isCustom: false },
    
    // Item Actions
    { id: '6', category: 'Item Actions', action: 'Change Quantity', shortcut: 'F2', description: 'Modify item quantity', route: '/sales/invoices/new', isCustom: false },
    { id: '7', category: 'Item Actions', action: 'Change Discount', shortcut: 'F3', description: 'Apply discount to item', route: '/sales/invoices/new', isCustom: false },
    { id: '8', category: 'Item Actions', action: 'Remove Item', shortcut: 'F4', description: 'Delete selected item', route: '/sales/invoices/new', isCustom: false },
    { id: '9', category: 'Item Actions', action: 'Change Price', shortcut: 'F5', description: 'Modify item price', route: '/sales/invoices/new', isCustom: false },
    { id: '10', category: 'Item Actions', action: 'Change Unit', shortcut: 'F6', description: 'Change item unit', route: '/sales/invoices/new', isCustom: false },
    
    // Transaction Actions
    { id: '11', category: 'Transaction Actions', action: 'Apply Bill Tax', shortcut: 'F7', description: 'Add tax to bill', route: '/sales/invoices/new', isCustom: false },
    { id: '12', category: 'Transaction Actions', action: 'Apply Additional Charges', shortcut: 'F8', description: 'Add extra charges', route: '/sales/invoices/new', isCustom: false },
    { id: '13', category: 'Transaction Actions', action: 'Apply Bill Discount', shortcut: 'F9', description: 'Apply discount to entire bill', route: '/sales/invoices/new', isCustom: false },
    { id: '14', category: 'Transaction Actions', action: 'Redeem Loyalty Points', shortcut: 'F10', description: 'Use loyalty points', route: '/sales/invoices/new', isCustom: false },
    { id: '15', category: 'Transaction Actions', action: 'Remarks', shortcut: 'F12', description: 'Add remarks to transaction', route: '/sales/invoices/new', isCustom: false },
    
    // Save Actions
    { id: '16', category: 'Save Actions', action: 'Save & Print Bill', shortcut: 'Ctrl+P', description: 'Save and print invoice', route: '/sales/invoices', isCustom: false },
    { id: '17', category: 'Save Actions', action: 'Save & New Bill', shortcut: 'Ctrl+N', description: 'Save current and create new', route: '/sales/invoices/new', isCustom: false },
    { id: '18', category: 'Save Actions', action: 'Save Bill', shortcut: 'Ctrl+S', description: 'Save current bill', route: '/sales/invoices', isCustom: false },
    
    // Payment Actions
    { id: '19', category: 'Payment Actions', action: 'Other/Credit Payments', shortcut: 'Ctrl+M', description: 'Process credit payments', route: '/payments', isCustom: false },
    
    // Other Actions
    { id: '20', category: 'Other Actions', action: 'Add Customer', shortcut: 'Alt+C', description: 'Add new customer', route: '/clients', isCustom: false },
    { id: '21', category: 'Other Actions', action: 'View History', shortcut: 'Ctrl+H', description: 'View transaction history', route: '/history', isCustom: false },
    { id: '22', category: 'Other Actions', action: 'Manage Products', shortcut: 'Alt+P', description: 'Go to products page', route: '/products', isCustom: false },
  ];

  // Fetch shortcuts from Supabase
  const { data: shortcuts = [], isLoading, refetch } = useQuery({
    queryKey: ['keyboard-shortcuts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to manage keyboard shortcuts');
        return defaultShortcuts;
      }

      const { data, error } = await supabase
        .from('keyboard_shortcuts')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching shortcuts:', error);
        // Initialize with default shortcuts if none exist
        await initializeDefaultShortcuts(user.id);
        return defaultShortcuts;
      }

      // Convert from Supabase format to component format
      const supabaseShortcuts = data?.map(item => ({
        id: item.id,
        category: getActionCategory(item.action),
        action: item.action,
        shortcut: item.shortcut_key,
        description: item.description,
        route: getRouteForAction(item.action),
        isCustom: !defaultShortcuts.some(ds => ds.action === item.action)
      })) || [];

      // If no shortcuts exist, initialize with defaults
      if (supabaseShortcuts.length === 0) {
        await initializeDefaultShortcuts(user.id);
        return defaultShortcuts;
      }

      return supabaseShortcuts;
    }
  });

  const initializeDefaultShortcuts = async (userId: string) => {
    try {
      const shortcutsToInsert = defaultShortcuts.map(shortcut => ({
        user_id: userId,
        shortcut_key: shortcut.shortcut,
        description: shortcut.description,
        action: shortcut.action,
      }));

      const { error } = await supabase
        .from('keyboard_shortcuts')
        .insert(shortcutsToInsert);

      if (error) {
        console.error('Error initializing shortcuts:', error);
      }
    } catch (error) {
      console.error('Error initializing shortcuts:', error);
    }
  };

  const getActionCategory = (action: string): string => {
    const defaultShortcut = defaultShortcuts.find(ds => ds.action === action);
    return defaultShortcut?.category || 'Custom';
  };

  const getRouteForAction = (action: string): string => {
    const defaultShortcut = defaultShortcuts.find(ds => ds.action === action);
    return defaultShortcut?.route || '';
  };

  const validateShortcut = (shortcut: string, excludeId?: string): string | null => {
    if (!shortcut.trim()) {
      return "Shortcut cannot be empty";
    }
    
    // Check for conflicts
    const conflict = shortcuts.find(s => 
      s.id !== excludeId && 
      s.shortcut.toLowerCase() === shortcut.toLowerCase()
    );
    
    if (conflict) {
      return `This shortcut conflicts with "${conflict.action}"`;
    }
    
    return null;
  };

  const handleAddShortcut = async () => {
    if (!newShortcut.category || !newShortcut.action || !newShortcut.shortcut) {
      toast.error("Please fill in all required fields");
      return;
    }

    const validationError = validateShortcut(newShortcut.shortcut);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to add keyboard shortcuts');
        return;
      }

      const { error } = await supabase
        .from('keyboard_shortcuts')
        .insert({
          user_id: user.id,
          shortcut_key: newShortcut.shortcut,
          description: newShortcut.description,
          action: newShortcut.action,
        });

      if (error) throw error;

      toast.success("Keyboard shortcut added successfully");
      setNewShortcut({ category: '', action: '', shortcut: '', description: '', route: '' });
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding shortcut:', error);
      toast.error("Failed to add keyboard shortcut");
    }
  };

  const handleEditShortcut = async () => {
    if (!editingShortcut) return;

    const validationError = validateShortcut(editingShortcut.shortcut, editingShortcut.id);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const { error } = await supabase
        .from('keyboard_shortcuts')
        .update({
          shortcut_key: editingShortcut.shortcut,
          description: editingShortcut.description,
          action: editingShortcut.action,
        })
        .eq('id', editingShortcut.id);

      if (error) throw error;

      toast.success("Keyboard shortcut updated successfully");
      setEditingShortcut(null);
      refetch();
    } catch (error) {
      console.error('Error updating shortcut:', error);
      toast.error("Failed to update keyboard shortcut");
    }
  };

  const handleDeleteShortcut = async (id: string) => {
    const shortcut = shortcuts.find(s => s.id === id);
    if (shortcut && !shortcut.isCustom) {
      toast.error("Cannot delete default shortcuts");
      return;
    }

    try {
      const { error } = await supabase
        .from('keyboard_shortcuts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Keyboard shortcut deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting shortcut:', error);
      toast.error("Failed to delete keyboard shortcut");
    }
  };

  const testShortcut = (shortcut: KeyboardShortcut) => {
    toast.success(`Testing: ${shortcut.shortcut} → ${shortcut.action}`, {
      duration: 1000,
    });
    
    if (shortcut.route) {
      setTimeout(() => {
        window.location.href = shortcut.route!;
      }, 500);
    }
  };

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));
  const routeCategories = Array.from(new Set(availableRoutes.map(r => r.category)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Keyboard className="w-8 h-8" />
            Keyboard Shortcuts
          </h1>
          <p className="text-muted-foreground">Manage and customize your keyboard shortcuts</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Shortcut
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Keyboard Shortcut</DialogTitle>
              <DialogDescription>
                Create a custom keyboard shortcut. Click in the shortcut field and press your desired key combination.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setNewShortcut({...newShortcut, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select or choose existing category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="action">Action Name *</Label>
                <Input
                  id="action"
                  value={newShortcut.action}
                  onChange={(e) => setNewShortcut({...newShortcut, action: e.target.value})}
                  placeholder="e.g., Quick Save"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="shortcut">Keyboard Shortcut *</Label>
                <KeyboardInput
                  value={newShortcut.shortcut}
                  onChange={(value) => setNewShortcut({...newShortcut, shortcut: value})}
                  placeholder="Click and press key combination"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="route">Navigation Route</Label>
                <Select onValueChange={(value) => setNewShortcut({...newShortcut, route: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page to navigate to" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {routeCategories.map(category => (
                      <React.Fragment key={category}>
                        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                          {category}
                        </div>
                        {availableRoutes
                          .filter(route => route.category === category)
                          .map(route => (
                            <SelectItem key={route.value} value={route.value}>
                              {route.label}
                            </SelectItem>
                          ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newShortcut.description}
                  onChange={(e) => setNewShortcut({...newShortcut, description: e.target.value})}
                  placeholder="Brief description of the action"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddShortcut}>
                Add Shortcut
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">How to use keyboard shortcuts</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Press the key combination shown to navigate quickly. Make sure you're not typing in any input field. 
                Click in the shortcut input field and press your desired key combination to set it automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {categories.map(category => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-xl">{category}</CardTitle>
              <CardDescription>
                {shortcuts.filter(s => s.category === category).length} shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shortcuts
                  .filter(s => s.category === category)
                  .map(shortcut => (
                    <div key={shortcut.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-mono">
                            {shortcut.shortcut}
                          </Badge>
                          <div className="flex-1">
                            <h4 className="font-medium">{shortcut.action}</h4>
                            {shortcut.description && (
                              <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                            )}
                            {shortcut.route && (
                              <div className="flex items-center gap-1 mt-1">
                                <Navigation className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-600 font-mono">{shortcut.route}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {shortcut.isCustom && (
                          <Badge variant="outline" className="text-xs">Custom</Badge>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => testShortcut(shortcut)}
                          title="Test this shortcut"
                        >
                          <TestTube2 className="w-4 h-4" />
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingShortcut(shortcut)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Edit Keyboard Shortcut</DialogTitle>
                              <DialogDescription>
                                Modify the shortcut. Click in the shortcut field and press your desired key combination.
                              </DialogDescription>
                            </DialogHeader>
                            
                            {editingShortcut && (
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Action Name</Label>
                                  <Input
                                    value={editingShortcut.action}
                                    onChange={(e) => setEditingShortcut({
                                      ...editingShortcut,
                                      action: e.target.value
                                    })}
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label>Keyboard Shortcut</Label>
                                  <KeyboardInput
                                    value={editingShortcut.shortcut}
                                    onChange={(value) => setEditingShortcut({
                                      ...editingShortcut,
                                      shortcut: value
                                    })}
                                    placeholder="Click and press key combination"
                                  />
                                </div>

                                <div className="grid gap-2">
                                  <Label>Navigation Route</Label>
                                  <Select 
                                    value={editingShortcut.route || ''} 
                                    onValueChange={(value) => setEditingShortcut({
                                      ...editingShortcut,
                                      route: value
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a page to navigate to" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60">
                                      {routeCategories.map(category => (
                                        <React.Fragment key={category}>
                                          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                                            {category}
                                          </div>
                                          {availableRoutes
                                            .filter(route => route.category === category)
                                            .map(route => (
                                              <SelectItem key={route.value} value={route.value}>
                                                {route.label}
                                              </SelectItem>
                                            ))}
                                        </React.Fragment>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label>Description</Label>
                                  <Input
                                    value={editingShortcut.description}
                                    onChange={(e) => setEditingShortcut({
                                      ...editingShortcut,
                                      description: e.target.value
                                    })}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingShortcut(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditShortcut}>
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        {shortcut.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteShortcut(shortcut.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Keywords;
