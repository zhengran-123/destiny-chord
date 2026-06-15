import React, { useMemo, useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { generateWeeklyReport, generateMonthlyReport } from '../utils/calculation';
import { getToday } from '../utils/date';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeeklyReport({ mealRecords, exerciseRecords, tasks }) {
  const [mode, setMode] = useState('week'); // 'week' | 'month'
  const [monthOffset, setMonthOffset] = useState(0);

  const now = new Date();
  const reportYear = now.getFullYear();
  const reportMonth = now.getMonth() + 1 - monthOffset;

  const weekReport = useMemo(() => generateWeeklyReport(mealRecords, exerciseRecords, tasks, getToday()), [mealRecords, exerciseRecords, tasks]);
  const monthReport = useMemo(() => generateMonthlyReport(mealRecords, exerciseRecords, tasks, reportYear, reportMonth), [mealRecords, exerciseRecords, tasks, reportYear, reportMonth]);

  const data = mode === 'week' ? weekReport : monthReport;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Calendar size={22} className="text-blue-500" />
          {mode === 'week' ? '本周报告' : '月度报告'}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setMode('week')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            周报
          </button>
          <button onClick={() => setMode('month')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            月报
          </button>
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportCard icon={<FlameIcon />} label="平均热量" value={data.avgCalories} unit="kcal" color="orange" />
        <ReportCard icon={<TrendingUp />} label={mode === 'week' ? '最高热量' : '总热量'} value={mode === 'week' ? data.maxCalories : data.totalCalories} unit="kcal" color="red" />
        <ReportCard icon={<Activity />} label="总运动量" value={data.totalExercise} unit="次" color="green" />
        <ReportCard icon={<Target />} label={mode === 'week' ? '平均蛋白' : '总蛋白'} value={mode === 'week' ? data.avgProtein : data.totalProtein} unit="g" color="blue" />
      </div>

      {/* 图表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
          {mode === 'week' ? '每日热量' : '每日热量'}
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#9ca3af" fontSize={11} interval={mode === 'month' ? 3 : 0} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="calories" name="热量" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 详细数据 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">📋 详细数据</h3>
        <div className="space-y-3">
          <InfoRow label="平均热量" value={`${data.avgCalories} kcal`} />
          {mode === 'week' && <InfoRow label="最高热量" value={`${data.maxCalories} kcal`} />}
          {mode === 'week' && <InfoRow label="最低热量" value={`${data.minCalories} kcal`} />}
          {mode === 'month' && <InfoRow label="总热量" value={`${data.totalCalories} kcal`} />}
          <InfoRow label="总运动量" value={`${data.totalExercise} 次`} />
          <InfoRow label={mode === 'week' ? '日均蛋白质' : '总蛋白质'} value={`${mode === 'week' ? data.avgProtein : data.totalProtein} g`} />
          {mode === 'month' && <InfoRow label="活跃天数" value={`${data.activeDays} 天`} />}
        </div>
      </div>
    </div>
  );
}

function ReportCard({ icon, label, value, unit, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold text-${color}-500`}>{value}</p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800 dark:text-white">{value}</span>
    </div>
  );
}

function FlameIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  );
}
