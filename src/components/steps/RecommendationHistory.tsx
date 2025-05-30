
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { renderMarkdownContent } from "@/utils/markdownRenderer";

interface RecommendationHistory {
  id: string;
  recommendation_text: string;
  generated_at: string;
  profile: {
    id: string;
    name: string;
    age: number;
    gender: string;
    weight: number;
    height: number;
    activity_level: string;
    dietary_restrictions: string[];
    health_goals: string;
    current_diet: string;
    meals_per_day: string;
    cooking_time: string;
    budget: string;
    medical_conditions: string;
    food_preferences: string;
    additional_info: string;
    version: number;
  };
}

interface RecommendationHistoryProps {
  currentRecommendationId: string | null;
}

const RecommendationHistory: React.FC<RecommendationHistoryProps> = ({ 
  currentRecommendationId 
}) => {
  const { user } = useAuth();
  const [showHistory, setShowHistory] = useState(false);
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (showHistory && user) {
      loadRecommendationHistory();
    }
  }, [showHistory, user]);

  const loadRecommendationHistory = async () => {
    if (!user) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('diet_recommendations')
        .select(`
          id,
          recommendation_text,
          generated_at,
          user_diet_profiles!inner (
            id,
            name,
            age,
            gender,
            weight,
            height,
            activity_level,
            dietary_restrictions,
            health_goals,
            current_diet,
            meals_per_day,
            cooking_time,
            budget,
            medical_conditions,
            food_preferences,
            additional_info,
            version
          )
        `)
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false });

      if (error) throw error;

      const formattedHistory = data.map(item => ({
        id: item.id,
        recommendation_text: item.recommendation_text,
        generated_at: item.generated_at,
        profile: item.user_diet_profiles
      }));

      setRecommendationHistory(formattedHistory);
    } catch (error) {
      console.error('Error loading recommendation history:', error);
      toast.error("Failed to load recommendation history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatProfileData = (profile: RecommendationHistory['profile']) => {
    return [
      `Name: ${profile.name}`,
      `Age: ${profile.age}`,
      `Gender: ${profile.gender}`,
      `Weight: ${profile.weight} lbs`,
      `Height: ${profile.height} ft`,
      `Activity Level: ${profile.activity_level}`,
      `Dietary Restrictions: ${profile.dietary_restrictions?.join(', ') || 'None'}`,
      `Health Goals: ${profile.health_goals}`,
      `Current Diet: ${profile.current_diet}`,
      `Meals per Day: ${profile.meals_per_day}`,
      `Cooking Time: ${profile.cooking_time}`,
      `Budget: ${profile.budget}`,
      profile.medical_conditions && `Medical Conditions: ${profile.medical_conditions}`,
      profile.food_preferences && `Food Preferences: ${profile.food_preferences}`,
      profile.additional_info && `Additional Info: ${profile.additional_info}`
    ].filter(Boolean).join(' • ');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <History className="w-4 h-4" />
            View Previous Recommendations
          </span>
          {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {showHistory && (
          <div className="mt-4 space-y-4">
            {loadingHistory ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin mx-auto" />
                <span className="text-sm text-gray-600 mt-2">Loading history...</span>
              </div>
            ) : recommendationHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No previous recommendations found.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recommendationHistory.map((item, index) => (
                  <Card key={item.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">
                          Recommendation #{recommendationHistory.length - index}
                          {item.id === currentRecommendationId && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(item.generated_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <h5 className="font-medium text-sm mb-1">Profile Data Used:</h5>
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {formatProfileData(item.profile)} • Version: {item.profile.version}
                        </p>
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
                        <div className="max-h-32 overflow-y-auto text-sm">
                          {renderMarkdownContent(item.recommendation_text.split('\n').slice(0, 5).join('\n'))}
                          {item.recommendation_text.split('\n').length > 5 && (
                            <p className="text-gray-500 italic">... (truncated)</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationHistory;
