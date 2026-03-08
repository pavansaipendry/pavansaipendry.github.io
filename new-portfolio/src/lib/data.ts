export const siteConfig = {
  name: "Pavan Sai Reddy Pendry",
  title: "Pavan Sai Reddy Pendry | Software Engineer & AI/ML",
  description:
    "Full-stack developer and AI/ML engineer building scalable autonomous systems from research to deployment.",
  url: "https://pavansaipendry.dev",
  email: "pavansaipendry2002@gmail.com",
  github: "https://github.com/pavansaipendry",
  linkedin: "https://linkedin.com/in/pavansaireddypendry",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Architecture", href: "#architecture" },
  { label: "Research", href: "#publications" },
  { label: "Resume Tailor", href: "#tailor" },
  { label: "Contact", href: "#contact" },
];

export const education = [
  {
    school: "University of Kansas",
    degree: "M.S. Computer Science",
    date: "Aug 2024 – Present",
  },
  {
    school: "Amrita Vishwa Vidyapeetham",
    degree: "B.Tech Computer Science & Engineering",
    date: "Oct 2020 – May 2024",
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
    type: "startup" as const,
    title: "Founder & Engineer",
    org: "PiqJob",
    orgLink: "https://piqjob.com/",
    date: "Upcoming (2026)",
    bullets: [
      "Currently building PiqJob, a new startup venture currently in the early development phase.",
      "Architecting the platform infrastructure, defining the core product vision, and preparing for initial launch.",
    ],
    tags: ["Entrepreneurship", "Full-Stack", "Product Design", "Stealth"],
    product: {
      title: "PiqJob Chrome Extension",
      oneLiner: "AI-powered Chrome extension that passively detects job listings and auto-extracts structured data — no clicks, no copy-paste.",
      highlights: [
        "4-tier extraction engine: meta tags → JSON-LD → DOM selectors → LLM fallback, achieving reliable extraction across all major job boards",
        "Signal-based page detection using URL patterns, meta tags, and DOM markers — zero user interaction required",
        "Claude API backend proxy via Supabase Edge Functions for secure, cost-optimized LLM calls ($0.002/extraction avg)",
        "Manifest V3 architecture with service workers, content scripts, and cross-context messaging",
        "Auto-saves extracted jobs to Supabase with deduplication and user-scoped storage",
        "Supports 50+ ATS platforms including Greenhouse, Lever, Workday, and iCIMS",
      ],
      tags: ["Chrome Extension", "Manifest V3", "TypeScript", "Supabase", "Claude API", "Edge Functions"],
    },
  },
  {
    type: "featured" as const,
    title: "Software Engineer Intern",
    org: "University of Kansas",
    date: "Oct 2025 – Jan 2026",
    liveUrl: "https://babyjay.bot",
    githubUrl: "https://github.com/pavansaipendry/BabyJay",
    description:
      'Built BabyJay, an AI-powered campus assistant serving 9,500+ knowledge documents with 82.4% user approval rate.',
    highlights: [
      { metric: "35×", desc: "Query speedup via hybrid RAG with 4 specialized retrievers" },
      { metric: "7,355", desc: "Courses with live seat availability through web scraping" },
      { metric: "26,453", desc: "Records processed via ETL into 72 department categories" },
      { metric: "RLHF", desc: "Feedback-driven optimization pipeline enhancing prompts dynamically" },
    ],
    caseStudy: {
      title: "BabyJay Architecture",
      desc: "Deep dive into the RAG pipeline and real-time enrollment data integrations that power the campus assistant.",
      points: [
        "Hybrid RAG: Engineered retrieval system with 4 specialized retrievers achieving 35x speedup.",
        "Live Data: Built web scrapers for classes.ku.edu, enabling live seat availability queries with 2-layer semantic caching.",
        "RLHF Pipeline: Designed feedback analytics system that learns from user input to dynamically enhance system prompts.",
      ],
    },
    tags: [
      "React.js", "FastAPI", "PostgreSQL", "Docker", "RAG",
      "RLHF", "OpenAI", "Supabase", "Python", "GitHub Actions",
    ],
    statusText: "Live: 7,355 Courses Synced",
  },
  {
    type: "regular" as const,
    title: "Graduate Teaching Assistant",
    org: "University of Kansas",
    date: "Jan 2025 – Dec 2025",
    bullets: [
      "Delivered interactive lectures to 20 students on data analytics using NumPy, Pandas, Matplotlib and Seaborn.",
      "Taught supply chain analytics: customer segmentation, warehouse optimization, demand forecasting.",
      "Mentored students 1:1, contributing to a 20% increase in average assessment scores.",
      "Leading recitations, grading and office hours for ~50 students in MATH 101.",
    ],
    tags: ["Python", "Pandas", "Power BI", "Data Analytics"],
  },
  {
    type: "regular" as const,
    title: "Software Engineer Co-op",
    org: "Amrita Vishwa Vidyapeetham",
    date: "Jun 2023 – May 2024",
    bullets: [
      "Engineered DishKit, a fullstack web app using React.js + Flask, integrating LSTM-based next-word prediction and nutrient analysis. Built dashboards helping nutritionists create 50+ personalized meal plans weekly.",
      "Developed real-time predictive UI using Bidirectional LSTM (491K params) with TensorFlow, improving user engagement by 3x.",
      "Designed SweepSpot, a waste management platform using React.js + FastAPI, serving 500+ users across 10 municipalities with geolocation tracking and reporting dashboards.",
      "Built scalable data pipelines handling 1,000+ geo-tagged reports with Haversine-based route optimization achieving 90% accuracy.",
    ],
    tags: ["React.js", "Flask", "FastAPI", "PostgreSQL", "TensorFlow", "Power BI", "MongoDB"],
  },
];

