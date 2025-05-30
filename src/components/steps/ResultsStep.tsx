
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { UserData } from "@/types/userData";

interface ResultsStepProps {
  recommendation: string;
  onStartNew: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ recommendation, onStartNew }) => {
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
          <div className="prose prose-sm max-w-none">
            {recommendation.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-semibold mt-5 mb-2">{line.slice(3)}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.slice(4)}</h3>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h4 key={index} className="font-semibold text-base mt-3 mb-1">{line.slice(2, -2)}</h4>;
              }
              if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
                return <h5 key={index} className="font-medium text-base mt-3 mb-1">{line.slice(1, -1)}</h5>;
              }
              if (line.startsWith('- ')) {
                return <li key={index} className="ml-4 mb-1">{line.slice(2)}</li>;
              }
              if (line.trim() === '') {
                return <br key={index} />;
              }
              return <p key={index} className="mb-2">{line}</p>;
            })}
          </div>
        </CardContent>
      </Card>
      <div className="text-center">
        <Button onClick={onStartNew} variant="outline">
          Start New Assessment
        </Button>
      </div>
    </div>
  );
};

export default ResultsStep;
