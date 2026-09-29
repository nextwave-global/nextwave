import type { Metadata } from "next";
import ApplyClient from "./ApplyClient";

export const metadata: Metadata = {
  title: "Apply for the Free Class | NextWave Academy",
  description:
    "Apply to join our free skill class. Choose your track, tell us about yourself, and get ready to learn.",
};

export default function ApplyPage() {
  return <ApplyClient />;
}
