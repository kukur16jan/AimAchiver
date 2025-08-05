import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PeerUser {
  _id: string;
  name: string;
  email: string;
}

export default function PeersWhoAddedMePage() {
  const [peers, setPeers] = useState<PeerUser[]>([]);
  const [loading, setLoading] = useState(true);
 const { user } = useAuth();
  useEffect(() => {
    const fetchPeers = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/peers/who-added-me?userId=${user?.id}`);
      const data = await res.json();
      setPeers(data || []);
      setLoading(false);
    };
    fetchPeers();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-2xl px-4 py-10 mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-blue-700">People Who Added Me as Peer</h2>
      {peers?.length === 0 ? (
        <div className="text-gray-500">No one has added you as a peer yet.</div>
      ) : (
        <ul className="space-y-4">
          {peers?.map(peer => (
            <li key={peer?._id} className="flex items-center justify-between p-4 bg-white shadow rounded-xl">
              <div>
                <div className="font-semibold text-blue-700">{peer?.name}</div>
                <div className="text-sm text-gray-500">{peer?.email}</div>
              </div>
              <Link to={`/peer-dashboard/${peer?._id}`} className="px-4 py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">View Progress</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
