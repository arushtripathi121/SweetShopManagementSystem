import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { api } from "../hooks/api";
import { useUser } from "../context/UserContext";

const BuySweets = () => {
  const {
    buyOpen,
    setBuyOpen,
    selectedSweetId,
    user,
    setAuthOpen
  } = useUser();

  const [sweet, setSweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  const fetchSweet = async () => {
    if (!selectedSweetId) return;

    setLoading(true);
    try {
      const res = await api.get(`/sweet/${selectedSweetId}`);
      setSweet(res.data.sweet);
    } catch {
      setSweet(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (buyOpen) {
      setQty(1);
      setMessage("");
      fetchSweet();
    }
  }, [buyOpen]);

  const increaseQty = () => {
    if (!sweet) return;

    if (qty >= sweet.quantity) {
      setMessage(`You cannot choose more. Only ${sweet.quantity} kg available.`);
      return;
    }

    setQty(qty + 1);
    setMessage("");
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
      setMessage("");
    }
  };

  const totalAmount = sweet ? sweet.price * qty : 0;

  const handlePurchase = async () => {
    try {
      const res = await api.post(`/inventory/${selectedSweetId}/purchase`, {
        quantity: qty
      });

      setMessage("Order Placed Successfully");
      setSweet(res.data.sweet);
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to place order");
    }
  };

  return (
    <AnimatePresence>
      {buyOpen && (
        <motion.div
          key="checkoutOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999]"
          onClick={() => setBuyOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl w-[450px] max-w-[92%] p-7 shadow-2xl relative font-poppins"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBuyOpen(false)}
              className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-black transition"
            >
              <IoClose />
            </button>

            {loading || !sweet ? (
              <div className="text-center py-10 text-lg font-medium">
                Loading Checkout...
              </div>
            ) : (
              <div className="space-y-7">

                <div className="text-center">
                  <div className="text-3xl font-bold text-black">Checkout</div>
                  <div className="text-gray-500 mt-1 text-sm">
                    Review your order before confirming
                  </div>
                </div>

                <div className="bg-gray-100 rounded-2xl p-4 flex gap-4 shadow-inner">
                  <img
                    src={sweet.image}
                    className="w-28 h-28 rounded-xl object-cover shadow"
                  />

                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-xl font-semibold">{sweet.name}</div>
                      <div className="text-sm text-gray-600">{sweet.category}</div>

                      <div className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 mt-2 w-fit rounded-lg text-sm font-medium">
                        <FaStar className="text-xs" /> {sweet.rating?.toFixed(1)}
                      </div>

                      <div className="text-sm text-gray-700 mt-1">
                        Available: <span className="font-semibold">{sweet.quantity} kg</span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-black">₹{sweet.price}</div>
                  </div>
                </div>

                {sweet.quantity > 0 ? (
                  <div className="bg-gray-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium text-black">Select Quantity</div>
                      <div className="text-sm text-gray-600">
                        Available: {sweet.quantity} kg
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={decreaseQty}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center text-xl"
                      >
                        <FaMinus />
                      </button>

                      <div className="text-xl font-semibold">{qty} kg</div>

                      <button
                        onClick={increaseQty}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center text-xl"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    {message && (
                      <div className="text-red-600 text-sm font-medium text-center">
                        {message}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 text-red-600 text-center font-bold text-lg">
                    Out of Stock
                  </div>
                )}

                <div className="bg-gray-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between text-gray-700 text-base">
                    <span>Item Price</span>
                    <span>₹{sweet.price}</span>
                  </div>

                  <div className="flex justify-between text-gray-700 text-base">
                    <span>Quantity</span>
                    <span>{qty} kg</span>
                  </div>

                  <div className="flex justify-between text-black text-lg font-semibold border-t pt-3">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                {user ? (
                  <button
                    onClick={handlePurchase}
                    className="w-full py-3.5 rounded-2xl bg-black text-white text-lg font-semibold hover:bg-gray-900 active:scale-95 transition shadow-lg cursor-pointer"
                  >
                    Place Order
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setBuyOpen(false);
                      setAuthOpen(true);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-red-600 text-white text-lg font-semibold hover:bg-red-700 active:scale-95 transition shadow-lg cursor-pointer"
                  >
                    Login First
                  </button>
                )}

                {message && sweet.quantity > 0 && (
                  <div className="text-center text-black font-medium mt-2">
                    {message}
                  </div>
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
