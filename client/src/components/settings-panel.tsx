import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings, insertSettingsSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface Props {
  settings: Settings;
}

export default function SettingsPanel({ settings }: Props) {
  const queryClient = useQueryClient();
  const form = useForm<Settings>({
    resolver: zodResolver(insertSettingsSchema),
    defaultValues: settings,
  });

  const updateSettings = useMutation({
    mutationFn: async (data: Settings) => {
      const res = await apiRequest("POST", "/api/settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updateSettings.mutate(data))}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold">Paramètres</h2>

        <FormField
          control={form.control}
          name="maxDistance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance Maximum (m)</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={0.5}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
              <FormDescription>
                Distance maximum de détection: {field.value}m
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detectionInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervalle de Détection (ms)</FormLabel>
              <FormControl>
                <Slider
                  min={500}
                  max={5000}
                  step={100}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
              <FormDescription>
                Intervalle: {field.value}ms
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audioVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume Audio (%)</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
              <FormDescription>Volume: {field.value}%</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audioEnabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div>
                <FormLabel>Audio Activé</FormLabel>
                <FormDescription>
                  Activer/désactiver les notifications audio
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sauvegarder
        </Button>
      </form>
    </Form>
  );
}
