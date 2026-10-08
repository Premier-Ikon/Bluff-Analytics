"use client";

import { useId } from "react";
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

function PlatformIcon({ name }) {
  const gradId = useId().replace(/:/g, "");
  if (name === "YouTube") {
    return (
      <svg className="platform-icon youtube-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#FF0000"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8z"
        />
        <path fill="#fff" d="M9.75 15.5v-7L16 12l-6.25 3.5z" />
      </svg>
    );
  }
  if (name === "Instagram") {
    return (
      <svg className="platform-icon instagram-icon" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f58529" />
            <stop offset="50%" stopColor="#dd2a7b" />
            <stop offset="100%" stopColor="#515bd4" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" fill={`url(#${gradId})`} />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" />
      </svg>
    );
  }
  if (name === "Facebook") {
    return (
      <svg className="platform-icon facebook-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.32 0 2.7.24 2.7.24v2.97h-1.52c-1.5 0-1.97.93-1.97 1.89v2.26h3.35l-.54 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07z"
        />
      </svg>
    );
  }
  return null;
}

function platformRows(slug, posts) {
  const pack = social[slug] || {};
  const ig = pack.instagram;
  const fb = pack.facebook;
  const meta = pack.meta;
  const ytRate = posts.all.engagement;
  const igRate = ig?.interactions != null ? engagementRate(ig.interactions, ig.views) : null;
  const fbRate =
    slug === "brettski"
      ? 2.8
      : fb?.engagement != null
        ? engagementRate(fb.engagement, fb.views)
        : null;
  const metaRate = meta ? engagementRate(meta.interactions, meta.views) : null;
  const igRateUsed = igRate ?? (slug === "bluff" ? metaRate : null);
  const fbRateUsed = fbRate ?? (slug === "bluff" ? metaRate : null);
  const ytActions = actionsFromRate(posts.all.views, ytRate);
  const igActions =
    ig?.interactions != null
      ? ig.interactions
      : ig && igRateUsed != null
        ? actionsFromRate(ig.views, igRateUsed)
        : null;
  const fbActions =
    fb?.engagement != null && slug !== "brettski"
      ? fb.engagement
      : fb && fbRateUsed != null
        ? actionsFromRate(fb.views, fbRateUsed)
        : null;
  const igEng = igRateUsed != null ? rate(igRateUsed) : "—";
  const fbEng = fbRateUsed != null ? rate(fbRateUsed) : "—";

  return [
    {
      name: "YouTube",
      posts: posts.all.videos.toLocaleString("en-US"),
      reach: compact(posts.all.views),
      actions: ytActions != null ? compact(ytActions) : "—",
      avgImpressions: compact(posts.all.avgViews),
      engagement: rate(ytRate),
      filled: true,
    },
    {
      name: "Instagram",
      posts: ig?.postsLast60 != null ? ig.postsLast60.toLocaleString("en-US") : "—",
      reach: ig ? compact(ig.views) : "—",
      actions: igActions != null ? compact(igActions) : "—",
      avgImpressions: ig?.avgImpressions != null ? compact(ig.avgImpressions) : "—",
      engagement: igEng,
      filled: Boolean(ig),
    },
    {
      name: "Facebook",
      posts: fb?.postsLast60 != null ? fb.postsLast60.toLocaleString("en-US") : "—",
      reach: fb ? compact(fb.views) : "—",
      actions: fbActions != null ? compact(fbActions) : "—",
      avgImpressions: fb?.avgImpressions != null ? compact(fb.avgImpressions) : "—",
      engagement: fbEng,
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
          <p className="kicker kicker-with-icon">
            <PlatformIcon name="YouTube" />
            YouTube performance
          </p>
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
          <p className="lead">August 9th 2026 – October 7th 2026</p>
        </div>
        <div className="platform-list narrow-only">
          {platforms.map((platform) => (
            <article key={platform.name}>
              <strong className="platform-name">
                <PlatformIcon name={platform.name} />
                {platform.name}
              </strong>
              <span><b>{platform.posts}</b> posts</span>
              <span><b>{platform.reach}</b> reach</span>
              <span><b>{platform.actions}</b> likes / comments</span>
              <span><b>{platform.avgImpressions}</b> avg impressions</span>
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
                <th className="num">Avg impressions</th>
                <th className="num">Engagement rate</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((platform) => (
                <tr key={platform.name}>
                  <td>
                    <span className="platform-name">
                      <PlatformIcon name={platform.name} />
                      {platform.name}
                    </span>
                  </td>
                  <td className="num">{platform.posts}</td>
                  <td className="num">{platform.reach}</td>
                  <td className="num">{platform.actions}</td>
                  <td className="num">{platform.avgImpressions}</td>
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
