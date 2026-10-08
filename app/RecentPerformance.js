"use client";

import { recent } from "../data/recent";
import { engagementRate, social } from "../data/social";

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
  const igRate = ig ? engagementRate(ig.interactions, ig.views) : null;
  const fbRate = fb ? engagementRate(fb.engagement, fb.views) : null;

  return [
    {
      name: "YouTube",
      posts: posts.all.videos.toLocaleString("en-US"),
      impressions: "Unavailable",
      avgViews: compact(posts.all.avgViews),
      engagement: rate(posts.all.engagement),
      note: null,
      filled: true,
    },
    {
      name: "Instagram",
      posts: ig?.postsLast60 != null ? ig.postsLast60.toLocaleString("en-US") : "Unavailable",
      impressions: "Unavailable",
      avgViews: ig ? `${compact(Math.round(ig.views / ig.days))}/day` : "Unavailable",
      engagement: igRate != null ? rate(igRate) : "Unavailable",
      note: ig ? `${compact(ig.views)} views · ${ig.days} days · ${ig.window}` : null,
      filled: Boolean(ig),
    },
    {
      name: "Facebook",
      posts: "Unavailable",
      impressions: "Unavailable",
      avgViews: fb ? compact(fb.views) : "Unavailable",
      engagement: fbRate != null ? rate(fbRate) : "Unavailable",
      note: fb ? `${fb.window} · ${compact(fb.engagement)} engagement actions` : null,
      filled: Boolean(fb),
    },
    {
      name: "TikTok",
      posts: "Unavailable",
      impressions: "Unavailable",
      avgViews: "Unavailable",
      engagement: "Unavailable",
      note: null,
      filled: false,
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

  return (
    <section className="card">
      <div className="card-head">
        <h2>Last two quarters</h2>
        <p className="lead">
          Q2 is April through June 2026. Q3 is July through September 2026. Counts are YouTube videos posted in each quarter. Engagement rate is likes plus comments, divided by views. Reach and impressions are separate from views, and this export does not include them.
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
            <td>Average reach</td>
            <td className="missing" colSpan={5}>Unavailable</td>
          </tr>
          <tr>
            <td>Average impressions</td>
            <td className="missing" colSpan={5}>Unavailable</td>
          </tr>
        </tbody>
      </table></div>
      <p className="caption">
        Total is both quarters and both formats. Average views and the engagement rate there are weighted by views. Average reach and average impressions stay unavailable until a Studio export provides them.
      </p>

      <h3>Posts in the last 60 days</h3>
      <p className="lead">
        August 9 through October 7, 2026 for YouTube. Instagram and Facebook windows follow the screenshots for that creator.
      </p>
      <div className="platform-list narrow-only">
        {platforms.map((platform) => (
          <article key={platform.name}>
            <strong>{platform.name}</strong>
            {platform.filled ? (
              <>
                <span><b>{platform.posts}</b> posts</span>
                <span><b>{platform.avgViews}</b> {platform.name === "Facebook" ? "views" : "avg views"}</span>
                <span><b>{platform.engagement}</b> engagement</span>
                <span>{platform.impressions === "Unavailable" ? "Impressions unavailable" : platform.impressions}</span>
                {platform.note ? <span className="span-all">{platform.note}</span> : null}
              </>
            ) : (
              <span className="span-all">Posts, views, impressions, and engagement are unavailable</span>
            )}
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
              <td className={platform.posts === "Unavailable" ? "num missing" : "num"}>{platform.posts}</td>
              <td className="num missing">{platform.impressions}</td>
              <td className={platform.avgViews === "Unavailable" ? "num missing" : "num"}>{platform.avgViews}</td>
              <td className={platform.engagement === "Unavailable" ? "num missing" : "num"}>{platform.engagement}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <p className="caption">
        Instagram post counts were not in the screenshots. Shares and saves are unavailable. YouTube’s engagement rate uses likes and comments only. Instagram uses interactions divided by views.
      </p>
    </section>
  );
}
