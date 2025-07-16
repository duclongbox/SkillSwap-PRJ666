import React, { useState, useEffect } from 'react';

const SkillBox = () => {
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    
    // Temporary mock data for testing
const mockSkills = [
  {
    title: "React Development",
    description: "Building web applications with React",
    owner_id: {
      name: "John Doe",
      email: "john@example.com"
    }
  },
  {
    title: "GraphQL API Design",
    description: "Creating efficient GraphQL APIs",
    owner_id: {
      name: "Jane Smith",
      email: "jane@example.com"
    }
  }
];

// Then in your fetchSkills function:
const fetchSkills = async () => {
  try {
    // For testing, use mock data instead of fetch
    setAllSkills(mockSkills);
    setFilteredSkills(mockSkills);
    setIsLoading(false);
    
    // Comment out the actual fetch code temporarily
    /*
    const response = await fetch('/api/skills', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    // ... rest of your fetch code
    */
  } catch (err) {
    console.error('Error:', err);
    setError(err.message);
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
      const titleMatch = skill.title.toLowerCase().includes(term);
      const descMatch = skill.description && skill.description.toLowerCase().includes(term);
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
          Error loading skills: {error.message}
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
          <a href="HomePage.html" className="login-btn">Back to Home</a>
        </div>
      </div>

      <div className="container">
        <h1>All Skills</h1>
        
        {/* Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search skills by title or description..."
            onChange={(e) => filterSkills(e.target.value)}
          />
        </div>
        
        {/* Skills Container */}
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
                  <h3>{skill.title}</h3>
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