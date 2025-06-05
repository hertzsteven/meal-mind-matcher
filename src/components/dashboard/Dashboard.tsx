
import React, { useState } from 'react';
import { UserData } from "@/types/userData";
import DashboardHeader from "./DashboardHeader";
import ProfileSummaryCard from "./ProfileSummaryCard";
import QuickActionsCard from "./QuickActionsCard";
import RecommendationCard from "./RecommendationCard";

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

  return (
    <div className="space-y-6">
      <DashboardHeader 
        userName={userData.name}
        showSubscriptionDetails={showSubscriptionDetails}
        onToggleSubscriptionDetails={() => setShowSubscriptionDetails(!showSubscriptionDetails)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileSummaryCard 
          userData={userData}
          onTakeQuestionnaire={onTakeQuestionnaire}
        />

        <QuickActionsCard 
          currentRecommendationId={currentRecommendationId}
          onTakeQuestionnaire={onTakeQuestionnaire}
        />
      </div>

      <RecommendationCard recommendation={recommendation} />
    </div>
  );
};

export default Dashboard;
