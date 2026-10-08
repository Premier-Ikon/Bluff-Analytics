"use client";

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

function Mini({ label, value, hint }) {
  return (
    <article className="mini">
      <div className="mini-label">{label}</div>
      <div className="mini-value">{value}</div>
      {hint ? <div className="metric-hint">{hint}</div> : null}
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
      { label: "13–17", share: null },
      { label: "18–24", share: null },
      { label: "25–34", share: null },
      { label: "35–44", share: null },
      { label: "45–54", share: null },
      { label: "55–64", share: null },
      { label: "65+", share: null },
    ],
    peakActive: null,
  };
}

export default function SocialChannels({ slug }) {
  const pack = social[slug] || {};
  const meta = pack.meta || null;
  const ig = pack.instagram || null;
  const fb = pack.facebook || null;
  const mgmRewards = pack.mgmRewards || null;

  const igRate = ig?.interactions != null ? engagementRate(ig.interactions, ig.views) : null;
  const metaRate = meta ? engagementRate(meta.interactions, meta.views) : null;
  const fbRate = fb?.engagement != null ? engagementRate(fb.engagement, fb.views) : null;
  const audience = ig?.audience || emptyAudience();
  const formats = ig?.formats || { reels: null, stories: null, posts: null, live: null };
  const topRows = ig?.topByViews?.length
    ? ig.topByViews.slice(0, 4)
    : [
        { title: "Unavailable for this creator", views: null },
        { title: "Unavailable for this creator", views: null },
        { title: "Unavailable for this creator", views: null },
        { title: "Unavailable for this creator", views: null },
      ];

  const reachValue = ig?.reach ?? ig?.viewers ?? null;
  const reachHint = ig?.reach != null
    ? "Unique people · Instagram"
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
    <section className="card">
      <div className="card-head">
        <p className="kicker">Meta social</p>
        <h2>Instagram and Facebook</h2>
        <p className="lead">
          Same layout for every creator. Missing exports show as unavailable — not a different page.
        </p>
      </div>

      <h3>Meta combined · Instagram and Facebook</h3>
      <div className="metrics package">
        <Metric
          label="Views"
          value={meta ? compact(meta.views) : "—"}
          hint={meta ? `${meta.window}${meta.viewsChangePct != null ? ` · +${meta.viewsChangePct}%` : ""}` : "Unavailable"}
        />
        <Metric
          label="Reach"
          value={meta ? compact(meta.reach) : "—"}
          hint={meta ? `Unique people${meta.reachChangePct != null ? ` · +${meta.reachChangePct}%` : ""}` : "Unavailable"}
        />
        <Metric
          label="Interactions"
          value={meta ? compact(meta.interactions) : "—"}
          hint={meta ? `${rate(metaRate)} of views` : "Unavailable"}
        />
        <Metric
          label="Est. impressions"
          value={meta ? compact(meta.impressions) : "—"}
          hint={meta ? "Estimate · views used as proxy" : "Unavailable"}
        />
      </div>
      <p className="caption">
        {meta
          ? `${meta.source}. Reach is Meta’s period total, not the sum of daily reach.`
          : "Combined Meta overview not exported for this creator."}
      </p>

      <h3>Instagram</h3>
      <div className="metrics package">
        <Metric
          label="Views"
          value={ig ? compact(ig.views) : "—"}
          hint={ig ? `${ig.window} · ${ig.days} days` : "Unavailable"}
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
              ? `${rate(igRate)} of views`
              : meta
                ? "Included in Meta combined above"
                : "Unavailable"
          }
        />
        <Metric label="Reach / viewers" value={compact(reachValue)} hint={reachHint} />
        <Metric label="Followers" value={followersValue} hint={followersHint} />
      </div>

      <h3>Views by format</h3>
      <div className="blank-grid social-formats">
        <article className="q-card">
          <h3>Reels</h3>
          <div className="metric-value">{compact(formats.reels)}</div>
        </article>
        <article className="q-card">
          <h3>Stories</h3>
          <div className="metric-value">{compact(formats.stories)}</div>
        </article>
        <article className="q-card">
          <h3>Posts</h3>
          <div className="metric-value">{compact(formats.posts)}</div>
        </article>
        <article className="q-card">
          <h3>Live</h3>
          <div className="metric-value">{compact(formats.live)}</div>
        </article>
      </div>
      <p className="caption">
        {ig?.followerViewShare != null
          ? `View split: ${ig.followerViewShare}% followers · ${ig.nonFollowerViewShare}% non-followers.`
          : ig?.formats
            ? "Format views from the creator export for this window."
            : "Format breakout unavailable for this creator."}
      </p>

      <h3>Audience</h3>
      <div className="social-split">
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
            {audience.countries.map((row) => (
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
            {audience.ages.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.share != null ? `${row.share}%` : "—"}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article className="q-card">
          <h3>When they are active</h3>
          <p className="lead" style={{ marginTop: 8 }}>
            {audience.peakActive || "Unavailable"}
          </p>
          <p className="caption">From Instagram’s follower active-times chart when exported.</p>
        </article>
      </div>

      <h3>Profile activity</h3>
      <div className="band">
        <Mini
          label="Profile visits"
          value={ig?.profileVisits != null ? compact(ig.profileVisits) : "—"}
          hint={ig?.profileVisits != null ? "In window" : "Unavailable"}
        />
        <Mini
          label="Link clicks"
          value={ig?.bioLinkTaps != null ? compact(ig.bioLinkTaps) : "—"}
          hint={ig?.bioLinkTaps != null ? "Bio link taps" : "Unavailable"}
        />
        <Mini
          label="Posts · last 60 days"
          value={ig?.postsLast60 != null ? ig.postsLast60.toLocaleString("en-US") : "—"}
          hint={
            ig?.postsEstimated
              ? "Estimate"
              : ig?.postsLast60Breakdown
                ? `${ig.postsLast60Breakdown.reels} Reels · ${ig.postsLast60Breakdown.stories} Stories`
                : ig?.postsLast60 != null
                  ? "Measured"
                  : "Unavailable"
          }
        />
      </div>
      <div className="band">
        <Mini
          label="Est. impressions"
          value={ig?.impressions != null ? compact(ig.impressions) : "—"}
          hint="Views used as proxy"
        />
        <Mini
          label="Avg impressions"
          value={ig?.avgImpressions != null ? compact(ig.avgImpressions) : "—"}
          hint="Per post · estimate"
        />
        <Mini
          label="Avg reach / viewers"
          value={
            ig?.avgReach != null
              ? compact(ig.avgReach)
              : ig?.viewers != null
                ? compact(ig.viewers)
                : "—"
          }
          hint={ig?.avgReach != null ? "Viewers ÷ posts" : "Unique viewers when available"}
        />
      </div>

      <h3>Facebook</h3>
      <div className="metrics package">
        <Metric
          label="Views"
          value={fb ? compact(fb.views) : "—"}
          hint={fb ? `${fb.window}${fb.viewsEstimated ? " · estimate" : ""}` : "Unavailable"}
        />
        <Metric
          label="Engagement"
          value={fb?.engagement != null ? compact(fb.engagement) : "—"}
          hint={fb?.engagement != null ? `${rate(fbRate)} of views` : "Unavailable"}
        />
        <Metric
          label="Posts · last 60 days"
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
      <p className="caption">{fb ? `${fb.source}.` : "Facebook export unavailable for this creator."}</p>

      <h3>Top Instagram content by views</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th className="num">Views</th>
            </tr>
          </thead>
          <tbody>
            {topRows.map((row, index) => (
              <tr key={`${row.title}-${index}`}>
                <td>{row.title}</td>
                <td className="num">{row.views != null ? compact(row.views) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="caption">
        {ig?.topByViews?.length
          ? "Top Reels from the Instagram export."
          : "Top content list unavailable for this creator."}
      </p>

      <h3>MGM Rewards</h3>
      <div className="band">
        <Mini
          label="Tier"
          value={mgmRewards?.tier || "—"}
          hint={mgmRewards ? `Member #${mgmRewards.memberId}` : "Unavailable"}
        />
        <Mini
          label="Tier credits"
          value={mgmRewards ? compact(mgmRewards.tierCredits) : "—"}
          hint={mgmRewards ? "Player status" : "Unavailable"}
        />
        <Mini
          label="Rewards points"
          value={mgmRewards ? compact(mgmRewards.rewardsPoints) : "—"}
          hint={
            mgmRewards
              ? `$${mgmRewards.compsValue.toLocaleString("en-US")} in comps`
              : "Unavailable"
          }
        />
      </div>
      <p className="caption">
        {mgmRewards
          ? `From ${mgmRewards.name}’s MGM Rewards app. Creator player status, not a property activation result.`
          : "MGM Rewards status not provided for this creator."}
      </p>
    </section>
  );
}
