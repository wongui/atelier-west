# Atelier West — Foundations & Tokens (condensed)

Scaled down from a prior, larger system. This site has ~8 sections, one page
template repeated with variation, and no product UI — so the token taxonomy,
type-ramp reasoning, and docs are cut to match that, not carried over at
full weight. Anything not justified by an actual wireframe isn't in here.

## 1. Token taxonomy — two layers, not six

Full chain (`Color → Purpose → Component → Scope → Variant → State`) is
overkill for ~6 components. Using two layers instead:

- **Primitive** — the raw value. Never referenced outside the token file itself.
  `--color-cream: #fbfae4`
- **Semantic** — what the value is *for*. Everything else in the system
  references this layer only.
  `--color-surface-light: var(--color-cream)`
  `--color-text-on-light: var(--color-slate)`

Component-level variants (button hover, link underline) are handled as
plain CSS states on top of semantic tokens, not as a separate named layer —
there are only two components with states at all (Button, Text Link), so a
dedicated Scope/Variant/State taxonomy would be more ceremony than the
system needs. If a third stateful component shows up later, revisit this.

**Semantic tokens actually needed, derived from the wireframes:**

| Semantic token | Primitive | Used for |
|---|---|---|
| `--color-surface-light` | cream | page background, light sections |
| `--color-surface-dark` | charcoal | dark sections (Folds 3–5) |
| `--color-surface-accent` | coral | Fold6 CTA section background |
| `--color-text-on-light` | slate | body/heading text on light or photo-dark surfaces |
| `--color-text-on-dark` | cream | body/heading text on charcoal/coral surfaces |
| `--color-accent-cta` | coral | primary button fill |
| `--color-accent-cta-alt` | slate | secondary button fill (Fold1 nav "Apply") |
| `--color-wash-warm` | coral | duotone photo wash, warm variant |
| `--color-wash-cool` | sage | duotone photo wash, cool variant |
| `--color-overlay-tint` | warm-gray | color-mix overlay on desaturated photos |

No multi-brand variable collection — single brand, confirmed in scope. Not
building that structure preemptively.

## 2. Type ramp — reasoning, not a default scale

Audience: professional adults (Physical AI founders evaluating whether to
apply; VC/enterprise partners assessing credibility). No stated low-vision
or motor-access requirement, equal desktop/mobile priority. That means:
standard defaults are the right call here, not an elevated floor — there's
no audience signal that justifies going past WCAG AA.

- **Floor:** 16px minimum for anything meant to be read as a sentence.
  (The Figma file's smallest reading text — nav labels, "How it works"
  eyebrows — sits at 18px, i.e. already above floor. Good; nothing to fix.)
- **Target (primary reading size):** 18px body copy — matches Figma.
- **Interactive targets:** standard web minimum (~44px tap target) on the
  pill button and nav links — no elevated requirement, general audience.
- **Contrast minimum:** WCAG AA, 4.5:1 for body text, 3:1 for large
  display type (24px+/serif headlines). Confirmed at build time against
  each surface/text pairing above — flagging now that slate-on-cream and
  cream-on-charcoal both need a real contrast check once built, not
  assumed from the mockup.
- **Ramp (from Figma, confirmed present, nothing invented):**

| Style name | Size | Use |
|---|---|---|
| `display-hero` | 110px | Fold1 hero line only |
| `display-h1` | 70px | Section numbers + headers (Folds 3–6) |
| `display-h2` | ~60px | Fold2/Fold8 subheads |
| `body` | 18px | paragraph copy, nav labels, eyebrows |
| `ui-label` | 14px | button labels (uppercase, tracked) |
| `wordmark` | ~42px, +127px tracking | "ATELIER WEST" full lockup (hero/footer) — decorative, not a reading size |
| `wordmark-nav` | ~25.4px, +10.16px tracking | Nav bar wordmark only — confirmed via Figma to be a genuinely different size, not a scaled-down lockup |

