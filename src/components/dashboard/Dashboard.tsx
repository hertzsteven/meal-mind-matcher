
import React, { useState } from 'react';
import { UserData } from "@/types/userData";
import DashboardHeader from "./DashboardHeader";
import ProfileCompletionIndicator from "./ProfileCompletionIndicator";
import StatsWidget from "./StatsWidget";
import EnhancedQuickActions from "./EnhancedQuickActions";
import EnhancedRecommendationCard from "./EnhancedRecommendationCard";
import RecommendationHistory from "../steps/RecommendationHistory";

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
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-6 p-4">
      <DashboardHeader 
        userName={userData.name}
        showSubscriptionDetails={showSubscriptionDetails}
        onToggleSubscriptionDetails={() => setShowSubscriptionDetails(!showSubscriptionDetails)}
      />

      {/* Top row - Profile completion indicator */}
      <div className="w-full">
        <ProfileCompletionIndicator 
          userData={userData}
          onTakeQuestionnaire={onTakeQuestionnaire}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Quick Actions */}
        <div className="lg:col-span-1">
          <EnhancedQuickActions 
            currentRecommendationId={currentRecommendationId}
            onTakeQuestionnaire={onTakeQuestionnaire}
            onToggleHistory={() => setShowHistory(!showHistory)}
            showHistory={showHistory}
          />
        </div>

        {/* Right column - Stats */}
        <div className="lg:col-span-2">
          <StatsWidget currentRecommendationId={currentRecommendationId} />
        </div>
      </div>

      {/* Full width recommendation card */}
      {recommendation && (
        <EnhancedRecommendationCard recommendation={recommendation} />
      )}

      {/* History section - only show when toggled */}
      {showHistory && currentRecommendationId && (
        <div className="animate-fade-in">
          <RecommendationHistory currentRecommendationId={currentRecommendationId} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
