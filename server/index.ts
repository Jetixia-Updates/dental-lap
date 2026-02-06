import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  listCases,
  getCase,
  createCase,
  updateCase,
  deleteCase,
} from "./routes/cases";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Cases API
  app.get("/api/cases", listCases);
  app.get("/api/cases/:caseId", getCase);
  app.post("/api/cases", createCase);
  app.put("/api/cases/:id", updateCase);
  app.delete("/api/cases/:id", deleteCase);

  return app;
}
