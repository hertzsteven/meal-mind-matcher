
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, User, Target } from "lucide-react";
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
  const { subscribed, canUseFeature } = useSubscription();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{userData.name ? `, ${userData.name}` : ''}!
        </h1>
        <p className="text-gray-600">Your personalized nutrition dashboard</p>
      </div>

      {/* Subscription Status */}
      <div className="max-w-md mx-auto">
        <SubscriptionStatus />
      </div>

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
                <span className="font-medium">Activity:</span> {userData.activity_level || 'Not set'}
              </div>
              <div>
                <span className="font-medium">Goal:</span> {userData.health_goals || 'Not set'}
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

      {/* Current Recommendation */}
      {recommendation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Your Latest Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              {renderMarkdownContent(recommendation)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
