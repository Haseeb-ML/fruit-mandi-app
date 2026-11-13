import { useState } from 'react';
import { Plus, Search, Phone, MapPin, Pencil, Trash2 } from 'lucide-react';
import Modal from './Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { formatNum, formatRs } from '../utils/format';

const EMPTY_BUYER = {
  businessName: '',
  contactName: '',
  phone: '',
  mandi: '',
  creditLimit: '50000',
};

export default function BuyersScreen({ buyers, onAdd, onUpdate, onDelete }) {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_BUYER);

  const filtered = buyers.filter(
    (b) =>
      b.businessName.toLowerCase().includes(query.toLowerCase()) ||
      b.contactName.toLowerCase().includes(query.toLowerCase()) ||
      b.mandi.toLowerCase().includes(query.toLowerCase())
  );

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_BUYER);
    setModalOpen(true);
  };

  const openEdit = (buyer) => {
    setEditingId(buyer.id);
    setForm({
      businessName: buyer.businessName,
      contactName: buyer.contactName,
      phone: buyer.phone,
      mandi: buyer.mandi,
      creditLimit: String(buyer.creditLimit || '50000'),
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.businessName.trim()) return;
    const payload = {
      businessName: form.businessName.trim(),
      contactName: form.contactName.trim() || 'Owner',
      phone: form.phone.trim() || '0300-0000000',
      mandi: form.mandi.trim() || 'Lahore Mandi',
      creditLimit: Math.max(1000, Number(form.creditLimit) || 50000),
    };
    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd({ ...payload, outstanding: 0 });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Buyers</h2>
          <p className="text-xs text-gray-500">
            {buyers.length} total — <span className="font-urdu">خریدار</span>
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Buyer
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search buyers — خریدار تلاش کریں"
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((buyer) => {
          const ratio = Math.min(
            100,
            Math.round((buyer.outstanding / Math.max(1, buyer.creditLimit)) * 100)
          );
          const barColor =
            ratio >= 95
              ? 'bg-rose-600'
              : ratio >= 75
              ? 'bg-amber-500'
              : 'bg-emerald-500';
          const initial = buyer.businessName.charAt(0).toUpperCase();

          return (
            <div
              key={buyer.id}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 font-bold text-base flex items-center justify-center shrink-0">
                    {initial}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">
                      {buyer.businessName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {buyer.contactName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(buyer)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit buyer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(buyer)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete buyer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3.5 space-y-1.5 text-xs text-gray-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {buyer.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {buyer.mandi}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500">
                    Outstanding / <span className="font-urdu">کریڈٹ</span>
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatRs(buyer.outstanding)} / {formatNum(buyer.creditLimit)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-sm text-gray-400 border border-gray-100">
          No buyers found.
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Buyer — ترمیم' : 'Add Buyer — نیا خریدار'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Shop Name <span className="text-gray-400 font-urdu">دکان کا نام</span>
            </label>
            <input
              type="text"
              required
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              placeholder="Khan Fruit Centre"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Owner <span className="text-gray-400 font-urdu">مالک</span>
            </label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder="Asif Khan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone <span className="text-gray-400 font-urdu">فون</span>
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0300-1122334"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Market <span className="text-gray-400 font-urdu">منڈی</span>
            </label>
            <input
              type="text"
              value={form.mandi}
              onChange={(e) => setForm({ ...form, mandi: e.target.value })}
              placeholder="Lahore Mandi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Credit Limit <span className="text-gray-400 font-urdu">کریڈٹ حد</span>
            </label>
            <input
              type="number"
              min="1000"
              value={form.creditLimit}
              onChange={(e) => setForm({ ...form, creditLimit: e.target.value })}
              placeholder="50000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
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
        title="Delete Buyer?"
        urduMessage="خریدار حذف کریں؟"
        icon="warning"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          onDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
