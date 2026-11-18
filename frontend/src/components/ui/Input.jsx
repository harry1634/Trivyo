export default function Input({ label, error, icon: Icon, rightElement, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <div className="relative">
        {Icon && <Icon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />}
        <input
          className={`w-full rounded-xl border border-ink/15 bg-white py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${Icon ? 'pl-11' : 'pl-4'} ${rightElement ? 'pr-11' : 'pr-4'} ${className}`}
          {...props}
        />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
