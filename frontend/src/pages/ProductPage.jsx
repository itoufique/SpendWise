import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useAuth } from '../contexts/AuthContext';

const buildImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/1200x900?text=Product';
  if (image.startsWith('/images')) return image;
  const absoluteBackendImage = image.match(/^https?:\/\/[^/]+(\/images\/.*)$/);
  if (absoluteBackendImage) return absoluteBackendImage[1];
  return image;
};

const ProductPage = () => {
  const { id } = useParams();
  const { user, showToast } = useAuth();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data.product);
      setSimilar(response.data.data.similar);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const addWishlist = async () => {
    if (!user) return showToast('Login to add favorites', 'error');
    try {
      await api.post(`/products/${id}/wishlist`);
      showToast('Added to wishlist');
    } catch (error) {
      showToast('Unable to add item', 'error');
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!product) return <div className="text-center text-slate-300">Product not found.</div>;

  return (
    <section className="mx-auto max-w-6xl space-y-8 py-6">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-glow">
          <div className="grid gap-6 md:grid-cols-[0.85fr_0.35fr]">
            <div className="rounded-3xl bg-slate-900 p-4">
              <img src={buildImageUrl(product.images?.[0])} alt={product.title} className="h-full w-full rounded-3xl object-cover" />
            </div>
            <div className="space-y-4 text-slate-200">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-accent">{product.brand}</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">{product.title}</h1>
                <p className="mt-3 text-lg font-semibold text-white">{typeof product.price === 'number' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price) : product.price}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm">{product.rating?.toFixed(1)} ★</span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm">Popularity {product.popularity}</span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm">Stock: {product.stock}</span>
              </div>
              <button onClick={addWishlist} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
                Add to wishlist
              </button>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-white">Product details</h2>
            <p className="text-slate-300">{product.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.features?.map((item, idx) => (
                <div key={idx} className="rounded-3xl bg-slate-950/70 p-4 text-sm text-slate-300">{item}</div>
              ))}
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Specifications</h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-white/10 pb-2">
                    <span>{key}</span>
                    <span className="text-right text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <aside className="space-y-6">
          <div className="glass-card rounded-[2rem] border border-white/10 p-6 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Similar products</h2>
            <div className="mt-4 space-y-4">
              {similar.map((item) => (
                <div key={item._id} className="rounded-3xl bg-slate-950/70 p-4">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{typeof item.price === 'number' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price) : item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ProductPage;
