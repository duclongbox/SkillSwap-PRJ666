import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Use VITE_API_BASE_URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateSkill = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [exchangeSkills, setExchangeSkills] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/skills`, {
        title,
        category,
        description,
        exchangeSkills: exchangeSkills.split(',').map(s => s.trim())
      }, {
        withCredentials: true
      });
      navigate('/'); // Redirect after successful submission
    } catch (err) {
      console.error(err); // helpful for debugging
      alert('Failed to create skill.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Skill Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-sm">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded text-gray-700"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded text-gray-700"
          />
          <input
            type="text"
            placeholder="Exchange using (comma separated)"
            value={exchangeSkills}
            onChange={(e) => setExchangeSkills(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded text-gray-700"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded text-gray-700 h-32"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Skill
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateSkill;
