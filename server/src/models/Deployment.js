import mongoose from "mongoose";

const deploymentSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        projectName: {
            type: String,
            required: true,
            trim: true,
        },
        repoUrl: {
            type: String,
            required: true,
            trim: true,
        },
        imageName: {
            type: String,
            required: true,
            trim: true,
        },
        imageTag: {
            type: String,
            required: true,
            trim: true,
        },
        registry: {
            type: String,
            enum: ["Docker Hub", "GHCR"],
            required: true,
        },
        environment: {
            type: String,
            enum: ["Development", "Staging", "Production"],
            required: true,
        },
        deploymentUrl: {
            type: String,
            default: "",
            trim: true,
        },
        deployedBy: {
            type: String,
            required: true,
            trim: true,
        },
        deploymentStatus: {
            type: String,
            enum: ["Pending", "Building", "Success", "Failed"],
            default: "Pending",
        },
        logs: {
            type: String,
            default: "",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

deploymentSchema.index({ projectName: "text", imageName: "text", deployedBy: "text" });

const Deployment = mongoose.model("Deployment", deploymentSchema);

export default Deployment;
