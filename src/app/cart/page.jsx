'use client';

import { useCartStore } from './../store/cartStore';
import { useState } from 'react';
import OrderModal from './../order/orderModal';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { cart, removeFromCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const total = cart
    .reduce((acc, item) => acc + parseFloat(item.price || 0) * (item.quantity || 1), 0)
    .toFixed(2);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">🛒 Moja korpa</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Vaša korpa je prazna.</p>
      ) : (
        <>
          <div className="grid gap-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white shadow-sm border border-gray-200 rounded-lg p-5 transition hover:shadow-md"
              >
                <img
                  src={item.imageUrl?.[0] || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-lg border"
                />
                <div className="flex-1 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <p className="text-sm text-gray-500 mt-1">Veličina: {item.sizes}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:text-right">
                      <p className="text-yellow-600 font-bold text-lg">{item.price} KM</p>
                      <p className="text-sm text-gray-500">Količina: {item.quantity}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item)}
                  className="text-red-500 hover:text-red-700 transition"
                  aria-label="Ukloni iz korpe"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>

          {/* SUMA I NARUČI */}
          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center border-t pt-6 gap-6">
            <p className="text-2xl font-bold text-gray-800">
              Ukupno: <span className="text-yellow-600">{total} KM</span>
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full shadow-md transition duration-300"
            >
              ✅ Nastavi s narudžbom
            </button>
          </div>

          {/* INFO */}
          <div className="mt-14 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 text-gray-700 leading-relaxed text-sm sm:text-base shadow-sm">
            <p className="font-semibold text-gray-800 mb-2">ℹ️ Važne informacije:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>💳 Plaćanje pouzećem (gotovina pri preuzimanju).</li>
              <li>🚚 Dostava brzom poštom — cijena dostave je <strong>10 KM</strong>.</li>
              <li>📦 Narudžbe primljene do kraja radnog vremena šaljemo isti dan.</li>
              <li>📅 Nakon radnog vremena, narudžba se šalje naredni radni dan.</li>
              <li>📞 Pitanja? Kontakt: <strong>+387 62 644 203</strong></li>
            </ul>
          </div>
        </>
      )}

      <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
