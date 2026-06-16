import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

const PATTERNS = [
  { id: 'box', name: '箱式呼吸', icon: '📦', desc: '海军SEALs使用，快速镇定', steps: [
    { label: '吸气', duration: 4, color: 'bg-blue-400' },
    { label: '屏息', duration: 4, color: 'bg-indigo-400' },
    { label: '呼气', duration: 4, color: 'bg-teal-400' },
    { label: '屏息', duration: 4, color: 'bg-indigo-300' },
  ]},
  { id: '478', name: '4-7-8呼吸法', icon: '😴', desc: '助眠放松，Dr. Weil推荐', steps: [
    { label: '吸气', duration: 4, color: 'bg-blue-400' },
    { label: '屏息', duration: 7, color: 'bg-purple-400' },
    { label: '呼气', duration: 8, color: 'bg-teal-400' },
  ]},
  { id: 'relax', name: '深度放松', icon: '🧘', desc: '5-5呼吸，舒缓压力', steps: [
    { label: '吸气', duration: 5, color: 'bg-blue-400' },
    { label: '呼气', duration: 5, color: 'bg-green-400' },
  ]},
];

export default function BreathingGuide() {
  const [pattern, setPattern] = useState(PATTERNS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [round, setRound] = useState(1);
  const intervalRef = useRef(null);

  const currentStep = pattern.steps[stepIndex];
  const totalSteps = pattern.steps.length;

  const start = () => {
    setIsRunning(true);
    setStepIndex(0);
    setSeconds(pattern.steps[0].duration);
    setRound(1);
  };

  const pause = () => setIsRunning(false);
  const reset = () => { setIsRunning(false); setStepIndex(0); setSeconds(0); setRound(1); };

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          const nextIdx = stepIndex + 1;
          if (nextIdx >= totalSteps) {
            setStepIndex(0);
            setRound(r => r + 1);
            return pattern.steps[0].duration;
          }
          setStepIndex(nextIdx);
          return pattern.steps[nextIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, stepIndex, pattern, totalSteps]);

  const selectPattern = (p) => { reset(); setPattern(p); };
  const circleSize = 180;
  const stepProgress = currentStep ? ((currentStep.duration - seconds) / currentStep.duration * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Wind size={18} className="text-blue-500" /> 呼吸引导
          </h3>
        </div>

        {!isRunning && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {PATTERNS.map(p => (
              <button key={p.id} onClick={() => selectPattern(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  pattern.id === p.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                }`}>{p.icon} {p.name}</button>
            ))}
          </div>
        )}

        {/* 呼吸动画圆 */}
        <div className="flex flex-col items-center">
          <div className={`relative w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
            isRunning ? `${currentStep?.color || 'bg-blue-400'} border-current scale-100` : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          }`}
            style={isRunning ? {
              transform: currentStep?.label === '吸气' ? `scale(${1 + stepProgress / 100 * 0.3})` :
                         currentStep?.label === '呼气' ? `scale(${1.3 - stepProgress / 100 * 0.3})` : 'scale(1.3)',
              transition: 'transform 1s linear'
            } : {}}>
            <div className="text-center z-10">
              {isRunning ? (
                <>
                  <div className="text-3xl font-bold text-white drop-shadow">{seconds}</div>
                  <div className="text-sm font-medium text-white/80 mt-1">{currentStep?.label}</div>
                </>
              ) : (
                <div className="text-gray-400 text-sm">{pattern.desc}</div>
              )}
            </div>
          </div>
          {isRunning && (
            <p className="text-xs text-gray-400 mt-3">第 {round} 轮</p>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-3 mt-4">
          {!isRunning ? (
            <button onClick={start} className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 flex items-center gap-2">
              <Play size={16} /> 开始
            </button>
          ) : (
            <button onClick={pause} className="px-6 py-2.5 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600">
              <Pause size={16} /> 暂停
            </button>
          )}
          {(isRunning || stepIndex > 0 || round > 1) && (
            <button onClick={reset} className="px-6 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-300">
              <RotateCcw size={16} /> 重置
            </button>
          )}
        </div>

        {/* 步骤说明 */}
        {!isRunning && (
          <div className="mt-4 space-y-1">
            {pattern.steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                <div className={`w-3 h-3 rounded-full ${s.color}`} />
                <span>{i+1}. {s.label} {s.duration}秒</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
