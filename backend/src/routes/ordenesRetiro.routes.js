import { Router } from "express";
import {
  actualizarOrdenRetiro,
  eliminarOrdenRetiro,
  listarOrdenes,
  listarOrdenesPendientes,
  completarOrden,
  programarOrdenRetiro,
} from "../controller/ordenesRetiro.controller.js";
import { middlewareValidarOrdenRetiro } from "../schemas/middlewares/validarOrdenesRetiro.js";

const ordenesRetiroRouter = Router();

ordenesRetiroRouter
  .get("/", listarOrdenes)
  .get("/pendientes", listarOrdenesPendientes)
  .get("/todas", listarOrdenes)
  .post("/", middlewareValidarOrdenRetiro, programarOrdenRetiro)
  .put("/:id", middlewareValidarOrdenRetiro, actualizarOrdenRetiro)
  .delete("/:id", eliminarOrdenRetiro)
  .put("/:id/completar", completarOrden);

export default ordenesRetiroRouter;
