import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Connections = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch data when the component mounts or user changes
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      authService.getConnections(),
      authService.getRequests()
    ])
      .then(([connectionsRes, requestsRes]) => {
        setConnections(connectionsRes.connections || []);
        setRequests(requestsRes.listRequests || []);
        console.log('Connections:', connectionsRes);
        console.log('Requests:', requestsRes);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleAcceptRequest = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: 'accepting' }));
    try {
      await authService.acceptRequest(requestId);
      // Refresh data
      const [connectionsRes, requestsRes] = await Promise.all([
        authService.getConnections(),
        authService.getRequests()
      ]);
      setConnections(connectionsRes.connections || []);
      setRequests(requestsRes.listRequests || []);
    } catch (error) {
      console.error('Error accepting request:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  const handleDeclineRequest = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: 'declining' }));
    try {
      await authService.declineRequest(requestId);
      // Refresh data
      const [connectionsRes, requestsRes] = await Promise.all([
        authService.getConnections(),
        authService.getRequests()
      ]);
      setConnections(connectionsRes.connections || []);
      setRequests(requestsRes.listRequests || []);
    } catch (error) {
      console.error('Error declining request:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'declined':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              My Network
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Manage your connections and skill exchange requests
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 -mt-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Network Management</h2>
                <p className="text-blue-100 mt-1">Connect with fellow skill exchangers</p>
              </div>
              <div className="text-blue-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex space-x-1 bg-white/20 rounded-xl p-1">
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'connections'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTab('connections')}
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>My Connections</span>
                  {connections.length > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {connections.length}
                    </span>
                  )}
                </span>
              </button>
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'requests'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTab('requests')}
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span>Pending Requests</span>
                  {requests.length > 0 && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      {requests.length}
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
                </div>
                <p className="text-gray-600 mt-4 font-medium">Loading your network...</p>
              </div>
            ) : (
              <>
                {/* Connections Tab */}
                {activeTab === 'connections' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">My Connections</h3>
                        <p className="text-gray-600 mt-1">People you're connected with for skill exchanges</p>
                      </div>
                      <div className="bg-blue-50 px-4 py-2 rounded-xl">
                        <span className="text-blue-600 font-semibold">{connections.length} Connection{connections.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {connections.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">No connections yet</h4>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Start connecting with other users to build your skill exchange network. Browse skills and send connection requests!
                        </p>
                        <Link to="/">
                          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                            <span className="flex items-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <span>Browse Skills</span>
                            </span>
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {connections.map((conn) => (
                          <div key={conn._id} className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {(conn.recipient?.name || conn.recipient?.email || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">
                                  {conn.recipient?.name || conn.recipient?.email || 'Unknown User'}
                                </h4>
                                <p className="text-gray-500 text-sm">
                                  {conn.recipient?.email && conn.recipient?.name ? conn.recipient.email : ''}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(conn.status)}`}>
                                {getStatusIcon(conn.status)}
                                <span className="capitalize">{conn.status || 'Unknown'}</span>
                              </span>
                              
                              <button className="opacity-0 group-hover:opacity-100 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-all duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">Pending Requests</h3>
                        <p className="text-gray-600 mt-1">Connection requests waiting for your response</p>
                      </div>
                      <div className="bg-yellow-50 px-4 py-2 rounded-xl">
                        <span className="text-yellow-600 font-semibold">{requests.length} Request{requests.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {requests.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">No pending requests</h4>
                        <p className="text-gray-600 max-w-md mx-auto">
                          You don't have any pending connection requests at the moment. When someone wants to connect with you, their requests will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests.map((req) => (
                          <div key={req._id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                  {(req.sender?.name || req.sender?.email || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-lg">
                                    {req.sender?.name || req.sender?.email || 'Unknown User'}
                                  </h4>
                                  <p className="text-gray-500">
                                    {req.sender?.email && req.sender?.name ? req.sender.email : ''}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                                      {getStatusIcon(req.status)}
                                      <span className="capitalize">{req.status || 'Pending'}</span>
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {req.status === 'pending' && (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => handleDeclineRequest(req._id)}
                                    disabled={actionLoading[req._id]}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {actionLoading[req._id] === 'declining' ? (
                                      <span className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Declining...</span>
                                      </span>
                                    ) : (
                                      <span className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>Decline</span>
                                      </span>
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={() => handleAcceptRequest(req._id)}
                                    disabled={actionLoading[req._id]}
                                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-medium hover:bg-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {actionLoading[req._id] === 'accepting' ? (
                                      <span className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Accepting...</span>
                                      </span>
                                    ) : (
                                      <span className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Accept</span>
                                      </span>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Connections</p>
                <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Exchanges</p>
                <p className="text-2xl font-bold text-gray-900">{connections.filter(c => c.status === 'accepted').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;
