import { useEffect, useState } from 'react';
import {
  Home,
  User,
  Users,
  Inbox,
  BarChart2,
  Menu,
  Bell,
} from 'lucide-react';
import {
  INITIAL_ARRIVALS,
  INITIAL_AUCTIONS,
  INITIAL_BUYERS,
  INITIAL_EXPENSES,
  INITIAL_FARMERS,
  INITIAL_SETTINGS,
  INITIAL_WEEKLY_SALES,
} from './data/initialData';
import { getInitials, getTodayDisplay } from './utils/format';
import DashboardScreen from './components/DashboardScreen';
import FarmersScreen from './components/FarmersScreen';
import BuyersScreen from './components/BuyersScreen';
import ArrivalScreen from './components/ArrivalScreen';
import AuctionScreen from './components/AuctionScreen';
import SettingsScreen from './components/SettingsScreen';

const STORAGE_KEY = 'al_barkat_fruit_mandi_v1';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, headerTitle: 'Dashboard' },
  { id: 'farmers', label: 'Farmers', icon: User, headerTitle: 'Farmers' },
  { id: 'buyers', label: 'Buyers', icon: Users, headerTitle: 'Buyers' },
  { id: 'arrival', label: 'Arrival', icon: Inbox, headerTitle: 'Arrival' },
  { id: 'auction', label: 'Auction', icon: BarChart2, headerTitle: 'Auction' },
  { id: 'more', label: 'More', icon: Menu, headerTitle: 'Settings' },
];

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const saved = loadSavedState();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifOpen, setNotifOpen] = useState(false);

  const [settings, setSettings] = useState(saved?.settings || INITIAL_SETTINGS);
  const [farmers, setFarmers] = useState(saved?.farmers || INITIAL_FARMERS);
  const [buyers, setBuyers] = useState(saved?.buyers || INITIAL_BUYERS);
  const [arrivals, setArrivals] = useState(saved?.arrivals || INITIAL_ARRIVALS);
  const [auctions, setAuctions] = useState(saved?.auctions || INITIAL_AUCTIONS);
  const [expenses, setExpenses] = useState(saved?.expenses || INITIAL_EXPENSES);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ settings, farmers, buyers, arrivals, auctions, expenses })
      );
    } catch {
      // Ignore quota errors
    }
  }, [settings, farmers, buyers, arrivals, auctions, expenses]);

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];
  const initials = getInitials(settings.ownerName);

  // Farmer handlers
  const handleAddFarmer = (data) => {
    setFarmers((prev) => [{ id: `f-${Date.now()}`, ...data }, ...prev]);
  };
  const handleUpdateFarmer = (id, data) => {
    setFarmers((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
  };
  const handleDeleteFarmer = (id) => {
    setFarmers((prev) => prev.filter((f) => f.id !== id));
  };

  // Buyer handlers
  const handleAddBuyer = (data) => {
    setBuyers((prev) => [{ id: `b-${Date.now()}`, ...data }, ...prev]);
  };
  const handleUpdateBuyer = (id, data) => {
    setBuyers((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
  };
  const handleDeleteBuyer = (id) => {
    setBuyers((prev) => prev.filter((b) => b.id !== id));
  };

  // Arrival handler
  const handleAddArrival = (data) => {
    setArrivals((prev) => [{ id: `arr-${Date.now()}`, ...data }, ...prev]);
  };

  // Auction handler
  const handleAddAuction = (data) => {
    setAuctions((prev) => [data, ...prev]);
  };

  // Backup / Restore / Reset
  const handleBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      farmers,
      buyers,
      arrivals,
      auctions,
      expenses,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fruit-mandi-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (data) => {
    if (data.settings) setSettings(data.settings);
    if (Array.isArray(data.farmers)) setFarmers(data.farmers);
    if (Array.isArray(data.buyers)) setBuyers(data.buyers);
    if (Array.isArray(data.arrivals)) setArrivals(data.arrivals);
    if (Array.isArray(data.auctions)) setAuctions(data.auctions);
    if (Array.isArray(data.expenses)) setExpenses(data.expenses);
    alert('Backup restored successfully!');
  };

  const handleReset = () => {
    if (!window.confirm('Reset all data back to demo defaults?')) return;
    setSettings(INITIAL_SETTINGS);
    setFarmers(INITIAL_FARMERS);
    setBuyers(INITIAL_BUYERS);
    setArrivals(INITIAL_ARRIVALS);
    setAuctions(INITIAL_AUCTIONS);
    setExpenses(INITIAL_EXPENSES);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              {currentTab.headerTitle}
            </h1>
            <p className="text-xs text-gray-400">{getTodayDisplay()}</p>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('more')}
              className="w-9 h-9 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shadow-sm"
              title={settings.ownerName}
            >
              {initials}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-3.5 z-40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800">
                    Notifications
                  </span>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] text-emerald-700 font-semibold"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50/70 text-amber-900">
                    <p className="font-semibold">Fruit Palace near credit limit</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Rs 1,20,000 / 150,000 outstanding
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 text-emerald-900">
                    <p className="font-semibold">Today&apos;s Auction Summary</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      {auctions.length} auctions recorded ({settings.companyName})
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pt-4">
        {activeTab === 'dashboard' && (
          <DashboardScreen
            auctions={auctions}
            arrivals={arrivals}
            buyers={buyers}
            expenses={expenses}
            weeklySales={INITIAL_WEEKLY_SALES}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'farmers' && (
          <FarmersScreen
            farmers={farmers}
            onAdd={handleAddFarmer}
            onUpdate={handleUpdateFarmer}
            onDelete={handleDeleteFarmer}
          />
        )}
        {activeTab === 'buyers' && (
          <BuyersScreen
            buyers={buyers}
            onAdd={handleAddBuyer}
            onUpdate={handleUpdateBuyer}
            onDelete={handleDeleteBuyer}
          />
        )}
        {activeTab === 'arrival' && (
          <ArrivalScreen
            arrivals={arrivals}
            farmers={farmers}
            onAdd={handleAddArrival}
          />
        )}
        {activeTab === 'auction' && (
          <AuctionScreen
            auctions={auctions}
            farmers={farmers}
            buyers={buyers}
            commissionPercent={settings.defaultCommissionPercent}
            onAdd={handleAddAuction}
          />
        )}
        {activeTab === 'more' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={setSettings}
            onBackup={handleBackup}
            onRestore={handleRestore}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
        <div className="max-w-3xl mx-auto grid grid-cols-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-1 transition-colors ${
                  isActive
                    ? 'text-emerald-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-0.5 ${
                    isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'
                  }`}
                />
                <span
                  className={`text-[10px] sm:text-xs ${
                    isActive ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
