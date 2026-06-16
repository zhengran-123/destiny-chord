import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, CheckCircle2, Star, TrendingUp, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import { getToday } from '../utils/date';

const STORAGE_KEY = 'health_habits';

// 预设习惯
const PRESET_HABITS = [
  { name: '早睡（23点前）', icon: '🌙', category: '睡眠' },
  { name: '早起（7点前）', icon: '🌅', category: '作息' },
  { name: '不喝含糖饮料', icon: '🚫', category: '饮食' },
  { name: '吃早餐', icon: '🍳', category: '饮食' },
  { name: '不吃宵夜', icon: '🌃', category: '饮食' },
  { name: '多喝水8杯', icon: '💧', category: '饮水' },
  { name: '运动30分钟', icon: '🏃', category: '运动' },
  { name: '走10000步', icon: '🚶', category: '运动' },
  { name: '冥想10分钟', icon: '🧘', category: '心理' },
  { name: '阅读30分钟', icon: '📖', category: '学习' },
  { name: '不刷手机1小时', icon: '📵', category: '习惯' },
  { name: '补充维生素', icon: '💊', category: '健康' },
];

function getData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

export default function HabitTracker() {
  const [habits, setHabits] = useState([]); // {id,name,icon,createdAt}
  const [checkData, setCheckData] = useState({}); // { [habitId_date]: true }
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('⭐');
  const [showPresets, setShowPresets] = useState(false);

  const today = getToday();

  useEffect(() => {
    const d = getData();
    setHabits(d.habits || []);
    setCheckData(d.checks || {});
  }, []);

  const save = useCallback((h, c) => {
    setHabits(h); setCheckData(c);
    saveData({ habits: h, checks: c });
  }, []);

  const addHabit = (name, icon = '⭐') => {
    if (!name.trim()) return;
    const habit = { id: Date.now(), name: name.trim(), icon, createdAt: today };
    save([...habits, habit], checkData);
    setNewName(''); setShowAdd(false); setShowPresets(false);
    toast.success('习惯已添加');
  };

  const removeHabit = (id) => {
    save(habits.filter(h => h.id !== id), checkData);
    toast.info('习惯已删除');
  };

  const toggleCheck = (habitId) => {
    const key = `${habitId}_${today}`;
    const updated = { ...checkData, [key]: !checkData[key] };
    save(habits, updated);
  };

  // 计算每个习惯的连续天数
  const getStreak = (habitId) => {
    let streak = 0;
    const d = new Date();
    // 如果今天没打卡，从昨天开始算
    const key = `${habitId}_${getDateStr(d)}`;
    if (!checkData[key]) d.setDate(d.getDate() - 1);

    for (let i = 0; i < 365; i++) {
      const ds = getDateStr(d);
      if (checkData[`${habitId}_${ds}`]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };

  // XP/等级系统
  const totalChecks = Object.values(checkData).filter(Boolean).length;
  const todayChecks = habits.filter(h => checkData[`${h.id}_${today}`]).length;
  const level = Math.floor(totalChecks / 10) + 1;
  const xpToNext = 10 - (totalChecks % 10);
  const todayPercent = habits.length > 0 ? Math.round(todayChecks / habits.length * 100) : 0;

  function getDateStr(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 等级面板 */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Award size={24} />
              <span className="text-lg font-bold">Lv.{level}</span>
            </div>
            <p className="text-sm text-white/70 mt-1">累计 {totalChecks} 次打卡</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{todayPercent}%</div>
            <p className="text-xs text-white/70">今日完成率</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>距下一级还需 {xpToNext} 次</span>
            <span>Lv.{level+1}</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${(10 - xpToNext) * 10}%` }} />
          </div>
        </div>
      </div>

      {/* 今天进度条 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">今日习惯</span>
          <span className="text-xs text-gray-400">{todayChecks}/{habits.length}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-full h-2.5 transition-all"
            style={{ width: `${todayPercent}%` }} />
        </div>
      </div>

      {/* 习惯列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">📋 我的习惯</h3>
          <div className="flex gap-2">
            <button onClick={() => { setShowPresets(true); setShowAdd(true); }}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-500 hover:bg-gray-200">📦 预设</button>
            <button onClick={() => { setShowPresets(false); setShowAdd(true); }}
              className="px-3 py-1.5 rounded-lg bg-brand-orange text-white text-xs font-medium hover:bg-brand-orange-light flex items-center gap-1"><Plus size={14}/> 添加</button>
          </div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {habits.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Star size={48} className="mx-auto mb-3 opacity-30" />
              <p>还没有习惯</p>
              <p className="text-sm">添加每日好习惯开始打卡吧</p>
            </div>
          ) : (
            habits.map(h => {
              const checked = checkData[`${h.id}_${today}`] || false;
              const streak = getStreak(h.id);
              return (
                <div key={h.id} className={`flex items-center px-4 py-3 transition-colors ${
                  checked ? 'bg-green-50 dark:bg-green-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}>
                  <button onClick={() => toggleCheck(h.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      checked ? 'bg-green-500 text-white scale-110' : 'border-2 border-gray-300 dark:border-gray-500'
                    }`}>
                    {checked && <CheckCircle2 size={16} />}
                  </button>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className={`text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                      {h.icon} {h.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {streak > 1 && <span className="text-xs text-orange-500 font-medium">🔥{streak}天</span>}
                    <button onClick={() => removeHabit(h.id)}
                      className="p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 添加弹窗 */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">➕ 添加习惯</h3>
            {showPresets ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {PRESET_HABITS.map((p, i) => (
                  <button key={i} onClick={() => addHabit(p.name, p.icon)}
                    className="w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                    <span className="text-xl">{p.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="text" placeholder="习惯名称" value={newName} onChange={e => setNewName(e.target.value)} autoFocus
                    className="flex-1 p-2.5 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/50" />
                  <input type="text" placeholder="图标" value={newIcon} onChange={e => setNewIcon(e.target.value)} maxLength={2}
                    className="w-14 p-2.5 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center outline-none" />
                </div>
                <button onClick={() => addHabit(newName, newIcon)}
                  className="w-full py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-light">确认添加</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
