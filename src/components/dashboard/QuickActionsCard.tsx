
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface QuickActionsCardProps {
  currentRecommendationId: string | null;
  onTakeQuestionnaire: () => void;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  currentRecommendationId,
  onTakeQuestionnaire
}) => {
  const { canUseFeature } = useSubscription();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={onTakeQuestionnaire}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!canUseFeature()}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {currentRecommendationId ? 'Get New Recommendation' : 'Get Your First Recommendation'}
        </Button>
        
        {!canUseFeature() && (
          <p className="text-sm text-center text-amber-600">
            Upgrade to Premium for unlimited recommendations
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
