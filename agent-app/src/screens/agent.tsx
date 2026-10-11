import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Home, Users, History, BookOpen, CalendarClock, HandCoins, Wallet, Check, ChevronRight, Phone, MapPin, Loader2, Upload, Download, Receipt, ArrowDownLeft, ArrowUpRight, User } from "lucide-react";
import { GLink, Logo, Button, btn, Card, Badge, MobileShell, AppHeader, backCls, BackIcon, BottomNav, Field, Input, OtpInput, useCountdown, Chips, Progress, KV, IconTile, ResultState, SearchBar, SignaturePad, EmptyState } from "@/components/sm/ui";
import { agentCustomers, inr } from "@/data/mock";
import { cn } from "@/lib/utils";

const navItems = [
  { s: "dashboard", label: "Home", icon: Home, link: GLink },
  { s: "customers", label: "Customers", icon: Users, link: GLink },
  { s: "history", label: "History", icon: History, link: GLink },
  { s: "ledger", label: "Ledger", icon: BookOpen, link: GLink },
];
const Nav = ({ a }: { a: string }) => <BottomNav items={navItems} active={a} />;
const Back = ({ to }: { to: string }) => <GLink s={to} className={backCls}><BackIcon /></GLink>;
const Page = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn("space-y-4 px-5", className)}>{children}</div>;
const Footer = ({ children }: { children: ReactNode }) => <div className="sticky bottom-0 mt-6 bg-gradient-to-t from-background via-background to-transparent px-5 pb-2 pt-4">{children}</div>;
const Go = ({ s, children, v = "primary" }: { s: string; children: ReactNode; v?: "primary" | "outline" }) => <GLink s={s} className={btn(v, "lg", true)}>{children}</GLink>;

function Login() {
  const nav = useNavigate();
  const [l, setL] = useState(false);
  return (
    <MobileShell>
      <div className="flex min-h-[780px] flex-col px-6 pt-12">
        <Logo />
        <span className="mt-3 w-fit rounded-full bg-navy px-3 py-1 text-[11px] font-semibold tracking-wider text-navy-foreground">COLLECTION AGENT</span>
        <h1 className="mt-10 text-2xl font-extrabold text-navy">Sign in to start collecting</h1>
        <div className="mt-8 space-y-4">
          <Field label="Mobile number"><Input defaultValue="94470 11223" inputMode="numeric" /></Field>
          <Field label="Password / OTP"><Input type="password" defaultValue="••••••" /></Field>
        </div>
        <div className="mt-auto pb-6">
          <Button full size="lg" disabled={l} onClick={() => { setL(true); setTimeout(() => nav({ to: "/agent/$screen", params: { screen: "dashboard" } }), 800); }}>{l ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Login <ArrowRight className="h-5 w-5" /></>}</Button>
        </div>
      </div>
    </MobileShell>
  );
}

function Dashboard() {
  return (
    <MobileShell nav={<Nav a="dashboard" />}>
      <div className="flex items-center justify-between px-5 pt-6"><div><p className="text-xs text-muted-foreground">Fri, 02 Oct 2026</p><h1 className="text-xl font-bold text-navy">Good morning, Ravi</h1></div><div className="grid h-10 w-10 place-items-center rounded-full bg-navy text-sm font-bold text-navy-foreground">RS</div></div>
      <Page className="mt-5">
        <div className="rounded-3xl bg-navy p-5 text-navy-foreground">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Today's Collection</p>
          <div className="mt-2 flex items-end justify-between"><p className="text-3xl font-extrabold tnum">{inr(51250)}</p><p className="text-xs opacity-70">of {inr(76500)}</p></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-card/15"><div className="h-full w-[67%] rounded-full bg-success" /></div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[["Expected", inr(76500)], ["Collected", inr(51250)], ["Remaining", inr(25250)]].map(([k, v]) => <div key={k} className="rounded-xl bg-card/10 p-2"><p className="text-[10px] opacity-70">{k}</p><p className="text-sm font-bold tnum">{v}</p></div>)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4"><IconTile icon={Users} tone="warning" /><p className="mt-3 text-2xl font-extrabold text-navy">18</p><p className="text-xs text-muted-foreground">Customers Due</p></Card>
          <Card className="p-4"><IconTile icon={Wallet} /><p className="mt-3 text-2xl font-extrabold text-navy tnum">{inr(51250)}</p><p className="text-xs text-muted-foreground">Cash Held</p></Card>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {([[Users, "My Customers", "customers"], [CalendarClock, "Today's Due", "customers"], [HandCoins, "Collect EMI", "customer"], [BookOpen, "Cash Ledger", "ledger"]] as const).map(([I, l, s]) => (
            <GLink key={l} s={s} className="flex flex-col items-center gap-2 rounded-2xl bg-card p-3 text-center shadow-card"><IconTile icon={I} /><span className="text-[11px] font-semibold leading-tight text-navy">{l}</span></GLink>
          ))}
        </div>
        <h2 className="pt-1 font-bold text-navy">Next visits</h2>
        <Card className="divide-y divide-border">{agentCustomers.slice(0, 3).map((c) => <CustRow key={c.name} c={c} />)}</Card>
      </Page>
    </MobileShell>
  );
}

