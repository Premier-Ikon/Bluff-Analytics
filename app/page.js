"use client";

import Link from "next/link";
import AudienceMap from "./AudienceMap";
import { recent } from "../data/recent";
import { engagementRate, social } from "../data/social";
import { usStates } from "../data/states";

const ROSTER_GEO_SCALE = 3;
const rosterStates = usStates.states.map((state) => ({
  ...state,
  views: Math.round(state.views * ROSTER_GEO_SCALE),
  hours: Math.round(state.hours * ROSTER_GEO_SCALE),
}));
const rosterUsViews = Math.round(usStates.usViews * ROSTER_GEO_SCALE);
const rosterUsHours = Math.round(usStates.usHours * ROSTER_GEO_SCALE);
const rosterNevada = rosterStates.find((state) => state.code === "NV");

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
const instagramViews =
  (social.bluff.instagram?.views || 0) +
  (social.brettski.instagram?.views || 0) +
  (social.ontilt.instagram?.views || 0);
const bluffMetaReach = social.bluff.meta?.reach || 0;
const bluffMetaViews = social.bluff.meta?.views || 0;
const totalSubs = creators.reduce((sum, creator) => sum + creator.subscribers, 0);

const blanks = [
  "Total content views",
  "Total engagements",
  "Estimated fan attendance",
  "Promotional redemptions",
];

const openItems = [
  "Gila River attendance, meet-and-greet count, crowd size, and foot-traffic change.",
  "Promo redemptions, player-club signups, and gaming activity tied to the activation.",
  "Pre-event promo timeline, posts, views, and resulting turnout.",
  "7 / 30 / 60 / 90-day views on published Gila River content by platform.",
  "Crowd and branding photos from the activation.",
  "True Insights impressions (current figures use a views proxy).",
  "Partner post counts from each creator’s own export.",
];

const plan = [
  ["Arrival", "Walkthrough, credentials, and a filming path signed off with security."],
  ["Filming", "Long-form and short-form on the floor. Branding and camera spots agreed first."],
  ["Meet-and-greet", "A set fan window with a headcount the property records."],
  ["Offers", "Giveaways or free play on property terms. Redemptions tracked by the casino."],
  ["Social posts", "Posts during and after the visit, counted by platform."],
  ["Follow-up", "Views at 7, 30, 60, and 90 days. Report each property, then the full tour."],
];

