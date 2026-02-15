import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your profile and preferences</p>

      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <div className="rounded-2xl bg-kindai-violet/10 p-6">
          <Settings className="h-12 w-12 text-kindai-violet" />
        </div>
        <h2 className="mt-6 font-display text-xl font-semibold">Settings coming soon</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Profile, waste factor preferences, and supplier settings will be available here.
        </p>
      </div>
    </div>
  );
}
