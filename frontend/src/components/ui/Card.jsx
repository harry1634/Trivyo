export default function Card({ children, className = '', hoverable = false }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 ${hoverable ? 'transition-shadow hover:shadow-md' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
