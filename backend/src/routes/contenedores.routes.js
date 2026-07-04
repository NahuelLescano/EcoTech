import { Router } from "express";
import {
  createContenedor,
  deleteContenedor,
  getContenedores,
  updateContenedor,
} from "../controller/contenedores.controller.js";

const router = Router();

router.get("/", getContenedores);
router.post("/", createContenedor);
router.put("/:id", updateContenedor);
router.delete("/:id", deleteContenedor);

export default router;