import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createDeployment,
  fetchProjects,
  setAuthHeader,
} from "../services/api";

const AddDeploymentPage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectId: "",
    imageName: "",
    imageTag: "latest",
    registry: "Docker Hub",
    environment: "Development",
    deploymentUrl: "",
    deployedBy: user?.name || "",
    deploymentStatus: "Pending",
    logs: "",
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setAuthHeader(token);
        const { data } = await fetchProjects();
        setProjects(data);
        if (data[0]) {
          setFormData((prev) => ({ ...prev, projectId: data[0]._id }));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load projects");
      }
    };

    loadProjects();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setAuthHeader(token);
      await createDeployment(formData);
      toast.success("Deployment recorded successfully");
      navigate("/deployments/history");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create deployment",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="glass-panel p-5">
      <h2 className="text-2xl font-semibold text-white">Add Deployment</h2>
      <p className="mt-1 text-sm text-slate-300">
        Track every build and release activity in one place.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-1 md:col-span-2">
          <span className="label-text">Project</span>
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            className="input-field"
            required
          >
            {projects.length === 0 ? (
              <option value="">No projects available</option>
            ) : (
              projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.projectName}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="space-y-1">
          <span className="label-text">Image Name</span>
          <input
            name="imageName"
            value={formData.imageName}
            onChange={handleChange}
            className="input-field"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="label-text">Image Tag</span>
          <input
            name="imageTag"
            value={formData.imageTag}
            onChange={handleChange}
            className="input-field"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="label-text">Registry</span>
          <select
            name="registry"
            value={formData.registry}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Docker Hub">Docker Hub</option>
            <option value="GHCR">GHCR</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="label-text">Environment</span>
          <select
            name="environment"
            value={formData.environment}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Development">Development</option>
            <option value="Staging">Staging</option>
            <option value="Production">Production</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="label-text">Deployment Status</span>
          <select
            name="deploymentStatus"
            value={formData.deploymentStatus}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Pending">Pending</option>
            <option value="Building">Building</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="label-text">Deployed By</span>
          <input
            name="deployedBy"
            value={formData.deployedBy}
            onChange={handleChange}
            className="input-field"
            required
          />
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="label-text">Deployment URL</span>
          <input
            name="deploymentUrl"
            value={formData.deploymentUrl}
            onChange={handleChange}
            className="input-field"
          />
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="label-text">Logs</span>
          <textarea
            name="logs"
            value={formData.logs}
            onChange={handleChange}
            rows={6}
            className="input-field"
            placeholder="Paste build/deployment logs"
          />
        </label>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || projects.length === 0}
          >
            {isSubmitting ? "Recording..." : "Save Deployment"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddDeploymentPage;
