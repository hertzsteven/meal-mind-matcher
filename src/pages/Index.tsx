import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRecommendation } from "@/hooks/useRecommendation";
import { useSubscription } from "@/hooks/useSubscription";
import AppHeader from "@/components/layout/AppHeader";
import StepProgress from "@/components/progress/StepProgress";
import StepNavigation from "@/components/navigation/StepNavigation";
import Dashboard from "@/components/dashboard/Dashboard";
import { renderStep } from "@/utils/stepRenderer";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { isLoading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  
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
    resetRecommendation,
    setRecommendation,
    setCurrentRecommendationId
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
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Load existing recommendation when user has a profile and not showing questionnaire
  useEffect(() => {
    const loadExistingRecommendation = async () => {
      if (user && existingProfileId && !showQuestionnaire && !recommendation) {
        try {
          console.log('Loading existing recommendation for profile:', existingProfileId);
          
          const { data, error } = await supabase
            .from('diet_recommendations')
            .select('*')
            .eq('profile_id', existingProfileId)
            .eq('status', 'active')
            .order('generated_at', { ascending: false })
            .limit(1)
            .single();

          if (error) {
            console.error('Error loading recommendation:', error);
            return;
          }

          if (data) {
            console.log('Loaded existing recommendation:', data);
            setRecommendation(data.recommendation_text);
            setCurrentRecommendationId(data.id);
          }
        } catch (error) {
          console.error('Error loading existing recommendation:', error);
        }
      }
    };

    loadExistingRecommendation();
  }, [user, existingProfileId, showQuestionnaire, recommendation, setRecommendation, setCurrentRecommendationId]);

  // Check if user should see dashboard or questionnaire
  const shouldShowDashboard = existingProfileId && !showQuestionnaire;

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

  const handleTakeQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(0);
  };

  const handleBackToDashboard = () => {
    setShowQuestionnaire(false);
    setCurrentStep(0);
  };

  // Show loading spinner while auth or subscription data is loading
  if (authLoading || subscriptionLoading) {
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
      <AppHeader 
        onTakeQuestionnaire={handleTakeQuestionnaire}
        onBackToDashboard={handleBackToDashboard}
        showQuestionnaire={showQuestionnaire}
        hasProfile={!!existingProfileId}
      />

      <div className="container mx-auto px-4 py-8">
        {shouldShowDashboard ? (
          <Dashboard 
            userData={userData}
            recommendation={recommendation}
            currentRecommendationId={currentRecommendationId}
            onTakeQuestionnaire={handleTakeQuestionnaire}
          />
        ) : (
          <>
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
                    onBackToDashboard={showQuestionnaire ? handleBackToDashboard : undefined}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
