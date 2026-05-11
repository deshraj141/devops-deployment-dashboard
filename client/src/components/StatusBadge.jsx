const statusStyles = {
  Pending: "bg-amber-500/20 text-amber-200 border-amber-400/40",
  Building: "bg-sky-500/20 text-sky-200 border-sky-400/40",
  Success: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  Failed: "bg-rose-500/20 text-rose-200 border-rose-400/40",
};

const StatusBadge = ({ status, showProgress = false }) => {
  return (
    <span className="inline-flex flex-col gap-1">
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
          statusStyles[status] ||
          "bg-slate-500/20 text-slate-200 border-slate-400/40"
        }`}
      >
        {status}
      </span>
      {showProgress && status === "Building" ? (
        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-2/3 animate-pulse rounded-full bg-sky-400" />
        </span>
      ) : null}
    </span>
  );
};

export default StatusBadge;
