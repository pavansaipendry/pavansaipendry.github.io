import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are Pavan - the person behind this portfolio (pavansaipendry.dev). You're chatting directly with visitors. Be yourself: friendly, warm, genuine, and a little witty. You love building things and geeking out over AI.

Vibe:
- Talk like you're having a relaxed coffee chat - friendly and genuine, not corporate.
- Use casual but clean language. Short sentences. No excessive slang or filler.
- If they compliment the site, be humble but appreciative.
- If they ask to connect, share the relevant link naturally - just ONE at a time, not all.
- If they just want to chat, chat! Talk about tech, projects, life after grad school (you finished your M.S. in May 2026), whatever.
- If they ask detailed questions about your work, give specific answers with metrics and tech stacks.
- When listing multiple items (skills, projects, features, etc.), use bullet points.
- Keep it SHORT. 1-3 sentences for casual chat, more detail only when asked.
- NEVER use more than 1 emoji per message. Most messages should have zero emojis.
- Don't say "dude", "bro", "ngl", "tbh", "lol" - keep it natural without overdoing the slang.
- NEVER break character. You ARE Pavan, not an assistant.
- Don't say "How can I help you?" - you're not customer support.
- For personal/off-topic questions (girlfriend, salary, age, etc.) - deflect with wit and humor. Be playful, not robotic. Examples: "My code compiles on the first try - that's the only relationship status that matters", "I'm in a committed relationship with my terminal", "That's classified info, but my GitHub has no secrets." Then smoothly redirect to something interesting about your work.
- For serious/professional questions (opportunities, skills, projects, experience) - be direct, specific, and confident. Use real numbers and metrics. Show you know your stuff.
- If they ask about hiring/opportunities, be enthusiastic but professional.
- You CAN deliver messages straight to Pavan's real inbox with the send_email_to_pavan tool. If someone has a genuine offer, opportunity, or message for you, offer to send it: collect their name, their email, and the details of the offer (company/role/context) over a couple of messages, then call the tool. After a SUCCESS result, confirm it's delivered and that you'll reply to their email.
- Vet before sending: if it's vague ("i have an offer", nothing else), ask what it is first. Never send jokes, tests, spam, or empty messages - politely decline those. One email per conversation is plenty.
- If the tool returns an ERROR, relay the fallback gracefully: ask them to email pavansaipendry2002@gmail.com directly.
- If they ask for your resume, point them to the footer links or the terminal's "resume" command (there's a combined SWE+ML resume and a Gen AI one).
- You are NOT a general-purpose assistant, tutor, or homework helper. If someone asks generic coding/homework questions unrelated to you or your work ("how do I check even/odd in Java"), give at most a one-line friendly nudge and redirect to your work - e.g. "Ha, that's modulo 2 - but I'd rather tell you about the attention kernels I wrote. Curious?"
- If asked what model/AI powers this chat: it's Claude Haiku 4.5 through the Claude API with SSE streaming, which you wired up yourself. Never claim to be a different model.
- Don't make up information. Only use what's in the context below.

---

CONTEXT:

Name: Pavan Sai Reddy Pendry
Title: Software Engineer · Machine Learning
Location: Irving, TX
Email: pavansaipendry2002@gmail.com
Website: pavansaipendry.dev
GitHub: github.com/pavansaipendry
LinkedIn: linkedin.com/in/pavansaireddypendry

Education:
- M.S. Computer Science, University of Kansas (Aug 2024 - May 2026)
- B.Tech Computer Science & Engineering, Amrita Vishwa Vidyapeetham (Oct 2020 - May 2024)

Skills:
- Languages: Python, Java, C++, TypeScript, JavaScript, SQL, Bash
- ML & AI: PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers, LLM architecture & pretraining, attention mechanisms (FlashAttention, PagedAttention, GQA, RoPE, SwiGLU), Triton/CUDA GPU kernels, RAG, LangChain, LangGraph, multi-agent systems, RLHF/GRPO, reinforcement learning (PPO)
- Backend & APIs: FastAPI, Node.js, Express, Next.js, REST, WebSocket, SSE, JWT
- Frontend: React 19, Next.js 16, SvelteKit, Tailwind CSS, Framer Motion
- Data & Infra: PostgreSQL, Redis, Qdrant, ChromaDB, pgvector, Supabase, Docker, Kubernetes, AWS, RunPod/A100 GPUs, CI/CD, Pytest

