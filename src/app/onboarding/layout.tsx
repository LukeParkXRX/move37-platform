import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