function Badge({ tone = "ok", children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export default function Page() {
  return (
    <>
      <header className="bar">
        <div className="wordmark">
          <span className="accent-bar" />
          <div>
            <div className="brand-name">MGM partnership brief</div>
            <div className="brand-meta">Bluff · Brettski · On Tilt Boys · October 2026</div>
          </div>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">Executive summary</p>
            <h1>Three creators. Verified audience. Property impact pending Gila River.</h1>
            <p>
              Built for a quick presidential read: what we can prove today, what a sample visit looks like, and which cells still need the property report.
            </p>
            <div className="legend">
              <Badge tone="ok">Verified</Badge>
              <Badge tone="est">Estimate</Badge>
              <Badge tone="wait">Pending property data</Badge>
            </div>
          </div>
          <div className="hero-stats">
            <article>
              <div className="metric-label">YouTube views · 2 quarters</div>
              <div className="metric-value">{compact(quarterViews)}</div>
              <div className="metric-hint">Apr–Sep 2026 · all three</div>
            </article>
            <article>
              <div className="metric-label">Bluff Meta reach</div>
              <div className="metric-value">{compact(bluffMetaReach)}</div>
              <div className="metric-hint">Unique people · 90 days</div>
            </article>
            <article>
              <div className="metric-label">Bluff Meta views</div>
              <div className="metric-value">{compact(bluffMetaViews)}</div>
              <div className="metric-hint">IG + FB · 90 days</div>
            </article>
            <article>
              <div className="metric-label">Combined subscribers</div>
              <div className="metric-value">{compact(totalSubs)}</div>
              <div className="metric-hint">YouTube · three channels</div>
            </article>
          </div>
        </section>

        <section className="questions" aria-label="Decision answers">
          <article>
            <div className="metric-label">Reach</div>
            <h2>How many people will this reach?</h2>
            <p className="big-num">{compact(bluffMetaReach)} people</p>
            <p>
              Verified Bluff Meta reach. Supporting volume: {compact(quarterViews)} YouTube views and {compact(instagramViews)} Instagram views across the roster.
            </p>
          </article>
          <article>
            <div className="metric-label">Prior visits</div>
            <h2>What happened at other casinos?</h2>
            <p className="big-num">On-camera publicity</p>
            <p>
              Named-property YouTube views live on each creator page. Attendance, redemptions, and foot traffic wait on Gila River.
            </p>
          </article>
          <article>
            <div className="metric-label">Value</div>
            <h2>What can MGM measure?</h2>
            <p className="big-num">CPM · CPE · CPP</p>
            <p>
              Formulas are ready below. Results stay blank until attributable views, engagements, and players are returned.
            </p>
          </article>
        </section>

        <p className="section-label"><span>01</span> Audience geography</p>
        <section className="card">
          <div className="card-head">
            <div className="card-title">
              <h2>Where the audience watches</h2>
              <Badge tone="est">Roster estimate</Badge>
            </div>
            <p className="lead">
              Bluff’s measured U.S. state mix, scaled ×3 for the full roster. Same geographic pattern — California, Texas, and Florida still lead.
            </p>
          </div>
          <AudienceMap
            states={rosterStates}
            usViews={rosterUsViews}
            usHours={rosterUsHours}
            estimated
            caption={`Nevada is ${rosterNevada.hourShare}% of U.S. watch time, about ${compact(rosterNevada.views)} views across the roster estimate. State shares match Bluff’s Studio mix; hours and views are ×3. About 19% of U.S. watch time is not tied to a state, so it is not colored on the map.`}
          />
        </section>

        <p className="section-label"><span>02</span> Creator proof</p>
        <section className="card">
          <div className="card-head">
            <h2>Audience by channel</h2>
            <p className="lead">
              Scan the cards for the presidential read. Use the table for side-by-side detail. Open a creator tab for full quarterly and Meta breakouts.
            </p>
          </div>

          <div className="creator-grid">
            {creators.map((creator) => {
              const stats = quarterStats(creator.slug);
              const pack = social[creator.slug] || {};
              const ig = pack.instagram;
              const fb = pack.facebook;
              const meta = pack.meta;
              const igRate = ig?.interactions != null ? engagementRate(ig.interactions, ig.views) : null;
              const metaRate = meta ? engagementRate(meta.interactions, meta.views) : null;
              return (
                <article className="creator-card" key={creator.slug}>
                  <div className="creator-card-top">
                    <div>
                      <h3><Link href={creator.href}>{creator.name}</Link></h3>
                      <p className="metric-hint">{compact(creator.subscribers)} YouTube subscribers</p>
                    </div>
                    <Link className="ghost-link" href={creator.href}>Open →</Link>
                  </div>
                  <div className="creator-kpis">
                    <div>
                      <div className="metric-label">YouTube · 2Q</div>
                      <strong>{compact(stats.views)}</strong>
                      <span>{rate(stats.engagement)} eng.</span>
                    </div>
                    <div>
                      <div className="metric-label">Instagram</div>
                      <strong>{ig ? compact(ig.views) : "—"}</strong>
                      <span>{igRate != null ? `${rate(igRate)} eng.` : metaRate != null ? `${rate(metaRate)} Meta eng.` : "—"}</span>
                    </div>
                    <div>
                      <div className="metric-label">Reach / viewers</div>
                      <strong>{meta?.reach ? compact(meta.reach) : ig?.viewers ? compact(ig.viewers) : "—"}</strong>
                      <span>{meta?.reach ? "Meta reach" : ig?.viewers ? "IG viewers" : "—"}</span>
                    </div>
                    <div>
                      <div className="metric-label">IG posts · 60d</div>
                      <strong>
                        {ig?.postsLast60 != null ? ig.postsLast60.toLocaleString("en-US") : "—"}
                      </strong>
                      <span>
                        {ig?.postsLast60 != null ? (
                          <Badge tone={ig.postsEstimated ? "est" : "ok"}>
                            {ig.postsEstimated ? "Estimate" : "Measured"}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="creator-foot">
                    <span>FB {fb ? compact(fb.views) : "—"}</span>
                    <span>
                      IG avg imp. {ig?.avgImpressions != null ? compact(ig.avgImpressions) : "—"}
                      {ig?.impressionsEstimated ? " · est." : ""}
                    </span>
                    <span>YT posts {stats.posts}</span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="compare-block wide-only">
            <div className="split-head">
              <h3>Side-by-side</h3>
              <Badge tone="est">Some estimates</Badge>
            </div>
            <div className="table-scroll compare-table">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    {creators.map((creator) => (
                      <th className="num" key={creator.slug}>
                        <Link href={creator.href}>{creator.name}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>YouTube views · 2 quarters</td>
                    {creators.map((creator) => (
                      <td className="num" key={creator.slug}>{compact(quarterStats(creator.slug).views)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>YouTube engagement</td>
                    {creators.map((creator) => (
                      <td className="num" key={creator.slug}>{rate(quarterStats(creator.slug).engagement)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>YouTube posts · 60 days</td>
                    {creators.map((creator) => (
                      <td className="num" key={creator.slug}>{quarterStats(creator.slug).posts.toLocaleString("en-US")}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Instagram views</td>
                    {creators.map((creator) => {
                      const ig = social[creator.slug]?.instagram;
                      return <td className="num" key={creator.slug}>{ig ? compact(ig.views) : "—"}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>Reach / viewers</td>
                    {creators.map((creator) => {
                      const pack = social[creator.slug] || {};
                      const value = pack.meta?.reach || pack.instagram?.viewers;
                      const label = pack.meta?.reach ? "reach" : pack.instagram?.viewers ? "viewers" : "";
                      return (
                        <td className="num" key={creator.slug}>
                          {value ? `${compact(value)} ${label}` : "—"}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td>IG posts · 60 days</td>
                    {creators.map((creator) => {
                      const ig = social[creator.slug]?.instagram;
                      return (
                        <td className="num" key={creator.slug}>
                          {ig?.postsLast60?.toLocaleString("en-US") || "—"}
                          {ig?.postsEstimated ? <div className="metric-hint">Estimate</div> : null}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td>IG avg impressions</td>
                    {creators.map((creator) => {
                      const ig = social[creator.slug]?.instagram;
                      return (
                        <td className="num" key={creator.slug}>
                          {ig?.avgImpressions != null ? compact(ig.avgImpressions) : "—"}
                          {ig?.impressionsEstimated ? <div className="metric-hint">Estimate</div> : null}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td>Facebook views</td>
                    {creators.map((creator) => {
                      const fb = social[creator.slug]?.facebook;
                      return <td className="num" key={creator.slug}>{fb ? compact(fb.views) : "—"}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>FB posts · 60 days</td>
                    {creators.map((creator) => {
                      const fb = social[creator.slug]?.facebook;
                      return (
                        <td className="num" key={creator.slug}>
                          {fb?.postsLast60?.toLocaleString("en-US") || "—"}
                          {fb?.postsEstimated ? <div className="metric-hint">Estimate</div> : null}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <p className="section-label"><span>03</span> Prior activation</p>
        <section className="card">
          <div className="card-head">
            <div className="card-title">
              <h2>Gila River × Bluff</h2>
              <Badge tone="ok">Completed</Badge>
            </div>
            <p className="lead">
              Wild Horse Pass · September 19, 2026. Deal terms are confirmed. Marketing outcomes below stay empty until the property report lands.
            </p>
          </div>
          <div className="metrics package">
            <article className="metric">
              <div className="metric-label">Partnership value</div>
              <div className="metric-value">$125K</div>
              <div className="metric-hint">$65K cash + $60K free play</div>
            </article>
            <article className="metric">
              <div className="metric-label">Long-form</div>
              <div className="metric-value">2</div>
              <div className="metric-hint">Contracted</div>
            </article>
            <article className="metric">
              <div className="metric-label">Short-form</div>
              <div className="metric-value">3</div>
              <div className="metric-hint">Contracted</div>
            </article>
            <article className="metric">
              <div className="metric-label">Paid-ad assets</div>
              <div className="metric-value">3</div>
              <div className="metric-hint">Contracted</div>
            </article>
          </div>
          <div className="split-head">
            <h3>Property impact</h3>
            <Badge tone="wait">Pending</Badge>
          </div>
          <div className="blank-grid">
            {blanks.map((label) => (
              <article className="blank" key={label}>
                <div className="metric-label">{label}</div>
                <div className="metric-value">—</div>
                <div className="metric-hint">Awaiting Gila River</div>
              </article>
            ))}
          </div>
        </section>

        <p className="section-label"><span>04</span> Sample property visit</p>
        <section className="card">
          <div className="card-head">
            <div className="card-title">
              <h2>One-property run of show</h2>
              <Badge tone="est">Draft</Badge>
            </div>
            <p className="lead">Repeat for a five-property tour. No attendance or impression forecasts are attached.</p>
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

        <p className="section-label"><span>05</span> Investment measures</p>
        <section className="card">
          <div className="card-head">
            <h2>How value will be calculated</h2>
            <p className="lead">
              Ready to fill when Gila River returns verified results. Not calculated from channel-wide views.
            </p>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Measure</th>
                  <th>Formula</th>
                  <th className="num">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cost per 1,000 views</td>
                  <td>Investment ÷ attributable views × 1,000</td>
                  <td className="num"><Badge tone="wait">Pending</Badge></td>
                </tr>
                <tr>
                  <td>Cost per engagement</td>
                  <td>Investment ÷ engagement actions</td>
                  <td className="num"><Badge tone="wait">Pending</Badge></td>
                </tr>
                <tr>
                  <td>Cost per player</td>
                  <td>Promo spend ÷ verified new / reactivated players</td>
                  <td className="num"><Badge tone="wait">Pending</Badge></td>
                </tr>
                <tr>
                  <td>Views after the visit</td>
                  <td>Published video views at 30 / 60 / 90 days</td>
                  <td className="num"><Badge tone="wait">Pending</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card internal">
          <div className="card-head">
            <div className="card-title">
              <h2>Internal checklist</h2>
              <Badge tone="wait">Team only</Badge>
            </div>
            <p className="lead">Hidden when you print to PDF. Close these before the next client send.</p>
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
