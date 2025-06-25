import type { Metadata } from "next"
import { PricingPageContent } from "@/components/pricing-page";

export const metadata: Metadata = {
  title: "Noteprism - Pricing",
  description: "Subscribe to Noteprism Pro and unlock all features",
}

export default function PricingPage() {
  return <PricingPageContent />;
} 