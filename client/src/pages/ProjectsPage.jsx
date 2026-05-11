import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ProjectModal from "../components/ProjectModal";
import { useAuth } from "../context/AuthContext";
import {
  createProject,
  deleteProject,
  fetchProjects,
  setAuthHeader,
  updateProject,
} from "../services/api";

const ProjectsPage = () => {
  const { token, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setAuthHeader(token);
      const { data } = await fetchProjects({ q: search });
      setProjects(data);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      toast.error(error.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [search]);

  const handleSave = async (payload) => {
    try {
      setIsSubmitting(true);
      setAuthHeader(token);
      if (editingProject) {
        await updateProject(editingProject._id, payload);
        toast.success("Project updated");
      } else {
        await createProject(payload);
        toast.success("Project created");
      }
      setIsModalOpen(false);
      setEditingProject(null);
      await loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) {
      return;
    }

    try {
      setAuthHeader(token);
      await deleteProject(id);
      toast.success("Project deleted");
      await loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="space-y-4">
      <div className="glass-panel p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-white">Projects</h2>
          <button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        <label className="relative mb-4 block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-field pl-9"
            placeholder="Search projects"
          />
        </label>

        <div className="overflow-hidden rounded-xl border border-white/15">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-slate-900/65 text-left text-xs uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Environment</th>
                  <th className="px-4 py-3">Repository</th>
                  <th className="px-4 py-3">Deployment URL</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-900/35 text-slate-200">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-center" colSpan={5}>
                      Loading projects...
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center" colSpan={5}>
                      No projects yet.
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project._id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium">
                        {project.projectName}
                      </td>
                      <td className="px-4 py-3">{project.environment}</td>
                      <td className="px-4 py-3 text-cyan-200">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Repo Link
                        </a>
                      </td>
                      <td className="px-4 py-3 text-cyan-200">
                        {project.deploymentUrl ? (
                          <a
                            href={project.deploymentUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Visit
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setIsModalOpen(true);
                            }}
                            className="text-cyan-200"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="text-rose-300"
                          >
                            <Trash2 size={16} />
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

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleSave}
        editingProject={editingProject}
        isSubmitting={isSubmitting}
      />
    </section>
  );
};

export default ProjectsPage;
