"use client";

import Link from "next/link";
import AudienceMap from "./AudienceMap";
import PlatformIcon from "./PlatformIcon";
import { recent } from "../data/recent";
import { measuredMetaViews, social } from "../data/social";
import { usStates } from "../data/states";

const ROSTER_GEO_SCALE = 3;
const rosterStates = usStates.states.map((state) => ({
  ...state,
  views: Math.round(state.views * ROSTER_GEO_SCALE),
  hours: Math.round(state.hours * ROSTER_GEO_SCALE),
}));
const rosterUsViews = Math.round(usStates.usViews * ROSTER_GEO_SCALE);
const rosterUsHours = Math.round(usStates.usHours * ROSTER_GEO_SCALE);

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

function last90Stats(slug) {
  const row = recent[slug]?.last90?.all;
  if (!row) return { views: 0, videos: 0, engagement: 0, posts: 0, avgViews: 0 };
  return {
    views: row.views,
    videos: row.videos,
    engagement: row.engagement,
    posts: row.videos,
    avgViews: row.avgViews,
  };
}

const teamYtViews = creators.reduce((sum, creator) => sum + last90Stats(creator.slug).views, 0);

/** Meta team rollups: measured only. IG = all three; FB = Bluff + On Tilt (Brettski pending). */
const instagramViews = creators.reduce(
  (sum, creator) => sum + (measuredMetaViews(social[creator.slug]?.instagram) || 0),
  0,
);
const facebookViews = creators.reduce(
  (sum, creator) => sum + (measuredMetaViews(social[creator.slug]?.facebook) || 0),
  0,
);
const totalSubs = creators.reduce((sum, creator) => sum + creator.subscribers, 0);

/** 30-day potential: YT all three ÷ 3; Meta only from measured packs (no estimates). */
const potential30 = creators.reduce((sum, creator) => {
  const yt30 = Math.round((recent[creator.slug]?.last90?.all?.views || 0) / 3);
  return sum + yt30;
}, 0)
  + Math.round(instagramViews / 3)
  + Math.round(facebookViews / 3);

function measuredPosts(pack) {
  if (!pack || pack.postsEstimated || pack.postsLast60 == null) return null;
  return pack.postsLast60;
}

const plan = [
  ["Arrival", "Walkthrough, credentials, and a filming path signed off with security."],
  ["Filming", "Long-form and short-form on the floor. Branding and camera spots agreed first."],
  ["Meet-and-greet", "A set fan window with a headcount the property records."],
  ["Offers", "Giveaways or free play on property terms. Redemptions tracked by the casino."],
  ["Social posts", "Posts during and after the visit, counted by platform."],
  ["Follow-up", "Views at 7, 30, 60, and 90 days. Report each property, then the full tour."],
];

function CreatorLogo({ slug, name, className = "" }) {
  return (
    <img
      className={`creator-logo creator-logo-${slug} ${className}`.trim()}
      src={`/logos/${slug}.png`}
      alt={name}
    />
  );
}

