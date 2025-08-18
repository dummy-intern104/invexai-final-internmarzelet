import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import useAppStore from '@/store/appStore';

const ComplaintRaise = () => {
  const { addComplaint, sales, currentUser } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as const,
    priority: 'medium' as const,
    invoiceReference: ''
  });
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("COMPLAINT RAISE: Submitting complaint with immediate save:", formData.title);
      
      await addComplaint({
        ...formData,
        attachments,
        userId: currentUser?.id || 'anonymous',
        status: 'open'
      });
      
      toast.success('Complaint submitted and saved successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        invoiceReference: ''
      });
      setAttachments([]);
    } catch (error) {
      console.error("COMPLAINT RAISE: Error submitting complaint:", error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setAttachments(prev => [...prev, ...fileNames]);
      toast.success(`${files.length} file(s) attached successfully`);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Raise a Complaint</h1>
          <p className="text-muted-foreground">Submit your issue or complaint and we'll get back to you soon.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Complaint Details
            </CardTitle>
            <CardDescription>
              Provide detailed information about your issue to help us resolve it quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Complaint Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the issue"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoiceReference">Invoice Reference (Optional)</Label>
                  <Select value={formData.invoiceReference} onValueChange={(value) => setFormData(prev => ({ ...prev, invoiceReference: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select related invoice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No invoice reference</SelectItem>
                      {sales.slice(0, 10).map((sale) => (
                        <SelectItem key={sale.sale_id} value={sale.sale_id.toString()}>
                          Invoice #{sale.sale_id} - ₹{(sale.selling_price * sale.quantity_sold).toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about your complaint..."
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('attachments')?.click()}
                    className="flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Files
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Screenshots, invoices, or documents (max 5MB each)
                  </span>
                </div>
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                        <FileText className="w-3 h-3" />
                        {file}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ComplaintRaise;
