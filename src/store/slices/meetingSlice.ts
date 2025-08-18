
import { Meeting } from '@/types/meeting';

export interface MeetingState {
  meetings: Meeting[];
  setMeetings: (meetings: Meeting[]) => void;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void;
  updateMeetingStatus: (id: string, status: 'scheduled' | 'completed' | 'cancelled') => void;
  deleteMeeting: (id: string) => void;
  getMeetingsByClient: (clientId: number) => Meeting[];
  getTotalMeetings: () => number;
}

export const createMeetingSlice = (set: any, get: any): MeetingState => ({
  meetings: [],
  
  setMeetings: (meetings: Meeting[]) => {
    set({ meetings });
  },
  
  addMeeting: (meetingData: Omit<Meeting, 'id' | 'createdAt'>) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    set((state: any) => ({
      meetings: [newMeeting, ...state.meetings]
    }));
  },
  
  updateMeetingStatus: (id: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    set((state: any) => ({
      meetings: state.meetings.map((meeting: Meeting) =>
        meeting.id === id ? { ...meeting, status } : meeting
      )
    }));
  },
  
  deleteMeeting: (id: string) => {
    set((state: any) => ({
      meetings: state.meetings.filter((meeting: Meeting) => meeting.id !== id)
    }));
  },
  
  getMeetingsByClient: (clientId: number) => {
    const state = get();
    return state.meetings.filter((meeting: Meeting) => meeting.clientId === clientId);
  },
  
  getTotalMeetings: () => {
    const state = get();
    return state.meetings.length;
  }
});
