import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Phone, Mail, Clock, MessageCircle, Headphones, HelpCircle, Users } from 'lucide-react';
import useAppStore from '@/store/appStore';

const CustomerCare = () => {
  const { addTicket, currentUser } = useAppStore();
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium' as const
  });
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    preferredTime: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addTicket({
        ...ticketForm,
        userId: currentUser?.id || 'anonymous',
        status: 'open'
      });
      
      toast.success('Support ticket created successfully!');
      
      setTicketForm({
        subject: '',
        description: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallbackRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!callbackForm.name.trim() || !callbackForm.phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Callback request submitted! We\'ll call you within 24 hours.');
    
    setCallbackForm({
      name: '',
      phone: '',
      preferredTime: '',
      reason: ''
    });
  };

  const faqData = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on 'Forgot Password' on the login page and following the instructions sent to your email."
    },
    {
      question: "How do I add new products to my inventory?",
      answer: "Go to the Products page and click 'Add Product'. Fill in the required details including name, category, price, and initial stock quantity."
    },
    {
      question: "Can I export my sales data?",
      answer: "Yes, you can export sales data from the Reports section. Choose your date range and click the 'Export CSV' button."
    },
    {
      question: "How do I track low stock items?",
      answer: "Navigate to Stock > Low Stock to see items that are running low. You can also set reorder levels for automatic alerts."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your data. All data is backed up regularly."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach us through multiple channels: email, phone, live chat, or by creating a support ticket through this page."
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Care</h1>
          <p className="text-muted-foreground">Get help and support for your questions and issues.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@invexai.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-muted-foreground">Sat: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <Badge variant="secondary" className="text-xs">Available 24/7</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Support Ticket */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Create Support Ticket
              </CardTitle>
              <CardDescription>
                Submit a detailed support request for technical assistance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={ticketForm.priority} onValueChange={(value: any) => setTicketForm(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed information about your issue..."
                    rows={4}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Request Callback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Request Callback
              </CardTitle>
              <CardDescription>
                Schedule a call with our support team at your convenience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCallbackRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={callbackForm.name}
                    onChange={(e) => setCallbackForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={callbackForm.phone}
                    onChange={(e) => setCallbackForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select value={callbackForm.preferredTime} onValueChange={(value) => setCallbackForm(prev => ({ ...prev, preferredTime: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                      <SelectItem value="evening">Evening (5:00 PM - 8:00 PM)</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Call</Label>
                  <Textarea
                    id="reason"
                    value={callbackForm.reason}
                    onChange={(e) => setCallbackForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Brief description of what you need help with..."
                    rows={2}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Request Callback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Support Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Support Team
            </CardTitle>
            <CardDescription>
              Meet our dedicated support team members who are here to help you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-medium">Technical Support</h4>
                <p className="text-sm text-muted-foreground">Available 24/7 for technical issues</p>
                <Badge variant="secondary">Online</Badge>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-medium">Account Support</h4>
                <p className="text-sm text-muted-foreground">Help with billing and account issues</p>
                <Badge variant="secondary">Online</Badge>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-medium">Product Support</h4>
                <p className="text-sm text-muted-foreground">Guidance on using our features</p>
                <Badge variant="outline">Busy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Find quick answers to common questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CustomerCare;
