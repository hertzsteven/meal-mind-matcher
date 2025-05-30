
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRecommendation } from "@/hooks/useRecommendation";
import AppHeader from "@/components/layout/AppHeader";
import StepProgress from "@/components/progress/StepProgress";
import StepNavigation from "@/components/navigation/StepNavigation";
import { renderStep } from "@/utils/stepRenderer";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    userData,
    existingProfileId,
    saveUserProfile,
    handleInputChange,
    handleRestrictionChange,
    resetForm
  } = useUserProfile();

  const {
    recommendation,
    currentRecommendationId,
    isLoading,
    generateRecommendation,
    resetRecommendation
  } = useRecommendation();
  
  const steps = [
    'Welcome',
    'Basic Info',
    'Physical Details',
    'Lifestyle',
    'Dietary Preferences',
    'Health & Goals',
    'Additional Info',
    'Results'
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateRecommendation = async () => {
    try {
      await generateRecommendation(userData, saveUserProfile);
      setCurrentStep(7);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleStartNew = () => {
    setCurrentStep(0);
    resetForm();
    resetRecommendation();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-green-600">
          <div className="w-6 h-6 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <AppHeader />

      <div className="container mx-auto px-4 py-8">
        <StepProgress currentStep={currentStep} totalSteps={steps.length} />

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              {renderStep({
                currentStep,
                userData,
                recommendation,
                currentRecommendationId,
                existingProfileId,
                onNext: nextStep,
                onInputChange: handleInputChange,
                onRestrictionChange: handleRestrictionChange,
                onStartNew: handleStartNew
              })}
              
              <StepNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                userData={userData}
                isLoading={isLoading}
                onPrevious={prevStep}
                onNext={nextStep}
                onGenerate={handleGenerateRecommendation}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
