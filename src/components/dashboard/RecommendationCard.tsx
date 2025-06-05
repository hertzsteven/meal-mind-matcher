
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { renderMarkdownContent } from "@/utils/markdownRenderer";

interface RecommendationCardProps {
  recommendation: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation
}) => {
  const [isRecommendationExpanded, setIsRecommendationExpanded] = useState(false);

  // Function to truncate recommendation text for preview
  const getRecommendationPreview = (text: string) => {
    const words = text.split(' ');
    const previewLength = 50; // Show first 50 words
    if (words.length <= previewLength) return text;
    return words.slice(0, previewLength).join(' ') + '...';
  };

  if (!recommendation) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Your Latest Recommendation
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRecommendationExpanded(!isRecommendationExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isRecommendationExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Read More
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-lg max-w-none">
          {isRecommendationExpanded 
            ? renderMarkdownContent(recommendation)
            : renderMarkdownContent(getRecommendationPreview(recommendation))
          }
        </div>
        {!isRecommendationExpanded && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setIsRecommendationExpanded(true)}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              View Full Recommendation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
