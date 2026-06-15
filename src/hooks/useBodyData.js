import { useState, useEffect, useCallback } from 'react';
import { getToday } from '../utils/date';

const STORAGE_KEY = 'health_body_data';

function getBodyData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveBodyData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export function useBodyData() {
  const [records, setRecords] = useState([]);

  useEffect(() => { setRecords(getBodyData()); }, []);

  const addRecord = useCallback((data) => {
    const record = {
      id: Date.now(),
      date: data.date || getToday(),
      weight: parseFloat(data.weight) || 0,
      waist: parseFloat(data.waist) || 0,
      chest: parseFloat(data.chest) || 0,
      hip: parseFloat(data.hip) || 0,
      thigh: parseFloat(data.thigh) || 0,
      arm: parseFloat(data.arm) || 0,
      notes: data.notes || '',
    };
    const updated = [...records, record];
    setRecords(updated);
    saveBodyData(updated);
    return record;
  }, [records]);

  const deleteRecord = useCallback((id) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    saveBodyData(updated);
  }, [records]);

  const getLatest = useCallback(() => records.slice(-1)[0] || null, [records]);
  const getAll = useCallback(() => records.sort((a, b) => a.date.localeCompare(b.date)), [records]);

  return { records, addRecord, deleteRecord, getLatest, getAll, setRecords };
}
