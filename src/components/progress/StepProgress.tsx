
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps }) => {
  if (currentStep === 0 || currentStep >= totalSteps - 1) {
    return null;
  }

  const progressPercentage = (currentStep / (totalSteps - 2)) * 100;

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps - 2}
        </span>
        <span className="text-sm text-gray-600">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
      <Progress value={progressPercentage} className="w-full" />
    </div>
  );
};

export default StepProgress;
