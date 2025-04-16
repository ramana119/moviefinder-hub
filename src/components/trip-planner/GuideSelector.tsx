
import React from 'react';
import { GuideType } from '@/types';
import GuideCard from '../GuideCard';

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
  // Display premium guides or highlight premium benefits
  const premiumGuides = availableGuides.filter(guide => guide.isPremium);
  const regularGuides = availableGuides.filter(guide => !guide.isPremium);

  // Sort guides by rating
  const sortedRegularGuides = [...regularGuides].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  
  return (
    <div className="space-y-4">
      {selectedDestinations.length > 0 ? (
        <>
          {availableGuides.length > 0 ? (
            <div>
              {isPremium && premiumGuides.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">Premium</span>
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
                {isPremium && premiumGuides.length > 0 && (
                  <h4 className="text-sm font-medium mb-2">Regular Guides</h4>
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
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <h4 className="text-sm font-medium text-amber-800 mb-1">Premium Guides Available</h4>
                  <p className="text-xs text-amber-700">
                    Upgrade to Premium to access our top-rated professional guides with unique local knowledge.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-2">
                No guides available for the selected destinations.
              </p>
              <p className="text-xs text-muted-foreground">
                Try selecting other destinations or continue without a guide.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="p-6 text-center bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            Please select destinations first to see available guides.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuideSelector;
