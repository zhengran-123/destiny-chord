import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

export default function WorkoutCalendar({ exerciseRecords, mealRecords }) {
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;

  const activeDays = useMemo(() => {
    const days = new Set();
    exerciseRecords.forEach(r => days.add(r.date));
    mealRecords.forEach(r => days.add(r.date));
    return days;
  }, [exerciseRecords, mealRecords]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const prevMonth = () => setViewDate(new Date(year, month - 2, 1));
  const nextMonth = () => setViewDate(new Date(year, month, 1));

  const weeks = [];
  let week = [];
  // 填充前面空白
  for (let i = 0; i < firstDayOfWeek; i++) week.push(null);
  // 填充日期
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    week.push({
      day: d, date: ds, active: activeDays.has(ds), isToday: ds === todayStr,
      exCount: exerciseRecords.filter(r => r.date === ds).length,
      calCount: mealRecords.filter(r => r.date === ds).reduce((s, r) => s + r.calories, 0),
    });
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const weekDayLabels = ['日','一','二','三','四','五','六'];

  const monthActiveDays = Array.from(activeDays).filter(d => d.startsWith(`${year}-${String(month).padStart(2,'0')}`)).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft size={18}/></button>
        <div className="text-center">
          <h3 className="font-semibold text-gray-800 dark:text-white">{year}年{month}月</h3>
          <p className="text-xs text-gray-400">{monthActiveDays}天有记录</p>
        </div>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight size={18}/></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDayLabels.map(l => <div key={l} className="text-xs font-medium text-gray-400 py-1">{l}</div>)}
        {weeks.flat().map((cell, i) => (
          <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
            !cell ? '' :
            cell.isToday ? 'bg-brand-orange text-white font-bold' :
            cell.active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
            'text-gray-400'
          }`}>
            {cell && (
              <>
                <span>{cell.day}</span>
                {cell.active && <Flame size={8}/>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
