import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIRO Badminton Reservation",
  description: "Sporty & clean badminton court booking web app"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
