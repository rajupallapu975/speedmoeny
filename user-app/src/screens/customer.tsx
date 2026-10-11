import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  ArrowRight, Home, Wallet, CalendarDays, Bell, User, PlusCircle, FileText, History, ShieldCheck, Calculator, Headphones,
  Sprout, HeartPulse, Building2, Check, X, ChevronRight, Phone, Mail, MessageSquareWarning, HelpCircle, Lock, Camera,
  PenLine, IdCard, Fingerprint, Download, CreditCard, LogOut, Landmark, Clock, CircleCheck, Receipt, Loader2, Smartphone,
} from "lucide-react";
import {
  CLink, Logo, Button, btn, Card, Badge, MobileShell, AppHeader, backCls, BackIcon, BottomNav, Field, Input, Select,
  OtpInput, useCountdown, Chips, Progress, StepBar, Timeline, KV, IconTile, ResultState, EmptyState, UploadCard, SignaturePad,
} from "@/components/sm/ui";
import { customer, products, emis, payments, inr } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Keyboard } from "@capacitor/keyboard";
import { sendOtp, verifyOtp, resendOtp, subscribeAuth, getAuthState, logout, checkSession, type AuthState } from "@/lib/auth";

const navItems = [
  { s: "home", label: "Home", icon: Home, link: CLink },
  { s: "loans", label: "Loans", icon: Wallet, link: CLink },
  { s: "emi-schedule", label: "EMIs", icon: CalendarDays, link: CLink },
  { s: "profile", label: "Profile", icon: User, link: CLink },
];
const Nav = ({ a }: { a: string }) => <BottomNav items={navItems} active={a} />;
const Back = ({ to }: { to: string }) => <CLink s={to} className={backCls}><BackIcon /></CLink>;
const Page = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn("space-y-4 px-5", className)}>{children}</div>;
const Footer = ({ children }: { children: ReactNode }) => <div className="sticky bottom-0 mt-6 bg-gradient-to-t from-background via-background to-transparent px-5 pb-2 pt-4">{children}</div>;
const Go = ({ s, children, v = "primary" as const }: { s: string; children: ReactNode; v?: "primary" | "outline" | "secondary" }) => <CLink s={s} className={btn(v, "lg", true)}>{children}</CLink>;

/* 01 */
function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const session = checkSession();
    const target = session.valid ? "home" : "welcome";
    const t = setTimeout(() => nav({ to: "/app/$screen", params: { screen: target } }), 900);
    return () => clearTimeout(t);
  }, [nav]);
  return (
    <MobileShell className="bg-brand pb-0">
      <div className="flex min-h-[760px] flex-col items-center justify-center gap-6 text-center">
        <div className="animate-in fade-in zoom-in-95 duration-700"><Logo size="lg" light /></div>
        <p className="text-xs font-bold tracking-[0.2em] text-primary-foreground/90 uppercase">YOUR FINANCE. OUR EXPERTISE. YOUR GROWTH.</p>
        <Loader2 className="mt-8 h-5 w-5 animate-spin text-primary-foreground/60" />
      </div>
    </MobileShell>
  );
}

/* 02 */
function Welcome() {
  const nav = useNavigate();
  useEffect(() => {
    const session = checkSession();
    if (session.valid) {
      nav({ to: "/app/$screen", params: { screen: "home" } });
    }
  }, [nav]);
  return (
    <MobileShell>
      <div className="flex min-h-[780px] flex-col px-6 pt-8">
        <Logo />
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-brand p-6 text-primary-foreground">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-card/10" />
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Approved in minutes</p>
          <p className="mt-2 text-4xl font-extrabold tnum">{inr(75000)}</p>
          <p className="text-sm opacity-80">Personal & Emergency Loan</p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
            {[[ShieldCheck, "RBI-compliant"], [Clock, "Quick review"], [Lock, "Secure KYC"]].map(([I, t]) => { const Ic = I as typeof Lock; return <div key={t as string} className="rounded-xl bg-card/10 p-2.5"><Ic className="mx-auto mb-1 h-4 w-4" />{t as string}</div>; })}
          </div>
        </div>
        <h1 className="mt-8 text-3xl font-extrabold leading-tight text-navy">Welcome to Speed<span className="text-emerald-600">Money+</span></h1>
        <p className="mt-2 text-sm font-semibold tracking-wide uppercase text-emerald-600">Your Finance. Our Expertise. Your Growth.</p>
        <p className="mt-2 text-sm text-muted-foreground">Apply for instant loans digitally with a simple and secure application.</p>
        <div className="mt-auto space-y-4 pb-6 pt-8">
          <Go s="login">Get Started <ArrowRight className="h-5 w-5" /></Go>
          <p className="text-center text-sm text-muted-foreground">Already a user? <CLink s="login" className="font-semibold text-primary">Login</CLink></p>
        </div>
      </div>
    </MobileShell>
  );
}

function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 10);
  if (d.length > 5) {
    return `${d.slice(0, 5)} ${d.slice(5)}`;
  }
  return d;
}

function formatFullPhone(phone: string) {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 12 && clean.startsWith("91")) {
    const d = clean.slice(2);
    return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  }
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone;
}

