'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from './store/cartStore';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';



function ProductImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-t-2xl">
      {images.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Slika ${index + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Prev/Next buttons */}
      {images.length > 1 && (
        <>
          <button
  onClick={prev}
  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 text-gray-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/50 transition"
>
  <span className="text-xl">&larr;</span>
</button>

<button
  onClick={next}
  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 text-gray-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/50 transition"
>
  <span className="text-xl">&rarr;</span>
</button>

        </>
      )}

      {/* Indicator dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  const { addToCart } = useCartStore();
  const { cart } = useCartStore();


  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  const fetchProducts = async () => {
  setIsLoading(true);
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka:', error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchProducts();
  const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
  };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

  const [particles, setParticles] = useState([]);

useEffect(() => {
  const generatedParticles = [...Array(30)].map(() => ({
    width: Math.random() * 10 + 5,
    height: Math.random() * 10 + 5,
    left: Math.random() * 100,
    top: Math.random() * 100,
    xMove: (Math.random() - 0.5) * 100,
    yMove: (Math.random() - 0.5) * 100,
    duration: Math.random() * 10 + 10,
  }));
  setParticles(generatedParticles);
}, []);


  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Poboljšane kategorije s podkategorijama
  const categories = {
  'Odjeća': { icon: '🧥', subcategories: ['Muška', 'Ženska', 'Dječija'] },
  'Obuća': { icon: '👟', subcategories: ['Muška', 'Ženska', 'Dječija'] },
  'Kopačke': { icon: '🥾', subcategories: ['Odrasli', 'Dječije'] },
  'Sportska oprema': { icon: '🏋️', subcategories: ['Kompleti', 'Ostalo'] },
  'Kućne potrepštine': { icon: '🧺', subcategories: ['Kuhinja', 'Kupatilo', 'Dekoracija', 'Ostalo'] },
  'Tehnologija': { icon: '💻', subcategories: ['Mobiteli', 'Laptopi', 'Oprema', 'Ostalo'] },
  'Drugo': { icon: '📦', subcategories: ['Razno'] }
};


  const storeImages = [
    '/radnja.jpg',
    '/radnja2.jpg',
    '/radnja3.jpg',
    '/radnja4.jpg'
  ];

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
      setIsCategoryMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);




  // Filtriraj proizvode po kategoriji i podkategoriji
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (!activeCategory && !activeSubcategory) return true;
      if (activeCategory && !activeSubcategory) return product.category === activeCategory;
      return product.category === activeCategory && product.subcategory === activeSubcategory;
    });
  }, [products, activeCategory, activeSubcategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 font-sans antialiased overflow-x-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {particles.map((particle, i) => (
  <motion.div
    key={i}
    className="absolute bg-yellow-400/10 rounded-full"
    style={{
      width: `${particle.width}px`,
      height: `${particle.height}px`,
      left: `${particle.left}%`,
      top: `${particle.top}%`,
    }}
    animate={{
      y: [0, particle.yMove],
      x: [0, particle.xMove],
      opacity: [0.1, 0.3, 0.1],
    }}
    transition={{
      duration: particle.duration,
      repeat: Infinity,
      repeatType: 'reverse',
    }}
  />
))}

      </div>

      {/* Responsive Navigation Bar */}
<header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <a href="#" className="text-xl font-bold text-yellow-500 tracking-tight">Trgovina RM</a>

    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
      <a href="#" className="hover:text-yellow-500 transition-colors">Početna</a>
      <a href="#products" className="hover:text-yellow-500 transition-colors">Proizvodi</a>

      {/* Dropdown for Kategorije */}
      {/* Dropdown for Kategorije - klikom se otvara */} 
<div className="relative" ref={categoryMenuRef}>
  <button
    onClick={() => setIsCategoryMenuOpen(prev => !prev)}
    className="hover:text-yellow-500 transition-colors flex items-center gap-1"
  >
    Kategorije
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {isCategoryMenuOpen && (
    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[220px] z-50">
      {Object.entries(categories).map(([name, { icon }]) => (
        <div
          key={name}
          className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-yellow-100 cursor-pointer"
          onClick={() => {
            setActiveCategory(name);
            setActiveSubcategory(null);
            fetchProducts();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            setIsCategoryMenuOpen(false); // zatvori meni nakon odabira
          }}
        >
          <span className="text-lg">{icon}</span>
          <span className="text-sm text-gray-700">{name}</span>
        </div>
      ))}
    </div>
  )}
</div>


      <a href="#radnja" className="hover:text-yellow-500 transition-colors">O nama</a>
      <a href="#kontakt" className="hover:text-yellow-500 transition-colors">Kontakt</a>
      <Link href="/cart" className="relative">
  <ShoppingCartIcon className="w-6 h-6 text-gray-800 hover:text-yellow-500 transition-colors" />
  {cart.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
      {cart.length}
    </span>
  )}
