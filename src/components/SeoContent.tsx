import { criteria, faqs } from "@/data/apply";
import { mentors } from "@/data/mentors.generated";

// Pre-hydration fallback for the three client-rendered pages. Each page
// returns null until useIsDesktop() resolves on the client, so the exported
// HTML used to contain no text at all — invisible to crawlers that don't run
// JavaScript (most AI crawlers, link-preview bots, many search engines).
// These render in that window only (sr-only: no flash), then get replaced by
// the real layout. They restate copy that is already visible on the site;
// when page copy changes materially, update the matching block here.

function Wrap({ children }: { children: React.ReactNode }) {
  return <main className="sr-only">{children}</main>;
}

export function HomeSeoContent() {
  return (
    <Wrap>
      <h1>Atelier West: Where AI Takes Shape</h1>
      <p>A 12-week equity-free residency for Physical AI founders.</p>
      <h2>Shaping the future of Physical AI startups</h2>
      <p>
        Atelier West is a 12-week, cash- and equity-free, cohort-based residency based in San
        Francisco Mission Rock for Physical AI startups with lab access, expert mentorship, and
        enterprise partners, designed to give your technology a place to prove itself and scale.
      </p>
      <h2>Built to Build</h2>
      <p>
        Six labs for rapid prototyping, industrial design, mechanical and electrical engineering,
        metrology, and new product introduction.
      </p>
      <h2>Hands-On Experts</h2>
      <p>
        Structured working sessions with frog, Synapse, and Capgemini Experience Engineering
        experts, across strategy, design, hardware, AI, simulation, and embedded software.
      </p>
      <h2>A Straight Line to Enterprises</h2>
      <p>
        Capgemini works with 85% of the 200 largest public companies on the Forbes Global 2000
        list, bringing real world applications for what you build here.
      </p>
      <h2>The future of AI is physical</h2>
      <p>
        The next chapter of AI is intelligence that acts, sensing its environment, understanding
        what&rsquo;s needed, and taking action in the physical world. No equity or cash is
        exchanged.
      </p>
      <nav>
        <a href="/apply">Apply</a> <a href="/about">Program details</a>
      </nav>
    </Wrap>
  );
}

export function AboutSeoContent() {
  return (
    <Wrap>
      <h1>
        Atelier West is a 12-week, cash- and equity-free residency program for committed,
        ambitious Physical AI startups
      </h1>
      <p>
        Cohort companies work out of our San Francisco Mission Rock labs, get structured time to
        work directly with experts in design, strategy, hardware, and AI, and close the program
        with a demo day in front of enterprise partners and investors.
      </p>
      <h2>Cost &amp; Commitment</h2>
      <p>
        The program is free for participants: no equity, no cash. You will be asked for a
        refundable deposit tied to lab access. The only commitment we ask is to partner with us on
        joint case studies, reference architectures, pilot projects, and/or thought leadership.
      </p>
      <h2>Program timeline</h2>
      <ul>
        <li>Weeks 0-1, Onboarding &amp; Lab Training</li>
        <li>Weeks 2-11, Build, with cohort events built around your problem set</li>
        <li>Week 12, Demo Day for enterprise partners and investors</li>
      </ul>
      <h2>Lab &amp; Facilities Access</h2>
      <ul>
        <li>Rapid Prototyping</li>
        <li>Industrial Design</li>
        <li>Mechanical Engineering</li>
        <li>Electrical Engineering</li>
        <li>Metrology Lab</li>
        <li>New Product Introduction (NPI)</li>
      </ul>
      <h2>Expert Mentorship</h2>
      <p>
        Scheduled office hours with experts from frog, Synapse, and Capgemini Experience
        Engineering across strategy, design, hardware, AI, simulation, and embedded software.
      </p>
      <ul>
        {mentors.map((m) => (
          <li key={m.name}>
            {m.name}, {m.role}
          </li>
        ))}
      </ul>
      <h2>Events &amp; Enterprise Access</h2>
      <p>
        Group workshops built around your cohort&rsquo;s needs, connecting you with relevant
        enterprise companies, and a closing demo day.
      </p>
      <h2>Partner Benefits</h2>
      <p>
        Participants are prioritized for AWS for Startups ($100,000-200,000 in AWS Activate
        Credits) and NVIDIA&rsquo;s Inception Program (developer tools, preferred hardware
        pricing, and investor exposure).
      </p>
      <p>
        We&rsquo;re looking for committed teams building in Physical AI and solving a clear, named
        problem.
      </p>
      <nav>
        <a href="/apply">Apply</a> <a href="/">Home</a>
      </nav>
    </Wrap>
  );
}

export function ApplySeoContent() {
  return (
    <Wrap>
      <h1>Shape what&rsquo;s next: apply to Atelier West</h1>
      <p>Apply for the inaugural cohort taking place between October 2026 and January 2027.</p>
      <h2>Key Dates</h2>
      <ul>
        <li>10/5/26, Applications open</li>
        <li>10/21/26, Applications close</li>
        <li>10/21 - 10/28, Cohort selection</li>
        <li>11/2/26, Cohort begins</li>
      </ul>
      <h2>Entry Criteria &amp; Selection Process</h2>
      <p>Applicants must meet the following criteria to be considered:</p>
      <ul>
        {criteria.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p>
        Applications are reviewed by a committee that includes Atelier West staff and subject
        matter experts, on a rolling basis within the application window.
      </p>
      <h2>FAQs</h2>
      {faqs.map((f) => (
        <section key={f.question}>
          <h3>{f.question}</h3>
          <p>{f.answer}</p>
        </section>
      ))}
    </Wrap>
  );
}