export const projects = [
  {
    number: "00",
    title: "pavansaipendry.dev",
    date: "Mar 2026",
    description:
      "The site you're on right now. A full-stack portfolio built with Next.js 16, React 19, and Tailwind CSS 4 — featuring an interactive terminal emulator with 13 commands, a Claude-powered AI chat assistant with SSE streaming, an AI resume tailor that analyzes job descriptions against my experience, SVG circuit board animations with Web Animations API beams, a CMD+K command palette, View Transitions API theme toggle with circular clip-path reveal, Lenis smooth scrolling, and 25 custom React components. Two AI-powered API routes, a custom markdown renderer, and zero external UI libraries.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Claude API", "Framer Motion", "Lenis", "SSE Streaming", "Vercel"],
    github: "https://github.com/pavansaipendry/portfolio-site",
    live: "https://pavansaipendry.dev",
    category: ["ai", "fullstack"],
    ongoing: true,
  },
  {
    number: "01",
    title: "AI City",
    date: "2025 – Present",
    description:
      "Autonomous simulation where LLM-powered agents inhabit a living digital city — earning tokens, forming alliances, committing crimes, and standing trial. Emergent behaviors like police corruption and blackmail networks arise purely from agent interactions.",
    tags: ["Claude API", "FastAPI", "PostgreSQL", "Redis", "Qdrant", "Phaser 3", "Python"],
    github: "https://github.com/pavansaipendry/aicity",
    category: ["ai", "fullstack"],
    ongoing: true,
  },
  {
    number: "02",
    title: "JobTracker",
    date: "Feb 2026",
    description:
      "Automated job scraper targeting new grad SWE roles with H-1B sponsorship focus. Scrapes 120K+ companies across 4 sources, scores each job 0–100 against my resume, auto-rotates 6 API keys on rate limits, and sends top-5 digest emails.",
    tags: ["Python", "Flask", "React", "SQLite", "RapidAPI", "SMTP"],
    github: "https://github.com/pavansaipendry/Job-Book",
    category: ["fullstack", "data"],
  },
  {
    number: "03",
    title: "QuickDrop",
    date: "Feb 2025",
    description:
      "File transfer tool for Mac↔Android. No cloud, no accounts, no ads. Flask server with QR connectivity, chunked uploads for 3GB+ files, ADB integration hitting 30+ MB/s.",
    tags: ["Python", "Flask", "JavaScript", "ADB"],
    github: "https://github.com/pavansaipendry/QuickDrop",
    category: ["fullstack"],
  },
  {
    number: "04",
    title: "Market Data Service",
    date: "May – Jun 2025",
    description:
      "Real-time stock quote pipeline using Finnhub API + PostgreSQL + Redis caching. Kafka streaming for price events and moving averages. 99.99% data availability, 60% faster queries.",
    tags: ["FastAPI", "Kafka", "PostgreSQL", "Redis", "Docker"],
    github: "https://github.com/pavansaipendry/Market-Data-Service",
    category: ["data", "fullstack"],
  },
  {
    number: "05",
    title: "AI Text Detection",
    date: "Feb – Apr 2025",
    description:
      "100K-sample dataset for AI text classification. Fine-tuned LLaMA on AWS EC2 reaching 88% accuracy. Serverless API on Lambda supporting 2,000 concurrent requests at <200ms.",
    tags: ["LLaMA", "AWS", "React", "Node.js"],
    category: ["ai", "fullstack"],
  },
  {
    number: "06",
    title: "Emotion Chatbot",
    date: "Nov – Dec 2024",
    description:
      "Hybrid BERT-GPT framework for real-time emotion recognition with 89%+ accuracy across 6 emotion classes. Streamlit UI serving 100 daily beta users at <150ms latency.",
    tags: ["BERT", "GPT", "Streamlit", "Python"],
    category: ["ai"],
  },
];

export const sandboxItems = [
  {
    status: "WIP",
    title: "Real-Time Ride-Share Routing",
    description: "Exploring Android native development and WebSockets for high-frequency location tracking.",
  },
  {
    status: "Learning",
    title: "Rust WebAssembly Module",
    description: "Porting Python data transformation scripts to Rust to test performance gains in browser environments.",
  },
];

export const publications = [
  {
    title: "DishKit",
    description: "Personalized diet planning through next-word prediction and nutrient analysis",
    venue: "Springer",
    url: "https://link.springer.com/chapter/10.1007/978-981-97-8537-7_25",
  },
  {
    title: "SweepSpot",
    description: "Mobile-enabled waste management platform",
    venue: "IEEE",
    url: "https://ieeexplore.ieee.org/abstract/document/10434372",
  },
  {
    title: "Conference Presentations",
    description: "Presented research on sustainable food delivery and waste management at international conferences",
    venue: null,
    url: null,
  },
];
