import React, { useMemo } from 'react';
import { Flame, TrendingUp, Target, Activity, CalendarCheck, Award } from 'lucide-react';
import { sumDailyNutrition, sumDailyExercise, goalPercentage } from '../utils/calculation';
import { getToday, formatDateCN } from '../utils/date';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SocialShare from './SocialShare';

function StatCard({ icon: Icon, label, value, unit, color, sub }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon size={20} className={`text-${color}-500`} />
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard({
  mealRecords, exerciseRecords, tasks, checkInDays, streak, goals, date, setDate, onCheckIn, isCheckedInToday
}) {
  const todayStr = getToday();

  const todayStats = useMemo(() => {
    const todayMeals = mealRecords.filter(m => m.date === todayStr);
    const todayExercises = exerciseRecords.filter(e => e.date === todayStr);
    const todayTasks = tasks.filter(t => t.date === todayStr);
    const nutrition = sumDailyNutrition(todayMeals);
    const exerciseVolume = sumDailyExercise(todayExercises);
    const exerciseCalories = todayExercises.reduce((s, e) => s + (e.caloriesBurned || 0), 0);
    const completedTasks = todayTasks.filter(t => t.completed).length;

    return {
      totalCalories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      exerciseCount: todayExercises.length,
      exerciseVolume,
      exerciseCalories,
      taskProgress: {
        completed: completedTasks,
        total: todayTasks.length,
        percentage: todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0,
      },
    };
  }, [mealRecords, exerciseRecords, tasks, todayStr]);

  // 周热量数据
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayMeals = mealRecords.filter(m => m.date === ds);
      const nutrition = sumDailyNutrition(dayMeals);
      days.push({
        date: ds,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        calories: nutrition.calories,
        protein: nutrition.protein,
      });
    }
    return days;
  }, [mealRecords]);

  const calPercentage = goalPercentage(todayStats.totalCalories, goals.dailyCalories);
  const proteinPercentage = goalPercentage(todayStats.protein, goals.dailyProtein);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 日期选择和打卡区域 */}
      <div className="bg-gradient-to-r from-brand-orange to-brand-orange-light rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium opacity-90">{formatDateCN(todayStr)}</h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
                <Flame size={18} />
                <span className="text-2xl font-bold">{streak}</span>
                <span className="text-sm opacity-80">天连续打卡</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
                <CalendarCheck size={18} />
                <span className="text-sm">{checkInDays.length} 天累计</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SocialShare todayStats={todayStats} streak={streak} />
            <button
              onClick={onCheckIn}
              disabled={isCheckedInToday}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                isCheckedInToday
                  ? 'bg-white/30 cursor-not-allowed'
                  : 'bg-white text-brand-orange hover:shadow-lg hover:scale-105 active:scale-95'
              }`}
            >
              {isCheckedInToday ? '✅ 已打卡' : '📝 今日打卡'}
            </button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="今日热量" value={todayStats.totalCalories} unit="kcal" color="orange" />
        <StatCard icon={Target} label="蛋白质" value={todayStats.protein} unit="g" color="blue" />
        <StatCard icon={Activity} label="运动项数" value={todayStats.exerciseCount} unit="项" color="green" />
        <StatCard icon={Award} label="任务进度" value={`${todayStats.taskProgress.completed}/${todayStats.taskProgress.total}`} unit="" color="purple" />
      </div>

      {/* 热量收支分析 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          ⚖️ 今日热量收支
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">🍽️ 摄入</p>
            <p className="text-xl font-bold text-orange-500">{todayStats.totalCalories}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">🔥 运动消耗</p>
            <p className="text-xl font-bold text-green-500">{todayStats.exerciseCalories}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
          <div className={`rounded-xl p-3 ${
            todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories > 0
              ? 'bg-red-50 dark:bg-red-900/20'
              : 'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <p className="text-xs text-gray-500 mb-1">📊 净余额</p>
            <p className={`text-xl font-bold ${
              todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories > 0
                ? 'text-red-500'
                : 'text-blue-500'
            }`}>
              {todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories > 0 ? '+' : ''}
              {todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories}
            </p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
        </div>

        {/* 可视化进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>基础代谢约 1800 kcal</span>
            <span>目标 {goals.dailyCalories} kcal</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden flex">
            {/* 基础代谢 */}
            <div className="h-full bg-gray-300 dark:bg-gray-600" style={{ width: '65%' }} />
            {/* 运动消耗 */}
            {todayStats.exerciseCalories > 0 && (
              <div className="h-full bg-green-400" style={{ width: `${Math.min(30, todayStats.exerciseCalories / 1800 * 100)}%` }} />
            )}
            {/* 摄入热量（超过基础代谢+运动的部分标红） */}
            {todayStats.totalCalories > 0 && (
              <div
                className={`h-full ${todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories > 0 ? 'bg-red-400' : 'bg-orange-400'}`}
                style={{ width: `${Math.min(35, todayStats.totalCalories / 1800 * 100)}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>💤 基础代谢 ≈1800</span>
            <span>🔥 运动 {todayStats.exerciseCalories}</span>
            <span>🍽️ 摄入 {todayStats.totalCalories}</span>
          </div>
        </div>

        {/* 结论 */}
        <div className={`mt-4 p-3 rounded-xl text-sm font-medium text-center ${
          todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories > 300
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800'
            : todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories < -500
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-200 dark:border-blue-800'
              : 'bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800'
        }`}>
          {todayStats.totalCalories === 0 ? (
            '📝 今天还没有记录饮食，开始记录吧'
          ) : todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories > 300 ? (
            <>⚠️ 今日热量盈余较大（+{todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories}kcal），建议增加运动或减少摄入</>
          ) : todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories < -500 ? (
            <>💡 今日热量缺口较大（{todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories}kcal），注意补充营养</>
          ) : todayStats.totalCalories - todayStats.exerciseCalories - goals.dailyCalories >= 0 ? (
            <>✅ 热量控制良好，收支基本平衡</>
          ) : (
            <>🎯 今日有适度热量缺口，有利于减脂目标</>
          )}
        </div>
      </div>

      {/* 目标进度条 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Flame size={16} className="text-orange-500" />
            热量目标
          </h3>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{todayStats.totalCalories} kcal</span>
            <span>{goals.dailyCalories} kcal</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                calPercentage > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'
              }`}
              style={{ width: `${Math.min(100, calPercentage)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{calPercentage}% 达成</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Target size={16} className="text-blue-500" />
            蛋白质目标
          </h3>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{todayStats.protein} g</span>
            <span>{goals.dailyProtein} g</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                proteinPercentage > 100 ? 'bg-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-500'
              }`}
              style={{ width: `${Math.min(100, proteinPercentage)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{proteinPercentage}% 达成</p>
        </div>
      </div>

      {/* 营养分布和运动统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">📊 今日营养分布</h3>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-orange-500">{todayStats.protein}g</div>
              <div className="text-xs text-gray-400">蛋白质</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{todayStats.carbs}g</div>
              <div className="text-xs text-gray-400">碳水化合物</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{todayStats.fat}g</div>
              <div className="text-xs text-gray-400">脂肪</div>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden flex">
            {todayStats.protein + todayStats.carbs + todayStats.fat > 0 && (
              <>
                <div
                  className="h-full bg-orange-400 transition-all"
                  style={{ width: `${(todayStats.protein / (todayStats.protein + todayStats.carbs + todayStats.fat) * 100) || 0}%` }}
                />
                <div
                  className="h-full bg-blue-400 transition-all"
                  style={{ width: `${(todayStats.carbs / (todayStats.protein + todayStats.carbs + todayStats.fat) * 100) || 0}%` }}
                />
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${(todayStats.fat / (todayStats.protein + todayStats.carbs + todayStats.fat) * 100) || 0}%` }}
                />
              </>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">💪 今日运动统计</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">运动项目数</span>
            <span className="font-bold text-green-500">{todayStats.exerciseCount} 项</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">总运动量</span>
            <span className="font-bold text-green-500">{todayStats.exerciseVolume} 次</span>
          </div>
        </div>
      </div>

      {/* 周热量趋势图 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-orange-500" />
          最近 7 天热量趋势
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`${value} kcal`, '热量']}
            />
            <Bar dataKey="calories" fill="#ff8c00" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
