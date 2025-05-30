
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Utensils, ArrowRight, ArrowLeft, LogOut, User, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserData } from "@/types/userData";
import { validateStep, getEmptyUserData } from "@/utils/formValidation";
import WelcomeStep from "@/components/steps/WelcomeStep";
import BasicInfoStep from "@/components/steps/BasicInfoStep";
import PhysicalDetailsStep from "@/components/steps/PhysicalDetailsStep";
import LifestyleStep from "@/components/steps/LifestyleStep";
import DietaryPreferencesStep from "@/components/steps/DietaryPreferencesStep";
import HealthGoalsStep from "@/components/steps/HealthGoalsStep";
import AdditionalInfoStep from "@/components/steps/AdditionalInfoStep";
import ResultsStep from "@/components/steps/ResultsStep";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string>('');
  const [userData, setUserData] = useState<UserData>(getEmptyUserData());
  
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/auth');
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const handleInputChange = (field: keyof UserData, value: string | string[]) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleRestrictionChange = (restriction: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, restriction]
        : prev.dietaryRestrictions.filter(r => r !== restriction)
    }));
  };

  const generateRecommendation = async () => {
    setIsLoading(true);
    try {
      console.log('Calling OpenAI API with user data:', userData);
      
      const { data, error } = await supabase.functions.invoke('generate-diet-recommendation', {
        body: { userData }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate recommendation');
      }

      if (!data?.recommendation) {
        throw new Error('No recommendation received from AI');
      }

      console.log('Received recommendation:', data.recommendation);
      setRecommendation(data.recommendation);
      setCurrentStep(7);
      toast.success("Your personalized diet recommendation has been generated!");
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast.error("Failed to generate recommendation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const resetForm = () => {
    setCurrentStep(0);
    setUserData(getEmptyUserData());
    setRecommendation('');
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

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return <BasicInfoStep userData={userData} onInputChange={handleInputChange} />;
      case 2:
        return <PhysicalDetailsStep userData={userData} onInputChange={handleInputChange} />;
      case 3:
        return <LifestyleStep userData={userData} onInputChange={handleInputChange} />;
      case 4:
        return (
          <DietaryPreferencesStep 
            userData={userData} 
            onInputChange={handleInputChange}
            onRestrictionChange={handleRestrictionChange}
          />
        );
      case 5:
        return <HealthGoalsStep userData={userData} onInputChange={handleInputChange} />;
      case 6:
        return <AdditionalInfoStep userData={userData} onInputChange={handleInputChange} />;
      case 7:
        return <ResultsStep recommendation={recommendation} onStartNew={resetForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header with user info and sign out */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-gray-900">NutriAI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {currentStep > 0 && currentStep < 7 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {steps.length - 2}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round((currentStep / (steps.length - 2)) * 100)}% Complete
              </span>
            </div>
            <Progress value={(currentStep / (steps.length - 2)) * 100} className="w-full" />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              {renderStep()}
              
              {currentStep > 0 && currentStep < 7 && (
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep === 6 ? (
                    <Button
                      onClick={generateRecommendation}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? 'Generating...' : 'Generate My Plan'}
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!validateStep(currentStep, userData)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
