import { useState, useEffect, useCallback } from 'react';
import { getGoals, saveGoals, DEFAULT_GOALS } from '../utils/storage';

export function useGoals() {
  const [goals, setGoals] = useState(DEFAULT_GOALS);

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  const updateGoals = useCallback((newGoals) => {
    const merged = { ...goals, ...newGoals };
    setGoals(merged);
    saveGoals(merged);
  }, [goals]);

  const resetGoals = useCallback(() => {
    setGoals(DEFAULT_GOALS);
    saveGoals(DEFAULT_GOALS);
  }, []);

  return {
    goals,
    updateGoals,
    resetGoals,
  };
}
