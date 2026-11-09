"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronDown, Loader2 } from "lucide-react";
import { site } from "@/lib/data";

export const topics = ["A project", "A job opportunity", "Something else"] as const;
type Topic = (typeof topics)[number];

type Status = { kind: "idle" | "sending" | "sent" | "mailto" } | { kind: "error"; message: string };

const field =
  "border-border bg-card/60 placeholder:text-secondary-fg/70 focus:border-foreground/40 w-full rounded-lg border px-3 text-[15px] outline-none transition-colors";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [topic, setTopic] = useState<Topic>(topics[0]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Links like "Let's talk about your project" carry data-contact-topic: pick that
  // topic and move focus into the form once the page has scrolled to it.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[data-contact-topic]");
      if (!link) return;
      const wanted = link.dataset.contactTopic as Topic;
      if (topics.includes(wanted)) setTopic(wanted);
      setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 600);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `Portfolio: ${topic} from ${name}`;

    const openMailApp = () => {
      const body = `${message}\n\n${name}\n${email}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: "mailto" });
    };

    setStatus({ kind: "sending" });
    try {
      // Delivered by app/api/contact (Resend). The API key never reaches the browser.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message, botcheck: data.get("botcheck") ? "1" : "" }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      // No email service configured yet (or no server, e.g. static hosting): use the email app.
      if (json.error === "not_configured" || res.status === 404 || res.status === 405) return openMailApp();
      if (!res.ok || !json.ok) throw new Error(json.error || "The message could not be sent.");
      setStatus({ kind: "sent" });
      formRef.current?.reset();
      setTopic(topics[0]);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "The message could not be sent." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="border-border bg-card/60 fade-in-up mt-6 rounded-xl border p-6 text-center">
        <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-3 font-semibold">Message sent. Thank you!</p>
        <p className="text-secondary-fg mt-1 text-sm">I&apos;ll reply to your email soon.</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="text-secondary-fg hover:text-foreground mt-4 min-h-11 text-sm underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form
      ref={formRef}
      id="contact-form"
      onSubmit={onSubmit}
      className="border-border bg-card/40 mt-6 scroll-mt-28 space-y-4 rounded-xl border p-5 sm:p-6"
      aria-describedby="contact-form-status"
    >
      <div>
        <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-medium">What would you like to talk about?</label>
        <div className="relative">
          <select
            id="contact-topic"
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value as Topic)}
            className={`${field} h-11 cursor-pointer appearance-none pr-10`}
          >
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown className="text-secondary-fg pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" aria-hidden="true" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">Name</label>
          <input ref={nameRef} id="contact-name" name="name" required autoComplete="name" maxLength={100} placeholder="Your name" className={`${field} h-11`} />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" maxLength={200} placeholder="you@company.com" className={`${field} h-11`} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={5000}
          placeholder={topic === "A project" ? "What are you building, and where could AI help?" : "How can I help?"}
          className={`${field} resize-y py-2.5 leading-relaxed`}
        />
      </div>

      {/* Honeypot: hidden from people, often filled in by bots. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-form-status" role="status" className={`text-sm ${status.kind === "error" ? "text-red-600 dark:text-red-400" : "text-secondary-fg"}`}>
          {status.kind === "error" && `${status.message} You can also email me at ${site.email}.`}
          {status.kind === "mailto" && "Your email app should open with the message filled in. Just press send."}
        </p>
        <button
          type="submit"
          disabled={sending}
          className="bg-foreground text-background inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {sending ? "Sending…" : "Send message"}
          {!sending && <ArrowRight className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}
