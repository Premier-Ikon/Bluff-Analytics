/**
 * Social metrics for the partnership brief.
 *
 * Impressions: Meta did not export a true impressions total. Where missing, we use
 * views as an estimated impressions proxy (1 view ≈ 1 impression) and label it Estimate.
 *
 * Partner Instagram / Facebook post counts: Bluff posts are counted from Meta
 * content exports Jul 10–Oct 7 (90 days). Partners are scaled from Bluff using
 * each surface’s view share vs Bluff (same views-per-post shape), not YouTube
 * posting rate — YT volume was overstating Meta posts.
 *
 * Gaps filled with estimates (interactionsExact / *Estimated flags):
 * - Bluff IG/FB interactions: Meta total split by each surface’s share of Meta views.
 * - Brettski Facebook views: Bluff FB/IG view mix × Brettski Instagram views.
 * - Brettski Facebook engagement: 2.8% of Facebook views (team rate used in prior brief).
 * - Facebook follows: scaled from On Tilt’s measured follows-per-view.
 *
 * Bluff Meta audience: measured from Meta Audience.csv export (age/gender, countries, cities).
 */

// Meta content exports Jul 10–Oct 7 (IG reels/carousels + stories; Facebook posts)
const bluffIgPosts90 = 152 + 284;
const bluffFbPosts90 = 740;

const ONTILT_IG_VIEWS_60 = 37492956;
const ONTILT_FB_VIEWS_28 = 12000000;
const ONTILT_IG_VIEWS_90 = Math.round(ONTILT_IG_VIEWS_60 * (90 / 60));
const ONTILT_FB_VIEWS_90 = Math.round(ONTILT_FB_VIEWS_28 * (90 / 28));

const BLUFF_META_VIEWS = 117432831;
const BLUFF_META_INTERACTIONS = 3443557;
const BLUFF_META_REACH = 5100000;
const BLUFF_IG_VIEWS = 79478031;
const BLUFF_FB_VIEWS = 37954800;

const bluffIgInteractions = Math.round(
  BLUFF_META_INTERACTIONS * (BLUFF_IG_VIEWS / BLUFF_META_VIEWS),
);
const bluffFbEngagement = Math.round(
  BLUFF_META_INTERACTIONS * (BLUFF_FB_VIEWS / BLUFF_META_VIEWS),
);

const BRETT_IG_VIEWS = 55281221;
const BRETT_FB_VIEWS = Math.round(BRETT_IG_VIEWS * (BLUFF_FB_VIEWS / BLUFF_IG_VIEWS));
const BRETT_FB_ENGAGEMENT_RATE = 2.8; // percent of views
const BRETT_FB_ENGAGEMENT = Math.round((BRETT_FB_VIEWS * BRETT_FB_ENGAGEMENT_RATE) / 100);

// On Tilt Facebook: 14,809 follows on 12M views (28-day Professional dashboard)
const ONTILT_FB_FOLLOWS_PER_VIEW = 14809 / 12000000;
const bluffFbFollows = Math.round(BLUFF_FB_VIEWS * ONTILT_FB_FOLLOWS_PER_VIEW);
const brettFbFollows = Math.round(BRETT_FB_VIEWS * ONTILT_FB_FOLLOWS_PER_VIEW);

/** Bluff Meta audience — Audience.csv from Meta Business Suite. */
const bluffAudience = {
  men: 86.1,
  women: 13.9,
  ages: [
    { label: "18–24", share: 6.3 },
    { label: "25–34", share: 32.5 },
    { label: "35–44", share: 29.5 },
    { label: "45–54", share: 16.7 },
    { label: "55–64", share: 10.0 },
    { label: "65+", share: 5.0 },
  ],
  genderByAge: [
    { label: "18–24", men: 5.7, women: 0.6 },
    { label: "25–34", men: 29.4, women: 3.1 },
    { label: "35–44", men: 26.3, women: 3.2 },
    { label: "45–54", men: 13.9, women: 2.8 },
    { label: "55–64", men: 7.4, women: 2.6 },
    { label: "65+", men: 3.4, women: 1.6 },
  ],
  countries: [
    { name: "United States", share: 58 },
    { name: "Philippines", share: 11.7 },
    { name: "Canada", share: 3.1 },
    { name: "Thailand", share: 2.9 },
    { name: "Malaysia", share: 2.6 },
    { name: "United Kingdom", share: 2.5 },
    { name: "Australia", share: 2.4 },
    { name: "Indonesia", share: 2.4 },
    { name: "Vietnam", share: 2.2 },
    { name: "Cambodia", share: 1 },
  ],
  cities: [
    { name: "Bangkok, Thailand", share: 1 },
    { name: "Phnom Penh, Cambodia", share: 0.7 },
    { name: "Quezon City, Philippines", share: 0.6 },
    { name: "Singapore, Singapore", share: 0.6 },
    { name: "Ho Chi Minh City, Vietnam", share: 0.5 },
    { name: "Las Vegas, NV", share: 0.5 },
    { name: "Manila, Philippines", share: 0.5 },
    { name: "New York, NY", share: 0.5 },
    { name: "Phoenix, AZ", share: 0.5 },
    { name: "San Antonio, TX", share: 0.5 },
  ],
  estimated: false,
  source: "Meta Business Suite Audience.csv",
};