function CustRow({ c }: { c: (typeof agentCustomers)[number] }) {
  return (
    <GLink s="customer" className="flex items-center gap-3 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-soft text-xs font-bold text-primary">{c.name.split(" ").map((x) => x[0]).join("")}</div>
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-navy">{c.name}</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{c.area} · {c.loan}</p></div>
      <div className="text-right"><p className="text-sm font-bold text-navy tnum">{inr(c.emi)}</p><Badge>{c.status}</Badge></div>
    </GLink>
  );
}

function Customers() {
  const [f, setF] = useState("Due Today");
  const list = agentCustomers.filter((c) => c.status === f);
  return (
    <MobileShell nav={<Nav a="customers" />}>
      <AppHeader title="My Customers" subtitle="42 assigned" />
      <Page>
        <SearchBar placeholder="Search name, loan ID or area" />
        <Chips options={["Due Today", "Overdue", "Upcoming", "Paid"]} value={f} onChange={setF} />
        <Card className="divide-y divide-border">{list.length ? list.map((c) => <CustRow key={c.name} c={c} />) : <EmptyState icon={Users} title="No customers" />}</Card>
      </Page>
    </MobileShell>
  );
}

function CustomerDetails() {
  return (
    <MobileShell>
      <AppHeader title="Customer Details" back={<Back to="customers" />} />
      <Page>
        <Card className="flex items-center gap-4 p-5"><div className="grid h-14 w-14 place-items-center rounded-full bg-brand font-bold text-primary-foreground">HR</div><div className="flex-1"><p className="font-bold text-navy">Harun R</p><p className="text-xs text-muted-foreground">+91 98765 43210</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />Market Road, Edappally</p></div><a className={backCls}><Phone className="h-5 w-5 text-primary" /></a></Card>
        <Card className="divide-y divide-border px-4 py-1"><KV k="Loan" v="Personal Loan" /><KV k="Loan ID" v="SM-LN-2026-0418" /><KV k="Outstanding" v={inr(38500)} /><KV k="Today's EMI" v={inr(4250)} strong /><KV k="Due" v="05 Oct 2026" /></Card>
        <Card className="p-4"><p className="text-xs font-semibold text-navy">Repayment</p><Progress value={33} className="mt-2" /><p className="mt-1.5 text-[11px] text-muted-foreground">4 of 12 EMIs paid · No overdue</p></Card>
      </Page>
      <Footer><Go s="collect">Collect EMI <ArrowRight className="h-5 w-5" /></Go></Footer>
    </MobileShell>
  );
}

function Collect() {
  return (
    <MobileShell>
      <AppHeader title="Collect EMI" back={<Back to="customer" />} />
      <Page>
        <Card className="p-5 text-center"><p className="text-xs text-muted-foreground">Amount to collect</p><p className="mt-1 text-4xl font-extrabold text-navy tnum">{inr(4250)}</p></Card>
        <Card className="divide-y divide-border px-4 py-1"><KV k="Customer" v="Harun R" /><KV k="EMI" v="#05" /><KV k="Mode" v="Cash" /></Card>
        <Field label="Cash received"><Input defaultValue="₹4,250" /></Field>
        <div className="rounded-xl bg-warning-soft p-4 text-xs text-navy">Count the cash in front of the customer. Next you'll verify with an OTP and signature.</div>
      </Page>
      <Footer><Go s="otp">Collect Cash <ArrowRight className="h-5 w-5" /></Go></Footer>
    </MobileShell>
  );
}

