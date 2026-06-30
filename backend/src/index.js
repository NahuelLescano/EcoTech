import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "*", // Replace with your domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const port = 8000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`EcoTechAPI listening on port ${port}`);
});
