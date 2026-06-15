import React, { useState, useMemo } from 'react';
import { Brain, Sparkles, Lightbulb, ChevronRight, RefreshCw } from 'lucide-react';
import { sumDailyNutrition } from '../utils/calculation';
import { getToday } from '../utils/date';
import { toast } from 'react-toastify';

/**
 * AI 营养建议组件
 * 基于用户历史数据提供智能建议
 * 可接入真实 AI API 获得更精准的建议
 */
export default function AIAdvice({ mealRecords, exerciseRecords, tasks, goals }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  const todayStr = getToday();

  const stats = useMemo(() => {
    const todayMeals = mealRecords.filter(m => m.date === todayStr);
    const todayEx = exerciseRecords.filter(e => e.date === todayStr);
    const nutrition = sumDailyNutrition(todayMeals);

    // 最近7天的数据
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayMeals = mealRecords.filter(m => m.date === ds);
      weekData.push({
        date: ds,
        nutrition: sumDailyNutrition(dayMeals),
        exercises: exerciseRecords.filter(e => e.date === ds).length,
      });
    }

    return {
      todayNutrition: nutrition,
      todayExercise: todayEx.length,
      weekData,
      avgCalories: Math.round(weekData.reduce((s, d) => s + d.nutrition.calories, 0) / 7),
      avgProtein: parseFloat((weekData.reduce((s, d) => s + d.nutrition.protein, 0) / 7).toFixed(1)),
    };
  }, [mealRecords, exerciseRecords, todayStr]);

  const generateAdvice = () => {
    setLoading(true);
    // 模拟 AI 分析延迟
    setTimeout(() => {
      const suggestions = [];

      // 基于热量分析
      if (stats.todayNutrition.calories > goals.dailyCalories * 1.2) {
        suggestions.push({
          icon: '⚠️',
          title: '今日热量超标',
          detail: `已摄入 ${stats.todayNutrition.calories} kcal（目标 ${goals.dailyCalories}），建议晚餐适当减少碳水摄入，多吃蔬菜`,
        });
      } else if (stats.todayNutrition.calories < goals.dailyCalories * 0.6 && stats.todayNutrition.calories > 0) {
        suggestions.push({
          icon: '💡',
          title: '热量摄入不足',
          detail: `仅摄入 ${stats.todayNutrition.calories} kcal，建议补充优质蛋白和复合碳水，保证基础代谢需求`,
        });
      } else if (stats.todayNutrition.calories > 0) {
        suggestions.push({
          icon: '✅',
          title: '热量摄入良好',
          detail: `${stats.todayNutrition.calories} kcal 在合理范围内，保持当前饮食节奏`,
        });
      }

      // 基于蛋白质分析
      if (stats.todayNutrition.protein < goals.dailyProtein * 0.6) {
        suggestions.push({
          icon: '🥩',
          title: '蛋白质摄入偏少',
          detail: `已摄入 ${stats.todayNutrition.protein}g（目标 ${goals.dailyProtein}g），推荐增加鸡胸肉、鱼虾、豆腐等优质蛋白`,
        });
      }

      // 基于运动分析
      if (stats.todayExercise === 0) {
        suggestions.push({
          icon: '🏃',
          title: '今天还没运动',
          detail: '建议至少做 20 分钟有氧运动或一组力量训练，保持每周至少 3 次运动频率',
        });
      }

      // 基于周趋势
      if (stats.avgCalories > goals.dailyCalories * 1.1) {
        suggestions.push({
          icon: '📊',
          title: '周平均热量偏高',
          detail: `过去 7 天平均 ${stats.avgCalories} kcal，建议控制后续 2-3 天饮食，平衡周热量`,
        });
      }

      // 基于碳水/脂肪比例
      if (stats.todayNutrition.carbs > 0 && stats.todayNutrition.fat > 0) {
        const carbRatio = (stats.todayNutrition.carbs * 4) / stats.todayNutrition.calories;
        if (carbRatio > 0.65) {
          suggestions.push({
            icon: '🍚',
            title: '碳水占比偏高',
            detail: `碳水占 ${Math.round(carbRatio * 100)}%，建议增加蛋白质和蔬菜比例`,
          });
        }
      }

      setAdvice({ suggestions, timestamp: new Date().toISOString() });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Brain size={28} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI 营养顾问</h2>
            <p className="text-sm text-purple-200">基于你的数据提供个性化建议</p>
          </div>
        </div>
        <button
          onClick={generateAdvice}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <><RefreshCw size={18} className="animate-spin" /> 分析中...</>
          ) : (
            <><Sparkles size={18} /> 获取 AI 建议</>
          )}
        </button>
      </div>

      {advice && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Lightbulb size={18} className="text-yellow-500" />
              个性化建议
            </h3>
            <span className="text-xs text-gray-400">
              {new Date(advice.timestamp).toLocaleTimeString('zh-CN')} 生成
            </span>
          </div>
          {advice.suggestions.map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">{s.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.detail}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 mt-1 shrink-0" />
              </div>
            </div>
          ))}
          {advice.suggestions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>数据不足，请先记录饮食和运动数据</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
