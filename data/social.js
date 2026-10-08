/**
 * Social metrics for the partnership brief.
 *
 * Impressions: Meta did not export a true impressions total. Where missing, we use
 * views as an estimated impressions proxy (1 view ≈ 1 impression) and label it Estimate.
 *
 * Partner Instagram / Facebook post counts: Bluff posts are counted from content
 * published Aug 9–Oct 7. Partners are scaled from Bluff using each creator’s
 * YouTube posts in the same 60-day window (Brettski 183 / Bluff 104, On Tilt 120 / 104).
 */

const BLUFF_YT_POSTS_60 = 104;
const BRETT_YT_POSTS_60 = 183;
const ONTILT_YT_POSTS_60 = 120;

const bluffIgPosts60 = 92 + 192; // reels + stories published Aug 9–Oct 7
const bluffFbPosts60 = 496;

function scalePosts(bluffCount, ytPosts) {
  return Math.round((bluffCount * ytPosts) / BLUFF_YT_POSTS_60);
}

function avgFromTotal(total, posts) {
  if (!total || !posts) return null;
  return Math.round(total / posts);
}

export const social = {
  bluff: {
    meta: {
      window: "July 10 – October 7, 2026",
      days: 90,
      views: 117432831,
      viewsChangePct: 39.1,
      reach: 5100000,
      reachChangePct: 28.7,
      interactions: 3443557,
      interactionsChangePct: 26.6,
      impressions: 117432831,
      impressionsEstimated: true,
      source: "Meta Business Suite Content overview and CSV exports",
    },
    instagram: {
      window: "July 10 – October 7, 2026",
      days: 90,
      views: 79478031,
      viewsChangePct: 11.7,
      organicViews: 79378396,
      adViews: 99635,
      interactions: null,
      interactionsExact: true,
      netFollowers: 80137,
      viewers: null,
      reach: null,
      profileVisits: 750043,
      bioLinkTaps: 99111,
      formats: {
        reels: 38653353,
        stories: 29335343,
        posts: 0,
        live: 0,
      },
      formatNote: "Lifetime views on Reels and Stories published in the window, not the 90-day account overview.",
      audience: null,
      postsLast60: bluffIgPosts60,
      postsLast60Breakdown: { reels: 92, stories: 192 },
      postsEstimated: false,
      impressions: 79478031,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(79478031, bluffIgPosts60),
      avgReach: null,
      source: "Meta Business Suite + Instagram content exports",
    },
    facebook: {
      window: "July 10 – October 7, 2026",
      days: 90,
      views: 37954800,
      engagement: null,
      follows: null,
      postsLast60: bluffFbPosts60,
      postsEstimated: false,
      impressions: 37954800,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(37954800, bluffFbPosts60),
      source: "Meta Business Suite Content overview + Facebook content export",
    },
  },
  brettski: {
    instagram: {
      window: "July 9 – October 6, 2026",
      days: 90,
      views: 55281221,
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
      postsLast60: scalePosts(bluffIgPosts60, BRETT_YT_POSTS_60),
      postsEstimated: true,
      impressions: 55281221,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(55281221, scalePosts(bluffIgPosts60, BRETT_YT_POSTS_60)),
      avgReach: avgFromTotal(1982739, scalePosts(bluffIgPosts60, BRETT_YT_POSTS_60)),
      source: "Instagram Insights screenshots · posts estimated from YouTube posting rate vs Bluff",
    },
    facebook: {
      window: "Estimated · 60 days",
      days: 60,
      views: Math.round(55281221 * (37954800 / 79478031)),
      viewsEstimated: true,
      engagement: null,
      follows: null,
      postsLast60: scalePosts(bluffFbPosts60, BRETT_YT_POSTS_60),
      postsEstimated: true,
      impressions: Math.round(55281221 * (37954800 / 79478031)),
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(
        Math.round(55281221 * (37954800 / 79478031)),
        scalePosts(bluffFbPosts60, BRETT_YT_POSTS_60),
      ),
      source: "Estimate · Bluff Facebook/Instagram view mix applied to Brettski Instagram views",
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
      postsLast60: scalePosts(bluffIgPosts60, ONTILT_YT_POSTS_60),
      postsEstimated: true,
      impressions: 37492956,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(37492956, scalePosts(bluffIgPosts60, ONTILT_YT_POSTS_60)),
      avgReach: avgFromTotal(3666886, scalePosts(bluffIgPosts60, ONTILT_YT_POSTS_60)),
      source: "Instagram Insights screenshots · posts estimated from YouTube posting rate vs Bluff",
    },
    facebook: {
      window: "Last 28 days",
      days: 28,
      views: 12000000,
      engagement: 823386,
      follows: 14809,
      earnings: 0,
      postsLast60: scalePosts(bluffFbPosts60, ONTILT_YT_POSTS_60),
      postsEstimated: true,
      impressions: 12000000,
      impressionsEstimated: true,
      avgImpressions: avgFromTotal(12000000, scalePosts(bluffFbPosts60, ONTILT_YT_POSTS_60)),
      source: "Meta Professional dashboard · post count estimated from YouTube posting rate vs Bluff",
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