/* 03 */
function Login() {
  const [m, setM] = useState("");
  const [auth, setAuth] = useState<AuthState>(getAuthState());
  const ref = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  useEffect(() => subscribeAuth(setAuth), []);
  useEffect(() => {
    const session = checkSession();
    if (session.valid) {
      nav({ to: "/app/$screen", params: { screen: "home" } });
    }
  }, [nav]);
  useEffect(() => {
    if (ref.current) {
      const d = ref.current.value.replace(/\D/g, "").slice(0, 10);
      setM(d);
      ref.current.value = formatPhone(d);
    }
  }, []);

  const handleContinue = async () => {
    if (m.length !== 10 || auth.isLoading) return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    try {
      Keyboard.hide().catch(() => {});
    } catch {}
    const res = await sendOtp(m);
    if (res.success) {
      nav({ to: "/app/$screen", params: { screen: "otp" } });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (m.length === 10 && !auth.isLoading) {
      handleContinue();
    }
  };

  return (
    <MobileShell>
      <form onSubmit={handleFormSubmit} className="flex min-h-[780px] flex-col px-6 pt-6">
        <Back to="welcome" />
        <h1 className="mt-8 text-2xl font-extrabold text-navy">Welcome to Speed<span className="text-emerald-600">Money+</span></h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your mobile number</p>
        <div className="mt-8 flex gap-2">
          <div className="flex h-14 items-center gap-1.5 rounded-xl border border-input bg-card px-4 text-sm font-semibold text-navy">🇮🇳 +91</div>
          <Input
            ref={ref}
            autoFocus
            inputMode="numeric"
            maxLength={11}
            defaultValue={formatPhone(m)}
            onInput={(e) => {
              const raw = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
              setM(raw);
              e.currentTarget.value = formatPhone(raw);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (m.length === 10 && !auth.isLoading) {
                  e.currentTarget.blur();
                  handleContinue();
                }
              }
            }}
            placeholder="98765 43210"
            className="h-14 text-base font-semibold tracking-wider"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">We'll send you an OTP to verify your number.</p>
        {auth.error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 animate-in fade-in">
            {auth.error}
          </div>
        )}
        <div className="mt-auto space-y-4 pb-6">
          <Button type="submit" full size="lg" disabled={m.length !== 10 || auth.isLoading}>
            {auth.isLoading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Sending OTP...</>
            ) : (
              <>Continue <ArrowRight className="h-5 w-5" /></>
            )}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            By continuing you agree to our <span className="font-semibold text-primary">Terms</span> & <span className="font-semibold text-primary">Privacy Policy</span>
          </p>
        </div>
      </form>
    </MobileShell>
  );
}

/* 04 */
function Otp() {
  const [t, reset] = useCountdown(30);
  const [code, setCode] = useState("");
  const [auth, setAuth] = useState<AuthState>(getAuthState());
  const nav = useNavigate();

  useEffect(() => subscribeAuth(setAuth), []);

  // Auto-open keyboard when arriving on OTP page
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        Keyboard.show().catch(() => {});
      } catch {}
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Auto-navigate if background Firebase verification succeeds
  useEffect(() => {
    if (auth.isAuthenticated) {
      nav({ to: "/app/$screen", params: { screen: "home" } });
    }
  }, [auth.isAuthenticated, nav]);

  const handleVerify = async (codeToVerify = code) => {
    if (codeToVerify.length !== 6 || auth.isLoading) return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    try {
      Keyboard.hide().catch(() => {});
    } catch {}
    const res = await verifyOtp(codeToVerify);
    if (res.success) {
      nav({ to: "/app/$screen", params: { screen: "home" } });
    }
  };

  // WebOTP API: automatically retrieve SMS OTP on Android
  useEffect(() => {
    if (typeof window !== "undefined" && "OTPCredential" in window) {
      const ac = new AbortController();
      (navigator.credentials as any)
        ?.get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((credential: any) => {
          if (credential && credential.code) {
            const digits = credential.code.replace(/\D/g, "").slice(0, 6);
            if (digits.length === 6) {
              setCode(digits);
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              handleVerify(digits);
            }
          }
        })
        .catch(() => {});
      return () => ac.abort();
    }
  }, []);

  const handleResend = async () => {
    reset();
    await resendOtp();
  };

  return (
    <MobileShell>
      <div className="flex min-h-[780px] flex-col px-6 pt-6">
        <Back to="login" />
        <h1 className="mt-8 text-2xl font-extrabold text-navy">Verify your number</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          OTP sent to <span className="font-semibold text-navy">{auth.phoneNumber ? formatFullPhone(auth.phoneNumber) : "+91 98765 43210"}</span>
        </p>
        <div className="mt-8">
          <OtpInput
            value={code}
            onChange={setCode}
            onComplete={(val) => {
              setCode(val);
              handleVerify(val);
            }}
          />
        </div>
        {auth.error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 animate-in fade-in">
            {auth.error}
          </div>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          {t > 0 ? (
            <>Resend OTP in <span className="font-semibold text-navy tnum">00:{String(t).padStart(2, "0")}</span></>
          ) : (
            <button onClick={handleResend} className="font-semibold text-primary">Resend OTP</button>
          )}
        </p>
        <div className="mt-auto pb-6">
          <Button
            full
            size="lg"
            disabled={code.length !== 6 || auth.isLoading}
            onClick={() => handleVerify()}
          >
            {auth.isLoading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Verifying...</>
            ) : (
              <>Verify <ArrowRight className="h-5 w-5" /></>
            )}
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}

