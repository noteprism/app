"use client"

import Script from 'next/script';
import { useRouter } from 'next/navigation';

export function PricingPageContent() {
  const router = useRouter();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#101113] relative overflow-hidden">
      <div className="relative mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-center">Noteprism</h1>
        <p className="text-muted-foreground text-center mt-2">Your organized workspace</p>
      </div>
      
      <div className="z-10 w-full max-w-3xl">
        <div className="bg-[#18191A] p-8 rounded-lg border border-[#232425] shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Choose Your Plan
          </h2>
          
          <div className="mb-6">
            <Script async src="https://js.stripe.com/v3/pricing-table.js" />
            <div 
              dangerouslySetInnerHTML={{
                __html: `
                  <stripe-pricing-table 
                    pricing-table-id="prctbl_1RdjoJK0jvA0kTsfdYRPmSfV"
                    publishable-key="pk_live_51RZEtQK0jvA0kTsfNvs1AXz9zwwIqSPFm95eg9zKYqQLIak1Dv4s3aMZz1BpnWBDbpnP3Ne0EQ1GQjYt8iT9wxqm00ctQZpqbn">
                  </stripe-pricing-table>
                `
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 