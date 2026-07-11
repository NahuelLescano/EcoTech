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

const port = 8000;

app.use(express.json());

app.use("/api/depositos", depositosRoutes);
app.use("/api/contenedores", contenedoresRoutes);

app.get("/health", (_req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`EcoTechAPI available at http://localhost:${port}`);
  console.log(`Health check available at http://localhost:${port}/health`);
  console.log(`Depositos API available at http://localhost:${port}/api/depositos`);
  console.log(`Contenedores API available at http://localhost:${port}/api/contenedores`);
});
