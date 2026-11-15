import { useRef, type ComponentProps, type PointerEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const shadowPairs = [
  ["#f1f36a", "#a9dcc6"],
  ["#f1f36a", "#f282b7"],
  ["#a9dcc6", "#f1f36a"],
  ["#a9dcc6", "#f282b7"],
  ["#f282b7", "#f1f36a"],
  ["#f282b7", "#a9dcc6"],
] as const;

const bluePinkPairs = [
  ["#a8c7fa", "#f282b7"],
  ["#f282b7", "#a8c7fa"],
] as const;

function useHeroShadow(pairs: readonly (readonly [string, string])[] = shadowPairs) {
  const previousPair = useRef(0);

  return (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch") {
      const next = Math.floor(Math.random() * (pairs.length - 1));
      const index = next >= previousPair.current ? next + 1 : next;
      previousPair.current = index;
      const [first, last] = pairs[index];
      event.currentTarget.style.setProperty("--ed-shadow-first", first);
      event.currentTarget.style.setProperty("--ed-shadow-last", last);
    }
  };
}

type HeroButtonProps = ComponentProps<typeof Button>;

export function HeroButton({ className, onPointerEnter, ...props }: HeroButtonProps) {
  const changeShadowPair = useHeroShadow();
  return (
    <Button
      {...props}
      className={cn("editaurus-hero-button", className)}
      onPointerEnter={(event) => {
        changeShadowPair(event);
        onPointerEnter?.(event);
      }}
    />
  );
}

export function HeroLink({
  className,
  onPointerEnter,
  palette,
  ...props
}: ComponentProps<typeof Link> & { palette?: "blue-pink" }) {
  const changeShadowPair = useHeroShadow(palette === "blue-pink" ? bluePinkPairs : undefined);
  return (
    <Link
      {...props}
      className={buttonVariants({ className: cn("editaurus-hero-button", className) })}
      onPointerEnter={(event) => {
        changeShadowPair(event);
        onPointerEnter?.(event);
      }}
    />
  );
}
