import { Link } from 'react-router-dom';

const Support = () => {
  return (
    <section className="mx-auto max-w-6xl space-y-8 py-10">
      <div className="glass-card rounded-[2rem] border border-white/10 p-10 shadow-glow">
        <h1 className="text-4xl font-semibold text-white">Support</h1>
        <p className="mt-4 text-slate-300">
          Need assistance? We're here to help. Browse our FAQs, submit a support request, or explore resources to get the most out of SpendWise AI.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
            <p className="mt-2 text-slate-400">Find answers to common questions about using SpendWise AI and managing your account.</p>
            <a href="#faq" className="mt-6 inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-accent">
              Browse FAQs
            </a>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Contact Support</h2>
            <p className="mt-2 text-slate-400">Submit a request and our support team will respond with personalized guidance.</p>
            <a href="mailto:support@spendwise.ai?subject=SpendWise%20AI%20Support%20Request" className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
              Email Support
            </a>
          </div>
        </div>
      </div>

      <div id="faq" className="glass-card rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-glow">
        <h2 className="text-3xl font-semibold text-white">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6">
            <h3 className="text-lg font-semibold text-white">How do I save items to my wishlist?</h3>
            <p className="mt-2 text-slate-400">Open a product page and click the wishlist icon or button. You can view saved items later from the Wishlist page.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6">
            <h3 className="text-lg font-semibold text-white">Can I access SpendWise AI from any device?</h3>
            <p className="mt-2 text-slate-400">Yes. SpendWise AI is built to work responsively across desktop and mobile browsers.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6">
            <h3 className="text-lg font-semibold text-white">How do I reset my password?</h3>
            <p className="mt-2 text-slate-400">Go to the login page and click Forgot Password. Follow the instructions to reset your account password.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/" className="rounded-full border border-white/15 px-8 py-3 text-sm font-semibold text-white transition hover:border-accent">
          Back to home
        </Link>
        <Link to="/products" className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
          Browse products
        </Link>
      </div>
    </section>
  );
};

export default Support;