function CustOtp() {
  const [t, reset] = useCountdown(30);
  const [ok, setOk] = useState(false);
  return (
    <MobileShell>
      <AppHeader title="Confirm Customer" back={<Back to="collect" />} />
      <Page>
        <p className="text-sm text-muted-foreground">OTP sent to customer's registered mobile +91 98XXX XX210.</p>
        <OtpInput onComplete={() => setOk(true)} />
        <p className="text-sm text-muted-foreground">{t > 0 ? `Resend in 00:${String(t).padStart(2, "0")}` : <button onClick={reset} className="font-semibold text-primary">Resend OTP</button>}</p>
      </Page>
      <Footer>{ok ? <Go s="signature">Verify OTP <ArrowRight className="h-5 w-5" /></Go> : <Button full size="lg" disabled>Verify OTP</Button>}</Footer>
    </MobileShell>
  );
}

function Signature() {
  const [signed, setSigned] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  return (
    <MobileShell>
      <AppHeader title="Customer Signature" back={<Back to="otp" />} />
      <Page>
        <p className="text-sm text-muted-foreground">Ask Harun R to sign to confirm cash payment of {inr(4250)}.</p>
        <SignaturePad onChange={(s) => { setSigned(s); setConfirmed(false); }} />
        <Button variant={confirmed ? "success" : "secondary"} full disabled={!signed} onClick={() => setConfirmed(true)}>{confirmed ? <><Check className="h-4 w-4" />Signature Confirmed</> : "Confirm Signature"}</Button>
      </Page>
      <Footer>{confirmed ? <Go s="success">Complete Collection <ArrowRight className="h-5 w-5" /></Go> : <Button full size="lg" disabled>Complete Collection</Button>}</Footer>
    </MobileShell>
  );
}

function Success() {
  return (
    <MobileShell>
      <Page className="pt-14">
        <ResultState tone="success" icon={Check} title="Cash Collection Recorded" />
        <p className="text-center text-4xl font-extrabold text-navy tnum">{inr(4250)}</p>
        <Card className="divide-y divide-border px-4 py-1"><KV k="Customer" v="Harun R" /><KV k="EMI" v="#05" /><KV k="Receipt ID" v="RCPT-2026-04821" /></Card>
      </Page>
      <Footer><div className="space-y-3"><Go s="receipt"><Receipt className="h-5 w-5" />View Receipt</Go><Go s="dashboard" v="outline">Back to Dashboard</Go></div></Footer>
    </MobileShell>
  );
}

function HistoryScreen() {
  const rows = [["Harun R", 4250, "#05", "10:42 AM"], ["Gopal Reddy", 3900, "#07", "10:05 AM"], ["Suresh Kumar", 14200, "#03", "09:31 AM"], ["Anjali D", 3150, "#09", "Yesterday"], ["Rakesh Yadav", 9800, "#04", "Yesterday"]] as const;
  return (
    <MobileShell nav={<Nav a="history" />}>
      <AppHeader title="Collection History" />
      <Page>
        <Card className="divide-y divide-border">
          {rows.map(([n, a, e, d]) => (
            <GLink key={n} s="receipt" className="flex items-center gap-3 p-4">
              <IconTile icon={Check} tone="success" />
              <div className="flex-1"><p className="text-sm font-semibold text-navy">{n}</p><p className="text-xs text-muted-foreground">EMI {e} · {d}</p></div>
              <div className="text-right"><p className="text-sm font-bold text-navy tnum">{inr(a)}</p><span className="text-[11px] font-semibold text-primary">Receipt</span></div>
            </GLink>
          ))}
        </Card>
      </Page>
    </MobileShell>
  );
}

function Ledger() {
  const tx = [["Deposit — HDFC Branch", -38100, "01:15 PM"], ["Harun R", 4250, "10:42 AM"], ["Gopal Reddy", 3900, "10:05 AM"], ["Suresh Kumar", 14200, "09:31 AM"]] as const;
  return (
    <MobileShell nav={<Nav a="ledger" />}>
      <AppHeader title="Cash Ledger" />
      <Page>
        <div className="grid grid-cols-2 gap-3">
          {[["Opening Balance", 0], ["Today's Collections", 51250], ["Today's Deposits", 38100], ["Current Cash Held", 13150]].map(([k, v], i) => <Card key={k} className={cn("p-4", i === 3 && "bg-navy text-navy-foreground")}><p className={cn("text-[11px]", i === 3 ? "opacity-70" : "text-muted-foreground")}>{k}</p><p className={cn("mt-1 text-lg font-extrabold tnum", i !== 3 && "text-navy")}>{inr(v as number)}</p></Card>)}
        </div>
        <Go s="deposit">Deposit Cash <ArrowRight className="h-5 w-5" /></Go>
        <h2 className="pt-1 font-bold text-navy">Today's transactions</h2>
        <Card className="divide-y divide-border">
          {tx.map(([n, a, t]) => <div key={n} className="flex items-center gap-3 p-4"><IconTile icon={a < 0 ? ArrowUpRight : ArrowDownLeft} tone={a < 0 ? "info" : "success"} /><div className="flex-1"><p className="text-sm font-semibold text-navy">{n}</p><p className="text-xs text-muted-foreground">{t}</p></div><p className={cn("text-sm font-bold tnum", a < 0 ? "text-primary" : "text-success")}>{a < 0 ? "−" : "+"}{inr(Math.abs(a))}</p></div>)}
        </Card>
      </Page>
    </MobileShell>
  );
}

