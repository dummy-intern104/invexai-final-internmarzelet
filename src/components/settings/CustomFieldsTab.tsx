
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useAppStore from "@/store/appStore";

const CustomFieldsTab = () => {
  const { customFields, addCustomField, updateCustomField, removeCustomField } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'text' as 'text' | 'number' | 'date' | 'dropdown',
    required: false,
    options: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'text',
      required: false,
      options: []
    });
    setEditingField(null);
  };

  const handleSubmit = () => {
    if (editingField) {
      updateCustomField(editingField.id, formData);
    } else {
      addCustomField(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (field: any) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      type: field.type,
      required: field.required,
      options: field.options || []
    });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Custom Fields</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingField ? 'Edit Custom Field' : 'Add Custom Field'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="field-name">Field Name</Label>
                <Input
                  id="field-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter field name"
                />
              </div>
              
              <div>
                <Label htmlFor="field-type">Field Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.type === 'dropdown' && (
                <div>
                  <Label>Dropdown Options</Label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index] = e.target.value;
                            setFormData({ ...formData, options: newOptions });
                          }}
                          placeholder="Option value"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newOptions = formData.options.filter((_, i) => i !== index);
                            setFormData({ ...formData, options: newOptions });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, options: [...formData.options, ''] })}
                    >
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
                />
                <Label htmlFor="required">Required Field</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingField ? 'Update' : 'Add'} Field
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {customFields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No custom fields created yet. Add your first custom field to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{field.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {field.required ? (
                      <Badge variant="destructive">Required</Badge>
                    ) : (
                      <Badge variant="outline">Optional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(field)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeCustomField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomFieldsTab;
