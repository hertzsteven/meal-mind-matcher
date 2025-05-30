
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserData } from "@/types/userData";
import { toast } from "sonner";

export const useRecommendation = () => {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<string>('');
  const [currentRecommendationId, setCurrentRecommendationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const { error: updateError } = await supabase
        .from('user_diet_profiles')
        .update({ current_recommendation_id: data.id })
        .eq('id', profileId);

      if (updateError) {
        console.error('Error updating profile with recommendation ID:', updateError);
      }

      setCurrentRecommendationId(data.id);
      console.log('Recommendation saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw error;
    }
  };

  const generateRecommendation = async (userData: UserData, saveProfile: () => Promise<any>) => {
    setIsLoading(true);
    try {
      // First save the user profile
      const savedProfile = await saveProfile();
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
      
      // Save the recommendation to database and link it to the profile
      await saveRecommendation(data.recommendation, savedProfile.id);
      
      setRecommendation(data.recommendation);
      toast.success("Your personalized diet recommendation has been generated and saved!");
      return data.recommendation;
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast.error("Failed to generate recommendation. Please try again.");
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
