import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/products/ProductCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const WishlistPage = () => {
  const { showToast } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/wishlist');
      setWishlist(response.data.data.wishlist);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWishlist = async (id) => {
    if (!window.confirm('Remove this item from your wishlist?')) return;

    try {
      await api.delete(`/products/${id}/wishlist`);
      setWishlist((prev) => prev.filter((p) => p._id !== id));
      showToast('Removed from wishlist', 'success');
    } catch (err) {
      console.error(err);
      showToast('Unable to remove item', 'error');
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <section className="mx-auto max-w-7xl space-y-8 py-6">
      <div className="glass-card rounded-[2rem] border border-white/10 p-6 shadow-glow">
        <h2 className="text-2xl font-semibold text-white">Your wishlist</h2>
        <p className="mt-2 text-slate-400">Save products you love and revisit them later.</p>
      </div>
      {loading ? <LoadingSkeleton /> : wishlist.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{wishlist.map((product) => <ProductCard key={product._id} product={product} showRemove={true} onRemove={handleRemoveWishlist} />)}</div> : <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-slate-300">Your wishlist is empty. Browse products and save favorites.</div>}
    </section>
  );
};

export default WishlistPage;
