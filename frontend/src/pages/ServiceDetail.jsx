import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasSentRequest, setHasSentRequest] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/skills/${id}`, { withCredentials: true })
      .then(res => setService(res.data))
      .catch(err => console.error('Error fetching skill:', err));

    axios.get(`${API_BASE_URL}/api/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, [id]);

  if (!service) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  const isAuthorized = currentUser &&
    (currentUser.id === (service.owner_id?._id || service.owner_id) || currentUser.role === 'admin');

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this skill?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/skills/${service._id}`, {
        withCredentials: true
      });
      alert('Skill deleted successfully');
      navigate('/skills');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete skill');
    }
  };

  const handleConnect = async () => {
    try {
      const recipientID = service.owner_id?._id;
      if (!recipientID) return;

      await axios.post(`${API_BASE_URL}/${recipientID}/sendRequest`, {}, {
        withCredentials: true
      });

      alert('Connection request sent!');
      setHasSentRequest(true);
    } catch (err) {
      console.error(err);
      alert('Error sending request: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Skill Details
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Learn more about this service and connect with the provider
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-16 -mt-8">
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{service.title || 'Untitled'}</h2>

          <p className="text-sm text-gray-700 mb-2"><strong>Category:</strong> {service.category}</p>
          <p className="text-sm text-gray-700 mb-2"><strong>Skill Level:</strong> {service.skillLevel}</p>
          <p className="text-sm text-gray-700 mb-2"><strong>Availability:</strong> {service.availability}</p>
          <p className="text-sm text-gray-700 mb-2"><strong>Duration:</strong> {service.duration}</p>
          <p className="text-sm text-gray-700 mb-2"><strong>Status:</strong> {service.isActive ? 'Active' : 'Inactive'}</p>
          <p className="text-sm text-gray-700 mb-2"><strong>Posted on:</strong> {new Date(service.createdAt).toLocaleDateString()}</p>
          <p className="text-sm text-gray-700 mb-6"><strong>Offered by:</strong> {service.owner_id?.email}</p>

          <p className="text-sm text-gray-700 mb-6"><strong>Exchange using:</strong> {Array.isArray(service.exchangeSkills) ? service.exchangeSkills.join(', ') : 'Not specified'}</p>

          <h3 className="text-blue-600 font-medium text-lg mb-2">Description</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap">
            {service.description}
          </pre>

          <div className="flex flex-wrap gap-4 mt-6">
            {currentUser && service.owner_id && currentUser.id !== service.owner_id._id && !hasSentRequest && (
              <button
                onClick={handleConnect}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-xl font-semibold shadow-md transform transition-all duration-200 hover:scale-105"
              >
                Connect
              </button>
            )}

            {isAuthorized && (
              <>
                {/* <button
                  onClick={() => navigate(`/skills/edit/${service._id}`)}
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white text-sm rounded-xl font-semibold shadow-md transform transition-all duration-200 hover:scale-105"
                >
                  Edit
                </button> */}
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl font-semibold shadow-md transform transition-all duration-200 hover:scale-105"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </section>

        <aside className="bg-white/80 backdrop-blur-sm border-l-4 border-gray-300 rounded-2xl p-6 text-sm text-gray-700 shadow-lg">
          <h3 className="text-gray-800 font-medium text-base mb-2">Filter by Category (coming soon)</h3>
          <p>You’ll be able to filter and search services by categories like Design, Coding, Language, etc.</p>
        </aside>
      </main>
    </div>
  );
};

export default ServiceDetail;