</Link>


    </nav>

    {/* Mobile menu icon */}
    <div className="md:hidden">
      <Link href="/cart" className="relative flex items-center gap-2">
  <ShoppingCartIcon className="w-6 h-6 text-gray-800 hover:text-yellow-500 transition-colors" />
  {cart.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
      {cart.length}
    </span>
  )}
</Link>

      <button onClick={() => setShowCategoryMenu(!showCategoryMenu)}>
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>

  {/* Mobile Dropdown */}
  <AnimatePresence>
    {showCategoryMenu && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="md:hidden bg-white border-t border-gray-200 shadow-lg px-6 py-4"
      >
        <a href="#" className="block py-2 text-gray-700">Početna</a>
        <a href="#products" className="block py-2 text-gray-700">Proizvodi</a>
        <div className="mt-2">
          <p className="text-sm font-semibold text-gray-600 mb-2">Kategorije</p>
          {Object.entries(categories).map(([name, { icon }]) => (
            <div
              key={name}
              className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-yellow-100 cursor-pointer"
              onClick={() => {
                setActiveCategory(name);
                setActiveSubcategory(null);
                fetchProducts();
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                setShowCategoryMenu(false);
              }}
            >
              <span className="text-lg">{icon}</span>
              <span>{name}</span>
            </div>
          ))}
        </div>
        <a href="#radnja" className="block py-2 text-gray-700 mt-2">O nama</a>
        <a href="#kontakt" className="block py-2 text-gray-700">Kontakt</a>
      </motion.div>
    )}
  </AnimatePresence>
</header>

      {/* HERO SECTION - MODERN DESIGN */}
