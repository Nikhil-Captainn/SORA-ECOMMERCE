import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "../storage"; // ✅ fixed relative path

export async function registerRoutes(app: Express): Promise<Server> {
  // Example API route
  app.get("/api/hello", (_req, res) => {
    res.json({ message: "Hello from SoraGold API 🚀" });
  });

  // TODO: use storage to perform CRUD, e.g.:
  // app.post("/api/users", (req, res) => storage.insertUser(req.body));

  const httpServer = createServer(app);
  return httpServer;
}
