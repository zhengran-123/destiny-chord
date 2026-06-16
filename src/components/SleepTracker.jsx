import { useState, useEffect, useCallback } from 'react';
import { Moon, Plus, Trash2, TrendingUp, Bed, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STORAGE_KEY = 'health_sleep_data';

function getSleepData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveSleepData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export default function SleepTracker() {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ sleepTime: '23:00', wakeTime: '07:00', quality: 3 });

  useEffect(() => { setRecords(getSleepData()); }, []);

  const calcDuration = (sleep, wake) => {
    const [sh, sm] = sleep.split(':').map(Number);
    const [wh, wm] = wake.split(':').map(Number);
    let hrs = wh - sh + (wm - sm) / 60;
    if (hrs < 0) hrs += 24;
    return parseFloat(hrs.toFixed(1));
  };

  const handleAdd = () => {
    const duration = calcDuration(form.sleepTime, form.wakeTime);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const record = {
      id: Date.now(),
      date: todayStr,
      sleepTime: form.sleepTime,
      wakeTime: form.wakeTime,
      duration,
      quality: form.quality,
    };
    const updated = [record, ...records];
    setRecords(updated);
    saveSleepData(updated);
    setShowForm(false);
    toast.success(`睡眠记录: ${duration}小时`);
  };

  const deleteRecord = (id) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    saveSleepData(updated);
    toast.info('已删除');
  };

  // 最近7天图表
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const rec = records.find(r => r.date === ds);
    chartData.push({
      date: ds.slice(5),
      睡眠: rec ? rec.duration : 0,
      quality: rec ? rec.quality : 0,
    });
  }

  const avgSleep = records.length > 0
    ? parseFloat((records.reduce((s, r) => s + r.duration, 0) / records.length).toFixed(1))
    : 0;

  const latest = records[0];
  const qualityLabels = ['', '😫 很差', '😟 较差', '😐 一般', '😊 不错', '😄 很好'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Moon size={22} className="text-indigo-500" /> 睡眠追踪
        </h2>
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 flex items-center gap-1">
          <Plus size={16}/> 记录睡眠
        </button>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-800/50 text-center">
          <Moon size={20} className="mx-auto mb-1 text-indigo-500" />
          <div className="text-2xl font-bold text-indigo-600">{avgSleep || '-'}</div>
          <div className="text-xs text-indigo-400">平均睡眠(h)</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800/50 text-center">
          <Clock size={20} className="mx-auto mb-1 text-blue-500" />
          <div className="text-2xl font-bold text-blue-600">{latest ? `${latest.sleepTime}` : '-'}</div>
          <div className="text-xs text-blue-400">入睡时间</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800/50 text-center">
          <Bed size={20} className="mx-auto mb-1 text-green-500" />
          <div className="text-2xl font-bold text-green-600">{latest ? qualityLabels[latest.quality] : '-'}</div>
          <div className="text-xs text-green-400">睡眠质量</div>
        </div>
      </div>

      {/* 7天趋势 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">📊 最近7天睡眠</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 12]} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={(v, name) => [name === '睡眠' ? `${v}h` : `${v}分`, name]} />
            <Bar dataKey="睡眠" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 历史记录 */}
      {records.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">📋 睡眠记录 ({records.length})</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {records.map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{r.duration >= 8 ? '😊' : r.duration >= 6 ? '😐' : '😫'}</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{r.date}</p>
                    <p className="text-xs text-gray-400">{r.sleepTime} → {r.wakeTime} · {r.duration}h · {qualityLabels[r.quality]}</p>
                  </div>
                </div>
                <button onClick={() => deleteRecord(r.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 录入弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">😴 记录睡眠</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">入睡时间</label>
                  <input type="time" value={form.sleepTime} onChange={e => setForm(f => ({...f, sleepTime: e.target.value}))}
                    className="w-full p-2.5 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">起床时间</label>
                  <input type="time" value={form.wakeTime} onChange={e => setForm(f => ({...f, wakeTime: e.target.value}))}
                    className="w-full p-2.5 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none" />
                </div>
              </div>
              <p className="text-center text-sm font-medium text-indigo-500">
                预计睡眠: {calcDuration(form.sleepTime, form.wakeTime)} 小时
              </p>
              <div>
                <label className="text-xs text-gray-500">睡眠质量: {qualityLabels[form.quality]}</label>
                <input type="range" min="1" max="5" value={form.quality} onChange={e => setForm(f => ({...f, quality: Number(e.target.value)}))}
                  className="w-full accent-indigo-500" />
              </div>
              <button onClick={handleAdd}
                className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">保存睡眠记录</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
