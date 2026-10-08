"use client";

import Link from "next/link";
import { recent } from "../data/recent";

const compact = (n) => {
  if (n >= 1_000_000_000) {
    const b = n / 1_000_000_000;
    const text = b >= 10 ? b.toFixed(1) : b.toFixed(2);
    return `${text.replace(/\.0$/, "")}B`;
  }
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const text = m >= 10 ? m.toFixed(1) : m.toFixed(2);
    return `${text.replace(/\.0$/, "")}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return n.toLocaleString("en-US");
};

const rate = (value) => `${value.toFixed(2)}%`;

const creators = [
  {
    slug: "bluff",
    name: "Bluff",
    href: "/bluff",
    subscribers: 955000,
    lifetimeViews: 779811159,
    viewsLabel: "YouTube Studio views",
  },
  {
    slug: "brettski",
    name: "Brettski",
    href: "/brettski",
    subscribers: 578000,
    lifetimeViews: 441279975,
    viewsLabel: "Public upload views",
  },
  {
    slug: "ontilt",
    name: "On Tilt Boys",
    href: "/ontilt",
    subscribers: 251000,
    lifetimeViews: 204240765,
    viewsLabel: "Public upload views",
  },
];

function quarterStats(slug) {
  const data = recent[slug];
  const views = data.q2.all.views + data.q3.all.views;
  const videos = data.q2.all.videos + data.q3.all.videos;
  const engagement =
    (data.q2.all.engagement * data.q2.all.views + data.q3.all.engagement * data.q3.all.views) / views;
  return { views, videos, engagement, posts: data.last60.all.videos };
}

const quarterViews = creators.reduce((sum, creator) => sum + quarterStats(creator.slug).views, 0);

const blanks = [
  "Total content views",
  "Total engagements",
  "Estimated fan attendance",
  "Promotional redemptions",
];

const openItems = [
  "Gila River attendance, meet-and-greet count, crowd size, and any foot-traffic change the property recorded.",
  "Promotional offers claimed, new player-club signups, free-play redemptions, and gaming activity tied to the activation.",
  "How many days the visit was promoted, how many pre-event posts ran, pre-event views, and the turnout that followed.",
  "Views in the first 7 days and the first 30 days for each Gila River video that actually published, by platform.",
  "Views still coming in at 30, 60, and 90 days after the visit.",
  "Photos of the crowd, the creators filming, fan interactions, and casino branding.",
  "Instagram, Facebook, and TikTok post counts, views, reach, impressions, and engagement for each creator.",
  "YouTube average impressions for the last two quarters, from a Studio export. Lifetime impressions are not a substitute.",
  "Which contracted Gila River videos have actually been published, kept separate from the package that was agreed.",
];

const plan = [
  ["Arrival", "Property walkthrough, credential check, and a confirmed filming path with security."],
  ["Filming", "On-floor long-form and short-form shoots. Branding and camera positions agreed before the first take."],
  ["Meet-and-greet", "A set window for fans, with a headcount the property records."],
  ["Promotional offers", "Giveaways or free play only on terms the property sets. Redemptions tracked by the casino, not estimated from views."],
  ["Social posts", "Posts during the visit and after it. Each platform counted on its own."],
  ["After the visit", "Check published views at 7, 30, 60, and 90 days. Report each property on its own, then the full tour."],
];

export default function Page() {
  return (
    <>
      <header className="bar">
        <div className="wordmark">
          <span className="accent-bar" />
          <div>
            <div className="brand-name">Partnership brief</div>
            <div className="brand-meta">Bluff, Brettski, and On Tilt Boys · For property presidents</div>
          </div>
        </div>
        <button className="pdf" type="button" onClick={() => window.print()}>
          Download PDF
        </button>
      </header>

      <main className="page">
        <p className="note">
          Filled numbers are verified YouTube results. Empty cells are still open. Reach, impressions, and views are different measures. Where a platform does not report a measure, the cell says Unavailable.
        </p>

        <section className="questions" aria-label="What a property president needs">
          <article>
            <div className="metric-label">1 · Reach</div>
            <h2>How many people will this reach?</h2>
            <p>
              {compact(quarterViews)} YouTube views on videos these three channels posted in April through September 2026. Reach for that period is unavailable.
            </p>
          </article>
          <article>
            <div className="metric-label">2 · Other casinos</div>
            <h2>What happened on earlier visits?</h2>
            <p>
              YouTube views on videos that name a casino are on each creator page. Attendance, foot traffic, and redemptions from those visits are unavailable.
            </p>
          </article>
          <article>
            <div className="metric-label">3 · Value</div>
            <h2>What could MGM measure?</h2>
            <p>
              Cost per 1,000 views, cost per engagement, and cost per player wait for Gila River’s own results. Channel-wide views stay out of that math.
            </p>
          </article>
        </section>

        <section className="card">
          <div className="card-head">
            <div className="card-title">
              <h2>Gila River activation</h2>
              <span className="status">Completed</span>
            </div>
            <p className="lead">Wild Horse Pass · September 19, 2026. Contracted package for Bluff. These figures are the agreement, not measured marketing results.</p>
          </div>
          <div className="metrics package">
            <article className="metric">
              <div className="metric-label">Partnership value</div>
              <div className="metric-value">$125K</div>
              <div className="metric-hint">$65K cash and $60K promotional free play, before later additions</div>
            </article>
            <article className="metric">
              <div className="metric-label">Long-form</div>
              <div className="metric-value">2</div>
              <div className="metric-hint">Contracted deliverables</div>
            </article>
            <article className="metric">
              <div className="metric-label">Short-form</div>
              <div className="metric-value">3</div>
              <div className="metric-hint">Contracted deliverables</div>
            </article>
            <article className="metric">
              <div className="metric-label">Paid-ad assets</div>
              <div className="metric-value">3</div>
              <div className="metric-hint">Additional contracted assets</div>
            </article>
          </div>
          <h3>Verified performance</h3>
          <p className="lead">Leave these blank until the number is verified. Published content stays separate from the contracted package.</p>
          <div className="blank-grid">
            {blanks.map((label) => (
              <article className="blank" key={label}>
                <div className="metric-label">{label}</div>
                <div className="metric-value">—</div>
                <div className="metric-hint">Unavailable</div>
              </article>
            ))}
          </div>
          <p className="caption">
            Add Brettski and On Tilt Boys here only if their Gila River deliverables are confirmed, and keep them separate from Bluff’s $125K package. Add photos of the crowd, filming, fan interactions, and casino branding when they are in hand.
          </p>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Creator performance by channel</h2>
            <p className="lead">
              Last two quarters are April through September 2026. Posts are August 9 through October 7. YouTube is filled from public video data. Every other platform is open.
            </p>
          </div>
          <div className="creator-cards">
            {creators.map((creator) => {
              const stats = quarterStats(creator.slug);
              return (
                <article className="q-card" key={creator.slug}>
                  <h3><Link href={creator.href}>{creator.name}</Link></h3>
                  <dl>
                    <div><dt>YouTube views</dt><dd>{compact(stats.views)}</dd></div>
                    <div><dt>Engagement rate</dt><dd>{rate(stats.engagement)}</dd></div>
                    <div><dt>Posts, 60 days</dt><dd>{stats.posts.toLocaleString("en-US")}</dd></div>
                    <div><dt>Average reach</dt><dd className="missing">Unavailable</dd></div>
                    <div><dt>Average impressions</dt><dd className="missing">Unavailable</dd></div>
                    <div><dt>Instagram, Facebook, TikTok</dt><dd className="missing">Unavailable</dd></div>
                  </dl>
                </article>
              );
            })}
          </div>
          <div className="wide-only table-scroll"><table>
            <thead>
              <tr>
                <th></th>
                {creators.map((creator) => (
                  <th className="num" key={creator.slug}>
                    <Link href={creator.href}>{creator.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>YouTube views, last 2 quarters</td>
                {creators.map((creator) => (
                  <td className="num" key={creator.slug}>{compact(quarterStats(creator.slug).views)}</td>
                ))}
              </tr>
              <tr>
                <td>Engagement rate</td>
                {creators.map((creator) => (
                  <td className="num" key={creator.slug}>{rate(quarterStats(creator.slug).engagement)}</td>
                ))}
              </tr>
              <tr>
                <td>YouTube posts, last 60 days</td>
                {creators.map((creator) => (
                  <td className="num" key={creator.slug}>{quarterStats(creator.slug).posts.toLocaleString("en-US")}</td>
                ))}
              </tr>
              {["Average reach", "Average impressions", "Instagram", "Facebook", "TikTok"].map((label) => (
                <tr key={label}>
                  <td>{label}</td>
                  {creators.map((creator) => (
                    <td className="num missing" key={creator.slug}>Unavailable</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table></div>
          <p className="caption">
            YouTube views are on videos posted in those two quarters. Engagement rate is likes plus comments, divided by views. Shorts and long-form are broken out on each creator page. Average reach and average impressions are unavailable in this export.
          </p>
          <div className="table-scroll"><table>
            <thead>
              <tr>
                <th>Creator</th>
                <th className="num">Subscribers</th>
                <th className="num">Lifetime YouTube views</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((creator) => (
                <tr key={creator.slug}>
                  <td>{creator.name}</td>
                  <td className="num">{compact(creator.subscribers)}</td>
                  <td className="num">{compact(creator.lifetimeViews)}</td>
                  <td>{creator.viewsLabel}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <p className="caption">
            Bluff’s lifetime watch time is 57.5M hours in YouTube Studio. Brettski and On Tilt watch time on their pages is an estimate, so it is not included in this brief.
          </p>
        </section>

        <section className="card">
          <div className="card-head">
            <div className="card-title">
              <h2>Sample property visit</h2>
              <span className="status draft">Draft</span>
            </div>
            <p className="lead">
              One property, for Bluff, Brettski, and On Tilt Boys. A five-property tour would repeat these steps. Impressions, attendance, and player signups stay unstated until a property records them.
            </p>
          </div>
          <ol className="plan">
            {plan.map(([title, copy], index) => (
              <li key={title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Investment math, once the blanks are filled</h2>
            <p className="lead">The formula is here so the result can be added later. No result is calculated from channel-wide views.</p>
          </div>
          <div className="table-scroll"><table>
            <thead>
              <tr>
                <th>Measure</th>
                <th>How it is calculated</th>
                <th className="num">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cost per 1,000 views</td>
                <td>Partnership investment divided by attributable views, times 1,000. Label whether the denominator is views or impressions.</td>
                <td className="num missing">Unavailable</td>
              </tr>
              <tr>
                <td>Cost per engagement</td>
                <td>Investment divided by engagement actions. Unique people are used only if the property can provide them.</td>
                <td className="num missing">Unavailable</td>
              </tr>
              <tr>
                <td>Cost per player</td>
                <td>Promotional investment divided by verified new or reactivated players from the property.</td>
                <td className="num missing">Unavailable</td>
              </tr>
              <tr>
                <td>Views after the visit</td>
                <td>Views at 30, 60, and 90 days on the videos that were actually published.</td>
                <td className="num missing">Unavailable</td>
              </tr>
            </tbody>
          </table></div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Still needed from the team</h2>
            <p className="lead">These are the cells this brief cannot fill from the YouTube export.</p>
          </div>
          <ul className="open-list">
            {openItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
