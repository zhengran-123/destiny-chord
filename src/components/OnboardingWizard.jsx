import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Target, User, Dumbbell, Heart, UtensilsCrossed, Ruler } from 'lucide-react';
import { toast } from 'react-toastify';

const STEPS = [
  { id: 'goal', icon: '🎯', title: '你的健身目标是什么？', desc: '这将决定你的训练和饮食方向' },
  { id: 'info', icon: '📏', title: '你的身体信息', desc: '用于计算基础代谢和营养需求' },
  { id: 'activity', icon: '🏃', title: '你的活动习惯', desc: '帮助制定合理的训练频率' },
  { id: 'diet', icon: '🍽️', title: '你的饮食偏好', desc: '定制适合你的饮食计划' },
  { id: 'equipment', icon: '🏋️', title: '可用器材', desc: '根据器械推荐训练动作' },
  { id: 'limits', icon: '❤️', title: '身体限制', desc: '避免不适合的运动' },
];

const GOALS = [
  { value: 'lose_fat', label: '减脂', icon: '🔥', desc: '减少体脂，轻线条' },
  { value: 'build_muscle', label: '增肌', icon: '💪', desc: '增加肌肉质量和力量' },
  { value: 'shape', label: '塑形', icon: '✨', desc: '紧致身形，改善体态' },
  { value: 'maintain', label: '保持', icon: '✅', desc: '维持当前状态' },
  { value: 'health', label: '健康生活', icon: '🌿', desc: '养成良好习惯' },
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: '久坐不动', desc: '几乎不运动，办公室工作' },
  { value: 'light', label: '轻度活动', desc: '每周1-2次轻度运动' },
  { value: 'moderate', label: '中等活跃', desc: '每周3-5次中等运动' },
  { value: 'active', label: '非常活跃', desc: '每周6-7次高强度运动' },
  { value: 'veryActive', label: '高强度', desc: '每天高强度/体力劳动' },
];

const DIET_OPTIONS = [
  { value: 'normal', label: '均衡饮食', icon: '🥗', desc: '什么都吃' },
  { value: 'high_protein', label: '高蛋白', icon: '🥩', desc: '多吃肉蛋奶' },
  { value: 'low_carb', label: '低碳水', icon: '🥑', desc: '减少主食' },
  { value: 'vegetarian', label: '素食', icon: '🥬', desc: '不吃肉' },
];

const EQUIPMENT_OPTIONS = [
  { value: 'none', label: '无器械', icon: '🧘', desc: '全靠自重训练' },
  { value: 'dumbbell', label: '哑铃', icon: '🏋️', desc: '有哑铃和基础器材' },
  { value: 'band', label: '弹力带', icon: '🪢', desc: '有弹力带和瑜伽垫' },
  { value: 'gym', label: '健身房', icon: '🏢', desc: '有健身房卡' },
  { value: 'all', label: '全套器械', icon: '🏠', desc: '在家有齐全器械' },
];

const LIMIT_OPTIONS = [
  { value: 'none', label: '无限制', icon: '✅' },
  { value: 'knee', label: '膝盖不适', icon: '🦵' },
  { value: 'back', label: '腰部不适', icon: '🔙' },
  { value: 'shoulder', label: '肩部不适', icon: '💪' },
  { value: 'wrist', label: '手腕不适', icon: '✋' },
  { value: 'neck', label: '颈部不适', icon: '🧣' },
  { value: 'other', label: '其他', icon: '📋' },
];

