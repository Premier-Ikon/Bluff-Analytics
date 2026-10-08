"use client";

import { recent } from "../data/recent";

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

export default function RecentPerformance({ slug }) {
  const data = recent[slug];
  const columns = [...cells(data.q2), ...cells(data.q3)];
  const bothViews = data.q2.all.views + data.q3.all.views;
  const bothVideos = data.q2.all.videos + data.q3.all.videos;
  const bothEngagement =
    (data.q2.all.engagement * data.q2.all.views + data.q3.all.engagement * data.q3.all.views) /
    bothViews;
  const posts = data.last60;

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
        August 9 through October 7, 2026. YouTube posts are {posts.shorts.videos.toLocaleString("en-US")} Shorts and {posts.longform.videos.toLocaleString("en-US")} long-form.
      </p>
      <div className="platform-list narrow-only">
          <article>
            <strong>YouTube</strong>
            <span><b>{posts.all.videos.toLocaleString("en-US")}</b> posts</span>
            <span><b>{compact(posts.all.avgViews)}</b> avg views</span>
            <span><b>{rate(posts.all.engagement)}</b> engagement</span>
            <span>Impressions unavailable</span>
          </article>
          {["Instagram", "Facebook", "TikTok"].map((platform) => (
            <article key={platform}>
              <strong>{platform}</strong>
              <span className="span-all">Posts, views, impressions, and engagement are unavailable</span>
            </article>
          ))}
      </div>
      <div className="wide-only table-scroll"><table>
        <thead>
          <tr>
            <th>Platform</th>
            <th className="num">Posts</th>
            <th className="num">Avg impressions</th>
            <th className="num">Avg views</th>
            <th className="num">Engagement rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>YouTube</td>
            <td className="num">{posts.all.videos.toLocaleString("en-US")}</td>
            <td className="num missing">Unavailable</td>
            <td className="num">{compact(posts.all.avgViews)}</td>
            <td className="num">{rate(posts.all.engagement)}</td>
          </tr>
          {["Instagram", "Facebook", "TikTok"].map((platform) => (
            <tr key={platform}>
              <td>{platform}</td>
              <td className="num missing">Unavailable</td>
              <td className="num missing">Unavailable</td>
              <td className="num missing">Unavailable</td>
              <td className="num missing">Unavailable</td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <p className="caption">
        Shares and saves are unavailable. YouTube’s engagement rate uses likes and comments only.
      </p>
    </section>
  );
}
