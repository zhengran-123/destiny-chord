import { useState, useEffect, useCallback } from 'react';
import { getCheckIns, saveCheckIns } from '../utils/storage';
import { getToday, getDateStr } from '../utils/date';
import { calcStreak } from '../utils/calculation';

export function useCheckIn() {
  const [checkInDays, setCheckInDays] = useState([]);

  useEffect(() => {
    setCheckInDays(getCheckIns());
  }, []);

  const save = useCallback((days) => {
    setCheckInDays(days);
    saveCheckIns(days);
  }, []);

  const checkIn = useCallback(() => {
    const today = getToday();
    if (checkInDays.includes(today)) return false; // 已打卡
    const updated = [...checkInDays, today];
    save(updated);
    return true;
  }, [checkInDays, save]);

  const isCheckedInToday = useCallback(() => {
    return checkInDays.includes(getToday());
  }, [checkInDays]);

  const getStreak = useCallback(() => {
    return calcStreak(checkInDays);
  }, [checkInDays]);

  const getCheckInCount = useCallback(() => checkInDays.length, [checkInDays]);

  return {
    checkInDays,
    checkIn,
    isCheckedInToday,
    getStreak,
    getCheckInCount,
    setCheckInDays: save,
  };
}
