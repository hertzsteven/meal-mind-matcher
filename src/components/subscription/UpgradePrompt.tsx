
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Zap, CheckCircle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface UpgradePromptProps {
  onUpgrade?: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ onUpgrade }) => {
  const { createCheckout, isLoading, remainingRecommendations } = useSubscription();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    }
    createCheckout();
  };

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
          <Crown className="w-6 h-6 text-orange-600" />
        </div>
        <CardTitle className="text-xl text-orange-800">
          {remainingRecommendations > 0 
            ? `${remainingRecommendations} Free Recommendation${remainingRecommendations === 1 ? '' : 's'} Remaining`
            : 'Upgrade to Premium'
          }
        </CardTitle>
        <p className="text-orange-600 text-sm">
          {remainingRecommendations > 0 
            ? 'Unlock unlimited recommendations with Premium'
            : 'You\'ve used your free recommendation for today'
          }
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Unlimited AI recommendations</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Advanced meal planning features</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Priority support</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Export recommendations as PDF</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Sparkles className="w-3 h-3 mr-1" />
            Special Launch Price
          </Badge>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-800">$9.97/month</div>
          <div className="text-sm text-orange-600">Cancel anytime</div>
        </div>

        <Button 
          onClick={handleUpgrade}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Upgrade to Premium
            </div>
          )}
        </Button>

        {remainingRecommendations > 0 && (
          <p className="text-xs text-center text-gray-500">
            You can still use {remainingRecommendations} free recommendation{remainingRecommendations === 1 ? '' : 's'} today
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
