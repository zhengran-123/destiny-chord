import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, UtensilsCrossed, X, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { allFoods, searchFoods, foodCategories, getFoodsByCategory } from '../data/foods';
import { getToday } from '../utils/date';
import FoodDatabaseView from './FoodDatabaseView';

export default function FoodTracker({ mealRecords, customFoods, addMeal, deleteMeal, addCustomFood, date, setDate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showDatabase, setShowDatabase] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const [customForm, setCustomForm] = useState({
    name: '', calories: '', protein: '', carbs: '', fat: '', category: 'staple',
  });

  const todayStr = getToday();

  const filteredFoods = useMemo(() => {
    if (searchQuery.trim()) {
      return searchFoods(searchQuery);
    }
    if (activeCategory === 'all') {
      return allFoods;
    }
    if (activeCategory === 'custom') {
      return customFoods;
    }
    return getFoodsByCategory(activeCategory);
  }, [searchQuery, activeCategory, customFoods]);

  const todayMeals = useMemo(() => {
    return mealRecords.filter(m => m.date === todayStr).sort((a, b) => b.time.localeCompare(a.time));
  }, [mealRecords, todayStr]);

  const handleAddFood = (food) => {
    if (quantity <= 0) {
      toast.warn('请输入有效数量');
      return;
    }
    addMeal(food, quantity, todayStr);
    toast.success(`已添加: ${food.name} ×${quantity}`);
    setSelectedFood(null);
    setQuantity(1);
    setSearchQuery('');
  };

  const handleQuickAdd = (food) => {
    addMeal(food, 1, todayStr);
    toast.success(`已添加: ${food.name}`);
  };

  const handleAddCustomFood = () => {
    if (!customForm.name || !customForm.calories) {
      toast.warn('请填写食物名称和热量');
      return;
    }
    const newFood = addCustomFood({
      ...customForm,
      categoryLabel: foodCategories.find(c => c.key === customForm.category)?.label || '自定义',
    });
    toast.success(`自定义食物已添加: ${newFood.name}`);
    setShowCustomForm(false);
    setCustomForm({ name: '', calories: '', protein: '', carbs: '', fat: '', category: 'staple' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 搜索框 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索食物名称..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowDatabase(true)}
            className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            食物库
          </button>
          <button
            onClick={() => setShowCustomForm(true)}
            className="px-4 py-3 rounded-xl bg-brand-orange text-white hover:bg-brand-orange-light transition-colors text-sm font-medium flex items-center gap-1"
          >
            <Plus size={16} />
            自定义
          </button>
        </div>
      </div>

      {/* 分类筛选 */}
      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all' ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            🌟 全部
          </button>
          {customFoods.length > 0 && (
            <button
              onClick={() => setActiveCategory('custom')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'custom' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              ⭐ 自定义
            </button>
          )}
          {foodCategories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.key ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* 食物列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            {searchQuery ? `搜索结果 (${filteredFoods.length})` : '选择食物'}
          </h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filteredFoods.map(food => (
            <div
              key={food.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50 cursor-pointer group"
              onClick={() => setSelectedFood(food)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{food.categoryIcon || '🍽️'}</span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{food.name}</p>
                  <p className="text-xs text-gray-400">{food.calories}kcal · 蛋白质{food.protein}g · 碳水{food.carbs}g · 脂肪{food.fat}g</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleQuickAdd(food); }}
                  className="px-3 py-1.5 rounded-lg bg-brand-orange text-white text-xs font-medium hover:bg-brand-orange-light transition-colors"
                >
                  快速添加
                </button>
              </div>
            </div>
          ))}
          {filteredFoods.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <UtensilsCrossed size={40} className="mx-auto mb-2 opacity-50" />
              <p>没有找到匹配的食物</p>
            </div>
          )}
        </div>
      </div>

      {/* 数量选择弹窗 */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedFood(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">添加食物</h3>
              <button onClick={() => setSelectedFood(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{selectedFood.name}</p>
            <p className="text-sm text-gray-400 mb-4">每份 {selectedFood.calories}kcal</p>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setQuantity(q => Math.max(0.5, q - 0.5))}
                className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xl font-bold hover:border-brand-orange transition-colors"
              >−</button>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                min="0.5"
                step="0.5"
                className="w-20 text-center text-2xl font-bold border-b-2 border-brand-orange bg-transparent text-gray-800 dark:text-white outline-none"
              />
              <button
                onClick={() => setQuantity(q => q + 0.5)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xl font-bold hover:border-brand-orange transition-colors"
              >+</button>
            </div>

            <div className="text-center text-sm text-gray-500 mb-4">
              预计摄入: <span className="font-bold text-brand-orange">{Math.round(selectedFood.calories * quantity)}</span> kcal
            </div>

            <button
              onClick={() => handleAddFood(selectedFood)}
              className="w-full py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-light transition-colors"
            >
              确认添加
            </button>
          </div>
        </div>
      )}

      {/* 自定义食物弹窗 */}
      {showCustomForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCustomForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                <Star size={18} className="text-yellow-500" />
                添加自定义食物
              </h3>
              <button onClick={() => setShowCustomForm(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="食物名称 *" value={customForm.name} onChange={e => setCustomForm(f => ({ ...f, name: e.target.value }))}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/50" />
              <input type="number" placeholder="热量 (kcal/100g) *" value={customForm.calories} onChange={e => setCustomForm(f => ({ ...f, calories: e.target.value }))}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/50" />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" placeholder="蛋白质(g)" value={customForm.protein} onChange={e => setCustomForm(f => ({ ...f, protein: e.target.value }))}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/50" />
                <input type="number" placeholder="碳水(g)" value={customForm.carbs} onChange={e => setCustomForm(f => ({ ...f, carbs: e.target.value }))}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/50" />
                <input type="number" placeholder="脂肪(g)" value={customForm.fat} onChange={e => setCustomForm(f => ({ ...f, fat: e.target.value }))}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/50" />
              </div>
              <select value={customForm.category} onChange={e => setCustomForm(f => ({ ...f, category: e.target.value }))}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white outline-none">
                {foodCategories.map(c => (
                  <option key={c.key} value={c.key}>{c.icon} {c.label}</option>
                ))}
              </select>
              <button onClick={handleAddCustomFood} className="w-full py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-light transition-colors">
                添加自定义食物
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 今日已记录食物 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">
            📝 今日记录 ({todayMeals.length})
          </h3>
          {todayMeals.length > 0 && (
            <span className="text-sm text-gray-400">
              总计: {todayMeals.reduce((s, m) => s + m.calories, 0)} kcal
            </span>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {todayMeals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>还没有记录饮食</p>
              <p className="text-sm">搜索食物开始记录吧</p>
            </div>
          ) : (
            todayMeals.map(meal => (
              <div key={meal.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{foodCategories.find(c => c.key === meal.category)?.icon || '🍽️'}</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{meal.foodName}</p>
                    <p className="text-xs text-gray-400">×{meal.quantity} · {meal.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-brand-orange text-sm">{meal.calories} kcal</p>
                    <p className="text-xs text-gray-400">P{meal.protein}g C{meal.carbs}g F{meal.fat}g</p>
                  </div>
                  <button
                    onClick={() => { deleteMeal(meal.id); toast.info('已删除'); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 食物数据库全览弹窗 */}
      {showDatabase && (
        <FoodDatabaseView
          onClose={() => setShowDatabase(false)}
          onSelectFood={(food) => { setSelectedFood(food); setShowDatabase(false); }}
          customFoods={customFoods}
        />
      )}
    </div>
  );
}
