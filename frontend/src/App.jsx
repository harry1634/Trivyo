import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import TripCreate from './pages/TripCreate';
import RecommendationResults from './pages/RecommendationResults';
import ItineraryView from './pages/ItineraryView';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import TripDashboard from './pages/TripDashboard';
import Favorites from './pages/Favorites';
import Admin from './pages/Admin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/trips/new" element={<TripCreate />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDashboard />} />
          <Route path="/trips/:id/recommendations" element={<RecommendationResults />} />
          <Route path="/trips/:tripId/itinerary/:itineraryId" element={<ItineraryView />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
