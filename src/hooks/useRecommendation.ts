
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/userData";
import { useSubscription } from "./useSubscription";

export const useRecommendation = () => {
  const [recommendation, setRecommendation] = useState('');
  const [currentRecommendationId, setCurrentRecommendationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { canUseFeature, incrementUsage, subscribed, checkSubscription } = useSubscription();

  const generateRecommendation = async (userData: UserData, saveUserProfile: () => Promise<string | null>) => {
    console.log('🚀 Starting recommendation generation...');
    console.log('🔍 Current subscription state:', { subscribed, canUse: canUseFeature() });
    
    // Check if user can use the feature BEFORE starting
    const canUse = canUseFeature();
    console.log('✅ Can use feature check result:', canUse);
    
    if (!canUse) {
      console.log('❌ Usage limit exceeded, showing error');
      toast.error("You've reached your daily limit. Upgrade to Premium for unlimited recommendations!");
      throw new Error("Usage limit exceeded");
    }

    setIsLoading(true);
    
    try {
      console.log('💾 Saving user profile...');
      const profileId = await saveUserProfile();
      
      if (!profileId) {
        throw new Error('Failed to save user profile');
      }

      console.log('🤖 Calling recommendation function with profileId:', profileId);
      
      const { data, error } = await supabase.functions.invoke('generate-diet-recommendation', {
        body: { 
          userData,
          profileId 
        }
      });

      if (error) {
        console.error('💥 Function invocation error:', error);
        throw error;
      }

      if (!data?.recommendation) {
        throw new Error('No recommendation received from the function');
      }

      console.log('✨ Recommendation generated successfully');
      setRecommendation(data.recommendation);
      setCurrentRecommendationId(data.recommendationId);
      
      // Increment usage for non-premium users AFTER successful generation
      if (!subscribed) {
        console.log('📊 User is not subscribed, incrementing usage...');
        console.log('📊 About to call incrementUsage...');
        const success = await incrementUsage();
        console.log('📊 incrementUsage result:', success);
        
        if (!success) {
          console.warn('⚠️ Failed to increment usage counter');
        } else {
          console.log('🔄 Usage incremented successfully, refreshing subscription data...');
          // Force a refresh of subscription data to ensure UI reflects the new usage
          await checkSubscription();
          console.log('✅ Subscription data refreshed');
          
          // Additional check to verify the state is updated
          setTimeout(() => {
            console.log('🔍 Final canUseFeature check after increment:', canUseFeature());
          }, 100);
        }
      } else {
        console.log('👑 User is subscribed, skipping usage increment');
      }
      
      toast.success("Your personalized nutrition recommendation is ready!");
      
    } catch (error: any) {
      console.error('💥 Error generating recommendation:', error);
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
