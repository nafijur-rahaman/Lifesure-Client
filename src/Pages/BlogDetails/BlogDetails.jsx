import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";

// Fake API
const fetchBlogById = (id) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        title: "How to Choose the Best Life Insurance",
        author: "John Doe",
        authorImage: "https://i.pravatar.cc/40?img=32",
        date: "2025-09-19",
        totalVisits: 102,
        category: "Insurance",
        image: "https://picsum.photos/800/400?random=1",
        content: `
Choosing the right life insurance policy can be overwhelming. Here’s a full guide to help you make the right decision for your family’s future. 

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus mauris vitae sapien efficitur, id cursus arcu vulputate. 

Vivamus lacinia libero at tellus ultricies, non pulvinar nulla tempus.
        `,
      });
    }, 500);
  });

// Fake API for top posts
const fetchAllBlogs = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 2, title: "Top Health Insurance Tips", category: "Health", visits: 76, image: "https://picsum.photos/400/200?random=2" },
        { id: 3, title: "Financial Planning with Insurance", category: "Finance", visits: 58, image: "https://picsum.photos/400/200?random=3" },
        { id: 4, title: "Understanding Term Life Insurance", category: "Insurance", visits: 120, image: "https://picsum.photos/400/200?random=4" },
      ]);
    }, 500);
  });

export default function FullyAnimatedBlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchBlogById(id).then((data) => {
      if (!data) return navigate("/blogs");
      setBlog({ ...data, totalVisits: data.totalVisits + 1 });
    });
    fetchAllBlogs().then((blogs) => setAllBlogs(blogs));
  }, [id, navigate]);

  if (!blog) return <p className="text-center mt-20">Loading...</p>;

  const categoryColors = {
    Insurance: "bg-indigo-600",
    Health: "bg-green-500",
    Finance: "bg-orange-500",
    default: "bg-gray-500",
  };

  const topPosts = allBlogs.filter(b => selectedCategory === "All" || b.category === selectedCategory);

  // Variants for staggered content
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50 min-h-screen">
      {/* Floating background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 font-semibold hover:underline">
            ← Back to Blogs
          </button>

          {/* Featured Image with animation */}
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="relative rounded-3xl overflow-hidden mb-6 shadow-lg">
            <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover" />
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md transition-transform transform hover:scale-110 ${
                categoryColors[blog.category] || categoryColors.default
              }`}
            >
              {blog.category}
            </motion.span>
          </motion.div>

          {/* Glassmorphism wrapper with staggered content */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants} className="backdrop-blur-md bg-white/70 rounded-3xl p-8 shadow-xl mb-12">
            <motion.h1 variants={itemVariants} className="text-4xl font-extrabold text-gray-900 mb-6">{blog.title}</motion.h1>

            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 text-gray-700">
              <div className="flex items-center gap-3">
                <img src={blog.authorImage} alt={blog.author} className="w-10 h-10 rounded-full" />
                <span className="font-semibold">{blog.author}</span>
              </div>
              <div className="text-sm">
                <span>{blog.date} | </span>
                <span>{blog.totalVisits} visits</span>
              </div>
            </motion.div>

            {blog.content.split("\n").map((para, idx) => (
              <motion.p key={idx} variants={itemVariants} className="prose prose-lg text-gray-800 mb-4">{para}</motion.p>
            ))}
          </motion.div>
        </div>

        {/* Animated Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-32 space-y-8">
          {/* Categories */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Categories</h3>
            {["All", "Insurance", "Health", "Finance"].map((cat) => (
              <motion.button key={cat} variants={itemVariants} className={`block w-full text-left px-3 py-2 mb-2 rounded-md font-semibold transition ${selectedCategory===cat?'bg-indigo-600 text-white':'hover:bg-indigo-50 text-gray-800'}`} onClick={()=>setSelectedCategory(cat)}>
                {cat}
              </motion.button>
            ))}
          </motion.div>

          {/* Top Posts */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={containerVariants} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Top Posts</h3>
            <div className="space-y-4">
              {topPosts.map(post => (
                <motion.div key={post.id} variants={itemVariants} whileHover={{ scale:1.03 }} onClick={()=>navigate(`/blogs/${post.id}`)} className="flex gap-3 items-center cursor-pointer transition transform rounded-lg overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{post.title}</p>
                    <p className="text-sm text-gray-500">{post.visits} visits</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.6, delay:0.6 }} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transform transition cursor-pointer">
            Get a Quote
          </motion.div>
        </div>
      </div>
    </section>
  );
}
