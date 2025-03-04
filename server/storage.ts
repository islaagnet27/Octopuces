import { Settings, Detection, InsertSettings, InsertDetection } from "@shared/schema";

export interface IStorage {
  getSettings(): Promise<Settings>;
  updateSettings(settings: InsertSettings): Promise<Settings>;
  addDetection(detection: InsertDetection): Promise<Detection>;
  getLatestDetections(limit?: number): Promise<Detection[]>;
}

export class MemStorage implements IStorage {
  private settings: Settings;
  private detections: Detection[];
  private currentId: number;

  constructor() {
    this.currentId = 1;
    this.settings = {
      id: 1,
      maxDistance: 5.0,
      detectionInterval: 2000,
      enabledTypes: ["SIGN", "TRAFFIC_LIGHT", "CROSSWALK", "STAIRS", "CAR"],
      audioVolume: 80,
      audioEnabled: true,
    };
    this.detections = [];
  }

  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(settings: InsertSettings): Promise<Settings> {
    this.settings = { ...this.settings, ...settings };
    return this.settings;
  }

  async addDetection(detection: InsertDetection): Promise<Detection> {
    const newDetection: Detection = {
      id: this.currentId++,
      ...detection,
    };
    this.detections.unshift(newDetection);
    return newDetection;
  }

  async getLatestDetections(limit: number = 10): Promise<Detection[]> {
    return this.detections.slice(0, limit);
  }
}

export const storage = new MemStorage();
