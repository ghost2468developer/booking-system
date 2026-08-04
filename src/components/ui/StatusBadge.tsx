const statusConfig: Record<string, { label: string; classes: string }> = {
  pending: { label: "Pending Review", classes: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  approved: { label: "Approved", classes: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", classes: "bg-red-100 text-red-800 border-red-200" },
  in_progress: { label: "In Progress", classes: "bg-purple-100 text-purple-800 border-purple-200" },
  completed: { label: "Completed", classes: "bg-blue-100 text-blue-800 border-blue-200" },
  cancelled: { label: "Cancelled", classes: "bg-slate-100 text-slate-600 border-slate-200" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, classes: "bg-gray-100 text-gray-800" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.classes}`}>
      {config.label}
    </span>
  );
}
