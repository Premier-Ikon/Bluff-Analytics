"use client";

import PlatformIcon from "./PlatformIcon";
import {
  displayMetaPosts,
  displayMetaViews,
  engagementRate,
  social,
} from "../data/social";

const compact = (n) => {
  if (n == null) return "—";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const text = m >= 10 ? m.toFixed(1) : m.toFixed(2);
    return `${text.replace(/\.0$/, "")}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    const text = Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1);
    return `${text.replace(/\.0$/, "")}K`;
  }
  return n.toLocaleString("en-US");
};

const rate = (value) => (value == null ? "—" : `${value.toFixed(2)}%`);

const withEstimate = (text, estimated) => (estimated ? `~${text}` : text);

function Metric({ label, value, hint }) {
  return (
    <article className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-hint">{hint}</div>
    </article>
  );
}

function emptyAudience() {
  return {
    men: null,
    women: null,
    countries: [
      { name: "United States", share: null },
      { name: "United Kingdom", share: null },
      { name: "Canada", share: null },
      { name: "Australia", share: null },
      { name: "Mexico", share: null },
    ],
    ages: [
      { label: "18–24", share: null },
      { label: "25–34", share: null },
      { label: "35–44", share: null },
      { label: "45–54", share: null },
      { label: "55–64", share: null },
      { label: "65+", share: null },
    ],
    cities: [],
  };
}

function windowLead(pack, fallback) {
  if (pack?.window) return pack.window;
  return fallback;
}

function daysHint(pack) {
  if (!pack?.days) return "Unavailable";
  return `${pack.days} days`;
}

export default function SocialChannels({ slug }) {
  const pack = social[slug] || {};
  const ig = pack.instagram || null;
  const fb = pack.facebook || null;
  const meta = pack.meta || null;
  const isBluff = slug === "bluff";

  const igViewsDisplay = displayMetaViews(ig);
  const fbViewsDisplay = displayMetaViews(fb);

  const igActions =
    ig?.interactions != null && (isBluff || !ig.interactionsEstimated) ? ig.interactions : null;
  const igActionsEstimated = Boolean(ig?.interactionsEstimated && igActions != null);
  const fbActions = fb?.engagement != null ? fb.engagement : null;
  const fbActionsEstimated = Boolean(fb?.engagementEstimated && fbActions != null);

  const igRate =
    igActions != null && igViewsDisplay?.value != null
      ? engagementRate(igActions, igViewsDisplay.value)
      : null;
  const igRateEstimated = Boolean(igRate != null && (igActionsEstimated || igViewsDisplay?.estimated));
  const fbRate =
    fbActions != null && fbViewsDisplay?.value != null
      ? engagementRate(fbActions, fbViewsDisplay.value)
      : null;
  const fbRateEstimated = Boolean(fbRate != null && (fbActionsEstimated || fbViewsDisplay?.estimated));

  // Audience: Bluff Meta export, or partner IG audience from screenshots
  const audience = meta?.audience || ig?.audience || emptyAudience();
  const hasAudience =
    audience.men != null ||
    (audience.countries || []).some((row) => row.share != null) ||
    (audience.ages || []).some((row) => row.share != null);
  const topCountries = (audience.countries || []).slice(0, 5);
  const topCities = (audience.cities || []).slice(0, 5);

  const igPostsDisplay = displayMetaPosts(ig);
  const igBreakdown = ig?.postsLast60Breakdown;
  const igPostsHint = (() => {
    if (igPostsDisplay == null) return "—";
    if (igPostsDisplay.estimated) return "Estimate";
    if (!igBreakdown) return "Jul 10 – Oct 7 export";
    if (igBreakdown.feed != null || igBreakdown.stories != null) {
      return `${igBreakdown.feed || 0} feed · ${igBreakdown.stories || 0} stories`;
    }
    if (igBreakdown.reels != null) {
      return `${igBreakdown.reels} reels · ${igBreakdown.carousels || 0} carousels · ${igBreakdown.images || 0} images`;
    }
    return "Jul 10 – Oct 7 export";
  })();

  const fbPostsDisplay = displayMetaPosts(fb);
  const fbBreakdown = fb?.postsLast60Breakdown;
  const fbPostsHint = (() => {
    if (fbPostsDisplay == null) return "—";
    if (fbPostsDisplay.estimated) return "Estimate";
    if (fbBreakdown?.videos != null) {
      return `${fbBreakdown.videos} videos · ${fbBreakdown.photos || 0} photos · ${fbBreakdown.text || 0} text`;
    }
    return daysHint(fb);
  })();

  return (
    <>
      <section className="card">
        <div className="card-head">
          <p className="kicker kicker-with-icon">
            <PlatformIcon name="Instagram" />
            Instagram
          </p>
          <h2>Instagram performance</h2>
          <p className="lead">{windowLead(ig, "Measured Instagram window")}</p>
        </div>
        <div className="metrics metrics-3 package">
          <Metric
            label="Views"
            value={
              igViewsDisplay != null
                ? withEstimate(compact(igViewsDisplay.value), igViewsDisplay.estimated)
                : "—"
            }
            hint={
              igViewsDisplay != null
                ? igViewsDisplay.estimated
                  ? "Estimate"
                  : daysHint(ig)
                : "—"
            }
          />
          <Metric
            label="Interactions"
            value={
              igActions != null
                ? `${compact(igActions)}${ig.interactionsExact === false ? "+" : ""}`
                : "—"
            }
            hint={
              igActions != null
                ? `${withEstimate(rate(igRate), igRateEstimated)} of views`
                : "—"
            }
          />
          <Metric
            label="Posts"
            value={
              igPostsDisplay != null
                ? withEstimate(igPostsDisplay.value.toLocaleString("en-US"), igPostsDisplay.estimated)
                : "—"
            }
            hint={igPostsHint}
          />
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <p className="kicker kicker-with-icon">
            <PlatformIcon name="Facebook" />
            Facebook
          </p>
          <h2>Facebook performance</h2>
          <p className="lead">
            {fbViewsDisplay != null || fbActions != null || fbPostsDisplay != null
              ? windowLead(fb, "Facebook window")
              : "No Facebook data yet"}
          </p>
        </div>
        <div className="metrics metrics-3 package">
          <Metric
            label="Views"
            value={
              fbViewsDisplay != null
                ? withEstimate(compact(fbViewsDisplay.value), fbViewsDisplay.estimated)
                : "—"
            }
            hint={
              fbViewsDisplay != null
                ? fbViewsDisplay.estimated
                  ? "Estimate"
                  : daysHint(fb)
                : "—"
            }
          />
          <Metric
            label="Engagement"
            value={
              fbActions != null
                ? withEstimate(compact(fbActions), fbActionsEstimated)
                : "—"
            }
            hint={
              fbActions != null
                ? fbActionsEstimated
                  ? `${withEstimate(rate(fbRate), fbRateEstimated)} of views · Estimate`
                  : `${rate(fbRate)} of views`
                : "—"
            }
          />
          <Metric
            label="Posts"
            value={
              fbPostsDisplay != null
                ? withEstimate(fbPostsDisplay.value.toLocaleString("en-US"), fbPostsDisplay.estimated)
                : "—"
            }
            hint={fbPostsHint}
          />
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <p className="kicker">Meta social</p>
          <h2>Meta audience breakout</h2>
          <p className="lead">
            {hasAudience
              ? `${windowLead(meta || ig, "Audience from Insights")} · Instagram${meta ? " + Facebook" : ""}`
              : "No measured audience breakout yet"}
          </p>
        </div>
        <div className={`audience-grid${topCities.length ? " audience-grid-cities" : ""}`}>
          <article className="q-card">
            <h3>Gender</h3>
            <dl>
              <div><dt>Men</dt><dd>{audience.men != null ? `${audience.men}%` : "—"}</dd></div>
              <div><dt>Women</dt><dd>{audience.women != null ? `${audience.women}%` : "—"}</dd></div>
            </dl>
          </article>
          <article className="q-card">
            <h3>Top countries</h3>
            <dl>
              {topCountries.map((row) => (
                <div key={row.name}>
                  <dt>{row.name}</dt>
                  <dd>{row.share != null ? `${row.share}%` : "—"}</dd>
                </div>
              ))}
            </dl>
          </article>
          <article className="q-card">
            <h3>Age</h3>
            <dl>
              {(audience.ages || []).map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.share != null ? `${row.share}%` : "—"}</dd>
                </div>
              ))}
            </dl>
          </article>
          {topCities.length ? (
            <article className="q-card">
              <h3>Top cities</h3>
              <dl>
                {topCities.map((row) => (
                  <div key={row.name}>
                    <dt>{row.name}</dt>
                    <dd>{row.share != null ? `${row.share}%` : "—"}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ) : null}
        </div>
      </section>
    </>
  );
}
