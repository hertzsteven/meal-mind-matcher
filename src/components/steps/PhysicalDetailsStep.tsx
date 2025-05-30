
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserData } from "@/types/userData";

interface PhysicalDetailsStepProps {
  userData: UserData;
  onInputChange: (field: keyof UserData, value: string) => void;
}

const PhysicalDetailsStep: React.FC<PhysicalDetailsStepProps> = ({ userData, onInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Physical Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={userData.weight}
            onChange={(e) => onInputChange('weight', e.target.value)}
            placeholder="Enter your weight"
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={userData.height}
            onChange={(e) => onInputChange('height', e.target.value)}
            placeholder="Enter your height"
          />
        </div>
      </div>
      <div>
        <Label>Activity Level</Label>
        <Select value={userData.activityLevel} onValueChange={(value) => onInputChange('activityLevel', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your activity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
            <SelectItem value="light">Light (1-3 days/week)</SelectItem>
            <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
            <SelectItem value="active">Active (6-7 days/week)</SelectItem>
            <SelectItem value="very-active">Very Active (2x/day, intense workouts)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PhysicalDetailsStep;
