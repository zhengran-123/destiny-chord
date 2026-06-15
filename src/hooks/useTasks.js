import { useState, useEffect, useCallback } from 'react';
import { getTasks, saveTasks } from '../utils/storage';
import { getToday } from '../utils/date';

export function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const save = useCallback((newTasks) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  }, []);

  const addTask = useCallback((title, date = null) => {
    const task = {
      id: Date.now(),
      title,
      completed: false,
      date: date || getToday(),
      createdAt: new Date().toISOString(),
    };
    const newTasks = [...tasks, task];
    save(newTasks);
    return task;
  }, [tasks, save]);

  const toggleTask = useCallback((id) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    save(updated);
  }, [tasks, save]);

  const deleteTask = useCallback((id) => {
    const filtered = tasks.filter(t => t.id !== id);
    save(filtered);
  }, [tasks, save]);

  const getTasksByDate = useCallback((date) => {
    return tasks.filter(t => t.date === date);
  }, [tasks]);

  const getTodayProgress = useCallback(() => {
    const todayTasks = tasks.filter(t => t.date === getToday());
    if (todayTasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = todayTasks.filter(t => t.completed).length;
    return {
      completed,
      total: todayTasks.length,
      percentage: Math.round((completed / todayTasks.length) * 100),
    };
  }, [tasks]);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    getTasksByDate,
    getTodayProgress,
    setTasks: save,
  };
}
