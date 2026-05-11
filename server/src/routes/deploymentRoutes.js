import express from "express";
import {
    createDeployment,
    deleteDeployment,
    getDeploymentById,
    getDeployments,
    updateDeployment,
} from "../controllers/deploymentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getDeployments).post(createDeployment);
router.route("/:id").get(getDeploymentById).put(updateDeployment).delete(deleteDeployment);

export default router;
