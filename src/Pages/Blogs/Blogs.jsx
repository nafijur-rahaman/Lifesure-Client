import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "../../hooks/UseApi";
import Loading from "../../Components/Loader/Loader";

export default function Blogs() {
  const { get, post } = useApi();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingBlogId, setLoadingBlogId] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // fixed categories
  const categories = ["all", "insurance", "health", "finance"];

  const categoryColors = {
    insurance: "bg-indigo-600",
    health: "bg-green-500",
    finance: "bg-orange-500",
    default: "bg-gray-500",
  };

  const fetchBlogs = async (currentPage = 1, currentCategory = "all") => {
    setLoading(true);
    try {
      const res = await get(
        `/api/get-blogs?page=${currentPage}&limit=9&category=${currentCategory}`
      );
      if (res.success) {
        const normalized = res.data.map((b) => ({
          ...b,
          category: b.category.toLowerCase(),
        }));
        setBlogs(normalized);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      // console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page, category);
  }, [page, category]);

  const handleOpenModal = async (blog) => {
    // console.log("Opening modal for blog:", blog);

    setLoadingBlogId(blog._id);
    try {
      await post(`/api/increment-visit/${blog._id}`);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blog._id ? { ...b, visited: (b.visited || 0) + 1 } : b
        )
      );
      setSelectedBlog({ ...blog, visited: (blog.visited || 0) + 1 });
    } catch (err) {
      // console.error("Failed to increment visit count:", err);
    } finally {
      setLoadingBlogId(null);
    }
  };

  const handleGoToBlog = (blogId) => {
    window.location.href = `/blog/${blogId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <section className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-gray-900">
          Our Blogs
        </h2>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full border capitalize transition ${
                category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white border-gray-300 text-gray-800 hover:bg-indigo-50"
              }`}
              onClick={() => {
                setCategory(cat);
                setPage(1); // reset page when changing category
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* No blogs */}
        {blogs.length === 0 && (
          <div className="text-center text-gray-500 text-xl py-20">
            No blog data available.
          </div>
        )}

        {/* Featured Blog (top big card) */}
        {blogs.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-10 relative rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={() => handleOpenModal(blogs[0])}
          >
            <img
              src={blogs[0].image}
              alt={blogs[0].title}
              className="w-full h-80 object-cover"
            />
            <span
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md ${
                categoryColors[blogs[0].category] || categoryColors.default
              }`}
            >
              {blogs[0].category}
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-3xl font-bold text-white mb-2">
                {blogs[0].title}
              </h3>
              <div className="flex items-center justify-between text-white text-sm">
                <span>{blogs[0].author}</span>
                <span>{blogs[0].date}</span>
              </div>
              <div className="text-sm text-gray-200 mt-1">
                👁 {blogs[0].visited || 0} views
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid (rest of the blogs from this page) */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.slice(1).map((blog) => (
            <motion.div
              key={blog._id}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 50px rgba(59,130,246,0.25)",
              }}
              className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden border border-gray-200 flex flex-col"
            >
              {/* ... your existing card content ... */}
              <span
                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                  categoryColors[blog.category] || categoryColors.default
                }`}
              >
                {blog.category}
              </span>
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {blog.title}
                </h3>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {blog.content}
                </p>
                <div className="text-sm text-gray-600 mb-4">
                  👁 {blog.visited || 0} views
                </div>
                <div className="flex justify-end mt-auto">
                  <button
                    onClick={() => handleOpenModal(blog)}
                    disabled={loadingBlogId === blog._id}
                    className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-4 rounded-xl hover:scale-105 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingBlogId === blog._id ? "Loading..." : "Read More"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
<AnimatePresence>
  {selectedBlog && (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl max-w-3xl w-full p-8 relative overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedBlog(null)}
          className="absolute top-4 right-4 text-gray-600 font-bold text-xl hover:text-gray-900"
        >
          ×
        </button>

        {/* Blog Header */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={selectedBlog.image}
            alt={selectedBlog.title}
            className="w-full md:w-1/2 h-60 object-cover rounded-2xl shadow-md"
          />
          <div className="flex flex-col justify-between flex-1">
            <div>
              <span
                className={`inline-block px-3 py-1 mb-3 rounded-full text-sm font-semibold text-white ${
                  categoryColors[selectedBlog.category] ||
                  categoryColors.default
                }`}
              >
                {selectedBlog.category}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedBlog.title}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedBlog.authorImg}
                  alt={selectedBlog.author}
                  className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedBlog.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedBlog.authorEmail}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 flex justify-between items-center">
              <span>📅 {selectedBlog.date}</span>
              <span>👁 {selectedBlog.visited || 0} views</span>
            </div>
          </div>
        </div>

        {/* Blog Content Preview */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-gray-700 leading-relaxed line-clamp-5">
            {selectedBlog.content}
          </p>
        </div>

        {/* Go to Blog Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => handleGoToBlog(selectedBlog._id)}
            className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-6 rounded-xl hover:scale-105 transition-transform shadow-md"
          >
            Read Full Blog
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </section>
  );
}
