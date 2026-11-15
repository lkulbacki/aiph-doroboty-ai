import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  Menu,
  ArrowUpRight,
  LogOut,
  X,
  BriefcaseBusiness,
  UserRound,
  Bookmark,
  FileText,
  Users,
  Building2,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import landingLogoOutline from "@/features/editaurus/assets/logo-poziome-kontur.svg";
import landingLogo from "@/features/editaurus/assets/logo-poziome-na-zielonym.svg";
import { BrandMark } from "@/features/public/brand-mark";
import { Button, buttonVariants } from "@/components/ui/button";
import { currentPerson } from "./model";
import { usePrototype } from "./store";
import { cn } from "@/lib/utils";
const navigation = [
  { to: "/oferty", label: "Oferty" },
  { to: "/metodologia", label: "Metodologia" },
  { to: "/auth/sign-in?audience=employer&next=/app/oferty", label: "Dla firm" },
];

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="prototype-notice">
      {children}
    </div>
  );
}
export function PageTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="page-heading">
      <h1>{children}</h1>
      {action}
    </div>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return <div className="prototype-panel">{children}</div>;
}
export function NotFound() {
  return (
    <section className="prototype-section">
      <h1>Nie znaleziono strony</h1>
      <p className="my-5">Ten adres nie prowadzi do dostępnej oferty lub aplikacji.</p>
      <Link className={buttonVariants()} to="/oferty">
        Wróć do ofert
      </Link>
    </section>
  );
}
const candidateNav = [
  ["/app", "Przegląd", LayoutDashboard],
  ["/app/profil", "Profil", UserRound],
  ["/app/zapisane", "Zapisane oferty", Bookmark],
  ["/app/aplikacje", "Moje aplikacje", FileText],
] as const;
const employerNav = [
  ["/app", "Przegląd", LayoutDashboard],
  ["/app/oferty", "Moje oferty", BriefcaseBusiness],
  ["/app/kandydaci", "Kandydaci", Users],
  ["/app/organizacja", "Organizacja", Building2],
] as const;
export function Shell() {
  const { state, issue, error, clearError } = usePrototype();
  const person = currentPerson(state);
  const { pathname } = useLocation();
  const editorialMarketplace =
    pathname === "/oferty" || pathname.startsWith("/oferty/") || pathname.startsWith("/firmy/");
  const workspace = pathname.startsWith("/app") && person;
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const main = useRef<HTMLElement>(null);
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      clearError();
      main.current?.focus();
      window.scrollTo(0, 0);
      lastPath.current = pathname;
    }
  }, [pathname, clearError]);
  const nav =
    person?.role === "employer"
      ? employerNav
      : person?.role === "operator"
        ? [["/app/case", "Materiały case study", FileText] as const]
        : candidateNav;
  const content = (
    <>
      <>
        {issue && (
          <Notice>
            {issue}{" "}
            <Link className="underline" to="/app/settings">
              Ustawienia danych
            </Link>
          </Notice>
        )}
      </>
      {error && (
        <p className="prototype-error" role="alert">
          {error}
        </p>
      )}
      <div key={`${state.activePersonId}:${pathname}`}>
        <Outlet />
      </div>
    </>
  );
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Przejdź do treści
      </a>
      {workspace ? (
        <div className="app-frame">
          <div className="mobile-header">
            <Link to="/" className="brand">
              <BrandMark />
              DoRoboty.ai
            </Link>
            <Button
              aria-label={menuAt === pathname ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={menuAt === pathname}
              aria-controls="workspace-nav"
              variant="ghost"
              size="icon"
              onClick={() => setMenuAt(menuAt === pathname ? null : pathname)}
            >
              {menuAt === pathname ? <X /> : <Menu />}
            </Button>
          </div>
          <aside
            className={`sidebar ${menuAt === pathname ? "sidebar-open" : ""}`}
            onKeyDown={(e) => {
              if (e.key === "Escape") setMenuAt(null);
            }}
          >
            <Link className="brand" to="/">
              <BrandMark />
              DoRoboty.ai
            </Link>
            <div className="workspace-label">
              <span className="workspace-avatar">{person.name[0]}</span>
              <div>
                <strong>{person.name}</strong>
                <span>{person.headline}</span>
              </div>
            </div>
            <nav id="workspace-nav" aria-label="Panel użytkownika">
              {nav.map(([to, label, Icon]) => (
                <NavLink
                  end={to === "/app"}
                  key={to}
                  to={to}
                  onClick={() => setMenuAt(null)}
                  className={({ isActive }) => `nav-link ${isActive ? "nav-active" : ""}`}
                >
                  <Icon className="size-4" />
                  {label}
                </NavLink>
              ))}
              <NavLink
                to="/app/settings"
                onClick={() => setMenuAt(null)}
                className={({ isActive }) => `nav-link ${isActive ? "nav-active" : ""}`}
              >
                <Settings className="size-4" />
                Ustawienia
              </NavLink>
              <Link className="nav-link" to="/oferty">
                Wszystkie oferty
              </Link>
              <Link className="nav-link" to="/auth/sign-in">
                Zmień osobę
              </Link>
            </nav>
          </aside>
          <div className="workspace">
            <div className="topbar">
              <span>
                {person.role === "candidate"
                  ? "Strefa kandydata"
                  : person.role === "employer"
                    ? "Strefa pracodawcy"
                    : "Case study"}
              </span>
              <Link to="/auth/sign-in">{person.name}</Link>
            </div>
            <main id="main" ref={main} tabIndex={-1} className="main-content outline-none">
              {content}
            </main>
          </div>
        </div>
      ) : (
        <>
          <header
            className={
              pathname === "/"
                ? "candidate-home-header editaurus-surface"
                : editorialMarketplace
                  ? "editorial-listing-header editaurus-surface"
                  : "bg-background/95 shadow-[var(--gui-divider-bottom-shadow)] backdrop-blur supports-[backdrop-filter]:bg-background/80"
            }
          >
            <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between gap-4 px-5 lg:px-8">
              <Link
                className="flex items-center gap-2.5 text-base font-semibold tracking-[var(--gui-tracking-s)]"
                to="/"
                aria-label="DoRoboty.ai — strona główna"
              >
                {pathname === "/" ? (
                  <span className="candidate-home-logo" aria-hidden="true">
                    <img src={landingLogo} alt="" width={935} height={318} />
                    <img
                      className="candidate-home-logo-outline"
                      src={landingLogoOutline}
                      alt=""
                      width={935}
                      height={318}
                    />
                  </span>
                ) : editorialMarketplace ? (
                  <span className="editorial-listing-logo" aria-hidden="true" />
                ) : (
                  <>
                    <BrandMark />
                    <span>DoRoboty.ai</span>
                  </>
                )}
              </Link>
              <nav aria-label="Główna nawigacja" className="flex items-center gap-2 sm:gap-5">
                {navigation.map((item) => (
                  <Link
                    key={item.to}
                    className={cn(
                      "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                      pathname === "/" && item.label === "Dla firm"
                        ? "whitespace-nowrap"
                        : "hidden md:inline",
                    )}
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                ))}
                {person ? (
                  <div className="flex items-center gap-[var(--gui-space-xs)] sm:gap-[var(--gui-space-m)]">
                    {person.role === "candidate" && (
                      <>
                        <Link
                          className="hidden text-sm font-medium text-muted-foreground md:inline"
                          to="/app/aplikacje"
                        >
                          Aplikacje
                        </Link>
                        <Link
                          className="hidden text-sm font-medium text-muted-foreground md:inline"
                          to="/app/profil"
                        >
                          Profil
                        </Link>
                      </>
                    )}
                    <Link
                      data-home-control="ghost"
                      to="/app"
                      className={cn(
                        buttonVariants({
                          variant: pathname === "/" ? "ghost" : "outline",
                          size: "lg",
                        }),
                        "text-sm font-medium max-sm:min-h-10 max-sm:px-[var(--gui-space-xs)] max-sm:text-sm",
                      )}
                    >
                      Moje konto
                    </Link>
                    <Link
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "hidden md:inline-flex",
                      )}
                      to="/auth/sign-in"
                      data-home-control="ghost"
                      aria-label="Zmień osobę"
                      title="Zmień osobę"
                    >
                      <LogOut aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      data-home-control
                      to="/auth/sign-in?audience=candidate"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "text-sm font-medium max-sm:min-h-10 max-sm:px-[var(--gui-space-xs)] max-sm:text-sm",
                      )}
                    >
                      Wybierz osobę
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </header>
          <main id="main" ref={main} tabIndex={-1} className="outline-none">
            {content}
          </main>
        </>
      )}
      <footer className="editaurus-surface editaurus-site-footer">
        <div className="editaurus-site-footer-inner">
          <div>
            <p className="editaurus-site-footer-brand">DoRoboty.ai</p>
            <p className="editaurus-site-footer-description">
              Praca dla ludzi, którzy potrafią z AI zbudować coś wartościowego — nie tylko wpisać je
              do CV.
            </p>
          </div>
          <nav aria-label="Stopka">
            <Link to="/oferty">Oferty</Link>
            <Link to="/metodologia">Metodologia</Link>
            <Link to="/polityka-prywatnosci">Prywatność</Link>
            <Link to="/auth/sign-in">
              Strefa case <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </nav>
          <p className="editaurus-site-footer-credit">
            © {new Date().getFullYear()} DoRoboty.ai — od Superhero.tech
          </p>
        </div>
      </footer>
    </div>
  );
}
