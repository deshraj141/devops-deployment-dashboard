import { ExternalLink, Github, Server } from "lucide-react";
import StatusBadge from "./StatusBadge";
import CopyButton from "./CopyButton";

const DeploymentDetailsModal = ({ isOpen, deployment, onClose }) => {
  if (!isOpen || !deployment) {
    return null;
  }

  const imageRef = `${deployment.imageName}:${deployment.imageTag}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {deployment.projectName}
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Deployment details and runtime metadata
            </p>
          </div>
          <StatusBadge status={deployment.deploymentStatus} showProgress />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
            <p className="label-text">Docker Image</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="truncate text-sm text-slate-100">{imageRef}</p>
              <CopyButton value={imageRef} label="Image copied" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
            <p className="label-text">Deployment URL</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="truncate text-sm text-slate-100">
                {deployment.deploymentUrl || "N/A"}
              </p>
              <div className="flex items-center gap-2">
                <CopyButton
                  value={deployment.deploymentUrl}
                  label="URL copied"
                />
                {deployment.deploymentUrl ? (
                  <a
                    href={deployment.deploymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-icon"
                    title="Open deployment"
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
            <p className="label-text">Repository</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="truncate text-sm text-slate-100">
                {deployment.repoUrl}
              </p>
              <a
                href={deployment.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-icon"
                title="Open repository"
              >
                <Github size={14} />
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
            <p className="label-text">Environment</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-100">
              <Server size={14} /> {deployment.environment}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/45 p-4">
          <p className="label-text mb-2">Logs</p>
          <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-200">
            {deployment.logs || "No logs attached for this deployment."}
          </pre>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentDetailsModal;
