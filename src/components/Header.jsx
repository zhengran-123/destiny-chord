import React from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

const tabs = [
  { key: 'dashboard', label: '仪表板', icon: '📊' },
  { key: 'food', label: '饮食', icon: '🍽️' },
  { key: 'exercise', label: '运动', icon: '💪' },
  { key: 'tasks', label: '任务', icon: '✓' },
  { key: 'analytics', label: '分析', icon: '📈' },
  { key: 'settings', label: '设置', icon: '⚙️' },
];

export default function Header({ activeTab, setActiveTab, darkMode, toggleDark }) {
  const [mobileMenu, setMobileMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎵</span>
          <h1 className="text-xl font-display font-bold text-gray-800 dark:text-white hidden sm:block">
            命运和弦
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-brand-orange shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="切换深色模式"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-2">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setMobileMenu(false);
                }}
                className={`p-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  activeTab === tab.key
                    ? 'bg-brand-orange/10 text-brand-orange'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
