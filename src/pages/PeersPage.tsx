import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Users, Plus, Search, UserCheck, UserX } from 'lucide-react';

export default function PeersPage() {
  const { peers, invitePeer, removePeer } = useData();
  const { user } = useAuth();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the other user in the peer relationship
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOtherUser = (peer: any) => {
    if (!user) return null;
    return peer.requester.email === user.email ? peer.recipient : peer.requester;
  };

  const filteredPeers = peers.filter(peer => {
    const other = getOtherUser(peer);
    return (
      other?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      other?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const acceptedPeers = filteredPeers.filter(peer => peer.status === 'accepted');
  const pendingPeers = filteredPeers.filter(peer => peer.status === 'pending');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await invitePeer(inviteEmail);
      setMessage('Invitation sent!');
      setInviteEmail('');
      setShowInvite(false);
    } catch (err) {
      console.error('Error inviting peer:', err);
      setMessage('Failed to send invite.');
    }
    setLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRemove = async (peer: any) => {
    const other = getOtherUser(peer);
    if (other) await removePeer(other._id);
  };

  return (
      <div className="w-full p-2 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex flex-col mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Accountability Network</h1>
            <p className="text-gray-600">
              Connect with peers to stay motivated and accountable
            </p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center px-6 py-3 mt-4 space-x-2 text-white transition-all rounded-lg sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-5 h-5" />
            <span>Invite Peer</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search peers..."
              className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Accepted Peers */}
        {acceptedPeers.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Network</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {acceptedPeers.map((peer) => {
                const other = getOtherUser(peer);
                return (
                  <div key={peer.id} className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
                    <div className="flex items-center mb-4 space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{other?.name || other?.email}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{other?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className="flex items-center space-x-1 text-green-600">
                          <UserCheck className="w-4 h-4" />
                          <span>Connected</span>
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleRemove(peer)}
                        className="flex items-center px-4 py-2 space-x-1 text-sm font-medium text-red-700 transition-colors rounded-lg bg-red-50 hover:bg-red-100"
                      >
                        <UserX className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pending Invites */}
        {pendingPeers.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Pending Invitations</h2>
            <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
              {pendingPeers.map((peer) => {
                const other = getOtherUser(peer);
                return (
                  <div key={peer.id} className="flex items-center justify-between p-6 border-b border-gray-100 last:border-b-0">
                    <div>
                      <h3 className="font-medium text-gray-900">{other?.name || other?.email}</h3>
                      <p className="text-sm text-gray-600">{other?.email}</p>
                    </div>
                    <span className="text-yellow-600">Pending</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Invite Peer Modal */}
        {showInvite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl">
              <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
                <h2 className="text-xl font-semibold">Invite Peer</h2>
                <p className="text-sm text-blue-100">Invite a registered user by email</p>
              </div>
              <form onSubmit={handleInvite} className="p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter their email"
                    required
                  />
                </div>
                <div className="flex items-center justify-end pt-4 space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowInvite(false)}
                    className="px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-white transition-all rounded-lg disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? 'Inviting...' : 'Send Invite'}
                  </button>
                </div>
                {message && <div className="mt-2 text-sm text-blue-700">{message}</div>}
              </form>
            </div>
          </div>
        )}

        {/* Empty State */}
        {acceptedPeers.length === 0 && pendingPeers.length === 0 && !searchTerm && (
          <div className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No connections yet</h3>
            <p className="mb-6 text-gray-500">
              Start building your accountability network by inviting peers
            </p>
            <button
              onClick={() => setShowInvite(true)}
              className="px-6 py-3 text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Invite Your First Peer
            </button>
          </div>
        )}
      </div>
  );
};