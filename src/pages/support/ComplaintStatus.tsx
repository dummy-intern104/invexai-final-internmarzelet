import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Search, Eye, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import useAppStore from '@/store/appStore';
import { Complaint } from '@/types/support';

const ComplaintStatus = () => {
  const { complaints } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Complaint Status</h1>
          <p className="text-muted-foreground">Track the status of your submitted complaints.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Complaints</CardTitle>
            <CardDescription>
              {filteredComplaints.length} complaint(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't submitted any complaints yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <Card key={complaint.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{complaint.title}</h3>
                          <Badge variant={getStatusColor(complaint.status)} className="capitalize">
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant={getPriorityColor(complaint.priority)} className="capitalize">
                            {complaint.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{complaint.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Created: {format(new Date(complaint.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Complaint Details</DialogTitle>
                            <DialogDescription>
                              Complaint ID: {selectedComplaint?.id}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedComplaint && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <div className="flex items-center gap-2 mt-1">
                                    {getStatusIcon(selectedComplaint.status)}
                                    <Badge variant={getStatusColor(selectedComplaint.status)} className="capitalize">
                                      {selectedComplaint.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Priority</label>
                                  <div className="mt-1">
                                    <Badge variant={getPriorityColor(selectedComplaint.priority)} className="capitalize">
                                      {selectedComplaint.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Title</label>
                                <p className="mt-1">{selectedComplaint.title}</p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <p className="mt-1 text-sm text-muted-foreground">{selectedComplaint.description}</p>
                              </div>
                              
                              {selectedComplaint.invoiceReference && (
                                <div>
                                  <label className="text-sm font-medium">Invoice Reference</label>
                                  <p className="mt-1 font-mono text-sm">{selectedComplaint.invoiceReference}</p>
                                </div>
                              )}
                              
                              {selectedComplaint.adminNotes.length > 0 && (
                                <div>
                                  <label className="text-sm font-medium">Admin Notes</label>
                                  <div className="mt-2 space-y-2">
                                    {selectedComplaint.adminNotes.map((note) => (
                                      <div key={note.id} className="bg-secondary/50 p-3 rounded-lg">
                                        <p className="text-sm">{note.note}</p>
                                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                          <span>By: {note.adminName}</span>
                                          <span>{format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Created: {format(new Date(selectedComplaint.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                                <span>Updated: {format(new Date(selectedComplaint.updatedAt), 'MMM dd, yyyy HH:mm')}</span>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ComplaintStatus;
