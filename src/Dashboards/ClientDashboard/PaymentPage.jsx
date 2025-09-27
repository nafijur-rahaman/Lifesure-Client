import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router";
import { useApi } from "../../hooks/UseApi";
import PaymentForm from "./PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";

// Replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function PaymentPage() {
  const { id } = useParams();
  const { get } = useApi();
  const [application, setApplication] = useState(null);

  // Fetch application info
  useEffect(() => {
    const fetchApplication = async () => {
      const data = await get(`/api/get-application/${id}`);
      if (data?.success) {
        setApplication(data.data);
      }
    };
    fetchApplication();
  }, [id]);

  if (!application) {
    return (
      <div className="p-6 text-gray-600 text-center">
        Loading application...
      </div>
    );
  }

  // console.log(application)

  const {
    name,
    email,
    address,
    phone,
    nomineeName,
    nomineeRelation,
    status,
    payment,
    policyDetails,
    policy_id
  } = application;


  return (
    <Elements stripe={stripePromise}>
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          💳 Payment Page
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">
              Applicant Information
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Name:</span> {name}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Email:</span> {email}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Phone:</span> {phone}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Address:</span> {address}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Nominee:</span> {nomineeName} (
              {nomineeRelation})
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {status}
              </span>
            </p>
          </motion.div>

          {/* Policy Info */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Policy Information</h3>
            <img
              src={policyDetails.image}
              alt={policyDetails.title}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Title:</span>{" "}
              {policyDetails.title}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Category:</span>{" "}
              {policyDetails.category}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Coverage:</span>{" "}
              {policyDetails.coverage}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Duration:</span>{" "}
              {policyDetails.duration} years
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Premium:</span> ₹
              {policyDetails.basePremium}
            </p>
          </motion.div>
        </div>

        {/* Payment Info */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Status:</span> {payment.status}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Amount:</span> ₹{payment.amount}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Frequency:</span>{" "}
            {payment.frequency}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Next Due:</span>{" "}
            {new Date(payment.nextPaymentDue).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Payment Form */}
        {payment.status === "Due" && (
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Make Payment</h3>
            <PaymentForm
              user={{ name, email }}
              policy={policyDetails}
              applicationId={application._id}
              policyId={ policy_id}
            />
          </motion.div>
        )}
      </div>
    </Elements>
  );
}
