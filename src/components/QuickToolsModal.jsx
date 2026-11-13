import { useState } from 'react';
import Modal from './Modal';
import { formatRs } from '../utils/format';

export default function QuickToolsModal({
  tool,
  onClose,
  farmers,
  buyers,
  auctions,
  expenses,
  transactions,
  onAddExpense,
  onRecordPayment,
}) {
  const [expTitle, setExpTitle] = useState('');
  const [expCat, setExpCat] = useState('Labour');
  const [expAmt, setExpAmt] = useState('');

  const [payBuyerId, setPayBuyerId] = useState(buyers[0]?.id || '');
  const [payAmt, setPayAmt] = useState('');

  if (!tool) return null;

  const titles = {
    payment: ['Record Payment', 'ادائیگی درج کریں'],
    ledger: ['Party Ledger', 'کھاتہ تفصیل'],
    expenses: ['Daily Expenses', 'روزانہ اخراجات'],
    reports: ['Mandi Reports', 'منڈی رپورٹ'],
    invoice: ['Auction Invoice', 'نیلامی انوائس'],
    cashbook: ['Cash Book', 'نقد کتاب'],
  };
  const [title, urduTitle] = titles[tool] || ['Tool', ''];

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const amount = Number(expAmt) || 0;
    if (!expTitle.trim() || amount <= 0) return;
    onAddExpense({
      title: expTitle.trim(),
      subtitle: `${expCat} Expense`,
      category: expCat,
      amount,
      date: new Date().toISOString().slice(0, 10),
    });
    setExpTitle('');
    setExpAmt('');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const amount = Number(payAmt) || 0;
    if (!payBuyerId || amount <= 0) return;
    onRecordPayment(payBuyerId, amount);
    setPayAmt('');
    onClose();
  };

  return (
    <Modal open={Boolean(tool)} title={title} urduTitle={urduTitle} onClose={onClose}>
      {tool === 'payment' && (
        <form onSubmit={handlePaymentSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Buyer / <span className="font-urdu">خریدار</span>
            </label>
            <select
              value={payBuyerId}
              onChange={(e) => setPayBuyerId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
            >
              {buyers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.businessName} (Due: {formatRs(b.outstanding)})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Amount Received (Rs) / <span className="font-urdu">وصول رقم</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={payAmt}
              onChange={(e) => setPayAmt(e.target.value)}
              placeholder="e.g. 25000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold"
          >
            Save Payment — <span className="font-urdu">محفوظ</span>
          </button>
        </form>
      )}

      {tool === 'expenses' && (
        <div className="space-y-4">
          <form onSubmit={handleExpenseSubmit} className="space-y-3">
            <input
              type="text"
              required
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              placeholder="Expense description (e.g. Unloading)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={expCat}
                onChange={(e) => setExpCat(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
              >
                <option value="Labour">Labour</option>
                <option value="Transport">Transport</option>
                <option value="Shop">Shop / Chai</option>
              </select>
              <input
                type="number"
                min="1"
                required
                value={expAmt}
                onChange={(e) => setExpAmt(e.target.value)}
                placeholder="Amount (Rs)"
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold"
            >
              Add Expense
            </button>
          </form>

          <div className="divide-y divide-gray-100 border-t border-gray-100 pt-2">
            {expenses.map((ex) => (
              <div key={ex.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-gray-900">{ex.title}</p>
                  <p className="text-gray-400">{ex.category} · {ex.date}</p>
                </div>
                <span className="font-bold text-rose-600">
                  -{formatRs(ex.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tool === 'ledger' && (
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-gray-500">Farmers Balance</p>
          {farmers.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-xs"
            >
              <div>
                <p className="font-semibold text-gray-900">{f.name}</p>
                <p className="text-gray-400">{f.village}</p>
              </div>
              <span
                className={`font-bold ${
                  f.balanceType === 'Receivable'
                    ? 'text-rose-600'
                    : f.balance > 0
                    ? 'text-emerald-700'
                    : 'text-gray-400'
                }`}
              >
                {f.balance > 0 ? `${formatRs(f.balance)} (${f.balanceType})` : 'Settled'}
              </span>
            </div>
          ))}
        </div>
      )}

      {tool === 'reports' && (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 flex justify-between">
            <span>Total Auctions Recorded</span>
            <span className="font-bold">{auctions.length}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50 text-blue-900 flex justify-between">
            <span>Total Buyers Outstanding</span>
            <span className="font-bold">
              {formatRs(buyers.reduce((s, b) => s + b.outstanding, 0))}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-900 flex justify-between">
            <span>Total Expenses</span>
            <span className="font-bold">
              {formatRs(expenses.reduce((s, e) => s + e.amount, 0))}
            </span>
          </div>
        </div>
      )}

      {tool === 'invoice' && (
        <div className="space-y-3">
          {auctions.slice(0, 3).map((a) => (
            <div
              key={a.id}
              className="p-3.5 rounded-xl border border-gray-200 text-xs space-y-1"
            >
              <div className="flex justify-between font-bold text-gray-900">
                <span>{a.id} — {a.fruit} ({a.grade})</span>
                <span className="text-emerald-700">{formatRs(a.net)}</span>
              </div>
              <p className="text-gray-500">
                {a.farmerName} → {a.buyerName} · {a.boxes} boxes @ Rs{a.rate}
              </p>
            </div>
          ))}
        </div>
      )}

      {tool === 'cashbook' && (
        <div className="divide-y divide-gray-100 text-xs">
          {transactions.map((t) => (
            <div key={t.id} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{t.title}</p>
                <p className="text-gray-400">{t.subtitle}</p>
              </div>
              <span
                className={`font-bold ${
                  t.type === 'debit' ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {t.type === 'debit' ? '-' : '+'}
                {formatRs(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
