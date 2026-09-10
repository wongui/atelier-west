"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { withBasePath } from "@/lib/basePath";

/**
 * Re-triggers every time the card scrolls into/out of view (not once-only)
 * so you can scroll up and down to compare candidates side by side — the
 * real site would fire this once per element instead.
 */
function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold,
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function Spacer() {
  return <div className="h-[70vh] flex items-center justify-center font-mono text-xs text-text-on-light/30">scroll ↓</div>;
}

function Card({ letter, title, description, children }: { letter: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="border border-black/10 rounded-lg p-10 md:p-14">
      <div className="font-mono text-xs text-text-on-light/50 mb-1">{letter}</div>
      <div className="font-body text-sm mb-1">{title}</div>
      <p className="font-body text-xs text-text-on-light/70 max-w-(--max-width-content) mb-10">{description}</p>
      {children}
    </div>
  );
}

const sampleImage = withBasePath("/images/fold-3.jpg");

/** A — Fade + rise: the classic scroll-reveal, translating up into place while fading in. */
function FadeRiseDemo() {
  const text = useReveal<HTMLDivElement>();
  const image = useReveal<HTMLDivElement>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        ref={text.ref}
        className={`transition-all duration-700 ease-out ${text.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h3 className="font-display text-h2 mb-3">Built to Build</h3>
        <p className="font-body text-body text-text-on-light/80">
          Six labs for rapid prototyping, industrial design, mechanical and
          electrical engineering, metrology, and new product introduction.
        </p>
      </div>
      <div
        ref={image.ref}
        className={`transition-all duration-700 ease-out delay-100 ${image.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <img src={sampleImage} alt="" className="w-full aspect-[4/3] object-cover rounded" />
      </div>
    </div>
  );
}

/** B — Soft blur-in: fades in while sharpening from a soft blur, feels calmer/more editorial. */
function BlurInDemo() {
  const text = useReveal<HTMLDivElement>();
  const image = useReveal<HTMLDivElement>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        ref={text.ref}
        className={`transition-all duration-700 ease-out ${text.isVisible ? "opacity-100 blur-none" : "opacity-0 blur-md"}`}
      >
        <h3 className="font-display text-h2 mb-3">Hands-On Experts</h3>
        <p className="font-body text-body text-text-on-light/80">
          Structured working sessions with frog, Synapse, and Capgemini
          Experience Engineering experts, across strategy and hardware.
        </p>
      </div>
      <div
        ref={image.ref}
        className={`transition-all duration-700 ease-out delay-100 ${image.isVisible ? "opacity-100 blur-none" : "opacity-0 blur-md"}`}
      >
        <img src={sampleImage} alt="" className="w-full aspect-[4/3] object-cover rounded" />
      </div>
    </div>
  );
}

/** C — Mask wipe: an opaque panel slides off to reveal the content underneath, like a curtain. */
function MaskWipeDemo() {
  const text = useReveal<HTMLDivElement>();
  const image = useReveal<HTMLDivElement>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div ref={text.ref} className="relative overflow-hidden">
        <h3 className="font-display text-h2 mb-3">A Straight Line to Enterprise</h3>
        <p className="font-body text-body text-text-on-light/80">
          We work with 85% of the 200 largest public companies on the Forbes
          Global 2000 list, bringing real world applications for what you build.
        </p>
        <span
          aria-hidden
          className={`absolute inset-0 bg-surface-dark transition-transform duration-700 ease-out origin-left ${
            text.isVisible ? "scale-x-0" : "scale-x-100"
          }`}
        />
      </div>
      <div ref={image.ref} className="relative overflow-hidden rounded">
        <img src={sampleImage} alt="" className="w-full aspect-[4/3] object-cover" />
        <span
          aria-hidden
          className={`absolute inset-0 bg-surface-dark transition-transform duration-700 ease-out delay-100 origin-left ${
            image.isVisible ? "scale-x-0" : "scale-x-100"
          }`}
        />
      </div>
    </div>
  );
}

/** D — Blur + rise: combines B's soft blur-in with A's upward translate. */
function BlurRiseDemo() {
  const text = useReveal<HTMLDivElement>();
  const image = useReveal<HTMLDivElement>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        ref={text.ref}
        className={`transition-all duration-700 ease-out ${
          text.isVisible ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-md translate-y-6"
        }`}
      >
        <h3 className="font-display text-h2 mb-3">Where AI Takes Shape</h3>
        <p className="font-body text-body text-text-on-light/80">
          A 12-week, cash- and equity-free, cohort-based residency for
          Physical AI startups with lab access and enterprise partners.
        </p>
      </div>
      <div
        ref={image.ref}
        className={`transition-all duration-700 ease-out delay-100 ${
          image.isVisible ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-md translate-y-6"
        }`}
      >
        <img src={sampleImage} alt="" className="w-full aspect-[4/3] object-cover rounded" />
      </div>
    </div>
  );
}

export default function RevealLabPage() {
  return (
    <div className="mx-(--spacing-page) max-w-5xl md:mx-auto py-16">
      <h1 className="font-display text-h2 mb-2">Scroll reveal — candidates</h1>
      <p className="font-body text-body text-text-on-light/70 mb-8 max-w-(--max-width-content)">
        Scroll down slowly past each card. Tell me the letter (or a mix) and
        I&apos;ll wire it into the real folds across the site.
      </p>

      <Card letter="A" title="Fade + rise" description="Fades in while translating up ~24px into place. Classic, unobtrusive scroll reveal.">
        <FadeRiseDemo />
      </Card>
      <Spacer />
      <Card letter="B" title="Soft blur-in" description="Fades in while sharpening from a soft blur. Calmer, more editorial than a hard fade.">
        <BlurInDemo />
      </Card>
      <Spacer />
      <Card letter="C" title="Mask wipe" description="A solid panel slides off to reveal the content underneath, like a curtain opening.">
        <MaskWipeDemo />
      </Card>
      <Spacer />
      <Card letter="D" title="Blur + rise" description="Combines B and A: fades in while sharpening from a blur AND translating up ~24px.">
        <BlurRiseDemo />
      </Card>
      <div className="h-[40vh]" />
    </div>
  );
}
