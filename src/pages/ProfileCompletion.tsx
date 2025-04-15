import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ChevronsUpDown, CheckCircle2 } from 'lucide-react';

const ProfileCompletion: React.FC = () => {
  const { completeProfile } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [travelFrequency, setTravelFrequency] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  
  const destinations = [
    { id: 'mountains', name: 'Mountains' },
    { id: 'beaches', name: 'Beaches' },
    { id: 'cities', name: 'Cities' },
    { id: 'countryside', name: 'Countryside' },
    { id: 'historical', name: 'Historical Places' },
    { id: 'adventure', name: 'Adventure Destinations' }
  ];
  
  const handleSelectDestination = (id: string) => {
    setSelectedDestinations(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  const handleNext = () => {
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format date as string for API
      const formattedDob = dob ? format(dob, 'yyyy-MM-dd') : '';
      
      await completeProfile({
        address,
        phone,
        dob: formattedDob,
        preferredDestinations: selectedDestinations,
        travelFrequency
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error completing profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>
      <Button onClick={handleNext}>Next</Button>
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dob && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dob ? format(dob, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dob}
              onSelect={setDob}
              disabled={(date) =>
                date > new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-between">
        <Button variant="secondary" onClick={handleBack}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
  
  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label>Preferred Destinations</Label>
        <div className="grid grid-cols-2 gap-2">
          {destinations.map(destination => (
            <Button
              key={destination.id}
              variant={selectedDestinations.includes(destination.id) ? 'default' : 'outline'}
              onClick={() => handleSelectDestination(destination.id)}
            >
              {destination.name}
              {selectedDestinations.includes(destination.id) && (
                <CheckCircle2 className="ml-2 h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="secondary" onClick={handleBack}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
  
  const renderStep4 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="travelFrequency">How often do you travel?</Label>
        <Select onValueChange={setTravelFrequency}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rarely">Rarely</SelectItem>
            <SelectItem value="occasionally">Occasionally</SelectItem>
            <SelectItem value="frequently">Frequently</SelectItem>
            <SelectItem value="very_frequently">Very Frequently</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between">
        <Button variant="secondary" onClick={handleBack}>Back</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Complete Profile'}
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us a bit about yourself to personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
