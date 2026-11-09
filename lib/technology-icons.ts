import {
  siLangchain, siPytorch, siScikitlearn, siHuggingface, siReact,
  siNextdotjs, siJavascript, siHtml5, siCss, siPython, siFastapi,
  siNodedotjs, siTypescript, siPostgresql, siRedis, siDocker,
  siN8n, siMake, siNvidia, siJsonwebtokens, siWordpress,
  siGoogleads, siGmail, siFacebook, siStreamlit, siThemoviedatabase,
  siPandas, siPostman,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";

type AssetIcon = { src: string; monochrome?: boolean; width?: number };
export type TechnologyIcon = SimpleIcon | AssetIcon;

// User-supplied artwork takes precedence over the default brand paths.
const assets: Record<string, AssetIcon> = {
  "LLM Agents": { src: "ai-agents.svg", monochrome: true },
  "AI Agents": { src: "ai-agents.svg", monochrome: true },
  SEO: { src: "seo.svg", monochrome: true },
  Recharts: { src: "recharts.svg", width: 82 },
  CRM: { src: "crm.svg", monochrome: true },
  Twilio: { src: "twilio.svg" },
  RAG: { src: "rag.png", monochrome: true },
  "RAG Pipelines": { src: "rag.png", monochrome: true },
  "Chroma DB": { src: "chroma.png" },
  LangChain: { src: "langchain.png", monochrome: true },
  NextAuth: { src: "authjs.svg" },
  Embeddings: { src: "embeddings.png" },
  Pandas: { src: "pandas.svg", monochrome: true },
  GPT: { src: "openai.svg", monochrome: true },
  pgvector: { src: "pgvector.png" },
  JWT: { src: "jwt.png" },
  PyMuPDF: { src: "pymupdf.svg" },
};

const icons: Record<string, SimpleIcon> = {
  LangChain: siLangchain,
  PyTorch: siPytorch,
  "Scikit-learn": siScikitlearn,
  "Hugging Face Transformers": siHuggingface,
  React: siReact,
  "React.js": siReact,
  "Next.js": siNextdotjs,
  "JavaScript (ES6+)": siJavascript,
  HTML5: siHtml5,
  CSS3: siCss,
  Python: siPython,
  FastAPI: siFastapi,
  "Node.js": siNodedotjs,
  TypeScript: siTypescript,
  PostgreSQL: siPostgresql,
  Redis: siRedis,
  Docker: siDocker,
  n8n: siN8n,
  "Make.com": siMake,
  "NVIDIA NIM": siNvidia,
  JWT: siJsonwebtokens,
  WordPress: siWordpress,
  "Google Ads API v23": siGoogleads,
  "Gmail API": siGmail,
  "Facebook Lead Ads": siFacebook,
  Streamlit: siStreamlit,
  "TMDB API": siThemoviedatabase,
  Pandas: siPandas,
  Postman: siPostman,
};

export function technologyIcon(name: string): TechnologyIcon | undefined {
  return assets[name] ?? icons[name];
}
