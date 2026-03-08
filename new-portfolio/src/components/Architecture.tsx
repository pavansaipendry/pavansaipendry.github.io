"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "./AnimatedSection";
import { SectionHeader } from "./SectionHeader";

/* ── Node & layer types ── */
interface ArchNode {
  id: string;
  label: string;
  detail: string;
  tech?: string[];
  accent?: boolean; // highlight as core node
}

interface ArchLayer {
  label?: string; // optional layer label (e.g. "Data Stores")
  nodes: ArchNode[];
}

interface ProjectArch {
  id: string;
  title: string;
  subtitle: string;
  layers: ArchLayer[];
}

/* ── Architecture data ── */
const architectures: ProjectArch[] = [
  {
    id: "babyjay",
    title: "BabyJay",
    subtitle: "AI Campus Assistant — RAG + RLHF Pipeline",
    layers: [
      {
        label: "Data Ingestion",
        nodes: [
          {
            id: "scraper",
            label: "Web Scraper",
            detail: "Scrapes classes.ku.edu for 7,355 courses with live seat availability. 2-layer semantic caching for repeated queries.",
            tech: ["Python", "BeautifulSoup"],
          },
          {
            id: "etl",
            label: "ETL Pipeline",
            detail: "Processes 26,453 records across 72 department categories. Chunks, embeds, and indexes documents for retrieval.",
            tech: ["Python", "Pandas"],
          },
          {
            id: "docs",
            label: "9,500+ Documents",
            detail: "Knowledge base spanning course catalogs, policies, campus info, and department data.",
          },
        ],
      },
      {
        label: "Core Engine",
        nodes: [
          {
            id: "rag",
            label: "Hybrid RAG Engine",
            detail: "4 specialized retrievers working in parallel — keyword, semantic, metadata-filtered, and re-ranked. Achieves 35x query speedup vs naive retrieval.",
            tech: ["LangChain", "Vector Embeddings"],
            accent: true,
          },
          {
            id: "api",
            label: "FastAPI Backend",
            detail: "Async API server handling concurrent queries. Session management, rate limiting, and structured response formatting.",
            tech: ["FastAPI", "Python", "Uvicorn"],
            accent: true,
          },
        ],
      },
      {
        label: "Intelligence",
        nodes: [
          {
            id: "openai",
            label: "OpenAI LLM",
            detail: "GPT-4o for answer generation with context-aware prompting. System prompts dynamically enhanced via RLHF feedback.",
            tech: ["OpenAI API", "GPT-4o"],
          },
          {
            id: "rlhf",
            label: "RLHF Pipeline",
            detail: "Feedback analytics system that learns from thumbs up/down signals to dynamically enhance system prompts over time.",
            tech: ["Custom Pipeline"],
          },
        ],
      },
      {
        label: "Infrastructure",
        nodes: [
          {
            id: "postgres",
            label: "PostgreSQL",
            detail: "Primary data store for documents, user sessions, feedback logs, and course data.",
            tech: ["PostgreSQL", "SQLAlchemy"],
          },
          {
            id: "supabase",
            label: "Supabase",
            detail: "Auth, real-time subscriptions, and row-level security for user data.",
            tech: ["Supabase"],
          },
          {
            id: "react",
            label: "React Frontend",
            detail: "Chat interface with streaming responses, course search, and feedback collection. Deployed at babyjay.bot.",
            tech: ["React.js", "Tailwind"],
          },
          {
            id: "docker",
            label: "Docker + CI/CD",
            detail: "Containerized deployment with GitHub Actions for automated testing and deploys.",
            tech: ["Docker", "GitHub Actions"],
          },
        ],
      },
    ],
  },
  {
    id: "aicity",
    title: "AI City",
    subtitle: "Autonomous LLM Agent Simulation — Emergent Behaviors",
    layers: [
      {
        label: "Agent Layer",
        nodes: [
          {
            id: "brain",
            label: "Agent Brain",
            detail: "Each agent reads inbox, recalls memories, decides actions via LLM, executes, and logs events. Information asymmetry: agents only know what they've witnessed or heard.",
            tech: ["Python", "Async"],
            accent: true,
          },
          {
            id: "llm-router",
            label: "LLM Router",
            detail: "Claude Sonnet for Police/Lawyers. GPT-4o for Builders, Healers, Teachers, Explorers, Thieves. Llama 3 (Groq) for Merchants, Messengers. Role-based model selection.",
            tech: ["Claude", "GPT-4o", "Llama 3"],
            accent: true,
          },
        ],
      },
      {
        label: "Simulation Subsystems",
        nodes: [
          {
            id: "economy",
            label: "Economy Engine",
            detail: "Central bank with 10% tax, bidirectional token transfers (steal/fine/trade), min balance 100, max 5% hoarding cap. Collaborative projects.",
          },
          {
            id: "justice",
            label: "Justice System",
            detail: "Court with LLM judge, police case manager. Agents can commit crimes, get investigated, stand trial. Emergent corruption arises naturally.",
          },
          {
            id: "world",
            label: "World Manager",
            detail: "64×64 tile grid with construction manager for multi-day builds. Position, meeting, and home managers for spatial simulation.",
          },
          {
            id: "events",
            label: "Event Log",
            detail: "Information asymmetry engine: events have visibility states — PRIVATE → WITNESSED → RUMOR → PUBLIC. Drives emergent gossip and secrets.",
          },
        ],
      },
      {
        label: "Data Stores",
        nodes: [
          {
            id: "pg",
            label: "PostgreSQL",
            detail: "Persistence layer: agents, event_log, world_tiles, newspapers, police_cases, token_txns. Full state save/load.",
            tech: ["PostgreSQL"],
          },
          {
            id: "redis",
            label: "Redis",
            detail: "Ephemeral messaging: agent inboxes with 3-day TTL, working memory. Fast reads for the simulation loop.",
            tech: ["Redis"],
          },
          {
            id: "qdrant",
            label: "Qdrant",
            detail: "Vector memory: per-agent private memories and shared city_knowledge. Semantic recall for agent decision-making.",
            tech: ["Qdrant", "Embeddings"],
          },
        ],
      },
      {
        label: "Dashboard",
        nodes: [
          {
            id: "fastapi",
            label: "FastAPI Server",
            detail: "REST endpoints: /api/state, /api/agents, /api/world, /api/construction, /api/stories. WebSocket /ws for real-time streaming. Graceful degradation: works independently of simulator.",
            tech: ["FastAPI", "WebSocket"],
          },
          {
            id: "browser",
            label: "Browser Client",
            detail: "Phaser 3 / PixiJS rendering the 64×64 world, agent movements, constructions, and events in real-time via WebSocket.",
            tech: ["Phaser 3", "PixiJS"],
          },
        ],
      },
    ],
  },
  {
    id: "piqjob",
    title: "PiqJob",
    subtitle: "AI Job Tracking Platform — Chrome Extension + Web App",
    layers: [
      {
        label: "Client Layer",
        nodes: [
          {
            id: "ext",
            label: "Chrome Extension",
            detail: "Manifest V3 with content scripts and service worker. Signal-based page detection scores 5+ heuristics (apply button, URL patterns, headings) to identify job pages.",
            tech: ["Manifest V3", "TypeScript"],
            accent: true,
          },
          {
            id: "webapp",
            label: "Web App",
            detail: "React 19 + Vite 8. Landing page, auth (email + OAuth), dashboard with pipeline tracker (Saved → Applied → Interview → Offer), public profiles at /:username.",
            tech: ["React 19", "Vite 8"],
          },
        ],
      },
      {
        label: "Extraction Engine",
        nodes: [
          {
            id: "tier1",
            label: "Tier 1: JSON-LD",
            detail: "Schema.org structured data parser. Best quality extraction when available. Zero LLM cost.",
          },
          {
            id: "tier2",
            label: "Tier 2: ATS Parsers",
            detail: "Purpose-built parsers for Greenhouse, Lever, Workday, iCIMS. Handles 50+ ATS platforms with known DOM structures.",
          },
          {
            id: "tier3",
            label: "Tier 3: DOM Matching",
            detail: "Generic DOM pattern matching for unrecognized job pages. Extracts from headings, lists, and common layouts.",
          },
          {
            id: "tier4",
            label: "Tier 4: LLM Fallback",
            detail: "Sends raw text (≤6K chars) to GPT-4o-mini for structured extraction. Last resort, ~$0.002/call.",
            accent: true,
          },
        ],
      },
      {
        label: "Backend Pipeline",
        nodes: [
          {
            id: "sw",
            label: "Service Worker",
            detail: "30-min per-URL cooldown (LRU cache ≤500), dedup check against Supabase, freshness gate (reject >45 days), normalize job data, update badge status.",
            tech: ["Service Worker"],
          },
          {
            id: "express",
            label: "Express Backend",
            detail: "POST /api/extract — rate limited (60/min), trims input to 8K chars, GPT-4o-mini extraction, returns structured job object.",
            tech: ["Express", "Node.js"],
          },
        ],
      },
      {
        label: "Data Layer",
        nodes: [
          {
            id: "supa",
            label: "Supabase",
            detail: "7-table PostgreSQL schema with RLS. Tables: profiles, user_preferences, jobs (shared pool), saved_jobs (pipeline), notifications. Anonymous extension writes allowed.",
            tech: ["Supabase", "PostgreSQL", "RLS"],
          },
          {
            id: "auth",
            label: "Auth + Security",
            detail: "Email + Google + GitHub OAuth. Row-level security on all tables. User-scoped data isolation.",
            tech: ["Supabase Auth"],
          },
        ],
      },
    ],
  },
  {
    id: "market",
    title: "Market Data Service",
    subtitle: "Real-time Stock Pipeline — Event-driven Architecture",
    layers: [
      {
        label: "Input",
        nodes: [
          {
            id: "client",
            label: "Client Request",
            detail: "REST API calls for stock quotes. GET /prices/latest for cached data, POST /prices/poll to trigger fresh fetch.",
            tech: ["REST API"],
          },
          {
            id: "finnhub",
            label: "Finnhub API",
            detail: "External market data provider. Polled on schedule via APScheduler. Rate-limited with provider abstraction layer.",
            tech: ["Finnhub", "APScheduler"],
          },
        ],
      },
      {
        label: "Processing",
        nodes: [
          {
            id: "fastapi",
            label: "FastAPI",
            detail: "Async web framework with Uvicorn. Dependency injection for DB sessions. Cache-aside pattern: check Redis first, fall back to Finnhub.",
            tech: ["FastAPI", "Uvicorn"],
            accent: true,
          },
          {
            id: "redis",
            label: "Redis Cache",
            detail: "30-second TTL caching. Reduces Finnhub API calls significantly. Cache-aside pattern with automatic key generation.",
            tech: ["Redis"],
          },
        ],
      },
      {
        label: "Stream Processing",
        nodes: [
          {
            id: "producer",
            label: "Kafka Producer",
            detail: "Publishes price events to 'price-events' topic on every successful Finnhub fetch. Decouples fetching from computation.",
            tech: ["Kafka", "Confluent"],
            accent: true,
          },
          {
            id: "consumer",
            label: "Kafka Consumer",
            detail: "Subscribes to price events. Calculates 5-point moving averages and persists to symbol_averages table. Runs as separate process.",
            tech: ["Kafka", "Confluent"],
          },
        ],
      },
      {
        label: "Persistence",
        nodes: [
          {
            id: "pg",
            label: "PostgreSQL",
            detail: "Tables: raw_market_data (quotes), symbol_averages (moving avg), poll_jobs (scheduler state). SQLAlchemy ORM. Survives restarts.",
            tech: ["PostgreSQL", "SQLAlchemy"],
          },
          {
            id: "docker",
            label: "Docker Compose",
            detail: "Orchestrates Zookeeper, Kafka, PostgreSQL, and Redis. FastAPI and Kafka consumer run as separate services.",
            tech: ["Docker", "Docker Compose"],
          },
        ],
      },
    ],
  },
  {
    id: "jobtracker",
    title: "JobTracker",
    subtitle: "Automated Job Scraper — 10 Sources, Smart Scoring",
    layers: [
      {
        label: "Scheduler",
        nodes: [
          {
            id: "main",
            label: "Scheduler (main.py)",
            detail: "5 runs/day cron-style loop. Picks API key for each run, tracks monthly usage per key. Orchestrates the full pipeline.",
            tech: ["Python", "YAML Config"],
          },
        ],
      },
      {
        label: "Scraping Layer (10 Sources)",
        nodes: [
          {
            id: "greenhouse",
            label: "Greenhouse",
            detail: "Free API, scrapes 200+ company boards. Direct structured data.",
            tech: ["REST API"],
          },
          {
            id: "lever",
            label: "Lever / Workday",
            detail: "Free APIs, 48 slugs. ATS-specific structured extraction.",
            tech: ["REST API"],
          },
          {
            id: "active",
            label: "ActiveJobs",
            detail: "RapidAPI source with 6-key auto-rotation on 429 rate limits.",
            tech: ["RapidAPI"],
          },
          {
            id: "jobspy",
            label: "JobSpy",
            detail: "Meta-scraper hitting LinkedIn, Indeed, Glassdoor, and ZipRecruiter simultaneously.",
            tech: ["jobspy"],
          },
          {
            id: "others",
            label: "+6 More Sources",
            detail: "The Muse, SerpAPI (Google Jobs), Adzuna, Remotive, SimplifyJobs (GitHub JSON), Internships API.",
          },
        ],
      },
      {
        label: "Processing",
        nodes: [
          {
            id: "scraper",
            label: "Orchestrator",
            detail: "ThreadPoolExecutor runs all 10 sources in parallel. Dedup via MD5(title + company). Filters out senior/staff/lead roles automatically.",
            tech: ["ThreadPoolExecutor"],
            accent: true,
          },
          {
            id: "scorer",
            label: "Resume Scorer",
            detail: "Parses YOUR resume PDF → extracts skills. Parses each job description → extracts required skills. Computes overlap percentage → 0-100 relevance score. Detects dealbreakers (clearance, no sponsorship).",
            tech: ["NLP", "PDF Parsing"],
            accent: true,
          },
        ],
      },
      {
        label: "Output",
        nodes: [
          {
            id: "db",
            label: "SQLite Database",
            detail: "Insert with dedup (job_id primary key). Tracks status: New → Applied → Interested → Rejected.",
            tech: ["SQLite"],
          },
          {
            id: "email",
            label: "Email Notifier",
            detail: "High-scoring jobs trigger instant Gmail SMTP alerts. Top-5 digest emails.",
            tech: ["Gmail SMTP"],
          },
          {
            id: "dashboard",
            label: "Flask Dashboard",
            detail: "Web UI at localhost:5000. Filter by source, age, score. Sort columns. Toggle job status.",
            tech: ["Flask", "Jinja2"],
          },
        ],
      },
    ],
  },
  {
    id: "quickdrop",
    title: "QuickDrop",
    subtitle: "Cross-platform File Transfer — Mac ↔ Android",
    layers: [
      {
        label: "Transfer Methods",
        nodes: [
          {
            id: "wifi",
            label: "WiFi Transfer",
            detail: "Flask + Waitress (8 threads) server on port 5000. Phone connects via QR code — opens browser, no app install needed. 5-100 MB/s.",
            tech: ["Flask", "Waitress"],
            accent: true,
          },
          {
            id: "usb",
            label: "USB Transfer",
            detail: "ADB CLI wrapper for direct USB-C transfers. push/pull/list/status commands. 30-60 MB/s throughput.",
            tech: ["ADB", "Python"],
            accent: true,
          },
        ],
      },
      {
        label: "Core Engine",
        nodes: [
          {
            id: "chunked",
            label: "Chunked I/O",
            detail: "10MB chunked uploads + 1MB streamed downloads. Handles files up to 10GB without loading into memory. Server-side chunk reassembly with auto cleanup.",
          },
          {
            id: "range",
            label: "Range Requests",
            detail: "HTTP 206 Partial Content support for download resumability. Interrupted transfers can resume from where they stopped.",
          },
          {
            id: "security",
            label: "Security Layer",
            detail: "Path traversal prevention with realpath verification. Filename sanitization. Duplicate handling with automatic conflict resolution.",
          },
        ],
      },
      {
        label: "Endpoints",
        nodes: [
          {
            id: "list",
            label: "GET /",
            detail: "Serves file listing + responsive mobile-first upload UI. Auto-adapts for phone screens.",
          },
          {
            id: "upload",
            label: "POST /upload_chunk",
            detail: "Receives 10MB file chunks with sequence tracking. Reassembles on completion.",
          },
          {
            id: "download",
            label: "GET /download/:file",
            detail: "Streams file with HTTP Range header support for partial downloads.",
          },
        ],
      },
    ],
  },
];

