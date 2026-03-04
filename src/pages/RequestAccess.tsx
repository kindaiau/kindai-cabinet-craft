import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

type RequestAccessForm = {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  trade_type: string;
  message: string;
};

const initialState: RequestAccessForm = {
  business_name: "",
  contact_name: "",
  email: "",
  phone: "",
  trade_type: "Cabinet Maker",
  message: "",
};

export default function RequestAccess() {
  const [form, setForm] = useState<RequestAccessForm>(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (key: keyof RequestAccessForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("waitlist").insert({
        business_name: form.business_name,
        contact_name: form.contact_name,
        email: form.email,
        phone: form.phone || null,
        trade_type: form.trade_type,
        message: form.message || null,
        status: "pending",
      });

      if (error) throw error;

      trackEvent("signup_started", { source: "request_access" });

      navigate("/access-requested", {
        replace: true,
        state: { email: form.email, business_name: form.business_name },
      });
    } catch (error: unknown) {
      toast({
        title: "Couldn’t submit request",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12 md:py-20">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Request Kindai Early Access</CardTitle>
            <CardDescription>
              Join the waitlist for premium AI estimating. Businesses use Kindai to potentially replace up to 80% of manual estimating workload.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business name</Label>
                  <Input id="business_name" required value={form.business_name} onChange={(e) => update("business_name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact name</Label>
                  <Input id="contact_name" required value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trade_type">Trade type</Label>
                <Input id="trade_type" required value={form.trade_type} onChange={(e) => update("trade_type", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <textarea
                  id="message"
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                />
              </div>

              <Button disabled={loading} className="w-full gradient-kindai border-0 font-semibold" type="submit">
                {loading ? "Submitting..." : "Request Early Access"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
