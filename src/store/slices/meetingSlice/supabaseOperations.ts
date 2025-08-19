
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export const createSupabaseMeetingOperations = (set: any, get: any) => ({
  setMeetings: (meetings: any[]) => {
    set({ meetings });
  },

  addMeeting: async (meetingData: any) => {
    try {
      const newMeeting = await supabaseService.meetings.create({
        client_id: meetingData.client_id,
        title: meetingData.title,
        date: meetingData.date,
        time: meetingData.time,
        type: meetingData.type,
        status: meetingData.status || 'scheduled',
        notes: meetingData.notes,
        client_name: meetingData.client_name
      });

      set((state: any) => ({
        meetings: [newMeeting, ...state.meetings]
      }));

      toast.success('Meeting scheduled successfully');
      return newMeeting;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast.error('Failed to schedule meeting');
      throw error;
    }
  },

  updateMeetingStatus: async (meetingId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      const updatedMeeting = await supabaseService.meetings.update(meetingId, { status });
      set((state: any) => ({
        meetings: state.meetings.map((meeting: any) =>
          meeting.id === meetingId ? updatedMeeting : meeting
        )
      }));
      toast.success('Meeting status updated');
    } catch (error) {
      console.error('Error updating meeting status:', error);
      toast.error('Failed to update meeting status');
      throw error;
    }
  },

  deleteMeeting: async (meetingId: string) => {
    try {
      await supabaseService.meetings.delete(meetingId);
      set((state: any) => ({
        meetings: state.meetings.filter((meeting: any) => meeting.id !== meetingId)
      }));
      toast.success('Meeting deleted successfully');
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error('Failed to delete meeting');
      throw error;
    }
  },

  loadMeetings: async () => {
    try {
      const meetings = await supabaseService.meetings.getAll();
      set({ meetings });
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error('Failed to load meetings');
    }
  },

  getMeetingsByClient: (clientId: number) => {
    const state = get();
    return state.meetings.filter((meeting: any) => meeting.client_id === clientId);
  },

  getTotalMeetings: () => {
    const state = get();
    return state.meetings.length;
  }
});
