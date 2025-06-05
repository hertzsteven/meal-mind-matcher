
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Share, Bookmark, Mail, Printer, Star, Clock } from "lucide-react";
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
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getRecommendationPreview = (text: string) => {
    const words = text.split(' ');
    const previewLength = 50;
    if (words.length <= previewLength) return text;
    return words.slice(0, previewLength).join(' ') + '...';
  };

  const handleRating = (type: 'positive' | 'negative') => {
    setRating(type);
    toast.success(`Thank you for your ${type === 'positive' ? 'positive' : 'constructive'} feedback!`);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from favorites' : 'Added to favorites!');
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

  const handleEmail = () => {
    toast.info('Preparing email...');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  if (!recommendation) return null;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/30">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Your Latest Recommendation</h3>
              <p className="text-green-100 text-sm flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" />
                Generated today
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20 transition-colors"
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
      
      <CardContent className="p-6 space-y-6">
        <div className="prose prose-lg max-w-none">
          {isExpanded 
            ? renderMarkdownContent(recommendation)
            : renderMarkdownContent(getRecommendationPreview(recommendation))
          }
        </div>

        {/* Enhanced Action Buttons */}
        <div className="space-y-4">
          {/* Primary Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex gap-2">
              <Button
                variant={rating === 'positive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRating('positive')}
                className={rating === 'positive' 
                  ? 'bg-green-600 hover:bg-green-700 shadow-md' 
                  : 'hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200'
                }
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Helpful ({rating === 'positive' ? '1' : '0'})
              </Button>
              
              <Button
                variant={rating === 'negative' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => handleRating('negative')}
                className="hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Needs Work
              </Button>
            </div>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBookmark}
              className={`hover:scale-105 transition-all duration-200 ${
                isBookmarked 
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {isBookmarked ? (
                <Star className="w-4 h-4 fill-current" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 hover:scale-105 transition-all duration-200"
            >
              <Share className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEmail}
              className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 hover:scale-105 transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="hover:bg-gray-50 hover:border-gray-300 hover:scale-105 transition-all duration-200"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Expand Button for Long Content */}
        {!isExpanded && recommendation.split(' ').length > 50 && (
          <div className="text-center pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-200 shadow-sm"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              View Full Recommendation
              <span className="ml-2 text-xs text-gray-500">
                ({recommendation.split(' ').length - 50} more words)
              </span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedRecommendationCard;
