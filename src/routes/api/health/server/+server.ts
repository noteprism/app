import { json } from '@sveltejs/kit';
import { checkServerHealth } from '$lib/server/health';

export async function GET() {
    const health = await checkServerHealth();
    return json(health);
} 