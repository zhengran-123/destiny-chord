import { useState, useEffect, useCallback } from 'react';
import { getToday } from '../utils/date';

const STORAGE_KEY = 'health_water_intake';

function getWaterData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveWaterData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export function useWaterTracker() {
  const [waterData, setWaterData] = useState({});

  useEffect(() => { setWaterData(getWaterData()); }, []);

  const today = getToday();
  const todayCups = waterData[today] || 0;

  const addWater = useCallback((cups = 1) => {
    const updated = { ...waterData, [today]: (waterData[today] || 0) + cups };
    setWaterData(updated);
    saveWaterData(updated);
  }, [waterData, today]);

  const removeWater = useCallback(() => {
    const current = waterData[today] || 0;
    if (current <= 0) return;
    const updated = { ...waterData, [today]: Math.max(0, current - 1) };
    setWaterData(updated);
    saveWaterData(updated);
  }, [waterData, today]);

  const getTodayCups = useCallback(() => todayCups, [todayCups]);
  const getTotalWater = useCallback(() => todayCups * 250, [todayCups]); // 每杯250ml

  return { waterData, todayCups, addWater, removeWater, getTodayCups, getTotalWater };
}
