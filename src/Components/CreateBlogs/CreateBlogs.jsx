import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useApi } from "../../hooks/UseApi";
import useAuth from "../../hooks/UseAuth";
import { useNavigate } from "react-router";
import useUserRole from "../../hooks/UserRole";

export default function CreateBlogs() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { post, put } = useApi(); // 👈 need both

  // Upload image with progress feedback
  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_BB_KEY}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            Swal.update({
              title: "Uploading Image...",
              text: `Progress: ${percent}%`,
            });
          },
        }
      );
      return res?.data?.data?.url || "";
    } catch (err) {
      Swal.fire("Upload Failed", "Could not upload image", "error");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: "Creating Blog...",
      text: "We are preparing your blog. Please wait...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // Create blog first (optimistic insert)
      const blogData = {
        title,
        category,
        content,
        image: "", // empty for now
        authorImg: user?.photoURL,
        authorEmail: user?.email,
        author: user?.displayName,
        userId: user?.uid,
        date: new Date().toISOString().split("T")[0],
      };

      const res = await post("/api/create-blog", blogData);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to create blog");
      }

      const blogId = res.blogId;

      // Upload image after blog creation
      if (image) {
        const imageUrl = await uploadImage(image);

        if (imageUrl) {
          await put(`/api/update-blog/${blogId}`, { image: imageUrl });
        }
      }

      setLoading(false);
      Swal.close();
      Swal.fire("Success", "Blog created successfully!", "success");

      // Reset form
      setTitle("");
      setCategory("");
      setContent("");
      setImage(null);

      // Navigate
      if (role === "agent") {
        navigate("/agent-dashboard/manage-blogs");
      } else {
        navigate("/admin-dashboard/manage-blogs");
      }
    } catch (err) {
      setLoading(false);
      Swal.close();
      Swal.fire("Error", err.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Blog Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Blog Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          >
            <option value="">Select Category</option>
            <option value="insurance">Life Insurance</option>
            <option value="health">Health Insurance</option>
            <option value="finance">Business Insurance</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none h-40"
            placeholder="Write your blog content here..."
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Featured Image
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-gray-700"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
