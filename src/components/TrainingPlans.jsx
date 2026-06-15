import React, { useState } from 'react';
import { Target, Play, CheckCircle2, Clock, Flame, Dumbbell, Zap, Footprints, Timer } from 'lucide-react';
import { toast } from 'react-toastify';

// 训练计划库 - 参考 Keep 训练体系
const TRAINING_PLANS = [
  {
    id: 'fat-loss-7',
    title: '7天极速减脂计划',
    icon: '🔥',
    color: 'from-orange-500 to-red-500',
    category: '减脂',
    level: '初中级',
    duration: '7天',
    goal: '快速燃脂，启动代谢',
    desc: '参考Keep HIIT燃脂课程体系，每天20-30分钟高效燃脂训练',
    days: [
      { day: 1, name: '全身激活', exercises: ['开合跳 3×30', '高抬腿 3×30秒', '波比跳 3×10', '平板支撑 3×30秒'], kcal: 280, time: '25分钟' },
      { day: 2, name: '下肢燃脂', exercises: ['深蹲 4×15', '弓步蹲 3×12/腿', '蹲跳 3×10', '臀桥 3×15'], kcal: 300, time: '28分钟' },
      { day: 3, name: '核心雕刻', exercises: ['卷腹 3×20', '俄罗斯转体 3×15', '平板支撑 3×45秒', '悬挂举腿 3×10'], kcal: 250, time: '22分钟' },
      { day: 4, name: '有氧燃脂', exercises: ['跳绳（快速）5分钟×3组', '登山者 3×30秒', '滑冰跳 3×20', '开合跳 3×20'], kcal: 350, time: '30分钟' },
      { day: 5, name: '上肢+核心', exercises: ['俯卧撑 4×12', '钻石俯卧撑 3×8', '平板支撑 3×40秒', '波比跳 3×8'], kcal: 270, time: '25分钟' },
      { day: 6, name: '全身HIIT', exercises: ['Tabata训练 4分钟×3组', '蹲跳 3×12', '登山者 3×25秒', '熊爬 3×10米'], kcal: 380, time: '28分钟' },
      { day: 7, name: '恢复拉伸', exercises: ['瑜伽 20分钟', '拉伸 15分钟', '泡沫轴放松 10分钟'], kcal: 120, time: '45分钟' },
    ],
  },
  {
    id: 'muscle-30',
    title: '30天增肌塑形计划',
    icon: '🏋️',
    color: 'from-blue-500 to-indigo-500',
    category: '增肌',
    level: '中级',
    duration: '30天',
    goal: '科学增肌，雕刻线条',
    desc: '参考Keep力量增肌课程，采用推拉腿分化训练，每周5练+2休',
    days: [
      { day: 1, name: '推日（胸+肩+三头）', exercises: ['卧推 4×10', '上斜哑铃卧推 3×12', '肩推 4×10', '侧平举 3×15', '绳索下压 3×12'], kcal: 320, time: '50分钟' },
      { day: 2, name: '拉日（背+二头）', exercises: ['硬拉 4×8', '引体向上 4×力竭', '杠铃划船 4×10', '高位下拉 3×12', '杠铃弯举 3×12'], kcal: 350, time: '50分钟' },
      { day: 3, name: '腿日', exercises: ['深蹲 5×8', '罗马尼亚硬拉 4×10', '保加利亚分腿蹲 3×10/腿', '腿弯举 3×12', '提踵 4×15'], kcal: 400, time: '55分钟' },
      { day: 4, name: '休息日', exercises: ['轻度拉伸', '泡沫轴放松'], kcal: 30, time: '15分钟' },
      { day: 5, name: '推日（进阶）', exercises: ['哑铃卧推 4×10', '双杠臂屈伸 3×力竭', '阿诺德推举 3×12', '俯身飞鸟 3×15', '仰卧臂屈伸 3×12'], kcal: 340, time: '50分钟' },
      { day: 6, name: '拉日（进阶）', exercises: ['潘德雷划船 4×8', '对握引体 4×力竭', 'T杠划船 3×10', '面拉 3×15', '锤式弯举 3×12'], kcal: 360, time: '50分钟' },
      { day: 7, name: '腿日+核心', exercises: ['前蹲 4×8', '臀推 4×12', '单腿罗马尼亚硬拉 3×10', '卷腹 3×20', '俄罗斯转体 3×15'], kcal: 380, time: '55分钟' },
      { day: 8, name: '休息日', exercises: ['瑜伽', '轻度有氧'], kcal: 100, time: '30分钟' },
      { day: 9, name: '推日（容量）', exercises: ['杠铃卧推 5×8', '哑铃飞鸟 3×12', '坐姿哑铃推举 4×10', '侧平举 4×15', '窄距卧推 3×10'], kcal: 330, time: '52分钟' },
    ],
    extended: true, // 标记为有更多天数的计划
  },
  {
    id: 'run-5k',
    title: '5公里跑步训练计划',
    icon: '🏃',
    color: 'from-green-500 to-teal-500',
    category: '跑步',
    level: '新手',
    duration: '4周',
    goal: '从零跑到5公里',
    desc: '参考Keep跑步课程，循序渐进4周完赛5公里',
    days: [
      { day: 1, name: '适应性训练', exercises: ['快走 5分钟热身', '跑1分钟+走2分钟×6组', '拉伸 5分钟'], kcal: 180, time: '30分钟' },
      { day: 2, name: '休息/交叉训练', exercises: ['瑜伽 20分钟', '或散步 30分钟'], kcal: 80, time: '25分钟' },
      { day: 3, name: '间歇跑', exercises: ['快走 5分钟热身', '跑2分钟+走2分钟×5组', '拉伸 5分钟'], kcal: 200, time: '28分钟' },
      { day: 4, name: '休息', exercises: ['完全休息或轻度拉伸'], kcal: 0, time: '0分钟' },
      { day: 5, name: '持续跑', exercises: ['快走 5分钟热身', '持续跑 8分钟', '走 3分钟', '拉伸 5分钟'], kcal: 160, time: '25分钟' },
      { day: 6, name: '长距离尝试', exercises: ['快走 5分钟', '跑3分钟+走1分钟×4组', '完全拉伸 10分钟'], kcal: 220, time: '32分钟' },
      { day: 7, name: '恢复日', exercises: ['散步 30分钟', '泡沫轴放松'], kcal: 100, time: '30分钟' },
      { day: 8, name: '第2周-强度提升', exercises: ['快走 5分钟', '跑3分钟+走1分钟×6组', '拉伸 8分钟'], kcal: 240, time: '35分钟' },
    ],
    extended: true,
  },
  {
    id: 'yoga-14',
    title: '14天瑜伽柔韧计划',
    icon: '🧘',
    color: 'from-purple-500 to-pink-500',
    category: '瑜伽',
    level: '新手友好',
    duration: '14天',
    goal: '提升柔韧性，减压放松',
    desc: '参考Keep瑜伽课程体系，每日20-30分钟',
    days: [
      { day: 1, name: '基础唤醒', exercises: ['山式 2分钟', '猫牛式 10次', '下犬式 2分钟', '婴儿式 3分钟'], kcal: 80, time: '20分钟' },
      { day: 2, name: '脊柱流动', exercises: ['猫牛式 15次', '蝗虫式 3次×30秒', '桥式 3×30秒', '扭转放松 5分钟'], kcal: 90, time: '22分钟' },
      { day: 3, name: '髋部打开', exercises: ['蝴蝶式 3分钟', '鸽子式 3分钟/侧', '蜥蜴式 2分钟/侧', '快乐婴儿式 3分钟'], kcal: 85, time: '25分钟' },
      { day: 4, name: '平衡训练', exercises: ['树式 2分钟/侧', '战士三式 1分钟/侧', '半月式 1分钟/侧', '大休息 5分钟'], kcal: 100, time: '25分钟' },
      { day: 5, name: '力量瑜伽', exercises: ['四柱支撑 3×15秒', '战士二式 2分钟/侧', '侧板式 1分钟/侧', '船式 3×30秒'], kcal: 130, time: '28分钟' },
      { day: 6, name: '深度拉伸', exercises: ['坐姿前屈 3分钟', '双角式 2分钟', '卧英雄 3分钟', '大休息 7分钟'], kcal: 70, time: '30分钟' },
      { day: 7, name: '综合流动', exercises: ['拜日式A 5遍', '拜日式B 3遍', '三角式 2分钟/侧', '瑜伽休息术 10分钟'], kcal: 110, time: '35分钟' },
    ],
    extended: true,
  },
  {
    id: 'quick-5',
    title: '5分钟碎片化训练',
    icon: '⚡',
    color: 'from-yellow-500 to-amber-500',
    category: '快速',
    level: '全级别',
    duration: '长期',
    goal: '碎片时间练起来',
    desc: '参考Keep办公室训练，每个动作1分钟，随时开练',
    days: [
      { day: 1, name: '晨间唤醒', exercises: ['开合跳 1分钟', '深蹲 1分钟', '俯卧撑 1分钟', '平板支撑 1分钟', '拉伸 1分钟'], kcal: 50, time: '5分钟' },
      { day: 2, name: '午后提神', exercises: ['高抬腿 1分钟', '弓步蹲 1分钟', '波比跳 1分钟', '卷腹 1分钟', '颈部放松 1分钟'], kcal: 60, time: '5分钟' },
      { day: 3, name: '睡前放松', exercises: ['瑜伽猫牛式 1分钟', '下犬式 1分钟', '婴儿式 1分钟', '躺姿扭转 1分钟/侧', '大休息 1分钟'], kcal: 25, time: '5分钟' },
    ],
  },
];

