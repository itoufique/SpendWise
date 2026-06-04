import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';
import BrandBar from '../components/common/BrandBar';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const sampleProducts = [
  {
    _id: 'sample-1',
    title: 'Smart Wallet',
    description: 'Sleek design, RFID protection, and premium leather for everyday carry.',
    price: 29.99,
    brand: 'BudgetEase',
    rating: 4.7,
    images: ['https://via.placeholder.com/600x400?text=Smart+Wallet'],
  },
  {
    _id: 'sample-2',
    title: 'Smart Budget Planner',
    description: 'Interactive expense tracking with automated budget categories and saving insights.',
    price: 49.99,
    brand: 'SpendWise',
    rating: 4.9,
    images: ['https://via.placeholder.com/600x400?text=Budget+Planner'],
  },
  {
    _id: 'sample-3',
    title: 'AI Savings Coach',
    description: 'Personalized roadmap with alerts and tips to reach your savings goals faster.',
    price: 69.99,
    brand: 'WiseAI',
    rating: 4.8,
    images: ['https://via.placeholder.com/600x400?text=AI+Savings+Coach'],
  },
];

const Products = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', brand: '', minPrice: '', maxPrice: '', sort: 'price_low' });
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchProducts = async (overrides = {}) => {
    setLoading(true);
    setUsingFallback(false);
    try {
      const params = {
        keyword: filters.keyword,
        brand: filters.brand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        ...overrides,
      };
      const response = await api.get('/products', { params });
      const fetchedProducts = response.data?.data?.products || [];

      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        const brands = Array.from(new Set(fetchedProducts.map((p) => p.brand).filter(Boolean)));
        setAvailableBrands(brands);
      } else if (filters.keyword) {
        const scrapeResponse = await api.get('/products/scrape', { params: { keyword: filters.keyword } });
        const scrapedProducts = scrapeResponse.data?.data?.products || [];
        if (scrapedProducts.length > 0) {
          setProducts(scrapedProducts);
          const brands = Array.from(new Set(scrapedProducts.map((p) => p.brand).filter(Boolean)));
          setAvailableBrands(brands);
          return;
        }
        setProducts(sampleProducts);
        setUsingFallback(true);
        setAvailableBrands(Array.from(new Set(sampleProducts.map((p) => p.brand))));
      } else {
        setProducts(sampleProducts);
        setUsingFallback(true);
        setAvailableBrands(Array.from(new Set(sampleProducts.map((p) => p.brand))));
      }
    } catch (error) {
      console.error(error);
      setProducts(sampleProducts);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="mx-auto max-w-7xl space-y-8 py-6">
      <div className="glass-card rounded-[2rem] border border-white/10 p-6 shadow-glow">
        <h2 className="text-2xl font-semibold text-white">Smart search center</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          <input type="search" placeholder="Keyword" value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
          <input type="text" placeholder="Brand" value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
          <input type="number" placeholder="Min budget" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
          <input type="number" placeholder="Max budget" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
          <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white">
            <option value="price_low">Price low to high</option>
            <option value="price_high">Price high to low</option>
            <option value="best_rated">Best rated</option>
            <option value="popular">Most popular</option>
          </select>
        </div>
        <button onClick={fetchProducts} className="mt-5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
          Search products
        </button>
      </div>
      {/* Brand downbar */}
      <BrandBar brands={availableBrands} selected={filters.brand} onSelect={(b) => { setFilters({ ...filters, brand: b }); fetchProducts({ brand: b }); }} />
      {usingFallback && !loading && (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-100">
          Backend response unavailable or no products found. Showing sample products for trial/demo.
        </div>
      )}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </section>
  );
};

export default Products;
