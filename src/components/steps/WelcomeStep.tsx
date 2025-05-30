
import React from 'react';
import { Button } from "@/components/ui/button";
import { Utensils, Heart, Target, Sparkles, ArrowRight } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <Utensils className="w-10 h-10 text-green-600" />
      </div>
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Personalized Diet Recommendations</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get AI-powered dietary advice tailored specifically to your lifestyle, goals, and preferences. 
          Let's create a nutrition plan that works for you.
        </p>
      </div>
      <div className="flex justify-center gap-8 py-6">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-gray-700">Health-focused</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          <span className="text-gray-700">Goal-oriented</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-gray-700">AI-powered</span>
        </div>
      </div>
      <Button onClick={onNext} size="lg" className="bg-green-600 hover:bg-green-700">
        Get Started <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default WelcomeStep;
