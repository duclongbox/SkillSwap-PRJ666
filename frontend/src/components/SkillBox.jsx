import React, { useState, useEffect } from 'react';

const SkillBox = () => {
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

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
                  <h3>{skill.title || 'Untitled Skill'}</h3>
                  <p>{skill.description || 'No description provided'}</p>
                  {skill.owner_id && (
                    <div className="owner-info">
                      Added by: {skill.owner_id.name} ({skill.owner_id.email})
                    </div>
                  )}
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