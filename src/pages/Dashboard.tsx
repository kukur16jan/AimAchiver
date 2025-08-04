import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  Target, 
  Award, 
  Flame, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Plus,
  Brain,
  Heart
} from 'lucide-react';
import QuickTaskForm from '../components/Tasks/QuickTaskForm';
import MoodTracker from '../components/Mood/MoodTracker';
import AIAssistant from '../components/AI/AIAssistant';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, moodEntries } = useData();
  const [showQuickTask, setShowQuickTask] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const activeTasks = tasks.filter(task => task.status === 'active');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const todaysTasks = activeTasks.filter(task => {
    const today = new Date().toDateString();
    return task.microtasks.some(mt => {
      const taskDate = new Date(task.createdAt);
      taskDate.setDate(taskDate.getDate() + mt.day - 1);
      return taskDate.toDateString() === today && !mt.completed;
    });
  });

  // Find the latest mood entry for today (by date descending)
  const todaysMood = moodEntries
    .filter(entry => new Date(entry.date).toDateString() === new Date().toDateString())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Show the latest Gemini quote or advice for today, even if rating is the same
  let moodBanner = null;
  if (todaysMood) {
    if (todaysMood.geminiQuote) {
      moodBanner = (
        <div className="relative flex items-center p-6 mb-8 overflow-hidden border-l-8 border-green-400 shadow-lg bg-gradient-to-r from-green-200 via-green-50 to-blue-100 rounded-2xl animate-fade-in">
          <span className="absolute left-4 top-4 animate-sparkle">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#glow)">
                <path d="M16 4L18.09 13.91L28 16L18.09 18.09L16 28L13.91 18.09L4 16L13.91 13.91L16 4Z" fill="#34d399"/>
              </g>
              <defs>
                <filter id="glow" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </span>
          <span className="mr-4 text-lg font-bold text-green-700 drop-shadow">Motivation:</span>
          <span className="text-xl italic font-semibold tracking-wide text-green-900 drop-shadow animate-glitter">
            {todaysMood.geminiQuote}
          </span>
        </div>
      );
    } else if (todaysMood.geminiAdvice) {
      moodBanner = (
        <div className="relative flex items-center p-6 mb-8 overflow-hidden border-l-8 border-yellow-400 shadow-lg bg-gradient-to-r from-yellow-100 via-white to-pink-100 rounded-2xl animate-fade-in">
          <span className="absolute left-4 top-4 animate-sparkle">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#glow)">
                <circle cx="16" cy="16" r="12" fill="#fbbf24"/>
              </g>
              <defs>
                <filter id="glow" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </span>
          <span className="mr-4 text-lg font-bold text-yellow-700 drop-shadow">Advice:</span>
          <span className="text-xl italic font-semibold tracking-wide text-yellow-900 drop-shadow animate-glitter">
            {todaysMood.geminiAdvice}
          </span>
        </div>
      );
    }
  }

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const stats = [
    {
      title: 'Level',
      value: user?.level || 1,
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Current Streak',
      value: `${user?.streak || 0} days`,
      icon: Flame,
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'Completed Tasks',
      value: user?.completedTasks || 0,
      icon: CheckCircle,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Success Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    }
  ];

  return (
      <div className="w-full ">
        {moodBanner}
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to achieve your goals today? You have {todaysTasks.length} tasks waiting for you.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          <button
            onClick={() => setShowQuickTask(true)}
            className="p-6 text-white transition-all transform shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <Plus className="w-8 h-8" />
              <div className="text-left">
                <h3 className="text-lg font-semibold">Add New Goal</h3>
                <p className="text-blue-100">Break it into daily tasks</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowAIAssistant(true)}
            className="p-6 text-white transition-all transform shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8" />
              <div className="text-left">
                <h3 className="text-lg font-semibold">AI Assistant</h3>
                <p className="text-emerald-100">Get help with your tasks</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowMoodTracker(true)}
            className="p-6 text-white transition-all transform shadow-lg bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl hover:from-pink-600 hover:to-rose-700 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8" />
              <div className="text-left">
                <h3 className="text-lg font-semibold">Track Mood</h3>
                <p className="text-pink-100">Log your daily energy</p>
              </div>
            </div>
          </button>
        </div>

        {/* Today's Focus */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Today's Tasks */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm min-h-[55vh] rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Today's Focus</h2>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            
            {todaysTasks.length > 0 ? (
              <div className="space-y-3">
                {todaysTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center p-3 space-x-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600">
                        {task.microtasks.filter(mt => !mt.completed).length} tasks remaining
                      </p>
                    </div>
                  </div>
                ))}
                {todaysTasks.length > 3 && (
                  <p className="py-2 text-sm text-center text-gray-500">
                    +{todaysTasks.length - 3} more tasks
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No tasks scheduled for today</p>
                <p className="text-sm text-gray-400">Add a new goal to get started</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Quick Insights</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Tasks Completed</span>
                </div>
                <span className="font-bold text-green-600">{completedTasks.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Active Goals</span>
                </div>
                <span className="font-bold text-blue-600">{activeTasks.length}</span>
              </div>
              
              {todaysMood && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Today's Mood</span>
                  </div>
                  <span className="font-bold text-purple-600">{todaysMood.mood}/5</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showQuickTask && (
          <QuickTaskForm onClose={() => setShowQuickTask(false)} />
        )}
        
        {showMoodTracker && (
          <MoodTracker onClose={() => setShowMoodTracker(false)} />
        )}
        
        {showAIAssistant && (
          <AIAssistant onClose={() => setShowAIAssistant(false)} />
        )}
      </div>
  );
};

/* Add these styles to your global CSS (e.g., index.css or tailwind.css):
.animate-fade-in {
  animation: fadeIn 1s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-sparkle {
  animation: sparkle 2s infinite linear;
}
@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.7; transform: scale(1.2) rotate(20deg); }
}
.animate-glitter {
  animation: glitter 1.5s infinite alternate;
}
@keyframes glitter {
  0% { text-shadow: 0 0 8px #fff7, 0 0 2px #fff7; }
  100% { text-shadow: 0 0 16px #fff, 0 0 8px #fff; }
}
*/