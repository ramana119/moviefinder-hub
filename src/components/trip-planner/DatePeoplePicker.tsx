
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

interface DatePeoplePickerProps {
  numberOfDays: number;
  setNumberOfDays: (days: number) => void;
  numberOfPeople: number;
  setNumberOfPeople: (people: number) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
}

const DatePeoplePicker: React.FC<DatePeoplePickerProps> = ({
  numberOfDays,
  setNumberOfDays,
  numberOfPeople,
  setNumberOfPeople,
  startDate,
  setStartDate
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Calculated)</Label>
          <div className="flex items-center h-10 px-4 border rounded-md bg-muted text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate && numberOfDays
              ? format(addDays(startDate, numberOfDays - 1), "PPP")
              : "Select start date first"
            }
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="numberOfDays">Number of Days</Label>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon"
              disabled={numberOfDays <= 1}
              onClick={() => setNumberOfDays(Math.max(1, numberOfDays - 1))}
            >
              -
            </Button>
            <Input
              id="numberOfDays"
              type="number"
              min="1"
              max="30"
              value={numberOfDays}
              onChange={e => setNumberOfDays(parseInt(e.target.value) || 1)}
              className="mx-2 text-center"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setNumberOfDays(numberOfDays + 1)}
            >
              +
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfPeople">Number of People</Label>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon"
              disabled={numberOfPeople <= 1}
              onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
            >
              -
            </Button>
            <Input
              id="numberOfPeople"
              type="number"
              min="1"
              max="20"
              value={numberOfPeople}
              onChange={e => setNumberOfPeople(parseInt(e.target.value) || 1)}
              className="mx-2 text-center"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setNumberOfPeople(numberOfPeople + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePeoplePicker;
