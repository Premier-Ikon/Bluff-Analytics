"use client";

import { useState } from "react";
import useNarrow from "./useNarrow";

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

function axisMax(peak) {
  const padded = Math.max(peak, 1) * 1.08;
  const steps = padded >= 1_000_000
    ? [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10].map((step) => step * 1_000_000)
    : [1, 2, 2.5, 4, 5, 8, 10].map((step) => step * 100_000);
  return steps.find((step) => step >= padded) || padded;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RANGE_START = "2025-10";
const RANGE_END = "2026-10";

export function alignMonths(months) {
  const byKey = Object.fromEntries(months.map((item) => [item.key, item]));
  const rows = [];
  let [year, month] = RANGE_START.split("-").map(Number);
  const [endYear, endMonth] = RANGE_END.split("-").map(Number);
  while (year < endYear || (year === endYear && month <= endMonth)) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    const row = byKey[key];
    const shortHours = row?.shortHours || 0;
    const longHours = row?.longHours || 0;
    rows.push({
      key,
      label: month === 1 || month === 10 ? `${MONTHS[month - 1]} ${String(year).slice(2)}` : MONTHS[month - 1],
      shortHours,
      longHours,
      hours: shortHours + longHours,
    });
    month += 1;
    if (month === 13) {
      month = 1;
      year += 1;
    }
  }
  return rows;
}

export function yearRows(years) {
  const hoursByYear = Object.fromEntries(years.map((item) => [String(item.year), item.hours]));
  return ["2026", "2025", "2024"].flatMap((year) => (
    Object.prototype.hasOwnProperty.call(hoursByYear, year)
      ? [{ year, hours: hoursByYear[year] }]
      : []
  ));
}

function tickLabel(value) {
  if (!value) return "0";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    const text = Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1);
    return `${text.replace(/\.0$/, "")}M`;
  }
  return `${Math.round(value / 1_000)}K`;
}

export default function WatchChart({ months }) {
  const series = alignMonths(months);
  const narrow = useNarrow();
  const [active, setActive] = useState(null);
  const width = 1000;
  const height = narrow ? 300 : 260;
  const padL = narrow ? 64 : 48;
  const padR = 8;
  const padT = 12;
  const padB = narrow ? 36 : 28;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const peak = Math.max(...series.flatMap((item) => [item.shortHours, item.longHours]), 0);
  const ceiling = axisMax(peak);
  const groupGap = 8;
  const pairGap = 3;
  const groupW = (innerW - groupGap * (series.length - 1)) / series.length;
  const barW = (groupW - pairGap) / 2;
  const radius = Math.min(3.5, barW / 2);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const month = active == null ? null : series[active];
  const barX = active == null ? 0 : padL + active * (groupW + groupGap);
  const left = ((barX + groupW / 2) / width) * 100;
  const place = active == null ? "center" : active < 3 ? "start" : active > series.length - 4 ? "end" : "center";

  return (
    <div className="chart-wrap" onMouseLeave={() => setActive(null)}>
      {month ? (
        <div className={`tip ${place}`} style={{ left: `${left}%` }}>
          <div className="tip-title">{month.label}</div>
          <div className="tip-row"><span>Shorts</span><span>{compact(month.shortHours)} hours</span></div>
          <div className="tip-row"><span>Long-form</span><span>{compact(month.longHours)} hours</span></div>
        </div>
      ) : null}
      <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img">
        <title>Watch time by month, Shorts and long-form</title>
        {ticks.map((t) => {
          const y = padT + innerH - t * innerH;
          return (
            <g key={t}>
              <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#efefef" strokeWidth="1" />
              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize={narrow ? 22 : 11} fill="#606060" fontFamily="Montserrat, sans-serif">
                {tickLabel(ceiling * t)}
              </text>
            </g>
          );
        })}
        {series.map((item, i) => {
          const x = padL + i * (groupW + groupGap);
          const base = padT + innerH;
          const shortH = (item.shortHours / ceiling) * innerH;
          const longH = (item.longHours / ceiling) * innerH;
          const dim = active != null && active !== i;
          return (
            <g key={item.key} className="chart-col" onMouseOver={() => setActive(i)} onPointerDown={() => setActive(i)}>
              <rect x={x - groupGap / 2} y={padT} width={groupW + groupGap} height={innerH} fill="transparent" />
              <rect x={x} y={base - shortH} width={barW} height={Math.max(shortH, 0)} rx={radius} fill="#ff0000" opacity={dim ? 0.28 : 1} />
              <rect x={x + barW + pairGap} y={base - longH} width={barW} height={Math.max(longH, 0)} rx={radius} fill="#0f0f0f" opacity={dim ? 0.28 : 1} />
              {narrow && ![1, 4, 7, 10].includes(Number(item.key.slice(5))) ? null : (
                <text x={x + groupW / 2} y={height - 8} textAnchor="middle" fontSize={narrow ? 22 : 11} fill="#606060" fontFamily="Montserrat, sans-serif">
                  {item.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="chart-key">
        <span><i className="short" /> Shorts</span>
        <span><i className="long" /> Long-form</span>
      </div>
    </div>
  );
}
