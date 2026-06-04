import { Link } from 'react-router-dom';

const buildImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/600x400?text=Product';
  if (image.startsWith('/images')) return image;
  const absoluteBackendImage = image.match(/^https?:\/\/[^/]+(\/images\/.*)$/);
  if (absoluteBackendImage) return absoluteBackendImage[1];
  return image;
};

const ProductCard = ({ product, showRemove = false, onRemove }) => {
  const imageUrl = buildImageUrl(product.images?.[0]);

  return (
    <article className="glass-card overflow-hidden rounded-3xl border border-white/10 p-4 shadow-glow transition hover:-translate-y-1 hover:border-accent/40">
      <div className="h-52 w-full overflow-hidden rounded-3xl bg-slate-800">
        <img src={imageUrl} alt={product.title} className="h-full w-full object-cover" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">{product.title}</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{product.rating?.toFixed(1)}★</span>
        </div>
        <p className="text-sm text-slate-300 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">{product.brand}</div>
          <div className="text-lg font-semibold text-white">
            {typeof product.price === 'number' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price) : product.price}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/product/${product._id}`} className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500">
            View details
          </Link>
          {showRemove && (
            <button onClick={() => onRemove && onRemove(product._id)} className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-2 text-sm text-rose-400 hover:bg-white/20 transition">
              Remove
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
