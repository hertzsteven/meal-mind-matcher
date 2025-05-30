
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
  const [currentRecommendationId, setCurrentRecommendationId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>(getEmptyUserData());
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);
  
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

  // Load existing user profile data when component mounts
  useEffect(() => {
    if (user) {
      loadExistingProfile();
    }
  }, [user]);

  const loadExistingProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_diet_profiles')
        .select(`
          *,
          current_recommendation_id,
          diet_recommendations!current_recommendation_id (
            id,
            recommendation_text,
            generated_at
          )
        `)
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        console.log('Loaded existing profile:', data);
        setExistingProfileId(data.id);
        setUserData({
          name: data.name || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          weight: data.weight?.toString() || '',
          height: data.height?.toString() || '',
          activityLevel: data.activity_level || '',
          dietaryRestrictions: data.dietary_restrictions || [],
          healthGoals: data.health_goals || '',
          currentDiet: data.current_diet || '',
          mealsPerDay: data.meals_per_day || '',
          cookingTime: data.cooking_time || '',
          budget: data.budget || '',
          medicalConditions: data.medical_conditions || '',
          foodPreferences: data.food_preferences || '',
          additionalInfo: data.additional_info || ''
        });

        // Load current recommendation if exists
        if (data.diet_recommendations) {
          setRecommendation(data.diet_recommendations.recommendation_text);
          setCurrentRecommendationId(data.diet_recommendations.id);
        }
      }
    } catch (error) {
      console.error('Error loading existing profile:', error);
    }
  };

  const saveUserProfile = async () => {
    if (!user) return null;

    try {
      const profileData = {
        user_id: user.id,
        name: userData.name,
        age: userData.age ? parseInt(userData.age) : null,
        gender: userData.gender,
        weight: userData.weight ? parseFloat(userData.weight) : null,
        height: userData.height ? parseFloat(userData.height) : null,
        activity_level: userData.activityLevel,
        dietary_restrictions: userData.dietaryRestrictions,
        health_goals: userData.healthGoals,
        current_diet: userData.currentDiet,
        meals_per_day: userData.mealsPerDay,
        cooking_time: userData.cookingTime,
        budget: userData.budget,
        medical_conditions: userData.medicalConditions,
        food_preferences: userData.foodPreferences,
        additional_info: userData.additionalInfo,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingProfileId) {
        // Update existing profile with incremented version
        result = await supabase
          .from('user_diet_profiles')
          .update({
            ...profileData,
            version: await getNextVersion()
          })
          .eq('id', existingProfileId)
          .select()
          .single();
      } else {
        // Create new profile
        result = await supabase
          .from('user_diet_profiles')
          .insert(profileData)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      console.log('Profile saved successfully:', result.data);
      setExistingProfileId(result.data.id);
      return result.data;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile data");
      throw error;
    }
  };

  const getNextVersion = async () => {
    if (!existingProfileId) return 1;
    
    const { data } = await supabase
      .from('user_diet_profiles')
      .select('version')
      .eq('id', existingProfileId)
      .single();
    
    return (data?.version || 0) + 1;
  };

  const saveRecommendation = async (recommendationText: string, profileId: string) => {
    if (!user) return null;

    try {
      // Archive any existing active recommendations for this user
      await supabase
        .from('diet_recommendations')
        .update({ status: 'archived' })
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Create new recommendation
      const { data, error } = await supabase
        .from('diet_recommendations')
        .insert({
          user_id: user.id,
          profile_id: profileId,
          recommendation_text: recommendationText,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Update profile to reference the new recommendation
      await supabase
        .from('user_diet_profiles')
        .update({ current_recommendation_id: data.id })
        .eq('id', profileId);

      setCurrentRecommendationId(data.id);
      console.log('Recommendation saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw error;
    }
  };

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
      // First save the user profile
      const savedProfile = await saveUserProfile();
      if (!savedProfile) throw new Error('Failed to save profile');
      
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
      
      // Save the recommendation to database
      await saveRecommendation(data.recommendation, savedProfile.id);
      
      setRecommendation(data.recommendation);
      setCurrentStep(7);
      toast.success("Your personalized diet recommendation has been generated and saved!");
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
    setCurrentRecommendationId(null);
    setExistingProfileId(null);
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
        return (
          <ResultsStep 
            recommendation={recommendation} 
            onStartNew={resetForm}
            currentRecommendationId={currentRecommendationId}
            existingProfileId={existingProfileId}
          />
        );
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
