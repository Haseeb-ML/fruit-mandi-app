import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import { formatRs } from '../utils/format';

export default function AuctionScreen({
  auctions,
  farmers,
  buyers,
  commissionPercent,
  onAdd,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    fruit: 'Mango',
    grade: 'A-Grade',
    farmerName: farmers[0]?.name || '',
    buyerName: buyers[0]?.businessName || '',
    boxes: '',
    rate: '',
  });

  const boxesNum = Number(form.boxes) || 0;
  const rateNum = Number(form.rate) || 0;
  const gross = boxesNum * rateNum;
  const calcCommission = Math.round((gross * (commissionPercent || 6)) / 100);
  const calcNet = Math.max(0, gross - calcCommission);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (boxesNum <= 0 || rateNum <= 0) return;

    const nextNum = 140 + auctions.length + 1;
    const code = String(nextNum).padStart(4, '0');

    onAdd({
      id: `AUC-${code}`,
      code,
      date: form.date,
      fruit: form.fruit,
      grade: form.grade,
      farmerName: form.farmerName,
      buyerName: form.buyerName,
      boxes: boxesNum,
      rate: rateNum,
      commission: calcCommission,
      net: calcNet,
    });
    setModalOpen(false);
    setForm((prev) => ({ ...prev, boxes: '', rate: '' }));
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Auction / Sale</h2>
          <p className="text-xs text-gray-500">
            {auctions.length} entries — <span className="font-urdu">نیلامی</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Auction
        </button>
      </div>

      {/* Auction Cards */}
      <div className="space-y-3.5">
        {auctions.map((auc) => (
          <div
            key={auc.id}
            className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100"
          >
            {/* Card Top */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-amber-800 font-bold text-sm flex items-center justify-center shrink-0">
                  {auc.code}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{auc.id}</h3>
                  <p className="text-xs text-gray-400">{auc.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  {auc.fruit}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {auc.grade}
                </span>
              </div>
            </div>

            {/* Farmer & Buyer */}
            <div className="grid grid-cols-2 gap-3 mt-4 pb-3.5 border-b border-gray-100">
              <div>
                <p className="text-[11px] text-gray-400">
                  Farmer / <span className="font-urdu">کاشتکار</span>
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {auc.farmerName}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">
                  Buyer / <span className="font-urdu">خریدار</span>
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {auc.buyerName}
                </p>
              </div>
            </div>

            {/* Numbers Row */}
            <div className="grid grid-cols-4 gap-2 pt-3 text-center">
              <div>
                <p className="text-[11px] text-gray-400">Boxes</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {auc.boxes}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">
                  Rate / <span className="font-urdu">ریٹ</span>
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  Rs{auc.rate.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Commission</p>
                <p className="text-sm font-bold text-amber-700 mt-0.5">
                  Rs{auc.commission.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">
                  Net / <span className="font-urdu">خالص</span>
                </p>
                <p className="text-sm font-bold text-emerald-700 mt-0.5">
                  Rs{auc.net.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        title="New Auction / Sale"
        urduTitle="نئی نیلامی درج کریں"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Farmer / <span className="font-urdu">کاشتکار</span>
              </label>
              <select
                value={form.farmerName}
                onChange={(e) => setForm({ ...form, farmerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-emerald-600"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Buyer / <span className="font-urdu">خریدار</span>
              </label>
              <select
                value={form.buyerName}
                onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-emerald-600"
              >
                {buyers.map((b) => (
                  <option key={b.id} value={b.businessName}>
                    {b.businessName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Grade
              </label>
              <select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="A-Grade">A-Grade</option>
                <option value="B-Grade">B-Grade</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Boxes *
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.boxes}
                onChange={(e) => setForm({ ...form, boxes: e.target.value })}
                placeholder="80"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Rate (Rs) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })}
                placeholder="600"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Live Calculation Preview */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500">
                Commission ({commissionPercent}%):
              </span>{' '}
              <span className="font-bold text-amber-700">
                {formatRs(calcCommission)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Net Payable:</span>{' '}
              <span className="font-bold text-emerald-700">
                {formatRs(calcNet)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors"
          >
            Save Auction
          </button>
        </form>
      </Modal>
    </div>
  );
}
