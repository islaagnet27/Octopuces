import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const detectionTypes = [
  "SIGN",
  "TRAFFIC_LIGHT",
  "CROSSWALK",
  "STAIRS",
  "CAR",
  "PERSON",
  "TEXT",
  "PRODUCT"
] as const;

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  maxDistance: real("max_distance").notNull().default(5.0),
  detectionInterval: integer("detection_interval").notNull().default(2000),
  enabledTypes: text("enabled_types").array().notNull(),
  audioVolume: integer("audio_volume").notNull().default(80),
  audioEnabled: boolean("audio_enabled").notNull().default(true),
});

export const detections = pgTable("detections", {
  id: serial("id").primaryKey(),
  type: text("type", { enum: detectionTypes }).notNull(),
  label: text("label").notNull(),
  confidence: real("confidence").notNull(),
  distance: real("distance").notNull(),
  timestamp: integer("timestamp").notNull(),
});

export const insertSettingsSchema = createInsertSchema(settings);
export const insertDetectionSchema = createInsertSchema(detections);

export type Settings = typeof settings.$inferSelect;
export type Detection = typeof detections.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type InsertDetection = z.infer<typeof insertDetectionSchema>;
export type DetectionType = typeof detectionTypes[number];
