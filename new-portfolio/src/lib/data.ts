export const siteConfig = {
  name: "Pavan Sai Reddy Pendry",
  title: "Pavan Sai Reddy Pendry | Software Engineer & AI/ML",
  description:
    "Software engineer building AI systems that retrieve, reason, and ship - from paper to production.",
  url: "https://pavansaipendry.dev",
  email: "pavansaipendry2002@gmail.com",
  github: "https://github.com/pavansaipendry",
  linkedin: "https://linkedin.com/in/pavansaireddypendry",
};

export const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Research", href: "#publications" },
  { label: "Contact", href: "#contact" },
];

export const education = [
  {
    school: "University of Kansas",
    degree: "M.S. Computer Science",
    date: "Aug 2024 - Present",
  },
  {
    school: "Amrita Vishwa Vidyapeetham",
    degree: "B.Tech Computer Science & Engineering",
    date: "Oct 2020 - May 2024",
  },
];

export const skills = [
  {
    title: "Languages",
    items: ["Python", "Java", "C++", "JavaScript", "SQL", "Scala", "Kotlin", "Haskell"],
  },
  {
    title: "Frameworks",
    items: [
      "React.js", "FastAPI", "Flask", "Django", "Pandas", "TensorFlow",
      "PyTorch", "Keras", "Kafka", "LangChain", "Hugging Face", "Spring",
    ],
  },
  {
    title: "Cloud & DevOps",
    items: [
      "AWS", "S3", "Lambda", "EC2", "Snowflake", "Databricks",
      "Docker", "Kubernetes", "GitHub Actions", "Jenkins", "Vercel",
    ],
  },
  {
    title: "AI / ML",
    items: [
      "RAG", "RLHF", "LLMs", "NLP", "Vector Embeddings",
      "Semantic Search", "Prompt Engineering", "ETL Pipelines",
    ],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "DynamoDB", "ChromaDB", "SQLite"],
  },
  {
    title: "Tools",
    items: ["Power BI", "Tableau", "Postman", "Jupyter", "Grafana", "Streamlit", "Git"],
  },
];

export const experiences = [
  {
    title: "Research Software Engineer",
    org: "University of Kansas",
    date: "Jan 2025 - May 2026",
    liveUrl: "https://babyjay.bot",
    githubUrl: "https://github.com/pavansaipendry/BabyJay",
    description:
      "Built BabyJay, a production AI campus assistant serving 7,300+ courses and 2,207 faculty with 82.4% user approval - a multi-stage RAG pipeline (8 specialized retrievers, 35x faster retrieval), a FastAPI backend with JWT auth and 3-tier rate limiting, and 9 production data pipelines with Pytest CI regression checks. Mentored 100+ students as a graduate teaching assistant.",
    tags: ["Python", "FastAPI", "RAG", "ChromaDB", "Claude", "PostgreSQL", "Pytest"],
  },
  {
    title: "Software Engineer Intern",
    org: "Note · USA (Remote)",
    date: "May 2025 - Aug 2025",
    description:
      "Built Note, a developer-intelligence platform capturing and analyzing Claude Code sessions: 25+ REST endpoints in Next.js 16 App Router, a 15-table PostgreSQL schema with pg_trgm fuzzy search, a WebSocket + Redis pub/sub server for real-time CLI-to-web pairing, JWT dual-token auth, a 24-command Node.js CLI, and a 14-view React 19 dashboard.",
    tags: ["Next.js 16", "PostgreSQL", "Redis", "WebSocket", "Node.js", "React 19"],
  },
  {
    title: "Research Assistant",
    org: "Amrita Vishwa Vidyapeetham",
    date: "Jun 2023 - May 2024",
    description:
      "Co-authored 2 peer-reviewed papers (Springer LNNS ICT4SD 2024, IEEE i-PACT 2023) and shipped 2 production apps in Python, React, and PostgreSQL serving 500+ users; built a Bidirectional LSTM (491K parameters, TensorFlow) for next-word prediction and nutrient analysis.",
    tags: ["Python", "TensorFlow", "React", "PostgreSQL", "AWS"],
  },
];

