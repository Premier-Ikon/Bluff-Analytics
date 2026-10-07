"use client";

import PartnerPage from "../PartnerPage";
import { partners } from "../../data/partners";

export default function Page() {
  return <PartnerPage partner={partners.ontilt} />;
}
