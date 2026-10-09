"use client";

import { useState } from "react";
import PlatformIcon from "../PlatformIcon";
import WatchChart from "../WatchChart";
import { formatMonths } from "../../data/formats";
import { impact } from "../../data/impact";
import { usMap } from "../../data/usMap";
import { usStates } from "../../data/states";

const compact = (n) => {
  if (n == null) return "—";
  if (typeof n === "string") return n;
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

const money = (n) => (n == null ? "—" : `$${n.toLocaleString("en-US")}`);

/** Pink → red steps matching the prior property recap heat map. */
const ORIGIN_HEAT = ["#fff5f5", "#ffd5d5", "#ff9a9a", "#ff4d4d", "#e10600"];

function OriginHeatMap() {
  const [active, setActive] = useState(null);
  const ranked = [...impact.originStates].sort((a, b) => b.share - a.share);
  /** Rank 0 = highest share → deepest red; unlisted states stay light pink. */
  const colorByCode = Object.fromEntries(
    ranked.map((row, i) => {
      const step = ORIGIN_HEAT.length - 1 - i;
      return [row.code, ORIGIN_HEAT[Math.max(1, step)]];
    }),
  );
  const byName = Object.fromEntries(
    usStates.states.map((state) => [
      state.name,
      {
        ...state,
        share: impact.originStates.find((s) => s.code === state.code)?.share || 0,
        fill: colorByCode[state.code] || ORIGIN_HEAT[0],
      },
    ]),
  );
  const [x, y, width, height] = usMap.viewBox;

  return (
    <div className="map-wrap impact-origin-map" onMouseLeave={() => setActive(null)}>
      {active ? (
        <div className="tip map-tip">
          <div className="tip-title">{active.name}</div>
          <div className="tip-row">
            <span>Surveyed share</span>
            <span>{active.share ? `${active.share}%` : "—"}</span>
          </div>
        </div>
      ) : null}
      <svg className="us-map" viewBox={`${x} ${y} ${width} ${height}`} role="img">
        <title>Attendee origin by state</title>
        {usMap.states.map((shape) => {
          const row = byName[shape.name];
          const on = active?.name === shape.name;
          return (
            <path
              key={shape.id}
              d={shape.d}
              fill={on ? "#0f0f0f" : row?.fill || ORIGIN_HEAT[0]}
              onMouseEnter={() => row && setActive(row)}
            />
          );
        })}
      </svg>
      <div className="scale-key">
        <span>Lower share</span>
        {ORIGIN_HEAT.map((color) => (
          <i key={color} className="heat" style={{ background: color }} />
        ))}
        <span>Higher share</span>
      </div>
    </div>
  );
}

function VisitationChart({ data }) {
  const width = 720;
  const height = 320;
  const pad = { top: 16, right: 18, bottom: 36, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxY = data.yMax || 20000;
  const yTicks = data.yTicks || [0, 5000, 10000, 15000, 20000];
  const points = data.points;
  const tMin = points[0].t ?? 8;
  const tMax = points[points.length - 1].t ?? 22;
  const xAt = (tOrIndex, isIndex = false) => {
    if (isIndex) return pad.left + (tOrIndex / (points.length - 1)) * innerW;
    return pad.left + ((tOrIndex - tMin) / (tMax - tMin)) * innerW;
  };
  const yAt = (v) => pad.top + innerH - (v / maxY) * innerH;
  const baseline = pad.top + innerH;
  const pointX = (p, i) => (p.t != null ? xAt(p.t) : xAt(i, true));

  const linePath = (key) =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${pointX(p, i).toFixed(1)} ${yAt(p[key]).toFixed(1)}`)
      .join(" ");

  const areaPath = (key) =>
    [
      `M ${pointX(points[0], 0).toFixed(1)} ${baseline}`,
      ...points.map((p, i) => `L ${pointX(p, i).toFixed(1)} ${yAt(p[key]).toFixed(1)}`),
      `L ${pointX(points[points.length - 1], points.length - 1).toFixed(1)} ${baseline}`,
      "Z",
    ].join(" ");

  const yTickLabel = (v) => (v === 0 ? "0" : `${v / 1000}K`);
  const xLabelHours = [8, 10, 12, 14, 16, 18, 20, 22];

  return (
    <div className="impact-visit-chart">
      <div className="impact-visit-head">
        <h3>{data.title}</h3>
        <span className="impact-visit-lift">{data.badge || data.liftLabel}</span>
      </div>
      <div className="impact-visit-legend">
        <span><i className="dot dot-event" /> {data.eventLabel}</span>
        <span><i className="dot dot-typical" /> {data.typicalLabel}</span>
      </div>
      <svg className="impact-chart" viewBox={`0 0 ${width} ${height}`} role="img">
        <title>Property visitation · event day vs typical Saturday</title>
        <defs>
          <linearGradient id="visitEventFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e10600" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e10600" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="visitTypicalFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b6b6b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6b6b6b" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = yAt(tick);
          return (
            <g key={tick}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#ececec" strokeWidth="1" />
              <text
                x={pad.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#9a9a9a"
                fontFamily="Montserrat, sans-serif"
              >
                {yTickLabel(tick)}
              </text>
            </g>
          );
        })}

        {(data.xLabels || []).map((label, i) => {
          const hour = xLabelHours[i] ?? 8 + i * 2;
          const x = xAt(hour);
          return (
            <g key={label}>
              <line x1={x} x2={x} y1={pad.top} y2={baseline} stroke="#f3f3f3" strokeWidth="1" />
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fill="#9a9a9a"
                fontFamily="Montserrat, sans-serif"
              >
                {label}
              </text>
            </g>
          );
        })}

        <path d={areaPath("typical")} fill="url(#visitTypicalFill)" />
        <path d={areaPath("event")} fill="url(#visitEventFill)" />
        <path
          d={linePath("typical")}
          fill="none"
          stroke="#6b6b6b"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={linePath("event")}
          fill="none"
          stroke="#e10600"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function PlayersClubDonut({ firstTime, existing }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const firstLen = (firstTime / 100) * c;
  return (
    <div className="impact-donut-wrap">
      <svg className="impact-donut" viewBox="0 0 140 140" role="img">
        <title>Players Club · first-time vs existing</title>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#ececec" strokeWidth="16" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#e10600"
          strokeWidth="16"
          strokeDasharray={`${firstLen} ${c - firstLen}`}
          strokeLinecap="butt"
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="66" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f0f0f">
          {impact.playersClub.newMembers}
        </text>
        <text x="70" y="86" textAnchor="middle" fontSize="11" fill="#606060">
          new members
        </text>
      </svg>
      <div className="impact-donut-key">
        <span><i className="swatch swatch-red" /> First-time {firstTime}%</span>
        <span><i className="swatch swatch-gray" /> Existing / other {existing}%</span>
      </div>
    </div>
  );
}

export default function ImpactPage() {
  return (
    <>
      <header className="bar">
        <div className="wordmark">
          <span className="accent-bar" />
          <div>
            <div className="brand-name">{impact.title}</div>
            <div className="brand-meta">
              {impact.property} · {impact.location} · Sample case study
            </div>
          </div>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">{impact.kicker}</p>
            <h1>Creator activation recap — property impact & exposure</h1>
            <p>{impact.tagline}</p>
            <p className="hero-creators">{impact.creators.join(" · ")}</p>
          </div>
          <div className="hero-stats impact-hero-stats">
            {impact.hero.map((item) => (
              <article key={item.label}>
                <div className="metric-label">{item.label}</div>
                <div className="metric-value">{item.value}</div>
                <div className="metric-hint">{item.hint}</div>
              </article>
            ))}
          </div>
        </section>

        <p className="section-label"><span>01</span> Property visitation</p>
        <section className="card">
          <div className="impact-split">
            <VisitationChart data={impact.visitation} />
            <div className="impact-callouts">
              <article>
                <div className="metric-label">Attendance</div>
                <strong>1,500–2,000</strong>
                <p>Guests gathered around the BLUFF activation</p>
              </article>
              <article>
                <div className="metric-label">Table games</div>
                <strong>+18%</strong>
                <p>Revenue during activation hours vs. avg Saturday</p>
              </article>
              <article>
                <div className="metric-label">Satisfaction</div>
                <strong>Positive</strong>
                <p>Strong fan engagement · no major ops or security issues</p>
              </article>
            </div>
          </div>
        </section>

        <p className="section-label"><span>02</span> Attendee origin</p>
        <section className="card">
          <div className="card-head">
            <h2>Where guests came from</h2>
            <p className="lead">40% traveled 50+ miles specifically to attend · surveyed attendees</p>
          </div>
          <div className="impact-split impact-split-map">
            <OriginHeatMap />
            <div>
              <div className="us-stat-kicker">Out-of-market</div>
              <div className="us-stat-value">40%</div>
              <div className="us-stat-label">traveled 50+ miles</div>
              <div className="table-scroll" style={{ marginTop: 16 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Top states</th>
                      <th className="num">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impact.originStates.map((row) => (
                      <tr key={row.code}>
                        <td>{row.name}</td>
                        <td className="num">{row.share}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <p className="section-label"><span>03</span> Gaming & non-gaming</p>
        <section className="card">
          <div className="card-head">
            <h2>Tracked business results</h2>
            <p className="lead">Players Club, free play, coin-in, dining, and hotel demand</p>
          </div>
          <div className="impact-grid">
            <article className="q-card">
              <h3>Players Club acquisition</h3>
              <PlayersClubDonut
                firstTime={impact.playersClub.firstTimeShare}
                existing={impact.playersClub.existingShare}
              />
            </article>
            <article className="q-card">
              <h3>Promotional free play</h3>
              <dl>
                <div>
                  <dt>Distributed</dt>
                  <dd>{money(impact.promo.distributed)}</dd>
                </div>
                <div>
                  <dt>Redemption rate</dt>
                  <dd>{impact.promo.redemptionRate}%</dd>
                </div>
                <div>
                  <dt>Additional slot coin-in</dt>
                  <dd>{money(impact.promo.additionalCoinIn)}</dd>
                </div>
              </dl>
              <div className="impact-bar" aria-hidden="true">
                <span style={{ width: `${impact.promo.redemptionRate}%` }} />
              </div>
              <p className="metric-hint">
                {impact.promo.redemptionRate}% redeemed · tracked recipients drove coin-in after free play
              </p>
            </article>
            <article className="q-card">
              <h3>Non-gaming revenue</h3>
              <dl>
                {impact.nonGaming.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>
                      {row.value}
                      <span className="impact-sub">{row.note}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>On-property measure</th>
                  <th className="num">Result</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {impact.onProperty.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td className="num">{row.value}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="section-label"><span>04</span> Social exposure</p>
        <section className="card">
          <div className="card-head">
            <h2>{impact.exposure.label}</h2>
            <p className="lead">{impact.exposure.note}</p>
          </div>
          <div className="metrics metrics-3 package">
            <article className="metric">
              <div className="metric-label">Lifetime views</div>
              <div className="metric-value">{compact(impact.exposure.lifetimeViews)}</div>
              <div className="metric-hint">Team YouTube catalog</div>
            </article>
            <article className="metric">
              <div className="metric-label">Total watch hours</div>
              <div className="metric-value">{compact(impact.exposure.watchHours)}</div>
              <div className="metric-hint">Bluff Studio measured</div>
            </article>
            <article className="metric">
              <div className="metric-label">Long / short hours</div>
              <div className="metric-value">
                {compact(impact.exposure.longformHours)} / {compact(impact.exposure.shortformHours)}
              </div>
              <div className="metric-hint">Long-form · short-form</div>
            </article>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th className="num">Posts</th>
                  <th className="num">Views</th>
                  <th className="num">Likes / comments</th>
                  <th className="num">Avg views</th>
                  <th className="num">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {impact.exposure.platforms.map((row) => (
                  <tr key={row.name}>
                    <td>
                      <span className="platform-name">
                        <PlatformIcon name={row.name} />
                        {row.name}
                      </span>
                    </td>
                    <td className="num">
                      {row.posts != null ? row.posts.toLocaleString("en-US") : "—"}
                    </td>
                    <td className="num">{compact(row.views)}</td>
                    <td className="num">{compact(row.actions)}</td>
                    <td className="num">{compact(row.avgViews)}</td>
                    <td className="num">
                      {row.engagement != null ? `${row.engagement.toFixed(2)}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="impact-audience">
            <h3>Audience · top countries</h3>
            <dl>
              {impact.audienceCountries.map((row) => (
                <div key={row.name}>
                  <dt>{row.name}</dt>
                  <dd>
                    <span className="impact-share-bar" style={{ width: `${(row.share / 58) * 100}%` }} />
                    {row.share}%
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="impact-watch">
            <h3>Watch time trend · Bluff</h3>
            <p className="lead">Long-form and short-form hours — the content engine behind property activations</p>
            <WatchChart months={formatMonths.bluff.months} />
          </div>
          <div className="impact-top-content">
            <h3>Top casino content · catalog</h3>
            <p className="lead">
              Highest-performing YouTube titles from the team library — illustrates content scale, not event-day uploads alone
            </p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th className="num">Date</th>
                    <th className="num">Views</th>
                    <th className="num">Watch time</th>
                    <th className="num">Avg. view</th>
                  </tr>
                </thead>
                <tbody>
                  {impact.topContent.map((row) => (
                    <tr key={row.title}>
                      <td>{row.title}</td>
                      <td className="num">{row.date}</td>
                      <td className="num">{compact(row.views)}</td>
                      <td className="num">{compact(row.watchHours)} h</td>
                      <td className="num">{row.avgView}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <p className="section-label"><span>05</span> Partner feedback</p>
        <section className="card">
          <blockquote className="impact-quote">
            <p>“{impact.testimonial.quote}”</p>
            <footer>{impact.testimonial.attribution}</footer>
          </blockquote>
          <div className="impact-takeaways">
            {impact.takeaways.map((item) => (
              <article key={item}>
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </section>

        <p className="section-label"><span>06</span> Sample property visit itinerary</p>
        <section className="card">
          <div className="card-head">
            <h2>{impact.itinerary.title}</h2>
            <p className="lead">{impact.itinerary.lead}</p>
          </div>
          <ol className="plan">
            {impact.itinerary.steps.map((step, index) => (
              <li key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="lead plan-note">{impact.itinerary.note}</p>
        </section>
      </main>
    </>
  );
}
