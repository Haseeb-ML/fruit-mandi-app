import { Trash2, AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({
  open,
  title,
  urduMessage,
  icon = 'trash',
  onCancel,
  onConfirm,
}) {
  if (!open) return null;
  const Icon = icon === 'warning' ? AlertTriangle : Trash2;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 font-urdu mt-1.5">{urduMessage}</p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-sm font-semibold text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
