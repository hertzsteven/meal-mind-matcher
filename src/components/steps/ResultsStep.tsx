import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Mail, Printer, History, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

interface ResultsStepProps {
  recommendation: string;
  onStartNew: () => void;
  currentRecommendationId: string | null;
  existingProfileId: string | null;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ 
  recommendation, 
  onStartNew, 
  currentRecommendationId,
  existingProfileId 
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

  const renderMarkdownContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-gray-800">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium mt-5 mb-2 text-gray-700">{line.slice(4)}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-700">{line.slice(5)}</h4>;
      }
      if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        return <p key={index} className="font-semibold text-base mt-3 mb-2 text-gray-800">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('*') && line.endsWith('*') && !line.includes('**') && line.length > 2) {
        return <p key={index} className="font-medium text-base mt-3 mb-2 text-gray-700 italic">{line.slice(1, -1)}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-2 text-gray-700 list-disc">{line.slice(2)}</li>;
      }
      if (line.startsWith('* ')) {
        return <li key={index} className="ml-6 mb-2 text-gray-700 list-disc">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\. /)) {
        const number = line.match(/^(\d+)\. (.*)$/);
        if (number) {
          return <li key={index} className="ml-6 mb-2 text-gray-700 list-decimal">{number[2]}</li>;
        }
      }
      if (line.trim() === '') {
        return <div key={index} className="mb-3" />;
      }
      if (line.includes('**')) {
        const parts = line.split(/(\*\*[^*]+\*\*)/);
        return (
          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIndex} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
      return <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>;
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Diet Recommendation</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              h1 { color: #059669; font-size: 28px; margin-bottom: 20px; }
              h2 { color: #047857; font-size: 24px; margin-top: 30px; margin-bottom: 15px; }
              h3 { color: #065f46; font-size: 20px; margin-top: 25px; margin-bottom: 10px; }
              h4 { color: #064e3b; font-size: 18px; margin-top: 20px; margin-bottom: 8px; }
              h5 { color: #064e3b; font-size: 16px; margin-top: 15px; margin-bottom: 6px; }
              p { margin-bottom: 12px; }
              li { margin-bottom: 6px; margin-left: 20px; }
              .header { text-align: center; margin-bottom: 40px; }
              .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🥗 Your Personalized Diet Recommendation</h1>
              <p style="color: #666;">Generated by NutriAI on ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">
              ${formatRecommendationForPrint(recommendation)}
            </div>
            <div class="footer">
              <p>Created with NutriAI - Your AI-Powered Nutrition Assistant</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
    toast.success("Print dialog opened");
  };

  const handleEmail = async () => {
    try {
      toast.info("Preparing to send email...");
      
      const { data, error } = await supabase.functions.invoke('send-recommendation-email', {
        body: { recommendation }
      });

      if (error) {
        throw error;
      }

      toast.success("Recommendation sent to your email!");
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  const formatRecommendationForPrint = (text: string) => {
    return text.split('\n').map((line) => {
      if (line.startsWith('# ')) {
        return `<h1>${line.slice(2)}</h1>`;
      }
      if (line.startsWith('## ')) {
        return `<h2>${line.slice(3)}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3>${line.slice(4)}</h3>`;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return `<h4>${line.slice(2, -2)}</h4>`;
      }
      if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
        return `<h5>${line.slice(1, -1)}</h5>`;
      }
      if (line.startsWith('- ')) {
        return `<li>${line.slice(2)}</li>`;
      }
      if (line.trim() === '') {
        return '<br>';
      }
      return `<p>${line}</p>`;
    }).join('');
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
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold">Your Personalized Diet Recommendation</h2>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-lg max-w-none">
            {renderMarkdownContent(recommendation)}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation History Section */}
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
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleEmail} variant="outline" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Recommendation
        </Button>
        
        <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
          <Printer className="w-4 h-4" />
          Print Recommendation
        </Button>
        
        <Button onClick={onStartNew} variant="outline">
          Start New Assessment
        </Button>
      </div>
    </div>
  );
};

export default ResultsStep;
