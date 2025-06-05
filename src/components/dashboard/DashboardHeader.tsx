
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionStatus from "@/components/subscription/SubscriptionStatus";
import UpgradePrompt from "@/components/subscription/UpgradePrompt";

interface DashboardHeaderProps {
  userName?: string;
  showSubscriptionDetails: boolean;
  onToggleSubscriptionDetails: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  showSubscriptionDetails,
  onToggleSubscriptionDetails
}) => {
  const { subscribed, canUseFeature, subscription_tier } = useSubscription();

  return (
    <div className="space-y-6">
      {/* Header with compact subscription indicator */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{userName ? `, ${userName}` : ''}!
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
              onClick={onToggleSubscriptionDetails}
            >
              <Crown className="w-3 h-3 mr-1" />
              {subscribed ? `${subscription_tier} Plan` : 'Free Plan'}
            </Badge>
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
    </div>
  );
};

export default DashboardHeader;
