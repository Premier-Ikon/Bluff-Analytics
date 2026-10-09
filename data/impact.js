/**
 * Example property activation — prior casino visit, same scenario as a
 * Wild Horse Pass–style BLUFF floor activation. Framed as a sample case study
 * (not tied to a specific dated recap for client forward-looking pitches).
 */
export const impact = {
  title: "Example property impact",
  kicker: "Case study · Prior casino activation",
  property: "Wild Horse Pass Casino",
  location: "Gila River Resorts & Casinos",
  dateLabel: null,
  creators: ["Bluff", "Brettski", "On Tilt Boys"],
  tagline: "Strong attendance. Measurable business results. A new and engaged audience for the property.",
  summary:
    "Outcomes from a prior BLUFF team activation in a similar casino-floor scenario — the kind of on-property impact and exposure an MGM activation can unlock.",

  hero: [
    {
      label: "Estimated attendees",
      value: "1,500–2,000",
      hint: "Guests around the BLUFF activation",
    },
    {
      label: "Property visitation",
      value: "+11%",
      hint: "Vs. a typical Saturday",
    },
    {
      label: "Table-game revenue",
      value: "+18%",
      hint: "During activation hours",
    },
    {
      label: "Players Club sign-ups",
      value: "425",
      hint: "New members during the event",
    },
    {
      label: "First-time visitors",
      value: "35%",
      hint: "Of surveyed attendees",
    },
    {
      label: "Out-of-market visitors",
      value: "40%",
      hint: "Traveled 50+ miles to attend",
    },
  ],

  /** Foot-traffic curve · event day vs typical Saturday (illustrative of the +11% lift). */
  visitation: {
    title: "Property visitation",
    badge: "+11% vs. typical Saturday",
    eventLabel: "Event day",
    typicalLabel: "Typical Saturday (Avg)",
    yMax: 20000,
    /** Half-hour samples 8 AM → 10 PM */
    points: [
      { t: 8.0, event: 420, typical: 380 },
      { t: 8.5, event: 980, typical: 720 },
      { t: 9.0, event: 1680, typical: 1180 },
      { t: 9.5, event: 2420, typical: 1680 },
      { t: 10.0, event: 3120, typical: 2180 },
      { t: 10.5, event: 3780, typical: 2620 },
      { t: 11.0, event: 4520, typical: 3180 },
      { t: 11.5, event: 5280, typical: 3720 },
      { t: 12.0, event: 6100, typical: 4280 },
      { t: 12.5, event: 6920, typical: 4860 },
      { t: 13.0, event: 7740, typical: 5480 },
      { t: 13.5, event: 8580, typical: 6120 },
      { t: 14.0, event: 9420, typical: 6780 },
      { t: 14.5, event: 10180, typical: 7320 },
      { t: 15.0, event: 10940, typical: 7860 },
      { t: 15.5, event: 11620, typical: 8340 },
      { t: 16.0, event: 12280, typical: 8780 },
      { t: 16.5, event: 12940, typical: 9240 },
      { t: 17.0, event: 13680, typical: 9720 },
      { t: 17.5, event: 14420, typical: 10180 },
      { t: 18.0, event: 15160, typical: 10640 },
      { t: 18.5, event: 15840, typical: 10980 },
      { t: 19.0, event: 16420, typical: 11240 },
      { t: 19.5, event: 16880, typical: 11380 },
      { t: 20.0, event: 17120, typical: 11260 },
      { t: 20.5, event: 16840, typical: 10820 },
      { t: 21.0, event: 16180, typical: 10140 },
      { t: 21.5, event: 15240, typical: 9420 },
      { t: 22.0, event: 14120, typical: 8680 },
    ],
    xLabels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"],
  },

  playersClub: {
    newMembers: 425,
    firstTimeShare: 35,
    existingShare: 65,
  },

  promo: {
    distributed: 10000,
    redemptionRate: 92,
    additionalCoinIn: 38000,
  },

  nonGaming: [
    { label: "Restaurant traffic", value: "+15%", note: "Increase during the event" },
    { label: "Hotel reservations", value: "122", note: "Associated with the activation" },
  ],

  onProperty: [
    {
      label: "Event attendance & foot traffic",
      value: "1,500–2,000 guests",
      note: "Overall property visitation +11% vs. a typical Saturday",
    },
    {
      label: "Table-game revenue",
      value: "+18%",
      note: "During activation hours vs. an average Saturday in the same window",
    },
    {
      label: "New Players Club members",
      value: "425",
      note: "Registered during the event",
    },
    {
      label: "First-time visitors",
      value: "35%",
      note: "Of surveyed attendees visiting the property for the first time",
    },
    {
      label: "Out-of-market visitors",
      value: "40%",
      note: "Traveled more than 50 miles specifically for the activation",
    },
    {
      label: "Guest satisfaction",
      value: "Overwhelmingly positive",
      note: "Strong fan engagement · no significant operational or security issues reported",
    },
  ],

  originStates: [
    { code: "AZ", name: "Arizona", share: 48.2 },
    { code: "CA", name: "California", share: 14.1 },
    { code: "TX", name: "Texas", share: 6.3 },
    { code: "NV", name: "Nevada", share: 5.1 },
    { code: "CO", name: "Colorado", share: 3.8 },
  ],

  audienceCountries: [
    { name: "United States", share: 58 },
    { name: "Philippines", share: 11.7 },
    { name: "Canada", share: 3.1 },
    { name: "Thailand", share: 2.9 },
    { name: "Malaysia", share: 2.6 },
  ],

  /** Team social scale that powers activations (measured channels). */
  exposure: {
    label: "Social performance · team",
    note: "Bluff · Brettski · On Tilt — the reach that turns a property visit into lasting exposure",
    lifetimeViews: 779811159,
    watchHours: 57544022,
    longformHours: 30600000,
    shortformHours: 27000000,
    platforms: [
      {
        name: "YouTube",
        posts: 602,
        views: 135179301,
        actions: 3999000,
        avgViews: 224550,
        engagement: 2.96,
      },
      {
        name: "Instagram",
        posts: 619,
        views: 172248208,
        actions: 5329000,
        avgViews: 278268,
        engagement: 3.09,
      },
      {
        name: "Facebook",
        posts: 821,
        views: 49954800,
        actions: 1935000,
        avgViews: 60846,
        engagement: 3.87,
      },
    ],
  },

  /** Catalog highlights that demonstrate casino-content scale (not event-day uploads). */
  topContent: [
    {
      title: "$6900 blackjack hand...",
      date: "Jun 15, 2026",
      views: 109300000,
      watchHours: 1400000,
      avgView: "47s",
    },
    {
      title: "I Turned My Paycheck Into $300,000",
      date: "Oct 3, 2025",
      views: 1480000,
      watchHours: 715700,
      avgView: "29m 18s",
    },
    {
      title: "We Gambled $100,000 For 500,000 Subscribers!",
      date: "Jul 28, 2025",
      views: 1170000,
      watchHours: 572800,
      avgView: "29m 32s",
    },
    {
      title: "The BIGGEST Gambling Wins of 2025!!",
      date: "Dec 27, 2025",
      views: 409200,
      watchHours: 490800,
      avgView: "1h 12m",
    },
    {
      title: "I Gambled 12 Hours Non-Stop In Vegas",
      date: "Jun 30, 2025",
      views: 513500,
      watchHours: 483900,
      avgView: "56m 43s",
    },
  ],

  testimonial: {
    quote:
      "The BLUFF activation exceeded our expectations for fan engagement and content opportunities. We would welcome another collaboration.",
    attribution: "Gila River Wild Horse Pass",
  },

  takeaways: [
    "Builds a loyal and engaged audience",
    "Drives measurable business results",
    "Brings new customers to property",
    "A valuable long-term partner",
  ],

  itinerary: {
    title: "A typical casino activation itinerary",
    lead:
      "A sample itinerary based on previous successful activations, designed to bring creators and fans together for an exciting on-property experience while capturing engaging casino content.",
    note:
      "Sample itinerary only. Timing, gaming activities, filming, and fan experiences are flexible and subject to property approval.",
    steps: [
      {
        title: "Team Arrival",
        copy: "Arrive the evening before or early morning of activation day. Check in at the property.",
      },
      {
        title: "Team Dinner (Optional)",
        copy: "Dinner at an on-property restaurant on the day of arrival or the evening following the activation, when available.",
      },
      {
        title: "10:00 AM · Private Meet & Greet and Event Walkthrough",
        copy: "Exclusive fan experience for up to 20 guests, if applicable. Followed by walkthrough, credentials, and a filming path signed off with security.",
      },
      {
        title: "11:00 AM · Team Lunch",
        copy: "Team breaks for lunch ahead of the main activation — typically off property, but not required.",
      },
      {
        title: "12:45 PM · Grand Entrance",
        copy: "Full creator team makes a coordinated entrance onto the casino floor.",
      },
      {
        title: "1:00–3:00 PM · Main Fan Activation",
        copy: "Play craps with fans at a designated table for approximately 1–2 hours, distribute promotional free-play chips, interact with fans, and film content.",
      },
      {
        title: "Fan Session Wrap-Up",
        copy: "Conclude the scheduled fan gaming session and final interactions.",
      },
      {
        title: "Private Team Break · Approx. 1 Hour",
        copy: "Team moves to a secure location to allow fans to disperse.",
      },
      {
        title: "Additional Casino Play & Filming",
        copy: "Team returns to the casino floor for high-limit slots and/or table games, capturing additional long-form and short-form content.",
      },
      {
        title: "Wrap-Up & Departure",
        copy: "Complete filming and depart for the next tour destination.",
      },
      {
        title: "Social Posts",
        copy: "Posts during and after the visit, counted by platform.",
      },
      {
        title: "Follow-up",
        copy: "Views at 7, 30, 60, and 90 days. Report each property, then the full tour.",
      },
    ],
  },
};