export default function OnboardingWizard({ onComplete, initialData }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    goal: initialData?.goal || '',
    age: initialData?.age || 25,
    height: initialData?.height || 170,
    weight: initialData?.weight || 70,
    gender: initialData?.gender || 'male',
    activityLevel: initialData?.activityLevel || 'moderate',
    trainingFrequency: initialData?.trainingFrequency || 3,
    sessionDuration: initialData?.sessionDuration || 30,
    dietPreference: initialData?.dietPreference || 'normal',
    equipment: initialData?.equipment || 'none',
    limitations: initialData?.limitations || [],
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleLimit = (val) => {
    if (val === 'none') return update('limitations', ['none']);
    const arr = form.limitations.filter(l => l !== 'none');
    update('limitations', arr.includes(val) ? arr.filter(l => l !== val) : [...arr, val]);
  };

  const canNext = () => {
    switch (STEPS[step].id) {
      case 'goal': return !!form.goal;
      case 'info': return form.age > 0 && form.height > 0 && form.weight > 0;
      case 'activity': return form.trainingFrequency > 0;
      default: return true;
    }
  };

  const handleFinish = () => {
    onComplete(form);
    toast.success('🎉 档案已创建！正在为你生成计划...');
  };

  const renderStep = () => {
    switch (STEPS[step].id) {
      case 'goal':
        return (
          <div className="grid grid-cols-1 gap-3">
            {GOALS.map(g => (
              <button key={g.value} onClick={() => update('goal', g.value)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  form.goal === g.value
                    ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-300'
                }`}>
                <span className="text-3xl">{g.icon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800 dark:text-white">{g.label}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{g.desc}</p>
                </div>
                {form.goal === g.value && <Check size={20} className="text-brand-orange shrink-0" />}
              </button>
            ))}
          </div>
        );

      case 'info':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">性别</label>
                <div className="flex gap-2">
                  {['male','female'].map(g => (
                    <button key={g} onClick={() => update('gender', g)}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium ${
                        form.gender === g ? (g==='male'?'bg-blue-500 text-white':'bg-pink-500 text-white') : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                      }`}>{g==='male'?'🚹 男':'🚺 女'}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">年龄</label>
                <input type="number" min={10} max={120} value={form.age}
                  onChange={e => update('age', Number(e.target.value) || 0)}
                  className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">身高 (cm)</label>
                <input type="number" min={100} max={250} value={form.height}
                  onChange={e => update('height', Number(e.target.value) || 0)}
                  className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/50" />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">体重 (kg)</label>
                <input type="number" min={30} max={300} value={form.weight}
                  onChange={e => update('weight', Number(e.target.value) || 0)}
                  className="w-full p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/50" />
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-500 block">每周运动频率</label>
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7].map(n => (
                  <button key={n} onClick={() => update('trainingFrequency', n)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold ${
                      form.trainingFrequency === n ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>{n}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">每次训练时长</label>
              <div className="grid grid-cols-3 gap-2">
                {[15,30,45,60,75,90].map(n => (
                  <button key={n} onClick={() => update('sessionDuration', n)}
                    className={`p-3 rounded-xl text-sm font-medium ${
                      form.sessionDuration === n ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>{n}分钟</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-2 block">日常活动水平</label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map(l => (
                  <button key={l.value} onClick={() => update('activityLevel', l.value)}
                    className={`w-full text-left p-3 rounded-xl border text-sm ${
                      form.activityLevel === l.value ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20' : 'border-gray-100 dark:border-gray-700'
                    }`}>
                    <span className="font-medium text-gray-800 dark:text-white">{l.label}</span>
                    <p className="text-xs text-gray-400">{l.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'diet':
        return (
          <div className="grid grid-cols-1 gap-3">
            {DIET_OPTIONS.map(d => (
              <button key={d.value} onClick={() => update('dietPreference', d.value)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left ${
                  form.dietPreference === d.value ? 'border-brand-orange bg-orange-50' : 'border-gray-100 dark:border-gray-700'
                }`}>
                <span className="text-2xl">{d.icon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800 dark:text-white">{d.label}</span>
                  <p className="text-xs text-gray-400">{d.desc}</p>
                </div>
              </button>
            ))}
          </div>
        );

      case 'equipment':
        return (
          <div className="grid grid-cols-1 gap-3">
            {EQUIPMENT_OPTIONS.map(eq => (
              <button key={eq.value} onClick={() => update('equipment', eq.value)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left ${
                  form.equipment === eq.value ? 'border-brand-orange bg-orange-50' : 'border-gray-100 dark:border-gray-700'
                }`}>
                <span className="text-2xl">{eq.icon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800 dark:text-white">{eq.label}</span>
                  <p className="text-xs text-gray-400">{eq.desc}</p>
                </div>
              </button>
            ))}
          </div>
        );

      case 'limits':
        return (
          <div>
            <label className="text-sm text-gray-500 mb-3 block">选择你的身体限制（可多选）</label>
            <div className="grid grid-cols-2 gap-2">
              {LIMIT_OPTIONS.map(l => (
                <button key={l.value} onClick={() => toggleLimit(l.value)}
                  className={`p-3 rounded-xl border-2 text-sm ${
                    form.limitations.includes(l.value) ? 'border-brand-orange bg-orange-50' : 'border-gray-100 dark:border-gray-700'
                  }`}>
                  <span className="text-lg block mb-1">{l.icon}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[60] flex flex-col animate-fadeIn overflow-y-auto">
      {/* 顶部进度 */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-6 pt-6 pb-3">
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-brand-orange' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{STEPS[step].icon}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{STEPS[step].title}</h2>
            <p className="text-sm text-gray-400">{STEPS[step].desc}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">Step {step+1}/{STEPS.length}</p>
      </div>

      {/* 内容 */}
      <div className="flex-1 px-6 pb-6">
        {renderStep()}

        {/* 按钮 */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-1">
              <ChevronLeft size={18} /> 上一步
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => canNext() && setStep(s => s + 1)}
              disabled={!canNext()}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-1 ${
                canNext() ? 'bg-brand-orange text-white hover:bg-brand-orange-light' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}>
              下一步 <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleFinish}
              className="flex-1 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-light flex items-center justify-center gap-1">
              <Check size={18} /> 完成，开始我的健康之旅！
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
