import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useApi } from "../../hooks/UseApi";

export default function UserReview() {
  const [reviews, setReviews] = useState([]);
  const { get, loading, error } = useApi();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await get("/api/reviews");
        if (data?.success) {
          setReviews(data.data);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const SkeletonCard = () => (
    <div className="relative bg-slate-50 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 animate-pulse h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full border-2 border-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="mt-6 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-yellow-200 rounded" />
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative bg-slate-50 pb-32 overflow-hidden">
      <div className="absolute inset-0  pointer-events-none"></div>

      {/* Header */}
      <div className="relative text-center mb-16 px-6">
        <h2 className="text-5xl font-extrabold text-center text-gray-900">
          What Our Clients Say
        </h2>
      </div>

      {/* Reviews */}
      <div className="relative max-w-7xl mx-auto z-10 px-4">
        {error && (
          <p className="text-center text-red-500">Failed to load reviews.</p>
        )}

        {!error && (
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {loading ? (
              // show 3 skeleton cards while loading
              [...Array(3)].map((_, i) => (
                <SwiperSlide key={i}>
                  <SkeletonCard />
                </SwiperSlide>
              ))
            ) : reviews.length === 0 ? (
              // empty state
              <p className="text-center text-gray-500 italic">
                No reviews yet. Be the first to share your experience!
              </p>
            ) : (
              // show real reviews
              reviews.map((review) => (
                <SwiperSlide key={review._id}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-white rounded-3xl p-8  transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={
                          review.userImage ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={review.userName || "Anonymous"}
                        className="w-16 h-16 rounded-full border-2 border-blue-100 object-cover shadow-sm"
                      />
                      <div>
                        <h4 className="text-gray-800 font-semibold text-lg">
                          {review.userName || "Anonymous User"}
                        </h4>
                        <p className="text-blue-600 text-sm font-medium">
                          {review.policyTitle || "Valued Client"}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 italic leading-relaxed flex-1">
                      “{review.feedback || "No feedback provided."}”
                    </p>

                    <div className="mt-6 flex gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          fill={
                            i < (review.rating || 5) ? "currentColor" : "none"
                          }
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          className="w-4 h-4"
                        >
                          <path d="M12 .587l3.668 7.425 8.2 1.193-5.934 5.782 1.4 8.168L12 18.896l-7.334 3.859 1.4-8.168L.132 9.205l8.2-1.193z" />
                        </svg>
                      ))}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        )}
      </div>
    </section>
  );
}
