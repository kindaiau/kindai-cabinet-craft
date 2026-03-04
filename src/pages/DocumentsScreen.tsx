import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { documentRegistry } from "@/lib/documents-registry";

const areaClass: Record<string, string> = {
  Mariana: "bg-kindai-pink/10 text-kindai-pink",
  Kindai: "bg-kindai-blue/10 text-kindai-blue",
  OpenClaw: "bg-kindai-aqua/10 text-kindai-aqua",
  GetGas: "bg-kindai-orange/10 text-kindai-orange",
  General: "bg-muted text-muted-foreground",
};

export default function DocumentsScreen() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documentRegistry;
    return documentRegistry.filter((d) =>
      [d.title, d.path, d.area, d.notes ?? ""].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  const written = filtered.filter((d) => d.status === "written");
  const planned = filtered.filter((d) => d.status === "planned");

  const byArea = <T extends { area: string }>(items: T[]) =>
    items.reduce<Record<string, T[]>>((acc, item) => {
      if (!acc[item.area]) acc[item.area] = [];
      acc[item.area]?.push(item);
      return acc;
    }, {});

  const writtenByArea = byArea(written);
  const plannedByArea = byArea(planned);

  return (
    <div className="p-6 md:p-8 max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Documents</h1>
        <p className="mt-1 text-muted-foreground">Searchable, categorized registry of written and planned docs.</p>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search by title, path, area, notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {written.length === 0 && planned.length === 0 && (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">No documents match your search.</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Written Documents ({written.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(writtenByArea).sort(([a], [b]) => a.localeCompare(b)).map(([area, docs]) => (
            <div key={area} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={areaClass[area]}>{area}</Badge>
                <p className="text-xs text-muted-foreground">{docs.length} docs</p>
              </div>
              {docs.map((doc) => (
                <div key={doc.path} className="rounded-md border border-border px-3 py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{doc.path}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Planned Documents ({planned.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(plannedByArea).sort(([a], [b]) => a.localeCompare(b)).map(([area, docs]) => (
            <div key={area} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={areaClass[area]}>{area}</Badge>
                <p className="text-xs text-muted-foreground">{docs.length} planned</p>
              </div>
              {docs.map((doc) => (
                <div key={doc.path} className="rounded-md border border-border px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{doc.path}</p>
                    </div>
                  </div>
                  {doc.notes && <p className="mt-1 text-xs text-muted-foreground">{doc.notes}</p>}
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
