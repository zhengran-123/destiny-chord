/**
 * localStorage 存储工具
 */

const STORAGE_KEYS = {
  MEALS: 'health_meal_records',
  EXERCISES: 'health_exercise_records',
  TASKS: 'health_tasks',
  CHECK_INS: 'health_check_ins',
  GOALS: 'health_goals',
  DARK_MODE: 'health_dark_mode',
  CUSTOM_FOODS: 'health_custom_foods',
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// 饮食记录
export function getMealRecords() { return safeGet(STORAGE_KEYS.MEALS, []); }
export function saveMealRecords(records) { return safeSet(STORAGE_KEYS.MEALS, records); }

// 运动记录
export function getExerciseRecords() { return safeGet(STORAGE_KEYS.EXERCISES, []); }
export function saveExerciseRecords(records) { return safeSet(STORAGE_KEYS.EXERCISES, records); }

// 任务
export function getTasks() { return safeGet(STORAGE_KEYS.TASKS, []); }
export function saveTasks(tasks) { return safeSet(STORAGE_KEYS.TASKS, tasks); }

// 打卡记录
export function getCheckIns() { return safeGet(STORAGE_KEYS.CHECK_INS, []); }
export function saveCheckIns(checkIns) { return safeSet(STORAGE_KEYS.CHECK_INS, checkIns); }

// 目标设置
export const DEFAULT_GOALS = {
  dailyCalories: 2000,
  dailyProtein: 150,
  dailyCarbs: 250,
  dailyFat: 65,
  dailySteps: 10000,
  workoutDays: 5,
};
export function getGoals() { return safeGet(STORAGE_KEYS.GOALS, DEFAULT_GOALS); }
export function saveGoals(goals) { return safeSet(STORAGE_KEYS.GOALS, goals); }

// 深色模式
export function getDarkMode() { return safeGet(STORAGE_KEYS.DARK_MODE, false); }
export function saveDarkMode(enabled) { return safeSet(STORAGE_KEYS.DARK_MODE, enabled); }

// 自定义食物
export function getCustomFoods() { return safeGet(STORAGE_KEYS.CUSTOM_FOODS, []); }
export function saveCustomFoods(foods) { return safeSet(STORAGE_KEYS.CUSTOM_FOODS, foods); }

// 导出所有数据
export function exportAllData(mealRecords, exerciseRecords, tasks, checkIns, goals, customFoods) {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    meals: mealRecords,
    exercises: exerciseRecords,
    tasks: tasks,
    checkIns: checkIns,
    goals: goals,
    customFoods: customFoods,
  };
}

// 导入数据
export function importAllData(jsonData) {
  const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
  if (!data || !data.version) throw new Error('无效的数据格式');

  if (data.meals) saveMealRecords(data.meals);
  if (data.exercises) saveExerciseRecords(data.exercises);
  if (data.tasks) saveTasks(data.tasks);
  if (data.checkIns) saveCheckIns(data.checkIns);
  if (data.goals) saveGoals(data.goals);
  if (data.customFoods) saveCustomFoods(data.customFoods);

  return data;
}
