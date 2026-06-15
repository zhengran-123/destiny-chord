/**
 * 日期工具函数
 */

/** 获取今天的日期字符串 YYYY-MM-DD */
export function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 获取指定日期 */
export function getDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** 获取本周起始日期（周一） */
export function getWeekStart(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return getDateStr(monday);
}

/** 获取最近N天的日期数组 */
export function getRecentDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(getDateStr(d));
  }
  return days;
}

/** 获取本月所有日期 */
export function getMonthDays(year, month) {
  const days = [];
  const lastDay = new Date(year, month, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    days.push(`${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
  }
  return days;
}

/** 格式化日期为中文 */
export function formatDateCN(dateStr) {
  const d = new Date(dateStr);
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]}`;
}

/** 判断是否是今天 */
export function isToday(dateStr) {
  return dateStr === getToday();
}

/** 判断是否是昨天 */
export function isYesterday(dateStr) {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateStr === getDateStr(d);
}

/** 获取当前时间 HH:MM */
export function getNowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
