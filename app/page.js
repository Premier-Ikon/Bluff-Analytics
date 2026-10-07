"use client";

import AudienceMap from "./AudienceMap";
import FormatSplit, { splitWatchHours } from "./FormatSplit";
import WatchChart, { yearRows } from "./WatchChart";
import { formatMonths } from "../data/formats";
import { report } from "../data/report";
import { studio } from "../data/studio";

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

const properties = [
  { name: "El Cortez", where: "Las Vegas", videos: 168, views: 139300870 },
  { name: "Aria", where: "Las Vegas", videos: 2, views: 4679322 },
  { name: "Resorts World", where: "Las Vegas", videos: 16, views: 2767994 },
  { name: "Durango", where: "Las Vegas", videos: 8, views: 945274 },
  { name: "Venetian", where: "Las Vegas", videos: 3, views: 812503 },
  { name: "Ellis Island", where: "Las Vegas", videos: 2, views: 322501 },
  { name: "Encore", where: "Boston", videos: 1, views: 260124 },
  { name: "Palazzo", where: "Las Vegas", videos: 1, views: 233584 },
  { name: "Golden Gate", where: "Las Vegas", videos: 1, views: 212765 },
  { name: "Hard Rock", where: "Tampa", videos: 1, views: 209261 },
  { name: "Circa", where: "Las Vegas", videos: 2, views: 137308 },
  { name: "Red Rock", where: "Las Vegas", videos: 1, views: 87471 },
];

function prettyClock(value) {
  const parts = String(value).split(":").map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return value;
  const [h, m, s] = parts;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

function bluffWatchMonths() {
  const mix = Object.fromEntries(formatMonths.bluff.months.map((item) => [item.key, item]));
  return studio.months.filter((item) => item.key >= "2024-06").map((item) => {
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

export default function Page() {
  const { channel, totals } = report;
  const hours = splitWatchHours(studio.watchHours, formatMonths.bluff);

  return (
    <>
      <header className="bar">
        <div className="wordmark">
          <span className="accent-bar" />
          <div>
            <div className="brand-name">Bluff</div>
            <div className="brand-meta">
              <a href={channel.url}>{channel.handle}</a>
              {" · "}
              January 2009 – October 7, 2026
            </div>
          </div>
        </div>
        <button className="pdf" type="button" onClick={() => window.print()}>
          Download PDF
        </button>
      </header>

      <main className="page">
        <p className="note">
          Watch time, the state map, and the country mix are from YouTube Studio. The Shorts and long-form hours split that total by video length and views. Views and the casino list are from public video data.
        </p>

        <section className="metrics" aria-label="Channel totals">
          <article className="metric">
            <div className="metric-label">Views</div>
            <div className="metric-value">{compact(studio.views)}</div>
            <div className="metric-hint">{compact(channel.subscribers)} subscribers</div>
          </article>
          <article className="metric">
            <div className="metric-label">Watch time</div>
            <div className="metric-value">{compact(studio.watchHours)}</div>
            <div className="metric-hint">{studio.watchYears.toLocaleString("en-US")} years of viewing</div>
          </article>
          <article className="metric">
            <div className="metric-label">Long-form</div>
            <div className="metric-value">{compact(hours.longHours)}</div>
            <div className="metric-hint">{hours.longShare}% of watch time</div>
          </article>
          <article className="metric">
            <div className="metric-label">Shorts</div>
            <div className="metric-value">{compact(hours.shortHours)}</div>
            <div className="metric-hint">{hours.shortShare}% of watch time</div>
          </article>
        </section>

        <FormatSplit format={formatMonths.bluff} />

        <section className="card">
          <div className="card-head">
            <h2>Where the audience watches</h2>
            <p className="lead">
              Darker states have more watch time. California, Texas, and Florida lead. Nevada is seventh.
            </p>
          </div>
          <AudienceMap />
          <p className="caption">
            State shares are of YouTube’s U.S. total. Hover a state for its hours.
          </p>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Hours watched each month</h2>
            <p className="lead">
              Measured hours from June 2024 on. Red is Shorts and black is long-form, split by the videos posted that month.
            </p>
          </div>
          <WatchChart months={bluffWatchMonths()} />
          <table className="after-chart">
            <thead>
              <tr>
                <th>Year</th>
                <th className="num">Watch time</th>
              </tr>
            </thead>
            <tbody>
              {yearRows(studio.years).map((year) => (
                <tr key={year.year}>
                  <td>{year.year === "2026" ? "2026 through Oct 6" : year.year}</td>
                  <td className="num">{year.hours == null ? "—" : `${compact(year.hours)} hours`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>What a property gets on camera</h2>
            <p className="lead">
              Counted when the title names the casino, or the description says the shoot happened there. {totals.shorts} of the public videos are Shorts. The channel is posting about 46 videos a month in 2026.
            </p>
          </div>
          <div className="band">
            <article className="mini">
              <div className="mini-label">El Cortez</div>
              <div className="mini-value">139.3M</div>
              <div className="metric-hint">Views on 168 videos. One short has {compact(studio.elCortezShortHours)} hours watched.</div>
            </article>
            <article className="mini">
              <div className="mini-label">Other properties</div>
              <div className="mini-value">10.7M</div>
              <div className="metric-hint">Views across 11 more casinos named on camera.</div>
            </article>
            <article className="mini">
              <div className="mini-label">Ellis Island</div>
              <div className="mini-value">Invited</div>
              <div className="metric-hint">The channel was brought in for an on-site event.</div>
            </article>
          </div>
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
              {properties.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.where}</td>
                  <td className="num">{row.videos.toLocaleString("en-US")}</td>
                  <td className="num">{compact(row.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Most hours watched</h2>
            <p className="lead">The videos people spent the most time with.</p>
          </div>
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
              {studio.topByWatchTime.map((row) => (
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
        </section>
      </main>
    </>
  );
}
