"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ArrowUpRight } from "lucide-react";
import { findAnswer, QUICK_QUESTIONS, GREETING, type ChatAnswer } from "@/lib/chat-engine";
import { site } from "@/lib/data";
import { ProfilePhoto } from "./profile-photo";

type Message =
  | { role: "user"; id: string; text: string }
  | { role: "bot"; id: string; answer: ChatAnswer };

let seq = 0;
const nextId = () => `m${++seq}`;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", id: nextId(), answer: GREETING },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  const asked = messages.some((m) => m.role === "user");

  // Keep the transcript pinned to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [messages, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Don't leave timers running after unmount.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const send = useCallback((raw: string) => {
    const text = raw.trim();
    if (!text || text.length > 400) return;

    setMessages((prev) => [...prev, { role: "user", id: nextId(), text }]);
    setInput("");
    setTyping(true);

    // Answering is instant; the small delay is purely so it reads as a reply
    // rather than the text appearing in the same frame as the question.
    const t = window.setTimeout(() => {
      const answer = findAnswer(text);
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", id: nextId(), answer }]);
    }, 420);
    timers.current.push(t);
  }, []);

  /** Same-site navigation, except files like the resume PDF. */
  function isInternal(href: string) {
    if (href.startsWith("#")) return true;
    return href.startsWith("/") && !/\.[a-z0-9]{2,4}$/i.test(href);
  }

  function onLinkClick(href: string) {
    if (!isInternal(href)) return;
    setOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        ref={launcherRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat" : "Chat with Parth's assistant"}
        className="border-border bg-card text-foreground hover:bg-accent fixed right-4 bottom-4 z-[60] flex size-12 cursor-pointer items-center justify-center rounded-full border shadow-lg transition-colors sm:right-6 sm:bottom-6"
      >
        {open ? (
          <X className="size-5" strokeWidth={1.75} />
        ) : (
          <MessageCircle className="size-5" strokeWidth={1.75} />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          id="chat-panel"
          ref={panelRef}
          role="dialog"
          aria-label="Portfolio assistant"
          className="border-border bg-background fixed right-4 bottom-20 z-[60] flex w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:right-6 sm:bottom-22"
          style={{ height: "min(70vh, 520px)" }}
        >
          {/* Header */}
          <div className="border-border flex items-center gap-3 border-b px-4 py-3">
            <ProfilePhoto size={36} decorative className="border" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {site.name}&apos;s Portfolio Assistant
              </p>
              <p className="text-secondary-fg flex items-center gap-1.5 text-xs">
                <span className="inline-flex size-1.5 rounded-full bg-emerald-500" />
                Answers from this site only
              </p>
            </div>
          </div>

          {/* Transcript */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="bg-accent max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-sm">
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start">
                  <div className="border-border bg-card/60 max-w-[90%] rounded-2xl rounded-bl-sm border px-3 py-2">
                    <p className="text-sm leading-relaxed">{m.answer.text}</p>

                    {m.answer.bullets && (
                      <ul className="mt-2 space-y-1.5">
                        {m.answer.bullets.map((b) => (
                          <li
                            key={b}
                            className="text-secondary-fg flex gap-2 text-[13px] leading-relaxed"
                          >
                            <span
                              className="bg-secondary-fg mt-[7px] size-1 shrink-0 rounded-full"
                              aria-hidden="true"
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {m.answer.links && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {m.answer.links.map((l) => (
                          <a
                            key={l.href + l.label}
                            href={l.href}
                            onClick={() => onLinkClick(l.href)}
                            target={isInternal(l.href) ? undefined : "_blank"}
                            rel={isInternal(l.href) ? undefined : "noopener noreferrer"}
                            className="border-border text-secondary-fg hover:text-foreground hover:border-foreground/25 inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors"
                          >
                            {l.label}
                            <ArrowUpRight className="size-3" strokeWidth={2} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {typing && (
              <div className="flex justify-start" aria-label="Typing">
                <div className="border-border bg-card/60 flex gap-1 rounded-2xl rounded-bl-sm border px-3 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="bg-secondary-fg size-1.5 animate-bounce rounded-full"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {!asked && (
              <div className="pt-1">
                <p className="text-secondary-fg mb-2 text-xs">Quick questions:</p>
                <div className="flex flex-col items-start gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="border-border hover:bg-accent hover:border-foreground/25 cursor-pointer rounded-lg border px-2.5 py-1.5 text-left text-[13px] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-border flex items-center gap-2 border-t px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={400}
              placeholder="Ask about my work and experience…"
              aria-label="Ask a question"
              className="text-foreground placeholder:text-secondary-fg min-w-0 flex-1 rounded-sm bg-transparent text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signature"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="border-border bg-card hover:bg-accent flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="size-3.5" strokeWidth={1.75} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
