
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, History, BookOpen, Settings, Trophy, LayoutGrid } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

interface EnhancedQuickActionsProps {
  currentRecommendationId: string | null;
  onTakeQuestionnaire: () => void;
  onToggleHistory: () => void;
  onOpenHistoryDrawer: () => void;
  showHistory: boolean;
}

const EnhancedQuickActions: React.FC<EnhancedQuickActionsProps> = ({
  currentRecommendationId,
  onTakeQuestionnaire,
  onToggleHistory,
  onOpenHistoryDrawer,
  showHistory
}) => {
  const { canUseFeature } = useSubscription();
  const navigate = useNavigate();

  const quickActions = [
    {
      label: currentRecommendationId ? 'New Recommendation' : 'Get Started',
      icon: Sparkles,
      onClick: onTakeQuestionnaire,
      disabled: !canUseFeature(),
      variant: 'default' as const,
      className: "bg-green-600 hover:bg-green-700"
    },
    {
      label: showHistory ? 'Hide History' : 'Quick History',
      icon: History,
      onClick: onToggleHistory,
      disabled: !currentRecommendationId,
      variant: 'outline' as const,
      className: showHistory ? "bg-blue-50 border-blue-300 text-blue-700" : ""
    },
    {
      label: 'Full History',
      icon: LayoutGrid,
      onClick: onOpenHistoryDrawer,
      disabled: !currentRecommendationId,
      variant: 'outline' as const,
      className: "border-purple-300 text-purple-700 hover:bg-purple-50"
    },
    {
      label: 'Profile Settings',
      icon: Settings,
      onClick: () => navigate('/profile'),
      disabled: false,
      variant: 'outline' as const
    },
    {
      label: 'Progress',
      icon: Trophy,
      onClick: () => {}, // Placeholder for future implementation
      disabled: true,
      variant: 'outline' as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant}
              disabled={action.disabled}
              className={`w-full justify-start ${action.className || ''}`}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
        
        {!canUseFeature() && (
          <div className="text-xs text-center text-amber-600 bg-amber-50 p-2 rounded">
            <p>Upgrade to Premium for unlimited recommendations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedQuickActions;
