import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-glow">
      <h1 className="text-3xl font-semibold text-white">Create account</h1>
      <p className="mt-2 text-slate-400">Start receiving budget-smart product recommendations.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-300">
          Name
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </label>
        <label className="block text-sm text-slate-300">
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
          {loading ? 'Saving...' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Already have an account? <Link to="/login" className="text-white underline">Login</Link>
      </p>
    </section>
  );
};

export default Register;
