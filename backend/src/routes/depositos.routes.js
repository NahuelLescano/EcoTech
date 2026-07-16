import { Router } from "express";
import {
  deleteDeposito,
  getDeposito,
  getDepositos,
  putDeposito,
  registrarDeposito,
} from "../controller/depositos.controller.js";
import { middlewareValidarDeposito } from "../schemas/middlewares/validarDatos.js";

const router = Router();

// La peticion pasa por el middleware, si esta todo OK continua la ejecucion hacia el controller
router.post("/", middlewareValidarDeposito, registrarDeposito);
router.get("/", getDepositos);
router.get("/:id", getDeposito);
router.put("/:id", putDeposito);
router.delete("/:id", deleteDeposito);

export default router;
