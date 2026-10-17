import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Walter AI — Your Voice. Your Walter. Always There.",
  description:
    "Walter AI is a personalized AI telephone assistant that answers incoming calls on your behalf, talks naturally with callers, handles routine questions, and lets you manage everything through a secure dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
