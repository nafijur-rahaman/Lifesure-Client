// components/InsightHub.jsx
import { motion } from "framer-motion";
import { ArrowRight, UserCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/UseApi";
import { Link } from "react-router";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function InsightHub() {
  const { get, loading } = useApi();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await get("/api/get-blogs");
      if (res?.success) setBlogs(res.data);
    };
    fetchBlogs();
  }, []);

  const featuredArticle = blogs[0] || null;
  const recentArticles = blogs.slice(1, 4);

  return (
    <div className="bg-slate-50 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif">
            Insights to Guide Your Journey
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            Explore our curated articles and guides designed to provide clarity and confidence
            as you plan for your financial future.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start"
        >
          {/* Featured Article */}
          {loading ? (
            <div className="lg:col-span-2 rounded-3xl bg-slate-200 animate-pulse h-96" />
          ) : featuredArticle ? (
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/50 overflow-hidden group"
            >
              <div className="relative h-96">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 sm:p-10">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {featuredArticle.category}
                </span>
                <h3 className="mt-4 text-3xl font-semibold text-slate-900">
                  <a
                    href={`mailto:${featuredArticle.authorEmail}?subject=Blog Inquiry: ${featuredArticle.title}`}
                    className="hover:text-indigo-700 transition-colors"
                  >
                    {featuredArticle.title}
                  </a>
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {featuredArticle.content}
                </p>
                <div className="mt-6 flex items-center gap-x-6 text-sm text-slate-500">
                  <div className="flex items-center gap-x-2">
                    <UserCircle className="h-5 w-5" />
                    <span>{featuredArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{featuredArticle.visited} views</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Recent Articles */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-800">Recent Posts</h3>
            <div className="space-y-4">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-24 rounded-2xl bg-slate-200 animate-pulse"
                    />
                  ))
                : recentArticles.map((article) => (
                    <a
                      key={article._id}
                      href={`mailto:${article.authorEmail}?subject=Blog Inquiry: ${article.title}`}
                      className="group block p-6 rounded-2xl bg-white hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg font-semibold text-slate-900 group-hover:text-indigo-800 transition-colors">
                            {article.title}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">By {article.author}</p>
                        </div>
                        <ArrowRight className="h-6 w-6 text-slate-300 transition-all duration-300 group-hover:text-indigo-600 group-hover:translate-x-1 flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
            </div>
            {!loading && blogs.length > 0 && (
              <div className="pt-4">
                <Link
                  to="/blogs"
                  className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl font-semibold text-white px-8 py-3.5 shadow-lg hover:opacity-90 transition"
                >
                  Visit Our Full Blog
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
