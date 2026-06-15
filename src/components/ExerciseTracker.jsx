import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Dumbbell, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { getToday } from '../utils/date';

const EXERCISE_PRESETS = [
  { name: '俯卧撑', icon: '🤸' },
  { name: '深蹲', icon: '🦵' },
  { name: '引体向上', icon: '🏋️' },
  { name: '仰卧起坐', icon: '🔄' },
  { name: '平板支撑', icon: '🧘' },
  { name: '哑铃弯举', icon: '💪' },
  { name: '卧推', icon: '🏋️‍♂️' },
  { name: '硬拉', icon: '🏋️' },
  { name: '跳绳', icon: '🪢' },
  { name: '跑步', icon: '🏃' },
  { name: '波比跳', icon: '🔥' },
  { name: '开合跳', icon: '⭐' },
  { name: '卷腹', icon: '🔄' },
  { name: '臀桥', icon: '🌉' },
  { name: '弓步蹲', icon: '🦿' },
];

export default function ExerciseTracker({ records, addExercise, deleteExercise, date, setDate }) {
  const [showForm, setShowForm] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [customName, setCustomName] = useState('');

  const todayStr = getToday();

  const todayExercises = useMemo(() => {
    return records.filter(r => r.date === todayStr).sort((a, b) => b.time.localeCompare(a.time));
  }, [records, todayStr]);

  const todayVolume = useMemo(() => {
    return todayExercises.reduce((s, e) => s + e.totalVolume, 0);
  }, [todayExercises]);

  const handleAdd = (name) => {
    if (!name.trim()) return;
    addExercise(name, sets, reps, todayStr);
    toast.success(`已记录: ${name} ${sets}×${reps}`);
    setExerciseName('');
    setSets(3);
    setReps(10);
    setShowForm(false);
  };

  const handleCustomAdd = () => {
    if (!customName.trim()) {
      toast.warn('请输入运动名称');
      return;
    }
    handleAdd(customName);
    setCustomName('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 添加运动区 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Dumbbell size={18} className="text-green-500" />
            记录运动
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
          >
            <Plus size={16} />
            添加运动
          </button>
        </div>

        {/* 快捷运动预设 */}
        <div className="flex flex-wrap gap-2">
          {EXERCISE_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => {
                setExerciseName(preset.name);
                setShowForm(true);
              }}
              className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm flex items-center gap-1.5"
            >
              <span>{preset.icon}</span>
              <span className="text-gray-700 dark:text-gray-200">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 运动表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">记录运动</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>

            {exerciseName ? (
              <div className="space-y-4">
                <p className="text-lg font-medium text-center text-gray-800 dark:text-white">{exerciseName}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">组数</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSets(s => Math.max(1, s - 1))} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 font-bold">−</button>
                      <span className="text-xl font-bold w-8 text-center text-gray-800 dark:text-white">{sets}</span>
                      <button onClick={() => setSets(s => s + 1)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 font-bold">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">次数/组</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setReps(r => Math.max(1, r - 1))} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 font-bold">−</button>
                      <span className="text-xl font-bold w-8 text-center text-gray-800 dark:text-white">{reps}</span>
                      <button onClick={() => setReps(r => r + 1)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 font-bold">+</button>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-400">
                  总运动量: <span className="font-bold text-green-500">{sets * reps}</span> 次
                </div>
                <button onClick={() => handleAdd(exerciseName)} className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors">
                  添加到记录
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">先选择上方运动，或输入自定义运动名称</p>
                <input
                  type="text" placeholder="自定义运动名称"
                  value={customName} onChange={e => setCustomName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500/50"
                />
                <button onClick={handleCustomAdd} className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors">
                  添加自定义运动
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 今日运动列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            📋 今日运动记录 ({todayExercises.length})
          </h3>
          {todayExercises.length > 0 && (
            <span className="text-sm text-gray-400">总运动量: {todayVolume} 次</span>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {todayExercises.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Dumbbell size={40} className="mx-auto mb-2 opacity-50" />
              <p>今天还没有运动记录</p>
            </div>
          ) : (
            todayExercises.map(ex => (
              <div key={ex.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{EXERCISE_PRESETS.find(p => p.name === ex.name)?.icon || '💪'}</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{ex.name}</p>
                    <p className="text-xs text-gray-400">{ex.sets}组 × {ex.reps}次/组 · {ex.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-green-500 text-sm">{ex.totalVolume} 次</span>
                  <button
                    onClick={() => { deleteExercise(ex.id); toast.info('已删除'); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
