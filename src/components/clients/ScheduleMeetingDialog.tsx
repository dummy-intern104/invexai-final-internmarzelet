import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Calendar, Clock, Phone, Video, MapPin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Meeting } from "@/types/meeting";
import useAppStore from "@/store/appStore";

interface ScheduleMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: number;
  clientName: string;
  onMeetingScheduled?: (meeting: Meeting) => void;
}

interface MeetingForm {
  title: string;
  date: string;
  time: string;
  type: 'call' | 'in-person' | 'video';
  notes: string;
}

export function ScheduleMeetingDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
  onMeetingScheduled
}: ScheduleMeetingDialogProps) {
  const { addMeeting } = useAppStore();
  const form = useForm<MeetingForm>({
    defaultValues: {
      title: "",
      date: "",
      time: "",
      type: "call",
      notes: "",
    },
  });

  const onSubmit = (data: MeetingForm) => {
    const meetingData = {
      clientId,
      clientName,
      title: data.title,
      date: data.date,
      time: data.time,
      type: data.type,
      notes: data.notes,
      status: "scheduled" as const,
    };

    addMeeting(meetingData);
    toast.success(`Meeting scheduled with ${clientName}`);
    
    if (onMeetingScheduled) {
      onMeetingScheduled({
        ...meetingData,
        id: `meeting-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }
    
    onOpenChange(false);
    form.reset();
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Meeting with {clientName}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter meeting title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meeting type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="call">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Call
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video Call
                        </div>
                      </SelectItem>
                      <SelectItem value="in-person">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          In Person
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Meeting agenda or notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
