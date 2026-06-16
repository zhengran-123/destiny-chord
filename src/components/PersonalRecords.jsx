import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Trophy, Medal, TrendingUp, Target } from 'lucide-react';
import { toast } from 'react-toastify';

const STORAGE_KEY = 'health_personal_records';

// 运动纪录追踪
const RECORD_CATEGORIES = [
  { key: 'pushups', name: '俯卧撑连续最多', icon: '🤸', unit: '个' },
  { key: 'pullups', name: '引体向上连续最多', icon: '🧗', unit: '个' },
  { key: 'squats', name: '深蹲连续最多', icon: '🦵', unit: '个' },
  { key: 'plank', name: '平板支撑最长', icon: '🧘', unit: '秒' },
  { key: 'run5k', name: '5公里最快', icon: '🏃', unit: '分钟' },
  { key: 'run10k', name: '10公里最快', icon: '🏃‍♂️', unit: '分钟' },
  { key: 'bench', name: '卧推最大重量', icon: '🏋️‍♂️', unit: 'kg' },
  { key: 'deadlift', name: '硬拉最大重量', icon: '🏋️', unit: 'kg' },
  { key: 'squat_weight', name: '深蹲最大重量', icon: '🦿', unit: 'kg' },
  { key: 'jumprope', name: '跳绳连续最多', icon: '🪢', unit: '个' },
];

function getData() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } }
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

export default function PersonalRecords({ exerciseRecords }) {
  const [records, setRecords] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [newValue, setNewValue] = useState('');

  useEffect(() => { setRecords(getData()); }, []);

  const updateRecord = (key, value) => {
    const numVal = Number(value);
    if (!numVal || numVal <= 0) { toast.warn('请输入有效数值'); return; }
    const oldVal = records[key];
    // 对于有些项目数字越大越好（重量），有些越小越好（跑步时间）
    const isTime = ['run5k', 'run10k'].includes(key);
    const isBetter = oldVal ? (isTime ? numVal < oldVal : numVal > oldVal) : true;

    const updated = { ...records, [key]: numVal };
    setRecords(updated);
    saveData(updated);
    setShowForm(false);

    if (isBetter && oldVal) {
      toast.success(`🎉 新纪录！${isTime ? '快了' : '多了'} ${Math.abs(numVal - oldVal)}${RECORD_CATEGORIES.find(c => c.key === key)?.unit || ''}`);
    } else {
      toast.info('记录已保存');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <Trophy size={22} className="text-yellow-500" /> 个人纪录
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">🏆 最佳成绩</h3>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {RECORD_CATEGORIES.map(cat => {
            const val = records[cat.key];
            return (
              <div key={cat.key} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{cat.name}</p>
                    {val && <p className="text-xs text-yellow-500 font-medium">🏆 {val} {cat.unit}</p>}
                  </div>
                </div>
                <button onClick={() => { setSelectedCat(cat); setNewValue(val || ''); setShowForm(true); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    val ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                  } hover:bg-yellow-200 dark:hover:bg-yellow-900/50`}>
                  {val ? '更新' : '记录'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && selectedCat && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
              {selectedCat.icon} {selectedCat.name}
            </h3>
            {records[selectedCat.key] && (
              <p className="text-sm text-yellow-500 mb-3">当前纪录: 🏆 {records[selectedCat.key]} {selectedCat.unit}</p>
            )}
            <div className="flex items-center gap-2 mb-4">
              <input type="number" value={newValue} onChange={e => setNewValue(e.target.value)} autoFocus
                className="flex-1 p-3 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-xl text-center font-bold outline-none focus:ring-2 focus:ring-yellow-500/50" />
              <span className="text-gray-500">{selectedCat.unit}</span>
            </div>
            <button onClick={() => updateRecord(selectedCat.key, newValue)}
              className="w-full py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors">
              保存纪录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
