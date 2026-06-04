import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 text-center shadow-glow">
    <h1 className="text-5xl font-semibold text-white">404</h1>
    <p className="mt-4 text-slate-300">Page not found. The link may be broken or the page may have been removed.</p>
    <Link to="/" className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
      Go back home
    </Link>
  </section>
);

export default NotFound;
