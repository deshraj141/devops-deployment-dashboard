import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, ExternalLink, Github, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import CopyButton from "../components/CopyButton";
import DeploymentDetailsModal from "../components/DeploymentDetailsModal";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import {
  deleteDeployment,
  fetchDeploymentById,
  fetchDeployments,
  setAuthHeader,
  updateDeployment,
} from "../services/api";

const DeploymentHistoryPage = () => {
  const { token } = useAuth();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [environment, setEnvironment] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadDeployments = async () => {
    try {
      setLoading(true);
      setAuthHeader(token);
      const { data } = await fetchDeployments({
        q: query,
        status,
        environment,
        sort,
      });
      setDeployments(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load deployments",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeployments();
  }, [query, status, environment, sort]);

  const summary = useMemo(() => {
    return {
      total: deployments.length,
      success: deployments.filter((item) => item.deploymentStatus === "Success")
        .length,
      failed: deployments.filter((item) => item.deploymentStatus === "Failed")
        .length,
    };
  }, [deployments]);

  const handleDelete = async (id) => {
    try {
      setAuthHeader(token);
      await deleteDeployment(id);
      toast.success("Deployment deleted");
      await loadDeployments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleOpenDetails = async (id) => {
    try {
      setAuthHeader(token);
      const { data } = await fetchDeploymentById(id);
      setSelectedDeployment(data);
      setDetailsOpen(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load deployment details",
      );
    }
  };

  const handleStatusChange = async (deployment, nextStatus) => {
    try {
      setAuthHeader(token);
      await updateDeployment(deployment._id, { deploymentStatus: nextStatus });
      toast.success("Deployment status updated");
      await loadDeployments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  return (
    <section className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <div className="glass-panel p-4">
          <p className="text-sm text-slate-400">Total Deployments</p>
          <p className="mt-2 text-3xl font-semibold">{summary.total}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-slate-400">Successful</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">
            {summary.success}
          </p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-slate-400">Failed</p>
          <p className="mt-2 text-3xl font-semibold text-rose-300">
            {summary.failed}
          </p>
        </div>
      </motion.div>

      <div className="glass-panel p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row">
          <label className="relative w-full">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="input-field pl-9"
              placeholder="Search deployments by project name"
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="input-field lg:w-52"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Building">Building</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            value={environment}
            onChange={(event) => setEnvironment(event.target.value)}
            className="input-field lg:w-52"
          >
            <option value="all">All Environments</option>
            <option value="Development">Development</option>
            <option value="Staging">Staging</option>
            <option value="Production">Production</option>
          </select>
          <button
            onClick={() =>
              setSort((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
            className="btn-secondary inline-flex items-center justify-center gap-2 lg:w-44"
          >
            <ArrowUpDown size={15} />{" "}
            {sort === "newest" ? "Latest First" : "Oldest First"}
          </button>
          <Link
            to="/deployments/new"
            className="btn-primary inline-flex items-center justify-center lg:w-44"
          >
            Add Deployment
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/15">
          <div className="max-h-[520px] overflow-auto">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-slate-900/85 text-left text-xs uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Project
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Image
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Repo
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Environment
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Status
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Created
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-900/35 text-slate-200">
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3" colSpan={7}>
                        <LoadingSkeleton className="h-8" rounded="rounded-lg" />
                      </td>
                    </tr>
                  ))
                ) : deployments.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8" colSpan={7}>
                      <EmptyState
                        title="No deployments found"
                        description="Try changing filters or add a new deployment activity."
                        action={
                          <Link to="/deployments/new" className="btn-primary">
                            Add Deployment
                          </Link>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  deployments.map((deployment) => (
                    <tr key={deployment._id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium">
                        {deployment.projectName}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[180px]">
                            {deployment.imageName}:{deployment.imageTag}
                          </span>
                          <CopyButton
                            value={`${deployment.imageName}:${deployment.imageTag}`}
                            label="Image copied"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={deployment.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-200 hover:text-cyan-100"
                        >
                          <Github size={14} /> Repo
                        </a>
                      </td>
                      <td className="px-4 py-3">{deployment.environment}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-2">
                          <StatusBadge
                            status={deployment.deploymentStatus}
                            showProgress
                          />
                          <select
                            value={deployment.deploymentStatus}
                            onChange={(event) =>
                              handleStatusChange(deployment, event.target.value)
                            }
                            className="input-field h-8 py-0 text-xs"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Building">Building</option>
                            <option value="Success">Success</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(deployment.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            className="text-cyan-200"
                            onClick={() => handleOpenDetails(deployment._id)}
                          >
                            Details
                          </button>
                          {deployment.deploymentUrl ? (
                            <a
                              href={deployment.deploymentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-cyan-200 hover:text-cyan-100"
                            >
                              Live <ExternalLink size={14} />
                            </a>
                          ) : null}
                          <CopyButton
                            value={deployment.deploymentUrl}
                            label="Deployment URL copied"
                          />
                          <button
                            onClick={() => {
                              setDeleteTarget(deployment);
                              setConfirmDeleteOpen(true);
                            }}
                            className="text-rose-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeploymentDetailsModal
        isOpen={detailsOpen}
        deployment={selectedDeployment}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedDeployment(null);
        }}
      />

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        title="Delete deployment entry"
        message={`Are you sure you want to remove ${deleteTarget?.projectName || "this deployment"}? This action cannot be undone.`}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={async () => {
          await handleDelete(deleteTarget?._id);
          setConfirmDeleteOpen(false);
          setDeleteTarget(null);
        }}
      />
    </section>
  );
};

export default DeploymentHistoryPage;
