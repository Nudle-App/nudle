import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Droplets,
  Flame,
  Loader2,
  Phone,
  Smartphone,
  Tv,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
import { Label } from "@nudle/ui/label";
import { wait } from "@/lib/parent-account";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useFamily } from "@/contexts/FamilyContext";
import { useToast } from "@nudle/ui/use-toast";

const providers = [
  {
    id: "zesa",
    icon: Zap,
    name: "ZESA Electricity",
    desc: "Prepaid electricity tokens",
    field: "Meter number",
    placeholder: "04 1234 5678 90",
    min: 5,
  },
  {
    id: "zinwa",
    icon: Droplets,
    name: "ZINWA Water",
    desc: "Prepaid and postpaid water",
    field: "Account / meter number",
    placeholder: "ZW-0093124",
    min: 5,
  },
  {
    id: "council",
    icon: Flame,
    name: "City Council Rates",
    desc: "Harare, Bulawayo and municipal bills",
    field: "Account number",
    placeholder: "HCC-778112",
    min: 5,
  },
  {
    id: "telone",
    icon: Phone,
    name: "TelOne",
    desc: "Landline and home fibre",
    field: "Account number",
    placeholder: "024-2790000",
    min: 5,
  },
  {
    id: "airtime",
    icon: Smartphone,
    name: "Airtime & Data",
    desc: "Econet, NetOne and Telecel",
    field: "Mobile number",
    placeholder: "0771 234 567",
    min: 1,
  },
  {
    id: "dstv",
    icon: Tv,
    name: "DStv / GOtv",
    desc: "Monthly subscription top-up",
    field: "Smartcard number",
    placeholder: "0123 4567 891",
    min: 5,
  },
] as const;

const quickAmounts = [5, 10, 20, 50];

const CREDIT_LIMIT = 300;
const CREDIT_USED = 45;
const CREDIT_FEE_RATE = 0.05;

type PaymentRecord = {
  ref: string;
  status: string;
  amount: number;
  fee: number;
  method: string;
  school: string;
  account: string;
  purpose: string;
  date: string;
};

export default function FinanceUtilities() {
  const [providerId, setProviderId] = useState<string>(providers[0]!.id);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("20");
  const [payLater, setPayLater] = useState(true);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeChild } = useFamily();

  const provider = providers.find((p) => p.id === providerId)!;
  const value = Number(amount) || 0;
  const available = CREDIT_LIMIT - CREDIT_USED;
  const fee = payLater ? Math.round(value * CREDIT_FEE_RATE * 100) / 100 : 0;
  const total = Math.round((value + fee) * 100) / 100;
  const overLimit = payLater && total > available;

  const canBuy = value >= provider.min && account.trim().length >= 5 && !overLimit;

  async function buy() {
    setBusy(true);
    await wait();
    try {
      const receipt = await api.post<PaymentRecord>("/api/finance/payments", {
        studentId: activeChild?.id,
        status: "success",
        amount: value,
        fee,
        method: payLater ? "Blue Finance credit (30 days)" : "Debit / Credit card",
        school: provider.name,
        account: `${provider.field}: ${account}`,
        purpose:
          provider.id === "zesa" ? `Electricity token · ${account}` : `${provider.name} purchase`,
        prefix: "KLU",
      });
      const params = new URLSearchParams({
        ref: receipt.ref,
        status: receipt.status,
        amount: String(receipt.amount),
        fee: String(receipt.fee),
        method: receipt.method,
        school: receipt.school,
        account: receipt.account,
        purpose: receipt.purpose,
        date: String(receipt.date),
      });
      navigate(`/finance/receipt?${params.toString()}`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Purchase could not be recorded",
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">Buy utilities</h1>
      <p className="page-subtitle mt-1">
        ZESA tokens, ZINWA water, council rates and more — pay now or buy on credit and settle in 30
        days.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Choose a service</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProviderId(p.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                    p.id === providerId
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{p.name}</span>
                    <span className="block text-xs text-muted-foreground">{p.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Purchase details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="account">{provider.field}</Label>
                <Input
                  id="account"
                  placeholder={provider.placeholder}
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    Number(amount) === q
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40",
                  )}
                >
                  ${q}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Minimum purchase ${provider.min}. Tokens and confirmations are delivered instantly by SMS.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">How would you like to pay?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPayLater(true)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                  payLater ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                )}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Wallet className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">Buy on credit</span>
                  <span className="block text-xs text-muted-foreground">
                    Get the token now, repay in 30 days
                  </span>
                  <span className="mt-1 block text-xs font-medium text-primary">
                    5% credit fee · ${available.toFixed(2)} available
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPayLater(false)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                  !payLater
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CreditCard className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">Pay now</span>
                  <span className="block text-xs text-muted-foreground">
                    Card, bank transfer or mobile money
                  </span>
                  <span className="mt-1 block text-xs font-medium text-primary">No credit fee</span>
                </span>
              </button>
            </div>

            {payLater && (
              <div className="mt-4 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                Blue Finance utility credit: ${CREDIT_USED.toFixed(2)} of ${CREDIT_LIMIT.toFixed(2)}{" "}
                used. Repayment of ${total.toFixed(2)} is due on{" "}
                <span className="font-medium text-foreground">
                  {new Date(Date.now() + 30 * 864e5).toLocaleDateString()}
                </span>
                .
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, ((CREDIT_USED + total) / CREDIT_LIMIT) * 100)}%`,
                    }}
                  />
                </div>
                {overLimit && (
                  <p className="mt-3 font-medium text-destructive">
                    This purchase exceeds your available credit of ${available.toFixed(2)}.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Service" value={provider.name} />
            <Row label={provider.field} value={account || "—"} />
            <Row label="Amount" value={`$${value.toFixed(2)}`} />
            <Row label="Credit fee" value={`$${fee.toFixed(2)}`} />
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-foreground">Total</span>
            <span className="text-lg font-semibold text-foreground">${total.toFixed(2)}</span>
          </div>
          <Button
            className="mt-6 w-full rounded-full"
            disabled={!canBuy || busy}
            onClick={() => void buy()}
          >
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {busy ? "Processing…" : payLater ? "Buy on credit" : `Pay $${total.toFixed(2)}`}
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full rounded-full">
            <Link to="/finance/home">Cancel</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium break-words text-foreground">{value}</dd>
    </div>
  );
}
