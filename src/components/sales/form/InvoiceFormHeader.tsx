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
import { Input } from "@/components/ui/input";
import { InvoiceForm } from "../types/invoiceTypes";

interface InvoiceFormHeaderProps {
  control: Control<InvoiceForm>;
}

export function InvoiceFormHeader({ control }: InvoiceFormHeaderProps) {
  const clients = useAppStore((state) => state.clients);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <FormLabel>Invoice Date</FormLabel>
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
        name="dueDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Due Date</FormLabel>
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
        name="discount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount (₹)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
