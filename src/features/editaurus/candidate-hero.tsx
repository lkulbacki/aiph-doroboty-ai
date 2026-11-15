import { useEffect, useRef } from "react";
import { HeroLink } from "@/components/editaurus/hero-button";
import centaur from "./assets/centaur-hero.webp";

export function CandidateHero() {
  const section = useRef<HTMLElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const disc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = section.current;
    const centaurImage = image.current;
    const pinkDisc = disc.current;
    if (!hero || !centaurImage || !pinkDisc) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;

    const queueUpdate = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        const { top, bottom, height } = hero.getBoundingClientRect();
        if (reduced.matches) {
          centaurImage.style.removeProperty("transform");
          pinkDisc.style.removeProperty("transform");
        } else if (bottom > 0 && height > 0) {
          const progress = Math.max(0, Math.min(1, -top / height));
          centaurImage.style.transform = `translateY(${-progress * 110}px) rotate(${-7 + progress * 7}deg)`;
          pinkDisc.style.transform = `translateY(${progress * 35}px) rotate(${-13 + progress * 18}deg)`;
        }
      });
    };

    queueUpdate();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    reduced.addEventListener("change", queueUpdate);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      reduced.removeEventListener("change", queueUpdate);
    };
  }, []);

  function showRoles() {
    const heading = document.getElementById("home-roles-title");
    heading?.focus({ preventScroll: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    heading
      ?.closest("section")
      ?.scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth" });
  }

  return (
    <section
      ref={section}
      className="editaurus-surface candidate-hero"
      aria-labelledby="hero-title"
    >
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="tiny-star" aria-hidden="true">
            ✳
          </span>{" "}
          NOWA PRACA. NOWE MOŻLIWOŚCI.
        </p>
        <h1 id="hero-title">
          AI samo się
          <br />
          <em>nie zatrudni.</em>
        </h1>
        <p className="hero-description">
          Znajdź pracę, w której budujesz AI, wdrażasz je w codzienną pracę lub prowadzisz zmianę.
        </p>
        <div className="hero-actions">
          <HeroLink to="/oferty" palette="blue-pink">
            Zobacz oferty
          </HeroLink>
          <button className="text-link" type="button" onClick={showRoles}>
            <span>Kogo szukamy</span>{" "}
          </button>
        </div>
        <p className="hero-small">Przeglądanie ofert i aplikowanie są bezpłatne.</p>
      </div>
      <div className="hero-art">
        <div className="hero-disc" ref={disc} aria-hidden="true">
          <span className="disc-word">
            HUMAN
            <br />+ AI
          </span>
        </div>
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />
        <img
          className="hero-centaur"
          ref={image}
          src={centaur}
          width={1122}
          height={1402}
          alt="Klasyczny centaur sięgający po gwiazdę"
          fetchPriority="high"
        />
        <div className="hero-note note-human">
          człowiek u steru
          <svg viewBox="0 0 130 70" aria-hidden="true">
            <path d="M5 8 Q105 0 116 58 M103 47 L116 60 L123 40" />
          </svg>
        </div>
        <div className="hero-note note-ai">
          AI do ciężkiej roboty
          <svg viewBox="0 0 100 50" aria-hidden="true">
            <path d="M92 42 Q32 48 13 9 M8 27 L12 7 L30 13" />
          </svg>
        </div>
        <span className="art-caption">LUDZKA GŁOWA. NOWA MOC.</span>
      </div>
      <div className="hero-bottom">
        <span>Praca z AI ma wiele twarzy.</span>
        <button type="button" onClick={showRoles}>
          Poznaj trzy z nich <span aria-hidden="true">↓</span>
        </button>
        <span className="hero-coordinate" aria-hidden="true">
          BUILD · APPLY · LEAD
        </span>
      </div>
    </section>
  );
}
