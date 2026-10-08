"use client";

import PartnerPage from "../PartnerPage";
import { report } from "../../data/report";
import { studio } from "../../data/studio";

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

const bluff = {
  slug: "bluff",
  name: "Bluff",
  handle: report.channel.handle,
  url: report.channel.url,
  since: "January 2009",
  through: "October 7, 2026",
  subscribers: report.channel.subscribers,
  views: studio.views,
  videos: report.totals.videos,
  shorts: report.totals.shorts,
  watchHours: studio.watchHours,
  watchYears: studio.watchYears,
  watchMeasured: true,
  studioMonths: studio.months,
  years: studio.years,
  properties,
  propertyNote: "the description says the shoot happened there",
  top: studio.topByWatchTime,
};

export default function Page() {
  return <PartnerPage partner={bluff} />;
}
