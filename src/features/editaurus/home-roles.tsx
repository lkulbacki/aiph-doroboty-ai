import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "@/app/home-roles.css";
import buildArt from "./assets/centaur-build.webp";
import applyArt from "./assets/centaur-apply.webp";
import leadArt from "./assets/centaur-lead.webp";

const roles = [
  {
    slug: "build",
    label: "Build",
    art: buildArt,
    kicker: "Twórz AI",
    title: "Ktoś musi to",
    emphasis: "zbudować.",
    description:
      "Projektujesz, integrujesz i rozwijasz rozwiązania AI — od modelu po narzędzie, które trafia do użytkowników.",
    examples: "AI Engineer · ML Engineer · AI Developer",
    scenario: "Wiedza firmy. Pod ręką.",
    task: "Budujesz asystenta, który przeszukuje dokumentację i podpowiada odpowiedzi zespołowi obsługi. Sprawdzasz jakość odpowiedzi i dbasz o dane.",
  },
  {
    slug: "apply",
    label: "Apply",
    art: applyArt,
    kicker: "Wykorzystuj AI",
    title: "Mniej klikania.",
    emphasis: "Więcej sensu.",
    description:
      "Znasz swój fach i używasz AI, żeby usprawnić codzienną pracę. Możesz automatyzować procesy, analizować dane albo tworzyć treści.",
    examples: "AI Automation Specialist · AI-enabled Marketer",
    scenario: "Dokumenty bez przeklejania.",
    task: "Układasz proces, w którym AI odczytuje dane z dokumentów i przygotowuje wpisy w systemie. Sprawdzasz wyjątki i zatwierdzasz wyniki.",
  },
  {
    slug: "lead",
    label: "Lead",
    art: leadArt,
    kicker: "Prowadź zmianę",
    title: "Od „spróbujmy”",
    emphasis: "do „działa”.",
    description:
      "Wybierasz problem wart rozwiązania, łączysz ludzi i odpowiadasz za wdrożenie AI w zespole lub organizacji.",
    examples: "AI Product Manager · Head of AI · AI Lead",
    scenario: "Pilotaż, który rusza dalej.",
    task: "Wybierasz proces do zmiany, ustalasz mierniki i zasady pracy z danymi. Łączysz biznes z technologią i sprawdzasz, czy wdrożenie daje efekt.",
  },
] as const;

const spatialQuery = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";
const sceneTravel = 2.4;
const sceneLeadIn = 0.2;
const clamp = (value: number, max: number) => Math.min(max, Math.max(0, value));

