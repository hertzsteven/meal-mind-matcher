
import { UserData } from "@/types/userData";

export const validateStep = (currentStep: number, userData: UserData): boolean => {
  switch (currentStep) {
    case 1:
      return !!(userData.name && userData.age && userData.gender);
    case 2:
      return !!(userData.weight && userData.height && userData.activityLevel);
    case 3:
      return !!(userData.currentDiet && userData.mealsPerDay && userData.cookingTime);
    case 4:
      return true; // Step 4 (Dietary Preferences) has no required fields
    case 5:
      return !!userData.healthGoals; // Health goals is required on step 5
    default:
      return true;
  }
};

export const getEmptyUserData = (): UserData => ({
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
