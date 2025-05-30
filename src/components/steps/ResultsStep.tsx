
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { renderMarkdownContent } from "@/utils/markdownRenderer";
import RecommendationHistory from "./RecommendationHistory";
import RecommendationActions from "./RecommendationActions";

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

      <RecommendationHistory currentRecommendationId={currentRecommendationId} />
      
      <RecommendationActions 
        recommendation={recommendation}
        onStartNew={onStartNew}
      />
    </div>
  );
};

export default ResultsStep;
