import { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <section className="mx-auto max-w-6xl space-y-8 py-6">
      <div className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-glow">
        <h1 className="text-3xl font-semibold text-white">User dashboard</h1>
        <p className="mt-2 text-slate-400">Your saved products, recent search activity, and recommendation history.</p>
      </div>
      {!profile ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-slate-300">Loading dashboard...</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="glass-card rounded-[2rem] border border-white/10 p-6 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Saved products</h2>
            <p className="mt-3 text-slate-300">{profile.wishlist.length} items in wishlist</p>
          </div>
          <div className="glass-card rounded-[2rem] border border-white/10 p-6 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Search history</h2>
            <p className="mt-3 text-slate-300">Showing latest {profile.searchHistory.length} searches.</p>
          </div>
          <div className="glass-card rounded-[2rem] border border-white/10 p-6 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Recommendation history</h2>
            <p className="mt-3 text-slate-300">Latest {profile.recommendationHistory.length} suggestions.</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
