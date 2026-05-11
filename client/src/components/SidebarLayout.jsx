import {
  BellRing,
  Boxes,
  LayoutDashboard,
  ListChecks,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: Boxes },
  { to: "/deployments/new", label: "Add Deployment", icon: PlusCircle },
  { to: "/deployments/history", label: "Deployment History", icon: ListChecks },
];

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-shell min-h-screen text-slate-100">
      <div className="mx-auto flex w-full max-w-[1500px] gap-4 p-4 lg:gap-6 lg:p-6">
        <aside className="glass-panel hidden w-72 shrink-0 flex-col p-4 lg:flex">
          <Link
            to="/dashboard"
            className="mb-6 flex items-center gap-3 rounded-xl bg-slate-900/40 p-3"
          >
            <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-300">
              <BellRing size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                DevOps
              </p>
              <h1 className="text-sm font-semibold">Deployment Monitor</h1>
            </div>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-xl border border-white/15 bg-slate-950/30 p-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/20 text-sm font-semibold text-cyan-100">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user?.name || "Engineer"}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {user?.email || "user"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary mt-3 inline-flex w-full items-center justify-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        <main className="w-full">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/15 bg-slate-900/45 px-4 py-3 lg:hidden">
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-cyan-100"
            >
              DevOps Monitor
            </Link>
            <button
              onClick={handleLogout}
              className="btn-secondary inline-flex items-center gap-2 text-xs"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
          <div className="mb-4 flex gap-2 overflow-auto rounded-2xl border border-white/15 bg-slate-900/45 p-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs ${
                      isActive
                        ? "bg-cyan-500/25 text-cyan-100"
                        : "text-slate-300"
                    }`
                  }
                >
                  <Icon size={14} /> {item.label}
                </NavLink>
              );
            })}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
