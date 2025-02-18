import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from './components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kohepets Expo",
  description: "Find the best deals for your pets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="max-w-xl mx-auto px-4">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
