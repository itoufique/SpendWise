import { Link } from 'react-router-dom';
import MobileSections from '../components/common/MobileSections';

const Home = () => {
  return (
    <>
    <section className="mx-auto max-w-6xl space-y-10 py-10">
      <div className="glass-card rounded-[2rem] border border-white/10 p-10 shadow-glow">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
          <p className="text-sm uppercase tracking-[0.35em] text-accent">SpendWise AI</p>
            <h1 className="mt-4 text-5xl font-semibold text-white">Find the perfect product for your budget with intelligent recommendations.</h1>
            <p className="mt-6 max-w-xl text-slate-300">Search by category, brand, price, and preferences. Compare products, save wishlists, and explore AI-powered suggestions tailored to your needs.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
                Explore products
              </Link>
              <Link to="/register" className="rounded-full border border-white/15 px-8 py-3 text-sm font-semibold text-white transition hover:border-accent">
                Get started
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 shadow-glow">
            <div className="grid gap-6">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <h2 className="text-xl font-semibold text-white">Budget Search</h2>
                <p className="mt-2 text-slate-400">Filter products by price range and get results matching your spending plan.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <h2 className="text-xl font-semibold text-white">Comparison</h2>
                <p className="mt-2 text-slate-400">Compare price, features, ratings, and specifications side-by-side.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <h2 className="text-xl font-semibold text-white">Smart Recommendations</h2>
                <p className="mt-2 text-slate-400">AI-powered suggestions based on budget, popularity, and personal preferences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <MobileSections />
    </>
  );
};

export default Home;
