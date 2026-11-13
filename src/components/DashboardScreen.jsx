import { useState } from 'react';
import {
  TrendingUp,
  CircleDollarSign,
  Wallet,
  Clock,
  Package,
  ReceiptText,
  User,
  Users,
  Inbox,
  BarChart2,
  Banknote,
  BookOpen,
  FileSpreadsheet,
  FileText,
  CreditCard,
  Minus,
} from 'lucide-react';
import { formatRs } from '../utils/format';

export default function DashboardScreen({
  auctions,
  arrivals,
  buyers,
  expenses,
  weeklySales,
  transactions,
  onNavigate,
  onOpenTool,
}) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(5); // Sat default
  const [selectedFruit, setSelectedFruit] = useState('Mango');

  const extraAuctionSales = auctions
    .slice(3)
    .reduce((sum, a) => sum + a.boxes * a.rate, 0);
  const extraCommission = auctions
    .slice(3)
    .reduce((sum, a) => sum + a.commission, 0);
  const extraBoxes = arrivals.slice(4).reduce((sum, a) => sum + a.boxes, 0);
  const extraLots = Math.max(0, arrivals.length - 4);

  const todaySale = 254000 + extraAuctionSales;
  const todayCommission = 15240 + extraCommission;
  const totalPending = buyers.reduce((sum, b) => sum + (b.outstanding || 0), 0);
  const pendingParties = buyers.filter((b) => b.outstanding > 0).length;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const cashInHand = Math.max(0, 87500 + extraCommission - (totalExpenses - 8400));
  const todayLots = 24 + extraLots;
  const todayBoxes = 1840 + extraBoxes;

  const kpis = [
    {
      label: "Today's Sale",
      urdu: 'آج کی فروخت',
      value: formatRs(todaySale),
      hint: '+12%',
      hintColor: 'text-emerald-600',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-700',
      onClick: () => onNavigate('auction'),
    },
    {
      label: "Today's Commission",
      urdu: 'آج کا کمیشن',
      value: formatRs(todayCommission),
      hint: '+8%',
      hintColor: 'text-rose-600',
      icon: CircleDollarSign,
      iconBg: 'bg-amber-50 text-amber-700',
      onClick: () => onNavigate('auction'),
    },
    {
      label: 'Cash in Hand',
      urdu: 'نقد رقم',
      value: formatRs(cashInHand),
      hint: '-Rs5k',
      hintColor: 'text-blue-700',
      icon: Wallet,
      iconBg: 'bg-blue-50 text-blue-700',
      onClick: () => onOpenTool('cashbook'),
    },
    {
      label: 'Pending Payments',
      urdu: 'باقی ادائیگیاں',
      value: formatRs(totalPending > 300000 ? totalPending : 123000),
      hint: `${pendingParties} parties`,
      hintColor: 'text-rose-700',
      icon: Clock,
      iconBg: 'bg-rose-50 text-rose-700',
      onClick: () => onNavigate('buyers'),
    },
    {
      label: "Today's Arrivals",
      urdu: 'آج کی آمد',
      value: `${todayLots} Lots`,
      hint: `${todayBoxes.toLocaleString('en-IN')} Boxes`,
      hintColor: 'text-purple-700',
      icon: Package,
      iconBg: 'bg-purple-50 text-purple-700',
      onClick: () => onNavigate('arrival'),
    },
    {
      label: "Today's Expenses",
      urdu: 'آج کے اخراجات',
      value: formatRs(totalExpenses),
      hint: 'Labour+Transport',
      hintColor: 'text-emerald-600',
      icon: ReceiptText,
      iconBg: 'bg-teal-50 text-teal-700',
      onClick: () => onOpenTool('expenses'),
    },
  ];

  const quickMenu = [
    { label: 'Farmers', urdu: 'کاشتکار', icon: User, color: 'bg-emerald-50 text-emerald-700', onClick: () => onNavigate('farmers') },
    { label: 'Buyers', urdu: 'خریدار', icon: Users, color: 'bg-blue-50 text-blue-700', onClick: () => onNavigate('buyers') },
    { label: 'Arrival', urdu: 'آمد', icon: Inbox, color: 'bg-purple-50 text-purple-700', onClick: () => onNavigate('arrival') },
    { label: 'Auction', urdu: 'نیلامی', icon: BarChart2, color: 'bg-orange-50 text-orange-700', onClick: () => onNavigate('auction') },
    { label: 'Payment', urdu: 'ادائیگی', icon: Banknote, color: 'bg-teal-50 text-teal-700', onClick: () => onOpenTool('payment') },
    { label: 'Ledger', urdu: 'کھاتہ', icon: BookOpen, color: 'bg-indigo-50 text-indigo-700', onClick: () => onOpenTool('ledger') },
    { label: 'Expenses', urdu: 'اخراجات', icon: CircleDollarSign, color: 'bg-rose-50 text-rose-700', onClick: () => onOpenTool('expenses') },
    { label: 'Reports', urdu: 'رپورٹ', icon: FileSpreadsheet, color: 'bg-pink-50 text-pink-700', onClick: () => onOpenTool('reports') },
    { label: 'Invoice', urdu: 'انوائس', icon: FileText, color: 'bg-amber-50 text-amber-700', onClick: () => onOpenTool('invoice') },
    { label: 'Cash Book', urdu: 'نقد کتاب', icon: CreditCard, color: 'bg-cyan-50 text-cyan-700', onClick: () => onOpenTool('cashbook') },
  ];

  const chartW = 300;
  const chartH = 140;
  const maxY = 260000;
  const points = weeklySales.map((d, i) => ({
    x: (i / (weeklySales.length - 1)) * chartW,
    y: chartH - (Math.min(d.sales, maxY) / maxY) * (chartH - 12) - 6,
    commY: chartH - (Math.min(d.commission, maxY) / maxY) * (chartH - 12) - 4,
    ...d,
  }));

  const buildSmoothPath = (pts, key = 'y') => {
    if (!pts.length) return '';
    return pts.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p[key]}`;
      const prev = pts[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `${acc} C ${cx} ${prev[key]}, ${cx} ${p[key]}, ${p.x} ${p[key]}`;
    }, '');
  };

  const salesPath = buildSmoothPath(points, 'y');
  const commPath = buildSmoothPath(points, 'commY');
  const areaPath = `${salesPath} L ${chartW} ${chartH} L 0 ${chartH} Z`;
  const activePt = points[selectedDayIdx] || points[5];

  const fruitCounts = [
    { name: 'Mango', boxes: 340 + arrivals.filter((a) => a.fruit === 'Mango').length * 10 - 20 },
    { name: 'Apple', boxes: 245 },
    { name: 'Banana', boxes: 190 },
    { name: 'Citrus', boxes: 150 },
  ];
  const maxBoxes = Math.max(...fruitCounts.map((f) => f.boxes), 340);

  return (
    <div className="space-y-4">
      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={kpi.onClick}
              className="text-left bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-emerald-200 transition-all active:scale-[0.99]"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${kpi.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
              <p className="text-[11px] text-gray-400 font-urdu mb-1">{kpi.urdu}</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {kpi.value}
              </p>
              <p className={`text-xs font-semibold mt-1 ${kpi.hintColor}`}>
                {kpi.hint}
              </p>
            </button>
          );
        })}
      </div>

      {/* Weekly Sales Chart Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Weekly Sales</h2>
            <p className="text-xs text-gray-400 font-urdu">ہفتہ وار فروخت</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            This Week
          </span>
        </div>

        <div className="relative flex gap-2 mt-2">
          <div className="flex flex-col justify-between text-[11px] text-gray-400 py-1 select-none w-9 text-right">
            <span>260k</span>
            <span>195k</span>
            <span>130k</span>
            <span>65k</span>
            <span>0k</span>
          </div>

          <div className="relative flex-1">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-40 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#15803d" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#15803d" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={r * (chartH - 6) + 3}
                  x2={chartW}
                  y2={r * (chartH - 6) + 3}
                  stroke="#e5e7eb"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              {activePt && (
                <line
                  x1={activePt.x}
                  y1="0"
                  x2={activePt.x}
                  y2={chartH}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
              )}

              <path d={areaPath} fill="url(#salesFill)" />
              <path
                d={salesPath}
                fill="none"
                stroke="#166534"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={commPath}
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {points.map((pt, idx) => (
                <g
                  key={pt.day}
                  className="cursor-pointer"
                  onClick={() => setSelectedDayIdx(idx)}
                  onMouseEnter={() => setSelectedDayIdx(idx)}
                >
                  <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                  {idx === selectedDayIdx && (
                    <>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#166534"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.commY}
                        r="4"
                        fill="#d97706"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </>
                  )}
                </g>
              ))}
            </svg>

            {activePt && (
              <div
                className="absolute top-6 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg px-3.5 py-2.5 text-xs pointer-events-none transition-all"
                style={{
                  left:
                    selectedDayIdx >= 4
                      ? 'auto'
                      : `${(selectedDayIdx / 6) * 65}%`,
                  right: selectedDayIdx >= 4 ? '12%' : 'auto',
                }}
              >
                <p className="font-bold text-gray-800 mb-1">{activePt.day}</p>
                <p className="text-amber-600 font-semibold">
                  : {formatRs(activePt.commission)}
                </p>
                <p className="text-emerald-700 font-semibold">
                  : {formatRs(activePt.sales)}
                </p>
              </div>
            )}

            <div className="flex justify-between text-[11px] text-gray-400 mt-1.5">
              {weeklySales.map((d, idx) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`px-1 rounded transition-colors ${
                    idx === selectedDayIdx
                      ? 'text-emerald-700 font-bold'
                      : 'hover:text-gray-700'
                  }`}
                >
                  {d.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Fruits Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="mb-3">
          <h2 className="text-base font-bold text-gray-900">Top Fruits</h2>
          <p className="text-xs text-gray-400 font-urdu">سب سے زیادہ فروخت</p>
        </div>

        <div className="relative space-y-3">
          {fruitCounts.map((f) => {
            const pct = Math.round((f.boxes / maxBoxes) * 100);
            const isSelected = selectedFruit === f.name;
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => setSelectedFruit(f.name)}
                className="w-full flex items-center gap-3 group text-left"
              >
                <span className="w-14 text-xs font-medium text-gray-500 text-right shrink-0">
                  {f.name}
                </span>
                <div className="flex-1 h-8 bg-gray-50 rounded-r-lg overflow-hidden relative flex items-center">
                  <div
                    className={`h-full rounded-r-lg transition-all duration-300 ${
                      isSelected
                        ? 'bg-emerald-700'
                        : 'bg-emerald-600/90 group-hover:bg-emerald-700'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                  {isSelected && (
                    <span className="ml-2 text-xs font-semibold text-emerald-800 whitespace-nowrap pr-2">
                      {f.boxes} Boxes
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Menu (فوری رسائی) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900">Quick Menu</h2>
          <p className="text-xs text-gray-400 font-urdu">فوری رسائی</p>
        </div>
        <div className="grid grid-cols-5 gap-y-4 gap-x-2 text-center">
          {quickMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="flex flex-col items-center group"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 transition-transform group-active:scale-95 ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-gray-800 leading-tight">
                  {item.label}
                </span>
                <span className="text-[10px] text-gray-400 font-urdu">
                  {item.urdu}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions (حالیہ لین دین) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Recent Transactions
            </h2>
            <p className="text-xs text-gray-400 font-urdu">حالیہ لین دین</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenTool('cashbook')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View All →
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {transactions.slice(0, 5).map((tx) => {
            const isDebit = tx.type === 'debit';
            const isPayment = tx.category === 'payment';
            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isDebit
                        ? 'bg-rose-50 text-rose-600'
                        : isPayment
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isDebit ? (
                      <Minus className="w-4 h-4" />
                    ) : isPayment ? (
                      <Wallet className="w-4 h-4" />
                    ) : (
                      <BarChart2 className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {tx.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {tx.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-bold ${
                      isDebit ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {isDebit ? '' : '+'}
                    {formatRs(tx.amount)}
                  </p>
                  <p className="text-[11px] text-gray-400">{tx.id}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
