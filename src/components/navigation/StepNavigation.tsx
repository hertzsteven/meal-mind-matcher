
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { UserData } from "@/types/userData";
import { validateStep } from "@/utils/formValidation";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  userData: UserData;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGenerate: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  userData,
  isLoading,
  onPrevious,
  onNext,
  onGenerate
}) => {
  if (currentStep === 0 || currentStep >= totalSteps - 1) {
    return null;
  }

  const isLastStep = currentStep === totalSteps - 2;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      
      {isLastStep ? (
        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Generating...' : 'Generate My Plan'}
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!validateStep(currentStep, userData)}
          className="bg-green-600 hover:bg-green-700"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
