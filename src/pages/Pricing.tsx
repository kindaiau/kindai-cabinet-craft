import { DollarSign } from "lucide-react";

export default function Pricing() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold">Live Pricing</h1>
      <p className="mt-1 text-muted-foreground">Compare supplier pricing across Australia</p>

      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <div className="rounded-2xl bg-kindai-green/10 p-6">
          <DollarSign className="h-12 w-12 text-kindai-green" />
        </div>
        <h2 className="mt-6 font-display text-xl font-semibold">No pricing data yet</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Complete a material take-off first, then fetch live pricing from suppliers.
        </p>
      </div>
    </div>
  );
}
