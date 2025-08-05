import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  _id: string;
  text: string;
  author: string;
  createdAt: string;
  name:string;
}

export default function MyPeerCommentsPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchComments = async () => {
      setLoading(true);
      const res = await fetch(`https://aim-achiever-backend.vercel.app/api/peers/${user.id}/comments`);
      const data = await res.json();
      console.log('Fetched comments:', data);
      setComments(data);
      setLoading(false);
    };
    fetchComments();
  }, [user]);

  if (!user) return <div className="flex items-center justify-center min-h-screen">Login required</div>;
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-2xl px-4 py-10 mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-blue-700">Comments from Your Peers</h2>
      {comments.length === 0 ? (
        <div className="text-gray-500">No comments from your peers yet.</div>
      ) : (
        <ul className="space-y-4">
          {comments.map(comment => (
            <li key={comment._id} className="flex items-center p-6 space-x-2 bg-white shadow rounded-xl">
              <span className="font-bold text-blue-700">{comment.name}:</span>
              <span>{comment.text}</span>
              <span className="ml-auto text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
