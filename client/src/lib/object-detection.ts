import { Detection, Settings, DetectionType } from "@shared/schema";

const SIMULATED_OBJECTS = [
  { type: "SIGN" as DetectionType, labels: ["Stop", "Cédez le passage", "Zone 30"] },
  { type: "TRAFFIC_LIGHT" as DetectionType, labels: ["Feu rouge", "Feu vert", "Feu orange"] },
  { type: "CROSSWALK" as DetectionType, labels: ["Passage piéton"] },
  { type: "STAIRS" as DetectionType, labels: ["Escalier montant", "Escalier descendant"] },
  { type: "CAR" as DetectionType, labels: ["Voiture stationnée", "Voiture en mouvement"] },
  { type: "PERSON" as DetectionType, labels: ["Personne", "Groupe de personnes"] },
  { type: "TEXT" as DetectionType, labels: ["Panneau d'information", "Nom de rue"] },
  { type: "PRODUCT" as DetectionType, labels: ["Lait", "Pain", "Fruits", "Légumes"] },
];

export function simulateDetection(settings: Settings): Omit<Detection, "id"> | null {
  if (Math.random() > 0.3) return null; // 30% chance of detection

  const enabledObjects = SIMULATED_OBJECTS.filter(obj => 
    settings.enabledTypes.includes(obj.type)
  );
  
  if (enabledObjects.length === 0) return null;

  const selectedObject = enabledObjects[Math.floor(Math.random() * enabledObjects.length)];
  const selectedLabel = selectedObject.labels[Math.floor(Math.random() * selectedObject.labels.length)];
  
  const distance = Math.random() * settings.maxDistance;
  const confidence = 0.5 + Math.random() * 0.5; // Between 0.5 and 1.0

  return {
    type: selectedObject.type,
    label: selectedLabel,
    confidence,
    distance,
    timestamp: Date.now(),
  };
}
