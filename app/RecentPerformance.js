"use client";

import { recent } from "../data/recent";
import { engagementRate, social, youtubeImpressions } from "../data/social";

const compact = (n) => {
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

function cells(quarter) {
  return [quarter.shorts, quarter.longform];
}

const quarterLabels = ["Q2 Shorts", "Q2 Long-form", "Q3 Shorts", "Q3 Long-form"];

function QuarterCards({ columns, total }) {
  const cards = [
    ...columns.map((col, index) => ({ label: quarterLabels[index], ...col, total: false })),
    { label: "Total", ...total, total: true },
  ];
  return (
    <div className="q-grid">
      {cards.map((col) => (
        <article className={col.total ? "q-card total" : "q-card"} key={col.label}>
          <h3>{col.label}</h3>
          <dl>
            <div>
              <dt>Videos</dt>
              <dd>{col.videos.toLocaleString("en-US")}</dd>
            </div>
            <div>
              <dt>Views</dt>
              <dd>{compact(col.views)}</dd>
            </div>
            <div>
              <dt>Avg views</dt>
              <dd>{compact(col.avgViews)}</dd>
            </div>
            <div>
              <dt>Engagement</dt>
              <dd>{rate(col.engagement)}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

function platformRows(slug, posts) {
  const pack = social[slug] || {};
  const ig = pack.instagram;
  const fb = pack.facebook;
  const meta = pack.meta;
  const yt = youtubeImpressions(posts.all.views, posts.all.videos);
  const igRate = ig?.interactions != null ? engagementRate(ig.interactions, ig.views) : null;
  const fbRate = fb?.engagement != null ? engagementRate(fb.engagement, fb.views) : null;
  const metaRate = meta ? engagementRate(meta.interactions, meta.views) : null;

  return [
    {
      name: "YouTube",
      posts: yt.posts.toLocaleString("en-US"),
      postsNote: null,
      impressions: compact(yt.avgImpressions),
      impressionsNote: "Estimate · views ÷ posts",
      avgViews: compact(posts.all.avgViews),
      engagement: rate(posts.all.engagement),
      note: `${compact(posts.all.views)} views in the last 60 days`,
      filled: true,
    },
    {
      name: "Instagram",
      posts: ig?.postsLast60 != null ? ig.postsLast60.toLocaleString("en-US") : "—",
      postsNote: ig?.postsEstimated ? "Estimate" : null,
      impressions: ig?.avgImpressions != null ? compact(ig.avgImpressions) : "—",
      impressionsNote: ig?.impressionsEstimated ? "Estimate · views proxy" : null,
      avgViews: ig ? `${compact(Math.round(ig.views / ig.days))}/day` : "—",
      engagement: igRate != null ? rate(igRate) : meta && slug === "bluff" ? rate(metaRate) : "—",
      note: ig
        ? `${compact(ig.views)} views · ${ig.days} days${ig.postsLast60Breakdown ? ` · ${ig.postsLast60Breakdown.reels} Reels + ${ig.postsLast60Breakdown.stories} Stories` : ""}`
        : null,
      filled: Boolean(ig),
    },
    {
      name: "Facebook",
      posts: fb?.postsLast60 != null ? fb.postsLast60.toLocaleString("en-US") : "—",
      postsNote: fb?.postsEstimated ? "Estimate" : null,
      impressions: fb?.avgImpressions != null ? compact(fb.avgImpressions) : "—",
      impressionsNote: fb?.impressionsEstimated ? "Estimate · views proxy" : null,
      avgViews: fb ? compact(fb.views) : "—",
      engagement: fbRate != null ? rate(fbRate) : meta && slug === "bluff" ? rate(metaRate) : "—",
      note: fb
        ? `${fb.window}${fb.viewsEstimated ? " · views estimated" : ""}`
        : null,
      filled: Boolean(fb),
    },
  ];
}

export default function RecentPerformance({ slug }) {
  const data = recent[slug];
  const columns = [...cells(data.q2), ...cells(data.q3)];
  const bothViews = data.q2.all.views + data.q3.all.views;
  const bothVideos = data.q2.all.videos + data.q3.all.videos;
  const bothEngagement =
    (data.q2.all.engagement * data.q2.all.views + data.q3.all.engagement * data.q3.all.views) /
    bothViews;
  const posts = data.last60;
  const platforms = platformRows(slug, posts);
  const yt = youtubeImpressions(bothViews, bothVideos);
  const pack = social[slug] || {};
  const reachValue = pack.meta?.reach || pack.instagram?.viewers || null;
  const reachLabel = pack.meta?.reach
    ? `${compact(pack.meta.reach)} Meta reach · 90 days`
    : pack.instagram?.viewers
      ? `${compact(pack.instagram.viewers)} Instagram viewers`
      : "Estimate pending";

  return (
    <section className="card">
      <div className="card-head">
        <p className="kicker">YouTube performance</p>
        <h2>Last two quarters</h2>
        <p className="lead">
          Q2 is April–June 2026. Q3 is July–September 2026. Average impressions use views as a proxy until Studio exports them.
        </p>
      </div>
      <QuarterCards
        columns={columns}
        total={{
          videos: bothVideos,
          views: bothViews,
          avgViews: Math.round(bothViews / bothVideos),
          engagement: bothEngagement,
        }}
      />
      <div className="wide-only table-scroll"><table>
        <thead>
          <tr>
            <th></th>
            <th className="num">Q2 Shorts</th>
            <th className="num">Q2 Long-form</th>
            <th className="num">Q3 Shorts</th>
            <th className="num">Q3 Long-form</th>
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Videos posted</td>
            {columns.map((col, index) => (
              <td className="num" key={`videos-${index}`}>{col.videos.toLocaleString("en-US")}</td>
            ))}
            <td className="num">{bothVideos.toLocaleString("en-US")}</td>
          </tr>
          <tr>
            <td>Views</td>
            {columns.map((col, index) => (
              <td className="num" key={`views-${index}`}>{compact(col.views)}</td>
            ))}
            <td className="num">{compact(bothViews)}</td>
          </tr>
          <tr>
            <td>Average views</td>
            {columns.map((col, index) => (
              <td className="num" key={`avg-${index}`}>{compact(col.avgViews)}</td>
            ))}
            <td className="num">{compact(Math.round(bothViews / bothVideos))}</td>
          </tr>
          <tr>
            <td>Engagement rate</td>
            {columns.map((col, index) => (
              <td className="num" key={`eng-${index}`}>{rate(col.engagement)}</td>
            ))}
            <td className="num">{rate(bothEngagement)}</td>
          </tr>
          <tr>
            <td>Average impressions</td>
            {columns.map((col, index) => (
              <td className="num" key={`imp-${index}`}>{compact(col.avgViews)}</td>
            ))}
            <td className="num">{compact(yt.avgImpressions)}</td>
          </tr>
          <tr>
            <td>Reach / viewers</td>
            <td className="num" colSpan={5}>{reachLabel}</td>
          </tr>
        </tbody>
      </table></div>
      <p className="caption">
        Average impressions on YouTube are estimated as average views until Studio impressions by quarter are available. Reach uses Meta reach for Bluff and Instagram viewers for partners when those exist.
      </p>

      <h3>Posts in the last 60 days</h3>
      <p className="lead">
        August 9 through October 7, 2026 for YouTube. Instagram and Facebook post counts are measured for Bluff and estimated for partners from each creator’s YouTube posting rate versus Bluff.
      </p>
      <div className="platform-list narrow-only">
        {platforms.map((platform) => (
          <article key={platform.name}>
            <strong>{platform.name}</strong>
            <span><b>{platform.posts}</b> posts{platform.postsNote ? ` · ${platform.postsNote}` : ""}</span>
            <span><b>{platform.impressions}</b> avg impressions{platform.impressionsNote ? ` · ${platform.impressionsNote}` : ""}</span>
            <span><b>{platform.avgViews}</b> {platform.name === "Facebook" ? "views" : "avg views"}</span>
            <span><b>{platform.engagement}</b> engagement</span>
            {platform.note ? <span className="span-all">{platform.note}</span> : null}
          </article>
        ))}
      </div>
      <div className="wide-only table-scroll"><table>
        <thead>
          <tr>
            <th>Platform</th>
            <th className="num">Posts</th>
            <th className="num">Avg impressions</th>
            <th className="num">Views</th>
            <th className="num">Engagement rate</th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((platform) => (
            <tr key={platform.name}>
              <td>
                {platform.name}
                {platform.note ? <div className="metric-hint">{platform.note}</div> : null}
              </td>
              <td className="num">
                {platform.posts}
                {platform.postsNote ? <div className="metric-hint">{platform.postsNote}</div> : null}
              </td>
              <td className="num">
                {platform.impressions}
                {platform.impressionsNote ? <div className="metric-hint">{platform.impressionsNote}</div> : null}
              </td>
              <td className="num">{platform.avgViews}</td>
              <td className="num">{platform.engagement}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <p className="caption">
        Estimated impressions use views as a 1:1 proxy. Bluff Instagram posts are 92 Reels + 192 Stories. Partner social post counts scale Bluff’s measured counts by YouTube volume.
      </p>
    </section>
  );
}
