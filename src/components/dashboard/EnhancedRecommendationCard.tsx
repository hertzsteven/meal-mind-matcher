
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Share, Bookmark, Mail, Printer } from "lucide-react";
import { renderMarkdownContent } from "@/utils/markdownRenderer";
import { toast } from "sonner";

interface EnhancedRecommendationCardProps {
  recommendation: string;
}

const EnhancedRecommendationCard: React.FC<EnhancedRecommendationCardProps> = ({
  recommendation
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);

  const getRecommendationPreview = (text: string) => {
    const words = text.split(' ');
    const previewLength = 50;
    if (words.length <= previewLength) return text;
    return words.slice(0, previewLength).join(' ') + '...';
  };

  const handleRating = (type: 'positive' | 'negative') => {
    setRating(type);
    toast.success(`Thank you for your feedback!`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Nutrition Recommendation',
        text: recommendation.substring(0, 200) + '...',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    toast.success('Recommendation saved to your favorites!');
  };

  const handleEmail = () => {
    toast.info('Preparing email...');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  if (!recommendation) return null;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Your Latest Recommendation
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
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
      <CardContent className="space-y-4">
        <div className="prose prose-lg max-w-none">
          {isExpanded 
            ? renderMarkdownContent(recommendation)
            : renderMarkdownContent(getRecommendationPreview(recommendation))
          }
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <div className="flex gap-2 mr-auto">
            <Button
              variant={rating === 'positive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRating('positive')}
              className={rating === 'positive' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Helpful
            </Button>
            <Button
              variant={rating === 'negative' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => handleRating('negative')}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              Not Helpful
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleEmail}>
              <Mail className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isExpanded && recommendation.split(' ').length > 50 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
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

export default EnhancedRecommendationCard;
