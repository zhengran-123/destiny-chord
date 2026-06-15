import React from 'react';
import { Droplets, Minus, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const WATER_GOAL = 8; // 每日8杯 = 2000ml
const CUP_ML = 250;

export default function WaterTracker({ todayCups, addWater, removeWater }) {
  const percentage = Math.min(100, Math.round(todayCups / WATER_GOAL * 100));
  const totalMl = todayCups * CUP_ML;

  const handleAdd = () => {
    addWater(1);
    if (todayCups + 1 >= WATER_GOAL) toast.success('🎉 今日喝水目标达成！');
    else toast.info(`+${CUP_ML}ml`);
  };

  return (
    <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets size={22} />
          <h3 className="font-semibold">饮水记录</h3>
        </div>
        <span className="text-sm text-white/80">{totalMl}ml / {WATER_GOAL * CUP_ML}ml</span>
      </div>

      {/* 水杯可视化 */}
      <div className="flex justify-center gap-0.5 mb-4">
        {Array.from({ length: WATER_GOAL }).map((_, i) => (
          <div key={i} className={`w-6 h-10 rounded-b-lg rounded-t transition-all ${
            i < todayCups ? 'bg-white shadow-inner' : 'bg-white/30'
          }`}>
            <div className={`h-full rounded-b-lg transition-all ${i < todayCups ? 'bg-blue-200' : ''}`}
              style={{ height: `${i < todayCups ? 100 : 20}%` }} />
          </div>
        ))}
      </div>

      {/* 进度条 */}
      <div className="w-full bg-white/30 rounded-full h-2.5 mb-4">
        <div className="bg-white rounded-full h-2.5 transition-all" style={{ width: `${percentage}%` }} />
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={removeWater} disabled={todayCups <= 0}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center disabled:opacity-40 transition-colors">
          <Minus size={18} />
        </button>
        <div className="text-center">
          <span className="text-3xl font-bold">{todayCups}</span>
          <p className="text-xs text-white/70">杯</p>
        </div>
        <button onClick={handleAdd}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
          <Plus size={18} />
        </button>
      </div>

      <p className="text-center text-xs text-white/60 mt-3">
        {todayCups === 0 ? '今天还没喝水，记得补充水分 💧' :
         todayCups >= WATER_GOAL ? '🎉 太棒了！今天喝够水了' :
         `还差 ${WATER_GOAL - todayCups} 杯达到目标`}
      </p>
    </div>
  );
}
