import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Pencil, Trash2, Package, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Material = Tables<"materials">;

const CATEGORIES = [
  { value: "carcass", label: "Carcass", color: "bg-kindai-blue/10 text-kindai-blue" },
  { value: "doors", label: "Doors & Fronts", color: "bg-kindai-pink/10 text-kindai-pink" },
  { value: "hardware", label: "Hardware", color: "bg-kindai-orange/10 text-kindai-orange" },
  { value: "benchtop", label: "Benchtop / Stone", color: "bg-kindai-green/10 text-kindai-green" },
  { value: "edging", label: "Edge Banding", color: "bg-kindai-aqua/10 text-kindai-aqua" },
  { value: "plumbing", label: "Plumbing", color: "bg-kindai-violet/10 text-kindai-violet" },
  { value: "general", label: "General", color: "bg-muted text-muted-foreground" },
];

const categoryMap = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

const emptyForm: Omit<TablesInsert<"materials">, "user_id"> = {
  name: "",
  category: "general",
  unit: "ea",
  unit_price: 0,
  supplier: "",
  notes: "",
};

export default function MaterialsLibrary() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("category")
        .order("name");
      if (error) throw error;
      return data as Material[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (material: Omit<TablesInsert<"materials">, "user_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      if (editingId) {
        const { error } = await supabase
          .from("materials")
          .update(material)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("materials")
          .insert({ ...material, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast({ title: editingId ? "Material updated" : "Material added" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast({ title: "Material deleted" });
    },
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (m: Material) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      category: m.category,
      unit: m.unit,
      unit_price: m.unit_price,
      supplier: m.supplier || "",
      notes: m.notes || "",
    });
    setDialogOpen(true);
  };

  const filtered = materials.filter((m) => {
    const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.supplier?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Materials Library</h1>
          <p className="mt-1 text-muted-foreground">Save frequently used materials with custom pricing</p>
        </div>
        <Button className="gradient-kindai border-0 font-semibold" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Material
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search materials..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="mt-12 text-center text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="rounded-2xl bg-kindai-yellow/10 p-6">
            <Package className="h-12 w-12 text-kindai-yellow" />
          </div>
          <h2 className="mt-6 font-display text-xl font-semibold">
            {materials.length === 0 ? "No materials saved yet" : "No matches found"}
          </h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            {materials.length === 0
              ? "Add your go-to materials here so you can quickly build estimates."
              : "Try adjusting your search or filter."}
          </p>
          {materials.length === 0 && (
            <Button className="mt-6 gradient-kindai border-0 font-semibold" onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Material
            </Button>
          )}
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => {
                  const cat = categoryMap[m.category] || categoryMap.general;
                  return (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cat.color}>{cat.label}</Badge>
                      </TableCell>
                      <TableCell>{m.unit}</TableCell>
                      <TableCell className="text-right">${Number(m.unit_price).toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">{m.supplier || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(m)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate(m.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? "Edit Material" : "Add Material"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              upsertMutation.mutate(form);
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="18mm White Melamine 2400x1200" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Select value={form.unit} onValueChange={(v) => setForm((f) => ({ ...f, unit: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ea">Each</SelectItem>
                    <SelectItem value="sheet">Sheet</SelectItem>
                    <SelectItem value="m">Metre</SelectItem>
                    <SelectItem value="m2">m²</SelectItem>
                    <SelectItem value="lm">Lin. Metre</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="pair">Pair</SelectItem>
                    <SelectItem value="set">Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Unit Price ($)</Label>
                <Input type="number" min={0} step={0.01} value={form.unit_price} onChange={(e) => setForm((f) => ({ ...f, unit_price: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Supplier</Label>
                <Input value={form.supplier || ""} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))} placeholder="Bunnings, Polytec..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input value={form.notes || ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="gradient-kindai border-0 font-semibold" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Saving..." : editingId ? "Update" : "Add Material"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
