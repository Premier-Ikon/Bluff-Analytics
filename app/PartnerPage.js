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

function studioWatchMonths(studioMonths, format) {
  const mix = Object.fromEntries(format.months.map((item) => [item.key, item]));
  return studioMonths.filter((item) => item.key >= "2025-10").map((item) => {
    const row = mix[item.key] || { shortHours: 0, longHours: 0 };
    const estimated = row.shortHours + row.longHours;
    const scale = estimated > 0 ? item.hours / estimated : 0;
    return {
      key: item.key,
      shortHours: row.shortHours * scale,
      longHours: row.longHours * scale,
    };
  });
}

/**
 * Shared creator dashboard shell.
 * Bluff, Brettski, and On Tilt Boys all render this exact section order.
 */
export default function PartnerPage({ partner }) {
  const format = formatMonths[partner.slug];
  const watchHours = partner.watchHours ?? partner.estimatedHours;
  const watchYears = partner.watchYears ?? partner.estimatedYears;
  const watchMeasured = Boolean(partner.watchMeasured);
  const hours = splitWatchHours(watchHours, format);
  const source = watchMeasured ? "Studio" : "Estimate";
  const leadProperty = partner.properties[0];
  const other = partner.properties.slice(1);
  const otherViews = other.reduce((sum, row) => sum + row.views, 0);
  const titleMentions = partner.properties.reduce((sum, row) => sum + row.videos, 0);
  const chartMonths = watchMeasured && partner.studioMonths
    ? studioWatchMonths(partner.studioMonths, format)
    : format.months;

  return (
    <>
      <header className="bar">
        <div className="wordmark">
          <span className="accent-bar" />
          <div>
            <div className="brand-name">{partner.name}</div>
            <div className="brand-meta">
              <a href={partner.url}>{partner.handle}</a>
              {" · Creator dashboard · "}
              {partner.since} – {partner.through}
            </div>
          </div>
        </div>
        <button className="pdf" type="button" onClick={() => window.print()}>
          Download PDF
        </button>
      </header>

      <main className="page">
        <p className="kicker page-kicker">YouTube lifetime</p>
        <section className="metrics" aria-label="Channel totals">
          <article className="metric">
            <div className="metric-label">Views</div>
            <div className="metric-value">{compact(partner.views)}</div>
            <div className="metric-hint">{compact(partner.subscribers)} subscribers</div>
          </article>
          <article className="metric">
            <div className="metric-label">Watch time</div>
            <div className="metric-value">{compact(watchHours)}</div>
            <div className="metric-hint">
              {source} · {watchYears.toLocaleString("en-US")} years of viewing
            </div>
          </article>
          <article className="metric">
            <div className="metric-label">Long-form</div>
            <div className="metric-value">{compact(hours.longHours)}</div>
            <div className="metric-hint">{source} · {hours.longShare}% of watch time</div>
          </article>
          <article className="metric">
            <div className="metric-label">Shorts</div>
            <div className="metric-value">{compact(hours.shortHours)}</div>
            <div className="metric-hint">{source} · {hours.shortShare}% of watch time</div>
          </article>
        </section>

        <RecentPerformance slug={partner.slug} />

        <SocialChannels slug={partner.slug} />

        <FormatSplit format={format} />

        {/* <section className="card">
          <div className="card-head">
            <h2>Where the audience watches</h2>
            <p className="lead">U.S. watch-time map. Same layout on every creator tab.</p>
          </div>
          <AudienceMap ... />
        </section> */}

        <section className="card">
          <div className="card-head">
            <p className="kicker">Watch time trend</p>
            <h2>Hours watched each month</h2>
            <p className="lead">
              {watchMeasured
                ? "Measured hours from October 2025 through October 2026. Red is Shorts and black is long-form, split by the videos posted that month."
                : "Estimated hours on videos posted from October 2025 through October 2026. Red is Shorts and black is long-form. A short is capped at its own length."}
            </p>
          </div>
          <WatchChart months={chartMonths} />
          <div className="table-scroll">
            <table className="after-chart">
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
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <p className="kicker">Casino publicity</p>
            <h2>What a property gets on camera</h2>
            <p className="lead">
              {`Counted when the title names the casino${partner.propertyNote ? ` or ${partner.propertyNote}` : ""}. ${partner.shorts.toLocaleString("en-US")} of the public videos are Shorts. ${partner.videos.toLocaleString("en-US")} public videos in total.`}
            </p>
          </div>
          <div className="band">
            <article className="mini">
              <div className="mini-label">{leadProperty.name}</div>
              <div className="mini-value">{compact(leadProperty.views)}</div>
              <div className="metric-hint">
                Views on {leadProperty.videos.toLocaleString("en-US")}{" "}
                {leadProperty.videos === 1 ? "video" : "videos"} that name it.
              </div>
            </article>
            <article className="mini">
              <div className="mini-label">Other properties</div>
              <div className="mini-value">{compact(otherViews)}</div>
              <div className="metric-hint">
                Views across {other.length} more {other.length === 1 ? "casino" : "casinos"} named on camera.
              </div>
            </article>
            <article className="mini">
              <div className="mini-label">Title mentions</div>
              <div className="mini-value">{titleMentions.toLocaleString("en-US")}</div>
              <div className="metric-hint">Videos whose title names one of these casinos.</div>
            </article>
          </div>
          <div className="table-scroll">
            <table>
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
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <p className="kicker">Top content</p>
            <h2>Most hours watched</h2>
            <p className="lead">
              {watchMeasured
                ? "Measured watch time from YouTube Studio."
                : "Watch time is estimated from the length of each video, capped at 4 minutes 26 seconds."}
            </p>
          </div>
          <div className="table-scroll">
            <table>
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
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
