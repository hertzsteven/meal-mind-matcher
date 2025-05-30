
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserData } from "@/types/userData";

interface BasicInfoStepProps {
  userData: UserData;
  onInputChange: (field: keyof UserData, value: string) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ userData, onInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={userData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={userData.age}
            onChange={(e) => onInputChange('age', e.target.value)}
            placeholder="Enter your age"
          />
        </div>
      </div>
      <div>
        <Label>Gender</Label>
        <RadioGroup 
          value={userData.gender} 
          onValueChange={(value) => onInputChange('gender', value)}
          className="flex gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default BasicInfoStep;
