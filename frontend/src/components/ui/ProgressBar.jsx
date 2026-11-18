import { twMerge } from 'tailwind-merge';

export default function ProgressBar({ value, max = 100, className = '', barClassName = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={twMerge('h-2 w-full overflow-hidden rounded-full bg-bg-soft', className)}>
      <div
        className={twMerge('h-full rounded-full bg-primary transition-all duration-300', barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