<section id="home" className="relative h-[90vh] pt-24 flex items-center justify-center overflow-hidden" ref={ref}>
  <motion.div 
    className="absolute inset-0 bg-[url('/radnja.jpg')] bg-cover bg-center scale-110"
    style={{ y: backgroundY }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
  </motion.div>
  
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="relative z-10 max-w-6xl px-6 text-center"
    style={{ y: textY }}
  >
    <div className="mb-8">
      <motion.h1 
        className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          Dobrodošli
        </span> u našu radnju
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Otkrijte jedinstvene i kvalitetne stvari po pristupačnim cijenama
      </motion.p>
    </div>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="#radnja"
        className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        Posjetite nas
      </motion.a>
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="#products"
        className="px-8 py-3 border-2 border-yellow-500 text-yellow-500 font-bold rounded-full hover:bg-yellow-500/10 transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        Istražite proizvode
      </motion.a>
    </div>
  </motion.div>
</section>

      {/* PRODUCTS SECTION - NOW AT THE TOP */}
      <section id="products" className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600">
              Naši proizvodi
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Pogledajte neke od naših najtraženijih artikala
          </p>
          
          {/* Category filter */}
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Main category filter */}
            <div className="flex flex-wrap justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!activeCategory ? 'bg-yellow-500 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => {
                  setActiveCategory(null);
                  setActiveSubcategory(null);
                  fetchProducts();
                }}
              >
                Svi proizvodi
              </motion.button>
              {Object.keys(categories).map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category ? 'bg-yellow-500 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveSubcategory(null);
                    fetchProducts();
                  }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            
            {/* Subcategory filter (only shown when a category is selected) */}
            {activeCategory && (
              <div className="flex flex-wrap justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${!activeSubcategory ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => {setActiveSubcategory(null); fetchProducts();}}
                >
                  Sve podkategorije
                </motion.button>
                {categories[activeCategory]?.subcategories.map((subcategory) => (
                  <motion.button
                    key={subcategory}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeSubcategory === subcategory ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => { setActiveSubcategory(subcategory); fetchProducts();}}
                  >
                    {subcategory}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product) => (
  <motion.div
    key={product.id}
    variants={item}
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group relative"
  >
    {/* Status: Novo / Korišteno */}
    {product.isNew !== undefined && (
      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10 ${
        product.isNew ? 'bg-green-500' : 'bg-blue-500'
      }`}>
        {product.isNew ? 'Novo' : 'Korišteno'}
      </div>
    )}

    {/* Carousel za max 3 slike */}
   <div className="relative w-full h-64 overflow-hidden rounded-t-2xl">
  {Array.isArray(product.imageUrl) && product.imageUrl.length > 0 ? (
    <ProductImageCarousel images={product.imageUrl.slice(0, 3)} />
  ) : (
    <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
      Nema slike
    </div>
  )}
</div>




    {/* Informacije o proizvodu */}
    <div className="p-6 space-y-2">
      <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
      <p className="text-lg font-extrabold text-yellow-600">{product.price} KM</p>

      {product.category && (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 mr-3">
          {product.category}
        </span>
      )}

      {product.subcategory && (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
          {product.subcategory}
        </span>
      )}

      {product.sizes && (
        <div className="text-sm text-gray-600 mt-3">
          <strong>Veličina:</strong> {product.sizes}
        </div>
      )}
      {product.brand && (
        <div className="text-sm text-gray-600">
          <strong>Brend:</strong> {product.brand}
        </div>
      )}
      {product.description && (
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
      )}

      {/* Akcije */}
      <div className="flex gap-3 pt-4">
        <button
  onClick={() => addToCart(product)}
  className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
>
  Dodaj u korpu
</button>

      </div>
    </div>
  </motion.div>
))}

          </motion.div>
        )}
        
        {/* View more button */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-black text-black font-bold rounded-full hover:bg-black hover:text-white transition-all"
            >
              Pogledajte sve proizvode
            </motion.button>
          </motion.div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">Nema proizvoda u ovoj kategoriji</h3>
            <button 
              className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-full font-medium hover:bg-yellow-600 transition-colors"
              onClick={() => {
                setActiveCategory(null);
                setActiveSubcategory(null);
                fetchProducts();
              }}
            >
              Povratak na sve proizvode
            </button>
          </div>
        )}
      </section>

      {/* STORE SECTION - GALLERY STYLE */}
      <section id="radnja" className="relative py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-16"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600">
                  Naš prostor
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Mjesto dobre kvalitete
              </p>
            </div>
            
            {/* Store Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {storeImages.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-2xl overflow-hidden shadow-lg ${index === 0 ? 'md:col-span-2 md:row-span-2 h-full' : 'h-64'}`}
                >
                  <img
                    src={img}
                    alt={`Store interior ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </motion.div>
              ))}
            </div>
            
            <div id="kontakt" className="text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600">
                    Lokacija radnje
                  </span>
                </h2>
              </div>
            {/* Store info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-800">Doživite nezaboravno iskustvo kupovine</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Naša radnja je više od samo mjesta za kupovinu - to je destinacija gdje se susreće kvalitet i pristupačnost. 
                  Sa pažljivo odabranim asortimanom, nudimo jedinstvenu kombinaciju novih i dobro očuvanih polovnih predmeta i stvari.
                </p>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Radno vrijeme</p>
                      <p className="text-gray-600">Pon - Sub: 9:00 - 17:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Kontakt</p>
                      <p className="text-gray-600">+387 62 644 203</p>
                    </div>
                  </div>
                </div>
              </div>
              

              {/* Interactive map */}
              <motion.div 
                variants={item}
                className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-96 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br z-10 pointer-events-none"></div>
                <iframe
                  title="Lokacija radnje"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2866.6448287600533!2d17.933390499999998!3d44.07004219999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475f19001b227579%3A0xf5a3bcdc955408aa!2sTrgovina%20sportske%20opreme!5e0!3m2!1shr!2sba!4v1752348514244!5m2!1shr!2sba"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                  <p className="font-medium">Pronađite nas na mapi</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    
      {/* FOOTER - MODERN DESIGN */}
      <footer id="kontakt" className="bg-gray-900 text-white pt-16 pb-8 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      {/* O nama sekcija */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-yellow-500">Trgovina RM</h3>
        <p className="text-gray-400">
          Vaša pouzdana destinacija za kvalitetnu odjeću, obuću i kućne potrepštine po pristupačnim cijenama.
        </p>
      </div>

      {/* Brzi linkovi */}
<div className="space-y-4">
  <h4 className="text-lg font-semibold text-gray-300">Brzi linkovi</h4>
  <ul className="space-y-3">
    {['Početna', 'Proizvodi', 'O nama', 'Kontakt'].map((item) => {
      // Mapiranje naziva na ID sekcije
      const hrefMap = {
        'Početna': '#home',
        'Proizvodi': '#products',
        'O nama': '#radnja',
        'Kontakt': '#kontakt',
      };

      return (
        <li key={item}>
          <a 
            href={hrefMap[item] || '#'} 
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            {item}
          </a>
        </li>
      );
    })}
  </ul>
</div>


      {/* Radno vrijeme */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">Radno vrijeme</h4>
        <ul className="space-y-3 text-gray-400">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p className="font-medium text-gray-300">Pon - Sub</p>
              <p>09:00 - 17:00</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p className="font-medium text-gray-300">Nedjelja</p>
              <p>Zatvoreno</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Kontakt informacije */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">Kontaktirajte nas</h4>
        <ul className="space-y-3 text-gray-400">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <div>
              <p className="font-medium text-gray-300">Adresa</p>
              <p>Kaćuni bb, Busovača</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <div>
              <p className="font-medium text-gray-300">Telefon</p>
              <p>+387 62 644 203</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <div>
              <p className="font-medium text-gray-300">Email</p>
              <p>rmtrgovina@gmail.com</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    {/* Donji dio footera */}
    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p className="text-gray-500 text-sm mb-4 md:mb-0">
        &copy; {new Date().getFullYear()} Trgovina RM. Sva prava zadržana.
      </p>
      <div className="flex gap-6 text-sm">
        <a href="/uslovi" className="text-gray-500 hover:text-yellow-500 transition-colors">Uslovi korištenja</a>
        <a href="/politika" className="text-gray-500 hover:text-yellow-500 transition-colors">Politika privatnosti</a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}