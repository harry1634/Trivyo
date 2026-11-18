const STYLES = {
  primary: 'bg-primary/10 text-primary-dark',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-ink/5 text-ink',
};

export default function Badge({ children, variant = 'primary', className = '' }) {
  if (!children) return null;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[variant]} ${className}`}>
      {children}
    </span>
  );
}
