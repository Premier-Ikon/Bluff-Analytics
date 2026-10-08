"use client";

import { engagementRate, social } from "../data/social";

const compact = (n) => {
  if (n == null) return "Unavailable";
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

const rate = (value) => (value == null ? "Unavailable" : `${value.toFixed(2)}%`);

export default function SocialChannels({ slug }) {
  const pack = social[slug];
  if (!pack) return null;
  const { instagram: ig, facebook: fb, mgmRewards } = pack;
  if (!ig && !fb && !mgmRewards) return null;

  const igRate = ig ? engagementRate(ig.interactions, ig.views) : null;

  return (
    <section className="card">
      <div className="card-head">
        <h2>Instagram and Facebook</h2>
        <p className="lead">
          Taken from Insights and Professional dashboard screenshots. Views, viewers, and interactions are separate. Reach and impressions stay Unavailable when the screenshot did not show them.
        </p>
      </div>

      {ig ? (
        <>
          <div className="metrics package">
            <article className="metric">
              <div className="metric-label">Instagram views</div>
              <div className="metric-value">{compact(ig.views)}</div>
              <div className="metric-hint">{ig.window} · {ig.days} days</div>
            </article>
            <article className="metric">
              <div className="metric-label">Interactions</div>
              <div className="metric-value">{compact(ig.interactions)}{ig.interactionsExact === false ? "+" : ""}</div>
              <div className="metric-hint">{rate(igRate)} of views · last digits cut off in the screenshot</div>
            </article>
            <article className="metric">
              <div className="metric-label">Viewers</div>
              <div className="metric-value">{compact(ig.viewers)}</div>
              <div className="metric-hint">Unique people who viewed · not labeled reach</div>
            </article>
            <article className="metric">
              <div className="metric-label">{ig.followers ? "Followers" : "Net followers"}</div>
              <div className="metric-value">
                {ig.followers ? compact(ig.followers) : `+${compact(ig.netFollowers)}`}
              </div>
              <div className="metric-hint">
                {ig.followers
                  ? `+${compact(ig.netFollowers)} in window · +${ig.followerGrowthPct}%`
                  : `Gained in the ${ig.days}-day window`}
              </div>
            </article>
          </div>

          <h3>Views by format</h3>
          <div className="blank-grid social-formats">
            <article className="q-card">
              <h3>Reels</h3>
              <div className="metric-value">{compact(ig.formats.reels)}</div>
            </article>
            <article className="q-card">
              <h3>Stories</h3>
              <div className="metric-value">{compact(ig.formats.stories)}</div>
            </article>
            <article className="q-card">
              <h3>Posts</h3>
              <div className="metric-value">{compact(ig.formats.posts)}</div>
            </article>
            <article className="q-card">
              <h3>Live</h3>
              <div className="metric-value">{compact(ig.formats.live)}</div>
            </article>
          </div>
          {ig.followerViewShare != null ? (
            <p className="caption">
              View split in this window: {ig.followerViewShare}% followers and {ig.nonFollowerViewShare}% non-followers.
            </p>
          ) : (
            <p className="caption">Reels drive most discovery. Stories are mostly from existing followers.</p>
          )}

          {ig.audience ? (
            <>
              <h3>Audience</h3>
              <div className="social-split">
                <article className="q-card">
                  <h3>Gender</h3>
                  <dl>
                    <div><dt>Men</dt><dd>{ig.audience.men}%</dd></div>
                    <div><dt>Women</dt><dd>{ig.audience.women}%</dd></div>
                  </dl>
                </article>
                <article className="q-card">
                  <h3>Top countries</h3>
                  <dl>
                    {ig.audience.countries.map((row) => (
                      <div key={row.name}><dt>{row.name}</dt><dd>{row.share}%</dd></div>
                    ))}
                  </dl>
                </article>
                <article className="q-card">
                  <h3>Age</h3>
                  <dl>
                    {ig.audience.ages.map((row) => (
                      <div key={row.label}><dt>{row.label}</dt><dd>{row.share}%</dd></div>
                    ))}
                  </dl>
                </article>
                <article className="q-card">
                  <h3>When they are active</h3>
                  <p className="lead" style={{ marginTop: 8 }}>{ig.audience.peakActive}</p>
                  <p className="caption">From Instagram’s follower active-times chart.</p>
                </article>
              </div>
            </>
          ) : null}

          {ig.profileVisits ? (
            <>
              <h3>Profile activity</h3>
              <div className="band">
                <article className="mini">
                  <div className="mini-label">Profile visits</div>
                  <div className="mini-value">{compact(ig.profileVisits)}</div>
                </article>
                <article className="mini">
                  <div className="mini-label">Bio link taps</div>
                  <div className="mini-value">{compact(ig.bioLinkTaps)}</div>
                </article>
                <article className="mini">
                  <div className="mini-label">Impressions / reach</div>
                  <div className="mini-value missing">—</div>
                  <div className="metric-hint">Unavailable in these screenshots</div>
                </article>
              </div>
            </>
          ) : null}

          {ig.topByViews?.length ? (
            <>
              <h3>Top Instagram Reels by views</h3>
              <div className="table-scroll"><table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th className="num">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {ig.topByViews.map((row) => (
                    <tr key={`${row.title}-${row.views}`}>
                      <td>{row.title}</td>
                      <td className="num">{compact(row.views)}</td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </>
          ) : null}
        </>
      ) : (
        <p className="caption">Instagram is unavailable for this creator in the export.</p>
      )}

      {fb ? (
        <>
          <h3>Facebook</h3>
          <div className="metrics package">
            <article className="metric">
              <div className="metric-label">Views</div>
              <div className="metric-value">{compact(fb.views)}</div>
              <div className="metric-hint">{fb.window}</div>
            </article>
            <article className="metric">
              <div className="metric-label">Engagement</div>
              <div className="metric-value">{compact(fb.engagement)}</div>
              <div className="metric-hint">{rate(engagementRate(fb.engagement, fb.views))} of views</div>
            </article>
            <article className="metric">
              <div className="metric-label">Follows</div>
              <div className="metric-value">{compact(fb.follows)}</div>
              <div className="metric-hint">New follows in the window</div>
            </article>
            <article className="metric">
              <div className="metric-label">Impressions</div>
              <div className="metric-value missing">—</div>
              <div className="metric-hint">Unavailable</div>
            </article>
          </div>
          <p className="caption">{fb.source}. Earnings shown in the dashboard were $0 and are not used here.</p>
        </>
      ) : null}

      {mgmRewards ? (
        <>
          <h3>MGM Rewards</h3>
          <div className="band">
            <article className="mini">
              <div className="mini-label">Tier</div>
              <div className="mini-value">{mgmRewards.tier}</div>
              <div className="metric-hint">Member #{mgmRewards.memberId}</div>
            </article>
            <article className="mini">
              <div className="mini-label">Tier credits</div>
              <div className="mini-value">{compact(mgmRewards.tierCredits)}</div>
            </article>
            <article className="mini">
              <div className="mini-label">Rewards points</div>
              <div className="mini-value">{compact(mgmRewards.rewardsPoints)}</div>
              <div className="metric-hint">${mgmRewards.compsValue.toLocaleString("en-US")} in comps</div>
            </article>
          </div>
          <p className="caption">
            From {mgmRewards.name}’s MGM Rewards app. This is the creator’s own player status, not an activation result for a property.
          </p>
        </>
      ) : null}
    </section>
  );
}
