"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { technologyIcon } from "@/lib/technology-icons";

function TechnologyBadge({ name, expanded, activate, deactivate }: {
  name: string;
  expanded: boolean;
  activate: () => void;
  deactivate: () => void;
}) {
  const icon = technologyIcon(name);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelWidth, setLabelWidth] = useState(0);

  function prepareLabel() {
    const label = labelRef.current;
    if (label) setLabelWidth(Math.ceil(label.getBoundingClientRect().width));
  }

  if (!icon) {
    return <span className="technology-text">{name}</span>;
  }

  const isAsset = "src" in icon;
  const monochrome = !isAsset && ["nextdotjs", "jsonwebtokens", "pandas"].includes(icon.slug);
  const colors = {
    "--label-width": `${labelWidth}px`,
    ...(!isAsset && {
      "--brand-color": `#${icon.hex}`,
      "--brand-dark-color": monochrome ? "var(--foreground)" : `#${icon.hex}`,
    }),
  } as CSSProperties;

  return (
    <button
      type="button"
      className="technology-badge"
      aria-label={name}
      aria-expanded={expanded}
      data-expanded={expanded}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") {
          prepareLabel();
          activate();
        }
      }}
      onPointerLeave={(event) => {
        if (!event.currentTarget.matches(":focus-visible")) deactivate();
      }}
      onFocus={(event) => {
        prepareLabel();
        if (event.currentTarget.matches(":focus-visible")) activate();
      }}
      onBlur={deactivate}
      onClick={() => {
        prepareLabel();
        activate();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          deactivate();
        }
      }}
      style={colors}
    >
      {isAsset ? (
        <Image
          src={`/technology-icons/${icon.src}`}
          alt=""
          width={icon.width ?? 22}
          height={22}
          unoptimized
          className={`technology-asset${icon.monochrome ? " technology-asset-monochrome" : ""}`}
          style={{ width: icon.width ?? 22 }}
        />
      ) : (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="technology-logo">
          <path d={icon.path} />
        </svg>
      )}
      <span className="technology-label" aria-hidden="true">
        <span ref={labelRef}>{name}</span>
      </span>
    </button>
  );
}

export function TechnologyList({ items, className = "" }: { items: string[]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<string[][]>([items]);
  const [activeName, setActiveName] = useState<string | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    function arrangeRows() {
      if (!container || disposed) return;
      const available = container.clientWidth;
      if (!available) return;
      const measurements = new Map(Array.from(container.querySelectorAll<HTMLElement>("[data-technology]")).map((element) => {
        const name = element.dataset.technology!;
        const icon = technologyIcon(name);
        const base = icon ? ("src" in icon ? (icon.width ?? 22) : 22) + 22 : element.getBoundingClientRect().width;
        const label = element.querySelector<HTMLElement>(".technology-label > span");
        return [name, { base, extra: label ? Math.ceil(label.getBoundingClientRect().width) : 0 }] as const;
      }));
      const next: string[][] = [];
      let row: string[] = [], used = 0, reserve = 0;
      for (const name of items) {
        const { base, extra } = measurements.get(name) ?? { base: 44, extra: 0 };
        // Leave room for the widest label so hovering never moves its own
        // badge to another row or covers a neighboring icon.
        if (row.length && used + 8 + base + Math.max(reserve, extra) > available) {
          next.push(row);
          row = []; used = 0; reserve = 0;
        }
        used += (row.length ? 8 : 0) + base;
        reserve = Math.max(reserve, extra);
        row.push(name);
      }
      if (row.length) next.push(row);
      setRows(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    }
    arrangeRows();
    const observer = new ResizeObserver(arrangeRows);
    observer.observe(container);
    document.fonts.ready.then(arrangeRows);
    return () => { disposed = true; observer.disconnect(); };
  }, [items]);

  return (
    <div ref={containerRef} className={`min-w-0 space-y-2 ${className}`}>
      {rows.map((row) => (
        <ul key={row.join("|")} className="flex min-w-0 flex-wrap items-center gap-2">
          {row.map((name) => (
            <li key={name} data-technology={name} className="technology-slot">
              <TechnologyBadge name={name} expanded={activeName === name}
                activate={() => setActiveName(name)}
                deactivate={() => setActiveName(current => current === name ? null : current)} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
