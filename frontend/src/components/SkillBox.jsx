import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';


const SkillBox = () => {
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const { user } = useAuth();

  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Use absolute URL with environment variable
        const response = await fetch(`${backendUrl}/api/skills`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        setAllSkills(data);
        setFilteredSkills(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Full error:', err);
        setError(`Network error: ${err.message}. Please ensure the backend is running.`);
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const filterSkills = (searchTerm) => {
    if (!searchTerm) {
      setFilteredSkills(allSkills);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allSkills.filter(skill => {
      const titleMatch = skill.title?.toLowerCase().includes(term);
      const descMatch = skill.description?.toLowerCase().includes(term);
      return titleMatch || descMatch;
    });

    setFilteredSkills(filtered);
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading skills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          Error loading skills: {error}
          <button onClick={handleReload}>Try Again</button>
        </div>
      </div>
    );
  }
  const handleConnect = async (recipientID) => {
    try {
      const response = await fetch(`${backendUrl}/${recipientID}/sendRequest`, {
        method: 'POST',
        credentials: 'include', // if using cookies/session
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if using JWT
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to send connection request');
        return;
      }
      alert('Connection request sent!');
      setSentRequests(prev => [...prev, recipientID]); 
    } catch (err) {
      alert('Error sending connection request: ' + err.message);
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo">SkillSwap</div>
        <div className="nav-links">
          <a href="/" className="login-btn">Back to Home</a>
        </div>
      </div>

      <div className="container">

        <div className="search-container">
          <input
            type="text"
            id="search-input"
            placeholder="Search skills by title or description..."
            onChange={(e) => filterSkills(e.target.value)}
          />
        </div>

        <div id="skills-container">
          {filteredSkills.length === 0 ? (
            allSkills.length === 0 ? (
              <div className="no-skills">No skills available yet.</div>
            ) : (
              <div className="no-results">No skills match your search.</div>
            )
          ) : (
            <div className="skills-grid">
              {filteredSkills.map((skill, index) => (
                <div className="skill-card" key={index}>
                  <h3 className="text-xl font-semibold text-blue-900">{skill.title || 'Untitled Skill'}</h3>
                  <p className="text-gray-700">{skill.description || 'No description provided'}</p>
                  {/* Owner info and Connect button in a row */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="owner-info text-gray-500 text-sm">
                      Added by: {skill.owner_id.name} ({skill.owner_id.email})
                    </div>
                    {user && skill.owner_id && user._id !== skill.owner_id._id && !sentRequests.includes(skill.owner_id._id) && (
                      <button
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                        onClick={() => handleConnect(skill.owner_id._id)}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        .search-container {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }
        #search-input {
          width: 60%;
          max-width: 500px;
          padding: 12px 20px;
          border: 1px solid #ddd;
          border-radius: 25px;
          font-size: 16px;
          outline: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        #search-input:focus {
          border-color: #4a90e2;
          box-shadow: 0 2px 10px rgba(74, 144, 226, 0.2);
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 10px;
        }
        .skill-card {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .skill-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .skill-card h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        .skill-card p {
          color: #666;
        }
        .owner-info {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          font-size: 0.9em;
          color: #7f8c8d;
        }
        .loading {
          text-align: center;
          padding: 20px;
        }
        .error {
          color: #e74c3c;
          padding: 20px;
          text-align: center;
          background-color: #fdecea;
          border-radius: 8px;
        }
        .error button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .no-skills {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        .no-results {
          text-align: center;
          padding: 20px;
          color: #666;
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
};

export default SkillBox;