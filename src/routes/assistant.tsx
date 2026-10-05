import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, ShieldCheck, Network, FileText } from "lucide-react";
import { CursorGlow } from "@/components/nexus/CursorGlow";

const TITLE = "BEACON Assistant — Ask your enterprise anything";
const DESCRIPTION =
  "The BEACON command interface: live agent routing, grounded evidence cards, confidence scoring and human escalation in one conversation.";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type Evidence = { source: string; detail: string };
type Msg = {
  id: number;
  role: "user" | "nexus";
  text: string;
  evidence?: Evidence[];
  confidence?: number;
  agents?: string[];
};

const SUGGESTIONS = [
  "My VPN isn't working and can I work from home tomorrow?",
  "How do I expense a client dinner in Berlin?",
  "What's the onboarding checklist for a new engineer?",
];

const SCRIPT: Record<"default" | "expense" | "onboarding", Omit<Msg, "id" | "role">> = {
  default: {
    text: "Your VPN is failing because split tunneling is disabled on the new gateway — reset the client profile and reconnect. Separately, your team policy allows two remote days per week, so working from home tomorrow is approved.",
    evidence: [
      { source: "IT · VPN Troubleshooting Guide §3", detail: "Reset profile after gateway migration" },
      { source: "HR · Remote Work Policy 2026", detail: "Up to 2 remote days per week, no approval needed" },
    ],
    confidence: 96,
    agents: ["Router Agent", "IT Agent", "HR Agent", "Evidence Nodes", "Response Generator"],
  },
  expense: {
    text: "Client dinners are reimbursable up to €80 per attendee. Submit the itemised receipt within 30 days and tag the cost centre of the client account.",
    evidence: [
      { source: "Finance · Travel & Entertainment Policy", detail: "€80 per attendee cap, EU region" },
      { source: "Finance · Expense Submission SOP", detail: "30-day submission window" },
    ],
    confidence: 92,
    agents: ["Router Agent", "Finance Agent", "Evidence Nodes", "Response Generator"],
  },
  onboarding: {
    text: "New engineers get hardware and SSO on day one, repository access on day two after security training, and a 30-60-90 plan from their manager in week one.",
    evidence: [
      { source: "HR · Engineering Onboarding Checklist", detail: "Day 1–5 sequence" },
      { source: "IT · Access Provisioning Runbook", detail: "SSO + repo access gates" },
    ],
    confidence: 89,
    agents: ["Router Agent", "HR Agent", "IT Agent", "Response Generator"],
  },
};

function pickScript(q: string) {
  const s = q.toLowerCase();
  if (s.includes("expense") || s.includes("dinner") || s.includes("reimburse")) return SCRIPT.expense;
  if (s.includes("onboard") || s.includes("new engineer") || s.includes("checklist"))
    return SCRIPT.onboarding;
  return SCRIPT.default;
}

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState<string[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (value: string) => {
    const q = value.trim();
    if (!q || thinking) return;
    setInput("");
    const answer = pickScript(q);
    setMessages((m) => [...m, { id: ++idRef.current, role: "user", text: q }]);
    setThinking(answer.agents ?? []);
    window.setTimeout(() => {
      setThinking(null);
      setMessages((m) => [...m, { id: ++idRef.current, role: "nexus", ...answer }]);
    }, 2200);
  };

  return (
    <div className="noise relative flex h-[100svh] overflow-hidden bg-background">
      <CursorGlow />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute inset-0 aurora-bg opacity-50" />

      {/* Floating sidebar */}
      <aside className="relative z-10 hidden w-72 shrink-0 p-4 lg:block">
        <div className="glass-panel flex h-full flex-col rounded-3xl p-5">
          <Link to="/" className="font-display text-sm font-bold tracking-[0.42em] text-foreground">
            BEACON
          </Link>
          <p className="mt-2 text-[11px] text-muted-foreground">Enterprise orchestrator</p>

          <div className="mt-8 space-y-2">
            <span className="eyebrow">live routing</span>
            {["Router Agent", "IT Agent", "HR Agent", "Finance Agent"].map((a) => {
              const active = thinking?.includes(a);
              return (
                <div
                  key={a}
                  className={`flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-[11px] transition-colors ${
                    active ? "bg-primary/15 text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className="font-mono tracking-[0.14em]">{a.toUpperCase()}</span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${active ? "animate-breathe bg-primary" : "bg-muted-foreground/40"}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-y-3">
            <span className="eyebrow">knowledge graph</span>
            <div className="space-y-2">
              {[
                { label: "HR", value: 64 },
                { label: "IT", value: 88 },
                { label: "Finance", value: 41 },
              ].map((k) => (
                <div key={k.label}>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span className="font-mono tracking-[0.18em]">{k.label.toUpperCase()}</span>
                    <span>{k.value}%</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-secondary">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${k.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Human escalation on standby
          </div>
        </div>
      </aside>

      {/* Conversation */}
      <main className="relative z-10 flex min-w-0 flex-1 flex-col p-4">
        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-6">
          <div className="mx-auto max-w-2xl space-y-6 pt-10">
            {messages.length === 0 && (
              <div className="text-center">
                <div className="mx-auto h-16 w-16 animate-breathe rounded-full bg-primary/30 blur-xl" />
                <h1 className="text-gradient mt-6 text-3xl font-bold sm:text-4xl">
                  Ask your enterprise
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  One question. Multiple systems. One intelligent answer.
                </p>
                <div className="mt-8 grid gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="glass-panel rounded-2xl px-4 py-3 text-left text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) =>
              m.role === "user" ? (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <p className="glass-panel max-w-[85%] rounded-3xl rounded-br-lg px-5 py-3 text-sm text-foreground">
                    {m.text}
                  </p>
                </motion.div>
              ) : (
                <NexusMessage key={m.id} msg={m} />
              ),
            )}

            <AnimatePresence>
              {thinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel rounded-3xl p-5"
                >
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
                    Beacon is orchestrating
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {thinking.map((a, i) => (
                      <motion.span
                        key={a}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.32 }}
                        className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-foreground"
                      >
                        {a.toUpperCase()}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="glass-panel glow-ring flex items-center gap-3 rounded-full px-5 py-3"
          >
            <Network className="h-4 w-4 shrink-0 text-primary" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask across HR, IT and Finance…"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Send"
              className="rounded-full bg-primary/20 p-2 text-foreground transition-colors hover:bg-primary/35"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-3 pb-2 text-center text-[10px] text-muted-foreground">
            Every answer is grounded in cited enterprise sources.
          </p>
        </div>
      </main>
    </div>
  );
}

function NexusMessage({ msg }: { msg: Msg }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setShown(msg.text.slice(0, i));
      if (i >= msg.text.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [msg.text]);

  const done = shown.length >= msg.text.length;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <div className="glass-panel rounded-3xl rounded-bl-lg p-5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
            BEACON
          </span>
          {msg.confidence && (
            <span className="ml-auto rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[10px] text-foreground">
              {msg.confidence}% confidence
            </span>
          )}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground">
          {shown}
          {!done && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />}
        </p>
      </div>

      <AnimatePresence>
        {done && msg.evidence && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {msg.evidence.map((e) => (
              <div key={e.source} className="glass-panel rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono text-[10px] tracking-[0.14em] text-foreground">
                    {e.source}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{e.detail}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
