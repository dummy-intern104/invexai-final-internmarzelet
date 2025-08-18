
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimeRange = "daily" | "weekly" | "monthly" | "custom";

interface TimeRangeSelectionProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
  customDateFrom: Date | undefined;
  customDateTo: Date | undefined;
  onCustomDateFromChange: (date: Date | undefined) => void;
  onCustomDateToChange: (date: Date | undefined) => void;
}

export const TimeRangeSelection: React.FC<TimeRangeSelectionProps> = ({
  timeRange,
  onTimeRangeChange,
  customDateFrom,
  customDateTo,
  onCustomDateFromChange,
  onCustomDateToChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Time Range</Label>
      <RadioGroup 
        value={timeRange} 
        onValueChange={(v) => onTimeRangeChange(v as TimeRange)}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="daily" id="daily" />
          <Label htmlFor="daily">Today</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="weekly" id="weekly" />
          <Label htmlFor="weekly">This Week</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="monthly" id="monthly" />
          <Label htmlFor="monthly">This Month</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">Custom Range</Label>
        </div>
      </RadioGroup>

      {timeRange === "custom" && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label>From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !customDateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateFrom ? format(customDateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={customDateFrom}
                  onSelect={onCustomDateFromChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !customDateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateTo ? format(customDateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={customDateTo}
                  onSelect={onCustomDateToChange}
                  initialFocus
                  disabled={(date) => 
                    (customDateFrom ? date < customDateFrom : false) || date > new Date()
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};
