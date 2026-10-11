import { useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, FileText, Wallet, Send, CalendarDays, CreditCard, UserCheck, HandCoins, FolderLock, BarChart3, Bell, Settings, ScrollText,
  Search, Plus, Upload, Eye, Check, X, Download, IndianRupee, AlertTriangle, TrendingUp, Clock, FileSpreadsheet, ShieldCheck, Menu, ChevronRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { ALink, Logo, Button, btn, Card, Badge, Field, Input, Select, Chips, Tabs, Table, Pagination, KV, IconTile, inputCls } from "@/components/sm/ui";
import { customers, applications, agents, monthly, emis, inr } from "@/data/mock";
import { cn } from "@/lib/utils";

const side: [typeof Users, string, string][] = [
  [LayoutDashboard, "Dashboard", "dashboard"], [Users, "Customers", "customers"], [FileText, "Applications", "applications"], [Wallet, "Loans", "loans"],
  [Send, "Disbursements", "disbursement"], [CalendarDays, "EMIs", "emis"], [CreditCard, "Payments", "payments"], [UserCheck, "Agents", "agents"],
  [HandCoins, "Cash Collections", "cash"], [FolderLock, "Documents", "documents"], [BarChart3, "Reports", "reports"], [Bell, "Notifications", "notifications"],
  [Settings, "Settings", "settings"], [ScrollText, "Audit Logs", "audit"],
];
const groupOf: Record<string, string> = { "add-customer": "customers", import: "customers", customer: "customers", "application-review": "applications", loan: "loans", assignment: "agents", ledger: "cash" };

function Shell({ title, sub, actions, children }: { title: string; sub?: string; actions?: ReactNode; children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const cur = path.split("/")[2] ?? "dashboard";
  const active = groupOf[cur] ?? cur;
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("fixed inset-y-0 left-0 z-30 w-64 shrink-0 flex-col border-r border-border bg-card lg:sticky lg:top-0 lg:flex lg:h-screen", open ? "flex" : "hidden")}>
        <div className="flex h-16 items-center px-5"><Logo size="sm" /></div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {side.map(([I, l, s]) => (
            <ALink key={s} s={s} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", active === s ? "bg-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-navy")}><I className="h-[18px] w-[18px]" />{l}</ALink>
          ))}
        </nav>
        <div className="m-3 rounded-xl bg-soft p-3 text-xs"><p className="font-semibold text-navy">Speed Money Finance</p><p className="text-muted-foreground">Kochi branch · Admin</p></div>
      </aside>
      {open && <div className="fixed inset-0 z-20 bg-navy/30 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-card/90 px-6 backdrop-blur">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5 text-navy" /></button>
          <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input placeholder="Search customers, loans, applications…" className={cn(inputCls, "h-10 bg-muted/60 pl-9")} /></div>
          <ALink s="notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-border"><Bell className="h-5 w-5 text-navy" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" /></ALink>
          <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground">AK</div><div className="hidden text-sm sm:block"><p className="font-semibold text-navy">Anil Kumar</p><p className="text-[11px] text-muted-foreground">Administrator</p></div></div>
        </header>
        <main className="space-y-6 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-bold text-navy">{title}</h1>{sub && <p className="text-sm text-muted-foreground">{sub}</p>}</div><div className="flex flex-wrap gap-2">{actions}</div></div>
          {children}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: I, tone = "info", delta }: { label: string; value: string; icon: typeof Users; tone?: "info" | "success" | "warning" | "danger"; delta?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between"><p className="text-xs font-semibold text-muted-foreground">{label}</p><IconTile icon={I} tone={tone} /></div>
      <p className="mt-2 text-xl font-extrabold text-navy tnum 2xl:text-2xl">{value}</p>
      {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
    </Card>
  );
}
const Panel = ({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden", className)}><div className="flex items-center justify-between border-b border-border px-5 py-4"><h3 className="font-bold text-navy">{title}</h3>{action}</div>{children}</Card>
);
const viewBtn = (s: string, label = "View") => <ALink s={s} className="text-xs font-semibold text-primary hover:underline">{label}</ALink>;
const FilterBar = ({ opts }: { opts: string[] }) => { const [v, setV] = useState("All"); return <Chips options={["All", ...opts]} value={v} onChange={setV} />; };
const chart = { tick: { fontSize: 12, fill: "var(--muted-foreground)" } };

function Dashboard() {
  return (
    <Shell title="Dashboard" sub="Friday, 02 October 2026">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Total Customers" value="250" icon={Users} delta="+12 this month" />
        <Stat label="Active Loans" value="183" icon={Wallet} tone="success" />
        <Stat label="Pending Applications" value="17" icon={FileText} tone="warning" />
        <Stat label="Today's Collections" value={inr(84500)} icon={IndianRupee} tone="success" />
        <Stat label="Outstanding Amount" value="₹82,46,300" icon={TrendingUp} />
        <Stat label="Overdue Amount" value="₹3,18,450" icon={AlertTriangle} tone="danger" />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Pending Applications" action={viewBtn("applications", "View all")} className="xl:col-span-2">
          <Table cols={["Application", "Customer", "Type", "Amount", "Status", ""]} rows={applications.filter((a) => ["Submitted", "Under Review"].includes(a.status)).map((a) => [a.id, a.name, a.type, inr(a.amount), <Badge>{a.status}</Badge>, viewBtn("application-review", "Review")])} />
        </Panel>
        <Panel title="Agent Cash Summary" action={viewBtn("cash")}>
          <div className="divide-y divide-border">{agents.map((a) => <div key={a.id} className="flex items-center justify-between px-5 py-3"><div><p className="text-sm font-semibold text-navy">{a.name}</p><p className="text-xs text-muted-foreground">Collected {inr(a.today)}</p></div><div className="text-right"><p className="text-sm font-bold text-navy tnum">{inr(a.held)}</p><p className="text-[11px] text-muted-foreground">held</p></div></div>)}</div>
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Recent Disbursements" action={viewBtn("disbursement")}>
          <div className="divide-y divide-border">{[["Sunita Bai", 65000, "01 Oct"], ["Naveen Raj", 120000, "30 Sep"], ["Kavita Joshi", 40000, "29 Sep"]].map(([n, a, d]) => <div key={n as string} className="flex justify-between px-5 py-3 text-sm"><span className="font-semibold text-navy">{n}</span><span className="tnum text-navy">{inr(a as number)} <span className="text-xs text-muted-foreground">· {d}</span></span></div>)}</div>
        </Panel>
        <Panel title="Today's Collections" action={viewBtn("payments")}>
          <div className="h-[180px] p-4"><ResponsiveContainer><BarChart data={[{ h: "9a", v: 12 }, { h: "11a", v: 24 }, { h: "1p", v: 18 }, { h: "3p", v: 21 }, { h: "5p", v: 9 }]}><XAxis dataKey="h" {...chart} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="v" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Overdue Loans" action={viewBtn("emis")}>
          <div className="divide-y divide-border">{customers.filter((c) => c.status === "Overdue").concat(customers.slice(4, 5)).map((c) => <div key={c.id} className="flex justify-between px-5 py-3 text-sm"><span className="font-semibold text-navy">{c.name}</span><span className="font-semibold text-destructive tnum">{inr(c.emi)}</span></div>)}</div>
        </Panel>
      </div>
    </Shell>
  );
}

function CustomersScreen() {
  return (
    <Shell title="Customers" sub="250 customers" actions={<><ALink s="import" className={btn("outline", "sm")}><Upload className="h-4 w-4" />Import Customers</ALink><ALink s="add-customer" className={btn("primary", "sm")}><Plus className="h-4 w-4" />Add Customer</ALink></>}>
      <FilterBar opts={["Active", "Inactive", "Existing", "New"]} />
      <Card className="overflow-hidden">
        <Table cols={["Customer ID", "Name", "Mobile", "Active Loan", "Outstanding", "Next EMI", "Status", "Actions"]} rows={customers.map((c) => [<span className="font-mono text-xs">{c.id}</span>, <span className="font-semibold">{c.name}</span>, c.mobile, c.loan ? inr(c.loan) : "—", c.outstanding ? inr(c.outstanding) : "—", c.emi ? c.due : "—", <Badge>{c.status}</Badge>, viewBtn("customer")])} />
        <Pagination total={250} />
      </Card>
    </Shell>
  );
}

function AddCustomer() {
  return (
    <Shell title="Add Customer" sub="Create a new customer profile" actions={<ALink s="customers" className={btn("outline", "sm")}>Cancel</ALink>}>
      <Card className="max-w-3xl p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Customer ID"><Input defaultValue="CUS-10332" /></Field><Field label="Name"><Input placeholder="Full name" /></Field>
          <Field label="Mobile"><Input placeholder="+91" /></Field><Field label="Email"><Input placeholder="name@example.in" /></Field>
          <Field label="DOB"><Input type="date" /></Field><Field label="Status"><Select options={["Active", "Inactive"]} /></Field>
          <div className="md:col-span-2"><Field label="Address"><Input placeholder="House, street, city, PIN" /></Field></div>
        </div>
        <div className="mt-6 flex justify-end gap-2"><ALink s="customers" className={btn("outline")}>Cancel</ALink><ALink s="customer" className={btn("primary")}>Create Customer</ALink></div>
      </Card>
    </Shell>
  );
}

function Import() {
  const [stage, setStage] = useState(0);
  return (
    <Shell title="Import Customers" sub="Bulk upload from Excel">
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-2">
          <button onClick={() => setStage(1)} className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-input bg-muted/40 p-10 text-center">
            <IconTile icon={FileSpreadsheet} tone={stage ? "success" : "info"} />
            {stage ? <p className="text-sm font-semibold text-success">customers_oct_2026.xlsx · 48 rows</p> : <><p className="text-sm font-semibold text-navy">Drag & drop your Excel file here</p><p className="text-xs text-muted-foreground">.xlsx or .csv · up to 5,000 rows</p></>}
          </button>
          <div className="mt-4 flex gap-2"><Button variant="outline" size="sm" onClick={() => setStage(1)}><Upload className="h-4 w-4" />Upload File</Button><Button variant="secondary" size="sm" disabled={stage < 1} onClick={() => setStage(2)}>Validate</Button><Button size="sm" disabled={stage < 2}>Import Customers</Button></div>
        </Card>
        <Card className="p-6"><h3 className="font-bold text-navy">Expected columns</h3><ul className="mt-3 space-y-2 text-sm">{["customer_id", "name", "mobile", "email", "dob", "address", "status"].map((c) => <li key={c} className="flex items-center gap-2 font-mono text-xs text-navy"><Check className="h-3.5 w-3.5 text-success" />{c}</li>)}</ul></Card>
      </div>
      {stage > 0 && (
        <Panel title="Preview" action={stage === 2 ? <Badge tone="success">46 valid · 2 errors</Badge> : <Badge tone="neutral">Not validated</Badge>}>
          <Table cols={["Row", "Customer ID", "Name", "Mobile", "Status", "Validation"]} rows={customers.slice(0, 6).map((c, i) => [i + 1, c.id, c.name, i === 3 ? "98765" : c.mobile, c.status, stage === 2 ? (i === 3 ? <Badge tone="danger">Invalid mobile</Badge> : <Badge tone="success">OK</Badge>) : "—"])} />
        </Panel>
      )}
    </Shell>
  );
}

function CustomerDetail() {
  const [t, setT] = useState("Overview");
  return (
    <Shell title="Harun R" sub="CUS-10248 · Customer since May 2026" actions={<><Badge tone="success">KYC Verified</Badge></>}>
      <Tabs options={["Overview", "Loans", "Payments", "Documents", "Activity"]} value={t} onChange={setT} />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-5"><h3 className="font-bold text-navy">Profile</h3><div className="mt-2 divide-y divide-border"><KV k="Mobile" v="+91 98765 43210" /><KV k="Email" v="harun.r@example.in" /><KV k="DOB" v="14 Apr 1992" /><KV k="City" v="Kochi, Kerala" /><KV k="Assigned agent" v="Ravi Shankar" /></div></Card>
        <Panel title="Active Loans" className="xl:col-span-2"><Table cols={["Loan ID", "Product", "Principal", "Outstanding", "Next EMI", "Status", ""]} rows={[["SM-LN-2026-0418", "Personal & Emergency", inr(50000), inr(38500), "05 Oct 2026", <Badge>Active</Badge>, viewBtn("loan")]]} /></Panel>
        <Panel title="Payment History" className="xl:col-span-2"><Table cols={["EMI", "Amount", "Date", "Method", "Status"]} rows={emis.slice(0, 4).map((e) => [`#${String(e.no).padStart(2, "0")}`, inr(e.amount), e.date, e.no === 2 ? "Cash" : "UPI", <Badge>Paid</Badge>])} /></Panel>
        <Panel title="Documents"><div className="divide-y divide-border">{["PAN Card", "Aadhaar", "Bank Statement", "Loan Agreement"].map((d) => <div key={d} className="flex items-center justify-between px-5 py-3 text-sm"><span className="flex items-center gap-2 text-navy"><FileText className="h-4 w-4 text-primary" />{d}</span><Badge>Verified</Badge></div>)}</div></Panel>
      </div>
    </Shell>
  );
}

function Applications() {
  return (
    <Shell title="Applications" sub="17 awaiting action">
      <FilterBar opts={["Submitted", "Under Review", "Approved", "Rejected", "Disbursement Pending"]} />
      <Card className="overflow-hidden"><Table cols={["Application ID", "Customer", "Loan Type", "Amount", "Submitted", "Status", "Action"]} rows={applications.map((a) => [<span className="font-mono text-xs">{a.id}</span>, <span className="font-semibold">{a.name}</span>, a.type, inr(a.amount), a.date, <Badge>{a.status}</Badge>, viewBtn("application-review", "Review")])} /><Pagination total={64} /></Card>
    </Shell>
  );
}

function AppReview() {
  const [decision, setDecision] = useState<null | "approved" | "rejected">(null);
  const sec: [string, [string, string][]][] = [
    ["Customer", [["Name", "Harun R"], ["Mobile", "+91 98765 43210"], ["Customer ID", "CUS-10248"]]],
    ["Loan", [["Product", "Personal & Emergency"], ["Amount", "₹50,000"], ["Tenure", "12 months"], ["Rate", "18% p.a."]]],
    ["Personal", [["DOB", "14 Apr 1992"], ["Gender", "Male"], ["Address", "Edappally, Kochi 682024"]]],
    ["Employment", [["Type", "Salaried"], ["Employer", "Malabar Traders Pvt Ltd"], ["Income", "₹32,000 / month"], ["Obligations", "₹0"]]],
    ["Bank", [["Bank", "HDFC Bank"], ["Account", "50100248193021"], ["IFSC", "HDFC0001234"]]],
    ["KYC", [["PAN", "ABCPR1234K · Verified"], ["Aadhaar", "XXXX XXXX 4821 · Verified"], ["Selfie match", "96%"]]],
    ["Property", [["Applicable", "Not applicable for this product"]]],
  ];
  return (
    <Shell title="SM-2026-00123" sub="Submitted 28 Sep 2026 · Personal & Emergency Loan"
      actions={decision ? <Badge tone={decision === "approved" ? "success" : "danger"}>{decision === "approved" ? "Approved" : "Rejected"}</Badge> : <><Button variant="outline" size="sm" className="text-destructive" onClick={() => setDecision("rejected")}><X className="h-4 w-4" />Reject Application</Button><Button variant="success" size="sm" onClick={() => setDecision("approved")}><Check className="h-4 w-4" />Approve Application</Button></>}>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="grid gap-6 md:grid-cols-2 xl:col-span-2">{sec.map(([t, rows]) => <Card key={t} className="p-5"><h3 className="font-bold text-navy">{t}</h3><div className="mt-2 divide-y divide-border">{rows.map(([k, v]) => <KV key={k} k={k} v={v} />)}</div></Card>)}</div>
        <Panel title="Documents"><div className="grid grid-cols-2 gap-3 p-4">{["PAN Card", "Aadhaar", "Bank Statement", "Selfie", "Signature"].map((d) => <div key={d} className="rounded-xl border border-border p-2"><div className="grid aspect-[4/3] place-items-center rounded-lg bg-muted"><FileText className="h-6 w-6 text-muted-foreground" /></div><div className="mt-2 flex items-center justify-between"><span className="text-xs font-semibold text-navy">{d}</span><Eye className="h-3.5 w-3.5 text-primary" /></div></div>)}</div></Panel>
      </div>
      {decision === "approved" && <div className="flex items-center justify-between rounded-2xl bg-success-soft p-4"><p className="text-sm font-semibold text-navy">Application approved. Proceed to disbursement.</p><ALink s="disbursement" className={btn("primary", "sm")}>Go to Disbursement</ALink></div>}
    </Shell>
  );
}

function Disbursement() {
  const [proof, setProof] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <Shell title="Disbursement" sub="Confirm fund transfer for approved loans">
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-5"><h3 className="font-bold text-navy">Loan</h3><div className="mt-2 divide-y divide-border"><KV k="Loan ID" v="SM-LN-2026-0421" /><KV k="Customer" v="Ramesh Gowda" /><KV k="Approved Amount" v={inr(30000)} strong /><KV k="Bank Account" v="SBI · XXXX 7712" /><KV k="Status" v={<Badge>{done ? "Completed" : "Disbursement Pending"}</Badge>} /></div></Card>
        <Card className="p-5 xl:col-span-2">
          <h3 className="font-bold text-navy">Transfer details</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Transfer Date"><Input type="date" defaultValue="2026-10-02" /></Field><Field label="Bank Reference"><Input placeholder="UTR / NEFT reference" /></Field></div>
          <button onClick={() => setProof(true)} className="mt-4 flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-input p-4 text-left">{proof ? <Check className="h-5 w-5 text-success" /> : <Upload className="h-5 w-5 text-primary" />}<span className="text-sm font-semibold text-navy">{proof ? "transfer_proof.pdf uploaded" : "Upload Payment Proof"}</span></button>
          <div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setProof(true)}>Upload Proof</Button><Button disabled={!proof || done} onClick={() => setDone(true)}>{done ? "Disbursed" : "Confirm Disbursement"}</Button></div>
        </Card>
      </div>
      <Panel title="Pending Disbursements"><Table cols={["Loan ID", "Customer", "Amount", "Approved", "Status"]} rows={[["SM-LN-2026-0421", "Ramesh Gowda", inr(30000), "25 Sep", <Badge>{done ? "Completed" : "Pending"}</Badge>], ["SM-LN-2026-0420", "Sunita Bai", inr(65000), "25 Sep", <Badge>Pending</Badge>], ["SM-LN-2026-0419", "Naveen Raj", inr(120000), "23 Sep", <Badge>Pending</Badge>]]} /></Panel>
    </Shell>
  );
}

function Loans() {
  return (
    <Shell title="Loans" sub="183 active loans">
      <FilterBar opts={["Active", "Completed", "Overdue", "Pending Disbursement"]} />
      <Card className="overflow-hidden"><Table cols={["Loan ID", "Customer", "Product", "Principal", "Outstanding", "EMI", "Next Due Date", "Status", ""]} rows={customers.filter((c) => c.loan).map((c, i) => [<span className="font-mono text-xs">SM-LN-2026-{String(418 - i * 3).padStart(4, "0")}</span>, <span className="font-semibold">{c.name}</span>, c.product, inr(c.loan), inr(c.outstanding), inr(c.emi), c.due, <Badge>{c.status === "Overdue" ? "Overdue" : "Active"}</Badge>, viewBtn("loan")])} /><Pagination total={183} /></Card>
    </Shell>
  );
}

function LoanDetail() {
  return (
    <Shell title="SM-LN-2026-0418" sub="Harun R · Personal & Emergency Loan" actions={<><Button variant="outline" size="sm"><FileText className="h-4 w-4" />View Agreement</Button><Button variant="outline" size="sm"><Download className="h-4 w-4" />View Invoice</Button><Button size="sm" variant="secondary"><CalendarDays className="h-4 w-4" />View Schedule</Button></>}>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4"><Stat label="Principal" value={inr(50000)} icon={Wallet} /><Stat label="Outstanding" value={inr(38500)} icon={TrendingUp} tone="warning" /><Stat label="EMI" value={inr(4250)} icon={CalendarDays} /><Stat label="Paid EMIs" value="4 / 12" icon={Check} tone="success" /></div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-5"><h3 className="font-bold text-navy">Loan information</h3><div className="mt-2 divide-y divide-border"><KV k="Customer" v="Harun R" /><KV k="Rate" v="18% p.a." /><KV k="Tenure" v="12 months" /><KV k="Disbursed" v="02 Jun 2026" /><KV k="Disbursed to" v="HDFC XXXX 3021" /><KV k="Bank ref" v="HDFCN26153889201" /></div></Card>
        <Panel title="EMI Schedule" className="xl:col-span-2"><Table cols={["EMI", "Due Date", "Amount", "Status"]} rows={emis.slice(0, 7).map((e) => [`#${String(e.no).padStart(2, "0")}`, e.date, inr(e.amount), <Badge>{e.status}</Badge>])} /></Panel>
      </div>
      <Panel title="Activity"><div className="divide-y divide-border">{[["EMI #04 paid via UPI", "05 Sep 2026"], ["EMI #02 collected in cash by Ravi Shankar", "05 Jul 2026"], ["Loan disbursed", "02 Jun 2026"], ["Application approved by Anil Kumar", "01 Jun 2026"]].map(([a, d]) => <div key={a} className="flex justify-between px-5 py-3 text-sm"><span className="text-navy">{a}</span><span className="text-muted-foreground">{d}</span></div>)}</div></Panel>
    </Shell>
  );
}

function Emis() {
  const st = ["Due Today", "Upcoming", "Overdue", "Paid"];
  return (
    <Shell title="EMI Management">
      <FilterBar opts={st} />
      <Card className="overflow-hidden"><Table cols={["EMI ID", "Loan", "Customer", "Due Date", "Amount", "Paid", "Penalty", "Status"]} rows={customers.filter((c) => c.emi).map((c, i) => { const s = c.status === "Overdue" ? "Overdue" : st[i % 4]; return [<span className="font-mono text-xs">EMI-{8800 + i}</span>, `SM-LN-${418 - i * 3}`, c.name, c.due, inr(c.emi), s === "Paid" ? inr(c.emi) : "₹0", s === "Overdue" ? inr(250) : "₹0", <Badge>{s}</Badge>]; })} /><Pagination total={1240} /></Card>
    </Shell>
  );
}

function Payments() {
  return (
    <Shell title="Payments" actions={<Button variant="outline" size="sm"><Download className="h-4 w-4" />Export</Button>}>
      <FilterBar opts={["UPI", "Cash", "Successful", "Failed", "Pending"]} />
      <Card className="overflow-hidden"><Table cols={["Payment ID", "Customer", "Loan", "EMI", "Amount", "Method", "Transaction ID", "Date", "Status"]} rows={customers.filter((c) => c.emi).map((c, i) => [<span className="font-mono text-xs">PAY-{52100 + i}</span>, c.name, `SM-LN-${418 - i * 3}`, `#0${(i % 8) + 1}`, inr(c.emi), i % 3 === 1 ? "Cash" : "UPI", <span className="font-mono text-xs">{i % 3 === 1 ? `RCPT-2026-0${4800 + i}` : `SMT88${42193 + i * 71}`}</span>, `0${(i % 2) + 1} Oct 2026`, <Badge>{i === 5 ? "Failed" : i === 8 ? "Pending" : "Successful"}</Badge>])} /><Pagination total={2318} /></Card>
    </Shell>
  );
}

function Agents() {
  return (
    <Shell title="Agents" actions={<><ALink s="assignment" className={btn("outline", "sm")}>Assign Customers</ALink><Button size="sm"><Plus className="h-4 w-4" />Add Agent</Button></>}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{agents.map((a) => <Card key={a.id} className="p-5"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sm font-bold text-navy-foreground">{a.name.split(" ").map((x) => x[0]).join("")}</div><div className="flex-1"><p className="font-semibold text-navy">{a.name}</p><p className="text-xs text-muted-foreground">{a.id} · {a.mobile}</p></div><Badge>{a.status}</Badge></div><div className="mt-4 grid grid-cols-3 gap-2 text-center">{[["Customers", a.assigned], ["Today", inr(a.today)], ["Cash held", inr(a.held)]].map(([k, v]) => <div key={k as string} className="rounded-xl bg-muted/70 p-2"><p className="text-[10px] text-muted-foreground">{k}</p><p className="text-sm font-bold text-navy tnum">{v}</p></div>)}</div></Card>)}</div>
      <Card className="overflow-hidden"><Table cols={["Agent ID", "Name", "Mobile", "Assigned Customers", "Today's Collection", "Cash Held", "Status"]} rows={agents.map((a) => [a.id, <span className="font-semibold">{a.name}</span>, a.mobile, a.assigned, inr(a.today), inr(a.held), <Badge>{a.status}</Badge>])} /></Card>
    </Shell>
  );
}

function Assignment() {
  const [sel, setSel] = useState<string[]>(["CUS-10255"]);
  const [agent, setAgent] = useState("AGT-01");
  return (
    <Shell title="Agent Assignment" actions={<><Button variant="outline" size="sm">Reassign</Button><Button size="sm" disabled={!sel.length}>Assign {sel.length} customer{sel.length === 1 ? "" : "s"}</Button></>}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Customers"><div className="divide-y divide-border">{customers.slice(0, 8).map((c) => <label key={c.id} className="flex cursor-pointer items-center gap-3 px-5 py-3"><input type="checkbox" className="h-4 w-4 accent-primary" checked={sel.includes(c.id)} onChange={(e) => setSel(e.target.checked ? [...sel, c.id] : sel.filter((x) => x !== c.id))} /><div className="flex-1"><p className="text-sm font-semibold text-navy">{c.name}</p><p className="text-xs text-muted-foreground">{c.id} · {c.place}</p></div><span className="text-xs text-muted-foreground">{c.product}</span></label>)}</div></Panel>
        <Panel title="Select Agent"><div className="space-y-3 p-4">{agents.filter((a) => a.status === "Active").map((a) => <button key={a.id} onClick={() => setAgent(a.id)} className={cn("flex w-full items-center gap-3 rounded-xl border p-4 text-left", agent === a.id ? "border-primary bg-soft" : "border-border")}><div className="flex-1"><p className="text-sm font-semibold text-navy">{a.name}</p><p className="text-xs text-muted-foreground">{a.assigned} assigned customers</p></div>{agent === a.id && <Check className="h-5 w-5 text-primary" />}</button>)}</div></Panel>
      </div>
    </Shell>
  );
}

function Cash() {
  return (
    <Shell title="Cash Collections" actions={<ALink s="ledger" className={btn("secondary", "sm")}>Agent Cash Ledger <ChevronRight className="h-4 w-4" /></ALink>}>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4"><Stat label="Today's Cash Collected" value={inr(84500)} icon={HandCoins} tone="success" /><Stat label="Cash Held by Agents" value={inr(39750)} icon={Wallet} tone="warning" /><Stat label="Deposited" value={inr(44750)} icon={Check} /><Stat label="Pending Reconciliation" value={inr(13150)} icon={Clock} tone="danger" /></div>
      <Card className="overflow-hidden"><Table cols={["Agent", "Customer", "EMI", "Amount", "Date", "OTP", "Signature", "Status"]} rows={[["Ravi Shankar", "Harun R", "#05", 4250], ["Ravi Shankar", "Gopal Reddy", "#07", 3900], ["Manoj Thomas", "Fatima Shaikh", "#03", 5200], ["Sajitha K", "Meena Pillai", "#06", 7250], ["Ravi Shankar", "Suresh Kumar", "#03", 14200]].map(([a, c, e, amt], i) => [a, c, e, inr(amt as number), "02 Oct 2026", <ShieldCheck className="h-4 w-4 text-success" />, <Check className="h-4 w-4 text-success" />, <Badge>{i < 2 ? "Held" : "Deposited"}</Badge>])} /></Card>
    </Shell>
  );
}

function LedgerScreen() {
  return (
    <Shell title="Agent Cash Ledger" actions={<><select className={cn(inputCls, "h-9 w-48")}>{agents.map((a) => <option key={a.id}>{a.name}</option>)}</select><Button size="sm"><Plus className="h-4 w-4" />Record Deposit</Button></>}>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4"><Stat label="Opening Cash" value="₹0" icon={Wallet} /><Stat label="Collections" value={inr(51250)} icon={HandCoins} tone="success" /><Stat label="Deposits" value={inr(38100)} icon={Send} /><Stat label="Current Cash Held" value={inr(13150)} icon={IndianRupee} tone="warning" /></div>
      <Card className="overflow-hidden"><Table cols={["Time", "Customer", "Collection", "Deposit", "Balance"]} rows={[["09:31 AM", "Suresh Kumar", inr(14200), "—", inr(14200)], ["10:05 AM", "Gopal Reddy", inr(3900), "—", inr(18100)], ["10:42 AM", "Harun R", inr(4250), "—", inr(22350)], ["11:30 AM", "Priya Nair", inr(6800), "—", inr(29150)], ["12:10 PM", "Arjun Patil", inr(8950), "—", inr(38100)], ["01:15 PM", "HDFC Branch deposit", "—", inr(38100), "₹0"], ["03:40 PM", "Lakshmi Venkat", inr(13150), "—", inr(13150)]]} /></Card>
    </Shell>
  );
}

function Documents() {
  const [c, setC] = useState("KYC");
  return (
    <Shell title="Documents" sub="Encrypted document vault">
      <Chips options={["KYC", "Loan Agreements", "Invoices", "Disbursement Proof", "Receipts", "Property Documents"]} value={c} onChange={setC} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{customers.slice(0, 8).map((cu, i) => <Card key={cu.id} className="p-4"><div className="flex items-start justify-between"><IconTile icon={FileText} /><Badge>{i === 2 ? "Pending" : i === 6 ? "Rejected" : "Verified"}</Badge></div><p className="mt-3 text-sm font-semibold text-navy">{c} — {cu.name}</p><p className="text-xs text-muted-foreground">{cu.id} · PDF · {120 + i * 37} KB</p><div className="mt-3 flex gap-2"><Button variant="secondary" size="sm" className="flex-1"><Eye className="h-4 w-4" />View</Button><Button variant="outline" size="sm"><Download className="h-4 w-4" /></Button></div></Card>)}</div>
    </Shell>
  );
}

function Reports() {
  const pie = [{ n: "Personal", v: 48 }, { n: "Agri", v: 34 }, { n: "LAP", v: 18 }];
  const colors = ["var(--chart-1)", "var(--chart-3)", "var(--chart-4)"];
  return (
    <Shell title="Reports" sub="May – Oct 2026 · figures in ₹ lakh" actions={<Button variant="outline" size="sm"><Download className="h-4 w-4" />Export PDF</Button>}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6"><Stat label="Total Disbursed" value="₹1.42 Cr" icon={Send} /><Stat label="Total Outstanding" value="₹82.4 L" icon={TrendingUp} /><Stat label="Total Collected" value="₹59.8 L" icon={Check} tone="success" /><Stat label="Overdue" value="₹3.18 L" icon={AlertTriangle} tone="danger" /><Stat label="Cash Collections" value="₹12.0 L" icon={HandCoins} /><Stat label="UPI Collections" value="₹26.8 L" icon={CreditCard} /></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Loan portfolio"><div className="flex h-[260px] items-center p-4"><ResponsiveContainer><PieChart><Pie data={pie} dataKey="v" nameKey="n" innerRadius={60} outerRadius={95} paddingAngle={2}>{pie.map((_, i) => <Cell key={i} fill={colors[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="space-y-2 pr-6">{pie.map((p, i) => <div key={p.n} className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded" style={{ background: colors[i] }} /><span className="text-navy">{p.n}</span><span className="font-semibold text-navy">{p.v}%</span></div>)}</div></div></Panel>
        <Panel title="Monthly collections"><div className="h-[260px] p-4"><ResponsiveContainer><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...chart} axisLine={false} tickLine={false} /><YAxis {...chart} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="upi" name="UPI" stackId="a" fill="var(--chart-1)" /><Bar dataKey="cash" name="Cash" stackId="a" fill="var(--chart-2)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Outstanding"><div className="h-[240px] p-4"><ResponsiveContainer><AreaChart data={monthly.map((m, i) => ({ ...m, o: 62 + i * 4 }))}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...chart} axisLine={false} tickLine={false} /><YAxis {...chart} axisLine={false} tickLine={false} /><Tooltip /><Area dataKey="o" name="Outstanding" stroke="var(--chart-1)" fill="var(--soft)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></Panel>
        <Panel title="Overdue"><div className="h-[240px] p-4"><ResponsiveContainer><LineChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...chart} axisLine={false} tickLine={false} /><YAxis {...chart} axisLine={false} tickLine={false} /><Tooltip /><Line dataKey="overdue" name="Overdue" stroke="var(--chart-5)" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></Panel>
      </div>
    </Shell>
  );
}

function NotificationsScreen() {
  const [t, setT] = useState("Scheduled reminders");
  const data: Record<string, [string, string, string, string][]> = {
    "Scheduled reminders": [["EMI due in 7 days", "SMS + Push", "48 customers", "Daily 9:00 AM"], ["EMI due tomorrow", "SMS + WhatsApp", "18 customers", "Daily 6:00 PM"], ["Overdue follow-up", "SMS", "6 customers", "Daily 10:00 AM"]],
    "Sent notifications": [["Payment received", "Push", "Harun R", "02 Oct, 8:12 AM"], ["Loan approved", "SMS", "Sunita Bai", "01 Oct, 4:30 PM"], ["Application received", "Push", "Pooja Sharma", "30 Sep, 11:02 AM"]],
    "Failed notifications": [["EMI reminder", "SMS", "Rakesh Yadav", "DND active"], ["Payment received", "Push", "Fatima Shaikh", "App uninstalled"]],
  };
  return (
    <Shell title="Notifications" actions={<Button size="sm"><Plus className="h-4 w-4" />New Reminder</Button>}>
      <Tabs options={Object.keys(data)} value={t} onChange={setT} />
      <Card className="overflow-hidden"><Table cols={["Notification", "Channel", "Recipient", t === "Failed notifications" ? "Reason" : "Schedule / Time", "Status"]} rows={data[t].map((r) => [...r, <Badge>{t.startsWith("Sch") ? "Scheduled" : t.startsWith("Sent") ? "Sent" : "Failed"}</Badge>])} /></Card>
    </Shell>
  );
}

function SettingsScreen() {
  const cards: [string, [string, string][]][] = [
    ["Loan Products", [["Agri & Rural Allied", "Enabled"], ["Personal & Emergency", "Enabled"], ["Loan Against Property", "Enabled"]]],
    ["Interest Rates", [["Agri & Rural", "12% – 28%"], ["Personal", "15% – 20%"], ["LAP", "Custom"]]],
    ["Processing Fee", [["Personal", "2% + GST"], ["Agri", "1.5% + GST"], ["LAP", "1% + GST"]]],
    ["Penalty Rules", [["Grace period", "3 days"], ["Late fee", "₹250 / EMI"], ["Penal interest", "2% p.m."]]],
    ["Notification Settings", [["SMS sender ID", "SPDMNY"], ["WhatsApp", "Enabled"], ["Reminder days", "7, 1, 0"]]],
    ["Company Information", [["Name", "Speed Money Finance Pvt Ltd"], ["NBFC Reg.", "N-16.00XXX"], ["Support", "1800 123 4567"]]],
  ];
  return (
    <Shell title="Settings">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{cards.map(([t, rows]) => <Card key={t} className="p-5"><div className="flex items-center justify-between"><h3 className="font-bold text-navy">{t}</h3><Button variant="ghost" size="sm">Edit</Button></div><div className="mt-1 divide-y divide-border">{rows.map(([k, v]) => <KV key={k} k={k} v={v} />)}</div></Card>)}</div>
    </Shell>
  );
}

function Audit() {
  const rows: [string, string, string, string, string, string][] = [
    ["02 Oct 2026, 10:44", "Ravi Shankar", "Agent", "Cash Collected", "RCPT-2026-04821", "Success"],
    ["02 Oct 2026, 08:12", "System", "System", "Payment Recorded", "PAY-52100", "Success"],
    ["01 Oct 2026, 17:05", "Anil Kumar", "Admin", "Disbursement Confirmed", "SM-LN-2026-0420", "Success"],
    ["01 Oct 2026, 16:30", "Anil Kumar", "Admin", "Loan Approved", "SM-2026-00120", "Success"],
    ["30 Sep 2026, 12:18", "Anil Kumar", "Admin", "Loan Rejected", "SM-2026-00118", "Success"],
    ["30 Sep 2026, 09:40", "Anil Kumar", "Admin", "Agent Assigned", "CUS-10255 → AGT-01", "Success"],
    ["29 Sep 2026, 15:22", "Manoj Thomas", "Agent", "Cash Collected", "RCPT-2026-04790", "Failed"],
  ];
  return (
    <Shell title="Audit Logs" actions={<Button variant="outline" size="sm"><Download className="h-4 w-4" />Export</Button>}>
      <Card className="overflow-hidden"><Table cols={["Timestamp", "User", "Role", "Action", "Record", "Status"]} rows={rows.map((r) => [r[0], <span className="font-semibold">{r[1]}</span>, <Badge tone="neutral">{r[2]}</Badge>, r[3], <span className="font-mono text-xs">{r[4]}</span>, <Badge>{r[5]}</Badge>])} /><Pagination total={1842} /></Card>
    </Shell>
  );
}

export const adminScreens: Record<string, { c: () => ReactNode; t: string }> = {
  dashboard: { c: Dashboard, t: "Dashboard" }, customers: { c: CustomersScreen, t: "Customers" }, "add-customer": { c: AddCustomer, t: "Add Customer" }, import: { c: Import, t: "Import Customers" },
  customer: { c: CustomerDetail, t: "Customer Details" }, applications: { c: Applications, t: "Applications" }, "application-review": { c: AppReview, t: "Application Review" },
  disbursement: { c: Disbursement, t: "Disbursement" }, loans: { c: Loans, t: "Loans" }, loan: { c: LoanDetail, t: "Loan Details" }, emis: { c: Emis, t: "EMI Management" },
  payments: { c: Payments, t: "Payments" }, agents: { c: Agents, t: "Agents" }, assignment: { c: Assignment, t: "Agent Assignment" }, cash: { c: Cash, t: "Cash Collections" },
  ledger: { c: LedgerScreen, t: "Agent Cash Ledger" }, documents: { c: Documents, t: "Documents" }, reports: { c: Reports, t: "Reports" },
  notifications: { c: NotificationsScreen, t: "Notifications" }, settings: { c: SettingsScreen, t: "Settings" }, audit: { c: Audit, t: "Audit Logs" },
};
