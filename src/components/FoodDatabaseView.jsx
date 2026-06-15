import React, { useState, useMemo } from 'react';
import { Search, X, Star, Plus } from 'lucide-react';
import { allFoods, searchFoods, foodCategories, getFoodsByCategory, getFoodCount } from '../data/foods';

export default function FoodDatabaseView({ onClose, onSelectFood, customFoods }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const allAvailableFoods = useMemo(() => [...allFoods, ...customFoods], [customFoods]);

  const filtered = useMemo(() => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return allAvailableFoods.filter(f =>
        f.name.toLowerCase().includes(q) || f.categoryLabel.includes(q)
      );
    }
    if (activeCategory === 'all') return allAvailableFoods;
    if (activeCategory === 'custom') return customFoods;
    return getFoodsByCategory(activeCategory);
  }, [search, activeCategory, allAvailableFoods, customFoods]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg text-gray-800 dark:text-white">📚 食物数据库</h2>
            <p className="text-xs text-gray-400">{getFoodCount()}+ 种食物，点击即可选择</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="搜索食物..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-orange/50 outline-none"
            />
          </div>
        </div>

        {/* Categories */}
        {!search && (
          <div className="px-4 flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${activeCategory === 'all' ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              🌟 全部 ({allAvailableFoods.length})
            </button>
            {customFoods.length > 0 && (
              <button onClick={() => setActiveCategory('custom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${activeCategory === 'custom' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                ⭐ 自定义 ({customFoods.length})
              </button>
            )}
            {foodCategories.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${activeCategory === cat.key ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Food Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map(food => (
            <button
              key={food.id}
              onClick={() => onSelectFood(food)}
              className="text-left p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand-orange dark:hover:border-brand-orange hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{food.categoryIcon || '🍽️'}</span>
                <span className="font-medium text-sm text-gray-800 dark:text-white truncate">{food.name}</span>
                {food.id > 1000 && <Star size={12} className="text-yellow-500" />}
              </div>
              <div className="text-xs text-gray-400">
                {food.calories}kcal · P{food.protein} · C{food.carbs} · F{food.fat}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400">
              <p>没有找到匹配的食物</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-400">
            共 {filtered.length} 种食物 · 点击食物名即可快速选择
          </p>
        </div>
      </div>
    </div>
  );
}
