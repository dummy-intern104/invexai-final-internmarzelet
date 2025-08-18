
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ExpiryDateFieldProps {
  expiryDate: Date | undefined;
  onExpiryDateChange: (date: Date | undefined) => void;
}

export const ExpiryDateField = ({ expiryDate, onExpiryDateChange }: ExpiryDateFieldProps) => {
  return (
    <div className="space-y-2">
      <Label>Expiry Date (Optional)</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !expiryDate && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {expiryDate ? format(expiryDate, "PPP") : <span>Pick expiry date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={expiryDate}
            onSelect={onExpiryDateChange}
            disabled={(date) => date < new Date()}
            initialFocus
            className="p-3 pointer-events-auto"
            classNames={{
              head_row: "flex w-full",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative flex-1 h-9 w-9",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
            }}
          />
        </PopoverContent>
      </Popover>
      {expiryDate && (
        <p className="text-sm text-muted-foreground">
          This will automatically create an expiry record on the Expiry page.
        </p>
      )}
    </div>
  );
};
