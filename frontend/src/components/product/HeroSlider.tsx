"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";

type Slide = {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  productSlug?: string;
};

type HeroSliderProps = {
  slides: Slide[];
};

export function HeroSlider({ slides }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const advance = useEffectEvent(() => {
    if (!isPaused) {
      setActiveIndex((current) => (current + 1) % slides.length);
    }
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      advance();
    }, 4000);

    return () => window.clearInterval(timer);
  }, [advance]);

  return (
    <section className="page-container" style={{ paddingTop: "1rem" }}>
      <div
        className="surface-card hero-slider"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
        onTouchEnd={(event) => {
          if (touchStart === null) {
            return;
          }

          const delta = event.changedTouches[0]?.clientX - touchStart;
          if (delta > 40) {
            setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
          } else if (delta < -40) {
            setActiveIndex((current) => (current + 1) % slides.length);
          }
          setTouchStart(null);
        }}
      >
        <div
          className="hero-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="hero-slide">
              {slide.productSlug ? (
                <Link href={`/product/${slide.productSlug}`} className="hero-slide-link">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title ?? "Featured banner"}
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <div className="hero-slide-content">
                    {slide.title ? (
                      <h2
                        className="display-heading"
                        style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
                      >
                        {slide.title}
                      </h2>
                    ) : null}
                    {slide.subtitle ? <p className="muted">{slide.subtitle}</p> : null}
                  </div>
                </Link>
              ) : (
                <>
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title ?? "Featured banner"}
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <div className="hero-slide-content">
                    {slide.title ? (
                      <h2
                        className="display-heading"
                        style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
                      >
                        {slide.title}
                      </h2>
                    ) : null}
                    {slide.subtitle ? <p className="muted">{slide.subtitle}</p> : null}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="slider-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              className={`slider-dot${index === activeIndex ? " active" : ""}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
