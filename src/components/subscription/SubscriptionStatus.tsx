
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Settings, RefreshCw, CheckCircle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";

const SubscriptionStatus: React.FC = () => {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    usageData,
    isLoading,
    checkSubscription,
    openCustomerPortal,
    remainingRecommendations
  } = useSubscription();

  if (!subscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-gray-400" />
            Free Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>You're currently on the free plan.</p>
            <p className="mt-2">Daily limit: {remainingRecommendations} recommendation{remainingRecommendations === 1 ? '' : 's'} remaining</p>
          </div>
          <Button 
            onClick={checkSubscription}
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-green-600" />
          {subscription_tier} Plan
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-green-700">
          <p>✨ Unlimited AI recommendations</p>
          <p>🎯 Advanced meal planning</p>
          <p>📧 Priority support</p>
          <p>📄 PDF exports</p>
        </div>

        {subscription_end && (
          <div className="text-sm text-gray-600">
            <p>Renews on: {format(new Date(subscription_end), 'MMMM d, yyyy')}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={openCustomerPortal}
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Subscription
          </Button>
          <Button 
            onClick={checkSubscription}
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
