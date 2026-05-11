import { useEffect, useState } from "react";

const initialState = {
  projectName: "",
  repoUrl: "",
  deploymentUrl: "",
  environment: "Development",
};

const ProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingProject,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingProject) {
      setFormData({
        projectName: editingProject.projectName || "",
        repoUrl: editingProject.repoUrl || "",
        deploymentUrl: editingProject.deploymentUrl || "",
        environment: editingProject.environment || "Development",
      });
    } else {
      setFormData(initialState);
    }
  }, [editingProject]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-xl p-6">
        <h2 className="text-xl font-semibold text-white">
          {editingProject ? "Edit Project" : "Create Project"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="input-field"
            placeholder="Project Name"
            required
          />
          <input
            name="repoUrl"
            value={formData.repoUrl}
            onChange={handleChange}
            className="input-field"
            placeholder="Repository URL"
            required
          />
          <input
            name="deploymentUrl"
            value={formData.deploymentUrl}
            onChange={handleChange}
            className="input-field"
            placeholder="Deployment URL"
          />
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

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : editingProject
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
