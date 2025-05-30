
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserData, getEmptyUserData } from "@/types/userData";
import { toast } from "sonner";

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData>(getEmptyUserData());
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);

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

      if (error && error.code !== 'PGRST116') {
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
        const nextVersion = await getNextVersion();
        result = await supabase
          .from('user_diet_profiles')
          .update({
            ...profileData,
            version: nextVersion
          })
          .eq('id', existingProfileId)
          .select()
          .single();
      } else {
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

  const resetForm = () => {
    setUserData(getEmptyUserData());
    setExistingProfileId(null);
  };

  return {
    userData,
    existingProfileId,
    saveUserProfile,
    handleInputChange,
    handleRestrictionChange,
    resetForm
  };
};
