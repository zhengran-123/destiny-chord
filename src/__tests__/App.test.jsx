import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getToday, formatDateCN, getRecentDays, getWeekStart } from '../utils/date';
import { calcMealNutrition, sumDailyNutrition, calcExerciseVolume, goalPercentage, calcStreak } from '../utils/calculation';
import { allFoods, searchFoods, getFoodsByCategory, foodCategories, getFoodCount } from '../data/foods';

// ==================== 日期工具测试 ====================
describe('日期工具 (date.js)', () => {
  it('getToday 应返回 YYYY-MM-DD 格式', () => {
    const today = getToday();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('formatDateCN 应返回中文格式', () => {
    const result = formatDateCN('2025-01-15');
    expect(result).toContain('1月15日');
    expect(result).toContain('周');
  });

  it('getRecentDays 应返回指定天数', () => {
    const days = getRecentDays(7);
    expect(days).toHaveLength(7);
  });

  it('getWeekStart 应返回周一日期', () => {
    const start = getWeekStart('2025-01-15'); // 周三
    expect(start).toBe('2025-01-13'); // 周一
  });
});

// ==================== 计算工具测试 ====================
describe('计算工具 (calculation.js)', () => {
  it('calcMealNutrition 应正确计算营养成分', () => {
    const food = { calories: 100, protein: 10, carbs: 20, fat: 5 };
    const result = calcMealNutrition(food, 2);
    expect(result.calories).toBe(200);
    expect(result.protein).toBe(20);
    expect(result.carbs).toBe(40);
    expect(result.fat).toBe(10);
  });

  it('sumDailyNutrition 应正确汇总', () => {
    const meals = [
      { calories: 100, protein: 10, carbs: 20, fat: 5 },
      { calories: 200, protein: 20, carbs: 30, fat: 10 },
    ];
    const sum = sumDailyNutrition(meals);
    expect(sum.calories).toBe(300);
    expect(sum.protein).toBe(30);
    expect(sum.carbs).toBe(50);
    expect(sum.fat).toBe(15);
  });

  it('calcExerciseVolume 应正确计算运动量', () => {
    expect(calcExerciseVolume(3, 10)).toBe(30);
    expect(calcExerciseVolume(5, 15)).toBe(75);
  });

  it('goalPercentage 应正确计算百分比', () => {
    expect(goalPercentage(1500, 2000)).toBe(75);
    expect(goalPercentage(2000, 2000)).toBe(100);
    expect(goalPercentage(3000, 2000)).toBe(100); // 不超过 100%
    expect(goalPercentage(0, 0)).toBe(0);
  });

  it('calcStreak 空数组应为 0', () => {
    expect(calcStreak([])).toBe(0);
  });
});

// ==================== 食物数据库测试 ====================
describe('食物数据库 (foods.js)', () => {
  it('应有超过 500 种食物', () => {
    expect(getFoodCount()).toBeGreaterThanOrEqual(500);
  });

  it('应有 11 个分类', () => {
    expect(foodCategories).toHaveLength(11);
  });

  it('searchFoods 应能搜索', () => {
    const results = searchFoods('米饭');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toContain('米饭');
  });

  it('searchFoods 空查询应返回空数组', () => {
    expect(searchFoods('')).toEqual([]);
  });

  it('getFoodsByCategory 应按分类返回', () => {
    const staple = getFoodsByCategory('staple');
    expect(staple.length).toBeGreaterThan(0);
    staple.forEach(f => expect(f.category).toBe('staple'));
  });

  it('每个食物应有完整数据', () => {
    const food = allFoods[0];
    expect(food).toHaveProperty('id');
    expect(food).toHaveProperty('name');
    expect(food).toHaveProperty('calories');
    expect(food).toHaveProperty('protein');
    expect(food).toHaveProperty('carbs');
    expect(food).toHaveProperty('fat');
    expect(food).toHaveProperty('category');
  });
});

// ==================== 存储工具测试 ====================
describe('存储工具 (storage.js)', () => {
  it('DEFAULT_GOALS 应有合理默认值', async () => {
    const { DEFAULT_GOALS } = await import('../utils/storage');
    expect(DEFAULT_GOALS.dailyCalories).toBe(2000);
    expect(DEFAULT_GOALS.dailyProtein).toBe(150);
    expect(DEFAULT_GOALS.workoutDays).toBe(5);
  });
});