export const projects = [
  {
    number: "01",
    title: "NSA-mini",
    date: "2026",
    description:
      "I rebuilt DeepSeek's award-winning attention idea from scratch - the trick that lets AI models read very long text without slowing down. My GPU code runs the key part 22x faster than the standard approach.",
    tags: ["PyTorch", "Triton", "CUDA", "A100", "FlashAttention", "GQA"],
    github: "https://github.com/pavansaipendry/nsa-mini",
    category: ["ai"],
    ongoing: false,
    images: [],
    accent: "#7c5cfc",
  },
  {
    number: "02",
    title: "mini-vLLM",
    date: "2026",
    description:
      "The engine that runs AI models, built from scratch. It manages GPU memory in small pages so many people can chat with a model at once - nothing wasted, nobody waiting in line. Same core idea as vLLM.",
    tags: ["Python", "PyTorch", "Triton", "PagedAttention", "Qwen2.5"],
    category: ["ai"],
    ongoing: false,
    images: [],
    accent: "#38bdf8",
  },
  {
    number: "03",
    title: "Reasoning SLM",
    date: "2026",
    description:
      "I trained my own small language model from zero - gathered the data, cleaned it, built the tokenizer, and taught a 118M-parameter model to reason about math and code. Every stage of the pipeline is mine.",
    tags: ["PyTorch", "RunPod", "A100", "BPE", "Pretraining", "GRPO"],
    github: "https://github.com/pavansaipendry/reasoning-slm",
    category: ["ai"],
    ongoing: true,
    images: [],
    accent: "#a3e635",
  },
  {
    number: "04",
    title: "AI City",
    date: "2025 - Present",
    description:
      "An autonomous AI city. Agents live their own lives - they work, make friends, commit crimes, and stand trial. Nobody scripts them; the drama just emerges on its own.",
    tags: ["Claude API", "FastAPI", "PostgreSQL", "Redis", "Qdrant", "PixiJS", "Python"],
    github: "https://github.com/pavansaipendry/aicity",
    category: ["ai", "fullstack"],
    ongoing: true,
    images: ["/projects/aicity.svg"],
    accent: "#fa4D43",
  },
  {
    number: "05",
    title: "PiqJob",
    date: "2025 - Present",
    description:
      "My startup, built solo. A Chrome extension that notices job listings while you browse and saves them to your dashboard automatically - no copy-pasting, no spreadsheets.",
    tags: ["Next.js 16", "TypeScript", "Chrome MV3", "Supabase", "Node.js"],
    live: "https://piqjob.com",
    category: ["fullstack"],
    ongoing: true,
    images: ["/projects/piqjob.svg"],
    accent: "#e879f9",
  },
  {
    number: "06",
    title: "AttentionFM",
    date: "2025",
    description:
      "A 24/7 AI radio station. AI hosts hold live conversations on any topic, around the clock - you tune in like a podcast that never stops.",
    tags: ["SvelteKit", "FastAPI", "WebSocket", "Claude", "Docker", "RunPod"],
    category: ["ai", "fullstack"],
    ongoing: false,
    images: [],
    accent: "#fb7185",
  },
  {
    number: "07",
    title: "Highway RL Agent",
    date: "2026",
    description:
      "An AI driver that taught itself to drive through pure trial and error - crash, learn, repeat. Now it cruises highway traffic at ~80 km/h with zero collisions.",
    tags: ["Python", "PyTorch", "Stable-Baselines3", "Gymnasium", "PPO"],
    github: "https://github.com/pavansaipendry/highway-rl",
    category: ["ai"],
    ongoing: false,
    images: [],
    accent: "#facc15",
  },
  {
    number: "08",
    title: "FinDocAgent",
    date: "2025",
    description:
      "An AI that reads dense financial filings so you don't have to. Ask it a question, it answers with citations - so you can check every claim against the original document.",
    tags: ["PyTorch", "Hugging Face", "LangGraph", "LangChain", "pgvector"],
    category: ["ai"],
    ongoing: false,
    images: [],
    accent: "#2dd4bf",
  },
  {
    number: "09",
    title: "Market Data Service",
    date: "2025",
    description:
      "A service that watches stock prices in real time - it fetches live quotes, remembers them for instant answers, and streams every price change as it happens.",
    tags: ["FastAPI", "Kafka", "PostgreSQL", "Redis", "Docker"],
    github: "https://github.com/pavansaipendry/Market-Data-Service",
    category: ["data", "fullstack"],
    ongoing: false,
    images: ["/projects/marketdata.svg"],
    accent: "#FBB833",
  },
  {
    number: "10",
    title: "QuickDrop",
    date: "2025",
    description:
      "Send big files between your Mac and Android in seconds. Scan a QR code, drop the file, done - no cloud, no accounts, no ads.",
    tags: ["Python", "Flask", "JavaScript", "ADB"],
    github: "https://github.com/pavansaipendry/QuickDrop",
    category: ["fullstack"],
    ongoing: false,
    images: ["/projects/quickdrop.svg"],
    accent: "#34d399",
  },
];


