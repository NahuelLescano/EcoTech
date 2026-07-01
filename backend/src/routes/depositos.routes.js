import { Router } from "express";
import { registrarDeposito } from "../controller/depositos.controller.js";
import { middlewareValidarDeposito } from "../schemas/middlewares/validarDatos.js";

const router = Router();

// La peticion pasa por el middleware, si esta todo OK continua la ejecucion hacia el controller
router.post("/", middlewareValidarDeposito, registrarDeposito);

export default router;