function QuickActions({ items }: { items: [typeof Home, string, string][] }) {
  return (
    <div className={cn("grid gap-3", items.length === 4 ? "grid-cols-4" : "grid-cols-3")}>
      {items.map(([I, l, s]) => (
        <CLink key={l} s={s} className="flex flex-col items-center gap-2 rounded-2xl bg-card p-3 text-center shadow-card">
          <IconTile icon={I} /><span className="text-[11px] font-semibold leading-tight text-navy">{l}</span>
        </CLink>
      ))}
    </div>
  );
}
function Greeting({ sub }: { sub: string }) {
  return (
    <div className="flex items-center justify-between px-5 pt-6">
      <div><h1 className="text-xl font-bold text-navy">Hi, {customer.first} 👋</h1><p className="text-sm text-muted-foreground">{sub}</p></div>
      <CLink s="notifications" className={cn(backCls, "relative")}><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" /></CLink>
    </div>
  );
}

/* 05 */
function HomeActive() {
  return (
    <MobileShell nav={<Nav a="home" />}>
      <Greeting sub="Welcome back to SpeedMoney+" />
      <Page className="mt-5">
        <div className="relative overflow-hidden rounded-3xl bg-brand p-5 text-primary-foreground shadow-lift">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-card/10" />
          <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-widest opacity-80">Active Loan</span><span className="rounded-full bg-card/15 px-2.5 py-0.5 text-[11px] font-semibold">{customer.loanId}</span></div>
          <p className="mt-2 text-3xl font-extrabold tnum">{inr(50000)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card/10 p-3"><p className="text-[11px] opacity-75">Outstanding</p><p className="text-lg font-bold tnum">{inr(38500)}</p></div>
            <div className="rounded-2xl bg-card/10 p-3"><p className="text-[11px] opacity-75">Next EMI · Due 05 Oct 2026</p><p className="text-lg font-bold tnum">{inr(4250)}</p></div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-card/20"><div className="h-full w-[33%] rounded-full bg-card" /></div>
          <p className="mt-1.5 text-[11px] opacity-75">4 of 12 EMIs paid</p>
          <CLink s="pay" className="mt-4 flex h-12 items-center justify-center gap-2 rounded-xl bg-card text-sm font-bold text-primary">Pay EMI <ArrowRight className="h-4 w-4" /></CLink>
        </div>
        <QuickActions items={[[PlusCircle, "Apply Loan", "loans"], [CalendarDays, "EMI Schedule", "emi-schedule"], [FileText, "Loan Details", "loan-details"], [History, "Payment History", "payment-history"]]} />
        <div className="flex items-center justify-between pt-2"><h2 className="font-bold text-navy">Recent Activity</h2><CLink s="payment-history" className="text-xs font-semibold text-primary">See all</CLink></div>
        <Card className="divide-y divide-border px-4">
          {payments.slice(0, 3).map((p) => (
            <div key={p.txn} className="flex items-center gap-3 py-3">
              <IconTile icon={p.status === "Failed" ? X : Check} tone={p.status === "Failed" ? "danger" : "success"} />
              <div className="flex-1"><p className="text-sm font-semibold text-navy">{p.emi} payment</p><p className="text-xs text-muted-foreground">{p.date}</p></div>
              <p className="text-sm font-bold text-navy tnum">{inr(p.amount)}</p>
            </div>
          ))}
        </Card>
      </Page>
    </MobileShell>
  );
}

/* 07 */
const prodIcon = { agri: Sprout, personal: HeartPulse, lap: Building2 };
function Loans() {
  return (
    <MobileShell nav={<Nav a="loans" />}>
      <AppHeader title="Loans" subtitle="Find a loan for your needs." />
      <Page>
        {products.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between"><IconTile icon={prodIcon[p.id as keyof typeof prodIcon]} /><Badge tone="info">{p.badge}</Badge></div>
            <h3 className="mt-3 text-lg font-bold text-navy">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/70 p-3">
              {[["Amount", p.amount], ["Interest", p.rate], ["Tenure", p.tenure]].map(([k, v]) => <div key={k}><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</p><p className="mt-0.5 text-xs font-bold text-navy">{v}</p></div>)}
            </div>
            <CLink s="loan-details" className={cn(btn("primary", "md", true), "mt-4")}>Apply Now <ArrowRight className="h-4 w-4" /></CLink>
          </Card>
        ))}
      </Page>
    </MobileShell>
  );
}

