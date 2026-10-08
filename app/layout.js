import { Montserrat } from "next/font/google";
import ChannelNav from "./ChannelNav";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Partnership brief",
  description: "Verified YouTube results for Bluff, Brettski, and On Tilt Boys, with open cells for property results.",
  icons: {
    icon: "/favicon.ico",
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
