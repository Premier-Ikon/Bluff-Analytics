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
  title: "Team summary · Bluff, Brettski, On Tilt Boys",
  description: "Combined value of Bluff, Brettski, and On Tilt Boys — team reach and potential property impact for MGM.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Team summary · Bluff, Brettski, On Tilt Boys",
    description: "Combined value of Bluff, Brettski, and On Tilt Boys — team reach and potential property impact for MGM.",
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
    title: "Team summary · Bluff, Brettski, On Tilt Boys",
    description: "Combined value of Bluff, Brettski, and On Tilt Boys — team reach and potential property impact for MGM.",
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
