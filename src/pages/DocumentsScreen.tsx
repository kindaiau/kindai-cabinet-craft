import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documentRegistry } from "@/lib/documents-registry";

const areaClass: Record<string, string> = {
  Mariana: "bg-kindai-pink/10 text-kindai-pink",
  Kindai: "bg-kindai-blue/10 text-kindai-blue",
  OpenClaw: "bg-kindai-aqua/10 text-kindai-aqua",
  GetGas: "bg-kindai-orange/10 text-kindai-orange",
  General: "bg-muted text-muted-foreground",
};

export default function DocumentsScreen() {
  const written = documentRegistry.filter((d) => d.status === "written");
  const planned = documentRegistry.filter((d) => d.status === "planned");

  return (
    <div className="p-6 md:p-8 max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Documents</h1>
        <p className="mt-1 text-muted-foreground">Registry of documents already written and queued next.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Written Documents ({written.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {written.map((doc) => (
            <div key={doc.path} className="rounded-md border border-border px-3 py-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground truncate">{doc.path}</p>
              </div>
              <Badge variant="secondary" className={areaClass[doc.area]}>{doc.area}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Planned Documents ({planned.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {planned.map((doc) => (
            <div key={doc.path} className="rounded-md border border-border px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{doc.path}</p>
                </div>
                <Badge variant="secondary" className={areaClass[doc.area]}>{doc.area}</Badge>
              </div>
              {doc.notes && <p className="mt-1 text-xs text-muted-foreground">{doc.notes}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
