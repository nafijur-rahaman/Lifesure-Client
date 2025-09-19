import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Fake API
const fetchBlogs = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "How to Choose the Best Life Insurance",
          details: "Choosing the right life insurance policy can be overwhelming. Here’s a quick guide to help you make the right decision for your family’s future.",
          author: "John Doe",
          authorImage: "https://i.pravatar.cc/40?img=32",
          date: "2025-09-19",
          totalVisits: 102,
          fullContent: "Full detailed content about life insurance with examples, tips, and best practices...",
          category: "Insurance",
        },
        {
          id: 2,
          title: "Top Health Insurance Tips",
          details: "Health insurance is essential. Learn the top tips for selecting a policy that fits your needs and budget.",
          author: "Sarah Smith",
          authorImage: "https://i.pravatar.cc/40?img=47",
          date: "2025-09-15",
          totalVisits: 76,
          fullContent: "Full detailed content about health insurance including case studies, tips, and FAQs...",
          category: "Health",
        },
        {
          id: 3,
          title: "Financial Planning with Insurance",
          details: "Insurance can be a key tool for financial planning. Discover strategies for securing your finances.",
          author: "Michael Brown",
          authorImage: "https://i.pravatar.cc/40?img=12",
          date: "2025-09-10",
          totalVisits: 58,
          fullContent: "Full detailed content about financial planning using insurance policies, tips, and examples...",
          category: "Finance",
        },
        // Add more blogs as needed
      ]);
    }, 1000);
  });

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchBlogs().then((data) => setBlogs(data));
  }, []);

  const filteredBlogs =
    category === "All" ? blogs : blogs.filter((b) => b.category === category);

  const handleReadMore = (blogId) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId ? { ...b, totalVisits: b.totalVisits + 1 } : b
      )
    );
    const blog = blogs.find((b) => b.id === blogId);
    setSelectedBlog(blog);
  };

  const closeModal = () => setSelectedBlog(null);

  const categories = ["All", "Insurance", "Health", "Finance"];

  // Badge color mapping
  const categoryColors = {
    Insurance: "bg-indigo-600",
    Health: "bg-green-500",
    Finance: "bg-orange-500",
    default: "bg-gray-500",
  };

  return (
    <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-gray-900">
          Our Blogs
        </h2>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full border transition ${
                category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white border-gray-300 text-gray-800 hover:bg-indigo-50"
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Blog */}
        {filteredBlogs.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-10 relative rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={() => handleReadMore(filteredBlogs[0].id)}
          >
            <img
              src={`https://picsum.photos/800/400?random=${filteredBlogs[0].id}`}
              alt={filteredBlogs[0].title}
              className="w-full h-80 object-cover"
            />

            {/* Featured Category Badge */}
            <span
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md transition-transform transform group-hover:scale-105 ${
                categoryColors[filteredBlogs[0].category] || categoryColors.default
              }`}
            >
              {filteredBlogs[0].category}
            </span>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-3xl font-bold text-white mb-2">
                {filteredBlogs[0].title}
              </h3>
              <div className="flex items-center justify-between text-white text-sm">
                <span>{filteredBlogs[0].author}</span>
                <span>{filteredBlogs[0].date}</span>
                <span>{filteredBlogs[0].totalVisits} visits</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.slice(1).map((blog) => (
            <motion.div
              key={blog.id}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 50px rgba(59,130,246,0.25)",
              }}
              className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden border border-gray-200 flex flex-col"
            >
              {/* Category Badge */}
              <span
                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md transition-transform transform hover:scale-105 ${
                  categoryColors[blog.category] || categoryColors.default
                }`}
              >
                {blog.category}
              </span>

              <img
                src={`https://picsum.photos/400/200?random=${blog.id}`}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {blog.title}
                </h3>
                <p className="text-gray-700 mb-4">{blog.details}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={blog.authorImage}
                      alt={blog.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-900 font-semibold">{blog.author}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{blog.date}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gray-500 text-sm">{blog.totalVisits} visits</span>
                  <button
                    onClick={() => handleReadMore(blog.id)}
                    className="text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-4 rounded-xl hover:scale-105 transition-transform"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedBlog && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl max-w-2xl w-full p-8 relative"
              >
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 text-gray-600 font-bold text-xl hover:text-gray-900"
                >
                  ×
                </button>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{selectedBlog.title}</h3>
                <p className="text-gray-700 mb-4">{selectedBlog.fullContent}</p>
                <button
                  onClick={() => window.location.href = `/blogs/${selectedBlog.id}`}
                  className="mt-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-4 rounded-xl hover:scale-105 transition-transform"
                >
                  Go to Blog Details Page
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