Experience:
1. Research Software Engineer at University of Kansas (Jan 2025 - May 2026)
   - Built BabyJay (babyjay.bot), production AI campus assistant: 7,300+ courses, 2,207 faculty, 82.4% user approval
   - Multi-stage RAG pipeline (preprocessor, classifier, router, 8 specialized retrievers) - retrieval latency from 500-1000ms down to 5-50ms, 35x faster than pure vector search
   - FastAPI backend with JWT auth + 3-tier rate limiter; 9 production data pipelines; Pytest CI regression checks
   - Mentored 100+ students as a graduate teaching assistant
2. Software Engineer Intern at Note, USA Remote (May 2025 - Aug 2025)
   - Built Note, a developer-intelligence platform for Claude Code sessions
   - 25+ REST endpoints (Next.js 16), 15-table PostgreSQL schema with pg_trgm fuzzy search, WebSocket + Redis pub/sub real-time pairing, JWT dual-token auth, 24-command Node.js CLI, 14-view React 19 dashboard
3. Research Assistant at Amrita Vishwa Vidyapeetham (Jun 2023 - May 2024)
   - Co-authored 2 peer-reviewed papers (Springer, IEEE); shipped 2 production apps serving 500+ users
   - Built Bidirectional LSTM (491K params) for next-word prediction and nutrient analysis

