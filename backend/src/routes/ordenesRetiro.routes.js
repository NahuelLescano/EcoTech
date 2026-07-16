import { Router } from "express";
import {
  actualizarOrdenRetiro,
  eliminarOrdenRetiro,
  listarOrdenes,
  listarOrdenesPendientes,
  completarOrden,
  programarOrdenRetiro,
  despacharOrden,
} from "../controller/ordenesRetiro.controller.js";
import { middlewareValidarOrdenRetiro } from "../schemas/middlewares/validarOrdenesRetiro.js";

const ordenesRetiroRouter = Router();

ordenesRetiroRouter
  .get("/", listarOrdenes)
  .get("/pendientes", listarOrdenesPendientes)
  .post("/", middlewareValidarOrdenRetiro, programarOrdenRetiro)
  .put("/:id", middlewareValidarOrdenRetiro, actualizarOrdenRetiro)
  .delete("/:id", eliminarOrdenRetiro)
  .put("/:id/completar", completarOrden)
  .delete("/:id/despachar", despacharOrden);

export default ordenesRetiroRouter;
