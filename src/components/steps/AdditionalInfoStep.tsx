
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/types/userData";

interface AdditionalInfoStepProps {
  userData: UserData;
  onInputChange: (field: keyof UserData, value: string) => void;
}

const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({ userData, onInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Additional Information</h2>
      <div>
        <Label htmlFor="additionalInfo">Anything Else We Should Know?</Label>
        <Textarea
          id="additionalInfo"
          value={userData.additionalInfo}
          onChange={(e) => onInputChange('additionalInfo', e.target.value)}
          placeholder="Any additional information about your lifestyle, preferences, or goals that would help us create better recommendations..."
          className="h-32"
        />
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Ready to Generate Your Plan!</h3>
        <p className="text-blue-700 text-sm">
          We'll use AI to analyze your information and create a personalized dietary recommendation 
          tailored specifically to your needs, goals, and preferences.
        </p>
      </div>
    </div>
  );
};

export default AdditionalInfoStep;
