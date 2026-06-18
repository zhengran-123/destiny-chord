import React, { useMemo, useState } from 'react';
import { Flame, CheckCircle2, Circle, Target, Droplets, Brain, ArrowRight, TrendingUp, Activity } from 'lucide-react';
import { getToday, formatDateCN } from '../utils/date';
import { sumDailyNutrition, sumDailyExercise, goalPercentage } from '../utils/calculation';
import { toast } from 'react-toastify';
import SocialShare from './SocialShare';
import WaterTracker from './WaterTracker';
import MoodTracker from './MoodTracker';

export default function TodayPage({
  mealRecords, exerciseRecords, tasks,
  checkInDays, streak, goals, waterHook,
  profile, tdee, recommendedCalories, recommendedProtein,
  onCheckIn, isCheckedInToday, onNavigate,
  addMeal, addExercise,
}) {
  const todayStr = getToday();
  const [showShare, setShowShare] = useState(false);

  // 今日统计数据
  const todayStats = useMemo(() => {
    const tm = mealRecords.filter(m => m.date === todayStr);
    const te = exerciseRecords.filter(e => e.date === todayStr);
    const tt = tasks.filter(t => t.date === todayStr);
    const n = sumDailyNutrition(tm);
    const ev = sumDailyExercise(te);
    return {
      calories: n.calories, protein: n.protein, carbs: n.carbs, fat: n.fat,
      exerciseCount: te.length, exerciseVolume: ev,
      exerciseCalories: te.reduce((s, e) => s + (e.caloriesBurned || 0), 0),
      taskCompleted: tt.filter(t => t.completed).length, taskTotal: tt.length,
    };
  }, [mealRecords, exerciseRecords, tasks, todayStr]);

  // 今日代办清单
  const todos = useMemo(() => {
    const items = [];
    // 饮食
    const mealCount = mealRecords.filter(m => m.date === todayStr).length;
    items.push({
      id: 'breakfast', label: '记录早餐', type: 'meal',
      done: mealCount >= 1,
      action: () => onNavigate && onNavigate('food'),
    });
    if (mealCount >= 1) {
      items.push({
        id: 'lunch', label: '记录午餐', type: 'meal',
        done: mealCount >= 2,
        action: () => onNavigate && onNavigate('food'),
      });
    }
    if (mealCount >= 2) {
      items.push({
        id: 'dinner', label: '记录晚餐', type: 'meal',
        done: mealCount >= 3,
        action: () => onNavigate && onNavigate('food'),
      });
    }

    // 运动
    const exCount = exerciseRecords.filter(e => e.date === todayStr).length;
    items.push({
      id: 'exercise', label: '完成今日训练', type: 'exercise',
      done: exCount >= 1,
      action: () => onNavigate && onNavigate('exercise'),
    });

    // 喝水
    items.push({
      id: 'water', label: `喝水目标 (${waterHook.todayCups}/8杯)`, type: 'water',
      done: waterHook.todayCups >= 8,
      action: () => waterHook.addWater(1),
    });

    // 体重
    items.push({
      id: 'weight', label: '记录体重', type: 'body',
      done: false,
      action: () => onNavigate && onNavigate('body'),
    });

    // 心情
    items.push({
      id: 'mood', label: '记录今日心情', type: 'mood',
      done: false,
      noCheck: true,
    });

    return items;
  }, [mealRecords, exerciseRecords, todayStr, waterHook, onNavigate]);

  const calPct = goalPercentage(todayStats.calories, recommendedCalories);
  const proteinPct = goalPercentage(todayStats.protein, recommendedProtein);

  // 今日建议
  const suggestions = useMemo(() => {
    const s = [];
    const proteinLeft = Math.max(0, recommendedProtein - todayStats.protein);
    const calLeft = Math.max(0, recommendedCalories - todayStats.calories);
    const exCount = exerciseRecords.filter(e => e.date === todayStr).length;

    if (todayStats.calories === 0 && exCount === 0) {
      s.push({ icon: '👋', text: '新的一天！记录饮食和运动，开始你的健康之旅', type: 'welcome' });
    } else {
      if (todayStats.calories > recommendedCalories * 1.1) {
        s.push({ icon: '⚠️', text: `热量已超标 ${todayStats.calories - recommendedCalories}kcal，建议晚餐清淡为主`, type: 'warning' });
      } else if (calLeft > 300) {
        s.push({ icon: '🍽️', text: `热量还剩 ${calLeft}kcal，可以吃顿营养均衡的餐`, type: 'info' });
      }

      if (proteinLeft > 15) {
        s.push({ icon: '🥩', text: `蛋白质还差 ${proteinLeft}g，建议加餐鸡蛋/鸡胸/蛋白粉`, type: 'nutrition' });
      }

      if (exCount === 0 && todayStats.calories > 0) {
        s.push({ icon: '🏃', text: '今天还没运动！15分钟 HIIT 也可以有不错的效果', type: 'exercise' });
      }

      if (todayStats.exerciseCalories > 0) {
        const net = todayStats.calories - todayStats.exerciseCalories - recommendedCalories;
        if (net > 300) s.push({ icon: '⚖️', text: `热量盈余 ${net}kcal，建议增加有氧或减少晚餐分量`, type: 'balance' });
        else if (net < -300) s.push({ icon: '💡', text: `热量缺口 ${net}kcal，注意补充营养，避免过度节食`, type: 'balance' });
        else s.push({ icon: '✅', text: '今日热量控制良好，保持节奏！', type: 'good' });
      }

      if (streak >= 5 && streak < 30) {
        s.push({ icon: '🔥', text: `已连续打卡 ${streak} 天！坚持下去，习惯就自然了`, type: 'motivation' });
      }
    }

    return s.slice(0, 4);
  }, [todayStats, recommendedCalories, recommendedProtein, exerciseRecords, streak]);

  const todoDone = todos.filter(t => t.done).length;
  const todoTotal = todos.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部问候 + 打卡 */}
      <div className="bg-gradient-to-br from-brand-orange to-red-500 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold">
              {profile?.name ? `${profile.name}，` : ''}早上好 ☀️
            </h2>
            <p className="text-sm text-white/80">{formatDateCN(todayStr)}</p>
          </div>
          <button onClick={onCheckIn}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isCheckedInToday ? 'bg-white/30 cursor-default' : 'bg-white text-brand-orange hover:shadow-lg'
            }`}>
            {isCheckedInToday ? '✅ 已打卡' : '📝 打卡'}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
            <Flame size={16} /> <span className="font-bold">{streak}</span>天
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
            <CheckCircle2 size={16} /> <span className="font-bold">{todoDone}/{todoTotal}</span>完成
          </div>
          <SocialShare todayStats={todayStats} streak={streak} />
        </div>
      </div>

      {/* 今日热量进度 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-400 mb-1">🔥 摄入热量</p>
          <p className="text-lg font-bold text-brand-orange">{todayStats.calories}</p>
          <p className="text-xs text-gray-400">/ {recommendedCalories} kcal</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-400 mb-1">💪 运动消耗</p>
          <p className="text-lg font-bold text-green-500">{todayStats.exerciseCalories}</p>
          <p className="text-xs text-gray-400">kcal</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-400 mb-1">🥩 蛋白质</p>
          <p className="text-lg font-bold text-blue-500">{todayStats.protein}</p>
          <p className="text-xs text-gray-400">/ {recommendedProtein} g</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-400 mb-1">💧 水分</p>
          <p className="text-lg font-bold text-cyan-500">{waterHook.todayCups * 250}ml</p>
          <p className="text-xs text-gray-400">/ 2000ml</p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">🍽️ 热量进度</span>
          <span className="text-xs text-gray-400">{calPct}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className={`h-2.5 rounded-full transition-all ${calPct > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`}
            style={{ width: `${Math.min(100, calPct)}%` }} />
        </div>
      </div>

      {/* 今日待办 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" /> 今日待办
          </h3>
          <span className="text-xs text-gray-400">{todoDone}/{todoTotal}</span>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {todos.map((todo, i) => (
            <div key={todo.id} className={`flex items-center px-4 py-3 transition-colors ${
              todo.done ? 'bg-green-50/50 dark:bg-green-900/10' : ''
            }`}>
              <button
                onClick={() => {
                  if (todo.noCheck) return;
                  // 标记为已做（仅前端视觉）
                  toast.info('点击右侧按钮前往');
                }}
                className="shrink-0"
              >
                {todo.done
                  ? <CheckCircle2 size={22} className="text-green-500" />
                  : <Circle size={22} className="text-gray-300 dark:text-gray-600" />
                }
              </button>
              <span className={`ml-3 flex-1 text-sm ${todo.done ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                {todo.done ? todo.label : todo.label}
              </span>
              {!todo.done && (
                <button onClick={todo.action}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-orange text-white hover:bg-brand-orange-light transition-colors">
                  去完成
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 今日建议 */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Brain size={16} className="text-purple-500" /> 今日建议
          </h3>
          {suggestions.map((s, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm flex items-start gap-3 ${
              s.type === 'warning' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' :
              s.type === 'motivation' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' :
              'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
            }`}>
              <span className="text-lg shrink-0">{s.icon}</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* 喝水 + 心情 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WaterTracker todayCups={waterHook.todayCups} addWater={waterHook.addWater} removeWater={waterHook.removeWater} />
        <MoodTracker />
      </div>

      {/* 快捷导航 */}
      <div className="grid grid-cols-3 gap-3">
        <QuickNav icon="🍽️" label="记录饮食" onClick={() => onNavigate && onNavigate('food')} />
        <QuickNav icon="💪" label="记录运动" onClick={() => onNavigate && onNavigate('exercise')} />
        <QuickNav icon="📏" label="记录体重" onClick={() => onNavigate && onNavigate('body')} />
      </div>
    </div>
  );
}

function QuickNav({ icon, label, onClick }) {
  return (
    <button onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:border-brand-orange transition-all">
      <span className="text-2xl block mb-1">{icon}</span>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{label}</span>
    </button>
  );
}
