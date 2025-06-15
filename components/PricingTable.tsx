"use client"
import { useState } from "react";
import ConnectForm from "@/components/ConnectForm";
import { useRouter } from "next/navigation";

export default function PricingTable() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "standard" | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const router = useRouter();

  // Called by ConnectForm after successful login/signup
  const handleAuthSuccess = async () => {
    if (selectedPlan === "standard") {
      router.push("/?upgrade=1");
    } else {
      router.refresh();
    }
  };

  // Set upgrade intent via URL parameter for OAuth
  const handleOAuthIntent = (plan: "free" | "standard") => {
    // No need to do anything here anymore
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#101113] relative overflow-hidden">
      <div className="relative mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-center">Noteprism</h1>
        <p className="text-muted-foreground text-center mt-2">Your organized workspace</p>
      </div>
      <div className="flex gap-8 z-10">
        {/* Free Plan */}
        <div className={`bg-[#101113] p-8 rounded-lg border border-[#232425] shadow-sm w-80 flex flex-col items-center ${selectedPlan === "free" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setSelectedPlan("free")}
          style={{ cursor: "pointer" }}
        >
          <div className="mb-4">
            <img src="/mark-bw.png" alt="Free plan" className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Free</h2>
          <p className="mb-4 text-center">This plan allows a single professional to adopt your tool for their work, creating an entry point into a business.</p>
          <div className="text-4xl font-bold mb-2">$0<span className="text-base font-normal"> per month</span></div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded mt-4 mb-4"
            onClick={e => {
              e.stopPropagation();
              setSelectedPlan("free");
              setShowAuthForm(true);
            }}
          >
            Subscribe
          </button>
          <div className="w-full mt-2">
            <div className="font-semibold mb-2">This includes:</div>
            <ul className="list-none space-y-2 text-sm">
              <li>✔ Unlimited Notes</li>
              <li>✔ Search All Notes</li>
              <li>✔ 1 Board</li>
            </ul>
          </div>
        </div>
        {/* Standard Plan */}
        <div className={`bg-[#18191A] p-8 rounded-lg border border-[#232425] shadow-sm w-80 flex flex-col items-center relative ${selectedPlan === "standard" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setSelectedPlan("standard")}
          style={{ cursor: "pointer" }}
        >
          <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs px-3 py-1 rounded-full">Most popular</div>
          <div className="mb-4 mt-4">
            <img src="/mark.png" alt="Standard plan" className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Standard</h2>
          <p className="mb-4 text-center">This plan is built for the advanced professional who wants to unlock their full productivity with unlimited space and intelligent tools.</p>
          <div className="text-4xl font-bold mb-2">$5<span className="text-base font-normal"> per month</span></div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded mt-4 mb-4"
            onClick={e => {
              e.stopPropagation();
              setSelectedPlan("standard");
              setShowAuthForm(true);
            }}
          >
            Subscribe
          </button>
          <div className="w-full mt-2">
            <div className="font-semibold mb-2">This includes:</div>
            <ul className="list-none space-y-2 text-sm">
              <li>✔ Unlimited Notes</li>
              <li>✔ Search All Notes</li>
              <li>✔ Unlimited Boards</li>
              <li>✔ AI Suite - The Prism Engine</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Show ConnectForm only after a plan is selected and Subscribe is clicked */}
      {showAuthForm && selectedPlan && (
        <div className="relative z-10 mt-8 w-full max-w-md">
          <ConnectForm onSuccess={handleAuthSuccess} onOAuthIntent={() => handleOAuthIntent(selectedPlan)} />
        </div>
      )}
    </div>
  );
} 