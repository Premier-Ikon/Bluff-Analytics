"use client";

import { useState } from "react";
import { usStates } from "../data/states";
import { usMap } from "../data/usMap";

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

const heat = (hours, maxHours) => {
  if (!hours || !maxHours) return "#f3f3f3";
  const t = Math.pow(hours / maxHours, 0.45);
  const channel = Math.round(255 * (1 - t));
  return `rgb(255, ${channel}, ${channel})`;
};

export default function AudienceMap({
  states = usStates.states,
  usViews = usStates.usViews,
  usHours = usStates.usHours,
  estimated = false,
}) {
  const [active, setActive] = useState(null);
  const [x, y, width, height] = usMap.viewBox;
  const byName = Object.fromEntries(states.map((state) => [state.name, state]));
  const maxHours = states[0]?.hours || 0;
  const nevada = byName.Nevada;

  return (
    <div className="map-layout">
      <div className="map-wrap" onMouseLeave={() => setActive(null)}>
        {active ? (
          <div className="tip map-tip">
            <div className="tip-title">{active.name}</div>
            <div className="tip-row"><span>Watch time</span><span>{active.hourShare}%</span></div>
            <div className="tip-row"><span>Views</span><span>{compact(active.views)}</span></div>
            <div className="tip-row"><span>Hours</span><span>{compact(active.hours)}</span></div>
          </div>
        ) : null}
        <svg className="us-map" viewBox={`${x} ${y} ${width} ${height}`} role="img">
          <title>U.S. watch time by state</title>
          {usMap.states.map((shape) => {
            const row = byName[shape.name];
            const on = active?.name === shape.name;
            return (
              <path
                key={shape.id}
                d={shape.d}
                fill={on ? "#0f0f0f" : heat(row?.hours || 0, maxHours)}
                onMouseEnter={() => row && setActive(row)}
              />
            );
          })}
        </svg>
        <div className="scale-key">
          <span>Less watch time</span>
          <i className="heat heat-1" />
          <i className="heat heat-2" />
          <i className="heat heat-3" />
          <span>More</span>
        </div>
      </div>
      <div>
        <div className="us-stat-kicker">United States</div>
        <div className="us-stat-value">79.6%</div>
        <div className="us-stat-label">{estimated ? "of estimated watch time" : "of all watch time"}</div>
        <div className="us-stat-row">
          <div>
            <strong>{compact(usViews)}</strong>
            <span>views</span>
          </div>
          <div>
            <strong>{compact(usHours)}</strong>
            <span>hours</span>
          </div>
        </div>
        <table className="state-table">
          <thead>
            <tr>
              <th>State</th>
              <th className="num">Watch time</th>
              <th className="num">Views</th>
            </tr>
          </thead>
          <tbody>
            {states.slice(0, 8).map((state) => (
              <tr
                key={state.code}
                onMouseEnter={() => setActive(state)}
                onMouseLeave={() => setActive(null)}
              >
                <td>{state.name}</td>
                <td className="num">{state.hourShare}%</td>
                <td className="num">{compact(state.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="caption">
          Nevada is {nevada.hourShare}% of U.S. watch time, {compact(nevada.views)} views. {estimated ? "State shares are Bluff’s measured mix, applied here." : "Shares are of the U.S. total."} About 19% of U.S. watch time is not tied to a state, so it is not colored on the map.
        </p>
      </div>
    </div>
  );
}
