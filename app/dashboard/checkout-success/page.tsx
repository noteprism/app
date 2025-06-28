import { Suspense } from 'react';

function CheckoutSuccessClient() {
  return <div>Loading checkout success...</div>;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    }>
      <CheckoutSuccessClient />
    </Suspense>
  );
}