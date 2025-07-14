import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';

const Connections = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts or user changes
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      authService.getConnections(),
      authService.getRequests()
    ])
      .then(([connectionsRes, requestsRes]) => {
        setConnections(connectionsRes.connections);
        setRequests(requestsRes.listRequests);
        console.log(connectionsRes)
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 text-gray-800">
        <div className="mb-8">
          <Link to="/" className="text-xl font-bold text-blue-600">SkillSwap</Link>
        </div>
        <nav className="flex flex-col space-y-2">
          <button
            className={`text-left px-4 py-2 rounded ${activeTab === 'connections' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('connections')}
          >
            Connections
          </button>
          <button
            className={`text-left px-4 py-2 rounded ${activeTab === 'requests' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 text-gray-800">
        <h1 className="text-2xl font-bold mb-6 capitalize text-blue-700">{activeTab}</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {activeTab === 'connections' && (
              <ul className="space-y-4">
                {connections.length === 0 ? (
                  <li className="text-gray-500">No connections found.</li>
                ) : (
                  connections.map((conn) => (
                    <li key={conn._id} className="bg-white p-4 rounded shadow">
                      <div className="font-semibold">{conn.recipient?.name || conn.recipient?.email}</div>
                      <div className="text-sm text-gray-500">Status: {conn.status}</div>
                    </li>
                  ))
                )}
              </ul>
            )}
            {activeTab === 'requests' && (
              <ul className="space-y-4">
                {requests.length === 0 ? (
                  <li className="text-gray-500">No requests found.</li>
                ) : (
                  requests.map((req) => (
                    <li key={req._id} className="bg-white p-4 rounded shadow">
                      <div className="font-semibold">{req.sender?.name || req.sender?.email}</div>
                      <div className="text-sm text-gray-500">Status: {req.status}</div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Connections;