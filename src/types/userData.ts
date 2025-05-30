
export interface UserData {
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
