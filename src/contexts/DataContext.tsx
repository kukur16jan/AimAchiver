/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  microtasks: Microtask[];
  createdAt: string;
  completedAt?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface Microtask {
  id: string;
  title: string;
  day: number;
  completed: boolean;
  completedAt?: string;
  quizTaken: boolean;
  quizScore?: number;
  quiz?: Question[];
}

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
  motivation: number; // 1-5 scale
  notes?: string;
  geminiRating?: number;
  geminiQuote?: string;
  geminiAdvice?: string;
  moodInput?: string;
}

export interface Peer {
  id: string;
  requester: { _id: string; name: string; email: string };
  recipient: { _id: string; name: string; email: string };
  status: 'pending' | 'accepted';
  createdAt: string;
}

interface DataContextType {
  tasks: Task[];
  moodEntries: MoodEntry[];
  peers: Peer[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeMicrotask: (taskId: string, microtaskId: string, quizScore: number) => void;
  addMoodEntry: (mood: Omit<MoodEntry, 'id'>) => void;
  invitePeer: (email: string) => Promise<void>;
  removePeer: (peerId: string) => Promise<void>;
  acceptPeer: (token: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const [tasksRes, moodsRes, peersRes] = await Promise.all([
          fetch(`https://aim-achiever-backend.onrender.com/api/tasks/${user.id}`),
          fetch(`https://aim-achiever-backend.onrender.com/api/moods/${user.id}`),
          fetch(`https://aim-achiever-backend.onrender.com/api/peers?userId=${user.id}`)
        ]);
        const tasksData = await tasksRes.json();
        setTasks(tasksData.map((t: any) => ({ ...t, id: t._id })));
        const moodsData = await moodsRes.json();
        setMoodEntries(moodsData.map((m: any) => ({ ...m, id: m._id })));
        const peersData = await peersRes.json();
        setPeers(peersData.map((p: any) => ({ ...p, id: p._id })));
      }
    };
    fetchData();
  }, [user]);

  // API-based saving, no localStorage

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!user) return;
    const newTask = {
      ...taskData,
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    const res = await fetch('https://aim-achiever-backend.onrender.com/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    const created = await res.json();
    setTasks(prev => [...prev, { ...created, id: created._id }]);
    updateUser({ totalTasks: (user.totalTasks || 0) + 1 });
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const res = await fetch(`https://aim-achiever-backend.onrender.com/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const updated = await res.json();
    setTasks(prev => prev.map(task => task.id === id ? { ...updated, id: updated._id } : task));
  };

  const deleteTask = async (id: string) => {
    await fetch(`https://aim-achiever-backend.onrender.com/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completeMicrotask = async (taskId: string, microtaskId: string, quizScore: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updatedMicrotasks = task.microtasks.map(microtask => {
      if (microtask.id === microtaskId) {
        return {
          ...microtask,
          completed: quizScore >= 80,
          completedAt: new Date().toISOString(),
          quizTaken: true,
          quizScore
        };
      }
      return microtask;
    });
    const allCompleted = updatedMicrotasks.every(mt => mt.completed);
    const updatedTask = {
      ...task,
      microtasks: updatedMicrotasks,
      status: allCompleted ? 'completed' : task.status,
      completedAt: allCompleted ? new Date().toISOString() : task.completedAt
    };
    await fetch(`https://aim-achiever-backend.onrender.com/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    if (user && quizScore >= 80) {
      const xpGain = 10;
      const newXP = user.xp + xpGain;
      const newLevel = Math.floor(newXP / 100) + 1;
      const newStreak = user.streak + 1;
      updateUser({
        xp: newXP,
        level: newLevel,
        streak: newStreak,
        completedTasks: user.completedTasks + 1
      });
    }
  };

  const addMoodEntry = async (moodData: Omit<MoodEntry, 'id'> & { moodInput?: string }) => {
    if (!user) return;
    const newMood = {
      ...moodData,
      userId: user.id,
      moodInput: moodData.moodInput || ''
    };
    // Use Gemini-powered endpoint
    const res = await fetch('https://aim-achiever-backend.onrender.com/api/moods/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMood)
    });
    const created = await res.json();
    setMoodEntries(prev => [...prev, { ...created, id: created._id }]);
  };


  // Invite a peer by email
  const invitePeer = async (email: string) => {
    await fetch(`https://aim-achiever-backend.onrender.com/api/peers/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail: email, requesterId: user?.id })
    });
    // Refresh peers
    const res = await fetch(`https://aim-achiever-backend.onrender.com/api/peers?userId=${user?.id}`);
    const peersData = await res.json();
    setPeers(peersData.map((p: any) => ({ ...p, id: p._id })));
  };

  // Remove a peer
  const removePeer = async (peerId: string) => {
    await fetch(`https://aim-achiever-backend.onrender.com/api/peers/${peerId}?userId=${user?.id}`, { method: 'DELETE' });
    // Refresh peers
    const res = await fetch('https://aim-achiever-backend.onrender.com/api/peers');
    const peersData = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPeers(peersData.map((p: any) => ({ ...p, id: p._id })));
  };

  // Accept a peer request (by token)
  const acceptPeer = async (token: string) => {
    await fetch(`https://aim-achiever-backend.onrender.com/api/peers/accept/${token}?userId=${user?.id}`);
    // Refresh peers
    const res = await fetch('https://aim-achiever-backend.onrender.com/api/peers');
    const peersData = await res.json();
    setPeers(peersData.map((p: any) => ({ ...p, id: p._id })));
  };

  return (
    <DataContext.Provider value={{
      tasks,
      moodEntries,
      peers,
      addTask,
      updateTask,
      deleteTask,
      completeMicrotask,
      addMoodEntry,
      invitePeer,
      removePeer,
      acceptPeer
    }}>
      {children}
    </DataContext.Provider>
  );
};