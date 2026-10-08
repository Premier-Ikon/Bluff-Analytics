"use client";

import { recent } from "../data/recent";
import { social, youtubeImpressions } from "../data/social";

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
  return [quarter.longform, quarter.shorts];
}

const quarterLabels = ["Q2 Long-form", "Q2 Short form", "Q3 Long-form", "Q3 Short form"];

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

function actionsFromRate(views, engagementPct) {
  if (views == null || engagementPct == null) return null;
  return Math.round((views * engagementPct) / 100);
}

/** Internal engagement rates for the posting-frequency table, by creator. */
const INTERNAL_ENGAGEMENT = {
  bluff: { youtube: 13.5, instagram: 15.6, facebook: 12.4 },
  brettski: { youtube: 11.4, instagram: 17.3, facebook: 13.2 },
  ontilt: { youtube: 10.2, instagram: 13.7, facebook: 16 },
};

function platformRows(slug, posts) {
  const pack = social[slug] || {};
  const ig = pack.instagram;
  const fb = pack.facebook;
  const rates = INTERNAL_ENGAGEMENT[slug] || INTERNAL_ENGAGEMENT.bluff;
  const ytRate = rates.youtube;
  const igRate = rates.instagram;
  const fbRate = rates.facebook;
  const ytActions = actionsFromRate(posts.all.views, ytRate);
  const igActions = ig ? actionsFromRate(ig.views, igRate) : null;
  const fbActions = fb ? actionsFromRate(fb.views, fbRate) : null;

  return [
    {
      name: "YouTube",
      posts: posts.all.videos.toLocaleString("en-US"),
      reach: compact(posts.all.views),
      actions: ytActions != null ? compact(ytActions) : "—",
      engagement: rate(ytRate),
      filled: true,
    },
    {
      name: "Instagram",
      posts: ig?.postsLast60 != null ? ig.postsLast60.toLocaleString("en-US") : "—",
      reach: ig ? compact(ig.views) : "—",
      actions: igActions != null ? compact(igActions) : "—",
      engagement: ig ? rate(igRate) : "—",
      filled: Boolean(ig),
    },
    {
      name: "Facebook",
      posts: fb?.postsLast60 != null ? fb.postsLast60.toLocaleString("en-US") : "—",
      reach: fb ? compact(fb.views) : "—",
      actions: fbActions != null ? compact(fbActions) : "—",
      engagement: fb ? rate(fbRate) : "—",
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

  return (
    <>
      <section className="card">
        <div className="card-head">
          <p className="kicker">YouTube performance</p>
          <h2>Q2 + Q3 2026</h2>
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
              <th className="num">Q2 Long-form</th>
              <th className="num">Q2 Short form</th>
              <th className="num">Q3 Long-form</th>
              <th className="num">Q3 Short form</th>
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
          </tbody>
        </table></div>
      </section>

      <section className="card">
        <div className="card-head">
          <p className="kicker">Posting frequency</p>
          <h2>Posts in the last 60 days</h2>
          <p className="lead">August 9th 2026 – October 9th 2026</p>
        </div>
        <div className="platform-list narrow-only">
          {platforms.map((platform) => (
            <article key={platform.name}>
              <strong>{platform.name}</strong>
              <span><b>{platform.posts}</b> posts</span>
              <span><b>{platform.reach}</b> reach</span>
              <span><b>{platform.actions}</b> likes / comments</span>
              <span><b>{platform.engagement}</b> engagement</span>
            </article>
          ))}
        </div>
        <div className="wide-only table-scroll">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th className="num">Posts</th>
                <th className="num">Reach</th>
                <th className="num">Likes / comments</th>
                <th className="num">Engagement rate</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((platform) => (
                <tr key={platform.name}>
                  <td>{platform.name}</td>
                  <td className="num">{platform.posts}</td>
                  <td className="num">{platform.reach}</td>
                  <td className="num">{platform.actions}</td>
                  <td className="num">{platform.engagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
