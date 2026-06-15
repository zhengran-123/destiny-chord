import { useState } from 'react';
import { Share2, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SocialShare({ todayStats, streak }) {
  const [copied, setCopied] = useState(false);

  const shareText = `🏆 健康追踪报告\n` +
    `📅 连续打卡: ${streak} 天\n` +
    `🍽️ 今日摄入: ${todayStats.totalCalories} kcal\n` +
    `💪 今日运动: ${todayStats.exerciseCount} 项\n` +
    `✓ 任务完成: ${todayStats.taskProgress.completed}/${todayStats.taskProgress.total}\n` +
    `\n#健康生活 #每日打卡`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '我的健康成就',
          text: shareText,
          url: window.location.href,
        });
        toast.success('分享成功！');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      toast.success('已复制到剪贴板！');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white font-medium hover:bg-brand-orange-light transition-colors text-sm"
      >
        {copied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
        {copied ? '已复制' : '分享成就'}
      </button>
      <button
        onClick={handleTwitterShare}
        className="p-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors"
        title="分享到 Twitter/X"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
