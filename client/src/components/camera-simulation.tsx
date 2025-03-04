import { useEffect, useRef, useState } from "react";
import { Settings, Detection } from "@shared/schema";
import { simulateDetection } from "@/lib/object-detection";
import { speak } from "@/lib/speech";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Props {
  settings: Settings;
}

export default function CameraSimulation({ settings }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const queryClient = useQueryClient();

  const addDetection = useMutation({
    mutationFn: async (detection: Omit<Detection, "id">) => {
      const res = await apiRequest("POST", "/api/detections", detection);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/detections"] });
    },
  });

  useEffect(() => {
    if (!isSimulating || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const interval = setInterval(() => {
      // Clear canvas
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 640, 480);

      // Simulate camera noise
      for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
        ctx.fillRect(
          Math.random() * 640,
          Math.random() * 480,
          2,
          2
        );
      }

      // Simulate detection
      const detection = simulateDetection(settings);
      if (detection) {
        if (settings.audioEnabled) {
          speak(detection.label, settings.audioVolume);
        }
        addDetection.mutate(detection);

        // Draw detection box
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 100, 200, 200);
        ctx.fillStyle = "#00ff00";
        ctx.font = "16px Arial";
        ctx.fillText(detection.label, 100, 90);
      }
    }, settings.detectionInterval);

    return () => clearInterval(interval);
  }, [isSimulating, settings, addDetection]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Simulation Caméra</h2>
        <button
          className={`px-4 py-2 rounded ${
            isSimulating
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary text-primary-foreground"
          }`}
          onClick={() => setIsSimulating(!isSimulating)}
        >
          {isSimulating ? "Arrêter" : "Démarrer"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="w-full border border-border rounded-lg"
      />
    </div>
  );
}
