
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Calendar, Sparkles, ArrowUp, ArrowDown } from "lucide-react";
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
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "up",
      subtitle: "This month"
    },
    {
      label: "Remaining Today",
      value: subscribed ? "∞" : remainingRecommendations,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: subscribed ? "stable" : (remainingRecommendations > 0 ? "up" : "down"),
      subtitle: subscribed ? "Unlimited" : "Free tier"
    },
    {
      label: "Profile Status",
      value: currentRecommendationId ? "Active" : "Setup",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: currentRecommendationId ? "up" : "stable",
      subtitle: currentRecommendationId ? "Complete" : "Pending"
    },
    {
      label: "Last Activity",
      value: new Date(usageData.last_reset_date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      icon: Calendar,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      trend: "stable",
      subtitle: "Updated"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-3 h-3 text-green-500" />;
      case "down":
        return <ArrowDown className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Your Stats
          <div className="ml-auto text-xs text-gray-500 font-normal">Live metrics</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="group cursor-pointer hover:scale-105 transition-transform duration-200">
              <div className="text-center p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.bgColor} mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  {getTrendIcon(stat.trend)}
                </div>
                <div className="text-xs font-medium text-gray-700 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional insights */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Weekly progress</span>
            <span className="flex items-center gap-1">
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((usageData.recommendations_used / 7) * 100, 100)}%` }}
                />
              </div>
              <span className="ml-1">{Math.min(usageData.recommendations_used, 7)}/7</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsWidget;
