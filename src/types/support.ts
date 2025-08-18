
export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'billing' | 'product' | 'service' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  invoiceReference?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  adminNotes: AdminNote[];
}

export interface AdminNote {
  id: string;
  note: string;
  createdAt: string;
  adminName: string;
}

export interface Feedback {
  id: string;
  category: 'suggestion' | 'bug_report' | 'feature_request' | 'general';
  title: string;
  description: string;
  rating: {
    usability: number;
    service: number;
    overall: number;
  };
  isAnonymous: boolean;
  createdAt: string;
  userId?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  userId: string;
  responses: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  message: string;
  isFromSupport: boolean;
  createdAt: string;
  senderName: string;
}
