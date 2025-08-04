import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PeerUser {
  id: string;
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

interface Comment {
  _id: string;
  text: string;
  author: { _id: string; name: string };
  createdAt: string;
}

export default function PeerDashboardPage() {
  const { peerId } = useParams();
    const { user } = useAuth();
  const [peer, setPeer] = useState<PeerUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!peerId) return;
    const fetchData = async () => {
      setLoading(true);
      const [peerRes, tasksRes, moodsRes, commentsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/peers/user/${peerId}`),
        fetch(`http://localhost:3000/api/tasks/${peerId}`),
        fetch(`http://localhost:3000/api/moods/${peerId}`),
        fetch(`http://localhost:3000/api/peers/${peerId}/comments`)
      ]);
      setPeer(await peerRes.json());
      setTasks(await tasksRes.json());
      setMoods(await moodsRes.json());
      setComments(await commentsRes.json());
      setLoading(false);
    };
    fetchData();
  }, [peerId]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const res = await fetch(`http://localhost:3000/api/peers/${peerId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: comment, authorId: user?.id, authorName: user?.name })
    });
    const newComment = await res.json();
    setComments(prev => [newComment, ...prev]);
    setComment('');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!peer) return <div className="flex items-center justify-center min-h-screen">Peer not found.</div>;

  return (
    <div className="max-w-3xl px-4 py-10 mx-auto">
      <div className="flex items-center p-6 mb-8 space-x-4 shadow rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex flex-col items-center justify-center w-20 h-20 text-3xl font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
          {peer.name ? peer.name[0] : '?'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-700">{peer.name}</h2>
          <p className="text-gray-500">Level {peer.level} | XP: {peer.xp} | Streak: {peer.streak} days</p>
          <p className="text-sm text-gray-400">{peer.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-blue-700">Recent Tasks</h3>
          <ul className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <li key={task.id} className="p-3 bg-white border-l-4 border-blue-400 rounded shadow">
                <span className="font-medium">{task.title}</span> <span className="text-xs text-gray-400">({task.status})</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-purple-700">Recent Mood Entries</h3>
          <ul className="space-y-2">
            {moods.slice(0, 5).map(mood => (
              <li key={mood.id} className="p-3 bg-white border-l-4 border-purple-400 rounded shadow">
                <span className="font-medium">{mood.date}</span>: Mood {mood.mood}/5, Energy {mood.energy}/5, Motivation {mood.motivation}/5
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="mb-2 text-lg font-semibold text-green-700">Peer Comments</h3>
        <form onSubmit={handleComment} className="flex items-center mb-4 space-x-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Leave a comment for your peer..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">Comment</button>
        </form>
        <ul className="space-y-3">
          {comments.map(c => (
            <li key={c._id} className="flex items-center p-3 space-x-2 rounded shadow bg-blue-50">
              <span className="font-bold text-blue-700">{c.author.name}:</span>
              <span>{c.text}</span>
              <span className="ml-auto text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