/** Estimate partner Meta posts from Bluff’s measured posts × view ratio. */
function scalePostsByViews(bluffPosts, creatorViews, bluffViews) {
  if (!bluffViews || !creatorViews) return null;
  return Math.round((bluffPosts * creatorViews) / bluffViews);
}

const brettIgPosts90 = scalePostsByViews(bluffIgPosts90, BRETT_IG_VIEWS, BLUFF_IG_VIEWS);
const brettFbPosts90 = scalePostsByViews(bluffFbPosts90, BRETT_FB_VIEWS, BLUFF_FB_VIEWS);
const ontiltIgPosts90 = scalePostsByViews(bluffIgPosts90, ONTILT_IG_VIEWS_90, BLUFF_IG_VIEWS);
const ontiltFbPosts90 = scalePostsByViews(bluffFbPosts90, ONTILT_FB_VIEWS_90, BLUFF_FB_VIEWS);

function avgFromTotal(total, posts) {
  if (!total || !posts) return null;
  return Math.round(total / posts);
}

export const social = {
  bluff: {
    meta: {
      window: "July 10 – October 7, 2026",
      days: 90,
      views: BLUFF_META_VIEWS,
      viewsChangePct: 39.1,
      reach: BLUFF_META_REACH,
      reachChangePct: 28.7,
      interactions: BLUFF_META_INTERACTIONS,
      interactionsChangePct: 26.6,
      impressions: BLUFF_META_VIEWS,
      impressionsEstimated: true,
      audience: bluffAudience,
      source: "Meta Business Suite Content overview and Audience.csv",
    },
    instagram: {
      window: "July 10 – October 7, 2026",
      days: 90,
      views: BLUFF_IG_VIEWS,
      viewsChangePct: 11.7,
      organicViews: 79378396,
      adViews: 99635,
      interactions: bluffIgInteractions,
      interactionsExact: false,
      interactionsEstimated: true,
      netFollowers: 80137,
      viewers: null,
      reach: BLUFF_META_REACH,
      profileVisits: 750043,
      bioLinkTaps: 99111,
      formats: {
        reels: 38653353,
        stories: 29335343,
        posts: 0,
        live: 0,
      },
      formatNote: "Lifetime views on Reels and Stories published in the window, not the 90-day account overview.",
      audience: bluffAudience,
      postsLast60: bluffIgPosts90,
      postsLast60Breakdown: { feed: 152, stories: 284 },
      postsEstimated: false,
      impressions: BLUFF_IG_VIEWS,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(BLUFF_IG_VIEWS, bluffIgPosts90),
      avgReach: avgFromTotal(BLUFF_META_REACH, bluffIgPosts90),
      source:
        "Meta Business Suite + Instagram exports · interactions split from Meta total by IG view share · audience from Audience.csv",
    },
    facebook: {
      window: "July 10 – October 7, 2026",
      days: 90,
      views: BLUFF_FB_VIEWS,
      engagement: bluffFbEngagement,
      engagementEstimated: true,
      follows: bluffFbFollows,
      followsEstimated: true,
      postsLast60: bluffFbPosts90,
      postsEstimated: false,
      impressions: BLUFF_FB_VIEWS,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(BLUFF_FB_VIEWS, bluffFbPosts90),
      source:
        "Meta Business Suite + Facebook export · engagement split from Meta total by FB view share · follows estimated from On Tilt rate",
    },
  },
  brettski: {
    instagram: {
      window: "July 9 – October 6, 2026",
      days: 90,
      views: BRETT_IG_VIEWS,
      interactions: 1709000,
      interactionsExact: false,
      netFollowers: 7392,
      viewers: 1982739,
      followerViewShare: 49.4,
      nonFollowerViewShare: 50.6,
      formats: {
        reels: 44000000,
        stories: 9800000,
        posts: 870000,
        live: 0,
      },
      audience: {
        men: 89.1,
        women: 10.9,
        ages: [
          { label: "13–17", share: 0.2 },
          { label: "18–24", share: 16.1 },
          { label: "25–34", share: 46.4 },
          { label: "35–44", share: 25.6 },
          { label: "45–54", share: 7.7 },
          { label: "55–64", share: 2.8 },
          { label: "65+", share: 1.2 },
        ],
        countries: [
          { name: "United States", share: 76.6 },
          { name: "United Kingdom", share: 5.3 },
          { name: "Canada", share: 4.7 },
          { name: "Australia", share: 4.3 },
          { name: "Mexico", share: 0.7 },
        ],
        peakActive: "12 PM – 6 PM PDT",
      },
      postsLast60: brettIgPosts90,
      postsEstimated: true,
      impressions: BRETT_IG_VIEWS,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(BRETT_IG_VIEWS, brettIgPosts90),
      avgReach: avgFromTotal(1982739, brettIgPosts90),
      source: "Instagram Insights screenshots · posts estimated from Bluff Meta views-per-post",
    },
    facebook: {
      window: "July 9 – October 6, 2026",
      days: 90,
      views: BRETT_FB_VIEWS,
      viewsEstimated: true,
      engagement: BRETT_FB_ENGAGEMENT,
      engagementEstimated: true,
      follows: brettFbFollows,
      followsEstimated: true,
      postsLast60: brettFbPosts90,
      postsEstimated: true,
      impressions: BRETT_FB_VIEWS,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(BRETT_FB_VIEWS, brettFbPosts90),
      source:
        "Estimate · Bluff FB/IG view mix × Brettski IG views · posts from Bluff Meta views-per-post · 2.8% eng. · follows from On Tilt rate",
    },
    mgmRewards: {
      name: "Brett",
      tier: "NOIR",
      memberId: "77812031",
      tierCredits: 4656574,
      rewardsPoints: 453826,
      compsValue: 4538.26,
      slotDollars: 148.73,
      source: "MGM Rewards app screenshot",
    },
  },
  ontilt: {
    instagram: {
      window: "August 7 – October 6, 2026",
      days: 60,
      views: 37492956,
      interactions: 1293000,
      interactionsExact: false,
      netFollowers: 21133,
      followers: 135870,
      followerGrowthPct: 18.4,
      viewers: 3666886,
      formats: {
        reels: 35000000,
        stories: 1500000,
        posts: 896000,
        live: 0,
      },
      interactionsByFormat: {
        reels: 1200000,
        posts: 86000,
        stories: 18000,
        live: 0,
      },
      profileVisits: 200260,
      bioLinkTaps: 1226,
      topByViews: [
        { title: "Blackjack at El Cortez", views: 4600000 },
        { title: "Blackjack at El Cortez", views: 4100000 },
        { title: "DOWN $38,000", views: 1200000 },
        { title: "The greatest shoe in blackjack history?!", views: 860000 },
      ],
      topByFollows: [
        { title: "DOWN $38,000", follows: 3100 },
        { title: "Blackjack at El Cortez", follows: 2000 },
        { title: "$10,000 baccarat", follows: 580 },
        { title: "WE JUST HIT THE GRAND JACKPOT", follows: 558 },
      ],
      audience: {
        men: 91.1,
        women: 8.9,
        ages: [
          { label: "13–17", share: 0.4 },
          { label: "18–24", share: 13.6 },
          { label: "25–34", share: 39.2 },
          { label: "35–44", share: 29.4 },
          { label: "45–54", share: 11.6 },
          { label: "55–64", share: 4.2 },
          { label: "65+", share: 1.6 },
        ],
        countries: [
          { name: "United States", share: 72.6 },
          { name: "Australia", share: 3.3 },
          { name: "Canada", share: 3.0 },
          { name: "United Kingdom", share: 2.2 },
          { name: "Mexico", share: 1.8 },
        ],
        peakActive: "12 PM – 6 PM PDT · strongest Thu–Fri",
      },
      postsLast60: ontiltIgPosts90,
      postsEstimated: true,
      impressions: ONTILT_IG_VIEWS_60,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(ONTILT_IG_VIEWS_90, ontiltIgPosts90),
      avgReach: avgFromTotal(3666886, ontiltIgPosts90),
      source: "Instagram Insights screenshots · posts estimated from Bluff Meta views-per-post (90d)",
    },
    facebook: {
      window: "Last 28 days",
      days: 28,
      views: ONTILT_FB_VIEWS_28,
      engagement: 823386,
      follows: 14809,
      earnings: 0,
      postsLast60: ontiltFbPosts90,
      postsEstimated: true,
      impressions: ONTILT_FB_VIEWS_28,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(ONTILT_FB_VIEWS_90, ontiltFbPosts90),
      source: "Meta Professional dashboard · posts estimated from Bluff Meta views-per-post (90d)",
    },
  },
};

export function engagementRate(interactions, views) {
  if (!interactions || !views) return null;
  return Math.round((interactions / views) * 10000) / 100;
}

export function youtubeImpressions(views, posts) {
  return {
    impressions: views,
    impressionsEstimated: true,
    avgImpressions: avgFromTotal(views, posts),
    posts,
  };
}
