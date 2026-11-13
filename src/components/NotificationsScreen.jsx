import { AlertTriangle, Info, Ban, CheckCircle2 } from 'lucide-react';

const VARIANT_STYLES = {
  warning: {
    card: 'bg-amber-50/60 border-amber-200/70',
    iconBg: 'bg-white text-amber-600',
    dot: 'bg-amber-500',
    Icon: AlertTriangle,
  },
  info: {
    card: 'bg-blue-50/50 border-blue-200/70',
    iconBg: 'bg-white text-blue-600',
    dot: 'bg-blue-500',
    Icon: Info,
  },
  danger: {
    card: 'bg-rose-50/60 border-rose-200/70',
    iconBg: 'bg-white text-rose-600',
    dot: 'bg-rose-500',
    Icon: Ban,
  },
  success: {
    card: 'bg-emerald-50/50 border-emerald-200/70',
    iconBg: 'bg-white text-emerald-600',
    dot: 'bg-emerald-500',
    Icon: CheckCircle2,
  },
};

export default function NotificationsScreen({
  notifications,
  onMarkAllRead,
  onMarkOneRead,
}) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-xs text-gray-500">
            {unreadCount} unread — <span className="font-urdu">اطلاعات</span>
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          const style = VARIANT_STYLES[n.variant] || VARIANT_STYLES.info;
          const Icon = style.Icon;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onMarkOneRead(n.id)}
              className={`w-full text-left rounded-2xl p-4 border transition-all ${style.card}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-xs ${style.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      {n.title}
                    </h3>
                    {n.unread && (
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}
                      />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-urdu">
                    {n.urdu}
                  </p>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">{n.time}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
