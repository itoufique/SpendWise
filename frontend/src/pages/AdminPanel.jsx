import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState(null);

  const loadAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <section className="mx-auto max-w-6xl space-y-8 py-6">
      <div className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-glow">
        <h1 className="text-3xl font-semibold text-white">Admin dashboard</h1>
        <p className="mt-2 text-slate-400">Manage products, categories, and monitor search analytics.</p>
      </div>
      {!analytics ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-slate-300">Fetching admin analytics...</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="glass-card rounded-[2rem] border border-white/10 p-6 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Total users</h2>
            <p className="mt-3 text-slate-300">{analytics.totalUsers}</p>
          </div>
          <div className="glass-card rounded-[2rem] border border-white/10 p-6 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Total products</h2>
            <p className="mt-3 text-slate-300">{analytics.totalProducts}</p>
          </div>
          <div className="glass-card rounded-[2rem] border border-white/10 p-6 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Total searches</h2>
            <p className="mt-3 text-slate-300">{analytics.totalSearches}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPanel;
