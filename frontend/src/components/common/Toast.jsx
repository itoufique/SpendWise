import { useAuth } from '../../contexts/AuthContext';

const Toast = () => {
  const { toast } = useAuth();
  if (!toast.open) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 text-sm shadow-glow text-white">
      <span className={toast.type === 'error' ? 'text-rose-400' : 'text-emerald-300'}>{toast.message}</span>
    </div>
  );
};

export default Toast;
