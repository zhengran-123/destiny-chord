import React from 'react';
import { X, Flame, Target, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

// 运动详细指南 - 参考Keep动作库
const EXERCISE_GUIDE = {
  '深蹲': {
    level: '基础', equip: '无器械', primary: '股四头肌', secondary: '臀大肌、腘绳肌、核心',
    steps: ['双脚与肩同宽，脚尖微向外', '挺胸收腹，核心收紧', '缓慢下蹲至大腿与地面平行', '膝盖不要内扣，与脚尖方向一致', '脚跟发力站起回到起始位置'],
    tips: ['下蹲时吸气，起身时呼气', '膝盖不要超过脚尖', '保持重心在脚掌中部'],
    mistakes: ['膝盖内扣', '脚跟离地', '弯腰驼背', '下蹲深度不足'],
  },
  '硬拉': {
    level: '进阶', equip: '杠铃/哑铃', primary: '竖脊肌', secondary: '臀大肌、腘绳肌、背阔肌',
    steps: ['双脚与髋同宽，杠铃贴近小腿', '屈髋向后，保持背部平直', '握杠后收紧背阔肌', '蹬地发力，髋部前推站起', '下放时先屈髋再屈膝'],
    tips: ['全程保持背部平直不弓背', '杠铃始终贴近身体', '顶峰收缩时臀部收紧'],
    mistakes: ['弓背/圆肩', '杠铃远离身体', '过度抬头', '下放速度过快'],
  },
  '卧推': {
    level: '进阶', equip: '杠铃/哑铃', primary: '胸大肌', secondary: '三角肌前束、三头肌',
    steps: ['平躺卧推凳，眼睛在杠铃正下方', '双手比肩宽约1.5倍握杠', '收紧肩胛骨，拱起上背部', '缓慢下放杠铃至胸骨位置', '发力推起回到起始位置'],
    tips: ['全程保持肩胛骨收紧', '手腕保持直立不后弯', '脚踩实地，全身紧张'],
    mistakes: ['肩胛骨松开', '手腕弯曲', '臀部离凳', '半程卧推'],
  },
  '引体向上': {
    level: '中高级', equip: '单杠', primary: '背阔肌', secondary: '二头肌、三角肌后束',
    steps: ['双手比肩宽握杠，掌心朝前', '肩胛骨下沉收紧', '发力将身体拉起至下巴过杠', '控制缓慢下放至手臂伸直', '全程保持身体稳定不摆动'],
    tips: ['启动时先沉肩再发力', '顶峰收紧1秒', '有控制的下放比拉起更重要'],
    mistakes: ['身体摆动借力', '下巴不过杠', '肩膀耸肩', '半程引体'],
  },
  '跳绳': {
    level: '基础', equip: '跳绳', primary: '心肺系统', secondary: '小腿、核心、肩部',
    steps: ['双手各握绳柄，绳放在身后', '手腕发力摇绳，不用手臂', '脚尖着地，膝盖微弯缓冲', '保持节奏均匀，呼吸自然', '逐渐增加速度或持续时间'],
    tips: ['落地轻巧，避免重重跺地', '双肘贴近身体两侧', '绳子长度：双脚踩绳，手柄到腋窝'],
    mistakes: ['全脚掌着地（伤膝盖）', '手臂大幅摇绳（容易累）', '跳得太高（浪费体力）', '弯腰驼背'],
  },
};

// 通用模板
const DEFAULT_GUIDE = {
  level: '参考Keep动作库', equip: '根据动作选择', primary: '请参考具体动作指南',
  secondary: '', steps: ['充分热身5-10分钟', '按照标准动作要领完成训练', '控制动作节奏，避免借力', '训练后进行5-10分钟拉伸'], tips: ['每次训练保持动作质量优先', '循序渐进增加重量和组数', '有疑问请教专业教练'], mistakes: ['动作过快借力', '训练前不热身', '重量超出能力范围'],
};

export default function ExerciseDetail({ exercise, onClose }) {
  const guide = EXERCISE_GUIDE[exercise.name] || DEFAULT_GUIDE;

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[85vh] shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{exercise.icon || '💪'}</span>
            <div><h3 className="font-semibold text-gray-800 dark:text-white">{exercise.name}</h3>
              <span className="text-xs text-gray-400">{exercise.desc || ''}</span></div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20}/></button>
        </div>

        <div className="p-4 space-y-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-3 gap-2">
            <InfoBadge icon={<Flame size={14}/>} label="热量" value={`${exercise.kcal30 || '?'}kcal/30min`} />
            <InfoBadge icon={<Target size={14}/>} label="难度" value={guide.level} />
            <InfoBadge icon={<TrendingUp size={14}/>} label="器械" value={guide.equip} />
          </div>

          {/* 目标肌群 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">🎯 目标肌群</h4>
            <p className="text-sm text-gray-500"><span className="font-medium text-brand-orange">主要: </span>{guide.primary}</p>
            {guide.secondary && <p className="text-sm text-gray-400 mt-0.5"><span className="font-medium">次要: </span>{guide.secondary}</p>}
          </div>

          {/* 动作要领 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-1">
              <CheckCircle size={14} className="text-green-500"/> 动作要领
            </h4>
            <ol className="space-y-1.5">
              {guide.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 text-xs flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          {/* 训练技巧 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-1">
              <Lightbulb size={14} className="text-yellow-500"/> 训练技巧
            </h4>
            <ul className="space-y-1">
              {guide.tips.map((t, i) => (
                <li key={i} className="text-sm text-gray-500 flex items-start gap-1.5">
                  <span className="text-yellow-500">💡</span>{t}
                </li>
              ))}
            </ul>
          </div>

          {/* 常见错误 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-1">
              <AlertTriangle size={14} className="text-red-500"/> 常见错误
            </h4>
            <ul className="space-y-1">
              {guide.mistakes.map((m, i) => (
                <li key={i} className="text-sm text-red-500 flex items-start gap-1.5">
                  <span>❌</span>{m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBadge({ icon, label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2 text-center">
      <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">{icon}<span className="text-xs">{label}</span></div>
      <div className="text-xs font-medium text-gray-700 dark:text-gray-200">{value}</div>
    </div>
  );
}
