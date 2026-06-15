import React, { useState } from 'react';
import { Users, UserPlus, X, Trash2, Flame, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { getToday, formatDateCN } from '../utils/date';
import { sumDailyNutrition } from '../utils/calculation';

const STORAGE_KEY = 'health_family_members';

function getFamilyMembers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveFamilyMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export default function FamilyTracking({ mealRecords, exerciseRecords }) {
  const [members, setMembers] = useState(getFamilyMembers);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const todayStr = getToday();

  const handleAddMember = () => {
    if (!newName.trim()) return;
    const member = {
      id: Date.now(),
      name: newName.trim(),
      avatar: ['👨', '👩', '👦', '👧', '👴', '👵'][Math.floor(Math.random() * 6)],
      createdAt: todayStr,
    };
    const updated = [...members, member];
    setMembers(updated);
    saveFamilyMembers(updated);
    setNewName('');
    setShowAdd(false);
    toast.success(`已添加家庭成员: ${member.name}`);
  };

  const handleRemoveMember = (id) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    saveFamilyMembers(updated);
    if (selectedMember?.id === id) setSelectedMember(null);
    toast.info('已移除家庭成员');
  };

  const memberStats = (member) => {
    const meals = mealRecords.filter(m => m.memberId === member.id && m.date === todayStr);
    const ex = exerciseRecords.filter(e => e.memberId === member.id && e.date === todayStr);
    const nutrition = sumDailyNutrition(meals);
    return {
      calories: nutrition.calories,
      exercises: ex.length,
      mealCount: meals.length,
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Users size={22} className="text-indigo-500" />
          家庭共享
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center gap-1"
        >
          <UserPlus size={16} /> 添加成员
        </button>
      </div>

      {/* 成员卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 自己的卡片 */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border-2 cursor-pointer transition-all ${
            selectedMember === null ? 'border-brand-orange' : 'border-gray-100 dark:border-gray-700 hover:border-brand-orange/50'
          }`}
          onClick={() => setSelectedMember(null)}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">😎</span>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">我</p>
              <p className="text-xs text-gray-400">主要用户</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-orange-500">🔥 {sumDailyNutrition(mealRecords.filter(m => m.date === todayStr)).calories} kcal</span>
            <span className="text-green-500">💪 {exerciseRecords.filter(e => e.date === todayStr).length} 运动</span>
          </div>
        </div>

        {/* 家庭成员的卡片 */}
        {members.map(member => {
          const stats = memberStats(member);
          return (
            <div
              key={member.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border-2 cursor-pointer transition-all ${
                selectedMember?.id === member.id ? 'border-indigo-500' : 'border-gray-100 dark:border-gray-700 hover:border-indigo-500/50'
              }`}
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{member.avatar}</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{member.name}</p>
                    <p className="text-xs text-gray-400">加入于 {member.createdAt}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.id); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-orange-500">🔥 {stats.calories} kcal</span>
                <span className="text-green-500">💪 {stats.exercises} 运动</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 添加成员弹窗 */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                <UserPlus size={18} className="text-indigo-500" /> 添加家庭成员
              </h3>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <input
              type="text" placeholder="输入成员名称"
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddMember()}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 mb-4"
              autoFocus
            />
            <button
              onClick={handleAddMember}
              className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors"
            >
              确认添加
            </button>
          </div>
        </div>
      )}

      {/* 成员概览 */}
      {selectedMember && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
            {selectedMember.avatar} {selectedMember.name} 今日概况
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-500">
                {memberStats(selectedMember).calories}
              </div>
              <div className="text-xs text-gray-400">热量 (kcal)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {memberStats(selectedMember).exercises}
              </div>
              <div className="text-xs text-gray-400">运动项数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {memberStats(selectedMember).mealCount}
              </div>
              <div className="text-xs text-gray-400">食物记录</div>
            </div>
          </div>
        </div>
      )}

      {members.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Users size={48} className="mx-auto mb-3 opacity-30" />
          <p>还没有添加家庭成员</p>
          <p className="text-sm">添加家人一起追踪健康数据</p>
        </div>
      )}
    </div>
  );
}
