import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ClipboardList } from 'lucide-react';
import { toast } from 'react-toastify';
import { getToday } from '../utils/date';

export default function TaskManager({ tasks, addTask, toggleTask, deleteTask, date, setDate }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const todayStr = getToday();

  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.date === todayStr);
  }, [tasks, todayStr]);

  const completed = todayTasks.filter(t => t.completed).length;
  const progress = todayTasks.length > 0 ? Math.round((completed / todayTasks.length) * 100) : 0;

  const handleAdd = () => {
    if (!newTaskTitle.trim()) {
      toast.warn('请输入任务名称');
      return;
    }
    addTask(newTaskTitle.trim(), todayStr);
    toast.success('任务已添加');
    setNewTaskTitle('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 进度概览 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <ClipboardList size={18} className="text-purple-500" />
            今日任务
          </h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-purple-500">{progress}%</span>
            <p className="text-xs text-gray-400">{completed}/{todayTasks.length} 完成</p>
          </div>
        </div>
        {todayTasks.length > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* 添加任务 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex gap-3">
          <input
            type="text" placeholder="添加新任务..."
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center gap-1"
          >
            <Plus size={18} />
            添加
          </button>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            📋 任务列表 ({todayTasks.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {todayTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ClipboardList size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-lg">暂无待办任务</p>
              <p className="text-sm">添加每日健康任务吧</p>
            </div>
          ) : (
            todayTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center justify-between px-4 py-3 transition-colors ${
                  task.completed ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`p-0.5 rounded-full transition-colors ${
                      task.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-500'
                    }`}
                  >
                    {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                  </button>
                  <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => { deleteTask(task.id); toast.info('任务已删除'); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors ml-2 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
