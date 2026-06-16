import React from 'react';
import { Flame, Zap, Dumbbell, Heart } from 'lucide-react';

// 热身+拉伸动作库
const WARMUP_ROUTINES = [
  {
    title: '全身热身（5分钟）',
    icon: '🔥',
    color: 'from-orange-400 to-red-400',
    exercises: [
      { name: '开合跳', duration: '1分钟', desc: '激活全身血液循环', tips: '手臂上举时吸气，下落时呼气' },
      { name: '高抬腿', duration: '1分钟', desc: '提升心率，热身下肢', tips: '大腿抬至与地面平行' },
      { name: '手臂画圈', duration: '30秒/方向', desc: '激活肩关节', tips: '由小圈逐渐画大圈' },
      { name: '躯干扭转', duration: '30秒/侧', desc: '激活核心，放松脊柱', tips: '下半身保持不动' },
      { name: '原地小跑', duration: '1分钟', desc: '进一步提升心率', tips: '轻盈落地，前脚掌着地' },
      { name: '动态拉伸', duration: '30秒', desc: '全身动态拉伸', tips: '每个动作缓慢控制' },
    ],
  },
  {
    title: '上肢热身',
    icon: '💪',
    color: 'from-blue-400 to-indigo-400',
    exercises: [
      { name: '肩关节环绕', duration: '30秒/方向', desc: '激活肩袖肌群', tips: '大幅度缓慢旋转' },
      { name: '手臂交叉拉伸', duration: '30秒/侧', desc: '拉伸三角肌后束', tips: '拉到有轻微拉伸感即可' },
      { name: '手腕转动', duration: '30秒', desc: '保护手腕关节', tips: '手腕向内外各转10圈' },
      { name: '弹力带拉开', duration: '1分钟', desc: '激活背部+肩后束', tips: '有弹力带最佳' },
    ],
  },
  {
    title: '下肢热身',
    icon: '🦵',
    color: 'from-green-400 to-teal-400',
    exercises: [
      { name: '原地弓步', duration: '30秒/侧', desc: '激活臀腿肌群', tips: '前膝不超过脚尖' },
      { name: '体前屈', duration: '45秒', desc: '拉伸腘绳肌', tips: '膝盖微弯，腰背挺直' },
      { name: '髋关节绕环', duration: '30秒/方向', desc: '打开髋关节活动度', tips: '手扶墙保持平衡' },
      { name: '脚踝转动', duration: '30秒', desc: '预防踝关节扭伤', tips: '坐姿，抬脚画圈' },
    ],
  },
];

const COOLDOWN_ROUTINES = [
  {
    title: '全身拉伸放松（5分钟）',
    icon: '🧘',
    color: 'from-purple-400 to-pink-400',
    exercises: [
      { name: '下犬式', duration: '1分钟', desc: '拉伸后链肌群', tips: '脚跟尽量踩地，膝盖可微弯' },
      { name: '婴儿式', duration: '1分钟', desc: '放松背部+臀部', tips: '额头贴地，深呼吸' },
      { name: '蝴蝶式', duration: '1分钟', desc: '打开髋部', tips: '脚掌相对，膝盖自然下沉' },
      { name: '坐姿前屈', duration: '1分钟', desc: '拉伸腘绳肌+下背', tips: '不追求摸到脚，微弯膝盖' },
      { name: '仰卧扭转', duration: '30秒/侧', desc: '放松脊柱', tips: '肩膀贴地，缓慢呼吸' },
    ],
  },
  {
    title: '跑后拉伸',
    icon: '🏃',
    color: 'from-cyan-400 to-blue-400',
    exercises: [
      { name: '小腿拉伸', duration: '30秒/侧', desc: '拉伸腓肠肌+比目鱼肌', tips: '脚尖抵墙，身体前倾' },
      { name: '股四头肌拉伸', duration: '30秒/侧', desc: '拉伸大腿前侧', tips: '手抓脚踝，膝盖并拢' },
      { name: '腘绳肌拉伸', duration: '30秒/侧', desc: '拉伸大腿后侧', tips: '单腿伸直前屈' },
      { name: '髋屈肌拉伸', duration: '30秒/侧', desc: '拉伸髋部前方', tips: '弓步姿势，臀部前推' },
      { name: '背部拉伸', duration: '30秒', desc: '放松上背部', tips: '双手交叉前伸，弓背' },
    ],
  },
];

function RoutineCard({ routine }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden`}>
      <div className={`bg-gradient-to-r ${routine.color} p-4 text-white`}>
        <h4 className="font-semibold flex items-center gap-2">{routine.icon} {routine.title}</h4>
      </div>
      <div className="p-4 space-y-2">
        {routine.exercises.map((ex, i) => (
          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs shrink-0 mt-0.5">{i+1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800 dark:text-white">{ex.name}</span>
                <span className="text-xs text-brand-orange font-medium">{ex.duration}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{ex.desc}</p>
              <p className="text-xs text-gray-300 mt-0.5 italic">💡 {ex.tips}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WarmUpGuide() {
  return (
    <div className="space-y-6">
      {/* 热身 */}
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
          <Fire size={18} className="text-orange-500" /> 🔥 训练前热身
        </h3>
        <div className="space-y-4">
          {WARMUP_ROUTINES.map((r, i) => <RoutineCard key={i} routine={r} />)}
        </div>
      </div>

      {/* 拉伸放松 */}
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
          <Heart size={18} className="text-purple-500" /> 🧘 训练后拉伸放松
        </h3>
        <div className="space-y-4">
          {COOLDOWN_ROUTINES.map((r, i) => <RoutineCard key={i} routine={r} />)}
        </div>
      </div>

      {/* 训练建议 */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-5 border border-yellow-200 dark:border-yellow-800/50">
        <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">💡 训练建议</h3>
        <div className="space-y-2 text-sm text-yellow-600 dark:text-yellow-400">
          <p>• 每次训练前务必热身5-10分钟，避免受伤</p>
          <p>• 训练后进行5-10分钟拉伸，帮助肌肉恢复</p>
          <p>• 力量训练每组间休息30-90秒</p>
          <p>• 有氧运动建议每周3-5次，每次30分钟以上</p>
          <p>• 力量训练建议每周2-3次，每次间隔48小时</p>
          <p>• 合理安排休息日，每周至少1-2天完全休息</p>
          <p>• 运动前2小时避免大量进食</p>
          <p>• 运动中随时补充水分，少量多次</p>
        </div>
      </div>
    </div>
  );
}
