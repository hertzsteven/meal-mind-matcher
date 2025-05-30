
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/types/userData";

interface HealthGoalsStepProps {
  userData: UserData;
  onInputChange: (field: keyof UserData, value: string) => void;
}

const HealthGoalsStep: React.FC<HealthGoalsStepProps> = ({ userData, onInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Health & Goals</h2>
      <div>
        <Label htmlFor="healthGoals">Primary Health Goals</Label>
        <Textarea
          id="healthGoals"
          value={userData.healthGoals}
          onChange={(e) => onInputChange('healthGoals', e.target.value)}
          placeholder="What are your main health and nutrition goals? (e.g., weight loss, muscle gain, better energy, etc.)"
          className="h-24"
        />
      </div>
      <div>
        <Label htmlFor="medicalConditions">Medical Conditions or Health Concerns</Label>
        <Textarea
          id="medicalConditions"
          value={userData.medicalConditions}
          onChange={(e) => onInputChange('medicalConditions', e.target.value)}
          placeholder="Any medical conditions, medications, or health concerns we should consider? (optional)"
          className="h-20"
        />
      </div>
    </div>
  );
};

export default HealthGoalsStep;
