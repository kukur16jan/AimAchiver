import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Heart,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { tasks, moodEntries } = useData();

  const analytics = useMemo(() => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const activeTasks = tasks.filter(task => task.status === 'active');
    
    // Calculate completion rate
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
    
    // Calculate average mood over last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    });
    
    const recentMoods = moodEntries.filter(entry => 
      last7Days.includes(new Date(entry.date).toDateString())
    );
    
    const avgMood = recentMoods.length > 0 
      ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length 
      : 0;
    
    // Task completion by category
    const categoryStats = tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = { total: 0, completed: 0 };
      }
      acc[task.category].total++;
      if (task.status === 'completed') {
        acc[task.category].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);
    
    // Weekly progress
    const weeklyProgress = last7Days.map(dateStr => {
      const date = new Date(dateStr);
      const dayTasks = tasks.filter(task => {
        return task.microtasks.some(mt => {
          const taskDate = new Date(task.createdAt);
          taskDate.setDate(taskDate.getDate() + mt.day - 1);
          return taskDate.toDateString() === dateStr && mt.completed;
        });
      });
      
      const dayMood = moodEntries.find(entry => 
        new Date(entry.date).toDateString() === dateStr
      );
      
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: dayTasks.length,
        mood: dayMood?.mood || 0
      };
    }).reverse();
    
    return {
      completionRate,
      avgMood,
      categoryStats,
      weeklyProgress,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      activeTasks: activeTasks.length
    };
  }, [tasks, moodEntries]);

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
      <div className="w-full rounded-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track your productivity patterns and emotional well-being
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Completion Rate"
            value={`${analytics.completionRate}%`}
            icon={Target}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            change={5}
          />
          <StatCard
            title="Active Goals"
            value={analytics.activeTasks}
            icon={Activity}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Average Mood"
            value={analytics.avgMood.toFixed(1)}
            icon={Heart}
            color="bg-gradient-to-r from-pink-500 to-pink-600"
          />
          <StatCard
            title="Current Level"
            value={user?.level || 1}
            icon={Award}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Weekly Progress Chart */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Progress</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {analytics.weeklyProgress.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">
                    {day.date}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 transition-all duration-300 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                          style={{ width: `${Math.min(day.tasks * 20, 100)}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-sm text-gray-600">{day.tasks}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {day.mood > 0 ? day.mood.toFixed(1) : '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Goals by Category</h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(analytics.categoryStats).map(([category, stats]) => {
                const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                      <span className="text-sm text-gray-500">
                        {stats.completed}/{stats.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 transition-all duration-300 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              
              {Object.keys(analytics.categoryStats).length === 0 && (
                <div className="py-8 text-center">
                  <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No goals created yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mood Trends */}
        <div className="p-6 mt-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mood & Energy Trends</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          {analytics.weeklyProgress.some(day => day.mood > 0) ? (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {analytics.weeklyProgress.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-2 text-xs font-medium text-gray-600">{day.date}</div>
                    <div className={`w-full h-16 rounded-lg flex items-end justify-center ${
                      day.mood === 0 ? 'bg-gray-100' : 
                      day.mood <= 2 ? 'bg-red-100' :
                      day.mood <= 3 ? 'bg-yellow-100' :
                      day.mood <= 4 ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {day.mood > 0 && (
                        <div 
                          className={`w-full rounded-lg ${
                            day.mood <= 2 ? 'bg-red-500' :
                            day.mood <= 3 ? 'bg-yellow-500' :
                            day.mood <= 4 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ height: `${(day.mood / 5) * 100}%` }}
                        ></div>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {day.mood > 0 ? day.mood.toFixed(1) : '-'}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Poor (1-2)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Fair (3)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Good (4)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Excellent (5)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Start tracking your mood to see trends</p>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Insights & Recommendations</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="mb-2 font-medium text-gray-900">🎯 Productivity Tip</h3>
              <p className="text-sm text-gray-600">
                {analytics.completionRate >= 80 
                  ? "You're doing great! Keep maintaining this high completion rate."
                  : "Try breaking down larger goals into smaller, more manageable daily tasks."
                }
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h3 className="mb-2 font-medium text-gray-900">💡 Mood Insight</h3>
              <p className="text-sm text-gray-600">
                {analytics.avgMood >= 4 
                  ? "Your mood has been consistently positive. Great job maintaining balance!"
                  : analytics.avgMood >= 3
                  ? "Your mood is stable. Consider adding more enjoyable activities to boost it further."
                  : "Focus on self-care and consider what might be affecting your mood."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};