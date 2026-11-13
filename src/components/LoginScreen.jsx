import { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [mobile, setMobile] = useState('0300-1234567');
  const [password, setPassword] = useState('••••••••');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mobile.trim() || !password.trim()) {
      setError('Please enter mobile number and password.');
      return;
    }
    setError('');
    onLogin({ mobile: mobile.trim(), remember });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-[#f4f6f8] to-white flex flex-col items-center justify-center px-4 py-8">
      {/* App Logo & Title */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-emerald-700/25">
          <UserCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Fruit Mandi System</h1>
        <p className="text-sm text-emerald-700 font-urdu mt-0.5">
          فروٹ منڈی آڑھتی سسٹم
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-xs text-gray-400 font-urdu mt-0.5 mb-5">
          خوش آمدید — اپنے اکاؤنٹ میں لاگ ان کریں
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Mobile Number <span className="text-gray-400 font-urdu">موبائل نمبر</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="0300-0000000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password <span className="text-gray-400 font-urdu">پاس ورڈ</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="inline-flex items-center gap-2 text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span>
                Remember Me <span className="text-gray-400 font-urdu">یاد رکھیں</span>
              </span>
            </label>
            <button
              type="button"
              onClick={() =>
                alert('Default Demo Login: any mobile number & password works.')
              }
              className="text-emerald-700 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-colors"
          >
            <span className="font-urdu">لاگ ان</span> — Login
          </button>
        </form>
      </div>
    </div>
  );
}
