import Navbar from '../components/Navbar';

const ServiceDetail = ({ service }) => {
  // Dummy fallback data if no props are passed
  const mockService = {
    title: 'Guitar Lessons for Beginners',
    category: 'Music',
    seller: 'JaneDoe123',
    skillsRequired: ['Cooking', 'Web Design'],
    description: 'I will teach you the basics of playing acoustic guitar. Bring your own instrument!',
  };

  const data = service || mockService; // use real service if passed

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto py-10 px-4">
        <section className="bg-white p-8 rounded-md shadow-sm mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{data.title}</h2>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Category:</strong> {data.category}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Offered by:</strong> {data.seller}
          </p>
          <p className="text-sm text-gray-700 mb-6">
            <strong>Exchange using:</strong> {data.skillsRequired.join(', ')}
          </p>

          <h3 className="text-blue-600 font-medium text-lg mb-2">Description</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap">
            {data.description}
          </pre>

          <button className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded shadow-sm">
            Send Skill Offer
          </button>
        </section>

        <aside className="bg-white border-l-4 border-gray-300 rounded-md p-6 text-sm text-gray-700">
          <h3 className="text-gray-800 font-medium text-base mb-2">
            Filter by Category (coming soon)
          </h3>
          <p>
            You’ll be able to filter and search services by categories like Design, Coding, Language, etc.
          </p>
        </aside>
      </main>
    </div>
  );
};

export default ServiceDetail;
