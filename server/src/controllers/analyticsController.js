import Deployment from "../models/Deployment.js";
import Project from "../models/Project.js";

const getDashboardAnalytics = async (req, res, next) => {
    try {
        const createdBy = req.user.id;

        const [
            totalProjects,
            successfulDeployments,
            failedDeployments,
            pendingDeployments,
            buildingDeployments,
            latestActivity,
        ] = await Promise.all([
            Project.countDocuments({ createdBy }),
            Deployment.countDocuments({ createdBy, deploymentStatus: "Success" }),
            Deployment.countDocuments({ createdBy, deploymentStatus: "Failed" }),
            Deployment.countDocuments({ createdBy, deploymentStatus: "Pending" }),
            Deployment.countDocuments({ createdBy, deploymentStatus: "Building" }),
            Deployment.find({ createdBy })
                .sort({ createdAt: -1 })
                .limit(6)
                .select("projectName deploymentStatus environment createdAt deployedBy imageName imageTag"),
        ]);

        return res.json({
            totalProjects,
            successfulDeployments,
            failedDeployments,
            pendingBuilds: pendingDeployments + buildingDeployments,
            runningContainers: buildingDeployments,
            latestActivity,
        });
    } catch (error) {
        return next(error);
    }
};

export { getDashboardAnalytics };
