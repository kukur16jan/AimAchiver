import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PeerUser {
  _id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
}

interface Task {
  id: string;
  title: string;
  status: string;
  completedAt?: string;
}

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  motivation: number;
}

export default function PeerDetailsForRecipientPage() {
  const { peerId } = useParams();
  const { user } = useAuth();
  const [peer, setPeer] = useState<PeerUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!peerId || !user) return;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      // Check if user is a recipient of peerId's request
      const allowedRes = await fetch(`http://localhost:3000/api/peers/${peerId}/recipients`);
      const allowed = await allowedRes.json();
      if (!Array.isArray(allowed) || !allowed.some((u: any) => u._id === user.id)) {
        setError('You are not allowed to view this user.');
        setLoading(false);
        return;
      }
      const [peerRes, tasksRes, moodsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/peers/user/${peerId}`),
        fetch(`http://localhost:3000/api/tasks/${peerId}`),
        fetch(`http://localhost:3000/api/moods/${peerId}`)
      ]);
      setPeer(await peerRes.json());
      setTasks(await tasksRes.json());
      setMoods(await moodsRes.json());
      setLoading(false);
    };
    fetchData();
  }, [peerId, user]);

  // Filter tasks and moods to last 1 month
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const recentTasks = tasks.filter(t => !t.completedAt || new Date(t.completedAt) > oneMonthAgo);
  const recentMoods = moods.filter(m => new Date(m.date) > oneMonthAgo);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  if (!peer) return <div className="flex items-center justify-center min-h-screen">Peer not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8 p-6 rounded-xl shadow bg-gradient-to-r from-blue-50 to-purple-50 flex items-center space-x-4">
        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-bold">
          {peer.name ? peer.name[0] : '?'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-700">{peer.name}</h2>
          <p className="text-gray-500">Level {peer.level} | XP: {peer.xp} | Streak: {peer.streak} days</p>
          <p className="text-gray-400 text-sm">{peer.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-blue-700">Recent Tasks (Last Month)</h3>
          <ul className="space-y-2">
            {recentTasks.length === 0 && <li className="text-gray-400">No tasks in the last month.</li>}
            {recentTasks.map(task => (
              <li key={task.id} className="p-3 bg-white rounded shadow border-l-4 border-blue-400">
                <span className="font-medium">{task.title}</span> <span className="text-xs text-gray-400">({task.status})</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Recent Mood Entries (Last Month)</h3>
          <ul className="space-y-2">
            {recentMoods.length === 0 && <li className="text-gray-400">No mood entries in the last month.</li>}
            {recentMoods.map(mood => (
              <li key={mood.id} className="p-3 bg-white rounded shadow border-l-4 border-purple-400">
                <span className="font-medium">{mood.date}</span>: Mood {mood.mood}/5, Energy {mood.energy}/5, Motivation {mood.motivation}/5
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
