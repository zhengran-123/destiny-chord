import React, { useState } from 'react';
import { Target, Save, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';

export default function GoalSettings({ goals, updateGoals, resetGoals }) {
  const [form, setForm] = useState({ ...goals });

  const handleChange = (key, value) => {
    setForm(f => ({ ...f, [key]: Number(value) || 0 }));
  };

  const handleSave = () => {
    updateGoals(form);
    toast.success('目标已更新！');
  };

  const handleReset = () => {
    resetGoals();
    setForm({
      dailyCalories: 2000,
      dailyProtein: 150,
      dailyCarbs: 250,
      dailyFat: 65,
      dailySteps: 10000,
      workoutDays: 5,
    });
    toast.info('已恢复默认目标');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Target size={22} className="text-brand-orange" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">目标管理</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalInput label="每日热量目标" unit="kcal" value={form.dailyCalories} onChange={v => handleChange('dailyCalories', v)} icon="🔥" />
          <GoalInput label="每日蛋白质目标" unit="g" value={form.dailyProtein} onChange={v => handleChange('dailyProtein', v)} icon="🥩" />
          <GoalInput label="每日碳水目标" unit="g" value={form.dailyCarbs} onChange={v => handleChange('dailyCarbs', v)} icon="🍚" />
          <GoalInput label="每日脂肪目标" unit="g" value={form.dailyFat} onChange={v => handleChange('dailyFat', v)} icon="🧈" />
          <GoalInput label="每日步数目标" unit="步" value={form.dailySteps} onChange={v => handleChange('dailySteps', v)} icon="🚶" />
          <GoalInput label="每周运动天数" unit="天" value={form.workoutDays} onChange={v => handleChange('workoutDays', v)} icon="💪" max={7} />
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-light transition-colors flex items-center justify-center gap-2">
            <Save size={18} /> 保存目标
          </button>
          <button onClick={handleReset} className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
            <RotateCcw size={18} /> 恢复默认
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalInput({ label, unit, value, onChange, icon, max = 99999 }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
      <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
        <span>{icon}</span> {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number" min="0" max={max}
          value={value} onChange={e => onChange(Math.min(max, Number(e.target.value) || 0))}
          className="w-24 p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-center text-lg font-bold outline-none focus:ring-2 focus:ring-brand-orange/50"
        />
        <span className="text-gray-400 text-sm">{unit}</span>
      </div>
    </div>
  );
}
