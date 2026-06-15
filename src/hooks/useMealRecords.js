import { useState, useEffect, useCallback } from 'react';
import { getMealRecords, saveMealRecords, getCustomFoods, saveCustomFoods } from '../utils/storage';
import { calcMealNutrition } from '../utils/calculation';
import { getToday, getNowTime } from '../utils/date';

export function useMealRecords() {
  const [records, setRecords] = useState([]);
  const [customFoods, setCustomFoods] = useState([]);

  useEffect(() => {
    setRecords(getMealRecords());
    setCustomFoods(getCustomFoods());
  }, []);

  const save = useCallback((newRecords) => {
    setRecords(newRecords);
    saveMealRecords(newRecords);
  }, []);

  const addMeal = useCallback((food, quantity, date = null) => {
    const nutrition = calcMealNutrition(food, quantity);
    const record = {
      id: Date.now(),
      foodId: food.id,
      foodName: food.name,
      quantity,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      category: food.category,
      categoryLabel: food.categoryLabel,
      date: date || getToday(),
      time: getNowTime(),
    };
    const newRecords = [...records, record];
    save(newRecords);
    return record;
  }, [records, save]);

  const deleteMeal = useCallback((id) => {
    const filtered = records.filter(r => r.id !== id);
    save(filtered);
  }, [records, save]);

  const addCustomFood = useCallback((food) => {
    const newFood = {
      id: Date.now(),
      name: food.name,
      calories: Number(food.calories),
      protein: Number(food.protein),
      carbs: Number(food.carbs),
      fat: Number(food.fat),
      category: food.category,
      categoryLabel: food.categoryLabel || '自定义',
      categoryIcon: '⭐',
    };
    const updated = [...customFoods, newFood];
    setCustomFoods(updated);
    saveCustomFoods(updated);
    return newFood;
  }, [customFoods]);

  const deleteCustomFood = useCallback((id) => {
    const updated = customFoods.filter(f => f.id !== id);
    setCustomFoods(updated);
    saveCustomFoods(updated);
  }, [customFoods]);

  const getRecordsByDate = useCallback((date) => {
    return records.filter(r => r.date === date);
  }, [records]);

  const getAllCustomFoods = useCallback(() => customFoods, [customFoods]);

  return {
    records,
    customFoods,
    addMeal,
    deleteMeal,
    addCustomFood,
    deleteCustomFood,
    getRecordsByDate,
    getAllCustomFoods,
    setRecords: save,
  };
}
