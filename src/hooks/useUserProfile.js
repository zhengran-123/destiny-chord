import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'health_user_profile';

export const DEFAULT_PROFILE = {
  name: '',
  age: 25,
  height: 170,
  weight: 70,
  gender: 'male',
  activityLevel: 'moderate',
};

function getProfile() {
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }; }
  catch { return { ...DEFAULT_PROFILE }; }
}
function saveProfile(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

// BMR Mifflin-St Jeor
function calcBMR(weight, height, age, gender) {
  if (gender === 'male') return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

// TDEE = BMR × 活动系数
const ACTIVITY_FACTORS = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };

export function useUserProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => { setProfile(getProfile()); }, []);

  const updateProfile = useCallback((data) => {
    const merged = { ...getProfile(), ...data };
    setProfile(merged);
    saveProfile(merged);
  }, []);

  const bmr = calcBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = Math.round(bmr * (ACTIVITY_FACTORS[profile.activityLevel] || 1.55));

  // 根据个人体重调整运动热量消耗
  const getPersonalizedExerciseKcal = useCallback((baseKcal30) => {
    // baseKcal30 是70kg基准，按比例调整
    return Math.round(baseKcal30 * profile.weight / 70);
  }, [profile.weight]);

  const bmiVal = profile.height > 0 ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : 0;

  return { profile, updateProfile, bmr, tdee, getPersonalizedExerciseKcal, bmiVal };
}