function Deposit() {
  const [st, setSt] = useState<"idle" | "loading" | "done">("idle");
  const [proof, setProof] = useState(false);
  return (
    <MobileShell>
      <AppHeader title="Cash Deposit" back={<Back to="ledger" />} />
      <Page>
        {st === "done" ? (
          <div className="pt-10"><ResultState tone="success" icon={Check} title="Deposit Submitted" sub="Pending reconciliation by admin." /></div>
        ) : (
          <>
            <Card className="p-5 text-center"><p className="text-xs text-muted-foreground">Current Cash Held</p><p className="text-3xl font-extrabold text-navy tnum">{inr(13150)}</p></Card>
            <Field label="Deposit Amount"><Input defaultValue="₹13,150" /></Field>
            <Field label="Deposit Reference"><Input placeholder="Bank slip / UTR number" /></Field>
            <button onClick={() => setProof(true)} className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-input bg-card p-6 text-center">
              {proof ? <><Check className="h-6 w-6 text-success" /><span className="text-sm font-semibold text-success">deposit_slip.jpg uploaded</span></> : <><Upload className="h-6 w-6 text-primary" /><span className="text-sm font-semibold text-navy">Upload Proof</span><span className="text-xs text-muted-foreground">JPG / PNG / PDF</span></>}
            </button>
          </>
        )}
      </Page>
      <Footer>{st === "done" ? <Go s="ledger">Back to Ledger</Go> : <Button full size="lg" disabled={!proof || st === "loading"} onClick={() => { setSt("loading"); setTimeout(() => setSt("done"), 1000); }}>{st === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Deposit"}</Button>}</Footer>
    </MobileShell>
  );
}

function ReceiptScreen() {
  return (
    <MobileShell>
      <AppHeader title="Receipt" back={<Back to="history" />} />
      <Page>
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between bg-brand p-5 text-primary-foreground"><div><Logo size="sm" light /><p className="mt-2 text-sm opacity-80">Cash Collection Receipt</p></div><span className="rounded-lg border-2 border-primary-foreground/70 px-3 py-1 text-sm font-extrabold tracking-widest">PAID</span></div>
          <div className="divide-y divide-border px-5 py-2"><KV k="Customer" v="Harun R" /><KV k="Loan ID" v="SM-LN-2026-0418" /><KV k="EMI" v="#05" /><KV k="Amount" v={inr(4250)} strong /><KV k="Date" v="02 Oct 2026, 10:42 AM" /><KV k="Agent" v="Ravi Shankar (AGT-01)" /><KV k="Receipt ID" v="RCPT-2026-04821" /><KV k="Verified by" v="OTP + Signature" /></div>
        </Card>
        <Button variant="outline" full><Download className="h-4 w-4" />Share Receipt</Button>
      </Page>
    </MobileShell>
  );
}

export const agentScreens: Record<string, { c: () => ReactNode; t: string }> = {
  login: { c: Login, t: "Login" }, dashboard: { c: Dashboard, t: "Dashboard" }, customers: { c: Customers, t: "My Customers" }, customer: { c: CustomerDetails, t: "Customer Details" },
  collect: { c: Collect, t: "Collect Cash" }, otp: { c: CustOtp, t: "Customer OTP" }, signature: { c: Signature, t: "Signature" }, success: { c: Success, t: "Collection Success" },
  history: { c: HistoryScreen, t: "Collection History" }, ledger: { c: Ledger, t: "Cash Ledger" }, deposit: { c: Deposit, t: "Cash Deposit" }, receipt: { c: ReceiptScreen, t: "Receipt" },
};
export { User, ChevronRight };
