import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-glow">
      <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
      <p className="mt-2 text-slate-400">Login to continue your smart shopping journey.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-300">
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500" />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <Link to="/forgot-password" className="hover:text-white">Forgot password?</Link>
        <Link to="/register" className="hover:text-white">Create account</Link>
      </div>
    </section>
  );
};

export default Login;
