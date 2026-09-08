import { DuotoneImage } from "@/components/DuotoneImage";
import { Button } from "@/components/Button";
import { TextLink } from "@/components/TextLink";
import { Footer } from "@/components/Footer";
import { NavBarDemo } from "./NavBarDemo";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { Divider } from "@/components/Divider";
import { StepProgress } from "@/components/StepProgress";
import { PartnerLogoStrip } from "@/components/PartnerLogoStrip";

const surfaces = [
  { name: "surface-light", className: "bg-surface-light", textClassName: "text-text-on-light" },
  { name: "surface-dark", className: "bg-surface-dark", textClassName: "text-text-on-dark" },
  { name: "surface-accent", className: "bg-surface-accent", textClassName: "text-text-on-dark" },
] as const;

const accents = [
  { name: "accent-cta", className: "bg-accent-cta" },
  { name: "accent-cta-alt", className: "bg-accent-cta-alt" },
  { name: "wash-warm", className: "bg-wash-warm" },
  { name: "wash-cool", className: "bg-wash-cool" },
  { name: "overlay-tint", className: "bg-overlay-tint" },
] as const;

const typeRamp = [
  { name: "display-hero", className: "font-display text-hero", token: "--text-hero (110px)", sample: "Where AI takes shape" },
  { name: "display-h1", className: "font-display text-h1", token: "--text-h1 (70px)", sample: "Built to Build" },
  { name: "display-h2", className: "font-display text-h2", token: "--text-h2 (~60px)", sample: "Shape the future of Physical AI" },
  { name: "body", className: "font-body text-body", token: "--text-body (18px)", sample: "A 12-week, cash- and equity-free, cohort-based residency." },
  { name: "ui-label", className: "font-body text-ui uppercase tracking-wide", token: "--text-ui (14px)", sample: "Apply now" },
  { name: "wordmark", className: "font-display text-wordmark tracking-wordmark uppercase", token: "--text-wordmark + --tracking-wordmark", sample: "Atelier West" },
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-black/10 py-16 first:pt-0 last:border-b-0">
      <h2 className="font-body text-ui uppercase tracking-wide text-text-on-light/60 mb-8">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SystemPage() {
  return (
    <div className="mx-(--spacing-page) max-w-5xl md:mx-auto py-16">
      <h1 className="font-display text-h2 mb-2">Atelier West — Design System</h1>
      <p className="font-body text-body text-text-on-light/70 mb-4">
        Live tokens, not a mockup — every swatch and text style below is the
        real semantic token from{" "}
        <code className="font-mono text-[0.85em]">globals.css</code>.
      </p>

      <Section title="Color — surfaces">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {surfaces.map((s) => (
            <div key={s.name} className={`${s.className} ${s.textClassName} rounded-lg p-6 h-32 flex flex-col justify-between`}>
              <span className="font-mono text-xs opacity-70">{s.name}</span>
              <span className="font-body text-body">Text on light</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Color — accents & washes">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {accents.map((a) => (
            <div key={a.name} className="flex flex-col gap-2">
              <div className={`${a.className} h-20 rounded-lg`} />
              <span className="font-mono text-xs text-text-on-light/70">{a.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type ramp">
        <div className="flex flex-col gap-8">
          {typeRamp.map((t) => (
            <div key={t.name} className="flex flex-col gap-1">
              <span className="font-mono text-xs text-text-on-light/50">
                {t.name} — {t.token}
              </span>
              <span className={t.className}>{t.sample}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shape">
        <div className="flex items-center gap-4">
          <div className="rounded-(--radius-pill) bg-accent-cta text-text-on-dark font-body text-ui uppercase px-6 py-3">
            radius-pill
          </div>
        </div>
      </Section>

      <Section title="Imagery — organic mask + duotone wash">
        <p className="font-body text-body text-text-on-light/70 mb-6 max-w-(--max-width-content)">
          Placeholder art only — no real photography has been supplied yet.
          The mask shapes are a CSS approximation of the Fold2/Footer blob
          crops until real SVG mask paths are exported from Figma.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <DuotoneImage
              src="/placeholder-photo.svg"
              alt=""
              wash="warm"
              shape="blob-a"
              className="h-64"
            />
            <span className="font-mono text-xs text-text-on-light/70">
              wash=&quot;warm&quot; shape=&quot;blob-a&quot;
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <DuotoneImage
              src="/placeholder-photo.svg"
              alt=""
              wash="cool"
              shape="blob-b"
              className="h-64"
            />
            <span className="font-mono text-xs text-text-on-light/70">
              wash=&quot;cool&quot; shape=&quot;blob-b&quot;
            </span>
          </div>
        </div>
      </Section>

      <Section title="Layout">
        <div className="flex flex-col gap-8 font-mono text-xs text-text-on-light/70">
          <div>
            <span className="block mb-1">--spacing-page (24px horizontal page padding = grid margin)</span>
            <div className="bg-surface-dark/10 h-6 px-(--spacing-page)">
              <div className="bg-accent-cta h-full w-full" />
            </div>
          </div>
          <div>
            <span className="block mb-1">--max-width-content (614px text column)</span>
            <div className="max-w-(--max-width-content) bg-accent-cta-alt h-6" />
          </div>
          <div>
            <span className="block mb-1">
              8-column grid, 24px margin, 24px gutter (gap-6) — confirmed from Figma
            </span>
            <div className="px-(--spacing-page)">
              <div className="grid grid-cols-8 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-accent-cta-alt/20 h-12" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Actions — Button">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-start gap-2">
            <Button variant="cta">Apply now</Button>
            <span className="font-mono text-xs text-text-on-light/70">variant=&quot;cta&quot; — accent-cta</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button variant="nav">Apply now</Button>
            <span className="font-mono text-xs text-text-on-light/70">variant=&quot;nav&quot; — accent-cta-alt</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button variant="cta" size="lg">Apply now</Button>
            <span className="font-mono text-xs text-text-on-light/70">size=&quot;lg&quot; — larger padding variant</span>
          </div>
        </div>
      </Section>

      <Section title="Actions — Text Link">
        <div className="flex flex-col gap-4 items-start">
          <TextLink href="#">Learn more about our commitment to Physical AI</TextLink>
          <TextLink href="#">Named a Market Shaper in Physical AI by Gartner</TextLink>
        </div>
      </Section>

      <Section title="Navigation — Nav Bar">
        <p className="font-body text-body text-text-on-light/70 mb-6 max-w-(--max-width-content)">
          Real component, real scroll listener — not a screenshot of two
          states. Note: the compact nav wordmark (25.4px, 10.16px tracking)
          is a genuinely different size from the hero/footer lockup, not a
          scaled-down version of it.
        </p>
        <NavBarDemo />
      </Section>

      <Section title="Navigation — Footer">
        <div className="-mx-(--spacing-page)">
          <Footer />
        </div>
      </Section>

      <Section title="Display — Eyebrow Label">
        <EyebrowLabel>How it works</EyebrowLabel>
      </Section>

      <Section title="Display — Divider">
        <Divider />
      </Section>

      <Section title="Display — Step Progress">
        <div className="flex flex-col gap-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col gap-2">
              <span className="font-mono text-xs text-text-on-light/50">step={step} of 3</span>
              <StepProgress step={step} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Display — Partner Logo Strip">
        <div className="flex flex-col gap-12 bg-surface-dark text-text-on-dark rounded-lg p-8 -mx-(--spacing-page) sm:mx-0">
          <PartnerLogoStrip
            label="Hosted by"
            partners={[{ name: "Capgemini", src: "/images/logos/capgemini.png", width: 209, height: 78 }]}
          />
          <PartnerLogoStrip
            label="With support from"
            partners={[
              { name: "NVIDIA", src: "/images/logos/nvidia.png", width: 228, height: 47 },
              { name: "HSBC", src: "/images/logos/hsbc.png", width: 179, height: 47 },
            ]}
          />
          <PartnerLogoStrip
            label="Together, our teams know how to build and bring new products to market"
            partners={[
              { name: "frog", src: "/images/logos/frog.png", width: 102, height: 62 },
              { name: "Synapse", src: "/images/logos/synapse.png", width: 260, height: 53 },
              { name: "Applied Innovation Exchange", src: "/images/logos/aie.png", width: 222, height: 69 },
              { name: "Capgemini Engineering", src: "/images/logos/capgemini-engineering.png", width: 374, height: 60 },
            ]}
          />
        </div>
      </Section>
    </div>
  );
}
