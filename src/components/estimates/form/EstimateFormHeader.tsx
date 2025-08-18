
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control } from "react-hook-form";
import useAppStore from "@/store/appStore";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface EstimateForm {
  clientName: string;
  date: Date;
  validUntil: Date;
  items: any[];
  notes: string;
  terms: string;
}

interface EstimateFormHeaderProps {
  control: Control<EstimateForm>;
}

export function EstimateFormHeader({ control }: EstimateFormHeaderProps) {
  const clients = useAppStore((state) => state.clients);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="clientName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.name}>
                      {client.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="new">Enter Client Name</SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className="pl-3 text-left font-normal"
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="validUntil"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Valid Until</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className="pl-3 text-left font-normal"
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
