import { useEffect, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CopyButton from "../components/CopyButton";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { fetchDeploymentById, setAuthHeader } from "../services/api";

const DeploymentDetailsPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeployment = async () => {
      try {
        setLoading(true);
        setAuthHeader(token);
        const { data } = await fetchDeploymentById(id);
        setDeployment(data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load deployment details",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDeployment();
  }, [id, token]);

  if (loading) {
    return (
      <section className="glass-panel p-6">
        Loading deployment details...
      </section>
    );
  }

  if (!deployment) {
    return (
      <section className="glass-panel p-6">
        <p className="text-slate-200">Deployment not found.</p>
        <Link
          to="/deployments/history"
          className="mt-3 inline-block text-cyan-200"
        >
          Back to history
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="glass-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {deployment.projectName}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              {deployment.imageName}:{deployment.imageTag}
            </p>
          </div>
          <StatusBadge status={deployment.deploymentStatus} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel p-5 space-y-3">
          <p>
            <span className="label-text">Registry:</span> {deployment.registry}
          </p>
          <p>
            <span className="label-text">Environment:</span>{" "}
            {deployment.environment}
          </p>
          <p>
            <span className="label-text">Deployed By:</span>{" "}
            {deployment.deployedBy}
          </p>
          <p>
            <span className="label-text">Created At:</span>{" "}
            {new Date(deployment.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="label-text">Repository:</span> {deployment.repoUrl}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={deployment.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Github size={14} /> Open Repository
            </a>
            <CopyButton
              value={deployment.repoUrl}
              label="Repository URL copied"
            />
          </div>
          <p>
            <span className="label-text">Deployment URL:</span>{" "}
            {deployment.deploymentUrl || "-"}
          </p>
          <div className="flex items-center gap-2">
            {deployment.deploymentUrl ? (
              <a
                href={deployment.deploymentUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ExternalLink size={14} /> Open Deployment
              </a>
            ) : null}
            <CopyButton
              value={deployment.deploymentUrl}
              label="Deployment URL copied"
            />
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/50 p-3">
            <p className="label-text">Image</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-sm text-slate-100">
                {deployment.imageName}:{deployment.imageTag}
              </p>
              <CopyButton
                value={`${deployment.imageName}:${deployment.imageTag}`}
                label="Image copied"
              />
            </div>
          </div>
        </div>

        <div className="glass-panel p-5">
          <p className="label-text mb-3">Deployment Logs</p>
          <pre className="max-h-80 overflow-auto rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-200">
            {deployment.logs || "No logs attached for this deployment."}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default DeploymentDetailsPage;
