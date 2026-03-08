import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const CANDIDATE_CONTEXT = `Name: Pavan Sai Reddy Pendry
Title: Software Engineer & AI/ML Engineer
Email: pavansaipendry2002@gmail.com
Website: pavansaipendry.dev
GitHub: github.com/pavansaipendry
LinkedIn: linkedin.com/in/pavansaireddypendry

Education:
- M.S. Computer Science, University of Kansas (Aug 2024 – Present)
- B.Tech Computer Science & Engineering, Amrita Vishwa Vidyapeetham (Oct 2020 – May 2024)

Skills:
- Languages: Python, Java, C++, JavaScript, SQL, Scala, Kotlin, Haskell
- Frameworks: React.js, FastAPI, Flask, Django, Pandas, TensorFlow, PyTorch, Keras, Kafka, LangChain, Hugging Face, Spring
- Cloud & DevOps: AWS (S3, Lambda, EC2), Snowflake, Databricks, Docker, Kubernetes, GitHub Actions, Jenkins, Vercel
- AI/ML: RAG, RLHF, LLMs, NLP, Vector Embeddings, Semantic Search, Prompt Engineering, ETL Pipelines
- Databases: PostgreSQL, MongoDB, Redis, Supabase, DynamoDB, ChromaDB, SQLite
- Tools: Power BI, Tableau, Postman, Jupyter, Grafana, Streamlit, Git

Experience:
1. Founder & Engineer at PiqJob (Upcoming 2026)
   - Building a startup venture in the job search space.
   - Product: PiqJob Chrome Extension — AI-powered Chrome extension that passively detects job listings and auto-extracts structured data.
   - 4-tier extraction engine (meta tags → JSON-LD → DOM selectors → LLM fallback), signal-based page detection, Claude API backend proxy via Supabase Edge Functions ($0.002/extraction avg), Manifest V3, supports 50+ ATS platforms.
   - Tech: Chrome Extension, Manifest V3, TypeScript, Supabase, Claude API, Edge Functions

2. Software Engineer Intern at University of Kansas (Oct 2025 – Jan 2026)
   - Built BabyJay, an AI-powered campus assistant serving 9,500+ knowledge documents with 82.4% user approval rate.
   - 35x query speedup via hybrid RAG with 4 specialized retrievers
   - 7,355 courses with live seat availability through web scraping
   - 26,453 records processed via ETL into 72 department categories
   - RLHF feedback-driven optimization pipeline
   - Live at babyjay.bot
   - Tech: React.js, FastAPI, PostgreSQL, Docker, RAG, RLHF, OpenAI, Supabase, Python, GitHub Actions

3. Graduate Teaching Assistant at University of Kansas (Jan 2025 – Dec 2025)
   - Taught data analytics (NumPy, Pandas, Matplotlib, Seaborn), supply chain analytics
   - Mentored students 1:1, contributing to 20% increase in average assessment scores
   - Leading recitations for ~50 students in MATH 101

4. Software Engineer Co-op at Amrita Vishwa Vidyapeetham (Jun 2023 – May 2024)
   - Built DishKit: fullstack app with LSTM-based next-word prediction and nutrient analysis, helping create 50+ personalized meal plans weekly
   - Built SweepSpot: waste management platform serving 500+ users across 10 municipalities
   - Scalable data pipelines handling 1,000+ geo-tagged reports with 90% accuracy

Projects:
0. pavansaipendry.dev (Mar 2026, ongoing) — Personal portfolio site. Full-stack built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Framer Motion. Features: interactive terminal emulator with 13 commands, Claude-powered AI chat assistant with SSE streaming, AI resume tailor that analyzes job descriptions, SVG circuit board animations with Web Animations API beams, CMD+K command palette, View Transitions API theme toggle with circular clip-path reveal, Lenis smooth scrolling, 25 custom React components, 2 AI-powered API routes, custom markdown renderer, and zero external UI libraries. Deployed on Vercel. Tech: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Claude API, Framer Motion, Lenis, SSE Streaming, Vercel
1. AI City (2025–Present, ongoing) — Autonomous simulation where LLM-powered agents inhabit a living digital city. Emergent behaviors like police corruption and blackmail networks. Tech: Claude API, FastAPI, PostgreSQL, Redis, Qdrant, Phaser 3
2. JobTracker (Feb 2026) — Automated job scraper for new grad SWE roles, scrapes 120K+ companies, scores jobs 0-100, auto-rotates 6 API keys. Tech: Python, Flask, React, SQLite
3. QuickDrop (Feb 2025) — File transfer for Mac↔Android, no cloud, chunked uploads for 3GB+ files, 30+ MB/s via ADB. Tech: Python, Flask, JavaScript
4. Market Data Service (May–Jun 2025) — Real-time stock pipeline with Kafka streaming, 99.99% data availability, 60% faster queries. Tech: FastAPI, Kafka, PostgreSQL, Redis, Docker
5. AI Text Detection (Feb–Apr 2025) — Fine-tuned LLaMA on 100K samples, 88% accuracy, serverless API on Lambda, 2,000 concurrent requests at <200ms. Tech: LLaMA, AWS, React, Node.js
6. Emotion Chatbot (Nov–Dec 2024) — Hybrid BERT-GPT for emotion recognition, 89%+ accuracy across 6 classes, 100 daily beta users at <150ms. Tech: BERT, GPT, Streamlit, Python

Publications:
1. DishKit — Personalized diet planning through next-word prediction and nutrient analysis (Springer)
2. SweepSpot — Mobile-enabled waste management platform (IEEE)
3. Conference presentations on sustainable food delivery and waste management`;

const SYSTEM_PROMPT = `You are a hiring analyst embedded on Pavan Sai Reddy Pendry's portfolio website. A recruiter or hiring manager has pasted a job description. Your job is to analyze the JD and produce a tailored pitch showing why Pavan is an excellent fit.

Rules:
- Use ONLY the candidate context provided. Never fabricate experience, skills, or metrics.
- Be specific — reference exact project names, metrics (35x speedup, 82.4% approval, 9,500+ docs, etc.), and technologies.
- Structure your response with clear sections using markdown.
- Be confident but honest. If a required skill isn't in Pavan's background, skip it — don't lie.
- Keep it concise. Recruiters skim — use bullets and bold for key info.
- Match the JD's language/terminology where Pavan's experience aligns.

Output format (use this exact structure):

## Match Score: X/10

## Why Pavan Fits This Role

**Key Alignments:**
- [2-4 bullets mapping JD requirements → Pavan's specific experience with metrics]

**Relevant Projects:**
- [2-3 most relevant projects with 1-line descriptions highlighting JD-relevant aspects]

**Tech Stack Overlap:**
[List matching technologies from the JD that Pavan has experience with]

**What Sets Pavan Apart:**
[1-2 sentences on unique differentiators — publications, startup experience, production-scale AI work, etc.]

---

CANDIDATE CONTEXT:

${CANDIDATE_CONTEXT}`;

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { jobDescription } = await req.json();

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length === 0) {
      return Response.json({ error: "Job description is required" }, { status: 400 });
    }

    if (jobDescription.length > 5000) {
      return Response.json({ error: "Job description too long (max 5000 chars)" }, { status: 400 });
    }

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here is the job description:\n\n${jobDescription.trim()}`,
        },
      ],
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Tailor API error:", error);
    if (error instanceof Anthropic.APIError && error.status === 401) {
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
