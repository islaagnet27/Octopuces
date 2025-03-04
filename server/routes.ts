import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSettingsSchema, insertDetectionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.post("/api/settings", async (req, res) => {
    const result = insertSettingsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const settings = await storage.updateSettings(result.data);
    res.json(settings);
  });

  app.get("/api/detections", async (_req, res) => {
    const detections = await storage.getLatestDetections();
    res.json(detections);
  });

  app.post("/api/detections", async (req, res) => {
    const result = insertDetectionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const detection = await storage.addDetection(result.data);
    res.json(detection);
  });

  return createServer(app);
}
