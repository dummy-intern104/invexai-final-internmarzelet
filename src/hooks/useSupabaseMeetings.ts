
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface SupabaseMeeting {
  id: string;
  user_id: string;
  client_id?: string;
  title: string;
  date: string;
  time: string;
  type: 'call' | 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  client_name: string;
  created_at: string;
  updated_at: string;
}

// Helper function to ensure valid meeting type
const ensureValidMeetingType = (type: string): 'call' | 'video' | 'in-person' => {
  const validTypes = ['call', 'video', 'in-person'] as const;
  return validTypes.includes(type as any) ? type as any : 'call';
};

// Helper function to ensure valid status
const ensureValidStatus = (status: string): 'scheduled' | 'completed' | 'cancelled' => {
  const validStatuses = ['scheduled', 'completed', 'cancelled'] as const;
  return validStatuses.includes(status as any) ? status as any : 'scheduled';
};

export const useSupabaseMeetings = () => {
  const [meetings, setMeetings] = useState<SupabaseMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.meetings.getAll();
      
      // Transform data to ensure type safety
      const transformedMeetings = data.map((meeting: any) => ({
        ...meeting,
        type: ensureValidMeetingType(meeting.type),
        status: ensureValidStatus(meeting.status)
      }));
      
      setMeetings(transformedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const addMeeting = async (meetingData: Omit<SupabaseMeeting, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newMeeting = await supabaseService.meetings.create(meetingData);
      const transformedMeeting = {
        ...newMeeting,
        type: ensureValidMeetingType(newMeeting.type),
        status: ensureValidStatus(newMeeting.status)
      };
      setMeetings(prev => [transformedMeeting, ...prev]);
      toast.success('Meeting scheduled successfully');
      return transformedMeeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to schedule meeting');
      throw error;
    }
  };

  const updateMeeting = async (meetingId: string, updates: Partial<SupabaseMeeting>) => {
    try {
      const updatedMeeting = await supabaseService.meetings.update(meetingId, updates);
      const transformedMeeting = {
        ...updatedMeeting,
        type: ensureValidMeetingType(updatedMeeting.type),
        status: ensureValidStatus(updatedMeeting.status)
      };
      setMeetings(prev => prev.map(meeting => 
        meeting.id === meetingId ? transformedMeeting : meeting
      ));
      toast.success('Meeting updated successfully');
      return transformedMeeting;
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast.error('Failed to update meeting');
      throw error;
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    try {
      await supabaseService.meetings.delete(meetingId);
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
      toast.success('Meeting deleted successfully');
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error('Failed to delete meeting');
      throw error;
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  return {
    meetings,
    loading,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    loadMeetings
  };
};
