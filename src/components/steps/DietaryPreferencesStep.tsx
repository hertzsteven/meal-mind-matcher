
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UserData } from "@/types/userData";

interface DietaryPreferencesStepProps {
  userData: UserData;
  onInputChange: (field: keyof UserData, value: string) => void;
  onRestrictionChange: (restriction: string, checked: boolean) => void;
}

const DietaryPreferencesStep: React.FC<DietaryPreferencesStepProps> = ({ 
  userData, 
  onInputChange, 
  onRestrictionChange 
}) => {
  const restrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Dairy-free',
    'Nut-free',
    'Low-carb',
    'Keto',
    'Paleo',
    'Halal',
    'Kosher'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Dietary Preferences</h2>
      <div>
        <Label className="text-base font-medium">Dietary Restrictions (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {restrictions.map((restriction) => (
            <div key={restriction} className="flex items-center space-x-2">
              <Checkbox
                id={restriction}
                checked={userData.dietaryRestrictions.includes(restriction)}
                onCheckedChange={(checked) => onRestrictionChange(restriction, checked as boolean)}
              />
              <Label htmlFor={restriction}>{restriction}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="foodPreferences">Food Preferences & Dislikes</Label>
        <Textarea
          id="foodPreferences"
          value={userData.foodPreferences}
          onChange={(e) => onInputChange('foodPreferences', e.target.value)}
          placeholder="Tell us about foods you love, dislike, or are allergic to..."
          className="h-24"
        />
      </div>
    </div>
  );
};

export default DietaryPreferencesStep;
