import express from "express";
import cors from "cors";
import depositosRoutes from "./routes/depositos.routes.js";
import contenedoresRoutes from "./routes/contenedores.routes.js";

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/api/depositos", depositosRoutes);
app.use("/api/contenedores", contenedoresRoutes);

app.get("/health", (_req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`EcoTechAPI available at http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Depositos API available at http://localhost:${PORT}/api/depositos`);
  console.log(`Contenedores API available at http://localhost:${PORT}/contenedores`);
});
