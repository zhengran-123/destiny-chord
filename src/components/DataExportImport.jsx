import React, { useState, useRef } from 'react';
import { Download, Upload, FileJson, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { exportAllData, importAllData } from '../utils/storage';

export default function DataExportImport({
  mealRecords, exerciseRecords, tasks, checkInDays, goals, customFoods, darkMode,
  setMealRecords, setExerciseRecords, setTasks, setCheckInDays, updateGoals
}) {
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = exportAllData(mealRecords, exerciseRecords, tasks, checkInDays, goals, customFoods);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('数据已导出！');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (!data.version) throw new Error('不是有效的健康数据文件');

        setImportStatus({ type: 'confirm', data, fileName: file.name });
      } catch (err) {
        setImportStatus({ type: 'error', message: '文件格式不正确，请选择有效的健康数据文件' });
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (!importStatus?.data) return;
    try {
      importAllData(importStatus.data);
      // 触发状态更新
      setMealRecords(importStatus.data.meals || []);
      setExerciseRecords(importStatus.data.exercises || []);
      setTasks(importStatus.data.tasks || []);
      setCheckInDays(importStatus.data.checkIns || []);
      if (importStatus.data.goals) updateGoals(importStatus.data.goals);
      setImportStatus({ type: 'success', message: '数据导入成功！所有记录已恢复' });
      toast.success('数据导入成功！');
    } catch (err) {
      setImportStatus({ type: 'error', message: '导入失败: ' + err.message });
    }
  };

  const cancelImport = () => setImportStatus(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">💾 数据管理</h2>

      {/* 导出 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
            <Download size={22} className="text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">导出数据</h3>
            <p className="text-xs text-gray-400">将所有健康数据导出为 JSON 文件备份</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <FileJson size={18} />
          导出全部数据 (JSON)
        </button>
      </div>

      {/* 导入 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <Upload size={22} className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">导入数据</h3>
            <p className="text-xs text-gray-400">从之前导出的 JSON 文件恢复数据</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          选择文件导入
        </button>
      </div>

      {/* 导入状态 */}
      {importStatus && (
        <div className={`rounded-2xl p-5 ${
          importStatus.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
          importStatus.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
          'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-start gap-3">
            {importStatus.type === 'success' && <CheckCircle size={20} className="text-green-500 mt-0.5" />}
            {importStatus.type === 'error' && <AlertCircle size={20} className="text-red-500 mt-0.5" />}
            {importStatus.type === 'confirm' && <AlertCircle size={20} className="text-blue-500 mt-0.5" />}
            <div className="flex-1">
              {importStatus.type === 'confirm' && (
                <>
                  <p className="font-medium text-gray-800 dark:text-white">确认导入？</p>
                  <p className="text-sm text-gray-500 mt-1">
                    文件: {importStatus.fileName}<br />
                    导入后将覆盖当前所有数据（{importStatus.data.meals?.length || 0} 条饮食 · {importStatus.data.exercises?.length || 0} 条运动 · {importStatus.data.tasks?.length || 0} 条任务）
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={confirmImport} className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">确认导入</button>
                    <button onClick={cancelImport} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-300">取消</button>
                  </div>
                </>
              )}
              {importStatus.type === 'success' && <p className="text-green-700 dark:text-green-300">{importStatus.message}</p>}
              {importStatus.type === 'error' && <p className="text-red-700 dark:text-red-300">{importStatus.message}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