export default function TrainingPlans({ onStartExercise }) {
  const [activePlan, setActivePlan] = useState(null);
  const [completedDays, setCompletedDays] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredPlans = categoryFilter === 'all'
    ? TRAINING_PLANS
    : TRAINING_PLANS.filter(p => p.category === categoryFilter);

  const toggleDay = (planId, dayNum) => {
    const key = `${planId}-${dayNum}`;
    setCompletedDays(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (!prev[key]) toast.success('✅ 训练完成！');
      return next;
    });
  };

  const getPlanProgress = (plan) => {
    const shownDays = plan.days.length;
    const done = plan.days.filter(d => completedDays[`${plan.id}-${d.day}`]).length;
    return { done, total: shownDays, pct: shownDays > 0 ? Math.round(done / shownDays * 100) : 0 };
  };

  // 显示完整30天计划
  const getExtendedDays = (plan) => {
    if (!plan.extended || plan.days.length >= 30) return plan.days;
    // 循环扩展计划
    const base = [...plan.days];
    while (base.length < 30) {
      base.push(...plan.days.slice(0, 7).map((d, i) => ({
        ...d, day: base.length + 1, name: `第${Math.floor(base.length / 7) + 1}周 ${d.name}`
      })));
    }
    return base.slice(0, 30);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <Target size={22} className="text-brand-orange" />
        训练计划
      </h2>

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', '减脂', '增肌', '跑步', '瑜伽', '快速'].map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              categoryFilter === cat ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}>{cat === 'all' ? '全部' : cat}</button>
        ))}
      </div>

      {/* 计划卡片 */}
      <div className="space-y-4">
        {filteredPlans.map(plan => {
          const prog = getPlanProgress(plan);
          return (
            <div key={plan.id} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden transition-all ${
              activePlan === plan.id ? 'border-brand-orange ring-1 ring-brand-orange/30' : 'border-gray-100 dark:border-gray-700'
            }`}>
              {/* 计划头部 */}
              <div className={`bg-gradient-to-r ${plan.color} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{plan.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{plan.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-white/80">
                        <span className="flex items-center gap-1"><Clock size={12}/>{plan.duration}</span>
                        <span>·</span>
                        <span>{plan.level}</span>
                        <span>·</span>
                        <span>{plan.goal}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActivePlan(activePlan === plan.id ? null : plan.id)}
                    className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors">
                    {activePlan === plan.id ? '收起' : '查看计划'}
                  </button>
                </div>
                {prog.total > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                      <span>完成进度</span><span>{prog.done}/{prog.total} 天</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-1.5">
                      <div className="bg-white rounded-full h-1.5 transition-all" style={{ width: `${prog.pct}%` }}/>
                    </div>
                  </div>
                )}
              </div>

              {/* 计划详情 */}
              {activePlan === plan.id && (
                <div className="p-4 max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
                  <div className="space-y-2">
                    {getExtendedDays(plan).slice(0, activePlan === plan.id ? 30 : 7).map((d, i) => {
                      const key = `${plan.id}-${d.day}`;
                      const done = completedDays[key];
                      return (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                          done ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                          'bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700'
                        }`}>
                          <button onClick={() => toggleDay(plan.id, d.day)}
                            className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              done ? 'bg-green-500 text-white' : 'border-2 border-gray-300 dark:border-gray-500 text-gray-400'
                            }`}>{done ? '✓' : d.day}</button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${done ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                              第{d.day}天 · {d.name}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {d.exercises.map((ex, j) => (
                                <span key={j} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-600 text-xs text-gray-600 dark:text-gray-300">{ex}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs text-orange-500 flex items-center gap-0.5"><Flame size={10}/>{d.kcal}kcal</span>
                            <p className="text-xs text-gray-400">{d.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
