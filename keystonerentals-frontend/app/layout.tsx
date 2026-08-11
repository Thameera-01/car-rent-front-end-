import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Footer එක Import කිරීම

export const metadata: Metadata = {
  title: "KeystoneRentals",
  description: "Premium car rental service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children} {/* මෙතනට page.tsx හි ඇති අන්තර්ගතය පැමිණේ */}
        <Footer /> {/* හැම පිටුවකටම යටින්ම Footer එක එනවා */}
      </body>
    </html>
  );
}