export function HomeRoles() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const media = window.matchMedia(spatialQuery);
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>(".role-controls button"));
    const progressLine = root.querySelector<HTMLElement>(".roles-progress span");
    const scenes = Array.from(root.querySelectorAll<HTMLElement>(".role-scene")).map((scene) => ({
      scene,
      art: scene.querySelector<HTMLElement>(".role-art")!,
      image: scene.querySelector<HTMLImageElement>("img")!,
      word: scene.querySelector<HTMLElement>(".role-word")!,
      shape: scene.querySelector<HTMLElement>(".role-shape")!,
      copy: scene.querySelector<HTMLElement>(".role-copy")!,
    }));
    let frame: number | undefined;
    let previousIndex = -1;

    function updateActive(index: number) {
      if (index === previousIndex) return;
      previousIndex = index;
      setActive(index);
    }

    function render() {
      frame = undefined;
      if (!root) return;
      if (media.matches) {
        root.dataset.motion = "spatial";
        const travel = root.offsetHeight - window.innerHeight;
        const progress = clamp(-root.getBoundingClientRect().top / travel, 1);
        const position = clamp(progress * sceneTravel - sceneLeadIn, scenes.length - 1);
        const index = Math.round(position);
        updateActive(index);
        if (progressLine) progressLine.style.width = `${progress * 100}%`;

        scenes.forEach(({ scene, art, image, word, shape, copy }, i) => {
          const delta = position - i;
          const distance = Math.abs(delta);
          const visible = distance < 0.8;
          const current = i === index;
          if (!current && scene.contains(document.activeElement)) {
            buttons[index]?.focus({ preventScroll: true });
          }
          scene.inert = !current;
          scene.classList.toggle("is-current", current);
          scene.classList.toggle("is-visible", visible);
          art.style.opacity = String(clamp((0.8 - distance) / 0.5, 1));
          copy.style.visibility = current ? "visible" : "hidden";
          shape.style.visibility = current ? "visible" : "hidden";
          if (visible) {
            image.style.transform = `translate3d(${-delta * 650}px, ${-delta * 100}px, 0) rotate(${delta * 10}deg) scale(${1 - distance * 0.07})`;
            word.style.transform = `translate3d(${delta * 700}px, ${delta * 35}px, 0)`;
            shape.style.transform = `rotate(${-19 + delta * 35}deg) scale(${1 - distance * 0.1})`;
          }
          scene.style.opacity = "1";
        });
      } else {
        if (root.dataset.motion) {
          delete root.dataset.motion;
          scenes.forEach(({ scene, art, image, word, shape, copy }) => {
            scene.classList.remove("is-current", "is-visible");
            scene.inert = false;
            scene.style.removeProperty("opacity");
            art.style.removeProperty("opacity");
            copy.style.removeProperty("visibility");
            shape.style.removeProperty("visibility");
            for (const layer of [image, word, shape]) layer.style.removeProperty("transform");
          });
        }
        const distances = scenes.map(({ scene }) =>
          Math.abs(scene.getBoundingClientRect().top - window.innerHeight * 0.25),
        );
        updateActive(distances.indexOf(Math.min(...distances)));
      }
    }

    function queueRender() {
      if (frame === undefined) frame = requestAnimationFrame(render);
    }

    render();
    media.addEventListener("change", queueRender);
    window.addEventListener("scroll", queueRender, { passive: true });
    window.addEventListener("resize", queueRender);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      media.removeEventListener("change", queueRender);
      window.removeEventListener("scroll", queueRender);
      window.removeEventListener("resize", queueRender);
    };
  }, []);

  function scrollToRole(index: number) {
    const root = section.current;
    if (!root) return;
    if (root.dataset.motion === "spatial") {
      const start = root.getBoundingClientRect().top + window.scrollY;
      const travel = root.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: start + ((index + sceneLeadIn) / sceneTravel) * travel,
        behavior: "smooth",
      });
    } else {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scene = root.querySelectorAll(".role-scene")[index];
      scene?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    }
  }

  return (
    <section
      ref={section}
      className="editaurus-surface home-roles"
      aria-labelledby="home-roles-title"
    >
      <div className="roles-stage">
        <div className="roles-heading">
          <div>
            <p className="eyebrow">Trzy sposoby na pracę z AI</p>
            <h2 id="home-roles-title" tabIndex={-1}>
              Ta sama moc.
              <br /> <em>Różna robota.</em>
            </h2>
          </div>
          <nav className="role-controls" aria-label="Wybierz rodzaj pracy z AI">
            {roles.map((role, index) => (
              <button
                key={role.slug}
                type="button"
                data-role={role.slug}
                aria-pressed={active === index}
                onClick={() => scrollToRole(index)}
              >
                {role.label}
                <span aria-hidden="true">0{index + 1}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="role-scenes">
          {roles.map((role, index) => (
            <article key={role.slug} className={`role-scene scene-${role.slug}`}>
              <div className="role-art" aria-hidden="true">
                <span className="role-word">{role.label}.</span>
                <div className="role-shape" />
                <img src={role.art} width={1122} height={1402} alt="" />
              </div>
              <div className="role-copy">
                <span className="role-kicker">
                  0{index + 1} / {role.label.toUpperCase()} — {role.kicker.toUpperCase()}
                </span>
                <h3>
                  {role.title}
                  <br /> <em>{role.emphasis}</em>
                </h3>
                <p>{role.description}</p>
                <p className="role-examples">{role.examples}</p>
                <div className="case">
                  <span className="case-label">TAK MOŻE WYGLĄDAĆ TA PRACA</span>
                  <h4>{role.scenario}</h4>
                  <p>{role.task}</p>
                  <span className="case-note">Przykładowy scenariusz.</span>
                </div>
                <Link className="text-link dark-link" to={`/oferty?category=${role.slug}`}>
                  Zobacz oferty {role.label}
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="roles-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
