
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Calendar, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface StatsWidgetProps {
  currentRecommendationId: string | null;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ currentRecommendationId }) => {
  const { usageData, remainingRecommendations, subscribed } = useSubscription();

  const stats = [
    {
      label: "Recommendations Used",
      value: usageData.recommendations_used,
      icon: Sparkles,
      color: "text-purple-600"
    },
    {
      label: "Remaining Today",
      value: subscribed ? "∞" : remainingRecommendations,
      icon: Target,
      color: "text-green-600"
    },
    {
      label: "Profile Status",
      value: currentRecommendationId ? "Active" : "Setup",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      label: "Last Reset",
      value: new Date(usageData.last_reset_date).toLocaleDateString(),
      icon: Calendar,
      color: "text-gray-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mb-2`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-lg font-semibold">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsWidget;
