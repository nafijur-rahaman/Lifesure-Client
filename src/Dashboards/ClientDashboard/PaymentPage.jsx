import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";

// Replace with your publishable key
const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXX");

const PaymentForm = ({ user, policy }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    // Create Stripe token
    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError(null);
      console.log("Stripe token:", token);

      // TODO: Send token and policy info to backend to process payment and update DB
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        console.log("Payment success: update DB & activate policy here");
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-medium">Card Details</label>
        <div className="border rounded-lg p-3">
          <CardElement />
        </div>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition w-full"
      >
        {loading ? "Processing..." : `Pay ${policy.premium}`}
      </button>

      {success && (
        <motion.div
          className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Payment successful! ✅ Your policy is now active.
        </motion.div>
      )}
    </form>
  );
};

export default function PaymentPage() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
  };

  const policy = {
    name: "Term Life Insurance",
    coverage: "20 Lakh",
    duration: "20 Years",
    premium: "₹1,200/month",
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">💳 Payment Page</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">User Information</h3>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Name:</span> {user.name}</p>
            <p className="text-gray-600"><span className="font-semibold">Email:</span> {user.email}</p>
          </motion.div>

          {/* Policy Info */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Policy Information</h3>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Policy:</span> {policy.name}</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Coverage:</span> {policy.coverage}</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Duration:</span> {policy.duration}</p>
            <p className="text-gray-600"><span className="font-semibold">Premium:</span> {policy.premium}</p>
          </motion.div>
        </div>

        {/* Payment Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
          <PaymentForm user={user} policy={policy} />
        </motion.div>
      </div>
    </Elements>
  );
}
