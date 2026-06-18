import React, { useState, useEffect } from 'react';
import { User, Save, Target, UtensilsCrossed, Dumbbell } from 'lucide-react';
import { toast } from 'react-toastify';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: '久坐不动' },
  { value: 'light', label: '轻度活动' },
  { value: 'moderate', label: '中等活跃' },
  { value: 'active', label: '非常活跃' },
  { value: 'veryActive', label: '高强度' },
];

export default function UserProfile({ profile, bmr, tdee, bmiVal, updateProfile, recommendedCalories, recommendedProtein }) {
  const [form, setForm] = useState({ ...profile });
  useEffect(() => { setForm({ ...profile }); }, [profile]);

  const handleSave = () => {
    if (!form.name.trim()) { toast.warn('请输入昵称'); return; }
    updateProfile(form);
    toast.success('档案已更新！');
  };

  const getBMIText = (bmi) => {
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '标准';
    if (bmi < 28) return '偏胖';
    return '肥胖';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <User size={22} className="text-indigo-500" /> 个人档案
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBox label="基础代谢" value={`${bmr}`} unit="kcal/天" />
        <StatBox label="每日消耗" value={`${tdee}`} unit="kcal/天" />
        <StatBox label="推荐热量" value={`${recommendedCalories}`} unit="kcal/天" />
        <StatBox label="推荐蛋白" value={`${recommendedProtein}`} unit="g/天" />
        <StatBox label={`BMI ${bmiVal}`} value={getBMIText(bmiVal)} unit="" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          {[{ label: '昵称', key: 'name', type: 'text' },
            { label: '性别', key: 'gender', type: 'select', opts: [{v:'male',l:'男'},{v:'female',l:'女'}] },
            { label: '年龄', key: 'age', type: 'number' },
            { label: '身高 (cm)', key: 'height', type: 'number' },
            { label: '体重 (kg)', key: 'weight', type: 'number' },
            { label: '活动水平', key: 'activityLevel', type: 'select', opts: ACTIVITY_OPTIONS.map(o=>({v:o.value,l:o.label})) },
          ].map(f => (
            <div key={f.key}>
              <label className="text-sm text-gray-500 mb-1 block">{f.label}</label>
              {f.type === 'select' ? (
                <select value={form[f.key]} onChange={e => setForm(fm => ({...fm, [f.key]: e.target.value}))}
                  className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none text-sm">
                  {f.opts?.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              ) : (
                <input type={f.type} value={form[f.key]} min={10} max={300}
                  onChange={e => setForm(fm => ({...fm, [f.key]: f.key==='name'?e.target.value:Number(e.target.value)||0}))}
                  className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/50" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-gray-500 mb-1 block flex items-center gap-1"><Target size={14}/> 健身目标</label>
            <select value={form.goal} onChange={e => setForm(f => ({...f, goal: e.target.value}))}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none text-sm">
              <option value="lose_fat">🔥 减脂</option>
              <option value="build_muscle">💪 增肌</option>
              <option value="shape">✨ 塑形</option>
              <option value="maintain">✅ 保持</option>
              <option value="health">🌿 健康</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block flex items-center gap-1"><UtensilsCrossed size={14}/> 饮食偏好</label>
            <select value={form.dietPreference} onChange={e => setForm(f => ({...f, dietPreference: e.target.value}))}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none text-sm">
              <option value="normal">🥗 均衡</option>
              <option value="high_protein">🥩 高蛋白</option>
              <option value="low_carb">🥑 低碳水</option>
              <option value="vegetarian">🥬 素食</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block flex items-center gap-1"><Dumbbell size={14}/> 可用器材</label>
            <select value={form.equipment} onChange={e => setForm(f => ({...f, equipment: e.target.value}))}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none text-sm">
              <option value="none">🧘 无器械</option>
              <option value="dumbbell">🏋️ 哑铃</option>
              <option value="band">🪢 弹力带</option>
              <option value="gym">🏢 健身房</option>
              <option value="all">🏠 全套</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">每周训练</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={7} value={form.trainingFrequency}
                onChange={e => setForm(f => ({...f, trainingFrequency: Number(e.target.value)||3}))}
                className="w-20 p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center outline-none" />
              <span className="text-gray-500 text-sm">天/周</span>
              <input type="number" min={15} max={90} step={15} value={form.sessionDuration}
                onChange={e => setForm(f => ({...f, sessionDuration: Number(e.target.value)||30}))}
                className="w-20 p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center outline-none" />
              <span className="text-gray-500 text-sm">分/次</span>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="mt-4 w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
          <Save size={18}/> 保存档案
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800/50">
        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 你的个性化数据</h3>
        <div className="text-sm text-blue-600 dark:text-blue-400 space-y-0.5">
          <p>• 目标: {form.goal === 'lose_fat' ? '🔥 减脂' : form.goal === 'build_muscle' ? '💪 增肌' : form.goal === 'shape' ? '✨ 塑形' : '✅ 保持'}</p>
          <p>• BMR {bmr} + 活动系数 = TDEE {tdee} · 推荐摄入 {recommendedCalories}kcal</p>
          <p>• 推荐蛋白质 {recommendedProtein}g/天 · 运动消耗已按体重调整</p>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, unit }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 text-center">
      <div className="text-lg font-bold text-gray-800 dark:text-white">{value}</div>
      <div className="text-xs text-gray-400">{unit}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
