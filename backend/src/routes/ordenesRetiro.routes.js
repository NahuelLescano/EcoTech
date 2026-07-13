import { Router } from "express";
import { completarOrden, listarOrdenesPendientes } from "../controller/ordenesRetiro.controller.js";

const ordenesRetiroRouter = Router();

ordenesRetiroRouter
  .get("/", listarOrdenesPendientes)
  .put("/:id/completar", completarOrden);

export default ordenesRetiroRouter;
