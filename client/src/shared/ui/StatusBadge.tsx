const colors: Record<string, string> = {
  ACTIVE:     "bg-green-100 text-green-700 border-green-200",
  REPAIRING:  "bg-yellow-100 text-yellow-700 border-yellow-200",
  DUGGING:    "bg-blue-100 text-blue-700 border-blue-200",
  FINISHED:   "bg-gray-100 text-gray-700 border-gray-200",
  SUCCESSFUL: "bg-green-100 text-green-700 border-green-200",
  FAILED:     "bg-red-100 text-red-700 border-red-200",
  INCOME:     "bg-green-100 text-green-700 border-green-200",
  OUTCOME:    "bg-red-100 text-red-700 border-red-200",
};

const labels: Record<string, string> = {
  ACTIVE: "Faol", REPAIRING: "Ta'mirda", DUGGING: "Qazilmoqda",
  FINISHED: "Tugallandi", SUCCESSFUL: "Muvaffaqiyatli", FAILED: "Muvaffaqiyatsiz",
  INCOME: "Kirim", OUTCOME: "Chiqim",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors[status] ?? "bg-gray-500/15 text-gray-400"} ${className ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}
