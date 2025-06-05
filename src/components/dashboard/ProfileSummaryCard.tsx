
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";
import { UserData } from "@/types/userData";

interface ProfileSummaryCardProps {
  userData: UserData;
  onTakeQuestionnaire: () => void;
}

const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  userData,
  onTakeQuestionnaire
}) => {
  return (
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
  );
};

export default ProfileSummaryCard;
