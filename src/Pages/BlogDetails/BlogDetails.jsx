import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useApi } from "../../hooks/UseApi";
import Loading from "../../Components/Loader/Loader";

export default function FullyAnimatedBlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get } = useApi();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, blogsRes] = await Promise.all([
          get(`/api/get-blog/${id}`),
          get("/api/get-blogs"),
        ]);

        if (!blogRes.success) return navigate("/blogs");
        setBlog(blogRes.data);
        if (blogsRes.success) setAllBlogs(blogsRes.data);
      } catch (err) {
        console.error("Error fetching blog data:", err);
        navigate("/blogs");
      }
    };
    fetchData();
  }, [id, navigate, get]);


  const topPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return allBlogs.filter((b) => b._id !== blog?._id);
    }
    return allBlogs.filter(
      (b) =>
        b.category?.toLowerCase() === selectedCategory.toLowerCase() &&
        b._id !== blog?._id
    );
  }, [selectedCategory, allBlogs, blog?._id]);


  if (!blog) return <Loading />;


  const categoryColors = {
    insurance: "bg-indigo-600",
    health: "bg-green-500",
    finance: "bg-orange-500",
    default: "bg-gray-500",
  };

 
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50 min-h-screen">
      {/* Background orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-indigo-600 font-semibold hover:underline"
          >
            ← Back to Blogs
          </button>

          {/* Featured Image */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden mb-6 shadow-lg"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md ${
                categoryColors[blog.category?.toLowerCase()] ||
                categoryColors.default
              }`}
            >
              {blog.category}
            </motion.span>
          </motion.div>

          {/* Blog Content */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="backdrop-blur-md bg-white/70 rounded-3xl p-8 shadow-xl mb-12"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-extrabold text-gray-900 mb-6"
            >
              {blog.title}
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-8 text-gray-700"
            >
              <div className="flex items-center gap-3">
                <img
                  src={blog.authorImg}
                  alt={blog.author}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">{blog.author}</span>
              </div>
              <div className="text-sm">
                <span>{blog.date}</span>
              </div>
            </motion.div>

            {blog.content?.split("\n").map((para, idx) => (
              <motion.p
                key={idx}
                variants={itemVariants}
                className="prose prose-lg text-gray-800 mb-4"
              >
                {para}
              </motion.p>
            ))}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-32 space-y-8">
          {/* Categories */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg relative z-20"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900">Categories</h3>
            {["All", ...new Set(allBlogs.map((b) => b.category))].map((cat) => (
              <motion.button
                key={cat}
                variants={itemVariants}
                className={`block w-full text-left px-3 py-2 mb-2 rounded-md font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-50 text-gray-800"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>

          {/* Top Posts */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg relative z-20"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900">Top Posts</h3>
            <div className="space-y-4">
              {topPosts.length === 0 && (
                <p className="text-gray-500">No posts found.</p>
              )}
              {topPosts.map((post) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(`/blogs/${post._id}`)}
                  className="flex gap-3 items-center cursor-pointer transition rounded-lg overflow-hidden bg-white/90 hover:bg-white p-2"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {post.title}
                    </p>
                    <p className="text-sm text-gray-500">{post.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
