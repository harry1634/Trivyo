import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, LayoutDashboard, Calendar, Heart, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const LINKS = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/trips', label: 'My Trips' },
  { to: '/favorites', label: 'Favorites' },
];

// Initials when we have a name/email to work with; a generic person icon
// (not a bare "?") for the brief moment before the profile has loaded.
function initialsFor(name, email) {
  if (name) return name.trim().charAt(0).toUpperCase();
  if (email) return email.charAt(0).toUpperCase();
  return null;
}

export default function Navbar() {
  const { user, profile, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/');
  }

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive ? 'bg-primary/10 text-primary-dark' : 'text-ink/70 hover:text-ink'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#F0EDE8] bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-ink">
          Trivyo<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium text-ink transition-colors hover:bg-bg-soft"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {initialsFor(profile?.name, profile?.email) || <User size={15} />}
                </span>
                {profile?.name?.split(' ')[0] || 'Account'}
                <ChevronDown size={14} className={`text-muted transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-[#F0EDE8] bg-white py-2 shadow-lg">
                  <div className="border-b border-[#F0EDE8] px-4 py-2.5">
                    <p className="truncate text-sm font-semibold text-ink">{profile?.name || 'Traveler'}</p>
                    <p className="truncate text-xs text-muted">{profile?.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink/80 transition-colors hover:bg-bg-soft hover:text-ink">
                    <LayoutDashboard size={15} className="text-primary" /> Dashboard
                  </Link>
                  <Link to="/trips" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink/80 transition-colors hover:bg-bg-soft hover:text-ink">
                    <Calendar size={15} className="text-primary" /> My Trips
                  </Link>
                  <Link to="/favorites" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink/80 transition-colors hover:bg-bg-soft hover:text-ink">
                    <Heart size={15} className="text-primary" /> Favorites
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink/80 transition-colors hover:bg-bg-soft hover:text-ink">
                      <ShieldCheck size={15} className="text-primary" /> Admin
                    </Link>
                  )}
                  <div className="my-1 border-t border-[#F0EDE8]" />
                  <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-danger transition-colors hover:bg-red-50">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">Log in</Button>
              <Button as={Link} to="/register" size="sm">Sign up</Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-[#F0EDE8] px-4 py-4 md:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-primary/10 text-primary-dark' : 'text-ink'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink">Admin</Link>}
          <div className="my-1 border-t border-[#F0EDE8]" />
          {user ? (
            <>
              <div className="flex items-center gap-2.5 px-3 py-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {initialsFor(profile?.name, profile?.email) || <User size={15} />}
                </span>
                <div className="truncate">
                  <p className="truncate text-sm font-semibold text-ink">{profile?.name || 'Traveler'}</p>
                  <p className="truncate text-xs text-muted">{profile?.email}</p>
                </div>
              </div>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink">Dashboard</Link>
              <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink">Log in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-primary">Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
