export default function Logo({ light = false, size = 36, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-ink'} ${className}`}>
      <span
        className="flex shrink-0 items-center justify-center rounded-[10px] bg-primary"
        style={{ width: size, height: size }}
      >
        {/* Abstract route mark: a path curving toward a destination point. */}
        <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
          <path
            d="M3 18c4-1 5-5 8-6s5 1 8-2"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="0.5 4.2"
          />
          <circle cx="19" cy="8" r="2.4" fill="white" />
        </svg>
      </span>
      Trivyo
    </span>
  );
}
