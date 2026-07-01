import { Router } from "express";
import { registrarDeposito } from "../controller/depositos.controller.js";

const router = Router();

router.post("/", registrarDeposito);

export default router;
