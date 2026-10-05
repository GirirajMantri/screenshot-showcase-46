import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="eyebrow">{index}</span>
      <span className="h-px w-16 bg-gradient-to-r from-primary/70 to-transparent" />
      <h2 className="text-sm font-medium tracking-[0.2em] text-muted-foreground">{title}</h2>
    </div>
  );
}

/* SECTION 1 — three doors merge into one */
function DoorsMerge() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const spread = useTransform(scrollYProgress, [0.1, 0.62], [1, 0]);
  const doorOpacity = useTransform(scrollYProgress, [0.5, 0.72], [1, 0]);
  const nexusOpacity = useTransform(scrollYProgress, [0.6, 0.82], [0, 1]);
  const nexusScale = useTransform(scrollYProgress, [0.6, 0.9], [0.8, 1]);
  const blur = useTransform(scrollYProgress, [0.45, 0.7], [0, 16]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  const doors = [
    { label: "HR", offset: -1 },
    { label: "IT", offset: 0 },
    { label: "Finance", offset: 1 },
  ];

  return (
    <section ref={ref} id="product" className="relative h-[280vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 w-full max-w-5xl">
          <SectionLabel index="01" title="THREE DOORS BECOME ONE" />
          <div className="relative flex h-[46vh] items-center justify-center">
            {doors.map((d) => (
              <Door key={d.label} label={d.label} offset={d.offset} spread={spread} opacity={doorOpacity} filter={filter} />
            ))}
            <motion.div
              style={{ opacity: nexusOpacity, scale: nexusScale }}
              className="glass-panel glow-ring absolute flex h-56 w-72 flex-col items-center justify-center rounded-3xl"
            >
              <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl" />
              <span className="relative font-display text-3xl font-bold tracking-[0.35em] text-foreground">
                BEACON
              </span>
              <span className="relative mt-3 text-xs text-muted-foreground">The One Front Door</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Door({
  label,
  offset,
  spread,
  opacity,
  filter,
}: {
  label: string;
  offset: number;
  spread: MotionValue<number>;
  opacity: MotionValue<number>;
  filter: MotionValue<string>;
}) {
  const x = useTransform(spread, (s) => offset * s * 240);
  const rotate = useTransform(spread, (s) => offset * s * 6);
  return (
    <motion.div
      style={{ x, rotate, opacity, filter }}
      className="glass-panel absolute flex h-56 w-44 flex-col items-center justify-center rounded-3xl"
    >
      <div className="h-10 w-10 rounded-full border border-primary/40 bg-primary/10" />
      <span className="mt-5 font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
        {label.toUpperCase()}
      </span>
      <span className="mt-2 text-[10px] text-muted-foreground/60">isolated system</span>
    </motion.div>
  );
}

/* SECTION 2 — query becomes particles, splits into intents */
function QuerySplit() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const queryOpacity = useTransform(scrollYProgress, [0.08, 0.2, 0.45, 0.55], [0, 1, 1, 0]);
  const queryY = useTransform(scrollYProgress, [0.1, 0.55], [30, -60]);
  const particleProgress = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const intentOpacity = useTransform(scrollYProgress, [0.58, 0.75], [0, 1]);

  const intents = [
    { label: "IT Intent", detail: "VPN connectivity failure", active: true },
    { label: "HR Intent", detail: "Work-from-home policy", active: true },
    { label: "Finance", detail: "no signal detected", active: false },
  ];

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6">
        <div className="relative z-10 w-full max-w-5xl">
          <SectionLabel index="02" title="ONE QUESTION, MANY INTENTS" />

          <motion.div
            style={{ opacity: queryOpacity, y: queryY }}
            className="glass-panel mx-auto max-w-2xl rounded-2xl px-6 py-5 text-left"
          >
            <span className="eyebrow">incoming query</span>
            <p className="mt-3 font-display text-lg leading-snug text-foreground sm:text-2xl">
              “My VPN isn’t working and can I work from home tomorrow?”
            </p>
          </motion.div>

          <div className="relative mx-auto mt-10 h-24 w-full max-w-2xl">
            {Array.from({ length: 18 }).map((_, i) => (
              <Particle key={i} index={i} progress={particleProgress} />
            ))}
          </div>

          <motion.div style={{ opacity: intentOpacity }} className="grid gap-4 sm:grid-cols-3">
            {intents.map((it) => (
              <div
                key={it.label}
                className={`glass-panel rounded-2xl p-5 ${it.active ? "glow-ring" : "opacity-40"}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${it.active ? "animate-breathe bg-primary" : "bg-muted-foreground"}`}
                  />
                  <span className="font-mono text-[11px] tracking-[0.2em] text-foreground">
                    {it.label.toUpperCase()}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{it.detail}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Particle({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const startX = (index / 17) * 100;
  const x = useTransform(progress, (p) => `${startX + (50 - startX) * p}%`);
  const y = useTransform(progress, [0, 1], [0, 90]);
  const opacity = useTransform(progress, [0, 0.15, 0.9, 1], [0, 1, 1, 0]);
  return (
    <motion.span
      style={{ left: x, y, opacity }}
      className="absolute top-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_2px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
    />
  );
}

/* SECTION 3 — agent routing network */
const FLOW = [
  { id: "router", label: "Router Agent", x: 50, y: 8 },
  { id: "it", label: "IT Agent", x: 22, y: 32 },
  { id: "hr", label: "HR Agent", x: 78, y: 32 },
  { id: "vpn", label: "VPN Guide", x: 22, y: 58 },
  { id: "wfh", label: "WFH Policy", x: 78, y: 58 },
  { id: "evidence", label: "Evidence Nodes", x: 50, y: 78 },
  { id: "response", label: "Response Generator", x: 50, y: 94 },
];

const EDGES: [string, string][] = [
  ["router", "it"],
  ["router", "hr"],
  ["it", "vpn"],
  ["hr", "wfh"],
  ["vpn", "evidence"],
  ["wfh", "evidence"],
  ["evidence", "response"],
];

function AgentNetwork() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const pathProgress = useTransform(scrollYProgress, [0.12, 0.85], [0, 1]);

  const node = (id: string) => FLOW.find((n) => n.id === id)!;

  return (
    <section ref={ref} id="architecture" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-0 aurora-bg opacity-40" />
        <div className="relative z-10 w-full max-w-4xl">
          <SectionLabel index="03" title="LIVE AGENT ORCHESTRATION" />
          <div className="relative h-[68vh] w-full">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {EDGES.map(([a, b], i) => {
                const from = node(a);
                const to = node(b);
                const d = `M ${from.x} ${from.y} C ${from.x} ${(from.y + to.y) / 2}, ${to.x} ${(from.y + to.y) / 2}, ${to.x} ${to.y}`;
                return <Edge key={i} d={d} index={i} progress={pathProgress} />;
              })}
            </svg>

            {FLOW.map((n, i) => (
              <NodeChip key={n.id} node={n} index={i} progress={pathProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Edge({ d, index, progress }: { d: string; index: number; progress: MotionValue<number> }) {
  const start = index / EDGES.length;
  const end = (index + 1) / EDGES.length;
  const draw = useTransform(progress, [start, end], [0, 1]);
  const glow = useTransform(progress, [start, end, Math.min(1, end + 0.1)], [0.15, 1, 0.45]);
  return (
    <>
      <path d={d} fill="none" stroke="currentColor" className="text-foreground/10" strokeWidth={0.4} vectorEffect="non-scaling-stroke" />
      <motion.path
        d={d}
        fill="none"
        stroke="url(#edge-gradient)"
        strokeWidth={0.6}
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: draw, opacity: glow }}
      />
      <defs>
        <linearGradient id="edge-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b8cff" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </>
  );
}

function NodeChip({
  node,
  index,
  progress,
}: {
  node: { label: string; x: number; y: number };
  index: number;
  progress: MotionValue<number>;
}) {
  const threshold = index / (FLOW.length + 0.5);
  const opacity = useTransform(progress, [threshold, threshold + 0.1], [0.25, 1]);
  const scale = useTransform(progress, [threshold, threshold + 0.1], [0.9, 1]);
  return (
    <motion.div
      style={{ left: `${node.x}%`, top: `${node.y}%`, opacity, scale }}
      className="glass-panel absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-foreground sm:text-[11px]"
    >
      {node.label.toUpperCase()}
    </motion.div>
  );
}

/* SECTION 4 — evidence */
const EVIDENCE = [
  { title: "VPN Guide", meta: "IT Knowledge Base · v4.2", value: "Split-tunnel reset" },
  { title: "HR Policy", meta: "People Ops · 2026 handbook", value: "2 remote days / week" },
  { title: "Confidence", meta: "grounded on 2 sources", value: "96%" },
  { title: "Knowledge Sources", meta: "retrieved passages", value: "7 documents" },
  { title: "Human Escalation", meta: "if confidence < 70%", value: "Standby" },
  { title: "Explainability", meta: "every claim cited", value: "Full trace" },
];

function EvidenceGrid() {
  return (
    <section id="trust" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <SectionLabel index="04" title="EVIDENCE, NOT GUESSES" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EVIDENCE.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel group animate-drift rounded-3xl p-6 transition-colors hover:border-primary/40"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <span className="eyebrow">{card.title}</span>
              <p className="mt-4 font-display text-2xl text-foreground">{card.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{card.meta}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/60 via-accent/40 to-transparent opacity-40 transition-opacity group-hover:opacity-100" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* SECTION 5 — convergence */
function Convergence() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.4, 1.6]);
  const glow = useTransform(scrollYProgress, [0.2, 0.75], [0.15, 1]);
  const answerOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);

  return (
    <section ref={ref} className="relative h-[240vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6">
        <motion.div
          style={{ scale, opacity: glow }}
          className="absolute h-[42vmin] w-[42vmin] rounded-full bg-primary/40 blur-[90px]"
        />
        <motion.div
          style={{ opacity: answerOpacity }}
          className="glass-panel glow-ring relative z-10 max-w-2xl rounded-3xl p-8 text-left"
        >
          <span className="eyebrow">one intelligent answer</span>
          <p className="mt-5 text-sm leading-relaxed text-foreground sm:text-base">
            Your VPN is failing because split tunneling is disabled on the new gateway — reset it
            from the client in two steps. And yes: your team policy allows two remote days per
            week, so tomorrow is approved.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["IT · VPN Guide §3", "HR · Remote Work Policy 2026", "Confidence 96%"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-glass px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ScrollStory() {
  return (
    <>
      <DoorsMerge />
      <QuerySplit />
      <AgentNetwork />
      <EvidenceGrid />
      <Convergence />
    </>
  );
}
