import { useQuery } from "@tanstack/react-query";
import { Settings } from "@shared/schema";
import CameraSimulation from "@/components/camera-simulation";
import DetectionDisplay from "@/components/detection-display";
import SettingsPanel from "@/components/settings-panel";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto space-y-4">
        <h1 className="text-4xl font-bold text-primary mb-8">
          Simulateur de Lunettes Connectées
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <Card className="p-4">
              <CameraSimulation settings={settings} />
            </Card>
            <Card className="p-4">
              <DetectionDisplay />
            </Card>
          </div>

          <Card className="p-4">
            <SettingsPanel settings={settings} />
          </Card>
        </div>
      </div>
    </div>
  );
}
