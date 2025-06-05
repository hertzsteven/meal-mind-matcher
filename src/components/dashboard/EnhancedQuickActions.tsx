

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, History, Trophy, LayoutGrid, Zap, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  const { canUseFeature, subscribed } = useSubscription();

  const quickActions = [
    {
      label: currentRecommendationId ? 'New Recommendation' : 'Get Started',
      icon: Sparkles,
      onClick: onTakeQuestionnaire,
      disabled: !canUseFeature(),
      variant: 'default' as const,
      className: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
      description: currentRecommendationId ? 'Generate a fresh recommendation' : 'Start your nutrition journey'
    },
    {
      label: showHistory ? 'Hide Quick View' : 'Quick History',
      icon: History,
      onClick: onToggleHistory,
      disabled: !currentRecommendationId,
      variant: 'outline' as const,
      className: showHistory 
        ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 shadow-md" 
        : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200",
      description: 'Toggle compact history view'
    },
    {
      label: 'Full History View',
      icon: LayoutGrid,
      onClick: onOpenHistoryDrawer,
      disabled: !currentRecommendationId,
      variant: 'outline' as const,
      className: "border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 hover:scale-105 transition-all duration-200",
      description: 'Browse all recommendations'
    },
    {
      label: 'Progress & Goals',
      icon: Trophy,
      onClick: () => toast({
        title: "Coming Soon!",
        description: "Progress tracking feature is in development"
      }),
      disabled: true,
      variant: 'outline' as const,
      className: "opacity-50",
      description: 'Track your nutrition journey'
    }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1 bg-green-100 rounded-full">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          Quick Actions
          <Zap className="w-4 h-4 text-yellow-500 ml-auto" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, index) => (
            <div key={index} className="group">
              <Button
                onClick={action.onClick}
                variant={action.variant}
                disabled={action.disabled}
                className={`w-full justify-start p-4 h-auto ${action.className || ''}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-full ${
                    action.variant === 'default' 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-white group-disabled:bg-gray-100'
                  } transition-colors duration-200`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className={`text-xs opacity-75 ${
                      action.variant === 'default' ? 'text-white' : 'text-gray-600'
                    }`}>
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </div>
        
        {/* Enhanced upgrade prompt */}
        {!canUseFeature() && (
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Upgrade to Premium</span>
            </div>
            <p className="text-xs text-amber-700 mb-3">
              Get unlimited recommendations, advanced features, and priority support
            </p>
            <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Upgrade Now
            </Button>
          </div>
        )}
        
        {/* Status indicator */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Status:</span>
          <span className={`flex items-center gap-1 ${subscribed ? 'text-green-600' : 'text-amber-600'}`}>
            <div className={`w-2 h-2 rounded-full ${subscribed ? 'bg-green-500' : 'bg-amber-500'}`} />
            {subscribed ? 'Premium' : 'Free Plan'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedQuickActions;

