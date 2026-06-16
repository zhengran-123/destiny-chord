import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Timer, Volume2, VolumeX } from 'lucide-react';

const PRESETS = [
  { id: 'tabata', name: 'Tabata', icon: '🔥', work: 20, rest: 10, rounds: 8, desc: '20秒训练+10秒休息×8轮' },
  { id: 'hiit', name: 'HIIT', icon: '⚡', work: 30, rest: 15, rounds: 6, desc: '30秒高强度+15秒休息×6轮' },
  { id: 'emom', name: 'EMOM', icon: '⏱️', work: 60, rest: 0, rounds: 10, desc: '每分钟完成一组×10分钟' },
  { id: 'rest', name: '组间休息', icon: '💪', work: 0, rest: 60, rounds: 5, desc: '60秒组间休息倒计时' },
  { id: 'plank', name: '自定义', icon: '🧘', work: 60, rest: 0, rounds: 1, desc: '自定义倒计时' },
];

export default function WorkoutTimer() {
  const [presetId, setPresetId] = useState('tabata');
  const [customMode, setCustomMode] = useState(false);
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [totalRounds, setTotalRounds] = useState(8);

  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [round, setRound] = useState(1);
  const [soundOn, setSoundOn] = useState(true);
  const [finished, setFinished] = useState(false);

  const intervalRef = useRef(null);

  // 当前预设
  const preset = useMemo(() => PRESETS.find(p => p.id === presetId) || PRESETS[0], [presetId]);

  // 有效参数
  const work = customMode ? workTime : preset.work;
  const rest = customMode ? restTime : preset.rest;
  const rounds = customMode ? totalRounds : preset.rounds;

  // 音效
  const playBeep = useCallback((freq, dur) => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + dur);
      osc.onended = () => ctx.close();
    } catch(e) {}
  }, [soundOn]);

  const selectPreset = (id) => {
    setPresetId(id);
    setCustomMode(false);
    const p = PRESETS.find(pr => pr.id === id);
    if (p) { setWorkTime(p.work); setRestTime(p.rest); setTotalRounds(p.rounds); }
    setIsRunning(false); setIsRest(false); setSeconds(0); setRound(1); setFinished(false);
  };

  const startTimer = useCallback(() => {
    setIsRunning(true); setFinished(false); setIsRest(false);
    setSeconds(work > 0 ? work : (rest || 60));
    setRound(1);
    playBeep(800, 0.15);
  }, [work, rest, playBeep]);

  const resetTimer = () => {
    setIsRunning(false); setIsRest(false); setSeconds(0); setRound(1); setFinished(false);
  };

  // 主循环
  useEffect(() => {
    if (!isRunning) return;
    let tickCount = 0;

    intervalRef.current = setInterval(() => {
      tickCount++;
      setSeconds(prev => {
        const newVal = prev - 1;
        if (newVal <= 0) {
          if (isRest) {
            if (round >= rounds) { setIsRunning(false); setFinished(true); playBeep(1000, 0.3); return 0; }
            setIsRest(false); setRound(r => r + 1); playBeep(800, 0.15); return work > 0 ? work : 60;
          } else {
            if (rest > 0 && round < rounds) { setIsRest(true); playBeep(600, 0.1); return rest; }
            else if (round >= rounds) { setIsRunning(false); setFinished(true); playBeep(1000, 0.3); return 0; }
            else { setRound(r => r + 1); playBeep(800, 0.15); return work; }
          }
        }
        if (newVal <= 4 && newVal >= 1) playBeep(600, 0.1);
        return newVal;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]); // 只依赖 isRunning

  // 同步 round 和 isRest 到 effect 中通过 ref 处理
  const roundRef = useRef(round);
  roundRef.current = round;
  const isRestRef = useRef(isRest);
  isRestRef.current = isRest;
  const finishedRef = useRef(finished);
  finishedRef.current = finished;

  // 重新同步
  useEffect(() => {
    if (!isRunning) return;
    // 当 round/isRest 改变时，interval 需要读取最新值
    // 通过 ref 解决
    const id = setInterval(() => {
      setSeconds(prev => {
        const newVal = prev - 1;
        if (newVal <= 0) {
          if (isRestRef.current) {
            if (roundRef.current >= rounds) { setIsRunning(false); setFinished(true); return 0; }
            setIsRest(false); setRound(r => r + 1); return work > 0 ? work : 60;
          } else {
            if (rest > 0 && roundRef.current < rounds) { setIsRest(true); return rest; }
            else if (roundRef.current >= rounds) { setIsRunning(false); setFinished(true); return 0; }
            else { setRound(r => r + 1); return work; }
          }
        }
        return newVal;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, work, rest, rounds]);

  const effectiveTime = work > 0 ? work : (rest || 60);
  const progress = effectiveTime > 0 ? ((effectiveTime - seconds) / effectiveTime * 100) : 0;
  const fmt = (s) => `${String(Math.floor(Math.max(0, s) / 60)).padStart(2, '0')}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Timer size={18} className="text-brand-orange" /> 健身计时器
          </h3>
          <button onClick={() => setSoundOn(!soundOn)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            {soundOn ? <Volume2 size={16} className="text-gray-500"/> : <VolumeX size={16} className="text-gray-400"/>}
          </button>
        </div>

        {!isRunning && !finished && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESETS.map(p => (
                <button key={p.id} onClick={() => selectPreset(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    presetId === p.id && !customMode ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>{p.icon} {p.name}</button>
              ))}
              <button onClick={() => setCustomMode(!customMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${customMode ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>⚙️ 自定义</button>
            </div>
            {customMode && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Field label="训练(秒)" val={workTime} set={setWorkTime} />
                <Field label="休息(秒)" val={restTime} set={setRestTime} />
                <Field label="轮数" val={totalRounds} set={setTotalRounds} />
              </div>
            )}
          </>
        )}

        <div className={`relative w-48 h-48 mx-auto rounded-full flex items-center justify-center border-8 ${
          finished ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : isRest ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-brand-orange bg-orange-50 dark:bg-orange-900/20'
        }`}>
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-200 dark:text-gray-700" />
            <circle cx="50" cy="50" r="44" fill="none" strokeWidth="4" strokeLinecap="round"
              className={finished ? 'stroke-green-500' : isRest ? 'stroke-blue-400' : 'stroke-brand-orange'}
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div className="text-center z-10">
            <div className={`text-4xl font-bold font-mono ${finished ? 'text-green-500' : isRest ? 'text-blue-500' : 'text-brand-orange'}`}>
              {finished ? '完成!' : fmt(seconds)}
            </div>
            <div className="text-xs font-medium mt-1">{isRest ? `休息 ${round}/${rounds}` : `第${round}轮`}</div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          {!isRunning && !finished && (
            <button onClick={startTimer} className="px-6 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-light transition-colors flex items-center gap-2">
              <Play size={18}/> 开始训练
            </button>
          )}
          {isRunning && (
            <button onClick={() => setIsRunning(false)} className="px-6 py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors">
              <Pause size={18}/> 暂停
            </button>
          )}
          {(isRunning || finished) && (
            <button onClick={startTimer} className="px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
              <RotateCcw size={18}/> 重来
            </button>
          )}
        </div>

        {!isRunning && !finished && (
          <p className="text-xs text-gray-400 text-center mt-3">
            {customMode ? `自定义: ${workTime}s训练 ${restTime}s休息 ×${totalRounds}轮` : preset.desc}
          </p>
        )}
        {finished && (
          <div className="text-center mt-3">
            <p className="text-green-500 font-semibold">🎉 训练完成！</p>
            <p className="text-xs text-gray-400 mt-1">完成 {round} 轮训练</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, val, set }) {
  return (
    <div className="text-center">
      <label className="text-xs text-gray-400">{label}</label>
      <input type="number" value={val} onChange={e => set(Math.max(1, Number(e.target.value) || 1))}
        className="w-full p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center text-sm outline-none" />
    </div>
  );
}
