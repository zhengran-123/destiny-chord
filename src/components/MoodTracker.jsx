import React, { useState, useEffect, useCallback } from 'react';
import { SmilePlus, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { getToday, getRecentDays } from '../utils/date';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STORAGE_KEY = 'health_mood_data';
const MOODS = [
  { emoji: '😄', label: '很棒', value: 5, color: 'bg-green-500' },
  { emoji: '😊', label: '不错', value: 4, color: 'bg-lime-500' },
  { emoji: '😐', label: '一般', value: 3, color: 'bg-yellow-500' },
  { emoji: '😟', label: '不太好', value: 2, color: 'bg-orange-500' },
  { emoji: '😢', label: '很差', value: 1, color: 'bg-red-500' },
];

function getData() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } }
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

export default function MoodTracker() {
  const [moodData, setMoodData] = useState({});
  const today = getToday();
  const todayMood = moodData[today];

  useEffect(() => { setMoodData(getData()); }, []);

  const setMood = (value) => {
    const updated = { ...moodData, [today]: value };
    setMoodData(updated);
    saveData(updated);
    toast.success('心情已记录 🌈');
  };

  // 7天趋势
  const chartData = getRecentDays(7).map(ds => ({
    date: ds.slice(5),
    心情: moodData[ds] || null,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
        <SmilePlus size={18} className="text-yellow-500" /> 今日心情
      </h3>

      {/* 心情选择 */}
      <div className="flex justify-center gap-3 mb-4">
        {MOODS.map(m => (
          <button key={m.value} onClick={() => setMood(m.value)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
              todayMood === m.value
                ? `${m.color} text-white scale-110 shadow-lg`
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}>
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-xs">{m.label}</span>
          </button>
        ))}
      </div>

      {/* 7天趋势 */}
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
          <YAxis domain={[0, 6]} tickCount={6} stroke="#9ca3af" fontSize={11} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={(v) => [MOODS.find(m => m.value === v)?.emoji + ' ' + MOODS.find(m => m.value === v)?.label, '心情']} />
          <Line type="monotone" dataKey="心情" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
