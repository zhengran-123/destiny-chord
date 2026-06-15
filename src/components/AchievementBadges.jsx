import React, { useMemo } from 'react';
import { Award, Medal, Star, Trophy, Zap, Flame, Target, Crown, Shield } from 'lucide-react';

// 成就系统 - 参考Keep徽章体系
const ACHIEVEMENTS = [
  // 连续打卡
  { id: 'streak-3', icon: '🔥', title: '连续3天', desc: '连续打卡3天', check: (s) => s.streak >= 3, color: 'from-orange-400 to-red-400', tier: 'bronze' },
  { id: 'streak-7', icon: '🔥', title: '周打卡王', desc: '连续打卡7天', check: (s) => s.streak >= 7, color: 'from-orange-400 to-red-500', tier: 'silver' },
  { id: 'streak-30', icon: '🔥', title: '月度勇士', desc: '连续打卡30天', check: (s) => s.streak >= 30, color: 'from-red-400 to-purple-500', tier: 'gold' },

  // 运动次数
  { id: 'workout-10', icon: '💪', title: '初出茅庐', desc: '累计完成10次运动', check: (s) => s.totalExercises >= 10, color: 'from-green-400 to-teal-400', tier: 'bronze' },
  { id: 'workout-50', icon: '💪', title: '运动达人', desc: '累计完成50次运动', check: (s) => s.totalExercises >= 50, color: 'from-green-400 to-teal-500', tier: 'silver' },
  { id: 'workout-100', icon: '💪', title: '百炼成钢', desc: '累计完成100次运动', check: (s) => s.totalExercises >= 100, color: 'from-teal-400 to-cyan-500', tier: 'gold' },

  // 热量消耗
  { id: 'burn-5000', icon: '⚡', title: '燃脂新星', desc: '累计消耗5000kcal', check: (s) => s.totalCaloriesBurned >= 5000, color: 'from-yellow-400 to-orange-400', tier: 'bronze' },
  { id: 'burn-20000', icon: '⚡', title: '燃脂达人', desc: '累计消耗20000kcal', check: (s) => s.totalCaloriesBurned >= 20000, color: 'from-yellow-400 to-orange-500', tier: 'silver' },
  { id: 'burn-50000', icon: '⚡', title: '燃脂之王', desc: '累计消耗50000kcal', check: (s) => s.totalCaloriesBurned >= 50000, color: 'from-orange-400 to-red-500', tier: 'gold' },

  // 力量训练
  { id: 'strength-1000', icon: '🏋️', title: '力量学徒', desc: '累计1000次力量动作', check: (s) => s.totalVolume >= 1000, color: 'from-blue-400 to-indigo-400', tier: 'bronze' },
  { id: 'strength-5000', icon: '🏋️', title: '力量大师', desc: '累计5000次力量动作', check: (s) => s.totalVolume >= 5000, color: 'from-blue-400 to-indigo-500', tier: 'silver' },
  { id: 'strength-10000', icon: '🏋️', title: '力量之王', desc: '累计10000次力量动作', check: (s) => s.totalVolume >= 10000, color: 'from-indigo-400 to-purple-500', tier: 'gold' },

  // 卡路里控制
  { id: 'calorie-master', icon: '🎯', title: '热量管理师', desc: '10天热量未超标', check: (s) => s.daysInCalorie <= 0, color: 'from-pink-400 to-rose-400', tier: 'special' },
  { id: 'perfect-day', icon: '⭐', title: '完美一天', desc: '单日摄入+运动+任务全达标', check: (s) => s.perfectDays > 0, color: 'from-amber-400 to-yellow-400', tier: 'special' },
];

const TIER_NAMES = { bronze: '🥉 青铜', silver: '🥈 白银', gold: '🥇 黄金', special: '💎 特殊' };

export default function AchievementBadges({ checkInDays, exerciseRecords, mealRecords, tasks, goals }) {
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    // 连续打卡
    const sorted = [...checkInDays].sort();
    let streak = 0;
    let checkDate = new Date(sorted[sorted.length-1] || todayStr);
    for (let i = sorted.length - 1; i >= 0; i--) {
      const expected = `${checkDate.getFullYear()}-${String(checkDate.getMonth()+1).padStart(2,'0')}-${String(checkDate.getDate()).padStart(2,'0')}`;
      if (sorted[i] === expected) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
      else break;
    }

    const totalExercises = exerciseRecords.length;
    const totalCaloriesBurned = exerciseRecords.reduce((s, e) => s + (e.caloriesBurned || 0), 0);
    const totalVolume = exerciseRecords.reduce((s, e) => s + (e.totalVolume || 0), 0);

    // 热量控制天数
    let daysInCalorie = 0;
    const dates = new Set([...mealRecords.map(m => m.date), ...exerciseRecords.map(e => e.date)]);
    dates.forEach(ds => {
      const dayCal = mealRecords.filter(m => m.date === ds).reduce((s, m) => s + m.calories, 0);
      if (dayCal > 0 && dayCal <= goals.dailyCalories) daysInCalorie++;
    });

    // 完美天数 (有饮食+有运动+任务全完成)
    let perfectDays = 0;
    dates.forEach(ds => {
      const dayCal = mealRecords.filter(m => m.date === ds).reduce((s, m) => s + m.calories, 0);
      const dayEx = exerciseRecords.filter(e => e.date === ds).length;
      const dayTasks = tasks.filter(t => t.date === ds);
      const tasksDone = dayTasks.length > 0 && dayTasks.every(t => t.completed);
      if (dayCal > 0 && dayEx > 0 && tasksDone) perfectDays++;
    });

    return { streak, totalExercises, totalCaloriesBurned, totalVolume, daysInCalorie, perfectDays };
  }, [checkInDays, exerciseRecords, mealRecords, tasks, goals]);

  const earned = ACHIEVEMENTS.filter(a => a.check(stats));
  const locked = ACHIEVEMENTS.filter(a => !a.check(stats));

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <Trophy size={22} className="text-yellow-500" /> 成就徽章
      </h2>

      {/* 已获得 */}
      {earned.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">🏆 已获得 ({earned.length}/{ACHIEVEMENTS.length})</h3>
          <div className="grid grid-cols-2 gap-3">
            {earned.map(a => (
              <div key={a.id} className={`bg-gradient-to-br ${a.color} rounded-2xl p-4 text-white shadow-md`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{a.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{a.title}</p>
                    <p className="text-xs text-white/70">{a.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-white/50 mt-2 block">{TIER_NAMES[a.tier]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 未解锁 */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">🔒 待解锁 ({locked.length})</h3>
        <div className="grid grid-cols-2 gap-3">
          {locked.map(a => (
            <div key={a.id} className="bg-gray-100 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-600 opacity-60">
              <div className="flex items-center gap-3">
                <span className="text-3xl grayscale">🔒</span>
                <div>
                  <p className="font-medium text-sm text-gray-500 dark:text-gray-400">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.desc}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 mt-2 block">{TIER_NAMES[a.tier]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
