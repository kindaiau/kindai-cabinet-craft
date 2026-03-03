import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  status: "waitlisted" | "demo_active" | "trial_active" | "expired";
  onRefresh: () => void;
};

const copyByStatus: Record<Props["status"], { title: string; body: string }> = {
  waitlisted: {
    title: "You’re on the waiting list",
    body: "We’ll send your demo video first, then your personal trial activation link.",
  },
  demo_active: {
    title: "5-minute interactive demo is active",
    body: "Your short guided demo is live. Full workspace access unlocks after admin-approved trial activation.",
  },
  trial_active: {
    title: "Your 7-day trial is active",
    body: "You currently have full trial access to Kindai Cabinet Pro.",
  },
  expired: {
    title: "Your access has expired",
    body: "Reply to the latest Kindai email to request re-activation.",
  },
};

export default function AccessGate({ status, onRefresh }: Props) {
  const copy = copyByStatus[status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-display text-2xl">{copy.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>{copy.body}</p>
          <p className="text-sm">Potential outcome: Kindai can help compress a $100k estimator role into an AI-assisted workflow.</p>
          <Button variant="outline" onClick={onRefresh}>Refresh access status</Button>
        </CardContent>
      </Card>
    </div>
  );
}
