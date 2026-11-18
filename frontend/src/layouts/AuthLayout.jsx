import { Link, Outlet } from 'react-router-dom';
import Logo from '../components/Logo';

export default function AuthLayout() {
  return (
    <div>
      <div className="px-6 pt-6 lg:hidden">
        <Link to="/" className="w-fit">
          <Logo size={32} />
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
