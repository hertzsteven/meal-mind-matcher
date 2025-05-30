
import React from 'react';
import { UserData } from "@/types/userData";
import WelcomeStep from "@/components/steps/WelcomeStep";
import BasicInfoStep from "@/components/steps/BasicInfoStep";
import PhysicalDetailsStep from "@/components/steps/PhysicalDetailsStep";
import LifestyleStep from "@/components/steps/LifestyleStep";
import DietaryPreferencesStep from "@/components/steps/DietaryPreferencesStep";
import HealthGoalsStep from "@/components/steps/HealthGoalsStep";
import AdditionalInfoStep from "@/components/steps/AdditionalInfoStep";
import ResultsStep from "@/components/steps/ResultsStep";

interface StepRendererProps {
  currentStep: number;
  userData: UserData;
  recommendation: string;
  currentRecommendationId: string | null;
  existingProfileId: string | null;
  onNext: () => void;
  onInputChange: (field: keyof UserData, value: string | string[]) => void;
  onRestrictionChange: (restriction: string, checked: boolean) => void;
  onStartNew: () => void;
}

export const renderStep = ({
  currentStep,
  userData,
  recommendation,
  currentRecommendationId,
  existingProfileId,
  onNext,
  onInputChange,
  onRestrictionChange,
  onStartNew
}: StepRendererProps) => {
  switch (currentStep) {
    case 0:
      return <WelcomeStep onNext={onNext} />;
    case 1:
      return <BasicInfoStep userData={userData} onInputChange={onInputChange} />;
    case 2:
      return <PhysicalDetailsStep userData={userData} onInputChange={onInputChange} />;
    case 3:
      return <LifestyleStep userData={userData} onInputChange={onInputChange} />;
    case 4:
      return (
        <DietaryPreferencesStep 
          userData={userData} 
          onInputChange={onInputChange}
          onRestrictionChange={onRestrictionChange}
        />
      );
    case 5:
      return <HealthGoalsStep userData={userData} onInputChange={onInputChange} />;
    case 6:
      return <AdditionalInfoStep userData={userData} onInputChange={onInputChange} />;
    case 7:
      return (
        <ResultsStep 
          recommendation={recommendation} 
          onStartNew={onStartNew}
          currentRecommendationId={currentRecommendationId}
          existingProfileId={existingProfileId}
        />
      );
    default:
      return null;
  }
};