export const publications = [
  {
    title: "DishKit - Integrated Dish Preparation and Ingredient Delivery System",
    shortTitle: "DishKit",
    description: "Personalized diet planning through next-word prediction and nutrient analysis",
    abstract:
      "Long-term productivity and personal health depend on having a healthy diet. We propose an integrated dish preparation and ingredient delivery system using LSTM for predictive modeling, ML for nutrient calculation, and sentiment analysis to promote healthier eating.",
    venue: "Springer",
    year: "2024",
    authors: ["Pendry Pavan Sai Reddy", "Ratnala Sashank", "Atla Suraj Reddy", "Sharan Jaya Kumar", "Varsha P Suresh"],
    keywords: ["Recommendation System", "Feedback Analysis", "NLP", "Nutrients Calculation"],
    url: "https://link.springer.com/chapter/10.1007/978-981-97-8537-7_25",
    pdf: "/papers/DishKit.pdf",
    highlights: [
      { label: "Model", value: "Bidirectional LSTM (491K params)" },
      { label: "Approach", value: "Next-word prediction + nutrient analysis" },
      { label: "Impact", value: "50+ personalized meal plans weekly" },
    ],
  },
  {
    title: "SweepSpot - Mobile-Enabled Waste Management Platform",
    shortTitle: "SweepSpot",
    description: "Mobile-enabled waste management platform with geolocation tracking",
    abstract:
      "A waste management platform serving 500+ users across 10 municipalities with geolocation tracking, Haversine-based route optimization achieving 90% accuracy, and reporting dashboards for municipal authorities.",
    venue: "IEEE",
    year: "2024",
    authors: ["Pendry Pavan Sai Reddy", "et al."],
    keywords: ["Waste Management", "Geolocation", "Route Optimization", "React.js", "FastAPI"],
    url: "https://ieeexplore.ieee.org/abstract/document/10434372",
    pdf: "/papers/SweepSpot.pdf",
    highlights: [
      { label: "Users", value: "500+ across 10 municipalities" },
      { label: "Accuracy", value: "90% route optimization" },
      { label: "Data", value: "1,000+ geo-tagged reports" },
    ],
  },
  {
    title: "Conference Presentations",
    shortTitle: "Conferences",
    description: "Presented research on sustainable food delivery and waste management at international conferences",
    abstract: null,
    venue: null,
    year: "2023-2024",
    authors: null,
    keywords: null,
    url: null,
    pdf: null,
    highlights: null,
  },
];
