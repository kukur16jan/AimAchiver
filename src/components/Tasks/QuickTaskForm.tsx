/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { X, Target, Calendar, AlertCircle } from 'lucide-react';
import { Task, Microtask } from '../../contexts/DataContext';
import Spinner from '../Spinner';

interface QuickTaskFormProps {
  onClose: () => void;
}

const QuickTaskForm = ({ onClose }: QuickTaskFormProps) => {
  const { addTask } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'Personal'
  });
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Call Gemini microtask API
      const res = await fetch('https://aim-achiever-backend.vercel.app/api/gemini-microtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: formData.title, days, description: formData.description })
      });
      if (!res.ok) throw new Error('Failed to generate microtasks');
      const { microtasks } = await res.json();
      const taskMicrotasks: Microtask[] = microtasks.map((mt: any, idx: number) => ({
        id: `${Date.now()}-${idx}`,
        title: mt.title,
        day: mt.day,
        completed: false,
        quizTaken: false
      }));
      const newTask: Omit<Task, 'id' | 'createdAt'> = {
        ...formData,
        status: 'active',
        microtasks: taskMicrotasks
      };
      await addTask(newTask);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error generating microtasks');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-semibold">{loading?"Creating":"Create"} New Goal</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-lg hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading?<Spinner/>:<form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Learn Spanish, Complete Project X"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full h-20 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your goal and why it's important to you"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Deadline *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Health">Health</option>
                  <option value="Learning">Learning</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Days Input for Microtask Generation */}
          <div className="mt-8">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Number of Days for Goal Breakdown
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-xs text-gray-500">AI will generate a daily plan for this many days.</p>
          </div>
          {error && <div className="mt-2 text-red-500">{error}</div>}
          {loading && <div className="mt-2 text-blue-600">Generating microtasks with AI...</div>}

          {/* Submit Button */}
          <div className="flex items-center justify-end mt-8 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-white transition-all rounded-lg disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>}
      </div>
    </div>
  );
};

export default QuickTaskForm;