
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Languages } from 'lucide-react';
import { GuideType } from '../types';

interface GuideCardProps {
  guide: GuideType;
  isSelected: boolean;
  onSelect: (guideId: string) => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, isSelected, onSelect }) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(guide.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img 
              src={guide.imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'} 
              alt={guide.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{guide.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
              <span>{guide.rating} rating</span>
              {guide.experience && (
                <span className="ml-2">{guide.experience} years exp.</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center text-sm mb-2">
            <Languages className="h-4 w-4 mr-1 text-gray-500" />
            <span>
              {guide.languages.join(', ')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">₹{guide.pricePerDay}/day</span>
            {isSelected && (
              <Badge variant="default" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Selected
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuideCard;
