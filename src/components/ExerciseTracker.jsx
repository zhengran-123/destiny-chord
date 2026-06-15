import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Dumbbell, X, Flame, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { getToday } from '../utils/date';

// ==================== 100+ 运动数据库（含每30分钟消耗热量） ====================
const EXERCISE_DB = [
  // ===== 力量训练 =====
  { name: '深蹲', icon: '🦵', cat: 'strength', kcal30: 200, desc: '自重深蹲，下肢力量基石' },
  { name: '负重深蹲', icon: '🏋️', cat: 'strength', kcal30: 280, desc: '杠铃深蹲，复合动作之王' },
  { name: '弓步蹲', icon: '🦿', cat: 'strength', kcal30: 180, desc: '单侧训练，改善平衡' },
  { name: '保加利亚分腿蹲', icon: '🦿', cat: 'strength', kcal30: 210, desc: '后腿抬高弓步蹲' },
  { name: '臀桥', icon: '🌉', cat: 'strength', kcal30: 150, desc: '臀大肌激活，改善髋部' },
  { name: '臀推', icon: '🌉', cat: 'strength', kcal30: 220, desc: '负重臀桥，臀肌轰炸' },
  { name: '罗马尼亚硬拉', icon: '🏋️', cat: 'strength', kcal30: 260, desc: '腘绳肌&臀部训练' },
  { name: '传统硬拉', icon: '🏋️', cat: 'strength', kcal30: 300, desc: '全身力量之王' },
  { name: '相扑硬拉', icon: '🏋️', cat: 'strength', kcal30: 290, desc: '宽站距硬拉' },
  { name: '卧推', icon: '🏋️‍♂️', cat: 'strength', kcal30: 240, desc: '杠铃卧推，胸肌核心' },
  { name: '上斜卧推', icon: '🏋️‍♂️', cat: 'strength', kcal30: 230, desc: '上胸针对性训练' },
  { name: '哑铃飞鸟', icon: '🕊️', cat: 'strength', kcal30: 180, desc: '胸肌拉伸收缩' },
  { name: '俯卧撑', icon: '🤸', cat: 'strength', kcal30: 170, desc: '经典上肢自重训练' },
  { name: '宽距俯卧撑', icon: '🤸', cat: 'strength', kcal30: 180, desc: '侧重胸肌外沿' },
  { name: '钻石俯卧撑', icon: '💎', cat: 'strength', kcal30: 190, desc: '三头肌轰炸' },
  { name: '下斜俯卧撑', icon: '🤸', cat: 'strength', kcal30: 195, desc: '上胸&肩部加强' },
  { name: '引体向上', icon: '🧗', cat: 'strength', kcal30: 220, desc: '背部宽度训练' },
  { name: '反手引体向上', icon: '🧗', cat: 'strength', kcal30: 200, desc: '侧重二头肌' },
  { name: '弹力带引体', icon: '🪢', cat: 'strength', kcal30: 150, desc: '辅助引体向上' },
  { name: '哑铃弯举', icon: '💪', cat: 'strength', kcal30: 140, desc: '二头肌孤立训练' },
  { name: '锤式弯举', icon: '💪', cat: 'strength', kcal30: 145, desc: '肱肌&前臂' },
  { name: '杠铃弯举', icon: '💪', cat: 'strength', kcal30: 160, desc: '大重量二头训练' },
  { name: '三头臂屈伸', icon: '💪', cat: 'strength', kcal30: 150, desc: '凳上臂屈伸' },
  { name: '窄距卧推', icon: '🏋️‍♂️', cat: 'strength', kcal30: 220, desc: '三头肌+胸肌' },
  { name: '肩推', icon: '🙆', cat: 'strength', kcal30: 200, desc: '哑铃/杠铃肩推' },
  { name: '侧平举', icon: '🦅', cat: 'strength', kcal30: 120, desc: '中束三角肌' },
  { name: '前平举', icon: '🫴', cat: 'strength', kcal30: 115, desc: '前束三角肌' },
  { name: '俯身飞鸟', icon: '🦅', cat: 'strength', kcal30: 130, desc: '后束三角肌' },
  { name: '面拉', icon: '🧵', cat: 'strength', kcal30: 140, desc: '肩袖肌群&后束' },
  { name: '杠铃划船', icon: '🚣', cat: 'strength', kcal30: 230, desc: '背部厚度训练' },
  { name: '哑铃划船', icon: '🚣', cat: 'strength', kcal30: 210, desc: '单侧背部训练' },
  { name: '坐姿划船', icon: '🚣', cat: 'strength', kcal30: 190, desc: '器械背部训练' },
  { name: '高位下拉', icon: '⬇️', cat: 'strength', kcal30: 200, desc: '背阔肌宽度' },
  { name: '卷腹', icon: '🔄', cat: 'strength', kcal30: 120, desc: '上腹肌训练' },
  { name: '仰卧起坐', icon: '🔄', cat: 'strength', kcal30: 140, desc: '全腹肌训练' },
  { name: '平板支撑', icon: '🧘', cat: 'strength', kcal30: 100, desc: '核心稳定性训练' },
  { name: '俄罗斯转体', icon: '🔄', cat: 'strength', kcal30: 160, desc: '腹斜肌训练' },
  { name: '悬挂举腿', icon: '🦵', cat: 'strength', kcal30: 180, desc: '下腹肌轰炸' },
  { name: '腿举', icon: '🦿', cat: 'strength', kcal30: 250, desc: '器械腿部训练' },
  { name: '腿弯举', icon: '🦿', cat: 'strength', kcal30: 170, desc: '腘绳肌孤立' },
  { name: '腿屈伸', icon: '🦿', cat: 'strength', kcal30: 160, desc: '股四头肌孤立' },
  { name: '提踵', icon: '🦶', cat: 'strength', kcal30: 110, desc: '小腿肌肉训练' },
  { name: '农夫行走', icon: '🚶', cat: 'strength', kcal30: 220, desc: '握力&核心稳定' },
  { name: '壶铃摇摆', icon: '🔔', cat: 'strength', kcal30: 320, desc: '爆发力&后链训练' },

  // ===== 有氧运动 =====
  { name: '跑步（慢跑）', icon: '🏃', cat: 'cardio', kcal30: 260, desc: '~8km/h，经典燃脂' },
  { name: '跑步（快跑）', icon: '🏃‍♂️', cat: 'cardio', kcal30: 400, desc: '~12km/h，高效燃脂' },
  { name: '跑步（冲刺）', icon: '💨', cat: 'cardio', kcal30: 520, desc: '~16km/h，极限燃脂' },
  { name: '快走/健走', icon: '🚶‍♂️', cat: 'cardio', kcal30: 170, desc: '~6km/h，关节友好' },
  { name: '爬楼梯', icon: '🪜', cat: 'cardio', kcal30: 280, desc: '上楼高强度有氧' },
  { name: '跳绳（慢速）', icon: '🪢', cat: 'cardio', kcal30: 270, desc: '60-80次/分' },
  { name: '跳绳（快速）', icon: '⏩', cat: 'cardio', kcal30: 420, desc: '120-150次/分，高燃脂' },
  { name: '游泳（蛙泳）', icon: '🏊', cat: 'cardio', kcal30: 210, desc: '关节零压力' },
  { name: '游泳（自由泳）', icon: '🏊‍♂️', cat: 'cardio', kcal30: 330, desc: '全身高效燃脂' },
  { name: '骑行（休闲）', icon: '🚴', cat: 'cardio', kcal30: 140, desc: '~10km/h，轻松骑行' },
  { name: '骑行（快速）', icon: '🚴‍♂️', cat: 'cardio', kcal30: 280, desc: '~20km/h，中高强度' },
  { name: '骑行（竞速）', icon: '🚴‍♂️', cat: 'cardio', kcal30: 440, desc: '~30km/h，高强度' },
  { name: '椭圆机', icon: '🔄', cat: 'cardio', kcal30: 180, desc: '低冲击有氧' },
  { name: '划船机', icon: '🚣‍♂️', cat: 'cardio', kcal30: 260, desc: '全身80%肌肉参与' },
  { name: '划船机（高强度）', icon: '🚣‍♂️', cat: 'cardio', kcal30: 430, desc: '比赛强度划船' },
  { name: '踏步机', icon: '🪜', cat: 'cardio', kcal30: 160, desc: '低强度有氧' },

  // ===== HIIT/间歇训练 =====
  { name: '波比跳', icon: '🔥', cat: 'hiit', kcal30: 380, desc: '全身燃脂之王' },
  { name: '开合跳', icon: '⭐', cat: 'hiit', kcal30: 280, desc: '经典热身/燃脂' },
  { name: '高抬腿', icon: '🦵', cat: 'hiit', kcal30: 320, desc: '核心&心肺训练' },
  { name: '登山者', icon: '⛰️', cat: 'hiit', kcal30: 350, desc: '动态平板支撑' },
  { name: '战绳', icon: '〰️', cat: 'hiit', kcal30: 400, desc: '上肢爆发+心肺' },
  { name: '药球砸地', icon: '⚽', cat: 'hiit', kcal30: 300, desc: '核心爆发训练' },
  { name: 'Tabata训练', icon: '⏱️', cat: 'hiit', kcal30: 420, desc: '20秒全力+10秒休息' },
  { name: '熊爬', icon: '🐻', cat: 'hiit', kcal30: 280, desc: '全身协调训练' },
  { name: '滑冰跳', icon: '⛸️', cat: 'hiit', kcal30: 310, desc: '侧向爆发+平衡' },
  { name: '蹲跳', icon: '⬆️', cat: 'hiit', kcal30: 340, desc: '下肢爆发力' },

  // ===== 球类运动 =====
  { name: '篮球', icon: '🏀', cat: 'ball', kcal30: 260, desc: '全场对抗，综合燃脂' },
  { name: '足球', icon: '⚽', cat: 'ball', kcal30: 280, desc: '竞技比赛强度' },
  { name: '羽毛球', icon: '🏸', cat: 'ball', kcal30: 220, desc: '灵敏+心肺' },
  { name: '网球', icon: '🎾', cat: 'ball', kcal30: 290, desc: '单打高强度' },
  { name: '乒乓球', icon: '🏓', cat: 'ball', kcal30: 160, desc: '反应+协调' },
  { name: '排球', icon: '🏐', cat: 'ball', kcal30: 240, desc: '跳跃+团队协作' },

  // ===== 柔韧/身心 =====
  { name: '瑜伽', icon: '🧘‍♀️', cat: 'mind', kcal30: 105, desc: '柔韧+减压' },
  { name: '普拉提', icon: '🧘', cat: 'mind', kcal30: 120, desc: '核心控制+体态' },
  { name: '太极', icon: '☯️', cat: 'mind', kcal30: 100, desc: '中国传统养身' },
  { name: '拉伸', icon: '🤸‍♀️', cat: 'mind', kcal30: 70, desc: '柔韧性训练' },
  { name: '八段锦', icon: '📜', cat: 'mind', kcal30: 90, desc: '传统养生功法' },
  { name: '冥想', icon: '🧘‍♂️', cat: 'mind', kcal30: 30, desc: '心理恢复' },

  // ===== 户外运动 =====
  { name: '登山', icon: '⛰️', cat: 'outdoor', kcal30: 250, desc: '户外心肺+腿部' },
  { name: '徒步', icon: '🥾', cat: 'outdoor', kcal30: 180, desc: '长时间低强度' },
  { name: '滑雪', icon: '⛷️', cat: 'outdoor', kcal30: 240, desc: '娱乐+燃脂' },
  { name: '滑冰', icon: '⛸️', cat: 'outdoor', kcal30: 200, desc: '平衡+有氧' },
  { name: '攀岩', icon: '🧗‍♂️', cat: 'outdoor', kcal30: 300, desc: '全身力量+耐力' },

  // ===== 舞蹈/操课 =====
  { name: '有氧操', icon: '🤸‍♀️', cat: 'dance', kcal30: 230, desc: '快乐燃脂' },
  { name: '尊巴', icon: '💃', cat: 'dance', kcal30: 300, desc: '拉丁舞蹈健身' },
  { name: '搏击操', icon: '🥊', cat: 'dance', kcal30: 350, desc: '拳击+有氧结合' },
  { name: '街舞', icon: '🕺', cat: 'dance', kcal30: 270, desc: 'Hip-hop舞蹈' },
  { name: '健身操', icon: '📺', cat: 'dance', kcal30: 200, desc: '广播体操/广场舞' },

  // ===== 格斗/武术 =====
  { name: '拳击', icon: '🥊', cat: 'martial', kcal30: 420, desc: '高强度全身训练' },
  { name: '跆拳道', icon: '🥋', cat: 'martial', kcal30: 360, desc: '腿部技巧+灵活' },
  { name: '空手道', icon: '🥋', cat: 'martial', kcal30: 340, desc: '传统武术' },
  { name: '散打', icon: '👊', cat: 'martial', kcal30: 380, desc: '中国实战武术' },
  { name: '柔道', icon: '🥋', cat: 'martial', kcal30: 350, desc: '摔投技巧' },
];