No separate caption/fine-print size exists in the wireframes — not adding
one speculatively. If legal/footer copy needs something smaller later,
it still can't go below the 16px floor.

## 3. Foundation build order

1. **Brand assets** — done (frogSerif + BentonSansF loading and verified in build).
2. **Color** — primitives (done) → semantic layer (table above, next step).
3. **Type** — ramp above, as real reusable text styles (Tailwind utility
   classes / a couple of small text components), not repeated inline
   font-size declarations.
4. **Spacing & layout** — a section rhythm, not per-fold arbitrary values:
   each fold is a full-bleed section (~973px tall on the reference
   frame), fixed horizontal content padding, one content max-width for
   text columns (614px in Figma) vs. full-bleed for photography. Build
   this as a scale (e.g. a section-padding token, a content-max-width
   token), not one-off values per fold.

   Confirmed via the Figma frame's grid settings (`Design System/Layout/`):
   **8 columns, stretch width, 24px margin, 24px gutter**, on the 1732px
   reference frame. The 24px margin is exactly `--spacing-page` (derived
   independently from fold padding — good cross-check that it's real,
   not a one-off). The 24px gutter maps directly onto Tailwind's default
   `gap-6` (1.5rem), so it doesn't need its own token. Column count (8)
   is used as `grid-cols-8` directly where a real grid layout is needed;
   most sections are simpler two-region splits (text column + full-bleed
   image) rather than genuine 8-up grids, so this mainly matters for any
   layout that actually subdivides into multiple columns.
5. **Imagery** — the recurring "organic mask + duotone/color-mix wash"
   treatment is this project's equivalent of an icon system: it's the one
   other visual primitive every section reuses. Build it once as a
   reusable image-treatment pattern (mask shape + wash color pair), not
   redrawn per fold. The one actual icon in the system (the small arrow
   next to "Learn more" / "Named a Market Shaper" links) is the only
   icon asset needed — no broader icon set to build.

## 4. Component families — small, matched to what's actually there

No Cards, no Forms, no Feedback family — nothing in the wireframes calls
for them (Apply links out to an external tool; there's no modal, alert,
or data table anywhere in Fold1–8/Footer). Forcing those families in now
would be building for a system that doesn't exist yet.

- **Foundations** — color, type, spacing/layout, image treatment, the one arrow icon.
- **Actions** — Button (pill; `cta` coral variant, `nav` slate variant), Text Link with arrow (underlined, used for "Learn more" / "Named a Market Shaper").
- **Navigation** — Nav Bar (top-of-page transparent state + scrolled/sticky state), Footer.
- **Display** — Eyebrow Label (small tracked-caps label, e.g. "How it works," "Hosted by"), Divider (hairline rule), Step Progress Indicator (the partial-width line under Folds 3–5's divider — marks progress through the 3-step "How it works" sequence), Partner Logo Strip (the muted/opacity-reduced logo row in Fold7).

That's the complete list. If About/Apply need something not in this list
once designed, add the family then — not speculatively now.

## 5. Documentation — one living page, not per-component doc sets

Given the component count (~9 total across 4 families), a full six-section
doc page per component is more scaffolding than the system needs. Instead:
a single `/system` route in the app itself, one section per family above,
each showing:

- The **real, live component** in its actual variants/states (never a
  static mockup standing in for it — same rule as the full system, just
  applied to fewer things).
- The **token(s) it consumes**, noted inline next to each variant.

Anatomy breakdowns, specimen matrices, and prop-contract tables as
separate sections aren't included — with 2–3 variants per component max,
a labeled live demo already shows the whole contract at a glance. Revisit
if the component count grows enough that this stops being true.

## Definition of done, per component (kept, lighter)

- [ ] Every fill/spacing/type choice traces to a semantic token — no hardcoded values.
- [ ] Every variant shown on `/system` exists in the code, and vice versa.
- [ ] `/system`'s demo is the real component, not a mockup.
- [ ] Contrast checked against the type-ramp minimum for that text/surface pairing.
