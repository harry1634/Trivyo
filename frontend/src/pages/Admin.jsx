import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { CardSkeletonGrid } from '../components/ui/LoadingSkeleton';

const TABS = ['Overview', 'Destinations', 'Places', 'Users'];

export default function Admin() {
  const { showToast } = useToast();
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [newDestination, setNewDestination] = useState({ name: '', country: 'India', state: '', description: '', latitude: '', longitude: '', avgBudgetPerDay: '', bestTimeToVisit: '', popularity: 50 });

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/destinations'),
      api.get('/admin/users'),
    ]).then(([statsRes, destRes, usersRes]) => {
      setStats(statsRes.data);
      setDestinations(destRes.data);
      setUsers(usersRes.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'Places' && destinations.length && places.length === 0) {
      Promise.all(destinations.map((d) => api.get(`/destinations/${d.id}/places`).then((r) => r.data)))
        .then((results) => setPlaces(results.flat()));
    }
  }, [tab, destinations]);

  async function handleCreateDestination() {
    try {
      const payload = { ...newDestination, latitude: Number(newDestination.latitude), longitude: Number(newDestination.longitude), avgBudgetPerDay: Number(newDestination.avgBudgetPerDay), popularity: Number(newDestination.popularity), tags: [] };
      const res = await api.post('/admin/destinations', payload);
      setDestinations((prev) => [...prev, res.data]);
      setModalOpen(false);
      showToast('Destination added', 'success');
    } catch {
      showToast('Could not add destination', 'error');
    }
  }

  async function handleDelete() {
    const { type, id } = confirmDelete;
    try {
      await api.delete(`/admin/${type}/${id}`);
      if (type === 'destinations') setDestinations((prev) => prev.filter((d) => d.id !== id));
      if (type === 'places') setPlaces((prev) => prev.filter((p) => p.id !== id));
      showToast('Deleted successfully', 'success');
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setConfirmDelete(null);
    }
  }

  if (loading) return <div className="mx-auto max-w-[1440px] px-4 py-12"><CardSkeletonGrid count={4} /></div>;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">Admin Dashboard</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === t ? 'bg-primary text-white' : 'bg-bg-soft text-ink/70'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && stats && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-ink/5">
              <p className="text-2xl font-bold text-ink">{value}</p>
              <p className="mt-1 text-xs capitalize text-muted">{key.replace(/([A-Z])/g, ' $1')}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'Destinations' && (
        <div className="mt-8">
          <div className="mb-4 flex justify-end">
            <Button size="sm" onClick={() => setModalOpen(true)}><Plus size={14} /> Add Destination</Button>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-soft text-xs uppercase text-muted">
                <tr><th className="p-3">Name</th><th className="p-3">State</th><th className="p-3">Avg Budget</th><th className="p-3">Popularity</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {destinations.map((d) => (
                  <tr key={d.id} className="border-t border-ink/5">
                    <td className="p-3 font-medium text-ink">{d.name}</td>
                    <td className="p-3 text-muted">{d.state}</td>
                    <td className="p-3">₹{d.avgBudgetPerDay}</td>
                    <td className="p-3">{d.popularity}%</td>
                    <td className="p-3 text-right">
                      <button onClick={() => setConfirmDelete({ type: 'destinations', id: d.id })} className="text-danger"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Places' && (
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-soft text-xs uppercase text-muted">
              <tr><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Destination</th><th className="p-3">Rating</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {places.map((p) => (
                <tr key={p.id} className="border-t border-ink/5">
                  <td className="p-3 font-medium text-ink">{p.name}</td>
                  <td className="p-3 capitalize text-muted">{p.type}</td>
                  <td className="p-3 capitalize text-muted">{p.destinationId}</td>
                  <td className="p-3">⭐ {p.rating}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => setConfirmDelete({ type: 'places', id: p.id })} className="text-danger"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Users' && (
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-soft text-xs uppercase text-muted">
              <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-ink/5">
                  <td className="p-3 font-medium text-ink">{u.name}</td>
                  <td className="p-3 text-muted">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Destination" footer={<Button onClick={handleCreateDestination}>Save</Button>}>
        <div className="space-y-3">
          <Input label="Name" value={newDestination.name} onChange={(e) => setNewDestination((d) => ({ ...d, name: e.target.value }))} />
          <Input label="State" value={newDestination.state} onChange={(e) => setNewDestination((d) => ({ ...d, state: e.target.value }))} />
          <Input label="Description" value={newDestination.description} onChange={(e) => setNewDestination((d) => ({ ...d, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Latitude" type="number" value={newDestination.latitude} onChange={(e) => setNewDestination((d) => ({ ...d, latitude: e.target.value }))} />
            <Input label="Longitude" type="number" value={newDestination.longitude} onChange={(e) => setNewDestination((d) => ({ ...d, longitude: e.target.value }))} />
          </div>
          <Input label="Avg budget/day" type="number" value={newDestination.avgBudgetPerDay} onChange={(e) => setNewDestination((d) => ({ ...d, avgBudgetPerDay: e.target.value }))} />
        </div>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirm delete" footer={<><Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></>}>
        <p className="text-sm text-muted">This action cannot be undone. Are you sure you want to delete this item?</p>
      </Modal>
    </div>
  );
}
