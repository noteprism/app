"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingTable() {
  const router = useRouter();

  const handleStartTrial = () => {
    router.push('/connect?intent=trial');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#101113] relative overflow-hidden">
      <div className="relative mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-center">Noteprism</h1>
        <p className="text-muted-foreground text-center mt-2">Your organized workspace</p>
      </div>
      
      {/* Single Premium Plan with Trial */}
      <div className="z-10 w-full max-w-md">
        <div className="bg-[#18191A] p-8 rounded-lg border border-[#232425] shadow-sm flex flex-col items-center relative">
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">7-DAY FREE TRIAL</div>
          <div className="mb-4 mt-4">
            <img src="/mark.png" alt="Premium plan" className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Noteprism Pro</h2>
          <p className="mb-4 text-center">Unlock your full productivity potential with our premium features. Try it free for 7 days.</p>
          <div className="text-4xl font-bold mb-2">$5<span className="text-base font-normal"> per month</span></div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded mt-4 mb-4"
            onClick={handleStartTrial}
          >
            Get Started
          </button>
          <div className="w-full mt-2">
            <div className="font-semibold mb-2">This includes:</div>
            <ul className="list-none space-y-2 text-sm">
              <li>✔ Unlimited Notes</li>
              <li>✔ Search All Notes</li>
              <li>✔ Cancel anytime</li>
              <li>✔ No credit card required to start</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 