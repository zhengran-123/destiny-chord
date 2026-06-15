import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { sumDailyNutrition, sumDailyExercise } from '../utils/calculation';
import { getRecentDays, formatDateCN } from '../utils/date';

const PIE_COLORS = ['#ff8c00', '#3b82f6', '#eab308'];

export default function Analytics({ mealRecords, exerciseRecords, tasks, goals }) {
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'

  const weeklyData = useMemo(() => {
    const days = getRecentDays(7);
    return days.map(ds => {
      const dayMeals = mealRecords.filter(m => m.date === ds);
      const dayEx = exerciseRecords.filter(e => e.date === ds);
      const nutrition = sumDailyNutrition(dayMeals);
      return {
        date: ds,
        label: ds.slice(5),
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        exerciseVolume: sumDailyExercise(dayEx),
      };
    });
  }, [mealRecords, exerciseRecords]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const ds = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayMeals = mealRecords.filter(m => m.date === ds);
      const nutrition = sumDailyNutrition(dayMeals);
      days.push({ date: ds, label: `${i}日`, calories: nutrition.calories, protein: nutrition.protein, exerciseVolume: sumDailyExercise(exerciseRecords.filter(e => e.date === ds)) });
    }
    return days;
  }, [mealRecords, exerciseRecords]);

  const todayNutrition = useMemo(() => {
    const today = getRecentDays(1)[0];
    const todayMeals = mealRecords.filter(m => m.date === today);
    return sumDailyNutrition(todayMeals);
  }, [mealRecords]);

  const pieData = useMemo(() => {
    if (todayNutrition.calories === 0) return [];
    return [
      { name: '蛋白质', value: todayNutrition.protein * 4, raw: todayNutrition.protein },
      { name: '碳水化合物', value: todayNutrition.carbs * 4, raw: todayNutrition.carbs },
      { name: '脂肪', value: todayNutrition.fat * 9, raw: todayNutrition.fat },
    ];
  }, [todayNutrition]);

  const weekStats = useMemo(() => {
    const activeDays = weeklyData.filter(d => d.calories > 0 || d.exerciseVolume > 0);
    if (activeDays.length === 0) return null;
    return {
      avgCalories: Math.round(activeDays.reduce((s, d) => s + d.calories, 0) / activeDays.length),
      maxCalories: Math.max(...weeklyData.map(d => d.calories)),
      minCalories: Math.min(...weeklyData.map(d => d.calories, 0)),
      totalProtein: parseFloat(weeklyData.reduce((s, d) => s + d.protein, 0).toFixed(1)),
      totalCarbs: parseFloat(weeklyData.reduce((s, d) => s + d.carbs, 0).toFixed(1)),
      totalFat: parseFloat(weeklyData.reduce((s, d) => s + d.fat, 0).toFixed(1)),
      totalExercise: weeklyData.reduce((s, d) => s + d.exerciseVolume, 0),
      activeDays: activeDays.length,
    };
  }, [weeklyData]);

  const data = viewMode === 'week' ? weeklyData : monthlyData;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">📈 数据分析</h2>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'week' ? 'bg-white dark:bg-gray-600 text-brand-orange shadow-sm' : 'text-gray-500'}`}
          >周视图</button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'month' ? 'bg-white dark:bg-gray-600 text-brand-orange shadow-sm' : 'text-gray-500'}`}
          >月视图</button>
        </div>
      </div>

      {/* 热量趋势图 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
          {viewMode === 'week' ? '最近 7 天热量趋势' : '本月热量趋势'}
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#9ca3af" fontSize={11} interval={viewMode === 'month' ? 2 : 0} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value, name) => [`${value} ${name === 'calories' ? 'kcal' : '次'}`, name === 'calories' ? '热量' : '运动量']}
            />
            <Bar dataKey="calories" name="热量" fill="#ff8c00" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 今日营养饼图 */}
      {pieData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">今日营养成分占比</h3>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${props.payload.raw}g`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-sm text-gray-500 space-y-1 text-center">
              <p>蛋白质: <span className="font-bold text-orange-500">{todayNutrition.protein}g</span></p>
              <p>碳水: <span className="font-bold text-blue-500">{todayNutrition.carbs}g</span></p>
              <p>脂肪: <span className="font-bold text-yellow-500">{todayNutrition.fat}g</span></p>
            </div>
          </div>
        </div>
      )}

      {/* 周统计 */}
      {weekStats && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">📊 本周统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem label="平均热量" value={`${weekStats.avgCalories}`} unit="kcal" color="text-orange-500" />
            <StatItem label="最高热量" value={`${weekStats.maxCalories}`} unit="kcal" color="text-red-500" />
            <StatItem label="总蛋白质" value={`${weekStats.totalProtein}`} unit="g" color="text-blue-500" />
            <StatItem label="总运动量" value={`${weekStats.totalExercise}`} unit="次" color="text-green-500" />
            <StatItem label="总碳水" value={`${weekStats.totalCarbs}`} unit="g" color="text-blue-400" />
            <StatItem label="总脂肪" value={`${weekStats.totalFat}`} unit="g" color="text-yellow-500" />
            <StatItem label="活跃天数" value={`${weekStats.activeDays}`} unit="/7天" color="text-purple-500" />
            <StatItem label="平均蛋白质" value={`${(weekStats.totalProtein / 7).toFixed(1)}`} unit="g/天" color="text-indigo-500" />
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value, unit, color }) {
  return (
    <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  );
}
