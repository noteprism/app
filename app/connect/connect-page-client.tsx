"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ConnectForm from "@/components/ConnectForm";

export default function ConnectPageClient() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  const handleGoogleConnect = () => {
    setGoogleLoading(true);
    window.location.href = "/api/auth/google/login";
  };

  const handleLinkedinConnect = () => {
    setLinkedinLoading(true);
    window.location.href = "/api/auth/linkedin/login";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#101113] relative overflow-hidden">
      <div className="relative mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-center">Noteprism</h1>
        <p className="text-muted-foreground text-center mt-2">Your organized workspace</p>
      </div>
      
      <div className="z-10 w-full max-w-md">
        <div className="bg-[#18191A] p-8 rounded-lg border border-[#232425] shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Connect to Noteprism
          </h2>
          
          <div className="flex flex-col space-y-3 mb-6">
            <Button
              onClick={handleGoogleConnect}
              disabled={googleLoading}
              className="w-full bg-white text-black py-2 px-4 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                  Connect with Google
                </>
              )}
            </Button>
            
            <Button
              onClick={handleLinkedinConnect}
              disabled={linkedinLoading}
              className="w-full bg-[#0077B5] text-white py-2 px-4 rounded flex items-center justify-center hover:bg-[#005885] transition-colors"
            >
              {linkedinLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  Connect with LinkedIn
                </>
              )}
            </Button>
          </div>
          
          <ConnectForm onSuccess="/dashboard" />
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>After connecting, you'll be directed to subscribe to Noteprism.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 