/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
// import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle
  ,Calendar,
  Target,
  Play,
  Pause,
  Trash2
} from 'lucide-react';
import QuickTaskForm from '../components/Tasks/QuickTaskForm';
import TaskQuiz from '../components/Tasks/TaskQuiz';

export default function TasksPage() {
  const { tasks, updateTask, deleteTask } = useData();
  // const { user } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showQuiz, setShowQuiz] = useState<{ taskId: string; microtaskId: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [selectedTask, setSelectedTask] = useState<null | string>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task?.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                         task?.description?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'paused': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleMicrotaskComplete = (taskId: string, microtaskId: string) => {
    setShowQuiz({ taskId, microtaskId });
  };

  const handleQuizComplete = (taskId: string, microtaskId: string, score: number) => {
    // This would be handled by the DataContext
    setShowQuiz(null);
  };

  const toggleTaskStatus = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateTask(taskId, { status: newStatus as any });
  };

  return (
      <div className="w-full from-slate-800 to-slate-700 rounded-2xl ">
        {/* Header */}
        <div className="flex flex-col mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">My Goals</h1>
            <p className="text-gray-600">
              Track and manage your goals with daily microtasks
            </p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center px-6 py-3 mt-4 space-x-2 text-white transition-all rounded-lg sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search goals..."
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Goals</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredTasks.map((task) => {
              const completedMicrotasks = task.microtasks.filter(mt => mt.completed).length;
              const totalMicrotasks = task.microtasks.length;
              const progress = totalMicrotasks > 0 ? (completedMicrotasks / totalMicrotasks) * 100 : 0;
              
              return (
                <div key={task.id} className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm cursor-pointer rounded-xl hover:shadow-md" onClick={() => setSelectedTask(task.id)}>
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2 space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="mb-3 text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{task.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">{completedMicrotasks}/{totalMicrotasks} days</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 transition-all duration-300 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Microtasks Preview (show first 3 only, open modal for all) */}
                  <div className="mb-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Daily Tasks</h4>
                    <div className="space-y-1 overflow-y-auto max-h-72">
                      {task.microtasks.slice(0, 3).map((microtask, idx, arr) => {
                        // Sequential quiz logic: Only allow quiz for first incomplete microtask where all previous are completed
                        const prevCompleted = arr.slice(0, idx).every(mt => mt.completed);
                        const canTakeQuiz = !microtask.completed && prevCompleted && task.status === 'active';
                        return (
                          <div key={microtask.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                microtask.completed 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-300'
                              }`}>
                                {microtask.completed && <CheckCircle className="w-4 h-4 text-white" />}
                              </div>
                              <span className={`text-sm ${microtask.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                Day {microtask.day}: {microtask.title}
                              </span>
                            </div>
                            {!microtask.completed && (
                              canTakeQuiz ? (
                                <button
                                  onClick={e => { e.stopPropagation(); handleMicrotaskComplete(task.id, microtask.id); }}
                                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                >
                                  Complete
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400 cursor-not-allowed select-none">Locked</span>
                              )
                            )}
                          </div>
                        );
                      })}
                      {task.microtasks.length > 3 && (
                        <p className="py-1 text-xs text-center text-gray-500">
                          +{task.microtasks.length - 3} more days (click to view all)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleTaskStatus(task.id, task.status)}
                        className={`p-2 rounded-lg transition-colors ${
                          task.status === 'active' 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={task.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {task.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No goals found</h3>
            <p className="mb-6 text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first goal to get started on your productivity journey'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="px-6 py-3 text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Create Your First Goal
              </button>
            )}
          </div>
        )}

        {/* Modals */}
        {showTaskForm && (
          <QuickTaskForm onClose={() => setShowTaskForm(false)} />
        )}

        {/* Fullscreen Microtasks Modal */}
        {selectedTask && (() => {
          const task = tasks.find(t => t.id === selectedTask);
          if (!task) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative flex flex-col">
                <button className="absolute p-2 text-gray-400 top-4 right-4 hover:text-gray-700" onClick={() => setSelectedTask(null)}>
                  <span className="text-2xl">&times;</span>
                </button>
                <h2 className="mb-2 text-2xl font-bold text-transparent text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">{task.title}</h2>
                <p className="mb-6 italic text-gray-600">{task.description}</p>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 w-1 rounded-full left-4 bg-gradient-to-b from-blue-200 to-purple-200" />
                  <ul className="pl-10 space-y-6">
                    {task.microtasks.map((microtask, idx, arr) => {
                      const prevCompleted = arr.slice(0, idx).every(mt => mt.completed);
                      const canTakeQuiz = !microtask.completed && prevCompleted && task.status === 'active';
                      return (
                        <li key={microtask.id} className="relative flex items-center group">
                          <div className={`absolute left-[-38px] z-10 flex items-center justify-center w-8 h-8 rounded-full border-4 ${
                            microtask.completed
                              ? 'bg-green-500 border-green-200 text-white'
                              : canTakeQuiz
                                ? 'bg-blue-500 border-blue-200 text-white animate-pulse'
                                : 'bg-gray-200 border-gray-100 text-gray-400'
                          }`}>
                            {microtask.completed ? <CheckCircle className="w-5 h-5" /> : <span className="font-bold">{microtask.day}</span>}
                          </div>
                          <div className="flex-1 p-4 ml-4 border border-gray-100 shadow-sm rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold text-base ${microtask.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>Day {microtask.day}: {microtask.title}</span>
                              {!microtask.completed && (
                                canTakeQuiz ? (
                                  <button
                                    onClick={() => { setSelectedTask(null); handleMicrotaskComplete(task.id, microtask.id); }}
                                    className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  >
                                    Take Quiz
                                  </button>
                                ) : (
                                  <span className="text-xs font-semibold text-gray-400 cursor-not-allowed select-none">Locked</span>
                                )
                              )}
                            </div>
                            {microtask.completed && (
                              <div className="mt-2 text-xs text-green-600">Quiz completed! Score: {microtask.quizScore ?? 'N/A'}%</div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}

        {showQuiz && (
          <TaskQuiz
            taskId={showQuiz.taskId}
            microtaskId={showQuiz.microtaskId}
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(null)}
          />
        )}
      </div>
  );
};