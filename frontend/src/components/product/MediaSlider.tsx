"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { PlayIcon } from "@/components/ui/Icons";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type MediaItem =
  | { kind: "image"; src: string; label: string }
  | { kind: "video"; src: string; label: string };

type MediaSliderProps = {
  items: MediaItem[];
};

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  items,
  startIndex,
  onClose,
}: {
  items: MediaItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const item = items[index];

  const touchStartX = useRef<number | null>(null);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      {/* close button */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          background: "rgba(255,255,255,0.12)",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <CloseIcon />
      </button>

      {/* counter */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.6)",
          fontSize: 13,
          letterSpacing: "0.04em",
          userSelect: "none",
        }}
      >
        {index + 1} / {items.length}
      </div>

      {/* media */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          maxHeight: "80dvh",
          flex: "1 1 auto",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStartX.current = e.touches[0]?.clientX ?? null; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0]?.clientX - touchStartX.current;
          if (delta > 40) prev();
          else if (delta < -40) next();
          touchStartX.current = null;
        }}
      >
        {item.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={item.label}
            style={{
              maxWidth: "100%",
              maxHeight: "75dvh",
              objectFit: "contain",
              display: "block",
              borderRadius: 4,
              touchAction: "pinch-zoom",
            }}
          />
        ) : (
          <iframe
            src={item.src}
            title={item.label}
            allowFullScreen
            style={{
              width: "min(780px, 90vw)",
              aspectRatio: "16/9",
              border: "none",
              borderRadius: 6,
            }}
          />
        )}
      </div>

      {/* prev / next */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={navBtnStyle("left")}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={navBtnStyle("right")}
          >
            ›
          </button>
        </>
      )}

      {/* thumb row inside lightbox */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "12px 16px",
          overflowX: "auto",
          maxWidth: "100vw",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            style={{
              flexShrink: 0,
              width: 52,
              height: 52,
              borderRadius: 4,
              overflow: "hidden",
              border: i === index ? "2px solid #fff" : "2px solid transparent",
              padding: 0,
              background: "rgba(255,255,255,0.08)",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {it.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={it.src}
                alt={it.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#fff" }}>
                <PlayIcon />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function navBtnStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: 8,
    background: "rgba(255,255,255,0.14)",
    border: "none",
    borderRadius: "50%",
    width: 44,
    height: 44,
    fontSize: 28,
    lineHeight: 1,
    color: "#fff",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    userSelect: "none",
  };
}

// ─── Main component ───────────────────────────────────────────────────────────
export function MediaSlider({ items }: MediaSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const activeItem = items[activeIndex];

  // touch swipe on main stage
  const touchStartX = useRef<number | null>(null);

  // keep thumb-strip scroll in sync with activeIndex
  const thumbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = thumbRef.current;
    if (!el) return;
    const btn = el.children[activeIndex] as HTMLElement | undefined;
    btn?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  return (
    <>
      <div className="media-slider" style={{ margin: 0, padding: 0 }}>
        {/* ── Main Stage ── */}
        <div
          className="media-stage"
          style={{
            cursor: "zoom-in",
            // escape any parent horizontal padding to go truly full-bleed
            marginLeft: "calc(-1 * var(--page-padding-x, 0px))",
            marginRight: "calc(-1 * var(--page-padding-x, 0px))",
            borderRadius: 0,
          }}
          onClick={() => setLightboxIndex(activeIndex)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0]?.clientX ?? null; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0]?.clientX - touchStartX.current;
            if (delta > 40) setActiveIndex((c) => (c - 1 + items.length) % items.length);
            else if (delta < -40) setActiveIndex((c) => (c + 1) % items.length);
            touchStartX.current = null;
          }}
        >
          {activeItem.kind === "image" ? (
            <Image
              src={activeItem.src}
              alt={activeItem.label}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          ) : (
            <iframe
              src={activeItem.src}
              title={activeItem.label}
              allowFullScreen
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>

        {/* ── Thumb Strip ── */}
        <div
          ref={thumbRef}
          className="thumb-strip"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 6,
            overflowX: "auto",
            overflowY: "hidden",
            padding: "8px var(--page-padding-x, 12px)",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {items.map((item, index) => (
            <button
              key={`${item.kind}-${index}`}
              type="button"
              className={`thumb-button${index === activeIndex ? " active" : ""}`}
              onClick={() => setActiveIndex(index)}
              style={{
                flexShrink: 0,
                width: 64,
                height: 64,
                borderRadius: 4,
                overflow: "hidden",
                padding: 0,
                border: index === activeIndex
                  ? "2px solid var(--color-accent-primary, #333)"
                  : "2px solid transparent",
                background: "var(--color-surface-secondary, #f0f0f0)",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {item.kind === "image" ? (
                <Image
                  src={item.src}
                  alt={item.label}
                  width={64}
                  height={64}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  unoptimized
                />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    gap: "0.3rem",
                    color: "var(--color-accent-secondary)",
                  }}
                >
                  <PlayIcon />
                  <Badge>Video</Badge>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}