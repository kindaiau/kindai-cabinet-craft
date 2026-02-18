import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  client_name: string | null;
  client_email: string | null;
  address: string | null;
}

interface ProjectSelectorProps {
  onProjectSelected: (project: Project | null, cabinets: any[]) => void;
}

export default function ProjectSelector({ onProjectSelected }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, name, client_name, client_email, address")
        .order("updated_at", { ascending: false });
      if (data) setProjects(data);
    };
    load();
  }, []);

  const handleChange = async (value: string) => {
    setSelectedId(value);
    if (value === "__none__") {
      onProjectSelected(null, []);
      return;
    }
    const project = projects.find((p) => p.id === value);
    if (!project) return;

    const { data: cabinets } = await supabase
      .from("cabinets")
      .select("label, type, width_mm, quantity:id")
      .eq("project_id", value);

    // Group cabinets by label+type and count
    const grouped = (cabinets ?? []).reduce<Record<string, { label: string; type: string; width_mm: number; count: number }>>((acc, c) => {
      const key = `${c.label}_${c.type}_${c.width_mm}`;
      if (!acc[key]) acc[key] = { label: c.label, type: c.type, width_mm: c.width_mm, count: 0 };
      acc[key].count += 1;
      return acc;
    }, {});

    onProjectSelected(project, Object.values(grouped));
  };

  if (projects.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Link to Project</Label>
      <Select value={selectedId} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a project…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">None</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
