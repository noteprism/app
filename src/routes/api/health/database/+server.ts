import { json } from '@sveltejs/kit';
import { checkDatabaseHealth } from '$lib/server/health';

export async function GET() {
    const health = await checkDatabaseHealth();
    return json(health);
} 