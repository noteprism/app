import { cookies } from 'next/headers';

const UPGRADE_COOKIE = 'noteprism_upgrade_intent';

export async function setUpgradeIntentCookie() {
  const c = await cookies();
  c.set(UPGRADE_COOKIE, '1', {
    path: '/',
    httpOnly: false, // must be accessible to client-side for OAuth redirect
    sameSite: 'lax',
  });
}

export async function clearUpgradeIntentCookie() {
  const c = await cookies();
  c.delete(UPGRADE_COOKIE);
}

export async function hasUpgradeIntentCookie() {
  const c = await cookies();
  return c.get(UPGRADE_COOKIE)?.value === '1';
} 