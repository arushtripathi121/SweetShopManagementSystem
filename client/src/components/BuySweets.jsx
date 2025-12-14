import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { api } from "../hooks/api";

import { useBuySweet } from "../context/BuySweetContext";
import { useAuth } from "../context/AuthContext";

const BuySweets = () => {
  const { buyOpen, setBuyOpen, selectedSweetId } = useBuySweet();
  const { user, setAuthOpen } = useAuth();

  const [sweet, setSweet] = useState(null);
  const [loading, setLoading] = useState(false);

  const [qty, setQty] = useState(0.25);
  const [message, setMessage] = useState("");

  const weightOptions = [0.25, 0.5, 1, 2.5, 5];

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

  useEffect(() => {
    if (buyOpen) {
      setQty(0.25);
      setMessage("");
      fetchSweet();
    }
  }, [buyOpen, fetchSweet]);

  const totalAmount = useMemo(
    () => (sweet ? sweet.price * qty : 0),
    [sweet, qty]
  );

  const handlePurchase = useCallback(async () => {
    try {
      const res = await api.post(`/inventory/${selectedSweetId}/purchase`, {
        quantity: qty
      });

      const { orderToken, pdfBase64, sweet: updatedSweet } = res.data;

      setSweet(updatedSweet);

      setMessage(`Order Successful! Token: ${orderToken}`);

      if (pdfBase64) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${pdfBase64}`;
        link.download = `order-${orderToken}.pdf`;
        link.click();
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to place order");
    }
  }, [qty, selectedSweetId]);

  return (
    <AnimatePresence>
      {buyOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
          onClick={() => setBuyOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative font-poppins"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBuyOpen(false)}
              className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-black"
            >
              <IoClose />
            </button>

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
                <div className="bg-gray-100 rounded-2xl p-4 flex gap-4">
                  <img
                    src={sweet.image}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow"
                    alt={sweet.name}
                  />

                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-xl font-semibold">{sweet.name}</div>
                      <div className="text-sm text-gray-600">{sweet.category}</div>

                      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 mt-2 rounded-lg text-xs font-medium w-fit">
                        <FaStar className="text-xs" /> {sweet.rating?.toFixed(1)}
                      </div>
                    </div>

                    <div className="text-2xl font-bold">₹{sweet.price}</div>
                  </div>
                </div>

                {/* ❌ OUT OF STOCK UI */}
                {sweet.quantity === 0 ? (
                  <>
                    <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-2xl text-center font-semibold text-lg shadow">
                      OUT OF STOCK
                    </div>
                  </>
                ) : (
                  <>
                    {/* Weight Selection */}
                    <div className="bg-gray-100 rounded-2xl p-4 space-y-3">
                      <div className="text-lg font-medium">Select Weight</div>

                      <div className="flex flex-wrap gap-3">
                        {weightOptions.map((w) => (
                          <button
                            key={w}
                            onClick={() => {
                              setMessage("");
                              setQty(w);
                            }}
                            className={`px-4 py-2 rounded-xl border text-sm font-medium ${qty === w
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-gray-300"
                              }`}
                          >
                            {w < 1 ? `${w * 1000} g` : `${w} kg`}
                          </button>
                        ))}

                        {/* Custom Input */}
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Custom (kg)"
                          className="px-4 py-2 rounded-xl border text-sm w-28"
                          value={qty}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);

                            if (isNaN(value) || value <= 0) {
                              setQty(0);
                              setMessage("Enter valid weight");
                              return;
                            }

                            if (value > sweet.quantity) {
                              setMessage(`Only ${sweet.quantity} kg available`);
                            } else {
                              setMessage("");
                            }

                            setQty(value);
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-gray-700">
                        <span>Available</span>
                        <span>{sweet.quantity} kg</span>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gray-100 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Weight</span>
                        <span>{qty < 1 ? `${qty * 1000} g` : `${qty} kg`}</span>
                      </div>

                      <div className="flex justify-between text-gray-700">
                        <span>Price per kg</span>
                        <span>₹{sweet.price}</span>
                      </div>

                      <div className="flex justify-between text-black font-semibold border-t pt-3 text-lg">
                        <span>Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* BUTTON AREA */}
                {sweet.quantity > 0 && (
                  <>
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
                  </>
                )}

                {/* Only show message when stock > 0 */}
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
