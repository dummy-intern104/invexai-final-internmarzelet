
export interface Meeting {
  id: string;
  clientId: number;
  clientName: string;
  title: string;
  date: string;
  time: string;
  type: 'call' | 'in-person' | 'video';
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}
