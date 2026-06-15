import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle({ darkMode, toggle }) {
  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 group"
      aria-label={darkMode ? '切换到浅色模式' : '切换到深色模式'}
    >
      {darkMode ? (
        <Sun size={24} className="text-yellow-500 group-hover:rotate-90 transition-transform duration-500" />
      ) : (
        <Moon size={24} className="text-gray-600 group-hover:rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}
