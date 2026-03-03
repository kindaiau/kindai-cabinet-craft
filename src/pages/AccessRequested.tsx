import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type State = {
  email?: string;
};

export default function AccessRequested() {
  const location = useLocation();
  const state = (location.state ?? {}) as State;

  return (
    <div className="min-h-screen bg-background px-4 py-12 md:py-20">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">You’re on the Kindai early access list.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We’ll send a short demo video first, then your personal trial access link.</p>
            <p>
              Trial flow: 5-minute interactive demo first, then approved 7-day full trial access.
            </p>
            {state.email && <p className="text-sm">Request recorded for: <span className="font-medium text-foreground">{state.email}</span></p>}
            <Link to="/">
              <Button variant="outline">Back to home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
