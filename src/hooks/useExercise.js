import { useState, useEffect, useCallback } from 'react';
import { getExerciseRecords, saveExerciseRecords } from '../utils/storage';
import { calcExerciseVolume } from '../utils/calculation';
import { getToday, getNowTime } from '../utils/date';

export function useExercise() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    setRecords(getExerciseRecords());
  }, []);

  const save = useCallback((newRecords) => {
    setRecords(newRecords);
    saveExerciseRecords(newRecords);
  }, []);

  const addExercise = useCallback((name, sets, reps, date = null) => {
    const record = {
      id: Date.now(),
      name,
      sets: Number(sets),
      reps: Number(reps),
      totalVolume: calcExerciseVolume(sets, reps),
      date: date || getToday(),
      time: getNowTime(),
    };
    const newRecords = [...records, record];
    save(newRecords);
    return record;
  }, [records, save]);

  const deleteExercise = useCallback((id) => {
    const filtered = records.filter(r => r.id !== id);
    save(filtered);
  }, [records, save]);

  const getRecordsByDate = useCallback((date) => {
    return records.filter(r => r.date === date);
  }, [records]);

  return {
    records,
    addExercise,
    deleteExercise,
    getRecordsByDate,
    setRecords: save,
  };
}