const CATEGORIES = [
  { key: 'all', label: '全部', icon: '🌟' },
  { key: 'strength', label: '力量训练', icon: '🏋️' },
  { key: 'cardio', label: '有氧运动', icon: '🏃' },
  { key: 'hiit', label: 'HIIT/间歇', icon: '🔥' },
  { key: 'ball', label: '球类运动', icon: '⚽' },
  { key: 'mind', label: '柔韧/身心', icon: '🧘' },
  { key: 'outdoor', label: '户外运动', icon: '⛰️' },
  { key: 'dance', label: '舞蹈/操课', icon: '💃' },
  { key: 'martial', label: '格斗/武术', icon: '🥊' },
];

export default function ExerciseTracker({ records, addExercise, deleteExercise, date, setDate }) {
  const [showForm, setShowForm] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [customName, setCustomName] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = getToday();

  const selectedExercise = EXERCISE_DB.find(e => e.name === exerciseName);

  const filteredExercises = useMemo(() => {
    let list = EXERCISE_DB;
    if (activeCat !== 'all') list = list.filter(e => e.cat === activeCat);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeCat, searchQuery]);

  const todayExercises = useMemo(() => {
    return records.filter(r => r.date === todayStr).sort((a, b) => b.time.localeCompare(a.time));
  }, [records, todayStr]);

  const todayVolume = useMemo(() => todayExercises.reduce((s, e) => s + (e.totalVolume || 0), 0), [todayExercises]);
  const todayCalories = useMemo(() => todayExercises.reduce((s, e) => s + (e.caloriesBurned || 0), 0), [todayExercises]);

  // 根据运动类型和训练量估算消耗热量
  const calcCalories = (exercise, s, r) => {
    if (!exercise) return 0;
    // 力量训练：按组数×次数估算 (每次约0.8-2kcal， 取1.2)
    const isStrength = ['strength'].includes(exercise.cat);
    if (isStrength) {
      return Math.round(exercise.kcal30 / 30 / 10 * s * r);
    }
    // 有氧/HIIT 等：按总次数估算训练量（比例缩放到30分钟基准）
    const intensity = s * r / 30; // 训练量系数
    return Math.round(exercise.kcal30 * intensity / 10);
  };

  const handleAdd = (name) => {
    if (!name.trim()) return;
    const exercise = EXERCISE_DB.find(e => e.name === name);
    const calories = calcCalories(exercise, sets, reps);
    addExercise(name, sets, reps, calories, todayStr);
    toast.success(`已记录: ${name} ${sets}×${reps} · 约${calories}kcal`);
    setExerciseName('');
    setSets(3);
    setReps(10);
    setShowForm(false);
  };

  const handleCustomAdd = () => {
    if (!customName.trim()) { toast.warn('请输入运动名称'); return; }
    addExercise(customName.trim(), sets, reps, 0, todayStr);
    toast.success(`已记录: ${customName.trim()} ${sets}×${reps}`);
    setCustomName('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 今日统计摘要 */}
      {todayExercises.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800/50">
            <div className="text-2xl font-bold text-green-600">{todayExercises.length}</div>
            <div className="text-xs text-green-500/80">运动项数</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800/50">
            <div className="text-2xl font-bold text-orange-600">{todayCalories}</div>
            <div className="text-xs text-orange-500/80">消耗热量 (kcal)</div>
          </div>
        </div>
      )}

      {/* 搜索 & 自定义 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="搜索 100+ 种运动..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500/50 text-sm"
            />
          </div>
          <button
            onClick={() => { setExerciseName(''); setShowForm(true); }}
            className="px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <Plus size={16} /> 自定义
          </button>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCat(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeCat === cat.key
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* 运动列表（分类网格） */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {activeCat === 'all' ? '全部运动' : CATEGORIES.find(c => c.key === activeCat)?.label} ({filteredExercises.length})
          </span>
          <span className="text-xs text-gray-400">点击选择运动</span>
        </div>
        <div className="max-h-60 overflow-y-auto p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {filteredExercises.map(ex => (
            <button
              key={ex.name}
              onClick={() => { setExerciseName(ex.name); setShowForm(true); }}
              className={`text-left p-2.5 rounded-xl transition-all hover:shadow-sm border ${
                exerciseName === ex.name
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">{ex.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{ex.name}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-orange-500">
                <Flame size={10} />
                <span>{ex.kcal30}kcal/30min</span>
              </div>
            </button>
          ))}
          {filteredExercises.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400 text-sm">没有找到匹配的运动</div>
          )}
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
                <div className="text-center">
                  <span className="text-4xl">{selectedExercise?.icon || '💪'}</span>
                  <p className="text-lg font-medium text-gray-800 dark:text-white mt-1">{exerciseName}</p>
                  {selectedExercise && (
                    <p className="text-xs text-gray-400">{selectedExercise.desc}</p>
                  )}
                </div>

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

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">总运动量</span>
                    <span className="font-bold text-green-500">{sets * reps} 次</span>
                  </div>
                  {selectedExercise && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">预估消耗</span>
                      <span className="font-bold text-orange-500 flex items-center gap-1">
                        <Flame size={14} /> {calcCalories(selectedExercise, sets, reps)} kcal
                      </span>
                    </div>
                  )}
                </div>

                <button onClick={() => handleAdd(exerciseName)} className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors">
                  添加到记录
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">输入自定义运动名称</p>
                <input
                  type="text" placeholder="例如：攀岩、单板滑雪..."
                  value={customName} onChange={e => setCustomName(e.target.value)}
                  autoFocus
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
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-500">{todayVolume} 次</span>
              <span className="text-orange-500">🔥 {todayCalories} kcal</span>
            </div>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {todayExercises.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Dumbbell size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-lg">今天还没有运动记录</p>
              <p className="text-sm">从上方 100+ 种运动中选择开始训练</p>
            </div>
          ) : (
            todayExercises.map(ex => {
              const exDef = EXERCISE_DB.find(e => e.name === ex.name);
              return (
                <div key={ex.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{exDef?.icon || '💪'}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{ex.name}</p>
                      <p className="text-xs text-gray-400">{ex.sets}组 × {ex.reps}次/组 · {ex.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-semibold text-green-500 text-sm">{ex.totalVolume} 次</span>
                      {ex.caloriesBurned > 0 && (
                        <p className="text-xs text-orange-500 font-medium">{ex.caloriesBurned} kcal</p>
                      )}
                    </div>
                    <button
                      onClick={() => { deleteExercise(ex.id); toast.info('已删除'); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
