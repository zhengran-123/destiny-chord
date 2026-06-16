import React, { useState, useMemo, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FoodTracker from './components/FoodTracker';
import ExerciseTracker from './components/ExerciseTracker';
import TaskManager from './components/TaskManager';
import Analytics from './components/Analytics';
import GoalSettings from './components/GoalSettings';
import WeeklyReport from './components/WeeklyReport';
import DataExportImport from './components/DataExportImport';
import AIAdvice from './components/AIAdvice';
import InteractiveChart from './components/InteractiveChart';
import FamilyTracking from './components/FamilyTracking';
import TrainingPlans from './components/TrainingPlans';
import BodyMeasurements from './components/BodyMeasurements';
import WorkoutCalendar from './components/WorkoutCalendar';
import AchievementBadges from './components/AchievementBadges';
import WaterTracker from './components/WaterTracker';
import WorkoutTimer from './components/WorkoutTimer';
import SleepTracker from './components/SleepTracker';
import WarmUpGuide from './components/WarmUpGuide';
import DarkModeToggle from './components/DarkModeToggle';
import ReminderNotifications from './components/ReminderNotifications';

import { useMealRecords } from './hooks/useMealRecords';
import { useExercise } from './hooks/useExercise';
import { useTasks } from './hooks/useTasks';
import { useCheckIn } from './hooks/useCheckIn';
import { useGoals } from './hooks/useGoals';
import { useDarkMode } from './hooks/useDarkMode';
import { useFirebase } from './hooks/useFirebase';
import { useBodyData } from './hooks/useBodyData';
import { useWaterTracker } from './hooks/useWaterTracker';

import { getToday } from './utils/date';
import { sumDailyNutrition, sumDailyExercise } from './utils/calculation';

import './fonts';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [date, setDate] = useState(getToday());

  // 自定义 hooks
  const mealHook = useMealRecords();
  const exerciseHook = useExercise();
  const taskHook = useTasks();
  const checkInHook = useCheckIn();
  const goalHook = useGoals();
  const { darkMode, toggle: toggleDark } = useDarkMode();
  const firebase = useFirebase();
  const bodyHook = useBodyData();
  const waterHook = useWaterTracker();

  const todayStr = getToday();
  const streak = checkInHook.getStreak();
  const isCheckedIn = checkInHook.isCheckedInToday();

  // 今日统计数据
  const todayStats = useMemo(() => {
    const todayMeals = mealHook.records.filter(m => m.date === todayStr);
    const todayEx = exerciseHook.records.filter(e => e.date === todayStr);
    const todayTasks = taskHook.tasks.filter(t => t.date === todayStr);
    const nutrition = sumDailyNutrition(todayMeals);
    const completedTasks = todayTasks.filter(t => t.completed).length;

    return {
      totalCalories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      exerciseCount: todayEx.length,
      exerciseVolume: sumDailyExercise(todayEx),
      taskProgress: {
        completed: completedTasks,
        total: todayTasks.length,
        percentage: todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0,
      },
    };
  }, [mealHook.records, exerciseHook.records, taskHook.tasks, todayStr]);

  const handleCheckIn = useCallback(() => {
    checkInHook.checkIn();
  }, [checkInHook]);

  const renderTab = () => {
    const commonProps = { date, setDate };

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Dashboard
              mealRecords={mealHook.records}
              exerciseRecords={exerciseHook.records}
              tasks={taskHook.tasks}
              checkInDays={checkInHook.checkInDays}
              streak={streak}
              goals={goalHook.goals}
              date={date} setDate={setDate}
              onCheckIn={handleCheckIn}
              isCheckedInToday={isCheckedIn}
            />
            <WaterTracker todayCups={waterHook.todayCups} addWater={waterHook.addWater} removeWater={waterHook.removeWater} />
            <WorkoutCalendar exerciseRecords={exerciseHook.records} mealRecords={mealHook.records} />
          </div>
        );

      case 'food':
        return (
          <FoodTracker
            mealRecords={mealHook.records}
            customFoods={mealHook.customFoods}
            addMeal={mealHook.addMeal}
            deleteMeal={mealHook.deleteMeal}
            addCustomFood={mealHook.addCustomFood}
            date={date} setDate={setDate}
          />
        );

      case 'exercise':
        return (
          <div className="space-y-6">
            <ExerciseTracker
              records={exerciseHook.records}
              addExercise={exerciseHook.addExercise}
              deleteExercise={exerciseHook.deleteExercise}
              date={date} setDate={setDate}
            />
            <WorkoutTimer />
            <WarmUpGuide />
          </div>
        );

      case 'training':
        return (
          <TrainingPlans />
        );

      case 'body':
        return (
          <div className="space-y-6">
            <BodyMeasurements
              records={bodyHook.records}
              addRecord={bodyHook.addRecord}
              deleteRecord={bodyHook.deleteRecord}
            />
            <AchievementBadges
              checkInDays={checkInHook.checkInDays}
              exerciseRecords={exerciseHook.records}
              mealRecords={mealHook.records}
              tasks={taskHook.tasks}
              goals={goalHook.goals}
            />
            <SleepTracker />
          </div>
        );

      case 'tasks':
        return (
          <TaskManager
            tasks={taskHook.tasks}
            addTask={taskHook.addTask}
            toggleTask={taskHook.toggleTask}
            deleteTask={taskHook.deleteTask}
            date={date} setDate={setDate}
          />
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <Analytics
              mealRecords={mealHook.records}
              exerciseRecords={exerciseHook.records}
              tasks={taskHook.tasks}
              goals={goalHook.goals}
            />
            <InteractiveChart
              mealRecords={mealHook.records}
              exerciseRecords={exerciseHook.records}
            />
            <WeeklyReport
              mealRecords={mealHook.records}
              exerciseRecords={exerciseHook.records}
              tasks={taskHook.tasks}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <GoalSettings
              goals={goalHook.goals}
              updateGoals={goalHook.updateGoals}
              resetGoals={goalHook.resetGoals}
            />
            <DataExportImport
              mealRecords={mealHook.records}
              exerciseRecords={exerciseHook.records}
              tasks={taskHook.tasks}
              checkInDays={checkInHook.checkInDays}
              goals={goalHook.goals}
              customFoods={mealHook.customFoods}
              darkMode={darkMode}
              setMealRecords={mealHook.setRecords}
              setExerciseRecords={exerciseHook.setRecords}
              setTasks={taskHook.setTasks}
              setCheckInDays={checkInHook.setCheckInDays}
              updateGoals={goalHook.updateGoals}
            />
            <AIAdvice
              mealRecords={mealHook.records}
              exerciseRecords={exerciseHook.records}
              tasks={taskHook.tasks}
              goals={goalHook.goals}
            />
            <FamilyTracking
              mealRecords={mealHook.records}
              exerciseRecords={exerciseHook.records}
            />

            {/* Firebase 云同步面板 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">☁️ 云同步</h3>
              {firebase.user ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-500">✅ 已登录: {firebase.user.displayName || firebase.user.email}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => firebase.syncToCloud({
                        meals: mealHook.records,
                        exercises: exerciseHook.records,
                        tasks: taskHook.tasks,
                        checkIns: checkInHook.checkInDays,
                        goals: goalHook.goals,
                      })}
                      disabled={firebase.syncing}
                      className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors disabled:opacity-60"
                    >
                      {firebase.syncing ? '同步中...' : '上传到云端'}
                    </button>
                    <button
                      onClick={async () => {
                        const data = await firebase.loadFromCloud();
                        if (data) {
                          if (data.meals) mealHook.setRecords(data.meals);
                          if (data.exercises) exerciseHook.setRecords(data.exercises);
                          if (data.tasks) taskHook.setTasks(data.tasks);
                          if (data.checkIns) checkInHook.setCheckInDays(data.checkIns);
                          if (data.goals) goalHook.updateGoals(data.goals);
                        }
                      }}
                      disabled={firebase.syncing}
                      className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm hover:bg-green-600 transition-colors disabled:opacity-60"
                    >
                      从云端下载
                    </button>
                  </div>
                  {firebase.lastSync && (
                    <p className="text-xs text-gray-400">上次同步: {firebase.lastSync.toLocaleString('zh-CN')}</p>
                  )}
                  {firebase.error && <p className="text-xs text-red-500">{firebase.error}</p>}
                  <button onClick={firebase.signOut} className="text-sm text-gray-400 hover:text-red-500">退出登录</button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-400 mb-3">登录以同步数据到云端（需先在 firebase/config.js 中配置 Firebase）</p>
                  <button
                    onClick={firebase.signIn}
                    disabled={firebase.loading}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors disabled:opacity-60"
                  >
                    {firebase.loading ? '登录中...' : 'Google 登录'}
                  </button>
                  {firebase.error && <p className="text-xs text-red-500 mt-2">{firebase.error}</p>}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 显示启动画面
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* 通知提醒 */}
      <ReminderNotifications
        mealRecords={mealHook.records}
        exerciseRecords={exerciseHook.records}
        tasks={taskHook.tasks}
        checkInDays={checkInHook.checkInDays}
        goals={goalHook.goals}
      />

      {/* Toast 容器 */}
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />

      {/* 顶部导航 */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDark={toggleDark}
      />

      {/* 主内容区 */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        {renderTab()}
      </main>

      {/* 深色模式浮动按钮 */}
      <DarkModeToggle darkMode={darkMode} toggle={toggleDark} />

      {/* 底部信息 */}
      <footer className="text-center py-4 text-xs text-gray-400">
        🎵 命运和弦 · 数据存储在本地浏览器 · 隐私完全保护
      </footer>
    </div>
  );
}

export default App;
