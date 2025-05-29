
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Utensils, Heart, Target, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface UserData {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  activityLevel: string;
  dietaryRestrictions: string[];
  healthGoals: string;
  currentDiet: string;
  mealsPerDay: string;
  cookingTime: string;
  budget: string;
  medicalConditions: string;
  foodPreferences: string;
  additionalInfo: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string>('');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    dietaryRestrictions: [],
    healthGoals: '',
    currentDiet: '',
    mealsPerDay: '',
    cookingTime: '',
    budget: '',
    medicalConditions: '',
    foodPreferences: '',
    additionalInfo: ''
  });

  const steps = [
    'Welcome',
    'Basic Info',
    'Physical Details',
    'Lifestyle',
    'Dietary Preferences',
    'Health & Goals',
    'Additional Info',
    'Results'
  ];

  const handleInputChange = (field: keyof UserData, value: string | string[]) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleRestrictionChange = (restriction: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, restriction]
        : prev.dietaryRestrictions.filter(r => r !== restriction)
    }));
  };

  const generateRecommendation = async () => {
    setIsLoading(true);
    try {
      const prompt = `Based on the following user information, create a comprehensive, personalized dietary recommendation:

      Personal Details:
      - Name: ${userData.name}
      - Age: ${userData.age}
      - Gender: ${userData.gender}
      - Weight: ${userData.weight}
      - Height: ${userData.height}
      - Activity Level: ${userData.activityLevel}

      Dietary Information:
      - Current Diet: ${userData.currentDiet}
      - Dietary Restrictions: ${userData.dietaryRestrictions.join(', ') || 'None'}
      - Meals per Day: ${userData.mealsPerDay}
      - Cooking Time Available: ${userData.cookingTime}
      - Budget: ${userData.budget}

      Health & Goals:
      - Health Goals: ${userData.healthGoals}
      - Medical Conditions: ${userData.medicalConditions || 'None mentioned'}
      - Food Preferences: ${userData.foodPreferences}
      - Additional Information: ${userData.additionalInfo || 'None'}

      Please provide a detailed dietary recommendation that includes:
      1. A summary of their current situation
      2. Specific dietary recommendations tailored to their goals
      3. Sample meal ideas for different times of day
      4. Nutritional guidelines and portion suggestions
      5. Tips for implementation and sustainability
      6. Any important considerations based on their restrictions or conditions

      Format the response in a clear, encouraging, and actionable way.`;

      // Note: In a real implementation, you would make an API call to OpenAI here
      // For this demo, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendation = `Hello ${userData.name}! Based on your information, here's your personalized dietary recommendation:

**Your Profile Summary:**
You're a ${userData.age}-year-old ${userData.gender} with ${userData.activityLevel} activity level, aiming for ${userData.healthGoals}. Your current approach of ${userData.currentDiet} provides a good foundation to build upon.

**Recommended Dietary Plan:**

*Daily Structure:*
- ${userData.mealsPerDay} balanced meals
- Focus on whole foods and nutrient density
- Portion control aligned with your ${userData.activityLevel} lifestyle

*Key Recommendations:*
1. **Protein:** Include lean sources at each meal (aim for 0.8-1g per kg body weight)
2. **Carbohydrates:** Choose complex carbs like quinoa, sweet potatoes, and whole grains
3. **Healthy Fats:** Incorporate avocados, nuts, seeds, and olive oil
4. **Hydration:** Aim for 8-10 glasses of water daily

*Sample Meal Ideas:*

**Breakfast:**
- Greek yogurt with berries and nuts
- Oatmeal with banana and almond butter
- Vegetable omelet with whole grain toast

**Lunch:**
- Quinoa bowl with roasted vegetables and protein
- Large salad with mixed greens, protein, and healthy fats
- Soup with whole grain bread

**Dinner:**
- Grilled protein with steamed vegetables and sweet potato
- Stir-fry with brown rice
- Baked fish with roasted Brussels sprouts

*Implementation Tips:*
- Start with small changes and gradually build habits
- Meal prep on weekends to save time during busy weekdays
- Keep healthy snacks readily available
- Listen to your body's hunger and fullness cues

*Special Considerations:*
${userData.dietaryRestrictions.length > 0 ? `Your dietary restrictions (${userData.dietaryRestrictions.join(', ')}) have been considered in these recommendations.` : ''}
${userData.medicalConditions ? `Given your mentioned health considerations, please consult with a healthcare provider before making significant dietary changes.` : ''}

Remember, sustainable changes happen gradually. Focus on progress, not perfection, and celebrate small wins along the way!`;

      setRecommendation(mockRecommendation);
      setCurrentStep(7);
    } catch (error) {
      toast.error("Failed to generate recommendation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return userData.name && userData.age && userData.gender;
      case 2:
        return userData.weight && userData.height && userData.activityLevel;
      case 3:
        return userData.currentDiet && userData.mealsPerDay && userData.cookingTime;
      case 4:
        return userData.healthGoals;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
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
            <Button onClick={nextStep} size="lg" className="bg-green-600 hover:bg-green-700">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={userData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
            </div>
            <div>
              <Label>Gender</Label>
              <RadioGroup 
                value={userData.gender} 
                onValueChange={(value) => handleInputChange('gender', value)}
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

      case 2:
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
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Enter your weight"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={userData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="Enter your height"
                />
              </div>
            </div>
            <div>
              <Label>Activity Level</Label>
              <Select value={userData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
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

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Lifestyle & Habits</h2>
            <div>
              <Label htmlFor="currentDiet">Current Diet Description</Label>
              <Textarea
                id="currentDiet"
                value={userData.currentDiet}
                onChange={(e) => handleInputChange('currentDiet', e.target.value)}
                placeholder="Describe your current eating habits..."
                className="h-24"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Meals per Day</Label>
                <Select value={userData.mealsPerDay} onValueChange={(value) => handleInputChange('mealsPerDay', value)}>
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
                <Select value={userData.cookingTime} onValueChange={(value) => handleInputChange('cookingTime', value)}>
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
              <Select value={userData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
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

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Dietary Preferences</h2>
            <div>
              <Label className="text-base font-medium">Dietary Restrictions (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[
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
                ].map((restriction) => (
                  <div key={restriction} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction}
                      checked={userData.dietaryRestrictions.includes(restriction)}
                      onCheckedChange={(checked) => handleRestrictionChange(restriction, checked as boolean)}
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
                onChange={(e) => handleInputChange('foodPreferences', e.target.value)}
                placeholder="Tell us about foods you love, dislike, or are allergic to..."
                className="h-24"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Health & Goals</h2>
            <div>
              <Label htmlFor="healthGoals">Primary Health Goals</Label>
              <Textarea
                id="healthGoals"
                value={userData.healthGoals}
                onChange={(e) => handleInputChange('healthGoals', e.target.value)}
                placeholder="What are your main health and nutrition goals? (e.g., weight loss, muscle gain, better energy, etc.)"
                className="h-24"
              />
            </div>
            <div>
              <Label htmlFor="medicalConditions">Medical Conditions or Health Concerns</Label>
              <Textarea
                id="medicalConditions"
                value={userData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                placeholder="Any medical conditions, medications, or health concerns we should consider? (optional)"
                className="h-20"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Additional Information</h2>
            <div>
              <Label htmlFor="additionalInfo">Anything Else We Should Know?</Label>
              <Textarea
                id="additionalInfo"
                value={userData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Any additional information about your lifestyle, preferences, or goals that would help us create better recommendations..."
                className="h-32"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Ready to Generate Your Plan!</h3>
              <p className="text-blue-700 text-sm">
                We'll use AI to analyze your information and create a personalized dietary recommendation 
                tailored specifically to your needs, goals, and preferences.
              </p>
            </div>
          </div>
        );

      case 7:
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
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <h3 key={index} className="font-semibold text-lg mt-4 mb-2">{line.slice(2, -2)}</h3>;
                    }
                    if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
                      return <h4 key={index} className="font-medium text-base mt-3 mb-1">{line.slice(1, -1)}</h4>;
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
              <Button 
                onClick={() => {
                  setCurrentStep(0);
                  setUserData({
                    name: '',
                    age: '',
                    gender: '',
                    weight: '',
                    height: '',
                    activityLevel: '',
                    dietaryRestrictions: [],
                    healthGoals: '',
                    currentDiet: '',
                    mealsPerDay: '',
                    cookingTime: '',
                    budget: '',
                    medicalConditions: '',
                    foodPreferences: '',
                    additionalInfo: ''
                  });
                  setRecommendation('');
                }}
                variant="outline"
              >
                Start New Assessment
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {currentStep > 0 && currentStep < 7 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {steps.length - 2}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round((currentStep / (steps.length - 2)) * 100)}% Complete
              </span>
            </div>
            <Progress value={(currentStep / (steps.length - 2)) * 100} className="w-full" />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              {renderStep()}
              
              {currentStep > 0 && currentStep < 7 && (
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep === 6 ? (
                    <Button
                      onClick={generateRecommendation}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? 'Generating...' : 'Generate My Plan'}
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
