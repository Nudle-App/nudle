import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@nudle/ui/button";

export default function FinanceSchool() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Building2 className="h-6 w-6" />
      </span>
      <h1 className="mt-6 text-xl font-semibold text-foreground">School Finance</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        For qualifying schools needing equipment, working capital or infrastructure. Applications
        open soon.
      </p>
      <Button asChild variant="outline" className="mt-8 rounded-full px-6">
        <Link to="/finance/home">Back to Kleva Finance</Link>
      </Button>
    </div>
  );
}