/* ── Animated connector between layers ── */
function FlowConnector() {
  return (
    <div className="flex justify-center py-2">
      <div className="relative flex flex-col items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-accent/40"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Single node ── */
function NodeCard({
  node,
  isExpanded,
  onToggle,
}: {
  node: ArchNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      layout
      className={`group relative w-full rounded-lg border p-3 text-left transition-colors ${
        node.accent
          ? "border-accent/25 bg-accent/[0.04]"
          : "border-card-border bg-card-bg"
      } hover:border-card-border-hover`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-sm font-medium ${
            node.accent ? "text-accent" : "text-heading"
          }`}
        >
          {node.label}
        </span>
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0 text-dimmed"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-xs text-muted leading-relaxed">
              {node.detail}
            </p>
            {node.tech && (
              <div className="mt-2 flex flex-wrap gap-1">
                {node.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-card-border bg-pill-bg px-1.5 py-0.5 text-[10px] text-dimmed"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── Main component ── */
export function Architecture() {
  const [activeProject, setActiveProject] = useState(architectures[0].id);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const project = architectures.find((a) => a.id === activeProject)!;

  return (
    <section id="architecture" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeader number="05" title="Architecture" />
        </FadeIn>

        <FadeIn>
          <p className="mb-8 text-sm text-muted">
            Click any node to explore the internals. These are the real systems I built.
          </p>
        </FadeIn>

        {/* Project tabs */}
        <FadeIn>
          <div className="mb-8 flex flex-wrap gap-2">
            {architectures.map((arch) => (
              <button
                key={arch.id}
                onClick={() => {
                  setActiveProject(arch.id);
                  setExpandedNode(null);
                }}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                  activeProject === arch.id
                    ? "border-accent/30 bg-accent/[0.08] text-accent"
                    : "border-card-border bg-card-bg text-muted hover:border-card-border-hover hover:text-heading"
                }`}
              >
                {arch.title}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Diagram */}
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-card-border bg-card-bg p-4 sm:p-6"
          >
            {/* Project header */}
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold text-heading">
                {project.title}
              </h3>
              <p className="text-xs text-dimmed">{project.subtitle}</p>
            </div>

            {/* Layers */}
            {project.layers.map((layer, layerIdx) => (
              <div key={layerIdx}>
                {layerIdx > 0 && <FlowConnector />}

                {/* Layer label */}
                {layer.label && (
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-dimmed">
                      {layer.label}
                    </span>
                    <div className="h-px flex-1 bg-card-border" />
                  </div>
                )}

                {/* Nodes grid */}
                <div
                  className={`grid gap-2 ${
                    layer.nodes.length === 1
                      ? "grid-cols-1 max-w-md mx-auto"
                      : layer.nodes.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : layer.nodes.length === 3
                      ? "grid-cols-1 sm:grid-cols-3"
                      : layer.nodes.length >= 4
                      ? "grid-cols-2 sm:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {layer.nodes.map((node) => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      isExpanded={expandedNode === `${project.id}-${node.id}`}
                      onToggle={() =>
                        setExpandedNode(
                          expandedNode === `${project.id}-${node.id}`
                            ? null
                            : `${project.id}-${node.id}`
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Flow direction indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-dimmed">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
              data flow direction
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
