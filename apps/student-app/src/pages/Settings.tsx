import { Card } from "@nudle/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your learning experience</p>
      </div>

      <Card className="p-12 bg-gradient-card border-2 border-border shadow-card text-center">
        <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Settings coming soon</p>
      </Card>
    </div>
  );
}
