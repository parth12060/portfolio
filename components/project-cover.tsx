import Image from "next/image";
import { useId } from "react";

type Cover = { title: string; label: string; accent: string; deep: string; mode: "chat" | "pipeline" | "chart" | "movies"; steps?: string[]; heading?: string; footer?: string };
const covers: Record<string, Cover> = {
  PulseLoop: { title: "PulseLoop", label: "CONTEXT INTO CONVERSATION", accent: "#69d8ff", deep: "#17479b", mode: "chat" },
  "Real Doodle": { title: "Real Doodle", label: "RESEARCH. WRITE. PUBLISH.", accent: "#b5adff", deep: "#5340aa", mode: "pipeline", steps: ["Research", "Write", "SEO", "Review", "Publish"] },
  "Google Ads Analytics": { title: "Ads Analytics", label: "THE NUMBERS THAT MATTER", accent: "#6ee7dc", deep: "#126b73", mode: "chart" },
  "Lead Qualification & Enrichment": { title: "Lead Intelligence", label: "FROM FIRST CLICK TO FOLLOW-UP", accent: "#ffc78f", deep: "#a34c3d", mode: "pipeline", steps: ["Capture", "Enrich", "Score", "Route", "Connect"] },
  "Financial Chatbot": { title: "FinAdvisor", label: "YOUR DOCUMENTS. CLEARER ANSWERS.", accent: "#96bdff", deep: "#3647a3", mode: "chat" },
  ShipCheck: { title: "ShipCheck", label: "PROVE IT. FIX IT. VERIFY IT.", accent: "#86e3a6", deep: "#1f6e45", mode: "pipeline", steps: ["Triage", "Attack", "Fix", "Re-attack", "Draft PR"], heading: "Don't flag it. Prove it.", footer: "4 of 4 planted bugs confirmed, fixed, and re-verified" },
  "Movie Recommendation System": { title: "Next on your list", label: "A LITTLE MACHINE LEARNING. A GREAT MOVIE.", accent: "#f6ace6", deep: "#803b88", mode: "movies" },
};