/* 08 */
function LoanDetails() {
  const p = products[1];
  return (
    <MobileShell>
      <AppHeader title={p.name} back={<Back to="loans" />} />
      <Page>
        <Card className="p-5"><Badge tone="info">{p.badge}</Badge><div className="mt-3 divide-y divide-border"><KV k="Loan amount" v={p.amount} /><KV k="Interest rate" v={p.rate} /><KV k="Tenure" v="3 – 12 months" /><KV k="Processing fee" v="2% + GST" /></div></Card>
        <Card className="p-5"><h3 className="font-bold text-navy">About this loan</h3><p className="mt-2 text-sm text-muted-foreground">{p.desc} Funds are transferred directly to your bank account after approval, with simple monthly EMIs payable by UPI.</p></Card>
        <Card className="p-5"><h3 className="font-bold text-navy">Required documents</h3>
          <ul className="mt-3 space-y-2.5">{["PAN Card", "Aadhaar / KYC Document", "Last 3 months bank statement", "Selfie", "Signature"].map((d) => <li key={d} className="flex items-center gap-3 text-sm text-navy"><FileText className="h-4 w-4 text-primary" />{d}</li>)}</ul>
        </Card>
        <Card className="p-5"><h3 className="font-bold text-navy">Key features</h3>
          <ul className="mt-3 space-y-2.5">{["100% digital application", "No collateral required", "Flexible tenure options", "No hidden charges"].map((d) => <li key={d} className="flex items-center gap-3 text-sm text-navy"><CircleCheck className="h-4 w-4 text-success" />{d}</li>)}</ul>
        </Card>
        <CLink s="calculator" className={btn("secondary", "md", true)}><Calculator className="h-4 w-4" /> Calculate EMI</CLink>
      </Page>
      <Footer><Go s="apply">Apply Now <ArrowRight className="h-5 w-5" /></Go></Footer>
    </MobileShell>
  );
}

