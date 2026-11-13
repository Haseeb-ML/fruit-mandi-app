import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import Modal from './Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function ArrivalScreen({
  arrivals,
  farmers,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    farmerName: farmers[0]?.name || '',
    fruit: 'Mango',
    grade: 'A-Grade',
    boxes: '',
    weightKg: '',
  });

  const filtered = arrivals.filter(
    (a) =>
      a.farmerName.toLowerCase().includes(query.toLowerCase()) ||
      a.fruit.toLowerCase().includes(query.toLowerCase()) ||
      a.date.includes(query)
  );

  const openNew = () => {
    setEditingId(null);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      farmerName: farmers[0]?.name || '',
      fruit: 'Mango',
      grade: 'A-Grade',
      boxes: '',
      weightKg: '',
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      date: item.date,
      farmerName: item.farmerName,
      fruit: item.fruit,
      grade: item.grade,
      boxes: String(item.boxes),
      weightKg: String(item.weightKg),
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const boxes = Number(form.boxes) || 0;
    const weightKg = Number(form.weightKg) || boxes * 20;
    if (!form.farmerName.trim() || boxes <= 0) return;

    const payload = {
      date: form.date,
      farmerName: form.farmerName.trim(),
      fruit: form.fruit,
      grade: form.grade,
      boxes,
      weightKg,
    };

    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Fruit Arrival</h2>
          <p className="text-xs text-gray-500">
            {arrivals.length} entries — <span className="font-urdu">پھل آمد</span>
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Arrival
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by farmer, fruit, date — تلاش کریں"
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[660px]">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/70">
                <th className="py-3.5 px-4">
                  DATE / <span className="font-urdu">تاریخ</span>
                </th>
                <th className="py-3.5 px-4">
                  FARMER / <span className="font-urdu">کاشتکار</span>
                </th>
                <th className="py-3.5 px-4">
                  FRUIT / <span className="font-urdu">پھل</span>
                </th>
                <th className="py-3.5 px-4">
                  GRADE / <span className="font-urdu">درجہ</span>
                </th>
                <th className="py-3.5 px-4">
                  BOXES / <span className="font-urdu">ڈبے</span>
                </th>
                <th className="py-3.5 px-4">
                  WEIGHT / <span className="font-urdu">وزن</span>
                </th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">
                    {item.farmerName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {item.fruit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.grade === 'A-Grade'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {item.grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {item.boxes}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">{item.weightKg} kg</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit arrival"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete arrival"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                    No arrival entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Fruit Arrival' : 'New Fruit Arrival'}
        urduTitle={editingId ? 'پھل آمد ترمیم' : 'نیا پھل آمد درج کریں'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Date / <span className="font-urdu">تاریخ</span>
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Farmer / <span className="font-urdu">کاشتکار</span> *
            </label>
            <select
              value={form.farmerName}
              onChange={(e) => setForm({ ...form, farmerName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-emerald-600"
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} ({f.village})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Fruit / <span className="font-urdu">پھل</span>
              </label>
              <select
                value={form.fruit}
                onChange={(e) => setForm({ ...form, fruit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="Mango">Mango</option>
                <option value="Citrus">Citrus</option>
                <option value="Banana">Banana</option>
                <option value="Apple">Apple</option>
                <option value="Guava">Guava</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Grade / <span className="font-urdu">درجہ</span>
              </label>
              <select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="A-Grade">A-Grade</option>
                <option value="B-Grade">B-Grade</option>
                <option value="C-Grade">C-Grade</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Boxes / <span className="font-urdu">ڈبے</span> *
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.boxes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    boxes: e.target.value,
                    weightKg: e.target.value ? String(Number(e.target.value) * 20) : '',
                  })
                }
                placeholder="80"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Weight (kg) / <span className="font-urdu">وزن</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                placeholder="1600"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
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
        title="Delete Arrival?"
        urduMessage="پھل آمد حذف کریں؟"
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
