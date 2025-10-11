import type { Metadata } from "next";
import "@/styles/globals.css";
import ClientLayout from "@/components/layout/client-layout";

export const metadata: Metadata = {
  title: "Shirleys Food",
  description: "Premium West African food products and ingredients",
  icons: {
    icon: [
      {
        url: "/image/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/image/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/image/favicon_io/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/image/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/image/favicon_io/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/image/favicon_io/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/image/favicon_io/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
