import { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // 文字渐入
    const t1 = setTimeout(() => setTextVisible(true), 200);
    // 开始淡出
    const t2 = setTimeout(() => setFadeOut(true), 2200);
    // 完全移除
    const t3 = setTimeout(() => onFinish(), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* 音符动画 */}
        <div className={`mb-6 transition-all duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎵</span>
            <span className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎶</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎵</span>
          </div>
        </div>

        {/* 标题 */}
        <h1
          className={`text-5xl font-display font-bold text-white mb-3 transition-all duration-1000 delay-300 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          命运和弦
        </h1>

        {/* 副标题 */}
        <p
          className={`text-lg text-purple-300 transition-all duration-1000 delay-500 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          记录每一刻，奏响健康人生
        </p>
      </div>
    </div>
  );
}
