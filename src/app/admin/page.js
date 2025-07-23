'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebaseConfig';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

export default function Admin() {
  const router = useRouter();

  // State za admin pristup
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(true);
  const [passwordError, setPasswordError] = useState('');

  // State za unos proizvoda
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [sizes, setSizes] = useState('');
  const [isNew, setIsNew] = useState(false);

  // Provjera postoji li dokument config/admin u Firestore
  useEffect(() => {
    const checkConfig = async () => {
      try {
        console.log('Provjera admin konfiguracije...');
        const docRef = doc(db, 'config', 'admin');
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          alert('⚠️ Konfiguracija za admin šifru nije pronađena.');
          router.push('/');
        } else {
          console.log('Admin konfiguracija učitana:', docSnap.data());
        }
      } catch (err) {
        console.error('Greška pri provjeri admin šifre:', err);
        alert('⚠️ Greška pri provjeri šifre.');
        router.push('/');
      } finally {
        console.log('Provjera završena, postavljam checkingPassword na false');
        setCheckingPassword(false);
      }
    };
    checkConfig();
  }, [router]);

  // Funkcija za potvrdu unosa šifre
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    try {
      const docRef = doc(db, 'config', 'admin');
      const docSnap = await getDoc(docRef);
      const correctPassword = docSnap.data()?.password;

      if (passwordInput === correctPassword) {
        setIsAuthorized(true);
      } else {
        setPasswordError('❌ Pogrešna šifra.');
      }
    } catch (err) {
      setPasswordError('⚠️ Došlo je do greške.');
    }
  };

  // Funkcija za unos proizvoda
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFiles.length || imageFiles.length > 3) {
      return alert("Molimo izaberite 1 do 3 slike proizvoda.");
    }

    setLoading(true);

    try {
      const imageUrls = [];

      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=key`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        imageUrls.push(data.data.url);
      }

      await addDoc(collection(db, "products"), {
        name,
        price: parseFloat(price),
        description,
        brand,
        category,
        subcategory,
        sizes,
        isNew,
        imageUrl: imageUrls,
      });

      // Reset forme
      setName('');
      setPrice('');
      setDescription('');
      setBrand('');
      setCategory('');
      setSubcategory('');
      setSizes('');
      setIsNew(false);
      setImageFiles([]);
      alert("✅ Proizvod uspješno dodat!");
    } catch (error) {
      console.error("Greška pri dodavanju:", error);
      alert("⚠️ Greška pri dodavanju proizvoda.");
    }

    setLoading(false);
  };

  // Render dok se provjerava konfiguracija
  if (checkingPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
        🔐 Učitavanje administratorske stranice...
      </div>
    );
  }

  // Render forme za unos šifre ako nije autoriziran
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

  // Render glavnog admin unosa proizvoda
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dodaj novi proizvod</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Naziv proizvoda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Cijena u KM"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Brand (npr. Nike)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Kategorija (npr. Obuća)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Potkategorija (npr. Muška)"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Veličina (npr. 38)"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Opis proizvoda"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
          />
          <span>Je li proizvod nov?</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files);
            if (files.length > 3) {
              alert("Možete dodati maksimalno 3 slike.");
              return;
            }
            setImageFiles(files);
          }}
          required
        />
        {imageFiles.length > 0 && (
          <div className="flex gap-2 mt-2">
            {imageFiles.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          {loading ? "Dodavanje..." : "Dodaj proizvod"}
        </button>
      </form>
    </div>
  );
}
