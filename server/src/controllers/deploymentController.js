import Deployment from "../models/Deployment.js";
import Project from "../models/Project.js";

const getDeployments = async (req, res, next) => {
    try {
        const {
            q = "",
            status = "all",
            environment = "all",
            registry = "all",
            sort = "newest",
        } = req.query;

        const query = {
            createdBy: req.user.id,
            $or: [
                { projectName: { $regex: q, $options: "i" } },
                { imageName: { $regex: q, $options: "i" } },
                { deployedBy: { $regex: q, $options: "i" } },
            ],
        };

        if (status !== "all") {
            query.deploymentStatus = status;
        }

        if (environment !== "all") {
            query.environment = environment;
        }

        if (registry !== "all") {
            query.registry = registry;
        }

        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            status: { deploymentStatus: 1, createdAt: -1 },
        };

        const deployments = await Deployment.find(query)
            .sort(sortMap[sort] || sortMap.newest)
            .populate("project", "projectName environment");

        return res.json(deployments);
    } catch (error) {
        return next(error);
    }
};

const getDeploymentById = async (req, res, next) => {
    try {
        const deployment = await Deployment.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        }).populate("project", "projectName repoUrl deploymentUrl environment");

        if (!deployment) {
            res.status(404);
            throw new Error("Deployment not found");
        }

        return res.json(deployment);
    } catch (error) {
        return next(error);
    }
};

const createDeployment = async (req, res, next) => {
    try {
        const {
            projectId,
            imageName,
            imageTag,
            registry,
            environment,
            deploymentUrl,
            deployedBy,
            deploymentStatus,
            logs,
        } = req.body;

        if (!projectId || !imageName || !imageTag || !registry || !environment || !deployedBy) {
            res.status(400);
            throw new Error("Missing required deployment fields");
        }

        const project = await Project.findOne({ _id: projectId, createdBy: req.user.id });
        if (!project) {
            res.status(404);
            throw new Error("Project not found");
        }

        const deployment = await Deployment.create({
            project: project._id,
            projectName: project.projectName,
            repoUrl: project.repoUrl,
            imageName,
            imageTag,
            registry,
            environment,
            deploymentUrl: deploymentUrl || project.deploymentUrl,
            deployedBy,
            deploymentStatus,
            logs,
            createdBy: req.user.id,
        });

        return res.status(201).json(deployment);
    } catch (error) {
        return next(error);
    }
};

const updateDeployment = async (req, res, next) => {
    try {
        const deployment = await Deployment.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!deployment) {
            res.status(404);
            throw new Error("Deployment not found");
        }

        const fields = [
            "imageName",
            "imageTag",
            "registry",
            "environment",
            "deploymentUrl",
            "deployedBy",
            "deploymentStatus",
            "logs",
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                deployment[field] = req.body[field];
            }
        });

        const updatedDeployment = await deployment.save();
        return res.json(updatedDeployment);
    } catch (error) {
        return next(error);
    }
};

const deleteDeployment = async (req, res, next) => {
    try {
        const deployment = await Deployment.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!deployment) {
            res.status(404);
            throw new Error("Deployment not found");
        }

        return res.json({ message: "Deployment deleted successfully" });
    } catch (error) {
        return next(error);
    }
};

export {
    getDeployments,
    getDeploymentById,
    createDeployment,
    updateDeployment,
    deleteDeployment,
};
