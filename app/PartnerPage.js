"use client";

// import AudienceMap from "./AudienceMap";
import FormatSplit, { splitWatchHours } from "./FormatSplit";
import RecentPerformance from "./RecentPerformance";
import SocialChannels from "./SocialChannels";
import WatchChart, { yearRows } from "./WatchChart";
import { formatMonths } from "../data/formats";

const compact = (n) => {
  if (n >= 1_000_000_000) {
    const b = n / 1_000_000_000;
    const text = b >= 10 ? b.toFixed(1) : b.toFixed(2);
    return `${text.replace(/\.0$/, "")}B`;
  }
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

function prettyClock(value) {
  const parts = String(value).split(":").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return value;
  if (parts.length === 2) {
    const [m, s] = parts;
    if (!m) return `${s}s`;
    return `${m}m ${String(s).padStart(2, "0")}s`;
  }
  if (parts.length === 3) {
    const [h, m, s] = parts;
    if (h) return `${h}h ${m}m`;
    if (m) return `${m}m ${String(s).padStart(2, "0")}s`;
    return `${s}s`;
  }
  return value;
}

export default function PartnerPage({ partner }) {
  const format = formatMonths[partner.slug];
  const hours = splitWatchHours(partner.estimatedHours, format);
  const leadProperty = partner.properties[0];
  const other = partner.properties.slice(1);
  const otherViews = other.reduce((sum, row) => sum + row.views, 0);
  const otherVideos = other.reduce((sum, row) => sum + row.videos, 0);

  return (
    <>
      <header className="bar">
        <div className="wordmark">
          <span className="accent-bar" />
          <div>
            <div className="brand-name">{partner.name}</div>
            <div className="brand-meta">
              <a href={partner.url}>{partner.handle}</a>
              {" · "}
              {partner.since} – {partner.through}
            </div>
          </div>
        </div>
        <button className="pdf" type="button" onClick={() => window.print()}>
          Download PDF
        </button>
      </header>
      <main className="page">
        <p className="note">
          Views, subscribers, Shorts, and casino titles are counted from every public upload.
          YouTube’s channel counter reads {compact(partner.channelViews)}. The uploads add up to {compact(partner.views)}.
          Watch time, the monthly chart, and the state map are estimates: each view is counted for the full length of the video, up to Bluff’s measured average of 4 minutes 26 seconds, and the states use Bluff’s measured U.S. mix.
        </p>
        <section className="metrics" aria-label="Channel totals">
          <article className="metric">
            <div className="metric-label">Views</div>
            <div className="metric-value">{compact(partner.views)}</div>
            <div className="metric-hint">{compact(partner.subscribers)} subscribers</div>
          </article>
          <article className="metric">
            <div className="metric-label">Watch time</div>
            <div className="metric-value">{compact(partner.estimatedHours)}</div>
            <div className="metric-hint">Estimate · {partner.estimatedYears.toLocaleString("en-US")} years of viewing</div>
          </article>
          <article className="metric">
            <div className="metric-label">Long-form</div>
            <div className="metric-value">{compact(hours.longHours)}</div>
            <div className="metric-hint">Estimate · {hours.longShare}% of watch time</div>
          </article>
          <article className="metric">
            <div className="metric-label">Shorts</div>
            <div className="metric-value">{compact(hours.shortHours)}</div>
            <div className="metric-hint">Estimate · {hours.shortShare}% of watch time</div>
          </article>
        </section>

        <RecentPerformance slug={partner.slug} />

        <SocialChannels slug={partner.slug} />

        <FormatSplit format={format} />

        {/* <section className="card">
          <div className="card-head">
            <h2>Where the audience watches</h2>
            <p className="lead">
              Darker states have more watch time. California, Texas, and Florida lead. Nevada is seventh. The colors follow Bluff’s measured state mix.
            </p>
          </div>
          <AudienceMap
            states={partner.states}
            usViews={partner.estimatedUsViews}
            usHours={partner.estimatedUsHours}
            estimated
          />
          <p className="caption">
            State shares are Bluff’s U.S. mix, scaled to this channel. Hover a state for its estimated hours.
          </p>
        </section> */}

        <section className="card">
          <div className="card-head">
            <h2>Hours watched each month</h2>
            <p className="lead">
              Estimated hours on videos posted from October 2025 through October 2026. Red is Shorts and black is long-form. A short is capped at its own length.
            </p>
          </div>
          <WatchChart months={formatMonths[partner.slug].months} />
          <div className="table-scroll"><table className="after-chart">
            <thead>
              <tr>
                <th>Year</th>
                <th className="num">Watch time</th>
              </tr>
            </thead>
            <tbody>
              {yearRows(partner.years).map((year) => (
                <tr key={year.year}>
                  <td>{year.year === "2026" ? "2026 through Oct 7" : year.year}</td>
                  <td className="num">{compact(year.hours)} hours</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>What a property gets on camera</h2>
            <p className="lead">
              Counted when the title names the casino. {partner.shorts.toLocaleString("en-US")} of the public videos are Shorts. {partner.videos.toLocaleString("en-US")} public videos in total.
            </p>
          </div>
          <div className="band">
            <article className="mini">
              <div className="mini-label">{leadProperty.name}</div>
              <div className="mini-value">{compact(leadProperty.views)}</div>
              <div className="metric-hint">Views on {leadProperty.videos.toLocaleString("en-US")} {leadProperty.videos === 1 ? "video" : "videos"} that name it in the title.</div>
            </article>
            <article className="mini">
              <div className="mini-label">Other properties</div>
              <div className="mini-value">{compact(otherViews)}</div>
              <div className="metric-hint">Views across {other.length} more {other.length === 1 ? "casino" : "casinos"} named in a title.</div>
            </article>
            <article className="mini">
              <div className="mini-label">Title mentions</div>
              <div className="mini-value">{otherVideos + leadProperty.videos}</div>
              <div className="metric-hint">Videos whose title names one of these casinos.</div>
            </article>
          </div>
          <div className="table-scroll"><table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Market</th>
                <th className="num">Videos</th>
                <th className="num">Views</th>
              </tr>
            </thead>
            <tbody>
              {partner.properties.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.where}</td>
                  <td className="num">{row.videos.toLocaleString("en-US")}</td>
                  <td className="num">{compact(row.views)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Most hours watched</h2>
            <p className="lead">Watch time is estimated from the length of each video, capped at 4 minutes 26 seconds.</p>
          </div>
          <div className="table-scroll"><table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Published</th>
                <th className="num">Views</th>
                <th className="num">Watch time</th>
                <th className="num">Avg view</th>
              </tr>
            </thead>
            <tbody>
              {partner.top.map((row) => (
                <tr key={row.title}>
                  <td className="title">{row.title}</td>
                  <td>{row.published}</td>
                  <td className="num">{compact(row.views)}</td>
                  <td className="num">{compact(row.hours)} h</td>
                  <td className="num">{prettyClock(row.avgDuration)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>
      </main>
    </>
  );
}
