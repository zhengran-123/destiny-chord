import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'health_user_profile';
const ONBOARDING_KEY = 'health_onboarding_done';

export const DEFAULT_PROFILE = {
  name: '',
  age: 25,
  height: 170,
  weight: 70,
  gender: 'male',
  activityLevel: 'moderate',
  goal: 'health',
  dietPreference: 'normal',
  equipment: 'none',
  limitations: [],
  sessionDuration: 30,
  trainingFrequency: 3,
};

function getProfile() {
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }; }
  catch { return { ...DEFAULT_PROFILE }; }
}
function saveProfile(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

// BMR Mifflin-St Jeor
export function calcBMR(weight, height, age, gender) {
  if (gender === 'male') return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

const ACTIVITY_FACTORS = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };

/** 根据目标返回建议摄入热量 */
export function calcRecommendedCalories(tdee, goal, weight) {
  switch (goal) {
    case 'lose_fat': return Math.round(tdee - 400);
    case 'build_muscle': return Math.round(tdee + 300);
    case 'shape': return Math.round(tdee - 150);
    case 'maintain': return tdee;
    default: return tdee - 100;
  }
}

/** 根据目标和体重推荐蛋白质 */
export function calcRecommendedProtein(weight, goal) {
  switch (goal) {
    case 'build_muscle': return Math.round(weight * 2.0);
    case 'lose_fat': return Math.round(weight * 1.8);
    case 'shape': return Math.round(weight * 1.6);
    default: return Math.round(weight * 1.2);
  }
}

export function isOnboardingDone() {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function markOnboardingDone() {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

export function resetOnboarding() {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(STORAGE_KEY);
}

export function useUserProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setOnboardingDone(isOnboardingDone());
  }, []);

  const updateProfile = useCallback((data) => {
    const merged = { ...getProfile(), ...data };
    setProfile(merged);
    saveProfile(merged);
  }, []);

  const completeOnboarding = useCallback((data) => {
    const merged = { ...DEFAULT_PROFILE, ...data, onboardingCompleted: true };
    setProfile(merged);
    saveProfile(merged);
    markOnboardingDone();
    setOnboardingDone(true);
  }, []);

  const bmr = calcBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = Math.round(bmr * (ACTIVITY_FACTORS[profile.activityLevel] || 1.55));
  const recommendedCalories = calcRecommendedCalories(tdee, profile.goal, profile.weight);
  const recommendedProtein = calcRecommendedProtein(profile.weight, profile.goal);

  const getPersonalizedExerciseKcal = useCallback((baseKcal30) => {
    return Math.round(baseKcal30 * profile.weight / 70);
  }, [profile.weight]);

  const bmiVal = profile.height > 0 ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : 0;

  return {
    profile, updateProfile, completeOnboarding, onboardingDone,
    bmr, tdee, recommendedCalories, recommendedProtein,
    getPersonalizedExerciseKcal, bmiVal,
  };
}
