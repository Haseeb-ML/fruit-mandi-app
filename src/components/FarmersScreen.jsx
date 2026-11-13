import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import Modal from './Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { formatRs } from '../utils/format';

const EMPTY_FARMER = {
  name: '',
  phone: '',
  village: '',
  address: '',
  cnic: '',
  fruit: '',
};

const FRUIT_OPTIONS = [
  'Mango',
  'Apple',
  'Banana',
  'Citrus',
  'Grapes',
  'Guava',
  'Pomegranate',
  'Other',
];

export default function FarmersScreen({ farmers, onAdd, onUpdate, onDelete }) {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FARMER);

  const filtered = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.village.toLowerCase().includes(query.toLowerCase()) ||
      f.fruit.toLowerCase().includes(query.toLowerCase())
  );

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FARMER);
    setModalOpen(true);
  };

  const openEdit = (farmer) => {
    setEditingId(farmer.id);
    setForm({
      name: farmer.name,
      phone: farmer.phone,
      village: farmer.village,
      address: farmer.address || '',
      cnic: farmer.cnic || '',
      fruit: farmer.fruit || 'Mango',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.village.trim()) return;
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || '0300-0000000',
      village: form.village.trim(),
      address: form.address.trim(),
      cnic: form.cnic.trim(),
      fruit: form.fruit || 'Mango',
    };
    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd({ ...payload, balance: 0, balanceType: 'Settled' });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Farmers</h2>
          <p className="text-xs text-gray-500">
            {farmers.length} total — <span className="font-urdu">کاشتکار</span>
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Farmer
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search farmers — کاشتکار تلاش کریں"
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/70">
                <th className="py-3.5 px-4">
                  NAME / <span className="font-urdu">نام</span>
                </th>
                <th className="py-3.5 px-4">
                  MOBILE / <span className="font-urdu">موبائل</span>
                </th>
                <th className="py-3.5 px-4">
                  VILLAGE / <span className="font-urdu">گاؤں</span>
                </th>
                <th className="py-3.5 px-4">
                  FRUIT / <span className="font-urdu">پھل</span>
                </th>
                <th className="py-3.5 px-4">
                  BALANCE / <span className="font-urdu">بیلنس</span>
                </th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {farmer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{farmer.name}</p>
                        {farmer.address && (
                          <p className="text-xs text-gray-400">{farmer.address}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                    {farmer.phone}
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">{farmer.village}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {farmer.fruit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {farmer.balance > 0 ? (
                      <div>
                        <p
                          className={`font-bold ${
                            farmer.balanceType === 'Receivable'
                              ? 'text-rose-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {formatRs(farmer.balance)}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {farmer.balanceType}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(farmer)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit farmer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(farmer)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete farmer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                    No farmers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Farmer' : 'Add Farmer'}
        urduTitle={editingId ? 'کاشتکار ترمیم' : 'نیا کاشتکار'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Name <span className="text-gray-400 font-urdu">نام</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Muhammad Ali Khan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mobile <span className="text-gray-400 font-urdu">موبائل</span>
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0301-2345678"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Village <span className="text-gray-400 font-urdu">گاؤں</span>
            </label>
            <input
              type="text"
              required
              value={form.village}
              onChange={(e) => setForm({ ...form, village: e.target.value })}
              placeholder="Multan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Address <span className="text-gray-400 font-urdu">پتہ</span>
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Chowk Kumharan, Multan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              CNIC (Optional){' '}
              <span className="text-gray-400 font-urdu">شناختی کارڈ</span>
            </label>
            <input
              type="text"
              value={form.cnic}
              onChange={(e) => setForm({ ...form, cnic: e.target.value })}
              placeholder="36302-1234567-1"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Fruit Type <span className="text-gray-400 font-urdu">پھل کی قسم</span>
            </label>
            <select
              value={form.fruit}
              onChange={(e) => setForm({ ...form, fruit: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-emerald-600"
            >
              <option value="">Select...</option>
              {FRUIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors"
            >
              Save — <span className="font-urdu">محفوظ</span>
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        title="Delete Farmer?"
        urduMessage="کاشتکار حذف کریں؟ یہ عمل واپس نہیں ہو سکتا۔"
        icon="trash"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          onDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
