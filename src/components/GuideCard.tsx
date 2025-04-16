
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, User, Star, Globe } from 'lucide-react';
import { GuideType } from '../types/guide';
import { formatPrice } from '../utils/helpers';

interface GuideCardProps {
  guide: GuideType;
  isSelected?: boolean;
  onSelect: (id: string) => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ 
  guide, 
  isSelected = false, 
  onSelect 
}) => {
  const handleClick = () => {
    onSelect(guide.id);
  };

  return (
    <Card 
      className={`overflow-hidden cursor-pointer hover:shadow-md transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={handleClick}
    >
      <div className="relative h-40">
        <img
          src={`${guide.imageUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`}
          alt={guide.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
          }}
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{guide.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>{guide.experience ? `${guide.experience} years exp.` : 'Professional Guide'}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatPrice(guide.pricePerDay)}</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>
        
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < guide.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="text-xs ml-1 text-muted-foreground">({guide.rating}/5)</span>
        </div>
        
        <div className="mt-3 flex items-center">
          <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {guide.languages.map((language, i) => (
              <Badge key={i} variant="outline" className="text-xs font-normal">
                {language}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuideCard;
