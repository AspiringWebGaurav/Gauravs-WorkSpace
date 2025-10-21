"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {/* Hide navbar on desktop for homepage only */}
      <div className={isHomePage ? "lg:hidden" : ""}>
        <Navbar />
      </div>
      {children}
      {/* Hide footer on desktop for homepage only */}
      <div className={isHomePage ? "lg:hidden" : ""}>
        <Footer />
      </div>
    </>
  );
}
