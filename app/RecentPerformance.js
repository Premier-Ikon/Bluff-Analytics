"use client";

import PlatformIcon from "./PlatformIcon";
import { recent } from "../data/recent";
import { engagementRate, measuredMetaViews, social } from "../data/social";

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

function measuredPosts(pack) {
  if (!pack || pack.postsEstimated || pack.postsLast60 == null) return null;
  return pack.postsLast60;
}

function platformRows(slug, posts) {
  const pack = social[slug] || {};
  const ig = pack.instagram;
  const fb = pack.facebook;
  const igViews = measuredMetaViews(ig);
  const fbViews = measuredMetaViews(fb);
  const igPosts = measuredPosts(ig);
  const fbPosts = measuredPosts(fb);
  const ytRate = posts.all.engagement;
  const igRate =
    ig?.interactions != null && igViews != null ? engagementRate(ig.interactions, ig.views) : null;
  const fbRate =
    fb?.engagement != null && fbViews != null && !fb.engagementEstimated
      ? engagementRate(fb.engagement, fb.views)
      : null;
  const ytActions = actionsFromRate(posts.all.views, ytRate);
  const igActions = ig?.interactions != null && !ig.interactionsEstimated ? ig.interactions : null;
  // Bluff IG interactions are estimated from Meta split — still show for Bluff (slug === bluff)
  const igActionsDisplay =
    slug === "bluff" && ig?.interactions != null
      ? ig.interactions
      : igActions;

  const fbActions =
    fb?.engagement != null && !fb.engagementEstimated
      ? fb.engagement
      : slug === "bluff" && fb?.engagement != null
        ? fb.engagement
        : null;

  return [
    {
      name: "YouTube",
      posts: posts.all.videos.toLocaleString("en-US"),
      views: compact(posts.all.views),
      actions: ytActions != null ? compact(ytActions) : "—",
      avgViews: compact(posts.all.avgViews),
      engagement: rate(ytRate),
      filled: true,
    },
    {
      name: "Instagram",
      posts: igPosts != null ? igPosts.toLocaleString("en-US") : "—",
      views: igViews != null ? compact(igViews) : "—",
      actions: igActionsDisplay != null ? compact(igActionsDisplay) : "—",
      avgViews:
        igViews != null && igPosts != null ? compact(Math.round(igViews / igPosts)) : "—",
      engagement: igRate != null ? rate(igRate) : igActionsDisplay != null && igViews != null
        ? rate(engagementRate(igActionsDisplay, ig.views))
        : "—",
      filled: Boolean(igViews != null || igPosts != null || igActionsDisplay != null),
    },
    {
      name: "Facebook",
      posts: fbPosts != null ? fbPosts.toLocaleString("en-US") : "—",
      views: fbViews != null ? compact(fbViews) : "—",
      actions: fbActions != null ? compact(fbActions) : "—",
      avgViews:
        fbViews != null && fbPosts != null ? compact(Math.round(fbViews / fbPosts)) : "—",
      engagement: fbRate != null
        ? rate(fbRate)
        : fbActions != null && fbViews != null
          ? rate(engagementRate(fbActions, fb.views))
          : "—",
      filled: Boolean(fbViews != null || fbPosts != null || fbActions != null),
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
  const posts = data.last90;
  const platforms = platformRows(slug, posts);

  return (
    <>
      <section className="card">
        <div className="card-head">
          <p className="kicker kicker-with-icon">
            <PlatformIcon name="YouTube" />
            YouTube performance
          </p>
          <h2>Q2 + Q3 2026</h2>
          <p className="lead">Lifetime views on videos published Apr 1 – Sep 30</p>
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
          </tbody>
        </table></div>
      </section>

      <section className="card">
        <div className="card-head">
          <p className="kicker">Posting frequency</p>
          <h2>Posts in the past 90 days</h2>
          <p className="lead">July 9th 2026 – October 7th 2026</p>
        </div>
        <div className="platform-list narrow-only">
          {platforms.map((platform) => (
            <article key={platform.name}>
              <strong className="platform-name">
                <PlatformIcon name={platform.name} />
                {platform.name}
              </strong>
              <span><b>{platform.posts}</b> posts</span>
              <span><b>{platform.views}</b> views</span>
              <span><b>{platform.actions}</b> likes / comments</span>
              <span><b>{platform.avgViews}</b> avg views</span>
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
                <th className="num">Views</th>
                <th className="num">Likes / comments</th>
                <th className="num">Average views</th>
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
                  <td className="num">{platform.views}</td>
                  <td className="num">{platform.actions}</td>
                  <td className="num">{platform.avgViews}</td>
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
