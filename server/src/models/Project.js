import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
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
        deploymentUrl: {
            type: String,
            default: "",
            trim: true,
        },
        environment: {
            type: String,
            enum: ["Development", "Staging", "Production"],
            default: "Development",
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

const Project = mongoose.model("Project", projectSchema);

export default Project;
