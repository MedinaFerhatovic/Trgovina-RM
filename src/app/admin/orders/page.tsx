'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../../firebaseConfig';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';

interface Order {
  id: string;
  ime: string;
  telefon: string;
  adresa: string;
  grad: string;
  postanskiBroj: string;
  napomena: string;
  createdAt: any;
  status: string;
  total: number;
  items: {
    id: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    sizes: string;
    imageUrl: string[];
  }[];
}

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 🔐 Provjera postojanja admin config dokumenta
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const docRef = doc(db, 'config', 'admin');
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          alert('⚠️ Admin konfiguracija nije pronađena.');
          router.push('/');
        } else {
          setCheckingPassword(false);
        }
      } catch (err) {
        console.error('Greška pri dohvaćanju konfiguracije:', err);
        alert('⚠️ Greška pri provjeri admin šifre.');
        router.push('/');
      }
    };

    checkConfig();
  }, [router]);

  // 🧠 Dohvatanje svih narudžbi
  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const fetchedOrders: Order[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      fetchedOrders.push({
        id: docSnap.id,
        ...data,
      } as Order);
    });

    setOrders(fetchedOrders);
  };

  const deleteOrder = async (id: string) => {
    await deleteDoc(doc(db, 'orders', id));
    fetchOrders();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    try {
      const docRef = doc(db, 'config', 'admin');
      const docSnap = await getDoc(docRef);
      const correctPassword = docSnap.data()?.password;

      if (passwordInput === correctPassword) {
        setIsAuthorized(true);
        fetchOrders(); // sad može prikazati narudžbe
      } else {
        setPasswordError('❌ Pogrešna šifra.');
      }
    } catch (err) {
      setPasswordError('⚠️ Došlo je do greške.');
    }
  };

  if (checkingPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
        🔐 Učitavanje administratorske stranice...
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white shadow-md p-6 rounded-md space-y-4 w-full max-w-sm"
        >
          <h2 className="text-xl font-bold text-center text-gray-800">Admin pristup</h2>
          <input
            type="password"
            placeholder="Unesite admin šifru"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Potvrdi
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">📦 Pristigle narudžbe</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">Nema narudžbi trenutno.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">{order.ime}</p>
                  <p className="text-sm text-gray-600">📞 {order.telefon}</p>
                  <p className="text-sm text-gray-600">🏠 {order.adresa}, {order.postanskiBroj} {order.grad}</p>
                  <p className="text-sm text-gray-600">📝 {order.napomena}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">🕒 {new Date(order.createdAt?.seconds * 1000).toLocaleString()}</p>
                  <p className="text-sm text-gray-700 font-semibold">Status: {order.status}</p>
                  <p className="text-lg text-yellow-600 font-bold mt-1">Ukupno: {order.total} KM</p>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="mt-2 text-red-500 hover:underline text-sm"
                  >
                    Obriši narudžbu
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items?.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="border p-3 rounded bg-gray-50">
                      <img
                        src={item.imageUrl?.[0]}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <p className="text-sm text-gray-500">Veličina: {item.sizes}</p>
                      <p className="text-sm text-gray-500">Količina: {item.quantity}</p>
                      <p className="text-yellow-600 font-bold">{item.price} KM</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">Nema proizvoda u ovoj narudžbi.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
