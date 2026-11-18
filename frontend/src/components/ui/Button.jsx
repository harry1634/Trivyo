import { twMerge } from 'tailwind-merge';

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  secondary: 'bg-bg-soft text-ink hover:bg-orange-100',
  outline: 'border border-ink/15 text-ink hover:bg-bg-soft',
  ghost: 'text-ink hover:bg-bg-soft',
  danger: 'bg-danger text-white hover:bg-red-700',
  inverse: 'bg-white text-primary-dark hover:bg-orange-50 shadow-sm',
  'outline-inverse': 'border border-white/40 text-white hover:bg-white/10',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const RADII = {
  full: 'rounded-full',
  lg: 'rounded-2xl',
  md: 'rounded-xl',
};

export default function Button({ variant = 'primary', size = 'md', rounded = 'full', className = '', as: Comp = 'button', ...props }) {
  // twMerge resolves conflicting Tailwind classes (e.g. a passed-in border
  // color vs. the variant's own) by keeping the last one for each CSS
  // property, regardless of Tailwind's generated stylesheet order — so a
  // caller's className reliably overrides the variant/radius defaults.
  const classes = twMerge(
    'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
    RADII[rounded],
    VARIANTS[variant],
    SIZES[size],
    className
  );

  return <Comp className={classes} {...props} />;
}
