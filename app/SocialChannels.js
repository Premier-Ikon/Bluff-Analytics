"use client";

import PlatformIcon from "./PlatformIcon";
import { engagementRate, social } from "../data/social";

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

export default function SocialChannels({ slug }) {
  const pack = social[slug] || {};
  const ig = pack.instagram || null;
  const fb = pack.facebook || null;
  const meta = pack.meta || null;

  const igRate = ig?.interactions != null ? engagementRate(ig.interactions, ig.views) : null;
  const fbRate = fb?.engagement != null ? engagementRate(fb.engagement, fb.views) : null;
  const audience = meta?.audience || ig?.audience || emptyAudience();
  const topCountries = (audience.countries || []).slice(0, 5);
  const topCities = (audience.cities || []).slice(0, 5);

  const reachValue = ig?.reach ?? ig?.viewers ?? null;
  const reachHint = ig?.reach != null
    ? "Meta reach · 90-day window"
    : ig?.viewers != null
      ? "Unique viewers · not labeled reach"
      : "Unavailable";

  const followersValue = ig?.followers != null
    ? compact(ig.followers)
    : ig?.netFollowers != null
      ? `+${compact(ig.netFollowers)}`
      : "—";
  const followersHint = ig?.followers != null
    ? `+${compact(ig.netFollowers)} in window · +${ig.followerGrowthPct}%`
    : ig?.netFollowers != null
      ? `Net follows · ${ig.days}-day window`
      : "Unavailable";

  return (
    <>
      <section className="card">
        <div className="card-head">
          <p className="kicker kicker-with-icon">
            <PlatformIcon name="Instagram" />
            Instagram
          </p>
          <h2>Instagram performance</h2>
          <p className="lead">July 9th 2026 – October 7th 2026</p>
        </div>
        <div className="metrics package">
          <Metric
            label="Views"
            value={ig ? compact(ig.views) : "—"}
            hint={ig ? `${ig.days} days` : "Unavailable"}
          />
          <Metric
            label="Interactions"
            value={
              ig?.interactions != null
                ? `${compact(ig.interactions)}${ig.interactionsExact === false ? "+" : ""}`
                : "—"
            }
            hint={
              ig?.interactions != null
                ? `${rate(igRate)} of views${ig.interactionsEstimated ? " · estimate" : ""}`
                : "Unavailable"
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
          <p className="lead">July 9th 2026 – October 7th 2026</p>
        </div>
        <div className="metrics package">
          <Metric
            label="Views"
            value={fb ? compact(fb.views) : "—"}
            hint={fb ? `${fb.days} days${fb.viewsEstimated ? " · estimate" : ""}` : "Unavailable"}
          />
          <Metric
            label="Engagement"
            value={fb?.engagement != null ? compact(fb.engagement) : "—"}
            hint={
              fb?.engagement != null
                ? `${rate(fbRate)} of views${fb.engagementEstimated ? " · estimate" : ""}`
                : "Unavailable"
            }
          />
          <Metric
            label="Posts · past 90 days"
            value={fb?.postsLast60 != null ? fb.postsLast60.toLocaleString("en-US") : "—"}
            hint={fb?.postsEstimated ? "Estimate" : fb?.postsLast60 != null ? "Measured" : "Unavailable"}
          />
          <Metric
            label="Est. impressions"
            value={fb?.impressions != null ? compact(fb.impressions) : "—"}
            hint={
              fb?.avgImpressions != null
                ? `${compact(fb.avgImpressions)} avg · views proxy`
                : fb
                  ? "Views used as proxy"
                  : "Unavailable"
            }
          />
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <p className="kicker">Meta social</p>
          <h2>Meta audience breakout</h2>
          <p className="lead">
            July 9th 2026 – October 7th 2026 · combined Instagram and Facebook
            {audience.estimated ? " · estimate" : ""}
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