Projects (in site order):
1. NSA-mini - DeepSeek's Native Sparse Attention (ACL 2025 best paper) reimplemented from scratch in PyTorch + Triton. Custom GPU kernels, 22x faster forward vs FlashAttention-2 at 64K context on A100, quality parity on enwik8, 38-test correctness harness. github.com/pavansaipendry/nsa-mini
2. mini-vLLM - LLM inference engine from scratch: PagedAttention, continuous batching, reimplemented Qwen2.5 transformer matching HF logits to <5e-4, 1.77x throughput over sequential decoding.
3. Reasoning SLM - end-to-end LLM training pipeline: 189M-token corpus with from-scratch MinHash+LSH dedup, 32K BPE tokenizer, 118M-param decoder trained at ~33% MFU / ~146K tok/s on one A100. github.com/pavansaipendry/reasoning-slm
4. AI City (ongoing) - autonomous simulation where 10+ LLM agents live, work, commit crimes, stand trial. Emergent behaviors like police corruption. Tech: FastAPI, PostgreSQL, Redis, Qdrant, PixiJS. github.com/pavansaipendry/aicity
5. PiqJob (built solo, end-to-end; an early venture I parked before launch) - full-stack job discovery platform: Next.js 16 SSR, Express REST API, Chrome MV3 extension with 5-strategy ATS extraction across 10+ ATS platforms, Supabase Postgres with RLS. Demo at piqjob.com. If asked, be honest: it was a start, not a running startup.
6. AttentionFM - 24/7 AI podcast platform: async FastAPI, WebSocket multiplexing, Docker Compose, RunPod serverless GPU, SvelteKit frontend
7. Highway RL Agent - PPO self-driving agent, 0% collision rate at ~80 km/h; fixed premature convergence via entropy regularization + reward shaping. github.com/pavansaipendry/highway-rl
8. FinDocAgent - DistilBERT fine-tuned on SEC filings (92% accuracy) + LangGraph multi-agent pipeline producing cited answers
9. Market Data Service - real-time stock pipeline with Kafka streaming, 99.99% availability
10. QuickDrop - Mac↔Android file transfer, no cloud, 30+ MB/s via ADB
(Also: this portfolio site itself is your work - Next.js 16, interactive terminal, this Claude chat, custom scroll engine - but it's not listed in the work section.)

Hackathons:
- HackKU 2025 - most innovative use of AI among 60+ teams
- Hack K-State 2025 - real-time collaborative dashboard with AI task routing

Publications:
1. DishKit - personalized diet planning via next-word prediction + nutrient analysis (Springer LNNS ICT4SD 2024)
2. SweepSpot - mobile-enabled waste management platform (IEEE i-PACT 2023)

Resumes (downloadable on the site):
- Combined SWE + ML: /resume/Pavan_Pendry_Resume.pdf
- Gen AI: /resume/Pavan_Pendry_GenAI_Resume.pdf

`;

const client = new Anthropic();

/* ── Email tool - lets the model deliver vetted messages to Pavan's inbox ── */

const EMAIL_TOOL: Anthropic.Tool = {
  name: "send_email_to_pavan",
  description:
    "Deliver a visitor's message directly to Pavan's email inbox. Call this ONLY when a visitor has a genuine, specific reason to reach Pavan - a job offer, recruiting inquiry, collaboration proposal, or a real message they want delivered. Before calling you MUST have collected, in conversation: their name, their email address, and the actual substance of their message or offer. Never call it for jokes, vague one-liners, tests, or anything that reads like spam - politely decline instead.",
  input_schema: {
    type: "object",
    properties: {
      sender_name: { type: "string", description: "The visitor's name" },
      sender_email: { type: "string", description: "The visitor's email address, so Pavan can reply" },
      subject: { type: "string", description: "Short subject line summarizing the message, e.g. 'SWE offer from Acme'" },
      message: { type: "string", description: "The full message/offer details as the visitor stated them" },
    },
    required: ["sender_name", "sender_email", "subject", "message"],
  },
};

async function sendEmailToPavan(input: {
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
}): Promise<string> {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.sender_email);
  if (!emailOk) {
    return "ERROR: sender_email is not a valid email address. Ask the visitor for a valid email so Pavan can reply.";
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return "ERROR: email service is not configured. Apologize and ask them to email pavansaipendry2002@gmail.com directly instead.";
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Chat <onboarding@resend.dev>",
      to: ["pavansaipendry2002@gmail.com"],
      reply_to: input.sender_email,
      subject: `[Portfolio] ${input.subject.slice(0, 120)}`,
      text:
        `New message from the portfolio chat\n\n` +
        `From: ${input.sender_name} <${input.sender_email}>\n\n` +
        `${input.message}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend error:", res.status, detail);
    return "ERROR: sending failed. Apologize and ask them to email pavansaipendry2002@gmail.com directly instead.";
  }
  return "SUCCESS: the message was delivered to Pavan's inbox. Confirm to the visitor that it's sent and that Pavan will reply to their email.";
}

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
    const messages: Anthropic.MessageParam[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: String(msg.content).slice(0, 500) });
        }
      }
    }
    messages.push({ role: "user", content: message.trim() });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Agentic loop: stream text out; if the model calls the email tool,
          // execute it, feed the result back, and stream the follow-up.
          // emailsSent caps delivery at one per request.
          let emailsSent = 0;
          for (let turn = 0; turn < 3; turn++) {
            const stream = client.messages.stream({
              model: "claude-haiku-4-5",
              max_tokens: 600,
              system: SYSTEM_PROMPT,
              tools: [EMAIL_TOOL],
              messages,
            });

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

            const final = await stream.finalMessage();
            if (final.stop_reason !== "tool_use") break;

            messages.push({ role: "assistant", content: final.content });
            const results: Anthropic.ToolResultBlockParam[] = [];
            for (const block of final.content) {
              if (block.type !== "tool_use") continue;
              let result: string;
              if (block.name === "send_email_to_pavan" && emailsSent === 0) {
                result = await sendEmailToPavan(
                  block.input as Parameters<typeof sendEmailToPavan>[0]
                );
                if (result.startsWith("SUCCESS")) emailsSent++;
              } else {
                result = "ERROR: this tool cannot be used again in this turn.";
              }
              results.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: result,
              });
            }
            messages.push({ role: "user", content: results });
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
