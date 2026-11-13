import { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, Check } from 'lucide-react';

export default function SettingsScreen({
  settings,
  onUpdateSettings,
  onBackup,
  onRestore,
  onReset,
}) {
  const fileRef = useRef(null);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleChange = (field, value) => {
    onUpdateSettings({ ...settings, [field]: value });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 1800);
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result || '{}'));
        onRestore(parsed);
      } catch {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-xs text-gray-400 font-urdu">ترتیبات</p>
        </div>
        {savedBanner && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 space-y-3.5">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Company Information
          </h3>
          <p className="text-xs text-gray-400 font-urdu">کمپنی معلومات</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Company Name <span className="font-urdu">کمپنی کا نام</span>
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Owner Name <span className="font-urdu">مالک</span>
          </label>
          <input
            type="text"
            value={settings.ownerName}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Phone <span className="font-urdu">فون</span>
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              City <span className="font-urdu">شہر</span>
            </label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            License No <span className="font-urdu">لائسنس</span>
          </label>
          <input
            type="text"
            value={settings.licenseNo}
            onChange={(e) => handleChange('licenseNo', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Address <span className="font-urdu">پتہ</span>
          </label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Commission Settings */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 space-y-3.5">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Commission Settings
          </h3>
          <p className="text-xs text-gray-400 font-urdu">کمیشن ترتیبات</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Default Commission %{' '}
              <span className="font-urdu block text-gray-400">کمیشن</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                value={settings.defaultCommissionPercent}
                onChange={(e) =>
                  handleChange(
                    'defaultCommissionPercent',
                    Number(e.target.value) || 0
                  )
                }
                className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-emerald-600"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                %
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Market Fee %{' '}
              <span className="font-urdu block text-gray-400">مارکیٹ فیس</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                value={settings.marketFeePercent}
                onChange={(e) =>
                  handleChange('marketFeePercent', Number(e.target.value) || 0)
                }
                className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-emerald-600"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 space-y-3.5">
        <div>
          <h3 className="text-base font-bold text-gray-900">Data Management</h3>
          <p className="text-xs text-gray-400 font-urdu">ڈیٹا انتظام</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onBackup}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>
              Backup — <span className="font-urdu">بیک اپ</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-amber-800 font-semibold text-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>
              Restore — <span className="font-urdu">بحالی</span>
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFilePick}
            className="hidden"
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
}
