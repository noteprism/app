import { Suspense } from 'react';
import CheckoutSuccessClient from './checkout-success-client';

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