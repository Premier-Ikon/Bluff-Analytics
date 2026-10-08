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
    const text = k >= 10 ? k.toFixed(1) : k.toFixed(2);
    return `${text.replace(/\.0$/, "")}K`;
  }
  return Math.round(n).toLocaleString("en-US");
};

export function splitWatchHours(total, format) {
  const short = format.shortHours || 0;
  const long = format.longHours || 0;
  const sum = short + long;
  if (!sum) return { shortHours: 0, longHours: 0, shortShare: 0, longShare: 0 };
  const longHours = Math.round((total * long) / sum);
  return {
    longHours,
    shortHours: total - longHours,
    longShare: Math.round((long / sum) * 1000) / 10,
    shortShare: Math.round((short / sum) * 1000) / 10,
  };
}

function side(views, videos, total) {
  return {
    views,
    videos,
    avgViews: videos ? Math.round(views / videos) : 0,
    share: total ? Math.round((views / total) * 1000) / 10 : 0,
  };
}

export default function FormatSplit({ format }) {
  const total = format.shortViews + format.longViews;
  const shorts = side(format.shortViews, format.shortVideos, total);
  const longform = side(format.longViews, format.longVideos, total);

  return (
    <section className="card">
      <div className="card-head">
        <p className="kicker">Format mix</p>
        <h2>Shorts and long-form</h2>
        <p className="lead">
          A Short averages {compact(shorts.avgViews)} views. A long-form video averages {compact(longform.avgViews)} views. Counts are lifetime views on every public video.
        </p>
      </div>
      <div className="split-stats">
        <article className="split-stat">
          <div className="pill"><span className="dot" /> Shorts</div>
          <strong>{compact(shorts.views)}</strong>
          <span className="metric-hint">views · {shorts.share}% of views · {shorts.videos.toLocaleString("en-US")} videos</span>
          <div className="format-avg"><b>{compact(shorts.avgViews)}</b> average views</div>
        </article>
        <article className="split-stat">
          <div className="pill"><span className="dot long" /> Long-form</div>
          <strong>{compact(longform.views)}</strong>
          <span className="metric-hint">views · {longform.share}% of views · {longform.videos.toLocaleString("en-US")} videos</span>
          <div className="format-avg"><b>{compact(longform.avgViews)}</b> average views</div>
        </article>
      </div>
    </section>
  );
}
