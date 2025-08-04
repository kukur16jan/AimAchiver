import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { X, Heart, Battery, Zap } from 'lucide-react';

interface MoodTrackerProps {
  onClose: () => void;
}

const MoodTracker = ({ onClose }: MoodTrackerProps) => {
  const { addMoodEntry } = useData();
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [notes, setNotes] = useState('');

  // moodIcons unused, removed

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [moodInput, setMoodInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addMoodEntry({
        date: new Date().toISOString(),
        mood,
        energy,
        motivation,
        notes: notes.trim() || undefined,
        moodInput: moodInput.trim() || undefined
      });
      onClose();
    } catch (err) {
      setError('Could not save mood.');
    } finally {
      setLoading(false);
    }
  };

  const renderScale = (value: number, setValue: (val: number) => void, label: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setValue(num)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                value >= num
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 text-gray-400 hover:border-blue-300'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Daily Mood Check</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mood Scale */}
          {renderScale(mood, setMood, 'How are you feeling?', Heart)}
          
          {/* Energy Scale */}
          {renderScale(energy, setEnergy, 'Energy Level', Battery)}
          
          {/* Motivation Scale */}
          {renderScale(motivation, setMotivation, 'Motivation Level', Zap)}


          {/* Mood Input (for Gemini) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling? (Describe in a few words)
            </label>
            <textarea
              value={moodInput}
              onChange={e => setMoodInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-20 resize-none"
              placeholder="E.g. I'm feeling energetic and positive today!"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-20 resize-none"
              placeholder="How was your day? Any thoughts to share?"
            />
          </div>

          {/* Error */}
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Mood'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodTracker;