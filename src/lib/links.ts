// Shared external destinations referenced from multiple components — kept
// in one place so the URLs only need updating once if they ever change.
// Only the big "Apply Now" CTA on the /apply page (EntryCriteria) should
// link here directly — every other "Apply"/"Apply Now" link/button on
// the site should point at the internal "/apply" page instead.
export const APPLY_URL =
  "https://atelierwestapply.typeform.com/to/CB8SK6iM?typeform-source=atelierwest.ai";
export const EVENTS_URL = "https://luma.com/atelierwest";

// Footer legal links — same list on desktop (Footer) and mobile
// (FooterMobile), kept here so the two don't drift out of sync.
export const FOOTER_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "https://www.capgemini.com/privacy-notice/" },
  { label: "Terms of Use", href: "https://www.capgemini.com/terms-of-use/" },
  { label: "Accessibility", href: "https://www.capgemini.com/accessibility/" },
  { label: "Cookie Notice", href: "https://www.capgemini.com/cookie-policy/" },
  { label: "Speak Up", href: "https://capgemini.integrityline.com/" },
  {
    label: "Security Vulnerability Disclosure",
    href: "https://www.capgemini.com/security-vulnerability-notification/",
  },
  { label: "Fraud Alert", href: "https://www.capgemini.com/fraud-alert/" },
];
