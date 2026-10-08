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
  const { meta, instagram: ig, facebook: fb, mgmRewards } = pack;
  if (!meta && !ig && !fb && !mgmRewards) return null;

  const igRate = ig?.interactions != null ? engagementRate(ig.interactions, ig.views) : null;
  const metaRate = meta ? engagementRate(meta.interactions, meta.views) : null;
  const fbRate = fb?.engagement != null ? engagementRate(fb.engagement, fb.views) : null;

  return (
    <section className="card">
      <div className="card-head">
        <p className="kicker">Meta social</p>
        <h2>Instagram and Facebook</h2>
        <p className="lead">
          Views, reach, and interactions stay separate. Estimated impressions use views as a proxy.
        </p>
      </div>

      {meta ? (
        <>
          <h3>Meta combined · Instagram and Facebook</h3>
          <div className="metrics package">
            <article className="metric">
              <div className="metric-label">Views</div>
              <div className="metric-value">{compact(meta.views)}</div>
              <div className="metric-hint">
                {meta.window} · {meta.viewsChangePct != null ? `+${meta.viewsChangePct}%` : `${meta.days} days`}
              </div>
            </article>
            <article className="metric">
              <div className="metric-label">Reach</div>
              <div className="metric-value">{compact(meta.reach)}</div>
              <div className="metric-hint">
                Unique people in the window
                {meta.reachChangePct != null ? ` · +${meta.reachChangePct}%` : ""}
              </div>
            </article>
            <article className="metric">
              <div className="metric-label">Interactions</div>
              <div className="metric-value">{compact(meta.interactions)}</div>
              <div className="metric-hint">
                {rate(metaRate)} of views
                {meta.interactionsChangePct != null ? ` · +${meta.interactionsChangePct}%` : ""}
              </div>
            </article>
            <article className="metric">
              <div className="metric-label">Est. impressions</div>
              <div className="metric-value">{compact(meta.impressions)}</div>
              <div className="metric-hint">Estimate · views used as proxy</div>
            </article>
          </div>
          <p className="caption">{meta.source}. Reach is Meta’s period total (5.1M), not the sum of the daily reach CSV.</p>
        </>
      ) : null}

      {ig ? (
        <>
          <h3>Instagram</h3>
          <div className="metrics package">
            <article className="metric">
              <div className="metric-label">Instagram views</div>
              <div className="metric-value">{compact(ig.views)}</div>
              <div className="metric-hint">
                {ig.window} · {ig.days} days
                {ig.viewsChangePct != null ? ` · +${ig.viewsChangePct}%` : ""}
              </div>
            </article>
            <article className="metric">
              <div className="metric-label">Interactions</div>
              <div className="metric-value">
                {ig.interactions != null
                  ? `${compact(ig.interactions)}${ig.interactionsExact === false ? "+" : ""}`
                  : "—"}
              </div>
              <div className="metric-hint">
                {ig.interactions != null
                  ? `${rate(igRate)} of views${ig.interactionsExact === false ? " · last digits cut off in the screenshot" : ""}`
                  : "Shown in Meta combined above"}
              </div>
            </article>
            <article className="metric">
              <div className="metric-label">{ig.reach != null ? "Reach" : ig.viewers != null ? "Viewers" : "Organic views"}</div>
              <div className="metric-value">
                {ig.reach != null
                  ? compact(ig.reach)
                  : ig.viewers != null
                    ? compact(ig.viewers)
                    : ig.organicViews != null
                      ? compact(ig.organicViews)
                      : "—"}
              </div>
              <div className="metric-hint">
                {ig.reach != null
                  ? "Unique people · Instagram"
                  : ig.viewers != null
                    ? "Unique people who viewed · not labeled reach"
                    : ig.adViews != null
                      ? `${compact(ig.adViews)} from ads`
                      : "Unavailable"}
              </div>
            </article>
            <article className="metric">
              <div className="metric-label">{ig.followers ? "Followers" : "Net followers"}</div>
              <div className="metric-value">
                {ig.followers
                  ? compact(ig.followers)
                  : ig.netFollowers != null
                    ? `+${compact(ig.netFollowers)}`
                    : "—"}
              </div>
              <div className="metric-hint">
                {ig.followers
                  ? `+${compact(ig.netFollowers)} in window · +${ig.followerGrowthPct}%`
                  : ig.netFollowers != null
                    ? `Instagram follows in the ${ig.days}-day window`
                    : "Unavailable"}
              </div>
            </article>
          </div>

          {ig.formats ? (
            <>
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
            </>
          ) : ig.organicViews != null ? (
            <p className="caption">
              Almost all Instagram views were organic ({compact(ig.organicViews)}). Paid ads added {compact(ig.adViews)}.
            </p>
          ) : null}

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

          {ig.profileVisits || ig.bioLinkTaps ? (
            <>
              <h3>Profile activity</h3>
              <div className="band">
                <article className="mini">
                  <div className="mini-label">Profile visits</div>
                  <div className="mini-value">{ig.profileVisits != null ? compact(ig.profileVisits) : "—"}</div>
                </article>
                <article className="mini">
                  <div className="mini-label">Link clicks</div>
                  <div className="mini-value">{ig.bioLinkTaps != null ? compact(ig.bioLinkTaps) : "—"}</div>
                </article>
                <article className="mini">
                  <div className="mini-label">Posts · last 60 days</div>
                  <div className="mini-value">{ig.postsLast60 != null ? ig.postsLast60.toLocaleString("en-US") : "—"}</div>
                  <div className="metric-hint">
                    {ig.postsEstimated ? "Estimate" : ig.postsLast60Breakdown ? `${ig.postsLast60Breakdown.reels} Reels · ${ig.postsLast60Breakdown.stories} Stories` : "Measured"}
                  </div>
                </article>
              </div>
              <div className="band">
                <article className="mini">
                  <div className="mini-label">Est. impressions</div>
                  <div className="mini-value">{ig.impressions != null ? compact(ig.impressions) : "—"}</div>
                  <div className="metric-hint">Views used as proxy</div>
                </article>
                <article className="mini">
                  <div className="mini-label">Avg impressions</div>
                  <div className="mini-value">{ig.avgImpressions != null ? compact(ig.avgImpressions) : "—"}</div>
                  <div className="metric-hint">Per post · estimate</div>
                </article>
                <article className="mini">
                  <div className="mini-label">Avg reach / viewers</div>
                  <div className="mini-value">{ig.avgReach != null ? compact(ig.avgReach) : ig.viewers != null ? compact(ig.viewers) : "—"}</div>
                  <div className="metric-hint">{ig.avgReach != null ? "Viewers ÷ posts" : "Unique viewers when available"}</div>
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
              <div className="metric-value">{fb.engagement != null ? compact(fb.engagement) : "—"}</div>
              <div className="metric-hint">
                {fb.engagement != null ? `${rate(fbRate)} of views` : "Not broken out from Meta combined"}
              </div>
            </article>
            <article className="metric">
              <div className="metric-label">Posts · last 60 days</div>
              <div className="metric-value">{fb.postsLast60 != null ? fb.postsLast60.toLocaleString("en-US") : "—"}</div>
              <div className="metric-hint">{fb.postsEstimated ? "Estimate" : "Measured from content export"}</div>
            </article>
            <article className="metric">
              <div className="metric-label">Est. impressions</div>
              <div className="metric-value">{fb.impressions != null ? compact(fb.impressions) : "—"}</div>
              <div className="metric-hint">
                {fb.avgImpressions != null ? `${compact(fb.avgImpressions)} avg · views proxy` : "Views used as proxy"}
              </div>
            </article>
          </div>
          <p className="caption">{fb.source}.</p>
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
