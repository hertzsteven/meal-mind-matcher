
import React from 'react';
import { Button } from "@/components/ui/button";
import { Utensils, Heart, Sparkles, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradePrompt from "@/components/subscription/UpgradePrompt";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const { subscribed, remainingRecommendations } = useSubscription();

  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <Utensils className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to NutriAI
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get personalized nutrition recommendations powered by AI. We'll analyze your lifestyle, 
          health goals, and dietary preferences to create a perfect nutrition plan just for you.
        </p>
      </div>

      {!subscribed && remainingRecommendations === 0 && (
        <div className="max-w-md mx-auto">
          <UpgradePrompt />
        </div>
      )}

      {!subscribed && remainingRecommendations > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center gap-2 justify-center text-blue-700 font-medium">
            <Sparkles className="w-4 h-4" />
            Free Trial: {remainingRecommendations} recommendation{remainingRecommendations === 1 ? '' : 's'} remaining
          </div>
        </div>
      )}

      {subscribed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center gap-2 justify-center text-green-700 font-medium">
            <Crown className="w-4 h-4" />
            Premium Member - Unlimited Recommendations
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="p-4 bg-white rounded-lg border">
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="font-semibold">Personalized</h3>
          <p className="text-sm text-gray-600">Tailored to your unique needs and goals</p>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="font-semibold">AI-Powered</h3>
          <p className="text-sm text-gray-600">Advanced algorithms for optimal nutrition</p>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <Utensils className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="font-semibold">Expert Advice</h3>
          <p className="text-sm text-gray-600">Based on nutritional science and research</p>
        </div>
      </div>

      <Button 
        onClick={onNext} 
        size="lg" 
        className="bg-green-600 hover:bg-green-700 text-white px-8"
        disabled={!subscribed && remainingRecommendations === 0}
      >
        {!subscribed && remainingRecommendations === 0 
          ? "Upgrade to Continue" 
          : "Get Started"
        }
        <Sparkles className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

export default WelcomeStep;
