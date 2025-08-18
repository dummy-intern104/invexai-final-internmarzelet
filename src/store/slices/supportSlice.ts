
import { StateCreator } from 'zustand';
import { Complaint, Feedback, SupportTicket } from '@/types/support';

export interface SupportState {
  complaints: Complaint[];
  feedback: Feedback[];
  tickets: SupportTicket[];
  
  // Complaint actions
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'adminNotes'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  addAdminNote: (complaintId: string, note: string, adminName: string) => void;
  
  // Feedback actions
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  
  // Ticket actions
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'responses'>) => void;
  addTicketResponse: (ticketId: string, message: string, isFromSupport: boolean, senderName: string) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
}

export const createSupportSlice: StateCreator<SupportState> = (set, get) => ({
  complaints: [],
  feedback: [],
  tickets: [],
  
  addComplaint: (complaintData) => {
    const complaint: Complaint = {
      ...complaintData,
      id: `complaint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminNotes: []
    };
    
    set((state) => ({
      complaints: [...state.complaints, complaint]
    }));
  },
  
  updateComplaintStatus: (id, status) => {
    set((state) => ({
      complaints: state.complaints.map(complaint =>
        complaint.id === id
          ? { ...complaint, status, updatedAt: new Date().toISOString() }
          : complaint
      )
    }));
  },
  
  addAdminNote: (complaintId, note, adminName) => {
    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      note,
      createdAt: new Date().toISOString(),
      adminName
    };
    
    set((state) => ({
      complaints: state.complaints.map(complaint =>
        complaint.id === complaintId
          ? { 
              ...complaint, 
              adminNotes: [...complaint.adminNotes, newNote],
              updatedAt: new Date().toISOString()
            }
          : complaint
      )
    }));
  },
  
  addFeedback: (feedbackData) => {
    const feedback: Feedback = {
      ...feedbackData,
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    set((state) => ({
      feedback: [...state.feedback, feedback]
    }));
  },
  
  addTicket: (ticketData) => {
    const ticket: SupportTicket = {
      ...ticketData,
      id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      responses: []
    };
    
    set((state) => ({
      tickets: [...state.tickets, ticket]
    }));
  },
  
  addTicketResponse: (ticketId, message, isFromSupport, senderName) => {
    const response = {
      id: `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      isFromSupport,
      createdAt: new Date().toISOString(),
      senderName
    };
    
    set((state) => ({
      tickets: state.tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, responses: [...ticket.responses, response] }
          : ticket
      )
    }));
  },
  
  updateTicketStatus: (id, status) => {
    set((state) => ({
      tickets: state.tickets.map(ticket =>
        ticket.id === id ? { ...ticket, status } : ticket
      )
    }));
  }
});
