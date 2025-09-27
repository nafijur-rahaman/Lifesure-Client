import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useApi } from "../../hooks/UseApi";
import useAuth from "../../hooks/UseAuth";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useAuth();

  const { post, loading } = useApi();

  // Upload image to imgbb
  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_BB_KEY
        }`,
        formData
      );
      return res?.data?.data?.url || "";
    } catch (err) {
      Swal.fire("Upload Failed", "Could not upload image", "error");
      return "";
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const imageUrl = await uploadImage(image);

    const blogData = {
      title,
      category,
      content,
      image: imageUrl,
      authorImg: user?.photoURL,
      author: user?.displayName,
      userId: user?.uid, 
      date: new Date().toISOString().split("T")[0],
    };

    const res = await post("/api/create-blog", blogData);

    if (res?.success) {
      Swal.fire("Success", "Blog created successfully!", "success");
      setTitle("");
      setCategory("");
      setContent("");
      setImage(null);
    } else {
      Swal.fire("Error", res?.message || "Failed to create blog", "error");
    }
  } catch (err) {
    Swal.fire("Error", "Something went wrong", "error");
  }
};


  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72">
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
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Blog"}
        </button>
      </form>
    </div>
  );
}
