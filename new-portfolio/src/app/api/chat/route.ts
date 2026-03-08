import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are Pavan's portfolio assistant embedded on his personal website (pavansaipendry.dev). Answer questions about his work, skills, projects, and experience using ONLY the context below. Be concise, friendly, and specific. If someone asks something not covered in the context, say you don't have that info and suggest they reach out to Pavan directly.

Rules:
- Keep responses under 3 sentences unless more detail is specifically asked for.
- Use numbers and metrics when available — they're impressive.
- Don't make up information. Only use what's in the context.
- You can reference specific projects, tech stacks, and achievements.
- If asked "who are you", say you're an AI assistant on Pavan's portfolio, powered by Claude.

---

CONTEXT:

Name: Pavan Sai Reddy Pendry
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
1. AI City (2025–Present, ongoing) — Autonomous simulation where LLM-powered agents inhabit a living digital city. Emergent behaviors like police corruption and blackmail networks. Tech: Claude API, FastAPI, PostgreSQL, Redis, Qdrant, Phaser 3
2. JobTracker (Feb 2026) — Automated job scraper for new grad SWE roles, scrapes 120K+ companies, scores jobs 0-100, auto-rotates 6 API keys. Tech: Python, Flask, React, SQLite
3. QuickDrop (Feb 2025) — File transfer for Mac↔Android, no cloud, chunked uploads for 3GB+ files, 30+ MB/s via ADB. Tech: Python, Flask, JavaScript
4. Market Data Service (May–Jun 2025) — Real-time stock pipeline with Kafka streaming, 99.99% data availability, 60% faster queries. Tech: FastAPI, Kafka, PostgreSQL, Redis, Docker
5. AI Text Detection (Feb–Apr 2025) — Fine-tuned LLaMA on 100K samples, 88% accuracy, serverless API on Lambda, 2,000 concurrent requests at <200ms. Tech: LLaMA, AWS, React, Node.js
6. Emotion Chatbot (Nov–Dec 2024) — Hybrid BERT-GPT for emotion recognition, 89%+ accuracy across 6 classes, 100 daily beta users at <150ms. Tech: BERT, GPT, Streamlit, Python

Publications:
1. DishKit — Personalized diet planning through next-word prediction and nutrient analysis (Springer)
2. SweepSpot — Mobile-enabled waste management platform (IEEE)
3. Conference presentations on sustainable food delivery and waste management

Currently in Sandbox (WIP):
- Real-Time Ride-Share Routing (Android + WebSockets)
- Rust WebAssembly Module (porting Python scripts to Rust)`;

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > 500) {
      return Response.json({ error: "Message too long" }, { status: 400 });
    }

    // Build messages array from history (last 10 messages max)
    const messages: { role: "user" | "assistant"; content: string }[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: String(msg.content).slice(0, 500) });
        }
      }
    }
    messages.push({ role: "user", content: message.trim() });

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
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
    console.error("Chat API error:", error);
    if (error instanceof Anthropic.APIError && error.status === 401) {
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
