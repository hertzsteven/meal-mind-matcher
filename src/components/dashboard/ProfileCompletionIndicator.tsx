
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from "lucide-react";
import { UserData } from "@/types/userData";

interface ProfileCompletionIndicatorProps {
  userData: UserData;
  onTakeQuestionnaire: () => void;
}

const ProfileCompletionIndicator: React.FC<ProfileCompletionIndicatorProps> = ({
  userData,
  onTakeQuestionnaire
}) => {
  const calculateCompletionPercentage = () => {
    const fields = [
      userData.age,
      userData.gender,
      userData.weight,
      userData.height,
      userData.activityLevel,
      userData.healthGoals,
      userData.currentDiet,
      userData.mealsPerDay,
      userData.cookingTime,
      userData.budget
    ];
    
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();
  const isComplete = completionPercentage === 100;

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600" />
          )}
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-900">{completionPercentage}%</span>
        </div>
        
        <Progress value={completionPercentage} className="h-2" />
        
        {!isComplete && (
          <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md">
            <p className="font-medium mb-1">Complete your profile for better recommendations</p>
            <button 
              onClick={onTakeQuestionnaire}
              className="text-amber-800 underline hover:no-underline"
            >
              Update your information →
            </button>
          </div>
        )}
        
        {isComplete && (
          <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
            <p className="font-medium">🎉 Your profile is complete!</p>
            <p>You'll get the most accurate nutrition recommendations.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionIndicator;
