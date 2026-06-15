import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export default function ReminderNotifications({ mealRecords, exerciseRecords, tasks, checkInDays, goals }) {
  const lastReminderTime = useRef(0);

  useEffect(() => {
    const check = () => {
      const now = Date.now();
      // 至少间隔 2 小时提醒一次
      if (now - lastReminderTime.current < 7200000) return;

      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const todayMeals = mealRecords.filter(m => m.date === todayStr);
      const todayEx = exerciseRecords.filter(e => e.date === todayStr);
      const todayTasks = tasks.filter(t => t.date === todayStr);

      const hour = today.getHours();

      // 早上提醒
      if (hour >= 8 && hour <= 10 && todayMeals.length === 0) {
        toast.info('☀️ 早上好！别忘了吃早餐，开始记录今日饮食吧！', { toastId: 'morning-reminder' });
        lastReminderTime.current = now;
        return;
      }

      // 中午提醒
      if (hour >= 11 && hour <= 13 && todayMeals.filter(m => m.category === 'staple').length === 0) {
        toast.info('🕐 午饭时间到！记得记录你的午餐哦~', { toastId: 'lunch-reminder' });
        lastReminderTime.current = now;
        return;
      }

      // 下午运动提醒
      if (hour >= 16 && hour <= 18 && todayEx.length === 0) {
        toast.info('🏃 下午好时光，来一组运动吧！', { toastId: 'exercise-reminder' });
        lastReminderTime.current = now;
        return;
      }

      // 晚上提醒
      if (hour >= 20 && hour <= 22 && !checkInDays.includes(todayStr)) {
        toast.info('🌙 今天还没打卡哦，别忘了记录今天的健康数据！', { toastId: 'checkin-reminder' });
        lastReminderTime.current = now;
        return;
      }
    };

    // 初始检查
    check();

    // 每 30 分钟检查一次
    const timer = setInterval(check, 1800000);
    return () => clearInterval(timer);
  }, [mealRecords, exerciseRecords, tasks, checkInDays, goals]);

  return null; // 不渲染 UI，只负责逻辑
}
