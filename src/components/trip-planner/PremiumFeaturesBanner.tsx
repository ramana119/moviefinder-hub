
import React from 'react';
import { Star, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { getPremiumUserBenefits } from '../../utils/tripPlanningUtils';

interface PremiumFeaturesBannerProps {
  isPremium: boolean;
}

const PremiumFeaturesBanner: React.FC<PremiumFeaturesBannerProps> = ({ isPremium }) => {
  const navigate = useNavigate();
  const premiumBenefits = getPremiumUserBenefits().slice(0, 4);

  if (isPremium) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-purple-500 fill-purple-500" />
            <h3 className="font-medium text-purple-700">Premium Features Active</h3>
          </div>
          <p className="text-sm text-purple-600 mb-3">
            Enjoy all premium benefits for your trip planning experience.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {premiumBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-1.5 text-xs text-purple-700">
                <span className="mt-0.5 text-purple-500">•</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium text-amber-700">Upgrade to Premium</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 p-1 h-auto"
            onClick={() => navigate('/premium')}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-amber-600 mb-3">
          Unlock premium features for the ultimate travel experience.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {premiumBenefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-1.5 text-xs text-amber-700">
              <span className="mt-0.5 text-amber-500">•</span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeaturesBanner;
