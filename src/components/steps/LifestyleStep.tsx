
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserData } from "@/types/userData";

interface LifestyleStepProps {
  userData: UserData;
  onInputChange: (field: keyof UserData, value: string) => void;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ userData, onInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Lifestyle & Habits</h2>
      <div>
        <Label htmlFor="currentDiet">Current Diet Description</Label>
        <Textarea
          id="currentDiet"
          value={userData.currentDiet}
          onChange={(e) => onInputChange('currentDiet', e.target.value)}
          placeholder="Describe your current eating habits..."
          className="h-24"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Meals per Day</Label>
          <Select value={userData.mealsPerDay} onValueChange={(value) => onInputChange('mealsPerDay', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select meals per day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 meals</SelectItem>
              <SelectItem value="3">3 meals</SelectItem>
              <SelectItem value="4">4 meals</SelectItem>
              <SelectItem value="5">5+ meals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Cooking Time Available</Label>
          <Select value={userData.cookingTime} onValueChange={(value) => onInputChange('cookingTime', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select cooking time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal (15 min or less)</SelectItem>
              <SelectItem value="moderate">Moderate (15-30 min)</SelectItem>
              <SelectItem value="flexible">Flexible (30+ min)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Budget for Food</Label>
        <Select value={userData.budget} onValueChange={(value) => onInputChange('budget', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Budget-friendly</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LifestyleStep;
