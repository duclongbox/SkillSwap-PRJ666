// frontend/src/pages/Home.jsx
import Navbar from '../components/Navbar';
import SkillBox from '../components/SkillBox';

const Home = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold text-center mb-6 mt-4">Insert Slogan Here</h2>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search for any skills"
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-2 text-gray-700 text-sm">
        <div className="flex space-x-6">
          <span className="font-semibold text-black border-b-2 border-black pb-1">All Posts</span>
          <span className="cursor-pointer">Service options ▼</span>
          <span className="cursor-pointer">Seller Details ▼</span>
          <span className="cursor-pointer">Budget ▼</span>
          <span className="cursor-pointer">Delivery time ▼</span>
          <span className="font-semibold text-blue-600 cursor-pointer">Create listings</span>
        </div>
        <span className="cursor-pointer">Sort by ▼</span>
      </div>
      {/* Main content area can go here */}
        <SkillBox/>
      <div className="mt-8"></div>
    </div>
  </div>
);

export default Home;