export default function Page() {
  return (
    <>
      <header className="bar">
        <div className="wordmark">
          <span className="accent-bar" />
          <div>
            <div className="brand-name">MGM team summary</div>
            <div className="brand-meta">Team Summary · Past 90 days · Bluff · Brettski · On Tilt Boys</div>
          </div>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">Team Summary · Past 90 days</p>
            <h1>
              The combined reach of Bluff, Brettski, and On Tilt Boys
              <span className="hero-platforms" aria-label="YouTube, Instagram, and Facebook">
                <PlatformIcon name="YouTube" />
                <PlatformIcon name="Instagram" />
                <PlatformIcon name="Facebook" />
              </span>
              {" "}— and the property impact it can drive.
            </h1>
            <p>
              This brief stacks all three creators as one team: total audience, shared geography, and the upside for an MGM property activation. Channel-level detail lives on each creator tab.
            </p>
          </div>
          <div className="hero-stats">
            <article>
              <div className="metric-label metric-label-with-icon">
                <PlatformIcon name="YouTube" />
                YouTube views · team
              </div>
              <div className="metric-value">{compact(teamYtViews)}</div>
            </article>
            <article>
              <div className="metric-label metric-label-with-icon">
                <PlatformIcon name="Facebook" />
                Facebook views · team
              </div>
              <div className="metric-value">{compact(facebookViews)}</div>
              <div className="metric-hint">Bluff · On Tilt · Brettski pending</div>
            </article>
            <article>
              <div className="metric-label metric-label-with-icon">
                <PlatformIcon name="Instagram" />
                Instagram views · team
              </div>
              <div className="metric-value">{compact(instagramViews)}</div>
              <div className="metric-hint">Bluff · Brettski · On Tilt</div>
            </article>
            <article>
              <div className="metric-label">Combined subscribers</div>
              <div className="metric-value">{compact(totalSubs)}</div>
            </article>
          </div>
        </section>

        <section className="questions" aria-label="Decision answers">
          <article>
            <div className="metric-label">30-day potential</div>
            <h2>Team reach in market</h2>
            <p className="big-num">{compact(potential30)} views</p>
            <p>
              YouTube team run-rate plus measured Meta (Instagram all three · Facebook Bluff + On Tilt). Brettski Facebook pending export.
            </p>
          </article>
          <article>
            <div className="metric-label">30-day property exposure</div>
            <h2>Value of working with the team</h2>
            <p className="big-num">{compact(totalSubs)} fans</p>
            <p>
              {compact(potential30)} potential views in 30 days from measured channels — YouTube across the team, Meta where we have exports. Property-shot content that keeps working after the visit.
            </p>
          </article>
          <article>
            <div className="metric-label">Why this team</div>
            <h2>Built for the casino floor</h2>
            <p className="big-num">Casino-native</p>
            <p>
              Bluff, Brettski, and On Tilt Boys already film where guests play — slots, tables, and high-limit rooms. Their audience shows up for casino content; the property becomes the set.
            </p>
          </article>
        </section>

        <p className="section-label"><span>01</span> Where demand lives</p>
        <section className="card">
          <div className="card-head">
            <h2>Team audience geography</h2>
          </div>
          <AudienceMap
            states={rosterStates}
            usViews={rosterUsViews}
            usHours={rosterUsHours}
            estimated
            caption=""
          />
        </section>

        <p className="section-label"><span>02</span> Team breakdown · Past 90 days</p>
        <section className="card">
          <div className="card-head">
            <h2>Value by creator</h2>
            <p className="lead">
              Jul 9 – Oct 7 YouTube for all three. Meta cells are measured figures only — estimates show as —.
            </p>
          </div>

          <div className="compare-block">
            <div className="table-scroll compare-table">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    {creators.map((creator) => (
                      <th className="num creator-logo-th" key={creator.slug}>
                        <Link className="creator-logo-link" href={creator.href} aria-label={creator.name}>
                          <CreatorLogo slug={creator.slug} name={creator.name} className="creator-logo-table" />
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>YouTube views</td>
                    {creators.map((creator) => (
                      <td className="num" key={creator.slug}>{compact(last90Stats(creator.slug).views)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>YouTube engagement</td>
                    {creators.map((creator) => (
                      <td className="num" key={creator.slug}>{rate(last90Stats(creator.slug).engagement)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>YouTube posts</td>
                    {creators.map((creator) => (
                      <td className="num" key={creator.slug}>{last90Stats(creator.slug).posts.toLocaleString("en-US")}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Instagram views</td>
                    {creators.map((creator) => {
                      const views = measuredMetaViews(social[creator.slug]?.instagram);
                      return <td className="num" key={creator.slug}>{views != null ? compact(views) : "—"}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>IG posts</td>
                    {creators.map((creator) => {
                      const posts = measuredPosts(social[creator.slug]?.instagram);
                      return (
                        <td className="num" key={creator.slug}>
                          {posts != null ? posts.toLocaleString("en-US") : "—"}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td>Facebook views</td>
                    {creators.map((creator) => {
                      const views = measuredMetaViews(social[creator.slug]?.facebook);
                      return <td className="num" key={creator.slug}>{views != null ? compact(views) : "—"}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>FB posts</td>
                    {creators.map((creator) => {
                      const posts = measuredPosts(social[creator.slug]?.facebook);
                      return (
                        <td className="num" key={creator.slug}>
                          {posts != null ? posts.toLocaleString("en-US") : "—"}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <p className="section-label"><span>03</span> Sample property visit</p>
        <section className="card">
          <div className="card-head">
            <h2>How a property activation runs</h2>
            <p className="lead">
              Blueprint for turning team reach into on-property impact. Repeat across a multi-property tour; outcomes tracked per visit.
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
      </main>
    </>
  );
}