/* 09 */
function CalculatorScreen() {
  const [amt, setAmt] = useState(50000);
  const [ten, setTen] = useState(12);
  const r = 0.18 / 12;
  const emi = Math.round((amt * r * Math.pow(1 + r, ten)) / (Math.pow(1 + r, ten) - 1));
  return (
    <MobileShell>
      <AppHeader title="Loan Calculator" back={<Back to="loan-details" />} />
      <Page>
        <Card className="p-5">
          <p className="text-xs font-semibold text-muted-foreground">Loan Amount</p>
          <p className="mt-1 text-3xl font-extrabold text-navy tnum">{inr(amt)}</p>
          <input type="range" min={10000} max={75000} step={1000} value={amt} onChange={(e) => setAmt(+e.target.value)} className="mt-4 w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹10,000</span><span>₹75,000</span></div>
          <p className="mt-6 text-xs font-semibold text-muted-foreground">Tenure (months)</p>
          <div className="mt-2 grid grid-cols-4 gap-2">{[3, 6, 9, 12].map((t) => <button key={t} onClick={() => setTen(t)} className={cn("h-11 rounded-xl border text-sm font-bold", ten === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-navy")}>{t}</button>)}</div>
          <div className="mt-6 divide-y divide-border border-t border-border"><KV k="Interest rate" v="18% p.a." /><KV k="Total interest" v={inr(emi * ten - amt)} /><KV k="Total payable" v={inr(emi * ten)} /></div>
        </Card>
        <div className="rounded-2xl bg-soft p-5 text-center"><p className="text-xs font-semibold text-primary">Estimated EMI</p><p className="mt-1 text-3xl font-extrabold text-navy tnum">{inr(emi)} <span className="text-base font-semibold text-muted-foreground">/ month</span></p></div>
        <p className="text-center text-xs text-muted-foreground">Final loan terms are subject to approval.</p>
      </Page>
      <Footer><Go s="apply">Apply Now <ArrowRight className="h-5 w-5" /></Go></Footer>
    </MobileShell>
  );
}

/* 10 */
const steps = [
  ["Personal Details", "Name, date of birth and address", "personal"],
  ["KYC Verification", "PAN, Aadhaar and identity check", "kyc"],
  ["Review & Submit", "Confirm and submit application", "review"],
];
function Apply() {
  return (
    <MobileShell>
      <AppHeader title="Loan Application" subtitle="Personal & Emergency Loan · ₹50,000" back={<Back to="loan-details" />} />
      <Page>
        <Card className="p-4"><div className="flex justify-between text-xs font-semibold"><span className="text-navy">1 of 3 completed</span><span className="text-primary">33%</span></div><Progress value={33} className="mt-2" /></Card>
        <Card className="divide-y divide-border">
          {steps.map(([t, d, s], i) => (
            <CLink key={s} s={s} className="flex items-center gap-4 p-4">
              <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold", i < 1 ? "bg-success text-primary-foreground" : i === 1 ? "bg-primary text-primary-foreground ring-4 ring-primary/15" : "bg-muted text-muted-foreground")}>{i < 1 ? <Check className="h-4 w-4" /> : i + 1}</span>
              <div className="flex-1"><p className="text-sm font-semibold text-navy">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
              {i < 1 ? <Badge>Completed</Badge> : i === 1 ? <Badge tone="info">In progress</Badge> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </CLink>
          ))}
        </Card>
      </Page>
      <Footer><Go s="personal">Continue Application <ArrowRight className="h-5 w-5" /></Go></Footer>
    </MobileShell>
  );
}

function FormStep({ title, step, back, next, children, cta = "Save & Continue" }: { title: string; step: number; back: string; next: string; children: ReactNode; cta?: string }) {
  return (
    <MobileShell>
      <AppHeader title={title} back={<Back to={back} />} />
      <StepBar step={step} />
      <Page className="mt-5">{children}</Page>
      <Footer><Go s={next}>{cta} <ArrowRight className="h-5 w-5" /></Go></Footer>
    </MobileShell>
  );
}

/* 11–13 */
function Personal() {
  const [saved, setSaved] = useState(false);
  const nav = useNavigate();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      nav({ to: "/app/$screen", params: { screen: "profile" } });
    }, 500);
  };

  return (
    <MobileShell>
      <AppHeader title="Personal Details" back={<Back to="profile" />} />
      <Page>
        <Field label="Full Name">
          <Input defaultValue="Harun R" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date of Birth">
            <Input type="date" defaultValue="1992-04-14" />
          </Field>
          <Field label="Gender">
            <Select options={["Male", "Female", "Other"]} defaultValue="Male" />
          </Field>
        </div>
        <Field label="Email">
          <Input type="email" defaultValue={customer.email} />
        </Field>
        <Field label="Address">
          <Input defaultValue="14/220, Market Road, Edappally" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City">
            <Input defaultValue="Kochi" />
          </Field>
          <Field label="State">
            <Select options={["Kerala", "Tamil Nadu", "Karnataka", "Maharashtra"]} defaultValue="Kerala" />
          </Field>
        </div>
        <Field label="PIN Code">
          <Input inputMode="numeric" defaultValue="682024" />
        </Field>
      </Page>
      <Footer>
        <Button full size="lg" onClick={handleSave}>
          {saved ? (
            <>
              <Check className="h-5 w-5" /> Details Saved!
            </>
          ) : (
            <>
              Save & Continue <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </Footer>
    </MobileShell>
  );
}

/* 14 */
function Kyc() {
  const items: [typeof IdCard, string, string, string][] = [
    [IdCard, "PAN Card", "Verified", "View"],
    [Fingerprint, "Aadhaar / KYC Document", "Verified", "View"],
    [Camera, "Selfie", "Completed", "View"],
    [PenLine, "Signature", "Completed", "View"]
  ];
  return (
    <FormStep title="Identity Verification" step={2} back="personal" next="review" cta="Continue to Review">
      {items.map(([I, t, s, a]) => (
        <Card key={t} className="flex items-center gap-3 p-4">
          <IconTile icon={I} tone={s === "Verified" || s === "Completed" ? "success" : "info"} />
          <div className="flex-1"><p className="text-sm font-semibold text-navy">{t}</p><div className="mt-1"><Badge>{s}</Badge></div></div>
          <button className={btn(a === "View" ? "outline" : "secondary", "sm")}>{a}</button>
        </Card>
      ))}
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" />Your information is securely handled.</div>
    </FormStep>
  );
}

/* 16 */
function Review() {
  const [ok, setOk] = useState(false);
  const nav = useNavigate();
  const sec: [string, [string, string][]][] = [
    ["Loan Details", [["Product", "Personal & Emergency"], ["Amount", "₹50,000"], ["Tenure", "12 months"]]],
    ["Personal Details", [["Name", "Harun R"], ["DOB", "14 Apr 1992"], ["City", "Kochi, Kerala"]]],
    ["KYC Details", [["PAN", "Verified"], ["Aadhaar", "Verified"], ["Selfie", "Verified"]]],
  ];
  const [loading, setLoading] = useState(false);
  return (
    <MobileShell>
      <AppHeader title="Review Application" back={<Back to="kyc" />} />
      <StepBar step={3} />
      <Page className="mt-5">
        {sec.map(([t, rows]) => (
          <Card key={t} className="px-4 pt-3">
            <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-navy">{t}</h3><button className="text-xs font-semibold text-primary">Edit</button></div>
            <div className="divide-y divide-border">{rows.map(([k, v]) => <KV key={k} k={k} v={v} />)}</div>
          </Card>
        ))}
        <label className="flex gap-3 rounded-xl bg-soft p-4 text-sm text-navy"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />I confirm that the information provided is accurate.</label>
      </Page>
      <Footer><Button full size="lg" disabled={!ok || loading} onClick={() => { setLoading(true); setTimeout(() => nav({ to: "/app/$screen", params: { screen: "submitted" } }), 1000); }}>{loading ? <><Loader2 className="h-5 w-5 animate-spin" />Submitting</> : "Submit Application"}</Button></Footer>
    </MobileShell>
  );
}

/* 17 */
function Submitted() {
  return (
    <MobileShell>
      <Page className="pt-14">
        <ResultState tone="success" icon={Check} title="Application Submitted" sub="Your application has been submitted successfully." />
        <Card className="mt-6 p-4"><KV k="Application ID" v="SM-2026-00123" strong /><KV k="Current Status" v={<Badge>Submitted</Badge>} /></Card>
        <Card className="p-5"><Timeline items={[{ label: "Submitted", sub: "28 Sep 2026, 4:12 PM", state: "done" }, { label: "Under Review", state: "current" }, { label: "Approval", state: "todo" }, { label: "Disbursement", state: "todo" }]} /></Card>
        <CLink s="tracking" className={btn("secondary", "md", true)}>Track Application</CLink>
      </Page>
      <Footer><Go s="home">Go to Home</Go></Footer>
    </MobileShell>
  );
}

/* 18 */
function Tracking() {
  return (
    <MobileShell>
      <AppHeader title="Application Status" subtitle="ID: SM-2026-00123" back={<Back to="home" />} />
      <Page>
        <Card className="p-5"><Timeline items={[{ label: "Application Submitted", sub: "28 Sep 2026", state: "done" }, { label: "Documents Received", sub: "28 Sep 2026", state: "done" }, { label: "Under Review", sub: "Credit team is reviewing", state: "current" }, { label: "Approval", state: "todo" }, { label: "Disbursement", state: "todo" }]} /></Card>
        <div className="flex gap-3 rounded-2xl border border-warning/30 bg-warning-soft p-4"><Clock className="h-5 w-5 shrink-0 text-warning" /><div><p className="text-sm font-semibold text-navy">Under review</p><p className="text-xs text-muted-foreground">Usually completed within 24 working hours. We'll notify you on any update.</p></div></div>
      </Page>
    </MobileShell>
  );
}

/* 21 */
function EmiSchedule() {
  return (
    <MobileShell nav={<Nav a="emi-schedule" />}>
      <AppHeader title="EMI Schedule" subtitle={customer.loanId} />
      <Page>
        <div className="grid grid-cols-3 gap-3">{[["Total EMIs", 12, "text-navy"], ["Paid", 4, "text-success"], ["Remaining", 8, "text-primary"]].map(([k, v, c]) => <Card key={k as string} className="p-3 text-center"><p className={cn("text-2xl font-extrabold", c as string)}>{v}</p><p className="text-[11px] text-muted-foreground">{k}</p></Card>)}</div>
        <Card className="divide-y divide-border">
          {emis.map((e) => (
            <CLink key={e.no} s={e.status === "Due" ? "pay" : "emi-schedule"} className={cn("flex items-center gap-3 px-4 py-3.5", e.status === "Due" && "bg-warning-soft/60 hover:opacity-90")}>
              <span className={cn("grid h-9 w-9 place-items-center rounded-full text-xs font-bold", e.status === "Paid" ? "bg-success-soft text-success" : e.status === "Due" ? "bg-warning text-primary-foreground" : "bg-muted text-muted-foreground")}>{e.status === "Paid" ? <Check className="h-4 w-4" /> : String(e.no).padStart(2, "0")}</span>
              <div className="flex-1"><p className="text-sm font-semibold text-navy">EMI #{String(e.no).padStart(2, "0")}</p><p className="text-xs text-muted-foreground">{e.date}</p></div>
              <div className="text-right"><p className="text-sm font-bold text-navy tnum">{inr(e.amount)}</p><Badge>{e.status}</Badge></div>
            </CLink>
          ))}
        </Card>
      </Page>
    </MobileShell>
  );
}

/* 23 */
function Pay() {
  const [method, setMethod] = useState("gpay");
  const [st, setSt] = useState<"ready" | "processing">("ready");
  const nav = useNavigate();
  return (
    <MobileShell>
      <AppHeader title="Pay EMI" back={<Back to="emi-schedule" />} />
      <Page>
        <Card className="p-5 text-center"><p className="text-xs text-muted-foreground">EMI #05 · Due 05 Oct 2026</p><p className="mt-1 text-4xl font-extrabold text-navy tnum">{inr(4250)}</p></Card>
        <h3 className="pt-2 text-sm font-bold text-navy">Pay using UPI</h3>
        <Card className="divide-y divide-border">
          {[["gpay", "Google Pay"], ["phonepe", "PhonePe"], ["paytm", "Paytm"], ["upi", "Enter UPI ID"]].map(([id, l]) => (
            <label key={id} className="flex cursor-pointer items-center gap-3 p-4">
              <IconTile icon={Smartphone} /><span className="flex-1 text-sm font-semibold text-navy">{l}</span>
              <input type="radio" name="m" checked={method === id} onChange={() => setMethod(id)} className="h-4 w-4 accent-primary" />
            </label>
          ))}
        </Card>
        {method === "upi" && <Input placeholder="yourname@upi" />}
        <Card className="divide-y divide-border px-4 py-1"><KV k="EMI amount" v={inr(4250)} /><KV k="Convenience fee" v={inr(0)} /><KV k="Total" v={inr(4250)} strong /></Card>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" />100% secure UPI payment</p>
      </Page>
      <Footer>
        <Button full size="lg" disabled={st === "processing"} onClick={() => { setSt("processing"); setTimeout(() => nav({ to: "/app/$screen", params: { screen: "payment-success" } }), 1500); }}>
          {st === "processing" ? <><Loader2 className="h-5 w-5 animate-spin" />Processing payment</> : <>Proceed to Payment <ArrowRight className="h-5 w-5" /></>}
        </Button>
        <CLink s="payment-failed" className="mt-2 block text-center text-[11px] text-muted-foreground underline">Preview: failed payment</CLink>
      </Footer>
    </MobileShell>
  );
}

/* 24 */
function PaySuccess() {
  return (
    <MobileShell>
      <Page className="pt-14">
        <ResultState tone="success" icon={Check} title="Payment Successful" />
        <p className="text-center text-4xl font-extrabold text-navy tnum">{inr(4250)}</p>
        <Card className="divide-y divide-border px-4 py-1"><KV k="EMI" v="#05" /><KV k="Transaction ID" v="SMT9021847753" /><KV k="Date & time" v="02 Oct 2026, 7:48 PM" /><KV k="Paid via" v="Google Pay" /></Card>
      </Page>
      <Footer><div className="space-y-3"><CLink s="receipt" className={btn("outline", "lg", true)}><Receipt className="h-5 w-5" />View Receipt</CLink><Go s="home">Done</Go></div></Footer>
    </MobileShell>
  );
}

/* 25 */
function PayFailed() {
  return (
    <MobileShell>
      <Page className="pt-14">
        <ResultState tone="danger" icon={X} title="Payment Failed" sub="We couldn't confirm your payment. Any amount debited will be refunded within 3–5 working days." />
        <Card className="divide-y divide-border px-4 py-1"><KV k="Amount" v={inr(4250)} strong /><KV k="EMI" v="#05" /><KV k="Reference" v="SMT9021847760" /></Card>
      </Page>
      <Footer><div className="space-y-3"><Go s="pay">Try Again</Go><CLink s="support" className={btn("outline", "lg", true)}>Contact Support</CLink></div></Footer>
    </MobileShell>
  );
}

/* 26 */
function PayHistory() {
  const [f, setF] = useState("All");
  const map: Record<string, string> = { Successful: "Successful", Pending: "Pending", Failed: "Failed" };
  const list = payments.filter((p) => f === "All" || p.status === map[f]);
  return (
    <MobileShell>
      <AppHeader title="Payment History" back={<Back to="home" />} />
      <Page>
        <Chips options={["All", "Successful", "Pending", "Failed"]} value={f} onChange={setF} />
        {list.length === 0 ? <Card><EmptyState icon={CreditCard} title="No payments" sub="Nothing matches this filter." /></Card> : list.map((p) => (
          <Card key={p.txn} className="p-4">
            <div className="flex items-center justify-between"><p className="text-sm font-semibold text-navy">{p.emi}</p><p className="text-base font-bold text-navy tnum">{inr(p.amount)}</p></div>
            <div className="mt-1 flex items-center justify-between"><p className="text-xs text-muted-foreground">{p.date}</p><Badge>{p.status}</Badge></div>
            <p className="mt-2 border-t border-border pt-2 text-[11px] text-muted-foreground">Txn ID: <span className="font-mono text-navy">{p.txn}</span></p>
          </Card>
        ))}
      </Page>
    </MobileShell>
  );
}

/* 27 */
function Notifications() {
  const groups: [string, [typeof Bell, string, string, string, "warning" | "success" | "info"][]][] = [
    ["Today", [[Bell, "EMI Reminder", "Your EMI of ₹4,250 is due in 7 days.", "9:00 AM", "warning"], [CircleCheck, "Payment Successful", "Your EMI payment was successfully received.", "8:12 AM", "success"]]],
    ["Earlier", [[FileText, "Application Update", "Your application is under review.", "28 Sep", "info"], [ShieldCheck, "Loan Approved", "Your loan has been approved.", "01 Jun", "success"]]],
  ];
  return (
    <MobileShell>
      <AppHeader title="Notifications" back={<Back to="home" />} right={<button className="text-xs font-semibold text-primary">Mark all read</button>} />
      <Page>
        {groups.map(([g, items]) => (
          <div key={g}><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g}</p>
            <Card className="divide-y divide-border">{items.map(([I, t, d, time, tone], i) => (
              <div key={t} className="flex gap-3 p-4"><IconTile icon={I} tone={tone} /><div className="flex-1"><div className="flex justify-between"><p className="text-sm font-semibold text-navy">{t}</p><span className="text-[11px] text-muted-foreground">{time}</span></div><p className="text-xs text-muted-foreground">{d}</p></div>{g === "Today" && i === 0 && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}</div>
            ))}</Card>
          </div>
        ))}
      </Page>
    </MobileShell>
  );
}

/* 28 */
function Profile() {
  const [auth, setAuth] = useState<AuthState>(getAuthState());
  const nav = useNavigate();
  useEffect(() => subscribeAuth(setAuth), []);

  const items: [typeof User, string, string][] = [
    [User, "Personal Details", "personal"],
    [HelpCircle, "Help & Support", "support"],
    [Lock, "Privacy Policy", "profile"],
    [FileText, "Terms & Conditions", "profile"],
  ];

  const handleLogout = async () => {
    await logout();
    nav({ to: "/app/$screen", params: { screen: "welcome" } });
  };

  const displayPhone = auth.phoneNumber
    ? formatFullPhone(auth.phoneNumber)
    : (typeof window !== "undefined" && localStorage.getItem("sm_user_phone")
        ? formatFullPhone(localStorage.getItem("sm_user_phone")!)
        : customer.mobile);

  return (
    <MobileShell nav={<Nav a="profile" />}>
      <AppHeader title="Profile" />
      <Page>
        <Card className="flex items-center gap-4 p-5">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-brand text-lg font-bold text-primary-foreground">
            {customer.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-navy">{customer.name}</p>
            <p className="text-sm font-semibold tracking-wide text-navy/80">{displayPhone}</p>
          </div>
        </Card>
        <Card className="divide-y divide-border">
          {items.map(([I, l, s]) => (
            <CLink key={l} s={s} className="flex items-center gap-3 px-4 py-3.5">
              <I className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm font-medium text-navy">{l}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CLink>
          ))}
        </Card>
        <button
          onClick={handleLogout}
          className={cn(btn("outline", "md", true), "text-destructive flex items-center justify-center gap-2")}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </Page>
    </MobileShell>
  );
}

/* 29 */
function Support() {
  return (
    <MobileShell>
      <AppHeader title="Help & Support" back={<Back to="profile" />} />
      <Page>
        <div className="rounded-2xl bg-brand p-5 text-primary-foreground"><p className="text-lg font-bold">How can we help?</p><p className="text-sm opacity-80">Our team is available Mon–Sat, 9 AM – 7 PM.</p></div>
        <div className="grid grid-cols-2 gap-3">
          {[[Phone, "Call Support", "1800 123 4567"], [Mail, "Email Support", "care@speedmoney.in"]].map(([I, t, d]) => { const Ic = I as typeof Phone; return <Card key={t as string} className="p-4"><IconTile icon={Ic} /><p className="mt-3 text-sm font-semibold text-navy">{t as string}</p><p className="text-[11px] text-muted-foreground">{d as string}</p></Card>; })}
        </div>
        <Card className="flex items-center gap-3 p-4"><IconTile icon={MessageSquareWarning} tone="warning" /><div className="flex-1"><p className="text-sm font-semibold text-navy">Raise a Complaint</p><p className="text-xs text-muted-foreground">Track resolution in 48 hours</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></Card>
        <h3 className="pt-2 text-sm font-bold text-navy">FAQs</h3>
        <Card className="divide-y divide-border">
          {[["How do I pay my EMI?", "Tap Pay EMI on the home screen and pay using any UPI app."], ["What if I miss an EMI?", "A penalty may apply. Contact support to discuss options."], ["How long does approval take?", "Most applications are reviewed within 24 working hours."], ["Can I prepay my loan?", "Yes, contact support for a foreclosure statement."]].map(([q, a]) => (
            <details key={q} className="group px-4 py-3.5"><summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-navy">{q}<ChevronRight className="h-4 w-4 text-muted-foreground transition group-open:rotate-90" /></summary><p className="mt-2 text-xs text-muted-foreground">{a}</p></details>
          ))}
        </Card>
      </Page>
    </MobileShell>
  );
}

/* receipt (from payment success) */
function CustReceipt() {
  return (
    <MobileShell>
      <AppHeader title="Receipt" back={<Back to="payment-success" />} />
      <Page>
        <Card className="overflow-hidden p-0">
          <div className="bg-brand p-5 text-primary-foreground"><Logo size="sm" light /><p className="mt-3 text-sm opacity-80">EMI Payment Receipt</p></div>
          <div className="divide-y divide-border px-5 py-2"><KV k="Customer" v={customer.name} /><KV k="Loan ID" v={customer.loanId} /><KV k="EMI" v="#05" /><KV k="Amount" v={inr(4250)} strong /><KV k="Date" v="02 Oct 2026" /><KV k="Transaction ID" v="SMT9021847753" /><KV k="Status" v={<Badge>Paid</Badge>} /></div>
        </Card>
        <Button variant="outline" full><Download className="h-4 w-4" />Download PDF</Button>
      </Page>
    </MobileShell>
  );
}

export const customerScreens: Record<string, { c: () => ReactNode; t: string }> = {
  splash: { c: Splash, t: "Splash" },
  welcome: { c: Welcome, t: "Welcome" },
  login: { c: Login, t: "Mobile Login" },
  otp: { c: Otp, t: "OTP Verification" },
  home: { c: HomeActive, t: "Home" },
  loans: { c: Loans, t: "Loans" },
  "loan-details": { c: LoanDetails, t: "Loan Details" },
  calculator: { c: CalculatorScreen, t: "Loan Calculator" },
  apply: { c: Apply, t: "Application Steps" },
  personal: { c: Personal, t: "Personal Details" },
  kyc: { c: Kyc, t: "KYC Verification" },
  review: { c: Review, t: "Application Review" },
  submitted: { c: Submitted, t: "Application Submitted" },
  tracking: { c: Tracking, t: "Application Tracking" },
  "emi-schedule": { c: EmiSchedule, t: "EMI Schedule" },
  pay: { c: Pay, t: "Pay EMI" },
  "payment-success": { c: PaySuccess, t: "Payment Success" },
  "payment-failed": { c: PayFailed, t: "Payment Failed" },
  "payment-history": { c: PayHistory, t: "Payment History" },
  notifications: { c: Notifications, t: "Notifications" },
  profile: { c: Profile, t: "Profile" },
  support: { c: Support, t: "Help & Support" },
  receipt: { c: CustReceipt, t: "Receipt" },
};
export { Link };
