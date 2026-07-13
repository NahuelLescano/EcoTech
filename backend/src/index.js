import express from "express";
import cors from "cors";
import morgan from "morgan";
import depositosRoutes from "./routes/depositos.routes.js";
import contenedoresRoutes from "./routes/contenedores.routes.js";
import ordenesRetiroRouter from "./routes/ordenesRetiro.routes.js";

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 8000;

app.use("/api/depositos", depositosRoutes);
app.use("/api/contenedores", contenedoresRoutes);
app.use("/api/ordenes-retiros", ordenesRetiroRouter);

app.get("/health", (_req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`EcoTechAPI available at http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Depositos API available at http://localhost:${PORT}/api/depositos`);
  console.log(`Contenedores API available at http://localhost:${PORT}/api/contenedores`);
  console.log(`Ordenes de Retiros API available at http://localhost:${PORT}/api/ordenes-retiros`);
});
