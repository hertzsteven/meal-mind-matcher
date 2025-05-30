import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserData } from "@/types/userData";
import { User, Activity, Target, Clock, DollarSign, FileText, X } from "lucide-react";
import { renderMarkdownContent } from "@/utils/markdownRenderer";

interface DashboardProps {
  userData: UserData;
  recommendation: string;
  currentRecommendationId: string | null;
  onTakeQuestionnaire: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userData,
  recommendation,
  currentRecommendationId,
  onTakeQuestionnaire
}) => {
  const [showFullRecommendation, setShowFullRecommendation] = useState(false);

  const formatRecommendationPreview = (text: string) => {
    if (!text) return "No recommendation available";
    
    // Remove markdown formatting for preview
    const cleanText = text
      .replace(/^#+\s+/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/^[-*]\s+/gm, '• ') // Convert lists to bullets
      .replace(/^\d+\.\s+/gm, '• '); // Convert numbered lists to bullets
    
    return cleanText.length > 200 ? `${cleanText.substring(0, 200)}...` : cleanText;
  };

  const renderMarkdownPreview = (text: string) => {
    if (!text) return <p className="text-gray-500">No recommendation available</p>;
    
    const preview = formatRecommendationPreview(text);
    return <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{preview}</p>;
  };

  if (showFullRecommendation) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Full Recommendation</h1>
          <Button 
            variant="outline" 
            onClick={() => setShowFullRecommendation(false)}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-lg max-w-none">
              {renderMarkdownContent(recommendation)}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button onClick={onTakeQuestionnaire} variant="outline">
            Update Profile & Get New Recommendation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userData.name || 'User'}!</h1>
        <p className="text-gray-600">Here's your nutrition profile summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-blue-600" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Age:</strong> {userData.age || 'Not specified'}</div>
            <div><strong>Gender:</strong> {userData.gender || 'Not specified'}</div>
            <div><strong>Weight:</strong> {userData.weight ? `${userData.weight} kg` : 'Not specified'}</div>
            <div><strong>Height:</strong> {userData.height ? `${userData.height} cm` : 'Not specified'}</div>
          </CardContent>
        </Card>

        {/* Activity & Lifestyle */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-green-600" />
              Lifestyle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Activity Level:</strong> {userData.activityLevel || 'Not specified'}</div>
            <div><strong>Meals/Day:</strong> {userData.mealsPerDay || 'Not specified'}</div>
            <div><strong>Cooking Time:</strong> {userData.cookingTime || 'Not specified'}</div>
            <div><strong>Budget:</strong> {userData.budget || 'Not specified'}</div>
          </CardContent>
        </Card>

        {/* Health Goals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-purple-600" />
              Health Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Goals:</strong> {userData.healthGoals || 'Not specified'}</div>
            <div><strong>Current Diet:</strong> {userData.currentDiet || 'Not specified'}</div>
            {userData.dietaryRestrictions.length > 0 && (
              <div><strong>Restrictions:</strong> {userData.dietaryRestrictions.join(', ')}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Your Current Recommendation
          </CardTitle>
          <CardDescription>
            AI-generated personalized nutrition advice based on your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendation ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                {renderMarkdownPreview(recommendation)}
                {recommendation.length > 200 && (
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 mt-2"
                    onClick={() => setShowFullRecommendation(true)}
                  >
                    View full recommendation
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={onTakeQuestionnaire} variant="outline">
                  Update Profile & Get New Recommendation
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No recommendation generated yet</p>
              <Button onClick={onTakeQuestionnaire}>
                Complete Questionnaire to Get Recommendation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your nutrition profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onTakeQuestionnaire} variant="default">
              Retake Questionnaire
            </Button>
            <Button variant="outline" disabled>
              Download Report (Coming Soon)
            </Button>
            <Button variant="outline" disabled>
              Share Profile (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
