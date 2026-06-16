import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Volume2, VolumeX } from 'lucide-react';

const PRESETS = [
  { id: 'tabata', name: 'Tabata', icon: '🔥', work: 20, rest: 10, rounds: 8, desc: '20秒训练+10秒休息×8轮' },
  { id: 'hiit', name: 'HIIT', icon: '⚡', work: 30, rest: 15, rounds: 6, desc: '30秒高强度+15秒休息×6轮' },
  { id: 'emom', name: 'EMOM', icon: '⏱️', work: 60, rest: 0, rounds: 10, desc: '每分钟完成一组×10分钟' },
  { id: 'rest', name: '组间休息', icon: '💪', work: 0, rest: 60, rounds: 5, desc: '60秒组间休息计时' },
  { id: 'plank', name: '平板支撑', icon: '🧘', work: 0, rest: 0, rounds: 1, desc: '自定义倒计时' },
];

const BEEP_SOUNDS = {
  start: [800, 0.15],
  countdown: [600, 0.1],
  finish: [1000, 0.3],
};

export default function WorkoutTimer() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [totalRounds, setTotalRounds] = useState(8);
  const [customMode, setCustomMode] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [round, setRound] = useState(1);
  const [soundOn, setSoundOn] = useState(true);
  const [finished, setFinished] = useState(false);

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  const playBeep = useCallback((freq, duration) => {
    if (!soundOn) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch(e) {}
  }, [soundOn]);

  const startTimer = useCallback(() => {
    const work = customMode ? workTime : preset.work;
    const total = work > 0 ? work : (restTime || 60);
    setIsRunning(true);
    setFinished(false);
    setIsRest(false);
    setSeconds(total);
    setRound(1);
    playBeep(...BEEP_SOUNDS.start);
  }, [preset, workTime, restTime, customMode, playBeep]);

  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setIsRest(false);
    setSeconds(0);
    setRound(1);
    setFinished(false);
  };

  const selectPreset = (p) => {
    setPreset(p);
    setCustomMode(false);
    setWorkTime(p.work);
    setRestTime(p.rest);
    setTotalRounds(p.rounds);
    resetTimer();
  };

  // 主计时循环
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          // 时间到，切换训练/休息
          const work = customMode ? workTime : preset.work;
          const rest = customMode ? restTime : preset.rest;
          const rounds = customMode ? totalRounds : preset.rounds;

          if (isRest) {
            // 休息结束，检查是否还有下一轮
            if (round >= rounds) {
              setIsRunning(false);
              setFinished(true);
              playBeep(...BEEP_SOUNDS.finish);
              return 0;
            }
            // 新一轮训练
            setIsRest(false);
            setRound(r => r + 1);
            playBeep(...BEEP_SOUNDS.start);
            return work > 0 ? work : 60;
          } else {
            // 训练结束，进入休息或结束
            if (rest > 0 && round < rounds) {
              setIsRest(true);
              playBeep(...BEEP_SOUNDS.countdown);
              return rest;
            } else if (round >= rounds) {
              setIsRunning(false);
              setFinished(true);
              playBeep(...BEEP_SOUNDS.finish);
              return 0;
            } else {
              setRound(r => r + 1);
              playBeep(...BEEP_SOUNDS.start);
              return work;
            }
          }
        }
        // 倒计时提示
        if (prev <= 4 && prev > 1) playBeep(...BEEP_SOUNDS.countdown);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isRest, round, preset, workTime, restTime, totalRounds, customMode, playBeep]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const totalWork = customMode ? workTime : preset.work;
  const effectiveTime = totalWork > 0 ? totalWork : restTime;
  const progress = effectiveTime > 0 ? ((effectiveTime - seconds) / effectiveTime * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Timer size={18} className="text-brand-orange" /> 健身计时器
          </h3>
          <button onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            {soundOn ? <Volume2 size={16} className="text-gray-500"/> : <VolumeX size={16} className="text-gray-400"/>}
          </button>
        </div>

        {/* 预设选择 */}
        {!isRunning && (
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESETS.map(p => (
              <button key={p.id} onClick={() => selectPreset(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  preset.id === p.id && !customMode
                    ? 'bg-brand-orange text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}>{p.icon} {p.name}</button>
            ))}
            <button onClick={() => setCustomMode(!customMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                customMode ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
              }`}>⚙️ 自定义</button>
          </div>
        )}

        {/* 自定义参数 */}
        {customMode && !isRunning && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <label className="text-xs text-gray-400">训练(秒)</label>
              <input type="number" value={workTime} onChange={e => setWorkTime(Number(e.target.value))}
                className="w-full p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center text-sm outline-none" />
            </div>
            <div className="text-center">
              <label className="text-xs text-gray-400">休息(秒)</label>
              <input type="number" value={restTime} onChange={e => setRestTime(Number(e.target.value))}
                className="w-full p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center text-sm outline-none" />
            </div>
            <div className="text-center">
              <label className="text-xs text-gray-400">轮数</label>
              <input type="number" value={totalRounds} onChange={e => setTotalRounds(Number(e.target.value))}
                className="w-full p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center text-sm outline-none" />
            </div>
          </div>
        )}

        {/* 计时器主体 */}
        <div className={`relative w-48 h-48 mx-auto rounded-full flex items-center justify-center border-8 ${
          finished ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
          isRest ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' :
          'border-brand-orange bg-orange-50 dark:bg-orange-900/20'
        }`}>
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4"
              className="text-gray-200 dark:text-gray-700" />
            <circle cx="50" cy="50" r="44" fill="none" strokeWidth="4" strokeLinecap="round"
              className={finished ? 'stroke-green-500' : isRest ? 'stroke-blue-400' : 'stroke-brand-orange'}
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div className="text-center z-10">
            <div className={`text-4xl font-bold font-mono ${
              finished ? 'text-green-500' : isRest ? 'text-blue-500' : 'text-brand-orange'
            }`}>{finished ? '完成!' : formatTime(seconds)}</div>
            <div className={`text-xs font-medium mt-1 ${
              isRest ? 'text-blue-400' : 'text-gray-400'
            }`}>{isRest ? `休息 ${round}/${customMode ? totalRounds : preset.rounds}` : `第${round}轮`}</div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-3 mt-4">
          {!isRunning && !finished && (
            <button onClick={startTimer}
              className="px-6 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-light transition-colors flex items-center gap-2">
              <Play size={18} /> 开始训练
            </button>
          )}
          {isRunning && (
            <button onClick={pauseTimer}
              className="px-6 py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors flex items-center gap-2">
              <Pause size={18} /> 暂停
            </button>
          )}
          {(isRunning || finished) && (
            <button onClick={startTimer}
              className="px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
              <RotateCcw size={18} /> 重新开始
            </button>
          )}
        </div>

        {/* 计时器说明 */}
        {!isRunning && !finished && (
          <p className="text-xs text-gray-400 text-center mt-3">
            {customMode ? `自定义: ${workTime}s训练 ${restTime}s休息 ×${totalRounds}轮` : (preset.desc || '')}
          </p>
        )}
        {finished && (
          <div className="text-center mt-3">
            <p className="text-green-500 font-semibold">🎉 训练完成！做得好！</p>
            <p className="text-xs text-gray-400 mt-1">完成了 {round} 轮训练</p>
          </div>
        )}
      </div>
    </div>
  );
}
