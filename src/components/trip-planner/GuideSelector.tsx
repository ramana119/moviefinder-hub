
import React from 'react';
import { GuideType } from '@/types';
import GuideCard from '../GuideCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface GuideSelectorProps {
  selectedDestinations: string[];
  availableGuides: GuideType[];
  selectedGuides: string[];
  handleSelectGuide: (id: string) => void;
  isPremium: boolean;
}

const GuideSelector: React.FC<GuideSelectorProps> = ({
  selectedDestinations,
  availableGuides,
  selectedGuides,
  handleSelectGuide,
  isPremium
}) => {
  // Get premium and regular guides
  const premiumGuides = availableGuides.filter(guide => guide.isPremium === true);
  const regularGuides = availableGuides.filter(guide => guide.isPremium !== true);

  // Sort guides by rating
  const sortedRegularGuides = [...regularGuides].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  
  // Check if we have any guides for the selected destinations
  const hasGuides = availableGuides.length > 0;

  if (!selectedDestinations.length) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-md">
        <Info className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Please select destinations first to see available guides.
        </p>
      </div>
    );
  }

  if (!hasGuides) {
    return (
      <div className="space-y-4">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">No Guides Found</h4>
                <p className="text-sm text-muted-foreground">
                  We couldn't find any guides for your selected destinations. 
                  Try selecting different destinations, or continue planning without a guide.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-52 opacity-40">
              <CardContent className="p-4 flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground text-center">Guide placeholder</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isPremium && premiumGuides.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mr-2">
              Premium
            </Badge>
            <h4 className="text-sm font-medium">Premium Guides</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {premiumGuides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
                isSelected={selectedGuides.includes(guide.id)}
                onSelect={handleSelectGuide}
              />
            ))}
          </div>
        </div>
      )}
      
      <div>
        {(isPremium && premiumGuides.length > 0) && (
          <h4 className="text-sm font-medium mb-3">Regular Guides</h4>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedRegularGuides.map(guide => (
            <GuideCard
              key={guide.id}
              guide={guide}
              isSelected={selectedGuides.includes(guide.id)}
              onSelect={handleSelectGuide}
            />
          ))}
        </div>
      </div>
      
      {!isPremium && premiumGuides.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-amber-800 mb-1">Premium Guides Available</h4>
            <p className="text-xs text-amber-700 mb-3">
              Upgrade to Premium to access our top-rated professional guides with unique local knowledge.
            </p>
            <Button size="sm" variant="outline" className="bg-white">
              Learn About Premium
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GuideSelector;
