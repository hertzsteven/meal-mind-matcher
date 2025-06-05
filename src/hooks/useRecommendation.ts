
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/userData";
import { useSubscription } from "./useSubscription";

export const useRecommendation = () => {
  const [recommendation, setRecommendation] = useState('');
  const [currentRecommendationId, setCurrentRecommendationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { canUseFeature, incrementUsage, subscribed } = useSubscription();

  const generateRecommendation = async (userData: UserData, saveUserProfile: () => Promise<string | null>) => {
    console.log('Starting recommendation generation...');
    
    // Check if user can use the feature
    if (!canUseFeature()) {
      toast.error("You've reached your daily limit. Upgrade to Premium for unlimited recommendations!");
      throw new Error("Usage limit exceeded");
    }

    setIsLoading(true);
    
    try {
      console.log('Saving user profile...');
      const profileId = await saveUserProfile();
      
      if (!profileId) {
        throw new Error('Failed to save user profile');
      }

      console.log('Profile saved, calling recommendation function...');
      
      const { data, error } = await supabase.functions.invoke('generate-diet-recommendation', {
        body: { 
          userData,
          profileId 
        }
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      if (!data?.recommendation) {
        throw new Error('No recommendation received from the function');
      }

      console.log('Recommendation generated successfully');
      setRecommendation(data.recommendation);
      setCurrentRecommendationId(data.recommendationId);
      
      // Increment usage only for non-premium users
      if (!subscribed) {
        await incrementUsage();
      }
      
      toast.success("Your personalized nutrition recommendation is ready!");
      
    } catch (error: any) {
      console.error('Error generating recommendation:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      toast.error(`Failed to generate recommendation: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetRecommendation = () => {
    setRecommendation('');
    setCurrentRecommendationId(null);
  };

  return {
    recommendation,
    currentRecommendationId,
    isLoading,
    generateRecommendation,
    resetRecommendation,
    setRecommendation,
    setCurrentRecommendationId
  };
};
