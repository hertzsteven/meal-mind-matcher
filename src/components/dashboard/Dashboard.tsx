
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, User, Target, ChevronDown, ChevronUp, Crown, Settings } from "lucide-react";
import { UserData } from "@/types/userData";
import { renderMarkdownContent } from "@/utils/markdownRenderer";
import SubscriptionStatus from "@/components/subscription/SubscriptionStatus";
import UpgradePrompt from "@/components/subscription/UpgradePrompt";
import { useSubscription } from "@/hooks/useSubscription";

interface DashboardProps {
  userData: UserData;
  recommendation: string;
  currentRecommendationId: string | null;
  onTakeQuestionnaire: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userData,
  recommendation,
  currentRecommendationId,
  onTakeQuestionnaire
}) => {
  const { subscribed, canUseFeature, subscription_tier, openCustomerPortal } = useSubscription();
  const [isRecommendationExpanded, setIsRecommendationExpanded] = useState(false);
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);

  // Function to truncate recommendation text for preview
  const getRecommendationPreview = (text: string) => {
    const words = text.split(' ');
    const previewLength = 50; // Show first 50 words
    if (words.length <= previewLength) return text;
    return words.slice(0, previewLength).join(' ') + '...';
  };

  return (
    <div className="space-y-6">
      {/* Header with compact subscription indicator */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{userData.name ? `, ${userData.name}` : ''}!
          </h1>
          {/* Compact subscription badge */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={subscribed ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                subscribed 
                  ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setShowSubscriptionDetails(!showSubscriptionDetails)}
            >
              <Crown className="w-3 h-3 mr-1" />
              {subscribed ? `${subscription_tier} Plan` : 'Free Plan'}
            </Badge>
            {subscribed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={openCustomerPortal}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
              >
                <Settings className="w-3 h-3 mr-1" />
                Manage
              </Button>
            )}
          </div>
        </div>
        <p className="text-gray-600">Your personalized nutrition dashboard</p>
      </div>

      {/* Expandable Subscription Details */}
      {showSubscriptionDetails && (
        <div className="max-w-md mx-auto">
          <SubscriptionStatus />
        </div>
      )}

      {/* Upgrade Prompt for Non-Premium Users */}
      {!subscribed && !canUseFeature() && (
        <div className="max-w-md mx-auto">
          <UpgradePrompt />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Age:</span> {userData.age || 'Not set'}
              </div>
              <div>
                <span className="font-medium">Gender:</span> {userData.gender || 'Not set'}
              </div>
              <div>
                <span className="font-medium">Activity:</span> {userData.activityLevel || 'Not set'}
              </div>
              <div>
                <span className="font-medium">Goal:</span> {userData.healthGoals || 'Not set'}
              </div>
            </div>
            
            <Button 
              onClick={onTakeQuestionnaire}
              variant="outline" 
              className="w-full mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
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
      </div>

      {/* Current Recommendation - Collapsible */}
      {recommendation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Your Latest Recommendation
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRecommendationExpanded(!isRecommendationExpanded)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isRecommendationExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Read More
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              {isRecommendationExpanded 
                ? renderMarkdownContent(recommendation)
                : renderMarkdownContent(getRecommendationPreview(recommendation))
              }
            </div>
            {!isRecommendationExpanded && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setIsRecommendationExpanded(true)}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  View Full Recommendation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
