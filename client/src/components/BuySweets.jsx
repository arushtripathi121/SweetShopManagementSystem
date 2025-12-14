import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { api } from "../hooks/api";

import { useBuySweet } from "../context/BuySweetContext";
import { useAuth } from "../context/AuthContext";

const BuySweets = () => {
  const { buyOpen, setBuyOpen, selectedSweetId } = useBuySweet();
  const { user, setAuthOpen } = useAuth();

  const [sweet, setSweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  

  // Fetch selected sweet details whenever the modal opens
  const fetchSweet = useCallback(async () => {
    if (!selectedSweetId) return;

    setLoading(true);
    try {
      const res = await api.get(`/sweet/${selectedSweetId}`);
      setSweet(res.data.sweet);
    } finally {
      setLoading(false);
    }
  }, [selectedSweetId]);

  // Whenever Buy Modal opens → reset fields + load sweet
  useEffect(() => {
    if (buyOpen) {
      setQty(1);
      setMessage("");
      fetchSweet();
    }
  }, [buyOpen, fetchSweet]);

  // Price × Quantity (memoized to avoid recalculating)
  const totalAmount = useMemo(
    () => (sweet ? sweet.price * qty : 0),
    [sweet, qty]
  );

  // Increment quantity (cannot go above available stock)
  const increaseQty = useCallback(() => {
    if (!sweet) return;

    if (qty >= sweet.quantity) {
      setMessage(`Only ${sweet.quantity} kg available.`);
      return;
    }

    setQty(qty + 1);
    setMessage("");
  }, [qty, sweet]);

  // Decrement quantity (cannot go below 1)
  const decreaseQty = useCallback(() => {
    if (qty > 1) {
      setQty(qty - 1);
      setMessage("");
    }
  }, [qty]);

  // Handles the purchase API call
  const handlePurchase = useCallback(async () => {
    try {
      const res = await api.post(`/inventory/${selectedSweetId}/purchase`, {
        quantity: qty
      });

      setMessage("Order Placed Successfully");
      setSweet(res.data.sweet); // update stock after purchase
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to place order");
    }
  }, [qty, selectedSweetId]);

  return (
    <AnimatePresence>
      {buyOpen && (
        <motion.div
          // Background overlay fade-in
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
          onClick={() => setBuyOpen(false)}
        >
          <motion.div
            // Modal entrance animation
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative font-poppins"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close Button */}
            <button
              onClick={() => setBuyOpen(false)}
              className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-black"
            >
              <IoClose />
            </button>

            {/* Loader while fetching sweet */}
            {loading || !sweet ? (
              <div className="text-center py-10 text-lg font-medium">
                Loading Checkout...
              </div>
            ) : (
              <div className="space-y-7">

                {/* Title */}
                <div className="text-center">
                  <div className="text-3xl font-bold">Checkout</div>
                  <div className="text-gray-500 text-sm">
                    Review your order before confirming
                  </div>
                </div>

                {/* Sweet Summary */}
                <div className="bg-gray-100 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5">
                  <img
                    src={sweet.image}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow"
                    alt={sweet.name}
                  />

                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-xl font-semibold">{sweet.name}</div>
                      <div className="text-sm text-gray-600">{sweet.category}</div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 mt-2 rounded-lg text-xs font-medium w-fit">
                        <FaStar className="text-xs" /> {sweet.rating?.toFixed(1)}
                      </div>
                    </div>

                    <div className="text-2xl font-bold">₹{sweet.price}</div>
                  </div>
                </div>

                {/* Quantity Selection */}
                {sweet.quantity > 0 ? (
                  <div className="bg-gray-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium">Select Quantity</div>
                      <div className="text-sm text-gray-600">
                        {sweet.quantity} kg available
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Decrease */}
                      <button
                        onClick={decreaseQty}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center text-lg"
                      >
                        <FaMinus />
                      </button>

                      {/* Current Qty */}
                      <div className="text-xl font-semibold">{qty} kg</div>

                      {/* Increase */}
                      <button
                        onClick={increaseQty}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center text-lg"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    {/* Error message when exceeding stock */}
                    {message && (
                      <div className="text-red-600 text-sm font-medium text-center">{message}</div>
                    )}
                  </div>
                ) : (
                  // If out of stock
                  <div className="text-red-600 text-center font-bold text-lg">
                    Out of Stock
                  </div>
                )}

                {/* Price Summary Box */}
                <div className="bg-gray-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Item Price</span>
                    <span>₹{sweet.price}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Quantity</span>
                    <span>{qty} kg</span>
                  </div>

                  <div className="flex justify-between text-black font-semibold border-t pt-3 text-lg">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                {/* Footer Actions */}
                {user?.role === "admin" ? (
                  <div className="w-full py-3 text-center font-semibold text-red-600">
                    Admin cannot order.
                  </div>
                ) : user ? (
                  <button
                    onClick={handlePurchase}
                    className="w-full py-3 rounded-2xl bg-black text-white text-lg font-semibold hover:bg-gray-900 active:scale-95 transition"
                  >
                    Place Order
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setBuyOpen(false);
                      setAuthOpen(true);
                    }}
                    className="w-full py-3 rounded-2xl bg-red-600 text-white text-lg font-semibold hover:bg-red-700 active:scale-95 transition"
                  >
                    Login First
                  </button>
                )}

                {/* Purchase result message */}
                {message && sweet.quantity > 0 && (
                  <div className="text-center text-black font-medium mt-2">{message}</div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuySweets;
