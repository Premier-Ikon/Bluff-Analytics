import { Montserrat } from "next/font/google";
import ChannelNav from "./ChannelNav";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://partnerships.gotbluff.com"),
  title: "Partnership brief",
  description: "Verified YouTube results for Bluff, Brettski, and On Tilt Boys, with open cells for property results.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Partnership brief",
    description: "Verified YouTube results for Bluff, Brettski, and On Tilt Boys, with open cells for property results.",
    url: "https://partnerships.gotbluff.com",
    siteName: "Bluff",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bluff",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partnership brief",
    description: "Verified YouTube results for Bluff, Brettski, and On Tilt Boys, with open cells for property results.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ChannelNav />
        {children}
      </body>
    </html>
  );
}
