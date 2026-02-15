import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProjectDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    address: "",
    notes: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in first");
      const { error } = await supabase.from("projects").insert({
        ...form,
        user_id: user.id,
        client_name: form.client_name || null,
        client_email: form.client_email || null,
        client_phone: form.client_phone || null,
        address: form.address || null,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
      onOpenChange(false);
      setForm({ name: "", client_name: "", client_email: "", client_phone: "", address: "", notes: "" });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to create project"),
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">New Project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label>Project Name *</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Smith Kitchen Reno" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Client Name</Label>
              <Input value={form.client_name} onChange={(e) => update("client_name", e.target.value)} placeholder="John Smith" />
            </div>
            <div className="space-y-1.5">
              <Label>Client Email</Label>
              <Input type="email" value={form.client_email} onChange={(e) => update("client_email", e.target.value)} placeholder="john@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.client_phone} onChange={(e) => update("client_phone", e.target.value)} placeholder="04xx xxx xxx" />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main St, Sydney" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any additional notes…" rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || !form.name.trim()} className="gradient-kindai border-0 font-semibold">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
