// routes/expedienteRoutes.js
import express from "express";
import {
  createExpediente,
  getExpedientesByStudent,
  addAcuerdo
} from "../../backend/controllers/expedienteController.js";

const router = express.Router();

router.post("/", createExpediente);
router.get("/student/:idEstudiante", getExpedientesByStudent);
router.post("/incidencia/:idIncidencia/acuerdos", addAcuerdo);

export default router;