import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { sumDailyNutrition, sumDailyExercise } from '../utils/calculation';
import { getRecentDays } from '../utils/date';
import { toast } from 'react-toastify';

export default function InteractiveChart({ mealRecords, exerciseRecords }) {
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'line'
  const [metric, setMetric] = useState('calories'); // 'calories' | 'protein' | 'exercise'
  const [days, setDays] = useState(7);
  const [selectedDay, setSelectedDay] = useState(null);

  const chartData = useMemo(() => {
    const recentDays = getRecentDays(days);
    return recentDays.map(ds => {
      const dayMeals = mealRecords.filter(m => m.date === ds);
      const dayEx = exerciseRecords.filter(e => e.date === ds);
      const nutrition = sumDailyNutrition(dayMeals);
      return {
        date: ds,
        label: ds.slice(5),
        热量: nutrition.calories,
        蛋白质: nutrition.protein,
        运动量: sumDailyExercise(dayEx),
      };
    });
  }, [mealRecords, exerciseRecords, days]);

  const handleClick = (data) => {
    if (data?.activeTooltip?.[0]?.payload) {
      const payload = data.activeTooltip[0].payload;
      setSelectedDay(payload);
      toast.info(`${payload.date}: ${payload.热量}kcal · 蛋白质${payload.蛋白质}g · 运动${payload.运动量}次`);
    }
  };

  const metricConfig = {
    calories: { key: '热量', color: '#ff8c00', label: '热量 (kcal)' },
    protein: { key: '蛋白质', color: '#3b82f6', label: '蛋白质 (g)' },
    exercise: { key: '运动量', color: '#22c55e', label: '运动量 (次)' },
    all: null,
  };

  const config = metricConfig[metric];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">📊 交互式图表</h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={metric}
            onChange={e => setMetric(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-none outline-none"
          >
            <option value="calories">热量</option>
            <option value="protein">蛋白质</option>
            <option value="exercise">运动量</option>
          </select>
          <select
            value={chartType}
            onChange={e => setChartType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-none outline-none"
          >
            <option value="bar">柱状图</option>
            <option value="line">折线图</option>
          </select>
          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-none outline-none"
          >
            <option value={7}>7天</option>
            <option value={14}>14天</option>
            <option value={30}>30天</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'bar' ? (
          <BarChart data={chartData} onClick={handleClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#9ca3af" fontSize={11} interval={days > 14 ? 3 : 0} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey={config.key} fill={config.color} radius={[8, 8, 0, 0]} cursor="pointer" />
          </BarChart>
        ) : (
          <LineChart data={chartData} onClick={handleClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#9ca3af" fontSize={11} interval={days > 14 ? 3 : 0} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey={config.key} stroke={config.color} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} cursor="pointer" />
          </LineChart>
        )}
      </ResponsiveContainer>

      {selectedDay && (
        <div className="mt-3 text-center text-sm text-gray-400">
          已选择: <span className="font-medium text-gray-600 dark:text-gray-300">{selectedDay.date}</span>
          {' · '}
          {config.key}: <span className="font-bold" style={{ color: config.color }}>{selectedDay[config.key]}</span>
        </div>
      )}
    </div>
  );
}
