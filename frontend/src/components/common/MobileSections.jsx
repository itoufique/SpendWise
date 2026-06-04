import { useEffect, useState } from 'react';
import api from '../../services/api';
import ProductCard from '../products/ProductCard';

const Section = ({ title, params }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', { params });
        setItems(res.data.data.products || []);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [params]);

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card animate-pulse p-4 rounded-3xl h-48" />
        )) : (
          items.map((p) => <ProductCard key={p._id} product={p} />)
        )}
      </div>
    </div>
  );
};

const MobileSections = () => {
  return (
    <section className="mx-auto max-w-6xl space-y-10 py-6">
      <Section title="Popular mobiles" params={{ keyword: 'Mobile', sort: 'popular', limit: 8 }} />
      <Section title="Budget mobiles" params={{ keyword: 'Mobile', sort: 'price_low', maxPrice: 12000, limit: 8 }} />
      <Section title="Best rated mobiles" params={{ keyword: 'Mobile', sort: 'best_rated', limit: 8 }} />
      <Section title="New arrivals" params={{ keyword: 'Mobile', limit: 8 }} />
    </section>
  );
};

export default MobileSections;
