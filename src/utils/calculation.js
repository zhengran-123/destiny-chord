/**
 * 计算工具函数
 */

/** 计算单餐营养成分 */
export function calcMealNutrition(food, quantity) {
  return {
    calories: Math.round((food.calories || 0) * quantity),
    protein: parseFloat(((food.protein || 0) * quantity).toFixed(1)),
    carbs: parseFloat(((food.carbs || 0) * quantity).toFixed(1)),
    fat: parseFloat(((food.fat || 0) * quantity).toFixed(1)),
  };
}

/** 汇总某天的营养数据 */
export function sumDailyNutrition(meals) {
  return meals.reduce((sum, m) => {
    sum.calories += m.calories || 0;
    sum.protein += m.protein || 0;
    sum.carbs += m.carbs || 0;
    sum.fat += m.fat || 0;
    return sum;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

/** 计算运动总量 */
export function calcExerciseVolume(sets, reps) {
  return sets * reps;
}

/** 汇总某天运动总量 */
export function sumDailyExercise(exercises) {
  return exercises.reduce((sum, e) => sum + (e.totalVolume || 0), 0);
}

/** 计算目标完成百分比 */
export function goalPercentage(current, goal) {
  if (!goal || goal === 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

/** 计算连续打卡天数 */
export function calcStreak(checkInDays) {
  if (!checkInDays || checkInDays.length === 0) return 0;
  const sorted = [...checkInDays].sort().reverse();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 最近一次打卡必须是今天或昨天
  if (sorted[0] !== todayStr) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    if (sorted[0] !== yStr) return 0;
  }

  let streak = 0;
  let checkDate = new Date(sorted[0]);
  for (const dayStr of sorted) {
    const expected = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (dayStr === expected) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** 生成周报告数据 */
export function generateWeeklyReport(mealRecords, exerciseRecords, tasks, dateStr) {
  const weekStart = new Date(dateStr);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayMeals = mealRecords.filter(m => m.date === ds);
    const dayEx = exerciseRecords.filter(e => e.date === ds);
    const dayTasks = tasks.filter(t => t.date === ds);
    const nutrition = sumDailyNutrition(dayMeals);
    days.push({
      date: ds,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      exerciseCount: dayEx.length,
      exerciseVolume: sumDailyExercise(dayEx),
      taskTotal: dayTasks.length,
      taskCompleted: dayTasks.filter(t => t.completed).length,
    });
  }

  const avgCalories = Math.round(days.reduce((s, d) => s + d.calories, 0) / 7);
  const maxCalories = Math.max(...days.map(d => d.calories));
  const minCalories = Math.min(...days.map(d => d.calories));
  const totalExercise = days.reduce((s, d) => s + d.exerciseVolume, 0);
  const avgProtein = parseFloat((days.reduce((s, d) => s + d.protein, 0) / 7).toFixed(1));

  return { days, avgCalories, maxCalories, minCalories, totalExercise, avgProtein };
}

/** 生成月报告数据 */
export function generateMonthlyReport(mealRecords, exerciseRecords, tasks, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalExercise = 0;

  for (let i = 1; i <= daysInMonth; i++) {
    const ds = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayMeals = mealRecords.filter(m => m.date === ds);
    const dayEx = exerciseRecords.filter(e => e.date === ds);
    const nutrition = sumDailyNutrition(dayMeals);
    days.push({
      date: ds,
      label: `${i}`,
      calories: nutrition.calories,
      protein: nutrition.protein,
      exerciseVolume: sumDailyExercise(dayEx),
    });
    totalCalories += nutrition.calories;
    totalProtein += nutrition.protein;
    totalExercise += sumDailyExercise(dayEx);
  }

  const activeDays = days.filter(d => d.calories > 0 || d.exerciseVolume > 0).length;
  const avgCalories = activeDays > 0 ? Math.round(totalCalories / activeDays) : 0;

  return {
    days,
    activeDays,
    avgCalories: Math.round(avgCalories),
    totalCalories: Math.round(totalCalories),
    totalProtein: parseFloat(totalProtein.toFixed(1)),
    totalExercise,
  };
}