/** Illustrated covers describe the project; they are not product screenshots. */
export function ProjectCover({ name, image, imageAlt }: { name: string; image?: string; imageAlt?: string }) {
  const id = useId().replace(/:/g, "");
  if (image) {
    return (
      <div className="project-cover overflow-hidden rounded-t-xl border-b border-white/10">
        <Image src={image} alt={imageAlt ?? `${name}: project overview`} width={720} height={420} sizes="(max-width: 768px) 100vw, 360px" className="block aspect-[12/7] h-auto w-full object-cover" />
      </div>
    );
  }
  const cover = covers[name];
  if (!cover) return null;
  return (
    <div className="project-cover overflow-hidden rounded-t-xl border-b border-white/10">
      <svg viewBox="0 0 720 420" role="img" aria-label={`${name}: illustrated project overview`} className="block h-auto w-full">
        <defs>
          <linearGradient id={`${id}-bg`} x2="1" y2="1"><stop stopColor={cover.accent} /><stop offset="0.55" stopColor={cover.deep} /><stop offset="1" stopColor="#101a35" /></linearGradient>
          <linearGradient id={`${id}-glass`} x2="0" y2="1"><stop stopColor="#fff" stopOpacity=".22" /><stop offset="1" stopColor="#fff" stopOpacity=".04" /></linearGradient>
          <linearGradient id={`${id}-area`} x2="0" y2="1"><stop stopColor={cover.accent} stopOpacity=".5" /><stop offset="1" stopColor={cover.accent} stopOpacity="0" /></linearGradient>
        </defs>
        <rect width="720" height="420" fill={`url(#${id}-bg)`} />
        <circle cx="660" cy="20" r="200" fill="none" stroke="#fff" strokeOpacity=".08" strokeWidth="60" />
        <circle cx="-30" cy="425" r="180" fill="none" stroke="#fff" strokeOpacity=".08" strokeWidth="35" />
        <text x="360" y="48" textAnchor="middle" fill="#fff" fillOpacity=".85" fontSize="13" letterSpacing="2" fontFamily="sans-serif">{cover.label}</text>
        <text x="360" y="108" textAnchor="middle" fill="#fff" fontSize="48" fontWeight="600" letterSpacing="-1.5" fontFamily="Georgia, serif">{cover.title}</text>
        <g transform="translate(62 148)">
          <rect width="596" height="294" rx="15" fill="#0d1426" stroke="#fff" strokeOpacity=".35" />
          <rect x="1" y="1" width="594" height="34" rx="14" fill={`url(#${id}-glass)`} />
          {[16, 29, 42].map(x => <circle key={x} cx={x} cy="17" r="3" fill="#fff" fillOpacity=".4" />)}
          <rect x="244" y="11" width="108" height="12" rx="6" fill="#fff" fillOpacity=".08" />
          {cover.mode === "chat" && <>
            <rect x="0" y="35" width="142" height="259" fill="#fff" fillOpacity=".035" />
            <text x="19" y="66" fill="#fff" fontSize="12" fontFamily="sans-serif">Knowledge library</text>
            {[88, 122, 156, 190].map((y, i) => <g key={y}><rect x="19" y={y} width="15" height="19" rx="3" fill={cover.accent} fillOpacity={i ? ".25" : ".8"} /><rect x="43" y={y + 3} width={60 + i * 5} height="5" rx="2" fill="#fff" fillOpacity=".3" /><rect x="43" y={y + 12} width="41" height="3" rx="1.5" fill="#fff" fillOpacity=".12" /></g>)}
            <rect x="259" y="56" width="310" height="40" rx="10" fill={cover.accent} fillOpacity=".17" />
            <text x="276" y="81" fill="#fff" fontSize="13" fontFamily="sans-serif">{name === "PulseLoop" ? "Turn this conversation into a next step." : "Find the answer in my documents."}</text>
            <circle cx="176" cy="126" r="13" fill={cover.accent} /><path d="m170 126 4 4 8-8" stroke="#12203b" fill="none" strokeWidth="2" />
            <rect x="200" y="117" width="184" height="7" rx="3" fill="#fff" fillOpacity=".85" />
            {[139, 154, 169].map((y, i) => <rect key={y} x="200" y={y} width={330 - i * 32} height="5" rx="2" fill="#fff" fillOpacity=".24" />)}
            <rect x="200" y="192" width="121" height="24" rx="6" fill={cover.accent} fillOpacity=".12" /><text x="212" y="208" fill={cover.accent} fontSize="10" fontFamily="sans-serif">Grounded in your context</text>
            <rect x="165" y="239" width="405" height="36" rx="9" fill="#fff" fillOpacity=".06" stroke="#fff" strokeOpacity=".13" />
          </>}
          {cover.mode === "pipeline" && <>
            <text x="26" y="69" fill="#fff" fontSize="13" fontFamily="sans-serif">{cover.heading ?? (name === "Real Doodle" ? "From an idea to a published story" : "Every lead, a clear next step")}</text>
            <path d="M66 135H526" stroke={cover.accent} strokeOpacity=".5" strokeWidth="2" strokeDasharray="5 5" />
            {cover.steps?.map((step, i) => <g key={step} transform={`translate(${26 + i * 112} 100)`}><rect width="96" height="76" rx="12" fill="#182339" stroke={cover.accent} strokeOpacity=".55" /><circle cx="48" cy="26" r="12" fill={cover.accent} fillOpacity=".15" /><text x="48" y="30" textAnchor="middle" fill={cover.accent} fontSize="11" fontFamily="sans-serif">0{i + 1}</text><text x="48" y="59" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="sans-serif">{step}</text></g>)}
            <rect x="26" y="204" width="544" height="61" rx="10" fill="#fff" fillOpacity=".045" />
            <circle cx="47" cy="235" r="5" fill="#78e6bc" /><text x="64" y="240" fill="#fff" fontSize="13" fontFamily="sans-serif">{cover.footer ?? (name === "Real Doodle" ? "5 agents · ~290 articles / month" : "Lead scoring · CRM routing · Instant follow-up")}</text>
          </>}
          {cover.mode === "chart" && <>
            {["Reported spend", "Actual conversions", "Reconciled CPA"].map((label, i) => <g key={label}><rect x={24 + i * 187} y="51" width="174" height="58" rx="8" fill="#fff" fillOpacity=".055" /><text x={36 + i * 187} y="74" fill="#fff" fillOpacity=".65" fontSize="11" fontFamily="sans-serif">{label}</text><rect x={36 + i * 187} y="86" width={70 + i * 17} height="8" rx="4" fill={cover.accent} fillOpacity=".65" /></g>)}
            {[137, 172, 207, 242].map(y => <path key={y} d={`M26 ${y}H570`} stroke="#fff" strokeOpacity=".07" />)}
            <path d="M26 237 80 213 140 219 200 169 260 180 320 155 380 167 440 124 500 141 570 114V273H26Z" fill={`url(#${id}-area)`} />
            <path d="M26 237 80 213 140 219 200 169 260 180 320 155 380 167 440 124 500 141 570 114" fill="none" stroke={cover.accent} strokeWidth="3" strokeLinejoin="round" />
            <path d="M26 247 80 238 140 242 200 223 260 231 320 206 380 218 440 192 500 211 570 178" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="2" strokeDasharray="6 6" />
          </>}
          {cover.mode === "movies" && <>
            <text x="26" y="67" fill="#fff" fontSize="13" fontFamily="sans-serif">Discover something you'll love</text>
            {["#7152aa", "#345a8d", "#a56e59", "#3c777e"].map((color, i) => <g key={color}><rect x={26 + i * 141} y="87" width="121" height="164" rx="9" fill={color} /><circle cx={86 + i * 141} cy="147" r="36" fill="#fff" fillOpacity=".12" /><path d={`m${77 + i * 141} 132 24 15-24 15Z`} fill="#fff" fillOpacity=".8" /><rect x={41 + i * 141} y="211" width="70" height="6" rx="3" fill="#fff" fillOpacity=".7" /><rect x={41 + i * 141} y="226" width="43" height="4" rx="2" fill="#fff" fillOpacity=".3" /></g>)}
          </>}
        </g>
      </svg>
    </div>
  );
}
