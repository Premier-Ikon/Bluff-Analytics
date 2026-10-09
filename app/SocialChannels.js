"use client";

import PlatformIcon from "./PlatformIcon";
import { engagementRate, measuredMetaViews, social } from "../data/social";

const compact = (n) => {
  if (n == null) return "—";
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

const rate = (value) => (value == null ? "—" : `${value.toFixed(2)}%`);

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

  const igViews = measuredMetaViews(ig);
  const fbViews = measuredMetaViews(fb);

  const igActions =
    ig?.interactions != null && (isBluff || !ig.interactionsEstimated) ? ig.interactions : null;
  const fbActions =
    fb?.engagement != null && (isBluff || !fb.engagementEstimated) ? fb.engagement : null;

  const igRate = igActions != null && ig?.views != null ? engagementRate(igActions, ig.views) : null;
  const fbRate = fbActions != null && fb?.views != null ? engagementRate(fbActions, fb.views) : null;

  // Audience: Bluff Meta export, or partner IG audience from screenshots
  const audience = meta?.audience || ig?.audience || emptyAudience();
  const hasAudience =
    audience.men != null ||
    (audience.countries || []).some((row) => row.share != null) ||
    (audience.ages || []).some((row) => row.share != null);
  const topCountries = (audience.countries || []).slice(0, 5);
  const topCities = (audience.cities || []).slice(0, 5);

  const reachValue = ig?.reach ?? ig?.viewers ?? null;
  const reachHint = ig?.reach != null
    ? "Meta reach · measured window"
    : ig?.viewers != null
      ? "Unique viewers · Insights"
      : "—";

  const followersValue = ig?.followers != null
    ? compact(ig.followers)
    : ig?.netFollowers != null
      ? `+${compact(ig.netFollowers)}`
      : "—";
  const followersHint = ig?.followers != null
    ? `+${compact(ig.netFollowers)} in window · +${ig.followerGrowthPct}%`
    : ig?.netFollowers != null
      ? `Net follows · ${daysHint(ig)}`
      : "—";

  const fbPosts =
    fb && !fb.postsEstimated && fb.postsLast60 != null ? fb.postsLast60 : null;

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
        <div className="metrics package">
          <Metric
            label="Views"
            value={igViews != null ? compact(igViews) : "—"}
            hint={igViews != null ? daysHint(ig) : "—"}
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
                ? `${rate(igRate)} of views${ig.interactionsEstimated ? " · estimate" : ""}`
                : "—"
            }
          />
          <Metric label="Reach / viewers" value={compact(reachValue)} hint={reachHint} />
          <Metric label="Followers" value={followersValue} hint={followersHint} />
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
            {fbViews != null || fbActions != null || fbPosts != null
              ? windowLead(fb, "Measured Facebook window")
              : "No measured Facebook export yet"}
          </p>
        </div>
        <div className="metrics package">
          <Metric
            label="Views"
            value={fbViews != null ? compact(fbViews) : "—"}
            hint={fbViews != null ? daysHint(fb) : "—"}
          />
          <Metric
            label="Engagement"
            value={fbActions != null ? compact(fbActions) : "—"}
            hint={
              fbActions != null
                ? `${rate(fbRate)} of views${fb.engagementEstimated ? " · estimate" : ""}`
                : "—"
            }
          />
          <Metric
            label="Posts · measured window"
            value={fbPosts != null ? fbPosts.toLocaleString("en-US") : "—"}
            hint={fbPosts != null ? "Measured" : "—"}
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
