import React, { useState, useMemo } from 'react';
import { Plus, Trash2, LineChart, Ruler } from 'lucide-react';
import { toast } from 'react-toastify';
import { getToday } from '../utils/date';
import { LineChart as ReLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BodyMeasurements({ records, addRecord, deleteRecord }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    weight: '', waist: '', chest: '', hip: '', thigh: '', arm: '', notes: ''
  });

  const latest = records.slice(-1)[0] || null;

  const handleSubmit = () => {
    if (!form.weight) { toast.warn('请至少填写体重'); return; }
    addRecord(form);
    toast.success('身体数据已记录');
    setShowForm(false);
    setForm({ weight: '', waist: '', chest: '', hip: '', thigh: '', arm: '', notes: '' });
  };

  const chartData = useMemo(() => {
    return records.slice(-30).map(r => ({
      date: r.date.slice(5),
      体重: r.weight,
      腰围: r.waist || undefined,
      胸围: r.chest || undefined,
    }));
  }, [records]);

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return 'text-blue-500';
    if (bmi < 24) return 'text-green-500';
    if (bmi < 28) return 'text-yellow-500';
    return 'text-red-500';
  };
  const getBMIText = (bmi) => {
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '标准';
    if (bmi < 28) return '偏胖';
    return '肥胖';
  };

  const bmi = latest?.weight ? (latest.weight / 1.75 / 1.75).toFixed(1) : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Ruler size={22} className="text-indigo-500" />
          身体数据
        </h2>
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 flex items-center gap-1">
          <Plus size={16}/> 记录数据
        </button>
      </div>

      {/* 最新数据卡片 */}
      {latest && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">📊 最新数据 ({latest.date})</h3>
            {bmi && (
              <span className={`text-sm font-bold ${getBMIColor(bmi)}`}>
                BMI {bmi} · {getBMIText(bmi)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center">
            {[
              { label: '体重', val: latest.weight, unit: 'kg', icon: '⚖️' },
              { label: '腰围', val: latest.waist, unit: 'cm', icon: '📏' },
              { label: '胸围', val: latest.chest, unit: 'cm', icon: '📐' },
              { label: '臀围', val: latest.hip, unit: 'cm', icon: '🔄' },
              { label: '大腿', val: latest.thigh, unit: 'cm', icon: '🦵' },
              { label: '手臂', val: latest.arm, unit: 'cm', icon: '💪' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2">
                <div className="text-lg">{item.icon}</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">{item.val || '-'}</div>
                <div className="text-xs text-gray-400">{item.unit} · {item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 体重趋势图 */}
      {records.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <LineChart size={18} className="text-indigo-500" /> 体重变化趋势
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <ReLine data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="体重" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              {records.some(r => r.waist) && <Line type="monotone" dataKey="腰围" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />}
              {records.some(r => r.chest) && <Line type="monotone" dataKey="胸围" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />}
            </ReLine>
          </ResponsiveContainer>
        </div>
      )}

      {/* 历史记录 */}
      {records.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">📋 历史记录 ({records.length})</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {records.slice().reverse().map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-700/50">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{r.date}</span>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    {r.weight > 0 && <span>⚖️{r.weight}kg</span>}
                    {r.waist > 0 && <span>📏{r.waist}cm</span>}
                    {r.chest > 0 && <span>📐{r.chest}cm</span>}
                    {r.hip > 0 && <span>🔄{r.hip}cm</span>}
                    {r.notes && <span className="text-gray-300">💬{r.notes}</span>}
                  </div>
                </div>
                <button onClick={() => { deleteRecord(r.id); toast.info('已删除'); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 录入表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">📏 记录身体数据</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <InputField label="体重 (kg) *" val={form.weight} onChange={v => setForm(f => ({...f, weight: v}))} />
                <InputField label="腰围 (cm)" val={form.waist} onChange={v => setForm(f => ({...f, waist: v}))} />
                <InputField label="胸围 (cm)" val={form.chest} onChange={v => setForm(f => ({...f, chest: v}))} />
                <InputField label="臀围 (cm)" val={form.hip} onChange={v => setForm(f => ({...f, hip: v}))} />
                <InputField label="大腿围 (cm)" val={form.thigh} onChange={v => setForm(f => ({...f, thigh: v}))} />
                <InputField label="手臂围 (cm)" val={form.arm} onChange={v => setForm(f => ({...f, arm: v}))} />
              </div>
              <input type="text" placeholder="备注（可选）" value={form.notes}
                onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm" />
              <button onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">保存数据</button>
            </div>
          </div>
        </div>
      )}

      {records.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Ruler size={48} className="mx-auto mb-3 opacity-30" />
          <p>还没有身体数据</p>
          <p className="text-sm">记录体重和围度，追踪身体变化</p>
        </div>
      )}
    </div>
  );
}

function InputField({ label, val, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input type="number" step="0.1" value={val}
        onChange={e => onChange(e.target.value)}
        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm" />
    </div>
  );
}
