import { useQuery } from "@tanstack/react-query";
import { Detection } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DetectionDisplay() {
  const { data: detections } = useQuery<Detection[]>({
    queryKey: ["/api/detections"],
    refetchInterval: 1000,
  });

  if (!detections) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Détections Récentes</h2>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {detections.map((detection) => (
            <div
              key={detection.id}
              className="p-2 border border-border rounded-lg"
            >
              <div className="flex justify-between">
                <span className="font-medium">{detection.label}</span>
                <span className="text-muted-foreground">
                  {detection.distance.toFixed(1)}m
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Confiance: {(detection.confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
