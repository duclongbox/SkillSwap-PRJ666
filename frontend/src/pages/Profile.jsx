import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    skills: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      console.log('User object:', user); // Debug log
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const userId = user.id || user._id; // Handle both possible ID formats
      const url = `${API_BASE_URL}/api/users/${userId}`;
      
      console.log('Fetching profile from:', url); // Debug log
      console.log('User ID being used:', userId); // Debug log
      
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Response status:', response.status); // Debug log
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Profile data received:', userData); // Debug log
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          skills: userData.skills || []
        });
        setMessage(''); // Clear any previous error messages
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage(`Failed to load profile data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills') {
      setProfileData(prev => ({
        ...prev,
        skills: value.split(',').map(skill => skill.trim()).filter(Boolean)
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const userId = user.id || user._id;
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setMessage('✅ Profile updated successfully!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('❌ Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-800">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isEditing 
                  ? 'bg-gray-500 text-white hover:bg-gray-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 text-lg">{profileData.name || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 text-lg">{profileData.email || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="skills"
                  value={profileData.skills.join(', ')}
                  onChange={handleInputChange}
                  placeholder="Enter skills separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills added yet</p>
                  )}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

