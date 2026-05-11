import { DatabaseZap } from "lucide-react";

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="glass-panel flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 p-3 text-cyan-200">
        <DatabaseZap size={20} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-300">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
