import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Boxes,
  Clock3,
  ExternalLink,
  PlusCircle,
  Rocket,
  ServerCrash,
  Timer,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import {
  fetchDashboardAnalytics,
  fetchDeployments,
  setAuthHeader,
} from "../services/api";

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalProjects: 0,
    successfulDeployments: 0,
    failedDeployments: 0,
    pendingBuilds: 0,
    runningContainers: 0,
    latestActivity: [],
  });
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const recentDeployments = useMemo(
    () => deployments.slice(0, 6),
    [deployments],
  );

  const statusBreakdown = useMemo(() => {
    const total = Math.max(deployments.length, 1);
    const success = deployments.filter(
      (item) => item.deploymentStatus === "Success",
    ).length;
    const failed = deployments.filter(
      (item) => item.deploymentStatus === "Failed",
    ).length;
    const building = deployments.filter(
      (item) => item.deploymentStatus === "Building",
    ).length;
    const pending = deployments.filter(
      (item) => item.deploymentStatus === "Pending",
    ).length;

    return {
      success: Math.round((success / total) * 100),
      failed: Math.round((failed / total) * 100),
      building: Math.round((building / total) * 100),
      pending: Math.round((pending / total) * 100),
    };
  }, [deployments]);

  const chartData = useMemo(
    () => [
      {
        name: "Success",
        value: analytics.successfulDeployments,
        color: "#34d399",
      },
      { name: "Failed", value: analytics.failedDeployments, color: "#fb7185" },
      {
        name: "Pending/Building",
        value: analytics.pendingBuilds,
        color: "#f59e0b",
      },
    ],
    [analytics],
  );

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setAuthHeader(token);

      const [analyticsResponse, deploymentResponse] = await Promise.all([
        fetchDashboardAnalytics(),
        fetchDeployments({ sort: "newest" }),
      ]);

      setAnalytics(analyticsResponse.data);
      setDeployments(deploymentResponse.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load dashboard analytics";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  return (
    <section className="space-y-4">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-panel p-5"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-cyan-200">Welcome back,</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              {user?.name || "DevOps Engineer"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Centralized visibility for builds, releases, and runtime
              deployment states across all environments.
            </p>
          </div>
          <Link
            to="/deployments/new"
            className="btn-primary inline-flex items-center gap-2 self-start md:self-auto"
          >
            <PlusCircle size={16} /> Add Deployment
          </Link>
        </div>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total Projects"
          value={analytics.totalProjects}
          accent="cyan"
          delay={20}
          icon={Boxes}
        />
        <MetricCard
          title="Successful Deployments"
          value={analytics.successfulDeployments}
          accent="emerald"
          delay={80}
          icon={Rocket}
        />
        <MetricCard
          title="Failed Deployments"
          value={analytics.failedDeployments}
          accent="rose"
          delay={140}
          icon={ServerCrash}
        />
        <MetricCard
          title="Pending Builds"
          value={analytics.pendingBuilds}
          accent="amber"
          delay={200}
          icon={Clock3}
        />
        <MetricCard
          title="Running Containers"
          value={analytics.runningContainers}
          accent="sky"
          delay={260}
          icon={Timer}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="glass-panel p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Activity size={18} />
              <h3 className="text-lg font-semibold">
                Latest Deployment Activity
              </h3>
            </div>
            <Link to="/deployments/history" className="text-sm text-cyan-200">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <LoadingSkeleton key={idx} className="h-20" />
              ))
            ) : analytics.latestActivity.length === 0 ? (
              <EmptyState
                title="No deployment activity yet"
                description="Create a deployment to start monitoring build and release activity."
                action={
                  <Link
                    to="/deployments/new"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <PlusCircle size={15} /> Add Deployment
                  </Link>
                }
              />
            ) : (
              analytics.latestActivity.map((item) => (
                <div
                  key={`${item._id}-${item.createdAt}`}
                  className="relative rounded-xl border border-white/10 bg-slate-950/40 p-4"
                >
                  <span className="absolute -left-2 top-6 h-2 w-2 rounded-full bg-cyan-300" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-white">{item.projectName}</p>
                    <StatusBadge status={item.deploymentStatus} showProgress />
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    {item.imageName}:{item.imageTag} by {item.deployedBy}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="glass-panel p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Deployment Distribution
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={84}
                  innerRadius={48}
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-1 space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-emerald-200">Success</span>
                <span>{statusBreakdown.success}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-emerald-400"
                  style={{ width: `${statusBreakdown.success}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-rose-200">Failed</span>
                <span>{statusBreakdown.failed}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-rose-400"
                  style={{ width: `${statusBreakdown.failed}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <Rocket size={16} className="text-cyan-200" />
              <p className="mt-2 text-slate-300">Release Velocity</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <ServerCrash size={16} className="text-rose-200" />
              <p className="mt-2 text-slate-300">Failure Tracking</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <Clock3 size={16} className="text-amber-200" />
              <p className="mt-2 text-slate-300">Queue State</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <Timer size={16} className="text-sky-200" />
              <p className="mt-2 text-slate-300">Runtime Pulse</p>
            </div>
          </div>
        </article>
      </div>

      <article className="glass-panel p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">
            Recent Deployments
          </h3>
          <Link to="/deployments/history" className="text-sm text-cyan-200">
            Open History
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="max-h-[360px] overflow-auto">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-slate-900/90 text-left text-xs uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Project
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Image
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    Status
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-900/90 px-4 py-3">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-900/35 text-slate-200">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3" colSpan={4}>
                        <LoadingSkeleton className="h-7" rounded="rounded-lg" />
                      </td>
                    </tr>
                  ))
                ) : recentDeployments.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center" colSpan={4}>
                      No deployment records yet.
                    </td>
                  </tr>
                ) : (
                  recentDeployments.map((item) => (
                    <tr key={item._id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium">
                        {item.projectName}
                      </td>
                      <td className="px-4 py-3">
                        {item.imageName}:{item.imageTag}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={item.deploymentStatus}
                          showProgress
                        />
                      </td>
                      <td className="px-4 py-3">
                        {item.deploymentUrl ? (
                          <a
                            href={item.deploymentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-200 hover:text-cyan-100"
                          >
                            Open <ExternalLink size={14} />
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      {errorMessage ? (
        <p className="text-sm text-rose-300">{errorMessage}</p>
      ) : null}
    </section>
  );
};

export default DashboardPage;
