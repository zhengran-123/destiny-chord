import React, { useState, useEffect } from 'react';
import { User, Save, Activity, Target, Heart } from 'lucide-react';
import { toast } from 'react-toastify';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: '久坐不动', desc: '几乎不运动' },
  { value: 'light', label: '轻度活动', desc: '每周1-2次运动' },
  { value: 'moderate', label: '中等活跃', desc: '每周3-5次运动' },
  { value: 'active', label: '非常活跃', desc: '每周6-7次运动' },
  { value: 'veryActive', label: '高强度', desc: '每天高强度训练' },
];

export default function UserProfile({ profile, bmr, tdee, bmiVal, updateProfile }) {
  const [form, setForm] = useState({ ...profile });

  useEffect(() => { setForm({ ...profile }); }, [profile]);

  const handleSave = () => {
    if (!form.name.trim()) { toast.warn('请输入昵称'); return; }
    updateProfile(form);
    toast.success('档案已更新！');
  };

  const getBMIText = (bmi) => {
    if (bmi < 18.5) return '偏瘦 · 建议增肌';
    if (bmi < 24) return '标准 · 保持即可';
    if (bmi < 28) return '偏胖 · 建议减脂';
    return '肥胖 · 建议减重';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <User size={22} className="text-indigo-500" /> 个人档案
      </h2>

      {/* 身体数据概览 */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon="🔥" label="基础代谢 BMR" value={`${bmr}`} unit="kcal/天" color="orange" />
        <StatCard icon="⚡" label="每日消耗 TDEE" value={`${tdee}`} unit="kcal/天" color="red" />
        <StatCard icon="📏" label="BMI" value={bmiVal} unit={getBMIText(bmiVal)} color={bmiVal < 18.5 ? 'blue' : bmiVal < 24 ? 'green' : 'yellow'} />
      </div>

      {/* 基本信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <User size={16} className="text-indigo-500"/> 基本信息
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">昵称</label>
            <input type="text" placeholder="你的昵称" value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">性别</label>
            <div className="flex gap-2">
              <button onClick={() => setForm(f => ({...f, gender: 'male'}))}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${form.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>🚹 男</button>
              <button onClick={() => setForm(f => ({...f, gender: 'female'}))}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${form.gender === 'female' ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>🚺 女</button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">年龄</label>
            <input type="number" value={form.age} min={10} max={100}
              onChange={e => setForm(f => ({...f, age: Number(e.target.value) || 0}))}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">身高 (cm)</label>
            <input type="number" value={form.height} min={100} max={250}
              onChange={e => setForm(f => ({...f, height: Number(e.target.value) || 0}))}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">体重 (kg)</label>
            <input type="number" value={form.weight} min={30} max={300}
              onChange={e => setForm(f => ({...f, weight: Number(e.target.value) || 0}))}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">活动水平</label>
            <select value={form.activityLevel}
              onChange={e => setForm(f => ({...f, activityLevel: e.target.value}))}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm">
              {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label} ({o.desc})</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSave}
          className="mt-4 w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
          <Save size={18}/> 保存档案
        </button>
      </div>

      {/* 说明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800/50">
        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 说明</h3>
        <div className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
          <p>• BMR（基础代谢）：身体维持生命所需的最低热量</p>
          <p>• TDEE（每日总消耗）：BMR × 活动系数 = 每日实际消耗</p>
          <p>• 所有运动消耗会根据你的体重自动调整</p>
          <p>• 热量建议目标也会基于你的个人数据</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, color }) {
  return (
    <div className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-2xl p-4 border border-${color}-200 dark:border-${color}-800/50 text-center`}>
      <div className="text-lg mb-1">{icon}</div>
      <div className={`text-xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</div>
      <div className="text-xs text-gray-400">{unit}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}
