import { useState } from 'react';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'Reset instructions sent.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to send reset token.');
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-glow">
      <h1 className="text-3xl font-semibold text-white">Forgot password</h1>
      <p className="mt-2 text-slate-400">Enter your email to receive password recovery instructions.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-300">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </label>
        <button type="submit" className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
          Request reset
        </button>
        {message && <p className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-200">{message}</p>}
      </form>
    </section>
  );
};

export default ForgotPassword;
