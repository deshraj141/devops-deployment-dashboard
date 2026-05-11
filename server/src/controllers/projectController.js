import Project from "../models/Project.js";

const getProjects = async (req, res, next) => {
    try {
        const { q = "" } = req.query;

        const query = {
            createdBy: req.user.id,
            projectName: { $regex: q, $options: "i" },
        };

        const projects = await Project.find(query).sort({ createdAt: -1 });
        return res.json(projects);
    } catch (error) {
        return next(error);
    }
};

const createProject = async (req, res, next) => {
    try {
        const { projectName, repoUrl, deploymentUrl, environment } = req.body;

        if (!projectName || !repoUrl) {
            res.status(400);
            throw new Error("projectName and repoUrl are required");
        }

        const project = await Project.create({
            projectName,
            repoUrl,
            deploymentUrl,
            environment,
            createdBy: req.user.id,
        });

        return res.status(201).json(project);
    } catch (error) {
        return next(error);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!project) {
            res.status(404);
            throw new Error("Project not found");
        }

        const { projectName, repoUrl, deploymentUrl, environment } = req.body;

        project.projectName = projectName ?? project.projectName;
        project.repoUrl = repoUrl ?? project.repoUrl;
        project.deploymentUrl = deploymentUrl ?? project.deploymentUrl;
        project.environment = environment ?? project.environment;

        const updatedProject = await project.save();
        return res.json(updatedProject);
    } catch (error) {
        return next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!project) {
            res.status(404);
            throw new Error("Project not found");
        }

        return res.json({ message: "Project deleted successfully" });
    } catch (error) {
        return next(error);
    }
};

export { getProjects, createProject, updateProject, deleteProject };
