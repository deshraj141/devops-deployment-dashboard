import { motion } from "framer-motion";

const MetricCard = ({
  title,
  value,
  accent = "cyan",
  delay = 0,
  icon: Icon,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.35 }}
      className={`metric-card metric-${accent} animate-enter rounded-2xl border border-white/15 bg-slate-900/55 p-4`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
          {title}
        </p>
        {Icon ? (
          <div className="rounded-lg border border-white/15 bg-slate-900/65 p-1.5 text-slate-200">
            <Icon size={14} />
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </motion.article>
  );
};

export default MetricCard;
