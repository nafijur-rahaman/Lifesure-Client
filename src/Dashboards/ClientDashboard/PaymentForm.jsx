import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useApi } from "../../hooks/UseApi";
import { useNavigate } from "react-router";

const PaymentForm = ({ user, policy, applicationId, policyId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { post } = useApi();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // console.log("Policy:", policy);

  // console.log("policyId", policyId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const data = await post("/api/create-payment", {
        amount: policy.basePremium,
        policyName: policy.title,
        policyId: policyId,
        customerEmail: user.email,
      });

      //console.log("PaymentIntent response:", data);

      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { email: user.email },
          },
        }
      );

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const response = await post("/api/save-transaction", {
          paymentIntentId: paymentIntent.id,
          policyId: policyId,
          applicationId, // send applicationId here
          name: user.name,
          email: user.email,
        });

        if (response.success) {
          setSuccess(
            `Payment successful! Next payment due on ${new Date(
              response.data.nextPaymentDue
            ).toLocaleDateString()}`
          );
          setError(null);

          setTimeout(() => {
            navigate("/client-dashboard/my-payments");
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-medium">
          Card Details
        </label>
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
        {loading ? "Processing..." : `Pay ${policy?.basePremium} USD`}
      </button>

      {success && (
        <motion.div
          className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {success}
        </motion.div>
      )}
    </form>
  );
};

export default PaymentForm;
