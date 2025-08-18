
import React, { useState } from "react";
import { Calendar, Clock, Phone, Video, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Meeting } from "@/types/meeting";
import useAppStore from "@/store/appStore";

interface MeetingListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: number;
  clientName?: string;
}

export function MeetingListDialog({
  open,
  onOpenChange,
  clientId,
  clientName
}: MeetingListDialogProps) {
  const { meetings, getMeetingsByClient, updateMeetingStatus, deleteMeeting } = useAppStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get meetings based on whether we're filtering by client or showing all
  const displayMeetings = clientId 
    ? getMeetingsByClient(clientId)
    : meetings;

  // Pagination logic
  const totalPages = Math.ceil(displayMeetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMeetings = displayMeetings.slice(startIndex, endIndex);

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'scheduled':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'scheduled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const handleStatusUpdate = (meetingId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    updateMeetingStatus(meetingId, newStatus);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    deleteMeeting(meetingId);
  };

  const formatDateTime = (date: string, time: string) => {
    const meetingDate = new Date(`${date}T${time}`);
    return meetingDate.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {clientName ? `Meetings with ${clientName}` : 'All Meetings'}
            <Badge variant="outline" className="ml-2">
              {displayMeetings.length} total
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {currentMeetings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No meetings found</h3>
              <p className="text-muted-foreground">
                {clientName ? `No meetings scheduled with ${clientName}` : 'No meetings have been scheduled yet'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">S.No</TableHead>
                    <TableHead>Title</TableHead>
                    {!clientName && <TableHead>Client</TableHead>}
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMeetings.map((meeting, index) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{meeting.title}</TableCell>
                      {!clientName && <TableCell>{meeting.clientName}</TableCell>}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {formatDateTime(meeting.date, meeting.time)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMeetingTypeIcon(meeting.type)}
                          <span className="capitalize">{meeting.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(meeting.status)}
                          <Badge variant={getStatusVariant(meeting.status)}>
                            {meeting.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {meeting.notes || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {meeting.status === 'scheduled' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(meeting.id, 'completed')}
                              >
                                Complete
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(meeting.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMeeting(meeting.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
