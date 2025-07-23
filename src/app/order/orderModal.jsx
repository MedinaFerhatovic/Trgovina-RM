'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { db } from '../../../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useCartStore } from '../store/cartStore';

export default function OrderModal({ isOpen, onClose }) {
  const { cart, clearCart } = useCartStore();

  const [form, setForm] = useState({
    ime: '',
    telefon: '',
    adresa: '',
    postanskiBroj: '',
    grad: '',
    napomena: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Korpa je prazna.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'orders'), {
        ...form,
        createdAt: Timestamp.now(),
        status: 'pending',
        items: cart,
        total: cart.reduce((acc, item) => acc + parseFloat(item.price || 0), 0),
      });

      clearCart();
      alert('✅ Narudžba je uspješno poslata!');
      onClose();
      setForm({
        ime: '',
        telefon: '',
        adresa: '',
        postanskiBroj: '',
        grad: '',
        napomena: '',
      });
    } catch (err) {
      console.error('Greška prilikom slanja narudžbe:', err);
      alert('❌ Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                Detalji narudžbe
              </Dialog.Title>
              <button onClick={onClose}>
                <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="ime"
                  placeholder="Ime i prezime"
                  required
                  value={form.ime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  name="telefon"
                  placeholder="Telefon"
                  required
                  value={form.telefon}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  name="adresa"
                  placeholder="Adresa"
                  required
                  value={form.adresa}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  name="postanskiBroj"
                  placeholder="Poštanski broj"
                  required
                  value={form.postanskiBroj}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  name="grad"
                  placeholder="Grad"
                  required
                  value={form.grad}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <textarea
                  name="napomena"
                  placeholder="Napomena (opcionalno)"
                  rows={3}
                  value={form.napomena}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:col-span-2"
                />
              </div>

              <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
                <p><strong>Napomena:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>📞 Ako imate dodatnih pitanja, pozovite <strong>+387 62 644 203</strong>.</li>
                  <li>🚚 Pošiljke šaljemo brzom poštom, cijena dostave je 10 KM.</li>
                  <li>⌛ Ako naručite nakon 16:00, pošiljka ide naredni radni dan.</li>
                </ul>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-full transition duration-300 disabled:opacity-50"
                >
                  {loading ? 'Slanje...' : 'Potvrdi narudžbu'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
